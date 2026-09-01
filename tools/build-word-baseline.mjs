#!/usr/bin/env node
/** Snapshot word sets from built pages for verify-content after legacy/ removal. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE_DIR = path.join(ROOT, '_site');
const INVENTORY_PATH = path.join(ROOT, 'content', '_inventory.json');
const BASELINE_PATH = path.join(ROOT, 'content', '_word-baseline.json');

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
  return [...new Set(text.split(/\s+/).filter(Boolean))].sort();
}

const inventory = JSON.parse(fs.readFileSync(INVENTORY_PATH, 'utf8'));
const baseline = {};

for (const entry of inventory) {
  const sitePath = path.join(SITE_DIR, entry.url.replace(/^\//, ''));
  if (!fs.existsSync(sitePath)) {
    console.error('Missing built page:', sitePath);
    process.exitCode = 1;
    continue;
  }
  baseline[entry.url] = extractWords(fs.readFileSync(sitePath, 'utf8'));
}

fs.writeFileSync(BASELINE_PATH, `${JSON.stringify(baseline, null, 2)}\n`);
console.log(`Wrote ${Object.keys(baseline).length} page baselines to content/_word-baseline.json`);
