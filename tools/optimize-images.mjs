#!/usr/bin/env node
/** Resize, compress and catalogue images under src/assets/img. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const IMG_ROOT = path.join(ROOT, 'src/assets/img');
const MANIFEST_PATH = path.join(IMG_ROOT, '_manifest.json');

const CAMERA_ORIGINALS = [
  'P10129-123315.jpg',
  'P10129-123925.jpg',
  'P91102-104354.jpg',
  'P91122-114040.jpg',
  'P00110-105955.jpg',
  'P00731-123821.jpg',
  'P01104-082706.jpg',
  'P00214-131243.jpg',
  'P00129-140137.jpg',
  'P91017-112718.jpg',
  'P10205-152911.jpg',
  '20160124_111013.jpg',
  '20161006_114122.jpg',
];

const HERO_SOURCES = [
  { src: 'projects/control-room-combined-cycle-wide.jpg', dest: 'projects/control-room-combined-cycle-hero.jpg' },
  { src: '2024/08/09/carousel2.jpg', dest: '2024/08/09/carousel2-hero.jpg' },
  { src: '2024/08/09/carousel3.jpg', dest: '2024/08/09/carousel3-hero.jpg' },
];

const JUNK_PATHS = [
  'isa-layout.css',
  'a7gg82u8ci',
  'v0oq784jgf',
  '2025/05/07/homemaster.png',
];

async function optimizeRaster(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const rel = path.relative(IMG_ROOT, filePath).replace(/\\/g, '/');

  if (rel === 'favicon.ico' || rel === '_manifest.json') {
    return null;
  }

  let pipeline = sharp(filePath).rotate();

  if (ext === '.png') {
    pipeline = pipeline.resize(360, 360, { fit: 'inside', withoutEnlargement: true });
    const buf = await pipeline
      .png({ compressionLevel: 9, adaptiveFiltering: true })
      .toBuffer();
    fs.writeFileSync(filePath, buf);
    const out = await sharp(buf).metadata();
    return { width: out.width, height: out.height, bytes: buf.length };
  }

  if (rel.includes('-hero.jpg')) {
    return null;
  }

  let quality = 68;
  if (rel.includes('-wide.jpg')) {
    pipeline = pipeline.resize(1600, 400, { fit: 'cover' });
    quality = 72;
  } else if (rel.includes('-full.jpg')) {
    pipeline = pipeline.resize(1600, 1600, { fit: 'inside', withoutEnlargement: true });
    quality = 72;
  } else if (rel.startsWith('projects/')) {
    pipeline = pipeline.resize(960, 640, { fit: 'cover' });
    quality = 62;
  } else if (rel.startsWith('2024/')) {
    pipeline = pipeline.resize(1000, 1000, { fit: 'inside', withoutEnlargement: true });
    quality = 68;
  } else {
    pipeline = pipeline.resize(1200, 1200, { fit: 'inside', withoutEnlargement: true });
    quality = 68;
  }

  const buf = await pipeline
    .jpeg({ quality, mozjpeg: true, chromaSubsampling: '4:2:0' })
    .toBuffer();
  fs.writeFileSync(filePath, buf);
  const out = await sharp(buf).metadata();
  return { width: out.width, height: out.height, bytes: buf.length };
}

async function createHeroImages() {
  for (const { src, dest } of HERO_SOURCES) {
    const srcPath = path.join(IMG_ROOT, src);
    const destPath = path.join(IMG_ROOT, dest);
    if (!fs.existsSync(srcPath)) {
      console.warn('Hero source missing:', src);
      continue;
    }
    const buf = await sharp(srcPath)
      .rotate()
      .resize(2400, 800, { fit: 'cover' })
      .jpeg({ quality: 72, mozjpeg: true })
      .toBuffer();
    fs.writeFileSync(destPath, buf);
    const meta = await sharp(buf).metadata();
    console.log(`Hero ${dest} → ${meta.width}x${meta.height}`);
  }
}

async function writeManifestFromDisk() {
  const manifest = {};
  for (const filePath of walkImages(IMG_ROOT).filter((f) => !f.endsWith('_manifest.json'))) {
    const rel = path.relative(IMG_ROOT, filePath).replace(/\\/g, '/');
    const meta = await sharp(filePath).metadata();
    if (!meta.width || !meta.height) continue;
    manifest[`/assets/img/${rel}`] = {
      width: meta.width,
      height: meta.height,
      bytes: fs.statSync(filePath).size,
    };
  }
  fs.writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`\nWrote manifest from disk: ${Object.keys(manifest).length} images`);
  return manifest;
}

async function createOvationSchematic() {
  const src = path.join(IMG_ROOT, '2024/08/12/advanced-boiler-load-controllers.jpg');
  if (!fs.existsSync(src)) {
    console.warn('Ovation source missing:', src);
    return;
  }

  const fullDest = path.join(IMG_ROOT, 'projects/ovation-control-loop-full.jpg');
  const displayDest = path.join(IMG_ROOT, 'projects/ovation-control-loop.jpg');

  const fullBuf = await sharp(src)
    .rotate()
    .resize(1600, 1600, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 72, mozjpeg: true })
    .toBuffer();
  fs.writeFileSync(fullDest, fullBuf);

  const displayBuf = await sharp(fullBuf)
    .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 72, mozjpeg: true })
    .toBuffer();
  fs.writeFileSync(displayDest, displayBuf);

  const fullMeta = await sharp(fullBuf).metadata();
  const displayMeta = await sharp(displayBuf).metadata();
  console.log(
    `Ovation schematic: display ${displayMeta.width}x${displayMeta.height}, full ${fullMeta.width}x${fullMeta.height}`,
  );
}

function walkImages(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkImages(full, out);
    } else if (/\.(jpe?g|png)$/i.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

function removePath(rel) {
  const full = path.join(IMG_ROOT, rel);
  if (!fs.existsSync(full)) return;
  fs.rmSync(full, { recursive: true, force: true });
  console.log('Removed', rel);
}

async function main() {
  if (process.argv.includes('--manifest-only')) {
    await writeManifestFromDisk();
    return;
  }

  await createOvationSchematic();

  const manifest = {};
  const files = walkImages(IMG_ROOT).filter((f) => !f.endsWith('_manifest.json'));

  for (const filePath of files.sort()) {
    const rel = path.relative(IMG_ROOT, filePath).replace(/\\/g, '/');
    try {
      const info = await optimizeRaster(filePath);
      if (info) {
        manifest[`/assets/img/${rel}`] = {
          width: info.width,
          height: info.height,
          bytes: info.bytes,
        };
        console.log(`Optimised ${rel} → ${info.width}x${info.height} (${info.bytes} B)`);
      }
    } catch (err) {
      console.error('Failed', rel, err.message);
    }
  }

  for (const name of CAMERA_ORIGINALS) {
    removePath(name);
  }
  for (const rel of JUNK_PATHS) {
    removePath(rel);
  }

  await createHeroImages();
  await writeManifestFromDisk();
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
