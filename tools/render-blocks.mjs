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

function isSpbTabList(block) {
  if (block.type !== 'list' || block.ordered) return false;
  return (
    block.items.length > 0 &&
    block.items.every((item) => /data-toggle="sppb-tab"/i.test(item.html))
  );
}

function renderList(block) {
  const tag = block.ordered ? 'ol' : 'ul';
  const items = block.items
    .map((item) => {
      const html = stripInlineStyles(item.html);
      return `<li>${html}</li>`;
    })
    .join('\n');
  const hidden = isSpbTabList(block) ? ' class="visually-hidden"' : '';
  return `<${tag}${hidden}>\n${items}\n</${tag}>`;
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

function refTableDecade(yearText) {
  const match = yearText.match(/(\d{4})/);
  if (!match) return '2007–2009';
  const year = Number.parseInt(match[1], 10);
  if (year >= 2020) return '2020–present';
  if (year >= 2010) return '2010–2019';
  return '2007–2009';
}

function renderRefTableAccordion(html) {
  const $ = cheerio.load(html, { decodeEntities: false });
  const table = $('table').first();
  if (!table.length) return html;

  normalizeRefTable($, table);
  const headerRow = table.find('thead').html() ?? '';
  const groups = new Map();
  table.find('tbody tr').each((_, row) => {
    const year = $(row).find('td').first().text().trim();
    const label = refTableDecade(year);
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label).push($.html(row));
  });

  const order = ['2020–present', '2010–2019', '2007–2009'];
  let first = true;
  const details = order
    .filter((label) => groups.has(label))
    .map((label) => {
      const open = first ? ' open' : '';
      first = false;
      const miniTable = `<table class="table table--compact"><thead>${headerRow}</thead><tbody>${groups.get(label).join('')}</tbody></table>`;
      return `<details${open}><summary>${escapeHtml(label)}</summary><div class="table-scroll">${miniTable}</div></details>`;
    })
    .join('\n');

  return `<div class="accordion accordion--table">\n${details}\n</div>`;
}

function renderTable(html) {
  if (html.includes('isa-ref-table')) {
    return renderRefTableAccordion(html);
  }

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

function renderCard(card, lazy = true) {
  const src = mapImagePath(card.image.src);
  const { width, height } = imageDims(src);
  let href = card.image.href;
  if (href && JOOMSHAPER.test(href)) href = null;
  const alt = escapeHtml(card.image.alt ?? '');
  const loading = lazy ? ' loading="lazy" decoding="async"' : ' fetchpriority="high" decoding="async"';
  const img = `<img src="${escapeHtml(src)}" alt="${alt}" width="${width}" height="${height}"${loading}>`;
  const imgHtml = href
    ? `<a href="${escapeHtml(mapImagePath(href))}">${img}</a>`
    : img;
  const title = card.heading
    ? `<h3>${escapeHtml(formatHeadingText(card.heading.text))}</h3>`
    : '';
  const body = card.body.map((b) => renderBlock(b, { lazyImages: lazy })).filter(Boolean).join('\n');
  const srAlt = card.image.alt
    ? `<p class="visually-hidden">${escapeHtml(card.image.alt)}</p>`
    : '';
  return `<article class="card">${imgHtml}${srAlt}<div class="card__body">${title}${body}</div></article>`;
}

function renderAccordionCards(cards, options = {}) {
  return `<div class="accordion">\n${cards
    .map((card, idx) => {
      const open = idx === 0 ? ' open' : '';
      const title = card.heading?.text ?? '';
      const bodyOnly = { ...card, heading: null };
      return `<details${open}><summary>${escapeHtml(formatHeadingText(title))}</summary>${renderCard(bodyOnly, options.lazyImages !== false)}</details>`;
    })
    .join('\n')}\n</div>`;
}

function renderGalleryAccordion(images, options = {}) {
  const chunkSize = 3;
  const chunks = [];
  for (let c = 0; c < images.length; c += chunkSize) {
    chunks.push(images.slice(c, c + chunkSize));
  }
  return `<div class="accordion accordion--gallery">\n${chunks
    .map((chunk, idx) => {
      const open = idx === 0 ? ' open' : '';
      const label = `Photos ${idx * chunkSize + 1}–${idx * chunkSize + chunk.length}`;
      const gallery = `<div class="gallery">\n${chunk.map((img) => renderImage(img, options.lazyImages !== false)).join('\n')}\n</div>`;
      return `<details${open}><summary>${escapeHtml(label)}</summary>${gallery}</details>`;
    })
    .join('\n')}\n</div>`;
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
        parts.push(headingTag(block.level, block.text, true));
        parts.push(renderAccordionCards(featured, options));
        i = j;
        continue;
      }
    }

    if (block.type === 'image') {
      let j = i;
      while (j < blocks.length && blocks[j].type === 'image') j += 1;
      const run = blocks.slice(i, j);
      if (run.length >= 2) {
        if (run.length >= 6 && options.slug === 'references') {
          parts.push(renderGalleryAccordion(run, options));
        } else {
          parts.push(
            `<div class="gallery">\n${run.map((img) => renderImage(img, options.lazyImages !== false)).join('\n')}\n</div>`,
          );
        }
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
        const cols = cards.length === 4 ? 'grid--2' : 'grid--3';
        if (cards.length >= 3) {
          parts.push(renderAccordionCards(cards, options));
        } else {
          parts.push(
            `<div class="grid ${cols}">\n${cards.map((c) => renderCard(c, options.lazyImages !== false)).join('\n')}\n</div>`,
          );
        }
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

  if (slides.length > 1) {
    html += '<section class="section section-promo"><div class="container prose"><div class="accordion accordion--promo">';
    slides.slice(1).forEach((slideBlocks, promoIndex) => {
      const heading = slideBlocks.find((b) => b.type === 'heading');
      const title = heading?.text ?? '';
      const bodyBlocks = slideBlocks.filter((b) => b !== heading);
      const body = bodyBlocks
        .map((b) => renderBlock(b, { lazyImages: true }))
        .filter(Boolean)
        .join('\n');
      const figure = renderImage(carouselImageBlock(promoIndex + 1, title), true);
      const open = promoIndex === 0 ? ' open' : '';
      html += `<details${open}><summary>${escapeHtml(formatHeadingText(title))}</summary><div class="section-promo__layout">${figure}<div class="section-promo__text">${body}</div></div></details>`;
    });
    html += '</div></div></section>';
  }

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
