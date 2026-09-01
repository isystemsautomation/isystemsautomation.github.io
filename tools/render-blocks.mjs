#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MANIFEST_PATH = path.join(ROOT, 'src/assets/img/_manifest.json');
const IMAGE_MANIFEST = fs.existsSync(MANIFEST_PATH)
  ? JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'))
  : {};

const JOOMSHAPER = /joomshaper\.com/i;
const BUTTON_TEXTS = new Set(['View Details', 'Learn More']);

const INDEX_CAROUSEL_HERO = [
  '/assets/img/projects/control-room-combined-cycle-hero.jpg',
  '/assets/img/2024/08/09/carousel2-hero.jpg',
  '/assets/img/2024/08/09/carousel3-hero.jpg',
];

const INDEX_CAROUSEL_FIGURES = [
  '/assets/img/projects/control-room-combined-cycle.jpg',
  '/assets/img/2024/08/09/carousel2.jpg',
  '/assets/img/2024/08/09/carousel3.jpg',
];

export function mapImagePath(src) {
  if (!src) return src;
  if (src.startsWith('/images/')) {
    return src.replace('/images/', '/assets/img/');
  }
  return src;
}

export function stripInlineStyles(html) {
  if (!html) return '';
  const $ = cheerio.load(`<div>${html}</div>`, { decodeEntities: false }, false);
  $('[style]').removeAttr('style');
  return $('div').html() ?? '';
}

export function heroTitleFromPageTitle(title) {
  return title.replace(/\s*[—–-]\s*ISYSTEMS AUTOMATION\s*$/i, '').trim();
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatHeadingText(text) {
  return text.replace(/:([A-Za-z])/g, ': $1');
}

function headingTag(level, text, sectionTitle = false) {
  const tag = `h${Math.min(Math.max(level, 2), 4)}`;
  const cls = sectionTitle && level <= 2 ? ' class="section-title"' : '';
  return `<${tag}${cls}>${escapeHtml(formatHeadingText(text))}</${tag}>`;
}

function renderParagraph(html) {
  const cleaned = stripInlineStyles(html);
  if (!cleaned.replace(/<[^>]+>/g, '').trim()) return '';
  return `<p>${cleaned}</p>`;
}

function renderLink(href, text) {
  if (!href || href === '#') {
    if (BUTTON_TEXTS.has(text)) {
      return `<span class="btn btn--primary">${escapeHtml(text)}</span>`;
    }
    return `<a href="#">${escapeHtml(text)}</a>`;
  }
  const cls = BUTTON_TEXTS.has(text) ? ' class="btn btn--primary"' : '';
  return `<a href="${escapeHtml(href)}"${cls}>${escapeHtml(text)}</a>`;
}

function imageDims(src) {
  const mapped = mapImagePath(src);
  return IMAGE_MANIFEST[mapped] ?? { width: 800, height: 600 };
}

function isSchematic(block) {
  if (block.schematic) return true;
  const src = block.src ?? '';
  return /ovation-control-loop|virtual-power-plant|schematic|control-loop|diagram/i.test(src);
}

function renderImage(block, lazy = true) {
  let href = block.href;
  if (href && JOOMSHAPER.test(href)) {
    href = null;
  }

  const src = mapImagePath(block.src);
  const { width, height } = imageDims(src);
  const alt = escapeHtml(block.alt ?? '');
  const loading = lazy ? ' loading="lazy" decoding="async"' : ' fetchpriority="high" decoding="async"';
  const schematic = isSchematic(block);
  const figureAttr = schematic ? ' class="figure--schematic"' : '';
  const img = `<img src="${escapeHtml(src)}" alt="${alt}" width="${width}" height="${height}"${loading}>`;

  if (schematic) {
    const fullHref = escapeHtml(mapImagePath(block.href) || src);
    const label = block.alt ?? 'Schematic';
    const caption = `<figcaption>${escapeHtml(label)} — <a href="${fullHref}">Open full size</a></figcaption>`;
    return `<figure${figureAttr}><a href="${fullHref}">${img}</a>${caption}</figure>`;
  }

  const caption = block.alt ? `<figcaption>${escapeHtml(block.alt)}</figcaption>` : '';

  if (href) {
    return `<figure${figureAttr}><a href="${escapeHtml(mapImagePath(href))}">${img}</a>${caption}</figure>`;
  }
  return `<figure${figureAttr}>${img}${caption}</figure>`;
}

function renderList(block) {
  const tag = block.ordered ? 'ol' : 'ul';
  const items = block.items
    .map((item) => {
      const html = stripInlineStyles(item.html);
      if (/^<a\b/i.test(html.trim())) {
        return `<li>${html}</li>`;
      }
      return `<li>${html}</li>`;
    })
    .join('\n');
  return `<${tag}>\n${items}\n</${tag}>`;
}

function renderTable(html) {
  const $ = cheerio.load(html, { decodeEntities: false });
  const table = $('table').first();
  if (!table.length) return html;

  table.removeAttr('class').addClass('table');
  if (!table.find('thead').length) {
    const firstRow = table.find('tr').first();
    if (firstRow.length && firstRow.find('th').length) {
      firstRow.wrap('<thead></thead>');
    } else if (firstRow.length) {
      const headers = firstRow
        .find('td')
        .map((_, td) => `<th>${$(td).html()}</th>`)
        .get()
        .join('');
      firstRow.remove();
      table.prepend(`<thead><tr>${headers}</tr></thead>`);
    }
  }
  if (!table.find('tbody').length) {
    const bodyRows = table.find('tr').not('thead tr');
    bodyRows.wrapAll('<tbody></tbody>');
  }

  return `<div class="table-scroll">${$.html(table)}</div>`;
}

function renderBlock(block, options = {}) {
  switch (block.type) {
    case 'heading':
      return headingTag(block.level, block.text, options.sectionTitle);
    case 'paragraph':
      return renderParagraph(block.html);
    case 'link':
      return renderLink(block.href, block.text);
    case 'image':
      return renderImage(block, options.lazyImages !== false);
    case 'list':
      return renderList(block);
    case 'table':
      return renderTable(block.html);
    case 'raw_html':
      return stripInlineStyles(block.html);
    default:
      return '';
  }
}

function renderBlocksWithGallery(blocks, options = {}) {
  const parts = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];
    if (block.type === 'image') {
      const run = [];
      while (i < blocks.length && blocks[i].type === 'image') {
        run.push(blocks[i]);
        i += 1;
      }
      if (run.length >= 2) {
        const inner = run
          .map((img) => renderImage(img, options.lazyImages !== false))
          .join('\n');
        parts.push(`<div class="gallery">\n${inner}\n</div>`);
      } else {
        parts.push(renderImage(run[0], options.lazyImages !== false));
      }
      continue;
    }
    parts.push(
      renderBlock(block, {
        ...options,
        sectionTitle: block.type === 'heading' && block.level === 2,
      }),
    );
    i += 1;
  }

  return parts.filter(Boolean).join('\n');
}

function renderBlocks(blocks, options = {}) {
  return renderBlocksWithGallery(blocks, options);
}

function splitIndexCarousel(blocks) {
  const carouselBlocks = [];
  const rest = [];
  let i = 0;

  while (i < blocks.length && blocks[i].type !== 'section') {
    carouselBlocks.push(blocks[i]);
    i += 1;
  }

  const slides = [];
  let current = [];
  for (const block of carouselBlocks) {
    if (block.type === 'heading' && block.level === 2 && current.length) {
      slides.push(current);
      current = [block];
    } else {
      current.push(block);
    }
  }
  if (current.length) slides.push(current);

  while (i < blocks.length) {
    rest.push(blocks[i]);
    i += 1;
  }

  return { slides, rest };
}

function renderHeroSection(title, innerHtml, imageSrc = null, extraClass = 'hero') {
  const dims = imageSrc ? imageDims(imageSrc) : null;
  const imgTag = imageSrc
    ? `<img src="${escapeHtml(imageSrc)}" alt="" width="${dims.width}" height="${dims.height}" fetchpriority="high" decoding="async">`
    : '';
  return `<section class="section section--flush ${extraClass}">${imgTag}<div class="container prose"><h1>${escapeHtml(title)}</h1>${innerHtml}</div></section>`;
}

function carouselHeroPath(index) {
  return INDEX_CAROUSEL_HERO[index] ?? INDEX_CAROUSEL_HERO[0];
}

function carouselFigurePath(index) {
  return INDEX_CAROUSEL_FIGURES[index] ?? INDEX_CAROUSEL_FIGURES[0];
}

function carouselImageBlock(index, alt) {
  const assetPath = carouselFigurePath(index);
  return {
    type: 'image',
    src: assetPath.replace('/assets/img/', '/images/'),
    alt,
    href: null,
  };
}

function renderIndexCarousels(slides) {
  let html = '';

  slides.forEach((slideBlocks, index) => {
    const heading = slideBlocks.find((b) => b.type === 'heading');
    const title = heading?.text ?? '';
    const bodyBlocks = slideBlocks.filter((b) => b !== heading);
    const body = bodyBlocks
      .map((b) => renderBlock(b, { lazyImages: index > 0 }))
      .filter(Boolean)
      .join('\n');

    if (index === 0) {
      html += renderHeroSection(title, body, carouselHeroPath(0), 'hero');
      return;
    }

    const figure = renderImage(carouselImageBlock(index, title), true);
    html += `<section class="section"><div class="container prose"><h2 class="section-title">${escapeHtml(formatHeadingText(title))}</h2>\n${figure}\n${body}</div></section>`;
  });

  return html;
}

function renderContactPage(blocks, pageTitle) {
  const title = heroTitleFromPageTitle(pageTitle);
  let html = renderHeroSection(title, '', null, 'page-hero');

  const flat = [];
  for (const block of blocks) {
    if (block.type === 'section') {
      flat.push(...block.blocks);
    } else {
      flat.push(block);
    }
  }

  const companyLines = [];
  const contactLines = [];
  let inEmail = false;
  let inPhone = false;

  for (const block of flat) {
    if (block.type === 'heading' && block.level === 2 && block.text === 'Contact') {
      continue;
    }
    if (block.type === 'heading' && block.level === 6) {
      if (block.text === 'E-mail') {
        contactLines.push('<h3>E-mail</h3>');
        inEmail = true;
        inPhone = false;
        continue;
      }
      if (block.text === 'Phone') {
        contactLines.push('<h3>Phone</h3>');
        inPhone = true;
        inEmail = false;
        continue;
      }
      inEmail = false;
      inPhone = false;
      if (/^\+?\d/.test(block.text)) {
        contactLines.push(`<p><a href="tel:${block.text.replace(/\s/g, '')}">${escapeHtml(block.text)}</a></p>`);
      } else {
        companyLines.push(`<p>${escapeHtml(block.text)}</p>`);
      }
      continue;
    }
    if (block.type === 'paragraph' && inEmail) {
      contactLines.push(renderParagraph(block.html));
      inEmail = false;
      continue;
    }
    if (block.type === 'paragraph') {
      companyLines.push(renderParagraph(block.html));
    }
  }

  html += `<section class="section"><div class="container prose"><div class="contact-grid"><div>${companyLines.join('\n')}</div><div>${contactLines.join('\n')}</div></div></div></section>`;
  return html;
}

function shouldSkipHeading(block, pageTitle, seenTitle) {
  if (block.type !== 'heading') return false;
  const hero = heroTitleFromPageTitle(pageTitle);
  return !seenTitle && (block.text === hero || block.level === 2);
}

function renderSection(section, tint, pageTitle, seenTitleRef) {
  const sectionTitle = section.title;
  const inner = renderBlocksWithGallery(
    section.blocks.filter((block) => {
      if (shouldSkipHeading(block, pageTitle, seenTitleRef.value) && block.level <= 2) {
        if (block.text === heroTitleFromPageTitle(pageTitle) || block.text === sectionTitle) {
          seenTitleRef.value = true;
          return false;
        }
      }
      return true;
    }),
    {
      lazyImages: true,
      sectionTitle: false,
    },
  );

  if (!inner.trim()) return '';
  const cls = tint ? 'section section--tint' : 'section';
  return `<section class="${cls}"><div class="container prose">${inner}</div></section>`;
}

export function renderPageContent({ slug, blocks, title }) {
  if (slug === 'contact') {
    return renderContactPage(blocks, title);
  }

  if (slug === 'index') {
    const { slides, rest } = splitIndexCarousel(blocks);
    let html = renderIndexCarousels(slides);
    let tint = false;
    const seenTitleRef = { value: true };
    for (const block of rest) {
      if (block.type === 'section') {
        html += renderSection(block, tint, title, seenTitleRef);
        tint = !tint;
      } else {
        html += `<section class="section${tint ? ' section--tint' : ''}"><div class="container prose">${renderBlock(block)}</div></section>`;
        tint = !tint;
      }
    }
    return html;
  }

  const hero = heroTitleFromPageTitle(title);
  let html = renderHeroSection(hero, '', null, 'page-hero');
  let tint = false;
  const seenTitleRef = { value: false };

  for (const block of blocks) {
    if (block.type === 'section') {
      html += renderSection(block, tint, title, seenTitleRef);
      tint = !tint;
    } else {
      if (shouldSkipHeading(block, title, seenTitleRef.value) && block.level <= 2) {
        seenTitleRef.value = true;
        continue;
      }
      html += `<section class="section${tint ? ' section--tint' : ''}"><div class="container prose">${renderBlock(block)}</div></section>`;
      tint = !tint;
    }
  }

  return html;
}
