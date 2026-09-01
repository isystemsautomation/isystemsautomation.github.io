#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { legacyPathToSlug } from './legacy-pages.mjs';
import { renderPageContent } from './render-blocks.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const INVENTORY_PATH = path.join(ROOT, 'content', '_inventory.json');
const CONTENT_DIR = path.join(ROOT, 'content');
const SRC_DIR = path.join(ROOT, 'src');

const PROJECT_SLUGS = new Set([
  'advanced-controllers-cfb-boiler',
  'power-plant-performance-calculation',
  'virtual-power-plant',
]);

function slugToSrcPath(slug) {
  if (slug === 'homemaster') {
    return path.join(SRC_DIR, 'homemaster', 'index.njk');
  }
  if (PROJECT_SLUGS.has(slug)) {
    return path.join(SRC_DIR, 'projects', `${slug}.njk`);
  }
  if (slug.startsWith('service-')) {
    return path.join(SRC_DIR, 'service', `${slug.slice('service-'.length)}.njk`);
  }
  if (slug.startsWith('industries-')) {
    return path.join(SRC_DIR, 'industries', `${slug.slice('industries-'.length)}.njk`);
  }
  return path.join(SRC_DIR, `${slug}.njk`);
}

function pagePermalink(slug, url) {
  if (slug === 'homemaster') return '/homemaster/';
  return url;
}

function pageUrl(slug, url) {
  if (slug === 'homemaster') return '/homemaster/';
  return url;
}

function inventoryFileToSlug(file) {
  const relative = file.replace(/^legacy\//, '');
  return legacyPathToSlug(relative);
}

function yamlString(value) {
  if (value == null) return '';
  const str = String(value);
  if (/[:#{}[\],&*?|>!'"%@`]/.test(str) || str.includes('\n')) {
    return JSON.stringify(str);
  }
  return str;
}

function buildFrontMatter(meta, contentData) {
  const lines = [
    '---',
    'layout: base.njk',
    `title: ${yamlString(meta.title)}`,
    `permalink: ${yamlString(meta.url)}`,
    `pageUrl: ${yamlString(meta.url)}`,
  ];

  if (meta.description) lines.push(`description: ${yamlString(meta.description)}`);
  if (meta.canonical) lines.push(`canonical: ${yamlString(meta.canonical)}`);
  if (meta.ogTitle) lines.push(`ogTitle: ${yamlString(meta.ogTitle)}`);
  if (meta.ogDescription) lines.push(`ogDescription: ${yamlString(meta.ogDescription)}`);
  if (meta.ogUrl) lines.push(`ogUrl: ${yamlString(meta.ogUrl)}`);

  lines.push('---', '');
  return lines.join('\n');
}

const inventory = JSON.parse(fs.readFileSync(INVENTORY_PATH, 'utf8'));
const generated = [];

for (const entry of inventory) {
  const slug = inventoryFileToSlug(entry.file);
  const contentPath = path.join(CONTENT_DIR, `${slug}.json`);
  if (!fs.existsSync(contentPath)) {
    throw new Error(`Missing content file for ${slug}`);
  }

  const contentData = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
  const bodyHtml = renderPageContent({
    slug,
    blocks: contentData.blocks,
    title: entry.title,
    home: contentData.home ?? null,
  });

  const outPath = slugToSrcPath(slug);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, `${buildFrontMatter(entry, contentData, slug)}${bodyHtml}\n`, 'utf8');
  if (slug === 'homemaster') {
    const legacyPath = path.join(SRC_DIR, 'homemaster.njk');
    if (fs.existsSync(legacyPath)) fs.unlinkSync(legacyPath);
  }
  generated.push(path.relative(ROOT, outPath));
  console.log(`Generated ${path.relative(ROOT, outPath)}`);
}

console.log(`\nGenerated ${generated.length} pages.`);
