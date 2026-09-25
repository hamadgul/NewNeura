/**
 * Five assertions that `npm run check` could not previously make:
 *   1. every /site/images|videos literal in src/ resolves on disk
 *   2. every `out` in every shot config exists
 *   3. per-slug minimum shot count — zero captures is a hard failure
 *   4. declared width/height literals match actual pixels
 *   5. every image referenced under src/components/site/work/ carries a
 *      non-empty alt, except the frozen covers listed in FROZEN_COVERS
 *
 * Two passes happen before any assertion runs, per file:
 *
 *   a. `stripComments` removes `/* ... *\/` blocks and `// ...` line tails from
 *      the raw text (a hand-rolled scanner, not a parser dependency) so a JSDoc
 *      example like `/site/images/<file>` is never read as a real reference.
 *      It tracks string/template-literal boundaries so a `//` inside a URL
 *      string (e.g. `https://neuragul.com`) is never mistaken for a comment.
 *
 *   b. `resolveIdents` finds this file's own `const <IDENT> = "/site/images"`
 *      (or "/site/videos") declarations and substitutes `${<IDENT>}` with that
 *      literal base path everywhere it appears — so `${IMAGES}/x.jpg` and
 *      `${IMG}/x.jpg` both become the plain literal `/site/images/x.jpg` before
 *      any assertion regex runs. Any identifier name works; nothing is
 *      hardcoded to "IMAGES". This matters because the case-study COVER images
 *      — the single riskiest asset this whole plan touches — are declared with
 *      `${IMG}` in src/components/site/{home,about,process}/content.ts and all
 *      nine src/components/site/services/*​/content.ts, not `${IMAGES}`.
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

/**
 * Removes `/* block *\/` and `// line` comments from source text with a small
 * character-scanning state machine, not a regex or a parser dependency.
 * Quoted strings and template literals are copied through verbatim (including
 * any `//` or `/*` they contain) so a URL like `https://neuragul.com` inside a
 * string is never treated as the start of a comment.
 */
function stripComments(text) {
  let out = "";
  let i = 0;
  const n = text.length;
  while (i < n) {
    const c = text[i];
    const c2 = text[i + 1];
    // A backslash always escapes the very next character, even at the top
    // level outside a string or template — a regex literal like
    // `/\/site\/images\//` relies on this. Without it, the escaped slash's
    // `/` sits directly next to the regex's own closing `/`, and that pair
    // reads as a `//` line-comment start, silently eating the rest of the
    // line. Consuming the backslash and the character it escapes as one
    // atomic unit means the scanner never lands on that `/` on its own.
    if (c === "\\" && i + 1 < n) {
      out += c + c2;
      i += 2;
      continue;
    }
    if (c === "/" && c2 === "/") {
      while (i < n && text[i] !== "\n") i++;
      continue;
    }
    if (c === "/" && c2 === "*") {
      i += 2;
      while (i < n && !(text[i] === "*" && text[i + 1] === "/")) i++;
      i += 2;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      const quote = c;
      out += c;
      i++;
      while (i < n && text[i] !== quote) {
        if (text[i] === "\\" && i + 1 < n) {
          out += text[i] + text[i + 1];
          i += 2;
        } else {
          out += text[i];
          i++;
        }
      }
      if (i < n) {
        out += text[i];
        i++;
      }
      continue;
    }
    out += c;
    i++;
  }
  return out;
}

// Any file's own `const <IDENT> = "/site/images"` / `"/site/videos"` — the
// identifier name is never assumed, only discovered.
const CONST_DECL_RE = /const\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*=\s*["'](\/site\/(?:images|videos))["']/g;

function buildIdentMap(text) {
  const map = new Map();
  for (const m of text.matchAll(CONST_DECL_RE)) map.set(m[1], m[2]);
  return map;
}

// Plain string substitution (no regex) — safe for identifiers containing `$`.
function resolveIdents(text, identMap) {
  let resolved = text;
  for (const [ident, base] of identMap) {
    resolved = resolved.split(`\${${ident}}`).join(base);
  }
  return resolved;
}

const srcFiles = walk(join(ROOT, "src")).filter((f) => /\.(ts|tsx)$/.test(f));

// Comment-stripped, identifier-resolved text per file, computed once and
// shared by all five assertions below.
const fileTexts = srcFiles.map((f) => {
  const raw = readFileSync(f, "utf8");
  const stripped = stripComments(raw);
  const resolved = resolveIdents(stripped, buildIdentMap(stripped));
  return { f, resolved };
});

// (1) every referenced asset exists
const ASSET_RE = /["`](\/site\/(?:images|videos)\/[^"`${}]+)["`]/g;
const referenced = new Map(); // assetPath -> [srcFile]
for (const { f, resolved } of fileTexts) {
  for (const m of resolved.matchAll(ASSET_RE)) {
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
//
// `sips` is macOS-only (it ships with the OS; there is no Linux or Windows
// build). This script deliberately takes no image-parsing dependency, so on
// any other platform assertion (4) cannot run: the first call records ONE
// clear failure naming the limitation instead of an opaque ENOENT stack, and
// every later call is skipped so the failure list is not flooded.
let sipsUnavailable = false;
function pixels(file) {
  if (sipsUnavailable) return null;
  try {
    const out = execFileSync("sips", ["-g", "pixelWidth", "-g", "pixelHeight", file], {
      encoding: "utf8",
    });
    const w = /pixelWidth:\s*(\d+)/.exec(out);
    const h = /pixelHeight:\s*(\d+)/.exec(out);
    return w && h ? { width: +w[1], height: +h[1] } : null;
  } catch (e) {
    if (e && e.code === "ENOENT") {
      sipsUnavailable = true;
      fail(
        `assertion (4) skipped: \`sips\` not found — it is a macOS-only tool, so ` +
          `declared-vs-actual pixel checks run only on macOS (platform: ${process.platform})`
      );
      return null;
    }
    throw e;
  }
}
// `url:` alongside `src:` because the same declared-dimension convention is
// used both by component image props (`src`) and by `metadata.openGraph.images`
// entries (`url`) — e.g. src/app/page.tsx and src/app/layout.tsx's hero-poster
// OG image. Excluding `url:` would leave two of the 15 known single-line
// declarations permanently unreachable regardless of the newline fix below.
const DECL_RE =
  /(?:src|url):\s*[`"'](\/site\/images\/[^`"']+)[`"'][\s\S]{0,400}?width:\s*(\d+),\s*height:\s*(\d+)/g;
for (const { f, resolved } of fileTexts) {
  for (const m of resolved.matchAll(DECL_RE)) {
    const rel = m[1];
    const abs = join(PUBLIC, rel);
    if (!existsSync(abs)) continue; // already reported by (1)
    if (extname(abs) === ".svg") continue;
    const actual = pixels(abs);
    if (actual && (actual.width !== +m[2] || actual.height !== +m[3])) {
      fail(
        `${rel}: declared ${m[2]}x${m[3]} but file is ${actual.width}x${actual.height} ` +
          `(${f.replace(ROOT + "/", "")})`
      );
    }
  }
}

// (5) non-empty alt on every image referenced under src/components/site/work/
//
// FROZEN_COVERS are pre-existing project/header cover images that this site
// legitimately ships with alt="" by convention (decorative backdrop behind an
// eyebrow/label/title, not informative content). They predate this check and
// are not screenshots this plan captures. Do NOT add a new file here to
// silence a real finding — a screenshot with an empty alt is exactly the
// defect assertion (5) exists to catch. This list only exempts the frozen set
// below; anything else with an empty alt under /site/work/ is a real failure.
//
// ALT_RE matches ANY /site/images/<name>.(jpg|png), hyphenated or not. An
// earlier version required a hyphen in the name (the "<slug>-<shot>" shape
// the runner writes), which meant twelve of the seventeen entries below —
// every single-word cover such as `vintus.jpg` or `nyff.jpg` — could never
// reach the FROZEN_COVERS lookup at all, so the list only LOOKED like it was
// exempting them and a future non-hyphenated screenshot with an empty alt
// would have passed unseen. The ledger's "5 inert entries" note had the
// count backwards for the same reason: the five hyphenated names were the
// only ones that were ever checked. Now every name in the list is reachable
// and every committed cover is checked.
const FROZEN_COVERS = new Set([
  "packship.jpg",
  "delivery-routing.jpg",
  "foodtruckrentals.jpg",
  "nyff.jpg",
  "nymm.jpg",
  "pizzeria.jpg",
  "hasinahijama.jpg",
  "landscapedrainage.jpg",
  // Added 2026-09-25: the two new case studies' header covers, which follow
  // the same decorative-backdrop alt="" convention as every cover above.
  "yankocy.jpg",
  "halalbridal.jpg",
  "rwd-pipeline.jpg",
  "mechanicseo.png",
  "conversion.png",
  "hero-poster.jpg",
  "footer_image.png",
  "logo.png",
  "about-studio.jpg",
  "packship-stacked.jpg",
]);
const ALT_RE =
  /src:\s*[`"'](\/site\/images\/[a-z0-9_-]+\.(?:jpg|png))[`"'][\s\S]{0,200}?alt:\s*(""|"[^"]+")/g;
for (const { f, resolved } of fileTexts) {
  // Scoped to src/components/site/work/ on purpose, narrower than the plan's
  // unscoped wording. The case-study screenshots this plan captures are
  // referenced only from the work pages (the per-project content.ts files
  // and the /work/ index), so that is where an empty alt on one of them can
  // appear. Outside work/ — home, about, process and the services pages —
  // the same cover files are used as decorative card/backdrop media with
  // alt="" by the source site's convention, and asserting on them there
  // would flag that convention, not a defect. Widen this only if a captured
  // screenshot is ever referenced from outside work/.
  if (!f.includes("/site/work/")) continue;
  for (const m of resolved.matchAll(ALT_RE)) {
    const name = m[1].split("/").pop();
    if (FROZEN_COVERS.has(name)) continue;
    if (m[2] === '""') {
      fail(`${name}: empty alt in ${f.replace(ROOT + "/", "")} — screenshots are not decorative`);
    }
  }
}

// (2) + (3) shot configs
const shotsDir = join(ROOT, "scripts", "shots");
if (existsSync(shotsDir)) {
  const configs = readdirSync(shotsDir).filter((f) => f.endsWith(".config.mjs"));
  for (const c of configs) {
    let cfg;
    try {
      ({ default: cfg } = await import(join(shotsDir, c)));
    } catch (e) {
      // A config that throws at import time (e.g. defineShots rejecting a
      // malformed shape) must not crash the whole run — every assertion
      // already collected above would be discarded along with it.
      fail(`${c}: ${e.message}`);
      continue;
    }
    for (const s of cfg.shots) {
      const name = s.out.startsWith("cover:") ? s.out.slice(6) : s.out;
      const abs = join(PUBLIC, "site", "images", name);
      if (!existsSync(abs)) {
        // Assertion (3) — zero real captures is a hard failure — is delivered
        // here, per shot: `defineShots` already refuses an empty `shots`
        // array at import time (see _schema.mjs), so the only way a slug
        // ships with zero real captures is every one of its declared shots
        // failing this existence check.
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
