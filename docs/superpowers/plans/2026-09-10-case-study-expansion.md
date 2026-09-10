# Case Study Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite all ten `/work/<slug>/` case studies from the real project source on this laptop — cutting duplicated and unverifiable copy, adding evidence screenshots captured from the running projects, and placing each image beside the claim it proves.

**Architecture:** Deletion precedes addition. Shared infrastructure (integrity checks, capture runner, frozen numbers) lands first as orchestrator commits; then ten per-project agents work in one shared workspace on disjoint paths, proposing cross-page edits rather than applying them; then the orchestrator applies those serially and verifies.

**Tech Stack:** Next.js 16 / React 19 / TypeScript strict, Tailwind v4, Playwright (to be added), Node ESM scripts, `sips` for image measurement.

**Spec:** `docs/superpowers/specs/2026-09-10-case-study-expansion-design.md`

## Global Constraints

- **No writes inside any source repo** under `~/Projects` or `~/Desktop`. No `npm install`, no migrations, no builds emitting into a source repo.
- **Routing boots via `DLW_DB` only.** `api/app.py:30` reads `os.environ.get("DLW_DB") or str(DEFAULT_DB)`. Never run `./run.sh` (it hardcodes `--port 8000 --env-file .env`, loading real ANTHROPIC and GOOGLE_MAPS keys against the live `dlw-cache.sqlite`). Never touch `dlw-cache.sqlite` or its `.bak*` files. Never run `Routing/scripts/migrate_*.py`.
- **Routing API stays on port 8000.** `web/vite.config.ts:10-13` hardcodes that proxy target.
- **`~/Projects/Hijama Site` boots only from a scratch copy.** It is Next 16.3.2 and ships `node_modules/next/dist/server/lib/generate-agent-files.js`, which rewrites `AGENTS.md` and `CLAUDE.md` on `next dev`.
- **Literal paths only.** `~/Projects/Adam's%20Mobile%20Mechanic` and `~/Projects/MagicBoxer copy` are decoys beside the real directories.
- **`content.ts` imports `type` only, from every block, always.** Five blocks carry `"use client"`: `BlockWysiwyg`, `BlockIntroDouble`, `BlockMediaDouble`, `BlockImageSlider`, `BlockMediaDoubleQuote`.
- **`BlockImageSlider` is struck** from the case-study vocabulary (3:4 geometry; a 1600x1000 shot renders 473x296).
- **Image sizes:** `1200x750` covers, `1600x1000` in-page, `480x750` / `1179x2203` portraits. Target 40–250KB.
- **Cover filenames are frozen:** `packship.jpg`, `delivery-routing.jpg`, `foodtruckrentals.jpg`, `nyff.jpg`, `nymm.jpg`, `pizzeria.jpg`, `vintus.jpg`, `hasinahijama.jpg`, `landscapedrainage.jpg`, `rwd-pipeline.jpg`, plus `mechanicseo.png`, `conversion.png`. Overwrite in place at the same size; never rename.
- **`alt` must be non-empty** on every new screenshot.
- **Voice:** the site says "we", never "I". No headcount claims.
- **Agents never run `git`.** Agents never run `npm run check`; they may run `npx tsc --noEmit --incremental false`.
- **The taxonomy is frozen.** `services` / `topServices` on `PORTFOLIO_PROJECTS`, and both copies of the filter counts (`WORK_SERVICE_FILTERS` in `CollectionProjects.tsx`, `PORTFOLIO_FILTERS` in `home/content.ts`), are orchestrator-owned. A project's service tags are not an agent's to change; propose it as a cross-page delta.
- **No stock imagery and no generated filler.** A thinner page beats a padded one.

---

## Task 1: Asset integrity check

Catches the likeliest failure of this whole plan: `next/image` does not resolve a literal string `src` at build time, so an agent that captures zero screenshots passes lint, `tsc`, `next build` and an og:image grep. This task makes that a hard failure.

**Files:**
- Create: `scripts/check-assets.mjs`
- Create: `scripts/shots/_schema.mjs`
- Modify: `package.json` (the `check` script)

**Interfaces:**
- Consumes: nothing.
- Produces: `scripts/shots/_schema.mjs` exporting `defineShots(slug, shots)` returning `{slug, shots}` where each shot is `{route, viewport: {width, height}, out, minBytes, waitFor?, hideSelectors?}`. Task 2's runner and every `scripts/shots/<slug>.config.mjs` consume it. `scripts/check-assets.mjs` is invoked as `node scripts/check-assets.mjs` and exits non-zero on any failure.

- [ ] **Step 1: Write the shot-config schema helper**

```js
// scripts/shots/_schema.mjs
/**
 * Shot configs are data, not scripts. `defineShots` exists so that both the capture
 * runner and check-assets.mjs read the same shape, and so a typo in a config file is a
 * throw at import time rather than an undefined at capture time.
 */
export function defineShots(slug, shots) {
  if (!slug || typeof slug !== "string") throw new Error("defineShots: slug required");
  if (!Array.isArray(shots) || shots.length === 0) {
    throw new Error(`defineShots(${slug}): at least one shot required`);
  }
  for (const s of shots) {
    for (const key of ["route", "viewport", "out"]) {
      if (!(key in s)) throw new Error(`defineShots(${slug}): shot missing "${key}"`);
    }
    if (!s.out.startsWith(`${slug}-`) && !s.out.startsWith("cover:")) {
      throw new Error(
        `defineShots(${slug}): out "${s.out}" must start with "${slug}-" ` +
          `or "cover:" (frozen cover filenames are addressed as cover:<filename>)`
      );
    }
  }
  return { slug, shots };
}
```

- [ ] **Step 2: Write the failing check script test fixture**

Create a deliberately broken config to prove the checker fails. Run:

```bash
mkdir -p /tmp/ng-check-fixture && cat > scripts/shots/__fixture.config.mjs <<'EOF'
import { defineShots } from "./_schema.mjs";
export default defineShots("__fixture", [
  { route: "/", viewport: { width: 1600, height: 1000 }, out: "__fixture-missing.jpg", minBytes: 40000 },
]);
EOF
```

- [ ] **Step 3: Run the checker to verify it fails**

Run: `node scripts/check-assets.mjs`
Expected: FAIL — `scripts/check-assets.mjs` does not exist yet (`Cannot find module`).

- [ ] **Step 4: Write the checker**

```js
// scripts/check-assets.mjs
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
```

- [ ] **Step 5: Run it and verify the fixture fails it**

Run: `node scripts/check-assets.mjs`
Expected: FAIL with `✗ __fixture.config.mjs: declared shot __fixture-missing.jpg was never captured`

This proves assertion (3) works — the exact failure that would otherwise ship silently.

- [ ] **Step 6: Delete the fixture and re-run**

```bash
rm scripts/shots/__fixture.config.mjs
node scripts/check-assets.mjs
```
Expected: PASS — `check-assets: OK — N referenced assets verified`

If it does NOT pass, that is a real pre-existing defect. Record it; do not silence it.

- [ ] **Step 7: Wire into `npm run check`**

```json
"check": "npm run lint && npm run typecheck && node scripts/check-assets.mjs && npm run build"
```

Placed before `build` because it is fast and its failures are more legible than a build error.

- [ ] **Step 8: Commit**

```bash
git add scripts/check-assets.mjs scripts/shots/_schema.mjs package.json
git commit -m "build: assert referenced assets exist, match declared dimensions, carry alt text"
```

---

## Task 2: Filter-count check

`WORK_SERVICE_FILTERS` counts are hand-maintained number literals and the filter is client-side, so a mismatch is not even in the prerendered HTML for a grep to find. Its own comment reads *"These are HAND-MAINTAINED and nothing verifies them."*

**Files:**
- Create: `scripts/check-filter-counts.mjs`
- Modify: `package.json`
- Read: `src/components/site/shared/blocks/CollectionProjects.tsx`, `src/components/site/work/content.ts`, `src/components/site/home/content.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `node scripts/check-filter-counts.mjs`, exit non-zero on mismatch.

- [ ] **Step 1: Read the current invariant and record it**

Run: `grep -n 'WORK_SERVICE_FILTERS' -A 25 src/components/site/shared/blocks/CollectionProjects.tsx`

Write down each `{slug, count}` pair and each project's `services` / `topServices` arrays from `src/components/site/work/content.ts`. The invariant: for each filter slug, `count` equals the number of `PORTFOLIO_PROJECTS` entries whose `services` array contains that slug.

- [ ] **Step 2: Write the checker**

```js
// scripts/check-filter-counts.mjs
/**
 * WORK_SERVICE_FILTERS and PORTFOLIO_FILTERS are hand-maintained literals whose own
 * comment says nothing verifies them. The filter is client-side, so a wrong count is
 * absent from the prerendered HTML — you would have to click the pill and count cards.
 */
import { readFileSync } from "node:fs";

const work = readFileSync("src/components/site/work/content.ts", "utf8");
const collection = readFileSync(
  "src/components/site/shared/blocks/CollectionProjects.tsx",
  "utf8"
);

// Every `services: [...]` array in PORTFOLIO_PROJECTS.
const projectServices = [...work.matchAll(/services:\s*\[([^\]]*)\]/g)]
  .map((m) => m[1].match(/"([a-z-]+)"/g) || [])
  .map((a) => a.map((s) => s.replace(/"/g, "")));

const actual = new Map();
for (const list of projectServices) {
  for (const slug of list) actual.set(slug, (actual.get(slug) || 0) + 1);
}

const declared = [...collection.matchAll(/slug:\s*"([a-z-]+)"[\s\S]{0,120}?count:\s*(\d+)/g)];
if (declared.length === 0) {
  console.error("check-filter-counts: found no {slug, count} pairs — did the shape change?");
  process.exit(1);
}

const failures = [];
for (const [, slug, count] of declared) {
  const real = actual.get(slug) || 0;
  if (real !== +count) failures.push(`${slug}: declares ${count}, ${real} project(s) carry it`);
}

if (failures.length) {
  console.error("check-filter-counts: mismatch\n");
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log(`check-filter-counts: OK — ${declared.length} filters match`);
```

- [ ] **Step 3: Run it against the current tree**

Run: `node scripts/check-filter-counts.mjs`
Expected: PASS. If it fails, the counts are *already* wrong — record the mismatch and fix the literals in a separate commit before continuing.

- [ ] **Step 4: Prove it can fail**

Temporarily change one `count:` literal in `CollectionProjects.tsx` by +1, re-run, confirm a `✗` line naming that slug, then revert with `git checkout -- src/components/site/shared/blocks/CollectionProjects.tsx`.

- [ ] **Step 5: Wire in and commit**

```json
"check": "npm run lint && npm run typecheck && node scripts/check-assets.mjs && node scripts/check-filter-counts.mjs && npm run build"
```

```bash
git add scripts/check-filter-counts.mjs package.json
git commit -m "build: verify hand-maintained work filter counts against project services"
```

---

## Task 3: Capture runner

**Files:**
- Create: `scripts/capture-case-study-shots.mjs`
- Modify: `package.json` (add `playwright` devDependency and a `shots` script)

**Interfaces:**
- Consumes: `scripts/shots/_schema.mjs` `defineShots`.
- Produces: `node scripts/capture-case-study-shots.mjs <slug>` reading `scripts/shots/<slug>.config.mjs` and writing JPEGs into `public/site/images/`. Every per-project task in Tasks 8-17 invokes it.

- [ ] **Step 1: Add Playwright**

```bash
npm install --save-dev playwright@1.63.0
npx playwright install chromium
```

Playwright is not currently a dependency; a checked-in runner needs it pinned.

- [ ] **Step 2: Write the runner**

```js
// scripts/capture-case-study-shots.mjs
/**
 * Boots nothing itself — the operator starts the target app (see the plan's per-project
 * tasks for the exact command and port) and passes --base. Keeping boot out of this file
 * is deliberate: each source repo has its own launch constraints, and encoding them here
 * would put repo-specific knowledge in NewNeura.
 *
 *   node scripts/capture-case-study-shots.mjs <slug> --base http://localhost:3101
 */
import { chromium } from "playwright";
import { mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const [, , slug, ...rest] = process.argv;
if (!slug) {
  console.error("usage: capture-case-study-shots.mjs <slug> --base <url>");
  process.exit(1);
}
const baseIdx = rest.indexOf("--base");
const base = baseIdx === -1 ? null : rest[baseIdx + 1];
if (!base) {
  console.error("--base is required");
  process.exit(1);
}

const { default: cfg } = await import(`./shots/${slug}.config.mjs`);
const outDir = join(process.cwd(), "public", "site", "images");
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
let captured = 0;

for (const shot of cfg.shots) {
  const name = shot.out.startsWith("cover:") ? shot.out.slice(6) : shot.out;
  const dest = join(outDir, name);

  const context = await browser.newContext({
    viewport: shot.viewport,
    deviceScaleFactor: 2,
    // Kill animation nondeterminism so a re-run is byte-comparable.
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto(new URL(shot.route, base).href, { waitUntil: "networkidle" });

  if (shot.waitFor) await page.waitForSelector(shot.waitFor, { timeout: 15000 });
  for (const sel of shot.hideSelectors || []) {
    await page.locator(sel).evaluateAll((els) => els.forEach((e) => (e.style.visibility = "hidden")));
  }
  // Let lazy images settle; networkidle fires before decode.
  await page.waitForTimeout(600);

  await page.screenshot({ path: dest, type: "jpeg", quality: 82, scale: "css" });
  console.log(`  ✓ ${name}  ${shot.viewport.width}x${shot.viewport.height}`);
  captured += 1;
  await context.close();
}

await browser.close();
console.log(`captured ${captured}/${cfg.shots.length} for ${slug}`);
if (captured !== cfg.shots.length) process.exit(1);
```

- [ ] **Step 3: Add the script entry**

```json
"shots": "node scripts/capture-case-study-shots.mjs"
```

- [ ] **Step 4: Smoke-test against NewNeura itself**

```bash
npm run dev &            # :3000
cat > scripts/shots/__smoke.config.mjs <<'EOF'
import { defineShots } from "./_schema.mjs";
export default defineShots("__smoke", [
  { route: "/work/", viewport: { width: 1600, height: 1000 }, out: "__smoke-work.jpg", minBytes: 40000 },
]);
EOF
node scripts/capture-case-study-shots.mjs __smoke --base http://localhost:3000
```
Expected: `✓ __smoke-work.jpg 1600x1000` then `captured 1/1`.

- [ ] **Step 5: Verify the output is real, not blank**

```bash
sips -g pixelWidth -g pixelHeight public/site/images/__smoke-work.jpg
ls -l public/site/images/__smoke-work.jpg
```
Expected: 1600x1000 and a size in the 40–250KB band. A file under 40KB is a blank page — investigate before proceeding.

- [ ] **Step 6: Clean up and commit**

```bash
rm scripts/shots/__smoke.config.mjs public/site/images/__smoke-work.jpg
git add package.json package-lock.json scripts/capture-case-study-shots.mjs
git commit -m "build: add Playwright capture runner for case study screenshots"
```

---

## Task 4: Freeze the shared numbers

The `1,278 tests` figure appears **14 times across 6 files in `src/`, plus `public/llms.txt`**. If it moves after the fan-out, ten agents each propose a delta. It gets resolved once, first.

**Files:**
- Modify: `src/components/site/work/delivery-routing/content.ts`, `src/components/site/work/content.ts`, `src/components/site/services/{applied-ai,applied-ai-agents,applied-ai-evaluation,data-intelligence}/content.ts`, `public/llms.txt`
- Read-only: `~/Projects/Routing`, `~/Desktop/foodtruckrentals.com`

**Interfaces:**
- Consumes: nothing.
- Produces: three frozen integers — Routing pytest count, Routing web vitest count, Food Truck Rentals vitest count — used verbatim by Tasks 8 and 13.

- [ ] **Step 1: Re-measure the Routing pytest count**

```bash
cd ~/Projects/Routing && .venv/bin/python -m pytest --collect-only -q 2>&1 | tail -3
```

This is safe: there are no module-level DB connections, the only conftest sets `app.state.db_path` to `tmp_path`, and all eight `migrate_*.py` are `__main__`-guarded. `CLAUDE.md:104` records the previous answer as `1278 tests … as of 2026-08-17` with the note *"Re-measure before quoting either number; this line has gone stale before."*

- [ ] **Step 2: Re-measure the Routing web vitest count**

```bash
cd ~/Projects/Routing/web && npx vitest run --reporter=basic 2>&1 | tail -5
```
`CLAUDE.md:106` records 399. Record what you actually get.

- [ ] **Step 3: Re-measure the Food Truck Rentals vitest count**

```bash
cd ~/Desktop/foodtruckrentals.com && npx vitest run --reporter=basic 2>&1 | tail -5
```
The site claims 119. A crude `grep -c` over test files suggested ~163, so the claim is very likely stale. Use the runner's number, not the grep's.

- [ ] **Step 4: Enumerate every occurrence before editing**

```bash
cd /Users/hamadgul/Projects/NewNeura
grep -rn '1,278' src public/llms.txt
grep -rn '\b119\b' src public/llms.txt
grep -rn '\b399\b' src public/llms.txt
```
Write the exact count down. You will assert against it in Step 6.

- [ ] **Step 5: Replace every occurrence with the measured value**

Edit each site individually — do not run a blind global replace. The surrounding sentence often needs its grammar adjusted (e.g. "1,278 tests cover the rules" → "N tests cover the rules").

- [ ] **Step 6: Assert cardinality**

```bash
grep -rc '1,278' src public/llms.txt | grep -v ':0' || echo "old figure fully removed"
grep -ro '<NEW FIGURE>' src public/llms.txt | wc -l
```
Expected: the old figure appears zero times; the new one appears exactly as many times as Step 4 counted. **A replace that hits 8 of 10 sites looks identical to one that hits 10** — this assertion is the only thing that distinguishes them.

- [ ] **Step 7: Verify and commit**

```bash
npm run check
git add -A src public/llms.txt
git commit -m "content: re-measure and freeze test counts across all reference sites"
```

---

## Task 5: Cut the unverifiable claims

User decision, 2026-09-10: *"cut the unverifiable claims"*.

**Files:**
- Modify: `src/components/site/work/landscape-drainage-proz/content.ts` (3 sites), `src/components/site/work/foodtruckrentals/content.ts:108`, `src/components/site/services/web-development/content.ts:113`, `public/llms.txt`

**Interfaces:**
- Consumes: nothing.
- Produces: a `landscape-drainage-proz` page with no outcome metric, which Task 15 must write around rather than restore.

- [ ] **Step 1: Enumerate both claims site-wide**

```bash
grep -rn 'ripled' src public/llms.txt
grep -rn '12,100\|worth 320' src public/llms.txt
```
Expected: `tripled` in `work/landscape-drainage-proz/content.ts` ×3 (meta description, `lead`, `PROJECT_OUTCOME`), `services/web-development/content.ts`, `public/llms.txt`. The search-volume figures in `work/foodtruckrentals/content.ts:108` and `services/web-development/content.ts:113`.

- [ ] **Step 2: Remove "Tripled the client's online sales"**

Replace the `lead` with a description of what was built, not what it returned. The `PROJECT_OUTCOME` block is being deleted wholesale in Task 6, so only the `lead` and the meta description need new strings here.

- [ ] **Step 3: Remove the search-volume figures**

Delete the two sentences *"The flagship URL now targets a 12,100/mo search term. It launched on a local qualifier worth 320."* from both files. These are third-party figures with no source on disk. The surrounding claims about JSON-LD, the pricing module and the keyword-collision test all survive — they are verifiable in `~/Desktop/foodtruckrentals.com`.

- [ ] **Step 4: Assert both are gone**

```bash
grep -rn 'ripled\|12,100\|worth 320' src public/llms.txt && echo "STILL PRESENT — fix" || echo "clean"
```
Expected: `clean`

- [ ] **Step 5: Verify and commit**

```bash
npm run check
git add -A src public/llms.txt
git commit -m "content: cut unverifiable outcome and search-volume claims"
```

---

## Task 6: Cut the structural duplication

The `Outcome` block reprints the header `lead` — character-identical on six pages, re-hinged on the other four. The stack string prints twice per page.

**Files:**
- Modify: all ten `src/components/site/work/*/content.ts`, all ten `src/app/work/*/page.tsx`
- Read: `src/components/site/shared/blocks/projectIntroTabs.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: ten pages with no `PROJECT_OUTCOME` export. Tasks 8-17 must not reintroduce one that restates the `lead`; if a project has a real outcome with evidence, it becomes a `BlockWysiwyg` with its own title and new content.

- [ ] **Step 1: Prove the duplication**

```bash
for s in vintus rwd-pipeline landscape-drainage-proz new-york-mobile-mechanic \
         new-york-fine-foods restaurant-ordering-portal packship delivery-routing \
         foodtruckrentals hasina-hijama-cupping; do
  echo "--- $s"
  grep -m1 '^  lead:' src/components/site/work/$s/content.ts
  awk '/PROJECT_OUTCOME/,/^};/' src/components/site/work/$s/content.ts | grep -m1 'text:'
done
```
Expected: six exact matches, four near-matches. Record which is which.

- [ ] **Step 2: Delete `PROJECT_OUTCOME` from the six exact-duplicate files**

Remove the export and its doc comment from `content.ts`, remove the import and the `<BlockWysiwyg {...PROJECT_OUTCOME} />` line from the matching `page.tsx`.

- [ ] **Step 3: Handle the four near-duplicates**

For `packship`, `delivery-routing`, `foodtruckrentals`, `hasina-hijama-cupping`: the Outcome either carries information the `lead` does not, or it goes. Judge each on its text. `delivery-routing`'s Outcome must **stay above the media blocks** — its own comment explains why: *"the copy ends on 'the screenshots below run on synthetic data', so the screenshots have to be below it."*

- [ ] **Step 4: Resolve the doubled stack string**

Read `src/components/site/shared/blocks/projectIntroTabs.ts:20-30`. It overwrites `labels` to `["The brief", "The tech stack"]` and renders `PROJECT_DETAILS`' Stack row as a `font-L` statement; `BlockProjectDetails` prints the same string again at the page foot.

`projectIntroTabs.ts` is in `shared/**` and therefore orchestrator-owned — resolve it here, once, for all ten pages. Choose one: drop the Stack row from `PROJECT_DETAILS`, or stop feeding it to the intro tab. Prefer keeping the intro tab (it is above the fold) and dropping the redundant `BlockProjectDetails` row.

- [ ] **Step 5: Fix the stale header comments**

Every `content.ts` opens with the verbatim-source pledge this work revokes, and several describe a "What we built" label that has not rendered since `projectIntroTabs` shipped. Replace each with a note pointing at `docs/research/case-studies/<slug>.md`.

- [ ] **Step 6: Verify and commit**

```bash
npm run check
git add -A src
git commit -m "content: remove Outcome/lead and stack duplication across all ten case studies"
```

- [ ] **Step 7: Look at the pages**

```bash
npm run dev
```
Open all ten `/work/<slug>/` routes. A green build is not evidence that removing a block left a sensible page. Confirm none now ends abruptly or has a dangling heading.

---

## Task 7: Product marketing context

The copywriting skill's literal first instruction is to read `.agents/product-marketing.md` if it exists. Without it, ten agents each invent a different reading of who these pages serve.

**Files:**
- Create: `.agents/product-marketing.md`

**Interfaces:**
- Consumes: nothing.
- Produces: the file every Phase-3 copy task reads before drafting.

- [ ] **Step 1: Invoke the copywriting skill to learn the required shape**

Use `marketing-skills:copywriting` and read its guidance on product marketing context, page purpose, audience and offer.

- [ ] **Step 2: Draft the file**

Cover: who NeuraGul serves, the primary action a case study should drive, the objections a prospect brings to a case study, the proof points available, and the tone. Record the two established voice rules verbatim: the site says "we" and never "I"; nothing claims a headcount.

- [ ] **Step 3: Commit**

```bash
git add .agents/product-marketing.md
git commit -m "docs: add product marketing context for copy work"
```

---

## Task 8: Reference implementation — Delivery Routing

The richest material on the laptop and the only work page already rendering `BlockImageFull`. Its result sets the pattern the other nine follow. **Stop for user review at the end of this task.**

**Files:**
- Create: `docs/research/case-studies/delivery-routing.md`, `scripts/shots/delivery-routing.config.mjs`
- Modify: `src/components/site/work/delivery-routing/content.ts`, `src/app/work/delivery-routing/page.tsx`
- Create: `public/site/images/delivery-routing-*.jpg`
- Read-only: `~/Projects/Routing`

**Interfaces:**
- Consumes: `defineShots` from Task 1, the runner from Task 3, the frozen test counts from Task 4.
- Produces: the dossier template, the shot-naming vocabulary, and the block composition that Tasks 9-17 copy.

- [ ] **Step 1: Write the dossier**

Create `docs/research/case-studies/delivery-routing.md` with these headings, filled from the repo:

`## Stack (verified)` — from `pyproject.toml` and `web/package.json`.
`## Architecture decisions` — from `CLAUDE.md`. The material worth writing: WAL-mode backup discipline via `scripts/_backup.py::backup_database` rather than `cp`; the `fly scale count >1` prohibition because each machine gets its own volume, so two machines means two silently divergent databases; the rule that no address or patient name reaches a log, and why that changed when prod moved to Fly; the `dc_window` lower-bound invariant that otherwise files an entire group home as a time-window conflict.
`## Gaps — in the repo, absent from the page`
`## Audience, objection, primary action`
`## Verifiable numbers` — each with the command that proves it.
`## Unverifiable claims` — for the user; never written.
`## Shot list` — each entry naming the sentence it is evidence for.
`## Cross-page deltas` — empty for now.

- [ ] **Step 2: Boot Routing safely**

```bash
cd ~/Projects/Routing
cp config/dlw-config.yaml /tmp/ng-shots/dlw-config.yaml 2>/dev/null || mkdir -p /tmp/ng-shots
DLW_DB=/tmp/ng-shots/synthetic.sqlite \
  .venv/bin/uvicorn dlw_routing.api.app:create_app \
  --factory --port 8000 --app-dir src
```

**Never `./run.sh`** — it hardcodes `--env-file .env`, loading real ANTHROPIC and GOOGLE_MAPS keys, and its factory resolves to the live `dlw-cache.sqlite`. `api/app.py:30` reads `os.environ.get("DLW_DB") or str(DEFAULT_DB)`, so `DLW_DB` is the supported override; omitting `--env-file` means no real keys enter the process.

In a second shell:
```bash
cd ~/Projects/Routing/web && npx vite --port 3105
```
Port 8000 is mandatory: `web/vite.config.ts:10-13` hardcodes `/config`, `/health`, `/runs` and `/openapi.json` proxies to `http://localhost:8000`.

- [ ] **Step 3: Confirm the scratch database took effect**

```bash
curl -s localhost:8000/health
ls -l /tmp/ng-shots/synthetic.sqlite
ls -l ~/Projects/Routing/dlw-cache.sqlite
```
Expected: `{"status":"ok"}`; the scratch file exists; **the live file's mtime is unchanged from before the boot**. If the live file's mtime moved, stop immediately and report.

- [ ] **Step 4: Seed synthetic data**

Load a synthetic delivery log through the UI so the screenshots show populated routes. The site already publishes that these shots *"run on synthetic data because the client is not named here"* — that claim must stay true.

- [ ] **Step 5: Write the shot config**

```js
// scripts/shots/delivery-routing.config.mjs
import { defineShots } from "./_schema.mjs";

/**
 * Every shot names the sentence it is evidence for. A shot that is merely
 * "the home page" does not belong here.
 */
export default defineShots("delivery-routing", [
  {
    // Evidence for: "It parses the delivery log and refuses to invent anything it
    // cannot read with confidence. An unreadable row becomes a flagged task."
    route: "/",
    viewport: { width: 1600, height: 1000 },
    out: "delivery-routing-review.jpg",
    minBytes: 60000,
    waitFor: "[data-testid='review-queue'], main",
  },
  // Add the remaining shots from the dossier's shot list, same shape.
]);
```

- [ ] **Step 6: Capture**

```bash
node scripts/capture-case-study-shots.mjs delivery-routing --base http://localhost:3105
```
Expected: one `✓` per shot, then `captured N/N`. A non-zero exit means a shot failed; fix the selector rather than removing the shot.

- [ ] **Step 7: Verify the captures are real**

```bash
node scripts/check-assets.mjs
```
Expected: PASS. This is where `minBytes` catches a blank page and the dimension assert catches a wrong viewport.

- [ ] **Step 8: Write the copy**

Invoke `marketing-skills:copywriting`, having read `.agents/product-marketing.md`. Then invoke `marketing-skills:copy-editing` over both the new draft **and** the surviving original copy. Every paragraph carries a checkable noun. No length target.

- [ ] **Step 9: Recompose the page**

Choose blocks from the evidence outward — no fixed rhythm. Each screenshot sits beside the sentence it proves. Add `GeneralCta` at the foot. Do not use `BlockImageSlider`. Note this page already uses `BlockMediaDoubleQuote`; adding plain `BlockMediaDouble` beside it would give two near-identical blocks.

`content.ts` imports `type` only from every block.

- [ ] **Step 10: Verify**

```bash
npm run check
```
Expected: PASS, including `check-assets` and `check-filter-counts`.

- [ ] **Step 11: Look at it**

```bash
npm run dev
```
Open `/work/delivery-routing/` at 390px, 768px and 1440px. Confirm every image landed beside its claim, no image is cropped to illegibility, and the page reads as designed. Also open `/`, `/work/` and `/process/` — this project's cover appears on all three.

- [ ] **Step 12: Commit and STOP for review**

```bash
git add -A src docs/research/case-studies/delivery-routing.md scripts/shots/delivery-routing.config.mjs public/site/images/delivery-routing-*
git commit -m "content: expand delivery routing case study from repo source"
```

Present the page to the user before starting Task 9.

---

## Task 9: Reference implementation — Restaurant Ordering Portal

Promoted to second because it has the largest gap between what was built and what the page says. The page's entire technical content is one sentence about Square; the repo has an admin back office, a config-precedence system and 154 tests. **Stop for user review at the end of this task.**

**Files:**
- Create: `docs/research/case-studies/restaurant-ordering-portal.md`, `scripts/shots/restaurant-ordering-portal.config.mjs`
- Modify: `src/components/site/work/restaurant-ordering-portal/content.ts`, `src/app/work/restaurant-ordering-portal/page.tsx`
- Create: `public/site/images/restaurant-ordering-portal-*.jpg`
- Read-only: `~/Projects/PizzeriaSoftware`

**Interfaces:**
- Consumes: everything Task 8 produced — dossier template, shot vocabulary, block composition.
- Produces: confirmation that the Task 8 pattern transfers to an app-shaped project with authenticated routes.

- [ ] **Step 1: Write the dossier**

Same headings as Task 8. The gap section is the point of this task. Mine at minimum: the admin routes `/admin/orders`, `/admin/menu`, `/admin/analytics`, `/admin/settings`, `/admin/integrations`, `/admin/login`; the customer routes `/checkout` and `/confirmation/[orderId]`; `restaurant.config.ts`'s `config_overrides` table with DB-wins-over-env precedence and masked Square secrets; and the test suite (`uber-api-contract`, `sms-dedupe`, `delivery-retry`, `retry-cron`, `square-webhook-dispatch`).

- [ ] **Step 2: Verify the test count**

```bash
cd ~/Projects/PizzeriaSoftware && npx jest --listTests | wc -l && npx jest --listTests >/dev/null && npx jest --ci --reporters=default 2>&1 | tail -5
```
Record the real number. Do not write "154" without measuring it.

- [ ] **Step 3: Boot**

```bash
cd ~/Projects/PizzeriaSoftware && npx next dev --port 3103
```
Next 16.2.x — predates `generate-agent-files.js`, so no `AGENTS.md` mutation. `.next/` is still written; it is gitignored, so record `git -C ~/Projects/PizzeriaSoftware status --short` before and after.

- [ ] **Step 4: Reach the admin routes**

`/admin/*` sits behind `/admin/login`. Read `app/admin/login` and `lib/` to find how auth is checked, then either use a documented dev credential from the repo or add a `storageState` to the shot config. **Do not modify the repo to bypass auth.** If it cannot be reached read-only, capture only the customer-facing routes and record the limitation in the dossier.

- [ ] **Step 5: Write the shot config, capture, verify**

Same shape as Task 8 Step 5-7. Each shot names the sentence it proves.

```bash
node scripts/capture-case-study-shots.mjs restaurant-ordering-portal --base http://localhost:3103
node scripts/check-assets.mjs
```

- [ ] **Step 6: Write the copy**

`marketing-skills:copywriting` then `marketing-skills:copy-editing`. This page's brief is currently one sentence; it should end up naming the back office, the config precedence and the integration surface, because those are what was actually built.

- [ ] **Step 7: Recompose, verify, look**

Same as Task 8 Steps 9-11. Note `pizzeria.jpg` is referenced from `home`, `about`, `services/cloud-infrastructure` and `process` — check those four pages too.

- [ ] **Step 8: Commit and STOP for review**

```bash
git add -A src docs/research/case-studies/restaurant-ordering-portal.md scripts/shots/restaurant-ordering-portal.config.mjs public/site/images/restaurant-ordering-portal-*
git commit -m "content: expand restaurant ordering portal case study from repo source"
```

---

## Tasks 10-17: Fan-out

Eight remaining projects, dispatched in parallel once Tasks 8 and 9 are approved. Each agent
receives **this template in full** plus its own row from the table — an agent dispatched to Task 13
sees only Task 13, so the steps are written out here rather than cross-referenced.

### Fan-out task template

- [ ] **Step 1: Write the dossier** — `docs/research/case-studies/<slug>.md`, headings:
  `## Stack (verified)` (from the manifest, never from memory) ·
  `## Architecture decisions` · `## Gaps — in the repo, absent from the page` ·
  `## Audience, objection, primary action` ·
  `## Verifiable numbers` (each with the command that proves it) ·
  `## Unverifiable claims` (listed for the user, never written) ·
  `## Shot list` (each entry naming the sentence it is evidence for) ·
  `## Cross-page deltas` (empty until Step 8).

- [ ] **Step 2: Record the source repo's git state**

```bash
git -C "<source path>" status --short > /tmp/ng-shots/<slug>-before.txt
```

- [ ] **Step 3: Boot** using the exact command in your table row. No `npm install`, no builds
  emitting into the repo, no writes of any kind.

- [ ] **Step 4: Write `scripts/shots/<slug>.config.mjs`**

```js
import { defineShots } from "./_schema.mjs";

export default defineShots("<slug>", [
  {
    // Evidence for: "<the exact sentence this shot proves>"
    route: "/<route>",
    viewport: { width: 1600, height: 1000 },
    out: "<slug>-<name>.jpg",
    minBytes: 60000,
    waitFor: "main",
  },
]);
```

A shot that is merely "the home page" is rejected. `out` must start with `<slug>-`, or
`cover:<frozen filename>` to overwrite the cover in place at 1200x750.

- [ ] **Step 5: Capture**

```bash
node scripts/capture-case-study-shots.mjs <slug> --base http://localhost:<port>
```
Expected: one `✓` per shot, then `captured N/N`. A non-zero exit means a shot failed — fix the
selector, do not delete the shot.

- [ ] **Step 6: Verify the captures are real**

```bash
node scripts/check-assets.mjs
```
Expected: PASS. `minBytes` catches a blank page; the dimension assert catches a wrong viewport.

- [ ] **Step 7: Confirm you did not write to the source repo**

```bash
git -C "<source path>" status --short > /tmp/ng-shots/<slug>-after.txt
diff /tmp/ng-shots/<slug>-before.txt /tmp/ng-shots/<slug>-after.txt && echo "clean"
```
Expected: `clean`. Anything else — especially `AGENTS.md` or `CLAUDE.md` — stop and report.

- [ ] **Step 8: Write the copy** — read `.agents/product-marketing.md`, invoke
  `marketing-skills:copywriting` to draft, then `marketing-skills:copy-editing` over **both** the
  new draft and the surviving original copy. Every paragraph carries a checkable noun. No length
  target — padding is the failure mode here, and no automated check can catch it. Voice: "we",
  never "I"; no headcount claims.

- [ ] **Step 9: Recompose `src/app/work/<slug>/page.tsx`** — blocks chosen from the evidence
  outward, no fixed rhythm; every screenshot beside the sentence it proves; `GeneralCta` at the
  foot; **never `BlockImageSlider`**; non-empty `alt` on every screenshot; `content.ts` imports
  `type` only, from every block.

- [ ] **Step 10: Typecheck**

```bash
npx tsc --noEmit --incremental false
```
Do **not** run `npm run check` — it builds into a shared `.next`, shares one `.tsbuildinfo`, and
gates on the whole repo including other agents' in-flight work.

- [ ] **Step 11: Look at the page** at 390px, 768px and 1440px. A green typecheck is not evidence
  that an image landed where it was meant to.

- [ ] **Step 12: Record cross-page deltas and hand back.** Append to your dossier's
  `## Cross-page deltas` as `{file, anchor: <exact current string>, replacement, reason}`.
  **Do not edit any file outside your owned paths.** Do not run `git`.

**Agents never run `git`** and **never run `npm run check`** — the orchestrator commits and runs the full gate per batch.

Each agent owns only:
```
src/components/site/work/<slug>/content.ts
src/app/work/<slug>/page.tsx
public/site/images/<slug>-*.jpg   and its own frozen cover
docs/research/case-studies/<slug>.md
scripts/shots/<slug>.config.mjs
```

Cross-page edits go in the dossier's `## Cross-page deltas` as `{file, anchor: <exact current string>, replacement, reason}` — never applied by the agent.

| Task | Slug | Source | Boot | Notes |
|---|---|---|---|---|
| 10 | `packship` | `~/Projects/MagicBoxer`, `~/Projects/docs`, `~/Desktop/PackShip Files` | none | `demo/*.PNG` are 1179x2556 Jan-2025 captures of a stale UI — verify against current code before using. Stack claims are all real; `pg`/`redis` are in `backend/package.json`. Unclaimed and real: RevenueCat, Sentry, OpenAI, Express/Railway backend. |
| 11 | `new-york-mobile-mechanic` | `~/Projects/Adam's Mobile Mechanic`, `~/Desktop/NYMM Results` | `next dev --port 3101` | Literal path — `~/Projects/Adam's%20Mobile%20Mechanic` is a decoy. Repo has its own `scripts/screenshot.mjs` worth reading. `mechanicseo.png` and `conversion.png` are frozen off-pattern assets on this page. |
| 12 | `new-york-fine-foods` | `~/Projects/newyorkfinefoods` | `next dev --port 3102` | Page carries video (`nyff-hero.mp4`) as well as images; `public/site/videos/**` is orchestrator-owned. |
| 13 | `foodtruckrentals` | `~/Desktop/foodtruckrentals.com`, `~/Desktop/truckrentalsmedia` | `next dev --port 3106` | Full Next 16 repo with Vitest — the source my first survey missed. Use the vitest count frozen in Task 4. Search-volume claims were cut in Task 5; do not restore them. |
| 14 | `hasina-hijama-cupping` | `~/Projects/Hijama Site` | `next dev --port 3104`, **scratch copy only** | Next 16.3.2 rewrites its `AGENTS.md`/`CLAUDE.md` on `next dev`. Copy the repo to `/tmp/ng-shots/hijama` first and boot that. |
| 15 | `landscape-drainage-proz` | live site only | production URL | `~/Projects/ShopifySite` is empty. The outcome metric was cut in Task 5 — write around its absence, do not restore it. |
| 16 | `vintus` | live site only | production URL | No local source. |
| 17 | `rwd-pipeline` | `~/Projects/NeuraGul/assets/docs/rwd-pipeline-portfolio.pptx` | none | Extract slides as images (`soffice --headless --convert-to pdf`, then `sips`). No UI exists; this page stays text-forward. Do not invent screenshots. |

---

## Task 18: Apply cross-page deltas

Every slug greps into `process/content.ts`; nine into `home/content.ts`. Collisions are the default case.

**Files:**
- Modify: `src/components/site/{home,about,process}/content.ts`, `src/components/site/services/**`, `src/components/site/work/content.ts`, `public/llms.txt`
- Read: all ten `docs/research/case-studies/*.md`

**Interfaces:**
- Consumes: the `## Cross-page deltas` section of all ten dossiers.
- Produces: a consistent site.

- [ ] **Step 1: Collect every delta**

```bash
for f in docs/research/case-studies/*.md; do
  echo "=== $f"; awk '/## Cross-page deltas/,0' "$f"
done
```

- [ ] **Step 2: Detect collisions before applying anything**

Cross-grep every delta's `anchor` against every other delta. Two deltas touching the same anchor, or the same sentence, must be resolved into one edit **now** — applying A then B silently makes B's anchor stale and the second edit lands wrong or not at all.

- [ ] **Step 3: Order the edits**

Shared-number edits first, then per-project prose. Record the order.

- [ ] **Step 4: Apply, asserting each anchor matched**

Apply one delta at a time. If an anchor does not match exactly, stop — do not fuzzy-match.

- [ ] **Step 5: Assert cardinality**

For every changed figure or phrase, re-grep and assert the occurrence count equals what Step 1 predicted.

- [ ] **Step 6: Commit**

```bash
git add -A src public/llms.txt
git commit -m "content: apply cross-page deltas from case study rewrites"
```

---

## Task 19: Final verification

**Files:**
- Modify: `src/app/sitemap.ts` (`LAST_MODIFIED`)

- [ ] **Step 1: Full gate**

```bash
npm run check
```
Expected: PASS — lint, typecheck, `check-assets`, `check-filter-counts`, build.

- [ ] **Step 2: Bump `LAST_MODIFIED`**

Its own comment says *"Bump this constant when the copy actually changes."* Rewriting ten case studies is that.

- [ ] **Step 3: Verify og:image tags resolve**

```bash
npm run build && npm run start &
for s in packship delivery-routing new-york-mobile-mechanic new-york-fine-foods \
         foodtruckrentals vintus restaurant-ordering-portal rwd-pipeline \
         landscape-drainage-proz hasina-hijama-cupping; do
  url=$(curl -s localhost:3000/work/$s/ | grep -o 'og:image" content="[^"]*"' | head -1 | sed 's/.*content="//;s/"//')
  echo -n "$s -> $url "
  curl -s -o /dev/null -w "%{http_code}\n" "$url"
done
```
Expected: `200` for all ten. A grep of the meta tag alone proves nothing about the file — `openGraph` replaces rather than merges, and four routes once shipped with no og:image while every check stayed green.

- [ ] **Step 4: Visual pass**

Open at 390px, 768px and 1440px: all ten `/work/<slug>/` routes, plus `/`, `/work/`, `/about/`, `/process/` and the eight service sub-pages. Covers were overwritten in place, so every page carrying one changed.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "content: complete case study expansion across all ten projects"
```

---

## Notes for the executor

- **The user commits their own work.** Commit commands are written for completeness; confirm before running them.
- **Look at the pages.** Every structural check in this repo has passed while pages looked broken. A loop over an empty set prints PASS.
- **A thinner page beats a padded one.** If a project has no material for a slot, drop the slot.
