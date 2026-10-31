// Deterministic site checks, zero dependencies: node scripts/check.mjs
//  1. JS parses  2. locale files share en.json's keys  3. every data-i18n key exists in en.json
//  4. local href/src/srcset targets in tracked pages exist (Vercel cleanUrls: /x -> x.html)
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const tracked = execFileSync('git', ['ls-files'], { cwd: root, encoding: 'utf8' }).split('\n').filter(Boolean);
const errors = [];

// `node --check file.js` silently passes syntax errors in extensionless-module files (no package.json),
// so check the source over stdin, once as a module and once as a script.
const parses = (src, type) => {
  try { execFileSync(process.execPath, ['--check', `--input-type=${type}`], { input: src, stdio: 'pipe' }); return null; }
  catch (e) { return String(e.stderr); }
};
for (const f of tracked.filter((p) => /\.(js|mjs)$/.test(p))) {
  const src = readFileSync(join(root, f), 'utf8');
  const asModule = parses(src, 'module');
  if (asModule && parses(src, 'commonjs')) errors.push(`syntax: ${f}\n${asModule}`);
}

const flat = (obj, prefix = '') => Object.entries(obj).flatMap(([k, v]) =>
  v && typeof v === 'object' && !Array.isArray(v) ? flat(v, `${prefix}${k}.`) : [`${prefix}${k}`]);
const locales = Object.fromEntries(tracked.filter((p) => /^i18n\/.+\.json$/.test(p))
  .map((p) => [p, new Set(flat(JSON.parse(readFileSync(join(root, p), 'utf8'))))]));
const en = locales['i18n/en.json'];
for (const [p, keys] of Object.entries(locales)) {
  const missing = [...en].filter((k) => !keys.has(k));
  const extra = [...keys].filter((k) => !en.has(k));
  if (missing.length) errors.push(`${p}: ${missing.length} keys missing vs en.json, e.g. ${missing.slice(0, 3).join(', ')}`);
  if (extra.length) errors.push(`${p}: ${extra.length} keys not in en.json, e.g. ${extra.slice(0, 3).join(', ')}`);
}

const exists = (from, ref) => {
  const clean = decodeURIComponent(ref.split('#')[0].split('?')[0]);
  if (!clean) return true;
  const p = clean.startsWith('/') ? join(root, clean) : join(root, dirname(from), clean);
  return existsSync(p) || existsSync(`${p}.html`) || existsSync(join(p, 'index.html'));
};
for (const f of tracked.filter((p) => p.endsWith('.html'))) {
  const html = readFileSync(join(root, f), 'utf8');
  for (const [, key] of html.matchAll(/data-i18n(?:-[a-z]+)?="([^"]+)"/g)) {
    if (!en.has(key.replace(/^[a-z-]+:/, ""))) errors.push(`${f}: data-i18n key "${key}" not in en.json`);
  }
  for (const [, ref] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    if (/^(https?:|\/\/|mailto:|tel:|data:|javascript:|#)/.test(ref) || ref.includes('${')) continue;
    if (!exists(f, ref)) errors.push(`${f}: broken local reference "${ref}"`);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  console.error(`\n${errors.length} problem(s)`);
  process.exit(1);
}
console.log(`ok: ${tracked.length} tracked files, ${Object.keys(locales).length} locales, ${tracked.filter((p) => p.endsWith('.html')).length} pages`);
