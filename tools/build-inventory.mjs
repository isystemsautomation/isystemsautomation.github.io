#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';
import {
  LEGACY_PAGES,
  legacyPathToUrl,
} from './legacy-pages.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const LEGACY_DIR = path.join(ROOT, 'legacy');
const OUT_DIR = path.join(ROOT, 'content');
const OUT_FILE = path.join(OUT_DIR, '_inventory.json');

function metaContent($, selector) {
  const el = $(selector).first();
  if (!el.length) return null;
  const value = el.attr('content') ?? el.attr('href') ?? el.text();
  const trimmed = value?.trim();
  return trimmed || null;
}

function extractInventory(relativePath) {
  const filePath = path.join(LEGACY_DIR, relativePath);
  const html = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(html);

  return {
    file: `legacy/${relativePath}`,
    url: legacyPathToUrl(relativePath),
    title: $('title').first().text().trim() || null,
    description: metaContent($, 'meta[name="description"]'),
    canonical: metaContent($, 'link[rel="canonical"]'),
    ogTitle: metaContent($, 'meta[property="og:title"]'),
    ogDescription: metaContent($, 'meta[property="og:description"]'),
    ogUrl: metaContent($, 'meta[property="og:url"]'),
  };
}

fs.mkdirSync(OUT_DIR, { recursive: true });

const inventory = [];
const errors = [];

for (const page of LEGACY_PAGES) {
  try {
    inventory.push(extractInventory(page));
  } catch (err) {
    errors.push({ page, error: err.message });
  }
}

fs.writeFileSync(OUT_FILE, `${JSON.stringify(inventory, null, 2)}\n`, 'utf8');

console.log(`Wrote ${inventory.length} entries to content/_inventory.json`);
if (errors.length) {
  console.error('Errors:', errors);
  process.exitCode = 1;
}
