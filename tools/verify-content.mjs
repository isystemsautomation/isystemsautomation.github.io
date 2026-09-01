#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SITE_DIR = path.join(ROOT, '_site');
const INVENTORY_PATH = path.join(ROOT, 'content', '_inventory.json');
const BASELINE_PATH = path.join(ROOT, 'content', '_word-baseline.json');

const SIL_STRINGS = [
  'SIL 2 and SIL 3',
  'IEC 61511',
  'HIMA HIQuad',
  'Foxboro Triconex',
  'ABB AC800',
  'Emerson Ovation',
  'IEC 60870-5-104',
];

/** Words intentionally absent after self-hosting IBM Plex Sans (cookies.html, Aug 2026). */
const COOKIES_MISSING_OK = new Set([
  'pages',
  'load',
  '(fonts.googleapis.com',
  'fonts.gstatic.com).',
  'sends',
  'ip',
  'address',
  'but',
]);

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

function normalizeChunk(text) {
  return text.replace(/\s+/g, ' ').trim();
}

function inlineStyleHides(style) {
  const s = style.toLowerCase();
  return (
    /display\s*:\s*none/.test(s) ||
    /visibility\s*:\s*hidden/.test(s) ||
    /opacity\s*:\s*0(?:\.0+)?(?![.\d])/.test(s) ||
    /(?:^|;|\s)height\s*:\s*0(?:px)?(?:\s|;|$)/.test(s) ||
    /(?:^|;|\s)max-height\s*:\s*0(?:px)?(?:\s|;|$)/.test(s)
  );
}

function checkContentVisibility(html) {
  const $ = cheerio.load(html, { decodeEntities: false });
  const chunks = [];

  $('main details:not([open])').each((_, el) => {
    const text = normalizeChunk($(el).text());
    if (text) chunks.push({ reason: 'closed details', text });
  });

  $('main .visually-hidden').each((_, el) => {
    const text = normalizeChunk($(el).text());
    if (text) chunks.push({ reason: 'visually-hidden', text });
  });

  $('main [style]').each((_, el) => {
    const style = $(el).attr('style') ?? '';
    if (!inlineStyleHides(style)) return;
    const text = normalizeChunk($(el).text());
    if (text) chunks.push({ reason: 'inline hidden style', text });
  });

  return chunks;
}

function isHidden($, el) {
  let node = el;
  while (node && node.type === 'tag') {
    const style = ($(node).attr('style') ?? '').toLowerCase();
    if (/display\s*:\s*none/.test(style)) return true;
    if (/visibility\s*:\s*hidden/.test(style)) return true;
    if (/opacity\s*:\s*0(?:\.0+)?(?![.\d])/.test(style)) return true;
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

function referenceWords(entry) {
  const legacyPath = path.join(ROOT, entry.file);
  if (!fs.existsSync(legacyPath)) {
    if (fs.existsSync(BASELINE_PATH)) {
      const baseline = JSON.parse(fs.readFileSync(BASELINE_PATH, 'utf8'));
      if (baseline[entry.url]) {
        return new Set(baseline[entry.url]);
      }
    }
    return null;
  }

  let html = fs.readFileSync(legacyPath, 'utf8');
  if (entry.url.startsWith('/service/') || entry.url.startsWith('/industries/')) {
    html = stripSubpageBoilerplate(html);
  }

  if (fs.existsSync(BASELINE_PATH)) {
    const baseline = JSON.parse(fs.readFileSync(BASELINE_PATH, 'utf8'));
    if (baseline[entry.url]) {
      return new Set(baseline[entry.url]);
    }
  }

  return extractWords(html);
}

function stripSubpageBoilerplate(html) {
  const $ = cheerio.load(html, { decodeEntities: false });
  const titles = ['Our Services', 'What We Do'];
  $('h2, h3, .section-title, .sppb-addon-title').each((_, el) => {
    const text = $(el).text().replace(/\s+/g, ' ').trim();
    if (!titles.includes(text)) return;
    const section = $(el).closest('section, .sppb-section, .row, div[class*="section"]');
    if (section.length) {
      section.remove();
      return;
    }
    $(el).nextAll().remove();
    $(el).remove();
  });
  return $.html();
}

async function startStaticServer() {
  const { spawn } = await import('node:child_process');
  const port = 8765;
  const proc = spawn('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1'], {
    cwd: SITE_DIR,
    stdio: 'pipe',
  });
  await new Promise((resolve) => setTimeout(resolve, 400));
  return {
    base: `http://127.0.0.1:${port}`,
    stop: () => proc.kill('SIGTERM'),
  };
}

async function measureLayout() {
  let puppeteer;
  try {
    puppeteer = await import('puppeteer');
  } catch {
    console.warn('puppeteer not installed — skipping layout metrics');
    return null;
  }

  try {
  const server = await startStaticServer();
  const browser = await puppeteer.default.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const inventory = JSON.parse(fs.readFileSync(INVENTORY_PATH, 'utf8'));
  let totalHiddenChars = 0;
  let maxContentImageWidth = 0;
  let maxImagePage = '';
  const pageMetrics = {};

  for (const entry of inventory) {
    const fileUrl = `${server.base}${entry.url}`;

    await page.goto(fileUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });

    const result = await page.evaluate(() => {
      const main = document.querySelector('main');
      if (!main) return { hiddenChars: 0, maxImg: 0 };

      let hiddenChars = 0;
      const hiddenSamples = [];

      const addHidden = (reason, el) => {
        const text = (el.textContent ?? '').replace(/\s+/g, ' ').trim();
        if (!text) return;
        hiddenChars += text.length;
        hiddenSamples.push({ reason, preview: text.slice(0, 80) });
      };

      main.querySelectorAll('details:not([open])').forEach((el) => addHidden('closed details', el));
      main.querySelectorAll('.visually-hidden').forEach((el) => addHidden('visually-hidden', el));

      main.querySelectorAll('[style]').forEach((el) => {
        const style = el.getAttribute('style') ?? '';
        const s = style.toLowerCase();
        const hides =
          /display\s*:\s*none/.test(s) ||
          /visibility\s*:\s*hidden/.test(s) ||
          /opacity\s*:\s*0(?:\.0+)?(?![.\d])/.test(s) ||
          /(?:^|;|\s)height\s*:\s*0(?:px)?(?:\s|;|$)/.test(s) ||
          /(?:^|;|\s)max-height\s*:\s*0(?:px)?(?:\s|;|$)/.test(s);
        if (hides) addHidden('inline hidden style', el);
      });

      main.querySelectorAll('*').forEach((el) => {
        const cs = window.getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') {
          const text = (el.textContent ?? '').replace(/\s+/g, ' ').trim();
          if (text && el.children.length === 0) {
            hiddenChars += text.length;
            hiddenSamples.push({ reason: 'computed hidden', preview: text.slice(0, 80) });
          }
        }
        const h = parseFloat(cs.height);
        if (h === 0 && el.textContent?.trim()) {
          const text = el.textContent.replace(/\s+/g, ' ').trim();
          if (text.length > 20) {
            hiddenChars += text.length;
            hiddenSamples.push({ reason: 'zero height', preview: text.slice(0, 80) });
          }
        }
      });

      let maxImg = 0;
      const imgs = main.querySelectorAll('img');
      imgs.forEach((img) => {
        if (img.closest('.hero, .page-hero, .section--flush.hero')) return;
        if (img.closest('.figure--schematic')) return;
        const rect = img.getBoundingClientRect();
        if (rect.width > maxImg) maxImg = rect.width;
      });

      return { hiddenChars, hiddenSamples, maxImg };
    });

    totalHiddenChars += result.hiddenChars;
    if (result.maxImg > maxContentImageWidth) {
      maxContentImageWidth = result.maxImg;
      maxImagePage = entry.url;
    }

    if (entry.url === '/index.html' || entry.url === '/references.html') {
      const filePath = path.join(SITE_DIR, entry.url.replace(/^\//, ''));
      const stats = fs.statSync(filePath);
      const height = await page.evaluate(() => document.documentElement.scrollHeight);
      pageMetrics[entry.url] = {
        height,
        bytes: stats.size,
      };
    }

    if (result.hiddenChars > 0) {
      console.error(`${entry.url} HIDDEN CONTENT (${result.hiddenChars} chars):`);
      for (const sample of result.hiddenSamples.slice(0, 5)) {
        console.error(`  [${sample.reason}] ${sample.preview}`);
      }
    }
  }

  await browser.close();
  server.stop();

  return { totalHiddenChars, maxContentImageWidth, maxImagePage, pageMetrics };
  } catch (err) {
    console.error('Layout measurement failed:', err.message);
    return null;
  }
}

const inventory = JSON.parse(fs.readFileSync(INVENTORY_PATH, 'utf8'));
let failed = false;
let totalHiddenFromCheerio = 0;

for (const entry of inventory) {
  const sitePath = path.join(SITE_DIR, entry.url.replace(/^\//, ''));
  const refWords = referenceWords(entry);

  if (!refWords) {
    console.error(entry.url, 'MISSING reference words (no legacy file or baseline entry)');
    failed = true;
    continue;
  }
  if (!fs.existsSync(sitePath)) {
    console.error(entry.url, 'MISSING _site file:', sitePath);
    failed = true;
    continue;
  }

  const html = fs.readFileSync(sitePath, 'utf8');
  const siteWords = extractWords(html);
  let missing = [...refWords].filter((w) => !siteWords.has(w));

  if (entry.url === '/cookies.html') {
    missing = missing.filter((w) => !COOKIES_MISSING_OK.has(w));
  }

  if (entry.url === '/references.html') {
    if (!html.includes('table--ref')) {
      console.error(entry.url, 'project list must render as table (table--ref missing)');
      failed = true;
    }
    const projectListSection = html.split('Project list').slice(1).join('Project list');
    if (projectListSection && /<ul>\s*\n<li>\s*\d{4}/.test(projectListSection.split('Featured projects')[0] ?? projectListSection)) {
      console.error(entry.url, 'project list must not be a bullet list');
      failed = true;
    }
  }

  if (missing.length) {
    console.error(
      entry.url,
      'ПОТЕРЯН ТЕКСТ:',
      missing.slice(0, 40),
      missing.length > 40 ? `(+${missing.length - 40} more)` : '',
    );
    failed = true;
  } else {
    console.log(`OK ${entry.url}`);
  }

  const hiddenChunks = checkContentVisibility(html);
  const hiddenChars = hiddenChunks.reduce((sum, c) => sum + c.text.length, 0);
  totalHiddenFromCheerio += hiddenChars;
  if (hiddenChars > 0) {
    console.error(`${entry.url} HIDDEN ON LOAD (${hiddenChars} chars):`);
    for (const chunk of hiddenChunks) {
      console.error(`  [${chunk.reason}] ${chunk.text.slice(0, 80)}`);
    }
    failed = true;
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

console.log(`\nCheerio hidden chars total: ${totalHiddenFromCheerio}`);

const layout = await measureLayout();
if (layout) {
  console.log('\n--- Layout metrics @ 1440px ---');
  console.log(`Hidden chars (browser): ${layout.totalHiddenChars}`);
  console.log(
    `Max content image width: ${Math.round(layout.maxContentImageWidth)}px (${layout.maxImagePage})`,
  );
  for (const [url, m] of Object.entries(layout.pageMetrics)) {
    console.log(`${url}: height ${m.height}px, weight ${m.bytes} bytes`);
  }
  if (layout.totalHiddenChars > 0) failed = true;
  if (layout.maxContentImageWidth > 320.5) failed = true;
}

function visibleText(html) {
  const $ = cheerio.load(html, { decodeEntities: false });
  $('script, style, noscript, head').remove();
  return $('main').text() || $('body').text();
}

function checkDanglingHeadings(html, url) {
  const $ = cheerio.load(html, { decodeEntities: false });
  const dangling = [];
  $('main .prose').each((_, prose) => {
    $(prose)
      .find('h2')
      .each((__, el) => {
        const $el = $(el);
        if ($el.closest('.page-hero').length) return;
        const after = $el.nextAll().not('script,style');
        const hasContent = after.filter((___, node) => {
          const $n = $(node);
          if ($n.is('h1,h2,h3,h4,h5,h6')) return false;
          return $n.text().trim().length > 0 || $n.is('img,table,ul,ol,figure,dl,p');
        }).length;
        if (!hasContent && !$el.closest('.section-promo__layout,.point-grid,.grid').length) {
          dangling.push($el.text().trim());
        }
      });
  });
  if (dangling.length) {
    console.error(`${url} dangling heading(s):`, dangling.join('; '));
    return false;
  }
  return true;
}

function americanSpellingInVisibleText(text) {
  const stripped = text.replace(/\/service\/process-optimization-advanced-process-control\.html/gi, '');
  return (
    /\boptimization\b/i.test(stripped) ||
    /\boptimize\b/i.test(stripped) ||
    /\boptimized\b/i.test(stripped) ||
    /\boptimizer\b/i.test(stripped)
  );
}

for (const entry of inventory) {
  const sitePath = path.join(SITE_DIR, entry.url.replace(/^\//, ''));
  if (!fs.existsSync(sitePath)) continue;
  const html = fs.readFileSync(sitePath, 'utf8');
  if (!checkDanglingHeadings(html, entry.url)) failed = true;

  if (americanSpellingInVisibleText(visibleText(html))) {
    console.error(entry.url, 'American spelling (optimization/optimize) in visible text');
    failed = true;
  }
}

const maintenancePath = path.join(SITE_DIR, 'service/maintenance.html');
if (fs.existsSync(maintenancePath)) {
  const mHtml = fs.readFileSync(maintenancePath, 'utf8');
  if (!mHtml.includes('Maintenance approach')) {
    console.error('service/maintenance.html missing h2 Maintenance approach');
    failed = true;
  }
  for (const h3 of [
    'Preventive maintenance',
    'Condition-based maintenance',
    'Corrective and emergency support',
    'Remote support',
    'Performance monitoring',
  ]) {
    if (!mHtml.includes(h3)) {
      console.error('service/maintenance.html missing h3:', h3);
      failed = true;
    }
  }
  if (!mHtml.includes('Performance calculation and reporting')) {
    console.error('service/maintenance.html missing h2 Performance calculation and reporting');
    failed = true;
  }
  if (/predictive maintenance/i.test(mHtml)) {
    console.error('service/maintenance.html must not mention predictive maintenance');
    failed = true;
  }
}

const refsPath = path.join(SITE_DIR, 'references.html');
if (fs.existsSync(refsPath)) {
  const refsHtml = fs.readFileSync(refsPath, 'utf8');
  const rowCount = (refsHtml.match(/<tbody>[\s\S]*?<\/tbody>/)?.[0].match(/<tr>/g) ?? []).length;
  const colCount = (refsHtml.match(/<thead>[\s\S]*?<\/thead>/)?.[0].match(/<th>/g) ?? []).length;
  if (rowCount !== 32 || colCount !== 4) {
    console.error(`references.html table must be 4 columns × 32 rows (got ${colCount}×${rowCount})`);
    failed = true;
  }
}

if (fs.existsSync(SITE_DIR)) {
  const allHtml = inventory
    .map((entry) => {
      const sitePath = path.join(SITE_DIR, entry.url.replace(/^\//, ''));
      return fs.existsSync(sitePath) ? fs.readFileSync(sitePath, 'utf8') : '';
    })
    .join('\n');
  const reachMatches = allHtml.match(/reach the control(?! without leaving their operating position)/gi) ?? [];
  if (reachMatches.length) {
    console.error('Incomplete phrase "reach the control" found:', reachMatches.length);
    failed = true;
  }
}

if (failed) {
  process.exitCode = 1;
  console.error('\nverify-content: FAILED');
} else {
  console.log('\nverify-content: PASSED (23/23 pages)');
}
