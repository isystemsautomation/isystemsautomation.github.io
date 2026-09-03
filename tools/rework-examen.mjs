#!/usr/bin/env node
/**
 * One-shot rework: light theme CSS, 1.5× type (24px base), plain ASCII text.
 * Run: node tools/rework-examen.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FILE = path.join(ROOT, 'src/examen/index.html');

const NEW_STYLE = `<style>
:root{
  --sea:#F4F6F7;
  --shoal:#FFFFFF;
  --shoal-2:#E9EDEF;
  --chart:#16202A;
  --chart-dim:#5A6B73;
  --port:#B4271F;
  --starboard:#1E7A44;
  --sector:#966508;
  --line:rgba(22,32,42,.14);
  --r:0.167rem;
  --sp:22px;
}
*,*::before,*::after{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{
  margin:0; background:var(--sea); color:var(--chart);
  font-family:"IBM Plex Sans",system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
  font-size:24px; line-height:1.5; font-variant-numeric:tabular-nums;
  -webkit-font-smoothing:antialiased;
  padding-bottom:env(safe-area-inset-bottom);
}
button{font:inherit;color:inherit;background:none;border:none;cursor:pointer}
:focus-visible{outline:2px solid var(--sector);outline-offset:2px}
@media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}

.wrap{max-width:760px;margin:0 auto;padding:calc(var(--sp)*1.5) var(--sp) 2.667rem}

.top{display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
     padding-bottom:0.583rem;border-bottom:1px solid var(--line);margin-bottom:0.917rem}
.top h1{margin:0;font-size:1.0625rem;font-weight:600;letter-spacing:.01em}
.top .sub{color:var(--chart-dim);font-size:.8125rem}

.overall{display:flex;gap:0.125rem;margin-bottom:0.333rem}
.overall i{flex:1;height:0.208rem;border-radius:0.042rem;background:var(--shoal-2)}
.overall i.g{background:var(--starboard)} .overall i.y{background:var(--sector)}
.overall i.r{background:var(--port)}
.overall-note{color:var(--chart-dim);font-size:.8125rem;margin:0 0 1.083rem}

.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(6.5rem,1fr));gap:0.417rem}
.tile{position:relative;background:var(--shoal);border:1px solid var(--line);
      border-radius:var(--r);padding:0.5rem 0.5rem 0.417rem;text-align:left;
      display:flex;flex-direction:column;gap:0.083rem;min-height:5.5rem;
      box-shadow:0 1px 2px rgba(22,32,42,.08);
      transition:background .12s ease,border-color .12s ease,box-shadow .12s ease}
.tile:hover{background:var(--shoal-2)}
.tile .no{font-size:.75rem;color:var(--chart-dim)}
.tile .sc{font-size:1.5rem;font-weight:600;line-height:1.1;margin-top:auto}
.tile .st{font-size:.75rem;color:var(--chart-dim)}
.tile::after{content:"";position:absolute;left:0;right:0;bottom:0;height:0.125rem;
             border-radius:0 0 var(--r) var(--r);background:transparent}
.tile.r::after{background:var(--port)} .tile.y::after{background:var(--sector)}
.tile.g::after{background:var(--starboard)}
.tile.g .sc{color:var(--starboard)} .tile.y .sc{color:var(--sector)}
.tile.r .sc{color:var(--port)}

.acts{display:flex;flex-wrap:wrap;gap:0.333rem;margin:1.083rem 0 0}
.btn{background:var(--shoal);border:1px solid var(--line);border-radius:var(--r);
     padding:0.667rem 0.667rem;font-size:.9375rem;font-weight:500}
.btn:hover{background:var(--shoal-2)}
.btn.primary{background:var(--starboard);border-color:var(--starboard);color:#fff}
.btn.primary:hover{filter:brightness(1.08)}
.btn:disabled{opacity:.4;cursor:not-allowed}
.btn.ghost{background:none}

.qhead{display:flex;align-items:center;gap:0.5rem;margin-bottom:0.583rem}
.qhead .back{color:var(--chart-dim);font-size:.875rem}
.qhead .pos{margin-left:auto;color:var(--chart-dim);font-size:.875rem}
.ticks{display:flex;gap:0.125rem;margin-bottom:0.917rem}
.ticks i{flex:1;height:0.167rem;border-radius:0.042rem;background:var(--shoal-2);cursor:pointer}
.ticks i.done{background:var(--chart-dim)}
.ticks i.cur{background:var(--chart)}
.sect{color:var(--chart-dim);font-size:.8125rem;margin:0 0 0.25rem}
.qtext{font-size:1.1875rem;font-weight:500;line-height:1.4;margin:0 0 0.917rem}
.opts{display:flex;flex-direction:column;gap:0.333rem}
.opt{display:flex;gap:0.5rem;align-items:flex-start;text-align:left;
     background:var(--shoal);border:1px solid var(--line);border-radius:var(--r);
     padding:0.667rem 0.667rem;line-height:1.45;transition:background .12s,border-color .12s}
.opt:hover{background:var(--shoal-2)}
.opt .k{flex:0 0 auto;font-weight:600;color:var(--chart-dim);min-width:1.2em}
.opt.sel{border-color:var(--chart);background:var(--shoal-2)}
.opt.sel .k{color:var(--chart)}
.nav{display:flex;gap:0.333rem;margin-top:0.917rem}
.nav .btn{flex:1}

.score{text-align:center;padding:1.417rem 0 0.333rem}
.score .big{font-size:4rem;font-weight:600;line-height:1}
.score .of{color:var(--chart-dim);font-size:.9375rem;margin-top:0.167rem}
.score.g .big{color:var(--starboard)} .score.y .big{color:var(--sector)}
.score.r .big{color:var(--port)}
.verdict{text-align:center;font-size:1rem;margin:0.417rem 0 1.083rem}
.rev{margin-top:1.25rem}
.rev h2{font-size:.9375rem;font-weight:600;margin:0 0 0.5rem;padding-bottom:0.333rem;
        border-bottom:1px solid var(--line)}
.item{border-left:0.125rem solid var(--port);padding:0.083rem 0 0.083rem 0.583rem;margin-bottom:0.917rem}
.item.ok{border-left-color:var(--starboard)}
.item .q{font-weight:500;margin:0 0 0.333rem}
.item .line{font-size:.9375rem;margin:0 0 0.167rem}
.item .bad{color:var(--port)} .item .good{color:var(--starboard)}
.item .lab{color:var(--chart-dim)}
.empty{color:var(--chart-dim);text-align:center;padding:1.667rem 0}
.hist{color:var(--chart-dim);font-size:.8125rem;margin-top:0.25rem}
</style>`;

const DIACRITIC_MAP = {
  ă: 'a', â: 'a', Ă: 'A', Â: 'A', ã: 'a', Ã: 'A',
  î: 'i', Î: 'I',
  ș: 's', ş: 's', Ș: 'S', Ş: 'S',
  ț: 't', ţ: 't', Ț: 'T', Ţ: 'T',
  ƫ: 't',
};

function toAscii(text) {
  let out = '';
  for (const ch of text) {
    if (DIACRITIC_MAP[ch]) {
      out += DIACRITIC_MAP[ch];
      continue;
    }
    switch (ch) {
      case '·':
        out += ' / ';
        break;
      case '–':
      case '—':
        out += '-';
        break;
      case '‘':
      case '’':
        out += "'";
        break;
      case '“':
      case '”':
        out += "'";
        break;
      case '←':
        out += '<-';
        break;
      default:
        out += ch;
    }
  }
  out = out.replace(/(\d)°(\d)/g, '$1.$2');
  out = out.replace(/°/g, '');
  return out;
}

function extractArrayLiteral(html, marker) {
  const start = html.indexOf(marker);
  if (start < 0) throw new Error(`Missing ${marker}`);
  let rest = html.slice(start + marker.length).trimStart();
  if (!rest.startsWith('[')) throw new Error('QUESTIONS must start with [');
  let depth = 0;
  for (let i = 0; i < rest.length; i++) {
    if (rest[i] === '[') depth++;
    else if (rest[i] === ']') {
      depth--;
      if (depth === 0) {
        return {
          before: html.slice(0, start + marker.length),
          arrayText: rest.slice(0, i + 1),
          after: rest.slice(i + 1),
        };
      }
    }
  }
  throw new Error('Unclosed QUESTIONS array');
}

function transliterateQuestionData(value) {
  if (typeof value === 'string') return toAscii(value);
  if (Array.isArray(value)) return value.map(transliterateQuestionData);
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = transliterateQuestionData(v);
    return out;
  }
  return value;
}

function countNonAscii(text) {
  return [...text].filter((c) => c.charCodeAt(0) > 127).length;
}

let html = fs.readFileSync(FILE, 'utf8');
html = html.replace(/<style>[\s\S]*?<\/style>/, NEW_STYLE);

const parts = extractArrayLiteral(html, 'const QUESTIONS =');
const questions = Function(`"use strict"; return (${parts.arrayText});`)();
if (questions.length !== 494) throw new Error(`Expected 494 questions, got ${questions.length}`);

const asciiQuestions = transliterateQuestionData(questions);
const newArray = JSON.stringify(asciiQuestions);
html = `${parts.before}${newArray}${parts.after}`;

const beforeAscii = html;
html = toAscii(html);

html = html.replace(
  /n\.style\.cssText = 'position:fixed;left:50%;bottom:24px;transform:translateX\(-50%\);background:var\(--port\);color:#fff;padding:10px 18px;border-radius:4px;font-size:\.9375rem;z-index:9;max-width:90vw'/,
  "n.style.cssText = 'position:fixed;left:50%;bottom:1rem;transform:translateX(-50%);background:var(--port);color:#fff;padding:0.417rem 0.75rem;border-radius:0.167rem;font-size:.9375rem;z-index:9;max-width:90vw'",
);

const replaced = countNonAscii(beforeAscii) - countNonAscii(html) + countNonAscii(parts.arrayText);
const remaining = countNonAscii(html);
if (remaining) {
  const chars = [...new Set([...html].filter((c) => c.charCodeAt(0) > 127))];
  throw new Error(`Non-ASCII remains (${remaining}): ${chars.join(' ')}`);
}

fs.writeFileSync(FILE, html);
console.log('Questions:', questions.length);
console.log('Non-ASCII characters removed:', countNonAscii(beforeAscii) + countNonAscii(parts.arrayText));
console.log('Written', FILE);
