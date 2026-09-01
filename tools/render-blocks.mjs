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

const TOP_LEVEL_SECTION_HEADINGS = new Set([
  'Our Services',
  'What We Do',
  'Latest news and stories',
]);

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

function loadServiceBlurbs() {
  const blurbs = new Map();
  const servicePath = path.join(ROOT, 'content/service.json');
  if (!fs.existsSync(servicePath)) return blurbs;

  const data = JSON.parse(fs.readFileSync(servicePath, 'utf8'));
  for (const section of data.blocks ?? []) {
    if (section.type !== 'section') continue;

    let linkHref = null;
    let paragraph = null;
    let seenImage = false;
    let headingCount = 0;

    for (const b of section.blocks ?? []) {
      if (b.type === 'image') seenImage = true;
      if (b.type === 'heading' && b.level === 3) headingCount += 1;
      if (b.type === 'paragraph' && seenImage && headingCount >= 1 && !paragraph) {
        paragraph = b.html;
      }
      if (b.type === 'link' && b.href?.startsWith('/service/')) {
        linkHref = b.href;
      }
    }

    if (linkHref && paragraph) {
      blurbs.set(linkHref, { paragraph, link: linkHref });
    }
    const serviceTitle = section.blocks?.find(
      (b) => b.type === 'heading' && b.level === 3,
    )?.text;
    if (serviceTitle && paragraph) {
      const link = hrefFromServiceTitle(serviceTitle) ?? linkHref;
      blurbs.set(`title:${serviceTitle}`, { paragraph, link });
      if (link) blurbs.set(link, { paragraph, link });
    }
  }

  return blurbs;
}

function hrefFromServiceTitle(title) {
  const map = {
    'Process Automation': '/service/process-automation.html',
    'Process optimization / Advanced process control':
      '/service/process-optimization-advanced-process-control.html',
    'MES (Manufacturing Execution System)': '/service/manufacturing-execution-system.html',
    'Safety Systems and Burner Management Systems':
      '/service/safety-systems-burner-management-systems.html',
    'Industrial furniture / Control centers':
      '/service/industrial-furniture-control-centers.html',
    Maintenance: '/service/maintenance.html',
  };
  return map[title] ?? null;
}

const SERVICE_BLURBS = loadServiceBlurbs();

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

function sectionTitleHeading(text) {
  return `<h2 class="section-title">${escapeHtml(formatHeadingText(text))}</h2>`;
}

function headingTag(level, text, sectionTitle = false) {
  if (sectionTitle || TOP_LEVEL_SECTION_HEADINGS.has(text)) {
    return sectionTitleHeading(text);
  }
  const tag = `h${Math.min(Math.max(level, 2), 4)}`;
  return `<${tag}>${escapeHtml(formatHeadingText(text))}</${tag}>`;
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

function renderImage(block, lazy = true, compact = false) {
  let href = block.href;
  if (href && JOOMSHAPER.test(href)) {
    href = null;
  }

  const src = mapImagePath(block.src);
  const { width, height } = imageDims(src);
  const alt = escapeHtml(block.alt ?? '');
  const loading = lazy ? ' loading="lazy" decoding="async"' : ' fetchpriority="high" decoding="async"';
  const schematic = isSchematic(block);
  const figureAttr = schematic
    ? ' class="figure--schematic"'
    : compact
      ? ' class="figure--embed"'
      : '';
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

function isSpbTabList(block) {
  if (block.type !== 'list' || block.ordered) return false;
  return (
    block.items.length > 0 &&
    block.items.every((item) => /data-toggle="sppb-tab"/i.test(item.html))
  );
}

function renderList(block) {
  if (isSpbTabList(block)) return '';
  const tag = block.ordered ? 'ol' : 'ul';
  const items = block.items
    .map((item) => {
      const html = stripInlineStyles(item.html);
      return `<li>${html}</li>`;
    })
    .join('\n');
  return `<${tag}>\n${items}\n</${tag}>`;
}

function normalizeRefTable($, table) {
  table.removeAttr('class').addClass('table table--compact');
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
}

function renderTable(html) {
  const $ = cheerio.load(html, { decodeEntities: false });
  const table = $('table').first();
  if (!table.length) return html;

  if (html.includes('isa-ref-table')) {
    normalizeRefTable($, table);
  } else {
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

function enrichServiceCard(card) {
  if (card.body.length > 0) return card;

  let href = card.image?.href;
  if (href && JOOMSHAPER.test(href)) href = null;

  let blurb = href?.startsWith('/service/') ? SERVICE_BLURBS.get(href) : null;
  if (!blurb && card.heading?.text) {
    blurb = SERVICE_BLURBS.get(`title:${card.heading.text}`);
  }
  if (!blurb) return card;

  const link = href ?? blurb.link;
  if (!link) return card;

  return {
    ...card,
    body: [
      { type: 'paragraph', html: blurb.paragraph },
      { type: 'link', href: link, text: 'Learn More' },
    ],
  };
}

function countImageHeadingPairs(blocks, start) {
  let count = 0;
  let k = start;

  while (
    k < blocks.length &&
    blocks[k].type === 'image' &&
    k + 1 < blocks.length &&
    blocks[k + 1].type === 'heading'
  ) {
    count += 1;
    k += 2;
    while (k < blocks.length && blocks[k].type !== 'image') {
      if (blocks[k].type === 'heading' && blocks[k].level <= 2) break;
      k += 1;
    }
  }

  return count;
}

function renderInlinePromoCard(card, options = {}, lazy = true) {
  const enriched = enrichServiceCard(card);
  const figure = renderImage(enriched.image, lazy, true);
  const title = enriched.heading
    ? headingTag(enriched.heading.level ?? 3, enriched.heading.text)
    : '';
  const body = enriched.body
    .map((b) => renderBlock(b, { ...options, lazyImages: lazy }))
    .filter(Boolean)
    .join('\n');

  return `<div class="section-promo__layout section-promo__layout--card">${figure}<div class="section-promo__text">${title}${body}</div></div>`;
}

function renderExpandedCards(cards, options = {}) {
  return cards
    .map((card) => {
      const title = card.heading?.text ?? '';
      const bodyOnly = { ...card, heading: null };
      return `${sectionTitleHeading(title)}${renderInlinePromoCard(bodyOnly, options, options.lazyImages !== false)}`;
    })
    .join('\n');
}

function renderBlocksWithGallery(blocks, options = {}) {
  const parts = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];

    if (
      block.type === 'heading' &&
      block.level === 2 &&
      block.text === 'Featured projects' &&
      i + 1 < blocks.length &&
      blocks[i + 1].type === 'image'
    ) {
      const featured = [];
      let j = i + 1;
      while (j < blocks.length && blocks[j].type === 'image') {
        if (j + 1 >= blocks.length || blocks[j + 1].type !== 'heading') break;
        const card = { image: blocks[j], heading: blocks[j + 1], body: [] };
        j += 2;
        while (
          j < blocks.length &&
          blocks[j].type !== 'image' &&
          !(blocks[j].type === 'heading' && blocks[j].level === 2)
        ) {
          card.body.push(blocks[j]);
          j += 1;
        }
        featured.push(card);
      }
      if (featured.length >= 2) {
        parts.push(sectionTitleHeading(block.text));
        parts.push(renderExpandedCards(featured, options));
        i = j;
        continue;
      }
    }

    if (
      block.type === 'heading' &&
      block.level === 3 &&
      i + 2 < blocks.length &&
      blocks[i + 1].type === 'image' &&
      blocks[i + 2].type === 'heading' &&
      countImageHeadingPairs(blocks, i + 1) === 1
    ) {
      const titleHeading = block;
      const imageBlock = blocks[i + 1];
      const subtitleHeading = blocks[i + 2];
      let j = i + 3;
      const body = [];
      while (j < blocks.length) {
        const next = blocks[j];
        if (next.type === 'image') break;
        if (next.type === 'heading' && next.level === 3) break;
        if (next.type === 'heading' && next.level <= 2) break;
        body.push(next);
        j += 1;
      }
      if (body.length > 0) {
        const figure = renderImage(imageBlock, options.lazyImages !== false, true);
        const text = `${headingTag(subtitleHeading.level, subtitleHeading.text)}${body.map((b) => renderBlock(b, options)).join('\n')}`;
        parts.push(sectionTitleHeading(titleHeading.text));
        parts.push(
          `<div class="section-promo__layout section-promo__layout--lead">${figure}<div class="section-promo__text">${text}</div></div>`,
        );
        i = j;
        continue;
      }
    }

    if (
      block.type === 'image' &&
      i + 1 < blocks.length &&
      blocks[i + 1].type === 'heading' &&
      blocks[i + 1].level >= 3 &&
      countImageHeadingPairs(blocks, i) === 1
    ) {
      const heading = blocks[i + 1];
      let j = i + 2;
      const body = [];
      while (j < blocks.length) {
        const next = blocks[j];
        if (next.type === 'image') break;
        if (next.type === 'heading' && next.level <= 2) break;
        if (next.type === 'heading' && next.level === 3 && body.length > 0) break;
        body.push(next);
        j += 1;
      }
      const hasText = body.some((b) => ['paragraph', 'list', 'link'].includes(b.type));
      if (hasText) {
        const figure = renderImage(block, options.lazyImages !== false, true);
        const text = `${headingTag(heading.level, heading.text)}${body.map((b) => renderBlock(b, options)).join('\n')}`;
        parts.push(
          `<div class="section-promo__layout section-promo__layout--lead">${figure}<div class="section-promo__text">${text}</div></div>`,
        );
        i = j;
        continue;
      }
    }

    if (block.type === 'image') {
      let j = i;
      while (j < blocks.length && blocks[j].type === 'image') j += 1;
      const run = blocks.slice(i, j);
      if (run.length >= 2) {
        parts.push(
          `<div class="gallery">\n${run.map((img) => renderImage(img, options.lazyImages !== false)).join('\n')}\n</div>`,
        );
        i = j;
        continue;
      }
    }

    if (
      block.type === 'image' &&
      i + 1 < blocks.length &&
      blocks[i + 1].type === 'heading'
    ) {
      const cards = [];
      let j = i;
      while (
        j < blocks.length &&
        blocks[j].type === 'image' &&
        j + 1 < blocks.length &&
        blocks[j + 1].type === 'heading'
      ) {
        const card = { image: blocks[j], heading: blocks[j + 1], body: [] };
        j += 2;
        while (
          j < blocks.length &&
          blocks[j].type !== 'image' &&
          !(blocks[j].type === 'heading' && blocks[j].level <= 2)
        ) {
          card.body.push(blocks[j]);
          j += 1;
        }
        cards.push(card);
      }
      if (cards.length >= 2) {
        parts.push(renderExpandedCards(cards, options));
        i = j;
        continue;
      }
    }

    if (
      block.type === 'heading' &&
      block.level >= 3 &&
      i + 1 < blocks.length &&
      blocks[i + 1].type === 'paragraph'
    ) {
      const points = [];
      let j = i;
      while (
        j < blocks.length &&
        blocks[j].type === 'heading' &&
        blocks[j].level >= 3 &&
        j + 1 < blocks.length &&
        blocks[j + 1].type === 'paragraph'
      ) {
        points.push({ heading: blocks[j], paragraph: blocks[j + 1] });
        j += 2;
      }
      if (points.length >= 2) {
        parts.push(
          `<div class="grid grid--2 point-grid">\n${points
            .map(
              (p) =>
                `<div>${headingTag(p.heading.level, p.heading.text)}${renderParagraph(p.paragraph.html)}</div>`,
            )
            .join('\n')}\n</div>`,
        );
        i = j;
        continue;
      }
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

  if (slides.length > 0) {
    const slideBlocks = slides[0];
    const heading = slideBlocks.find((b) => b.type === 'heading');
    const title = heading?.text ?? '';
    const bodyBlocks = slideBlocks.filter((b) => b !== heading);
    const body = bodyBlocks
      .map((b) => renderBlock(b, { lazyImages: false }))
      .filter(Boolean)
      .join('\n');
    html += renderHeroSection(title, body, carouselHeroPath(0), 'hero');
  }

  slides.slice(1).forEach((slideBlocks, promoIndex) => {
    const heading = slideBlocks.find((b) => b.type === 'heading');
    const title = heading?.text ?? '';
    const bodyBlocks = slideBlocks.filter((b) => b !== heading);
    const body = bodyBlocks
      .map((b) => renderBlock(b, { lazyImages: true }))
      .filter(Boolean)
      .join('\n');
    const figure = renderImage(carouselImageBlock(promoIndex + 1, title), true, true);
    html += `<section class="section section-promo"><div class="container prose">${sectionTitleHeading(title)}<div class="section-promo__layout">${figure}<div class="section-promo__text">${body}</div></div></div></section>`;
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

function renderSection(section, tint, pageTitle, seenTitleRef, slug = '') {
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
      slug,
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
    const mergedRest = [];
    for (let ri = 0; ri < rest.length; ri += 1) {
      if (rest[ri].title === 'Latest news and stories' && rest[ri + 1]) {
        rest[ri + 1].blocks = [...rest[ri].blocks, ...rest[ri + 1].blocks];
        continue;
      }
      mergedRest.push(rest[ri]);
    }
    let html = renderIndexCarousels(slides);
    let tint = false;
    const seenTitleRef = { value: true };
    for (const block of mergedRest) {
      if (block.type === 'section') {
        html += renderSection(block, tint, title, seenTitleRef, slug);
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
      html += renderSection(block, tint, title, seenTitleRef, slug);
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
