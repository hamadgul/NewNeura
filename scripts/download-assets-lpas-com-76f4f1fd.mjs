/**
 * Asset downloader for the lpas.com clone — page-key aware.
 *
 * Usage: node scripts/download-assets-lpas-com-76f4f1fd.mjs <page-key> <manifest.json>
 *
 * Writes only into public/sites/lpas-com-76f4f1fd/<page-key>/, so two pages can
 * never overwrite each other's assets. Pass `shared` as the page-key for assets
 * genuinely reused across pages (fonts, favicons, logos).
 *
 * The manifest is `{ images: [], fonts: [], favicons: [], videos: [] }` — the
 * same shape emitted by the extraction pass.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SITE = 'lpas-com-76f4f1fd';
const [pageKey, manifestPath] = process.argv.slice(2);

if (!pageKey || !manifestPath) {
  console.error('usage: node scripts/download-assets-lpas-com-76f4f1fd.mjs <page-key> <manifest.json>');
  process.exit(1);
}

const BASE = path.join(ROOT, 'public/sites', SITE, pageKey);
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const targets = [
  ...(manifest.images || []).map((url) => ({ url, dir: 'images' })),
  ...(manifest.fonts || []).map((url) => ({ url, dir: 'fonts' })),
  ...(manifest.favicons || []).map((url) => ({ url, dir: 'seo' })),
  ...(manifest.videos || []).map((url) => ({ url, dir: 'videos' })),
];

function filenameFor(url) {
  const clean = decodeURIComponent(new URL(url).pathname.split('/').pop() || 'asset');
  return clean.replace(/[^a-zA-Z0-9._-]/g, '-').replace(/-+/g, '-').slice(-120);
}

const results = { ok: [], failed: [] };

async function download({ url, dir }) {
  const outDir = path.join(BASE, dir);
  fs.mkdirSync(outDir, { recursive: true });
  const dest = path.join(outDir, filenameFor(url));
  if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
    results.ok.push({ url, dest, cached: true });
    return;
  }
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA, Referer: 'https://lpas.com/' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length === 0) throw new Error('empty body');
    fs.writeFileSync(dest, buf);
    results.ok.push({ url, dest, bytes: buf.length });
  } catch (err) {
    results.failed.push({ url, error: String(err.message || err) });
  }
}

for (let i = 0; i < targets.length; i += 4) {
  await Promise.all(targets.slice(i, i + 4).map(download));
  process.stdout.write(`\r${Math.min(i + 4, targets.length)}/${targets.length}`);
}

console.log(`\n[${pageKey}] ok: ${results.ok.length}  failed: ${results.failed.length}`);
for (const f of results.failed) console.log(`  FAIL ${f.error}  ${f.url.slice(0, 120)}`);
fs.writeFileSync(path.join(path.dirname(manifestPath), 'download-results.json'), JSON.stringify(results, null, 2));
