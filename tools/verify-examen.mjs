#!/usr/bin/env node
/** Layout, contrast, ASCII, and scoring smoke checks for /examen/ */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FILE = path.join(ROOT, 'src/examen/index.html');
const html = fs.readFileSync(FILE, 'utf8');

function relLum(hex) {
  const h = hex.replace('#', '');
  const rgb = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const lin = rgb.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}

function contrast(fg, bg) {
  const l1 = relLum(fg);
  const l2 = relLum(bg);
  const [a, b] = l1 >= l2 ? [l1, l2] : [l2, l1];
  return (a + 0.05) / (b + 0.05);
}

const sea = '#F4F6F7';
const shoal = '#FFFFFF';
const pairs = [
  ['body text', '#16202A', sea],
  ['dim text', '#5A6B73', sea],
  ['port band', '#B4271F', shoal],
  ['starboard band', '#1E7A44', shoal],
  ['sector band (adjusted from #A87308)', '#966508', shoal],
];

console.log('--- WCAG contrast (4.5:1 AA) ---');
let failed = false;
for (const [name, fg, bg] of pairs) {
  const ratio = contrast(fg, bg);
  const ok = ratio >= 4.5;
  console.log(`${ok ? 'OK' : 'FAIL'} ${name}: ${ratio.toFixed(2)}:1 (${fg} on ${bg})`);
  if (!ok) failed = true;
}

const nonAscii = [...html].filter((c) => c.charCodeAt(0) > 127);
console.log('\n--- ASCII ---');
if (nonAscii.length) {
  console.error('FAIL non-ASCII count:', nonAscii.length, [...new Set(nonAscii)]);
  failed = true;
} else {
  console.log('OK no non-ASCII in file');
}

if (!html.includes("content=\"noindex, nofollow\"")) {
  console.error('FAIL missing noindex');
  failed = true;
}
if (!html.includes("'examState-v1'")) {
  console.error('FAIL missing examState-v1 key');
  failed = true;
}

function extractQuestions(html) {
  const marker = 'const QUESTIONS =';
  const start = html.indexOf(marker);
  if (start < 0) throw new Error('QUESTIONS missing');
  let rest = html.slice(start + marker.length).trimStart();
  let depth = 0;
  for (let i = 0; i < rest.length; i++) {
    if (rest[i] === '[') depth++;
    else if (rest[i] === ']') {
      depth--;
      if (depth === 0) return JSON.parse(rest.slice(0, i + 1));
    }
  }
  throw new Error('QUESTIONS array not closed');
}

const questions = extractQuestions(html);
console.log('\n--- Questions ---');
console.log('Count:', questions.length);
const sample = questions[0];
const scoreOk = sample.c === 2;
console.log('Sample Q1 correct index:', sample.c, scoreOk ? 'OK' : 'FAIL');
if (!scoreOk) failed = true;

const robots = fs.readFileSync(path.join(ROOT, 'static/robots.txt'), 'utf8');
if (!robots.includes('Disallow: /examen/')) {
  console.error('FAIL robots.txt missing Disallow /examen/');
  failed = true;
} else {
  console.log('OK robots.txt disallows /examen/');
}

const sitemap = fs.readFileSync(path.join(ROOT, 'src/sitemap.njk'), 'utf8');
if (/examen/i.test(sitemap)) {
  console.error('FAIL sitemap mentions examen');
  failed = true;
} else {
  console.log('OK sitemap excludes examen');
}

async function layout() {
  let puppeteer;
  try {
    puppeteer = await import('puppeteer');
  } catch {
    console.warn('Skip layout: puppeteer unavailable');
    return;
  }
  const browser = await puppeteer.default.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  const fileUrl = `file://${FILE}`;
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });

  for (const width of [1440, 375]) {
    await page.setViewport({ width, height: 900 });
    await new Promise((r) => setTimeout(r, 150));
    const m = await page.evaluate(() => {
      const body = document.body;
      const bg = getComputedStyle(body).backgroundColor;
      const color = getComputedStyle(body).color;
      const fs = parseFloat(getComputedStyle(body).fontSize);
      const grid = document.querySelector('.grid');
      const cols = grid
        ? [...grid.querySelectorAll('.tile')].reduce((acc, el) => {
            const top = el.offsetTop;
            acc.add(top);
            return acc;
          }, new Set()).size
        : 0;
      return {
        bg,
        color,
        fs,
        scrollW: document.documentElement.scrollWidth,
        clientW: document.documentElement.clientWidth,
        hScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        gridCols: cols,
        ticks: document.querySelectorAll('.ticks i').length,
      };
    });
    console.log(`\n--- Viewport ${width}px ---`);
    console.log('body font-size:', m.fs, m.fs === 24 ? 'OK' : 'check');
    console.log('background:', m.bg, 'color:', m.color);
    console.log('horizontal scroll:', m.hScroll ? 'FAIL' : 'OK');
    if (m.hScroll) failed = true;
    if (width === 375 && m.gridCols < 2) {
      console.error('FAIL tile grid columns:', m.gridCols);
      failed = true;
    } else if (width === 375) {
      console.log('OK tile grid columns:', m.gridCols);
    }
  }

  // Scoring + localStorage smoke
  await page.evaluate(() => {
    localStorage.removeItem('examState-v1');
  });
  await page.click('[data-card="1"]');
  await page.waitForSelector('.opt');
  for (let i = 0; i < 20; i++) {
    await page.click('.opt');
    await new Promise((r) => setTimeout(r, 40));
  }
  await page.waitForSelector('#fin:not([disabled])', { timeout: 5000 });
  await page.click('#fin');
  await page.waitForSelector('.score');
  const stored = await page.evaluate(() => localStorage.getItem('examState-v1'));
  await page.reload({ waitUntil: 'networkidle0' });
  const tileScore = await page.$eval('.tile .sc', (el) => el.textContent.trim());
  console.log('\n--- localStorage ---');
  console.log('Stored after submit:', stored ? 'OK' : 'FAIL');
  console.log('Score visible after reload on tile 1:', tileScore);
  if (!stored || !tileScore || tileScore === '-') failed = true;

  await browser.close();
}

await layout();

if (failed) {
  console.error('\nverify-examen: FAILED');
  process.exit(1);
}
console.log('\nverify-examen: PASSED');
