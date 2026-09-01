#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';
import {
  LEGACY_PAGES,
  legacyPathToSlug,
  legacyPathToUrl,
} from './legacy-pages.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const LEGACY_DIR = path.join(ROOT, 'legacy');
const OUT_DIR = path.join(ROOT, 'content');

const BLOCK_TAGS = new Set([
  'section',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'p',
  'ul',
  'ol',
  'table',
  'figure',
  'blockquote',
  'pre',
  'hr',
  'dl',
]);

const SKIP_TAGS = new Set(['script', 'style', 'noscript']);

function cleanRoot($, root) {
  root.find('script, style, noscript').remove();
}

function innerHtml($, el) {
  const node = $(el);
  const html = node.html();
  if (html == null) return '';
  return html.trim();
}

function textContent($, el) {
  return $(el).text().replace(/\s+/g, ' ').trim();
}

function isEmptyHtml(html) {
  if (!html) return true;
  const stripped = html
    .replace(/<br\s*\/?>/gi, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .trim();
  return stripped.length === 0;
}

function headingLevel(tagName) {
  const match = /^h([1-6])$/i.exec(tagName);
  return match ? Number(match[1]) : null;
}

function extractList($, el) {
  const node = $(el);
  const ordered = node.prop('tagName')?.toLowerCase() === 'ol';
  const items = [];
  node.children('li').each((_, li) => {
    const html = innerHtml($, li);
    if (!isEmptyHtml(html)) {
      items.push({ html });
    }
  });
  if (!items.length) return null;
  return { type: 'list', ordered, items };
}

function extractTable($, el) {
  const html = $.html(el).trim();
  if (!html) return null;
  return { type: 'table', html };
}

function extractImage($, el) {
  const img = $(el);
  const src = img.attr('src')?.trim();
  if (!src) return null;

  const parent = img.parent('a');
  const href = parent.length ? parent.attr('href')?.trim() ?? null : null;

  return {
    type: 'image',
    src,
    alt: img.attr('alt')?.trim() ?? '',
    href,
  };
}

function extractLink($, el) {
  const node = $(el);
  const href = node.attr('href')?.trim();
  if (!href) return null;

  const label = textContent($, el);
  if (!label) return null;

  return {
    type: 'link',
    href,
    text: label,
  };
}

function extractParagraph($, el) {
  const html = innerHtml($, el);
  if (isEmptyHtml(html)) return null;
  return { type: 'paragraph', html };
}

function extractHeading($, el) {
  const tag = $(el).prop('tagName')?.toLowerCase();
  const level = headingLevel(tag ?? '');
  if (!level) return null;

  const text = textContent($, el);
  if (!text) return null;

  return { type: 'heading', level, text };
}

function shouldRecurse($, el) {
  const tag = $(el).prop('tagName')?.toLowerCase();
  if (!tag) return false;
  if (SKIP_TAGS.has(tag)) return false;
  if (BLOCK_TAGS.has(tag)) return false;
  if (tag === 'img') return false;
  if (tag === 'a' && $(el).find('img').length) return false;
  return true;
}

function isButtonLink($, el) {
  const node = $(el);
  const tag = node.prop('tagName')?.toLowerCase();
  if (tag !== 'a') return false;
  if (node.find('img').length) return false;
  const cls = node.attr('class') ?? '';
  return /\bsppb-btn\b/.test(cls) || node.attr('id')?.startsWith('btn-');
}

function extractNode($, el, blocks) {
  const node = $(el);
  const tag = node.prop('tagName')?.toLowerCase();
  if (!tag || SKIP_TAGS.has(tag)) return;

  if (tag === 'section') {
    const sectionBlocks = [];
    node.contents().each((_, child) => {
      if (child.type === 'tag') collectBlocks($, child, sectionBlocks);
    });

    let title = null;
    const titled = sectionBlocks.find(
      (b) => b.type === 'heading' && b.level <= 3,
    );
    if (titled) {
      title = titled.text;
    }

    if (sectionBlocks.length) {
      blocks.push({ type: 'section', title, blocks: sectionBlocks });
    }
    return;
  }

  if (/^h[1-6]$/.test(tag)) {
    const block = extractHeading($, el);
    if (block) blocks.push(block);
    return;
  }

  if (tag === 'p') {
    const block = extractParagraph($, el);
    if (block) blocks.push(block);
    return;
  }

  if (tag === 'ul' || tag === 'ol') {
    const block = extractList($, el);
    if (block) blocks.push(block);
    return;
  }

  if (tag === 'table') {
    const block = extractTable($, el);
    if (block) blocks.push(block);
    return;
  }

  if (tag === 'img') {
    const block = extractImage($, el);
    if (block) blocks.push(block);
    return;
  }

  if (tag === 'a') {
    if (node.find('img').length) {
      node.find('img').each((_, img) => {
        const block = extractImage($, img);
        if (block) blocks.push(block);
      });
      return;
    }
    if (isButtonLink($, el)) {
      const block = extractLink($, el);
      if (block) blocks.push(block);
      return;
    }
    // Inline links inside paragraphs are preserved in paragraph html.
    return;
  }

  if (tag === 'br') return;

  // Leaf-ish wrappers with direct text/HTML worth preserving.
  if (
    (tag === 'div' || tag === 'span') &&
    node.children().length === 0 &&
    !isEmptyHtml(innerHtml($, el))
  ) {
    blocks.push({ type: 'raw_html', html: $.html(el) });
    return;
  }

  node.contents().each((_, child) => {
    if (child.type === 'tag') {
      extractNode($, child, blocks);
    }
  });
}

function collectBlocks($, el, blocks) {
  extractNode($, el, blocks);
}

function mergeAdjacentSections(blocks) {
  return blocks;
}

function extractBlocksFromRoot($, root) {
  const blocks = [];
  root.children().each((_, child) => {
    if (child.type === 'tag') collectBlocks($, child, blocks);
  });
  return mergeAdjacentSections(blocks);
}

function findMainContent($) {
  const selectors = [
    '#sp-main-body #sp-page-builder > .page-content',
    '#sp-page-builder > .page-content',
    '#sp-main-body #sp-page-builder .page-content',
    '#sp-main-body',
  ];

  for (const selector of selectors) {
    const el = $(selector).first();
    if (el.length) return el;
  }
  return null;
}

function extractFooterLegal($) {
  const legal = $('.isa-footer-legal').first();
  if (!legal.length) return null;
  return textContent($, legal);
}

function extractPage(relativePath) {
  const filePath = path.join(LEGACY_DIR, relativePath);
  const html = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(html, { decodeEntities: false });

  const root = findMainContent($);
  if (!root || !root.length) {
    throw new Error('Main content region not found');
  }

  cleanRoot($, root);
  const blocks = extractBlocksFromRoot($, root);
  const footerLegal = extractFooterLegal($);

  return {
    slug: legacyPathToSlug(relativePath),
    source: `legacy/${relativePath}`,
    url: legacyPathToUrl(relativePath),
    blocks,
    ...(footerLegal ? { footerLegal } : {}),
  };
}

fs.mkdirSync(OUT_DIR, { recursive: true });

const created = [];
const errors = [];

for (const page of LEGACY_PAGES) {
  const outName = `${legacyPathToSlug(page)}.json`;
  const outPath = path.join(OUT_DIR, outName);
  try {
    const data = extractPage(page);
    fs.writeFileSync(outPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
    created.push(outName);
    console.log(`OK ${outName} (${data.blocks.length} top-level blocks)`);
  } catch (err) {
    errors.push({ page, error: err.message });
    console.error(`FAIL ${page}: ${err.message}`);
  }
}

console.log(`\nCreated ${created.length} content JSON files in content/`);
if (errors.length) {
  console.error('Errors:', errors);
  process.exitCode = 1;
}
