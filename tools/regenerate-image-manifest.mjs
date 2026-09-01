#!/usr/bin/env node
/** Read actual pixel sizes from src/assets/img and write _manifest.json. */
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const script = path.join(path.dirname(fileURLToPath(import.meta.url)), 'optimise-images.mjs');
const result = spawnSync(process.execPath, [script, '--manifest-only'], {
  stdio: 'inherit',
});

process.exit(result.status ?? 1);
