#!/usr/bin/env node
/** Compare structural tag counts between legacy HTML and built _site pages. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';
import { LEGACY_PAGES, legacyPathToUrl } from './legacy-pages.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TAGS = ['table', 'dl', 'ul', 'ol', 'figure', 'h2', 'h3'];

function legacyMain($) {
  let r = $('#sp-page-builder .page-content').first();
  if (!r.length) r = $('#sp-main-body').first();
  return r;
}

function siteMain($) {
  const main = $('main#main').first();
  return main.clone().find('footer, .site-footer').remove().end();
}

function count($, root) {
  const c = {};
  for (const t of TAGS) c[t] = root.find(t).length;
  return c;
}

console.log(['page', ...TAGS, 'notes'].join('\t'));
for (const rel of LEGACY_PAGES) {
  const url = legacyPathToUrl(rel);
  const leg$ = cheerio.load(fs.readFileSync(path.join(ROOT, 'legacy', rel), 'utf8'));
  const site$ = cheerio.load(fs.readFileSync(path.join(ROOT, '_site', rel), 'utf8'));
  const lc = count(leg$, legacyMain(leg$));
  const sc = count(site$, siteMain(site$));
  const notes = [];
  for (const t of TAGS) {
    if (sc[t] !== lc[t]) notes.push(`${t}:${lc[t]}→${sc[t]}`);
  }
  console.log([rel, ...TAGS.map((t) => `${lc[t]}/${sc[t]}`), notes.join('; ') || '—'].join('\t'));
}
