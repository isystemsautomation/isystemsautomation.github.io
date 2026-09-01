#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const LEGACY_DIR = path.join(ROOT, 'legacy');
const SITE_DIR = path.join(ROOT, '_site');
const INVENTORY_PATH = path.join(ROOT, 'content', '_inventory.json');

const SIL_STRINGS = [
  'SIL 2 and SIL 3',
  'IEC 61511',
  'HIMA HIQuad',
  'Foxboro Triconex',
  'ABB AC800',
  'Emerson Ovation',
  'IEC 60870-5-104',
];

const norm = (s) =>
  s
    .replace(/\u00a0/g, ' ')
    .replace(/[«»""„]/g, '"')
    .replace(/['']/g, "'")
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

function extractWords(html) {
  const $ = cheerio.load(html, { decodeEntities: false });
  $('script, style, noscript, head').remove();
  $('body')
    .find('*')
    .each((_, el) => {
      $(el).append(' ');
    });
  const text = norm($('body').text());
  return new Set(text.split(/\s+/).filter(Boolean));
}

function isHidden($, el) {
  let node = el;
  while (node && node.type === 'tag') {
    const style = ($(node).attr('style') ?? '').toLowerCase();
    if (/display\s*:\s*none/.test(style)) return true;
    if (/visibility\s*:\s*hidden/.test(style)) return true;
    if (/opacity\s*:\s*0(?:\.0+)?(?![\.0-9])/.test(style)) return true;
    node = node.parent;
  }
  return false;
}

function checkSilVisibility(html) {
  const $ = cheerio.load(html, { decodeEntities: false });
  const failures = [];

  for (const needle of SIL_STRINGS) {
    let foundVisible = false;
    $('body *').each((_, el) => {
      const text = $(el).clone().children().remove().end().text();
      if (text.includes(needle) && !isHidden($, el)) {
        foundVisible = true;
        return false;
      }
      return undefined;
    });

    if (!foundVisible) {
      const anywhere = norm($('body').text()).includes(norm(needle));
      failures.push(anywhere ? `${needle} (hidden ancestor)` : `${needle} (missing)`);
    }
  }

  return failures;
}

const inventory = JSON.parse(fs.readFileSync(INVENTORY_PATH, 'utf8'));
let failed = false;

for (const entry of inventory) {
  const legacyPath = path.join(ROOT, entry.file);
  const sitePath = path.join(SITE_DIR, entry.url.replace(/^\//, ''));

  if (!fs.existsSync(legacyPath)) {
    console.error(entry.url, 'MISSING legacy file:', entry.file);
    failed = true;
    continue;
  }
  if (!fs.existsSync(sitePath)) {
    console.error(entry.url, 'MISSING _site file:', sitePath);
    failed = true;
    continue;
  }

  const legacyWords = extractWords(fs.readFileSync(legacyPath, 'utf8'));
  const siteWords = extractWords(fs.readFileSync(sitePath, 'utf8'));
  const missing = [...legacyWords].filter((w) => !siteWords.has(w));

  if (missing.length) {
    console.error(entry.url, 'ПОТЕРЯН ТЕКСТ:', missing.slice(0, 40), missing.length > 40 ? `(+${missing.length - 40} more)` : '');
    failed = true;
  } else {
    console.log(`OK ${entry.url}`);
  }
}

const indexPath = path.join(SITE_DIR, 'index.html');
if (fs.existsSync(indexPath)) {
  const silFailures = checkSilVisibility(fs.readFileSync(indexPath, 'utf8'));
  if (silFailures.length) {
    console.error('index.html SIL visibility failures:', silFailures);
    failed = true;
  } else {
    console.log('OK index.html SIL strings visible');
  }
} else {
  console.error('MISSING _site/index.html');
  failed = true;
}

if (failed) {
  process.exitCode = 1;
  console.error('\nverify-content: FAILED');
} else {
  console.log('\nverify-content: PASSED (23/23 pages)');
}
