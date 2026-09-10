/**
 * Five assertions that `npm run check` could not previously make:
 *   1. every /site/images|videos literal in src/ resolves on disk
 *   2. every `out` in every shot config exists
 *   3. per-slug minimum shot count — zero captures is a hard failure
 *   4. declared width/height literals match actual pixels
 *   5. every <slug>-* image is referenced with a non-empty alt
 */
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, extname } from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = process.cwd();
const PUBLIC = join(ROOT, "public");
const failures = [];
const fail = (msg) => failures.push(msg);

function walk(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const srcFiles = walk(join(ROOT, "src")).filter((f) => /\.(ts|tsx)$/.test(f));

// (1) every referenced asset exists
const ASSET_RE = /["`](\/site\/(?:images|videos)\/[^"`${}]+)["`]/g;
const referenced = new Map(); // assetPath -> [srcFile]
for (const f of srcFiles) {
  const text = readFileSync(f, "utf8");
  for (const m of text.matchAll(ASSET_RE)) {
    if (!referenced.has(m[1])) referenced.set(m[1], []);
    referenced.get(m[1]).push(f);
  }
}
for (const [asset, where] of referenced) {
  if (!existsSync(join(PUBLIC, asset))) {
    fail(`missing asset ${asset} referenced by ${where[0].replace(ROOT + "/", "")}`);
  }
}

// (4) declared width/height match actual pixels
function pixels(file) {
  const out = execFileSync("sips", ["-g", "pixelWidth", "-g", "pixelHeight", file], {
    encoding: "utf8",
  });
  const w = /pixelWidth:\s*(\d+)/.exec(out);
  const h = /pixelHeight:\s*(\d+)/.exec(out);
  return w && h ? { width: +w[1], height: +h[1] } : null;
}
const DECL_RE =
  /src:\s*(?:`\$\{IMAGES\}(\/[^`]+)`|["'](\/site\/images\/[^"']+)["'])[\s\S]{0,400}?width:\s*(\d+),\s*\n\s*height:\s*(\d+)/g;
for (const f of srcFiles) {
  const text = readFileSync(f, "utf8");
  for (const m of text.matchAll(DECL_RE)) {
    const rel = m[1] ? `/site/images${m[1]}` : m[2];
    const abs = join(PUBLIC, rel);
    if (!existsSync(abs)) continue; // already reported by (1)
    if (extname(abs) === ".svg") continue;
    const actual = pixels(abs);
    if (actual && (actual.width !== +m[3] || actual.height !== +m[4])) {
      fail(
        `${rel}: declared ${m[3]}x${m[4]} but file is ${actual.width}x${actual.height} ` +
          `(${f.replace(ROOT + "/", "")})`
      );
    }
  }
}

// (5) non-empty alt on every <slug>-* screenshot
const ALT_RE = /src:\s*`\$\{IMAGES\}\/([a-z0-9-]+-[a-z0-9-]+\.(?:jpg|png))`[\s\S]{0,200}?alt:\s*(""|"[^"]+")/g;
for (const f of srcFiles) {
  if (!f.includes("/site/work/")) continue;
  for (const m of readFileSync(f, "utf8").matchAll(ALT_RE)) {
    if (m[2] === '""') {
      fail(`${m[1]}: empty alt in ${f.replace(ROOT + "/", "")} — screenshots are not decorative`);
    }
  }
}

// (2) + (3) shot configs
const shotsDir = join(ROOT, "scripts", "shots");
if (existsSync(shotsDir)) {
  const configs = readdirSync(shotsDir).filter((f) => f.endsWith(".config.mjs"));
  for (const c of configs) {
    const { default: cfg } = await import(join(shotsDir, c));
    if (cfg.shots.length === 0) fail(`${c}: zero shots declared`);
    for (const s of cfg.shots) {
      const name = s.out.startsWith("cover:") ? s.out.slice(6) : s.out;
      const abs = join(PUBLIC, "site", "images", name);
      if (!existsSync(abs)) {
        fail(`${c}: declared shot ${name} was never captured`);
        continue;
      }
      const bytes = statSync(abs).size;
      if (s.minBytes && bytes < s.minBytes) {
        fail(`${name}: ${bytes}B is below declared minBytes ${s.minBytes} — likely a blank capture`);
      }
      const actual = pixels(abs);
      if (actual && (actual.width !== s.viewport.width || actual.height !== s.viewport.height)) {
        fail(
          `${name}: captured ${actual.width}x${actual.height}, config declares ` +
            `${s.viewport.width}x${s.viewport.height}`
        );
      }
    }
  }
}

if (failures.length) {
  console.error(`check-assets: ${failures.length} failure(s)\n`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log(`check-assets: OK — ${referenced.size} referenced assets verified`);
