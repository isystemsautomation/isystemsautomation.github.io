#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MD_PATH = path.join(ROOT, 'content/compliance-page.md');
const OUT_PATH = path.join(ROOT, 'src/compliance.njk');
const MANIFEST_PATH = path.join(ROOT, 'src/assets/img/_manifest.json');
const IMAGE_MANIFEST = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));

const LAB = {
  intro: {
    src: '/assets/img/lab/module-under-hipot-test.jpg',
    alt: 'HomeMaster module on an ESD mat with hi-pot test leads connected',
  },
  electricStrength: {
    src: '/assets/img/lab/hipot-test-4244v-pass.jpg',
    alt: 'GW Instek GPT-9804 showing a 4.244 kV dielectric strength test passing at 60 seconds',
    caption:
      'Electric strength test at reinforced-insulation level, 4.244 kV DC, 60 s',
  },
  clearance: {
    src: '/assets/img/lab/clearance-measurement-pcb.jpg',
    alt: 'PCB layout with a 13.843 mm clearance dimension between isolated regions',
  },
  calibration: [
    {
      src: '/assets/img/lab/calibration-label-1.jpg',
      alt: 'Calibration label on a measuring instrument',
    },
    {
      src: '/assets/img/lab/calibration-label-2.jpg',
      alt: 'Calibration label on a measuring instrument',
    },
  ],
  calibrationCaption:
    'Instruments are calibrated externally and carry current calibration labels',
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

function renderFigure({ src, alt, caption = null, compact = true }) {
  const { width, height } = imageDims(src);
  const figureClass = compact ? ' class="figure--embed"' : '';
  const cap = caption ?? alt;
  return `<figure${figureClass}><img src="${src}" alt="${escapeHtml(alt)}" width="${width}" height="${height}" loading="lazy" decoding="async"><figcaption>${escapeHtml(cap)}</figcaption></figure>`;
}

function renderInlineParagraphFigure(paragraphHtml, figureSpec) {
  const figure = renderFigure(figureSpec);
  return `<div class="section-promo__layout section-promo__layout--inline">${figure}<div class="section-promo__text">${paragraphHtml}</div></div>`;
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

function parseBody(lines, options = {}) {
  const out = [];
  const para = [];
  const inlineFigures = options.inlineFigures ?? [];
  let i = 0;

  const flush = () => {
    if (!para.length) return;
    const text = para.join(' ').replace(/\s+/g, ' ').trim();
    para.length = 0;
    if (!text) return;
    const html = paragraphHtmlFromText(text);
    const match = inlineFigures.find((item) => text.startsWith(item.prefix));
    if (match) {
      out.push(renderInlineParagraphFigure(html, match.spec));
    } else {
      out.push(html);
    }
  };

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      flush();
      i += 1;
      continue;
    }

    if (trimmed.startsWith('### ')) {
      flush();
      out.push(`<h3>${escapeHtml(trimmed.slice(4))}</h3>`);
      i += 1;
      continue;
    }

    if (trimmed.startsWith('|')) {
      flush();
      const table = parseTable(lines, i);
      out.push(table.html);
      if (options.afterTable) {
        out.push(options.afterTable);
        options.afterTable = null;
      }
      i = table.nextIndex;
      continue;
    }

    if (trimmed.startsWith('- ')) {
      flush();
      const items = [];
      while (i < lines.length && lines[i].trim().startsWith('- ')) {
        let item = lines[i].trim().slice(2);
        i += 1;
        while (
          i < lines.length &&
          lines[i].trim() &&
          !lines[i].trim().startsWith('- ') &&
          !lines[i].trim().startsWith('|') &&
          !lines[i].trim().startsWith('###')
        ) {
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

  flush();
  return out.join('\n');
}

function paragraphHtmlFromText(text) {
  const runIn = text.match(/^\*\*(.+?)\*\*\s*(.*)$/s);
  if (runIn) {
    return `<p><strong>${escapeHtml(runIn[1])}</strong> ${escapeHtml(runIn[2])}</p>`;
  }
  return `<p>${escapeHtml(text)}</p>`;
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
      return { title, lines: rest };
    });
}

function renderCalibrationPair() {
  const figures = LAB.calibration
    .map((item) => {
      const { width, height } = imageDims(item.src);
      return `<figure class="figure--support"><img src="${item.src}" alt="${escapeHtml(item.alt)}" width="${width}" height="${height}" loading="lazy" decoding="async"></figure>`;
    })
    .join('\n');
  return `<div class="figure-pair">\n${figures}\n<p class="figure-caption">${escapeHtml(LAB.calibrationCaption)}</p>\n</div>`;
}

function renderSection(section, tint) {
  const cls = tint ? 'section section--tint' : 'section';
  const h2 = `<h2 class="section-title">${escapeHtml(section.title)}</h2>`;

  if (section.title === 'What this is not') {
    const html = parseBody(section.lines);
    return `<section class="${cls}"><div class="container prose"><div class="notice-panel">${h2}${html}</div></div></section>`;
  }

  if (section.title === 'We went through this ourselves') {
    const figure = renderFigure(LAB.intro);
    const html = parseBody(section.lines);
    return `<section class="${cls}"><div class="container prose"><div class="section-promo__layout section-promo__layout--lead">${figure}<div class="section-promo__text">${h2}${html}</div></div></div></section>`;
  }

  if (section.title === 'Electrical safety testing to EN 62368-1') {
    const html = parseBody(section.lines, {
      inlineFigures: [
        { prefix: '**Electric strength, clause 5.4.9.**', spec: LAB.electricStrength },
        { prefix: '**Creepage and clearance, clause 5.4.2.**', spec: LAB.clearance },
      ],
    });
    return `<section class="${cls}"><div class="container prose">${h2}${html}</div></section>`;
  }

  if (section.title === 'Equipment') {
    const html = parseBody(section.lines, { afterTable: renderCalibrationPair() });
    return `<section class="${cls}"><div class="container prose">${h2}${html}</div></section>`;
  }

  const html = parseBody(section.lines);
  return `<section class="${cls}"><div class="container prose">${h2}${html}</div></section>`;
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
title: Compliance, CE Marking & EU Conformity | ISYSTEMS AUTOMATION
permalink: /compliance.html
pageUrl: /compliance.html
description: "EN 62368-1 safety testing, EMC screening, technical files and Cyber Resilience Act procedure for HomeMaster products through EU conformity assessment."
canonical: "https://www.isystemsautomation.com/compliance.html"
ogTitle: Compliance, CE Marking & EU Conformity | ISYSTEMS AUTOMATION
ogDescription: "EN 62368-1 safety testing, EMC screening, technical files and Cyber Resilience Act procedure for HomeMaster products through EU conformity assessment."
ogUrl: "https://www.isystemsautomation.com/compliance.html"
ogImage: "https://www.isystemsautomation.com/assets/img/og/compliance.jpg"
jsonLd: |
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Compliance testing and CE marking for industrial products",
    "provider": {
      "@type": "Organization",
      "name": "ISYSTEMS AUTOMATION S.R.L.",
      "url": "https://www.isystemsautomation.com"
    },
    "areaServed": "Europe",
    "description": "EN 62368-1 safety testing, EMC screening, technical files and Cyber Resilience Act procedure for HomeMaster products through EU conformity assessment."
  }
---
`;

const markdown = fs.readFileSync(MD_PATH, 'utf8');
const sections = loadSections(markdown);
const html = buildPage(sections);
fs.writeFileSync(OUT_PATH, `${frontMatter}${html}`);
console.log(`Generated ${path.relative(ROOT, OUT_PATH)} (${sections.length} sections)`);
