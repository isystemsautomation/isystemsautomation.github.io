#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MD_PATH = path.join(ROOT, 'content/compliance-page.md');
const OUT_PATH = path.join(ROOT, 'src/compliance.njk');
const MANIFEST_PATH = path.join(ROOT, 'src/assets/img/_manifest.json');
const IMAGE_MANIFEST = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));

const SECTION_IMAGES = {
  'We went through this ourselves': {
    src: '/assets/img/projects/marshalling-cable-marking.jpg',
    alt: 'Marshalling cabinet with individually tagged control cables',
  },
  'Electrical safety testing to EN 62368-1': {
    src: '/assets/img/projects/atex-zone2-barriers.jpg',
    alt: 'ATEX Zone 2 intrinsically safe isolating barriers in a control cabinet',
  },
};

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function imageDims(src) {
  return IMAGE_MANIFEST[src] ?? { width: 960, height: 640 };
}

function renderFigure({ src, alt }) {
  const { width, height } = imageDims(src);
  return `<figure class="figure--embed"><img src="${src}" alt="${escapeHtml(alt)}" width="${width}" height="${height}" loading="lazy" decoding="async"><figcaption>${escapeHtml(alt)}</figcaption></figure>`;
}

function parseTable(lines, startIndex) {
  const rows = [];
  let i = startIndex;
  while (i < lines.length && lines[i].trim().startsWith('|')) {
    const cells = lines[i]
      .trim()
      .replace(/^\|/, '')
      .replace(/\|$/, '')
      .split('|')
      .map((c) => c.trim());
    rows.push(cells);
    i += 1;
  }
  return { html: rowsToTable(rows), nextIndex: i };
}

function rowsToTable(rows) {
  if (rows.length < 2) return '';
  const header = rows[0];
  const body = rows.slice(2);
  const thead = `<thead><tr>${header.map((h) => `<th>${escapeHtml(h)}</th>`).join('')}</tr></thead>`;
  const tbody = `<tbody>${body
    .map((row) => `<tr>${row.map((c) => `<td>${escapeHtml(c)}</td>`).join('')}</tr>`)
    .join('')}</tbody>`;
  return `<div class="table-scroll"><table class="table table--compact">${thead}${tbody}</table></div>`;
}

function flushParagraph(buffer, out) {
  if (!buffer.length) return;
  const text = buffer.join(' ').replace(/\s+/g, ' ').trim();
  if (!text) return;
  const runIn = text.match(/^\*\*(.+?)\*\*\s*(.*)$/s);
  if (runIn) {
    out.push(`<p><strong>${escapeHtml(runIn[1])}</strong> ${escapeHtml(runIn[2])}</p>`);
  } else {
    out.push(`<p>${escapeHtml(text)}</p>`);
  }
  buffer.length = 0;
}

function parseBody(lines) {
  const out = [];
  const para = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph(para, out);
      i += 1;
      continue;
    }

    if (trimmed.startsWith('### ')) {
      flushParagraph(para, out);
      out.push(`<h3>${escapeHtml(trimmed.slice(4))}</h3>`);
      i += 1;
      continue;
    }

    if (trimmed.startsWith('|')) {
      flushParagraph(para, out);
      const table = parseTable(lines, i);
      out.push(table.html);
      i = table.nextIndex;
      continue;
    }

    if (trimmed.startsWith('- ')) {
      flushParagraph(para, out);
      const items = [];
      while (i < lines.length && lines[i].trim().startsWith('- ')) {
        let item = lines[i].trim().slice(2);
        i += 1;
        while (i < lines.length && lines[i].trim() && !lines[i].trim().startsWith('- ') && !lines[i].trim().startsWith('|') && !lines[i].trim().startsWith('###')) {
          item += ` ${lines[i].trim()}`;
          i += 1;
        }
        items.push(`<li>${escapeHtml(item.replace(/\s+/g, ' ').trim())}</li>`);
      }
      out.push(`<ul>\n${items.join('\n')}\n</ul>`);
      continue;
    }

    para.push(trimmed);
    i += 1;
  }

  flushParagraph(para, out);
  return out.join('\n');
}

function loadSections(markdown) {
  const start = markdown.indexOf('\n## We went through this ourselves');
  if (start < 0) throw new Error('compliance-page.md: content start not found');
  const body = markdown.slice(start + 1);
  return body
    .split(/\n---\n/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const lines = chunk.split('\n');
      const titleLine = lines.find((l) => l.startsWith('## '));
      if (!titleLine) throw new Error(`Section without h2: ${chunk.slice(0, 40)}`);
      const title = titleLine.slice(3).trim();
      const rest = lines.filter((l) => l !== titleLine);
      return { title, html: parseBody(rest) };
    });
}

function renderSection(section, tint) {
  const cls = tint ? 'section section--tint' : 'section';
  const h2 = `<h2 class="section-title">${escapeHtml(section.title)}</h2>`;

  if (section.title === 'What this is not') {
    return `<section class="${cls}"><div class="container prose"><div class="notice-panel">${h2}${section.html}</div></div></section>`;
  }

  const image = SECTION_IMAGES[section.title];
  if (image) {
    const figure = renderFigure(image);
    return `<section class="${cls}"><div class="container prose"><div class="section-promo__layout section-promo__layout--lead">${figure}<div class="section-promo__text">${h2}${section.html}</div></div></div></section>`;
  }

  return `<section class="${cls}"><div class="container prose">${h2}${section.html}</div></section>`;
}

function buildPage(sections) {
  let tint = true;
  const parts = [
    '<section class="section section--flush page-hero"><div class="container prose"><h1>Compliance and Testing</h1></div></section>',
  ];
  for (const section of sections) {
    parts.push(renderSection(section, tint));
    tint = !tint;
  }
  return `${parts.join('')}\n`;
}

const frontMatter = `---
layout: base.njk
title: Compliance Testing and CE Marking — ISYSTEMS AUTOMATION
permalink: /compliance.html
pageUrl: /compliance.html
description: "In-house electrical safety testing to EN 62368-1, EMC screening, technical files and Cyber Resilience Act procedure, built to take eleven of our own products through EU conformity assessment."
canonical: "https://www.isystemsautomation.com/compliance.html"
ogTitle: Compliance Testing and CE Marking — ISYSTEMS AUTOMATION
ogDescription: "In-house electrical safety testing to EN 62368-1, EMC screening, technical files and Cyber Resilience Act procedure, built to take eleven of our own products through EU conformity assessment."
ogUrl: "https://www.isystemsautomation.com/compliance.html"
---
`;

const markdown = fs.readFileSync(MD_PATH, 'utf8');
const sections = loadSections(markdown);
const html = buildPage(sections);
fs.writeFileSync(OUT_PATH, `${frontMatter}${html}`);
console.log(`Generated ${path.relative(ROOT, OUT_PATH)} (${sections.length} sections)`);
