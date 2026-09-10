// scripts/capture-case-study-shots.mjs
/**
 * Boots nothing itself — the operator starts the target app (see the plan's per-project
 * tasks for the exact command and port) and passes --base. Keeping boot out of this file
 * is deliberate: each source repo has its own launch constraints, and encoding them here
 * would put repo-specific knowledge in NewNeura.
 *
 *   node scripts/capture-case-study-shots.mjs <slug> --base http://localhost:3101
 *
 * Prerequisite (one-time, not run by `npm install`): `npx playwright install chromium`.
 * We deliberately do not wire this into a postinstall hook — nobody expects a plain
 * `npm install` to download a ~180MB browser — so a fresh clone's first `npm run shots`
 * needs that command run by hand once. If the browser binary is missing, this script
 * detects it and exits with the exact command to run (see the catch around
 * chromium.launch() below) rather than surfacing Playwright's raw ENOENT.
 *
 * deviceScaleFactor is 2 so captured JPEGs are crisp on retina displays, but
 * that alone would double the on-disk pixel dimensions past what
 * check-assets.mjs expects (it asserts actual pixels == configured
 * viewport.width/height). `page.screenshot({ scale: "css" })` is what keeps
 * the two in agreement: it tells Playwright to size the output image in CSS
 * pixels (i.e. viewport size) while still rendering at 2x internally for
 * sharpness, rather than "device" scale which would emit viewport*dpr pixels.
 * Verified empirically — see task-3-report.md — a 1600x1000 viewport with
 * deviceScaleFactor:2 and scale:"css" produced a 1600x1000 file, not
 * 3200x2000.
 */
import { chromium } from "playwright";
import { mkdirSync, existsSync, unlinkSync } from "node:fs";
import { join, resolve, sep } from "node:path";

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
const outDir = resolve(process.cwd(), "public", "site", "images");
mkdirSync(outDir, { recursive: true });

let browser;
try {
  browser = await chromium.launch();
} catch (e) {
  // Playwright's own error for a missing browser binary is a long stack trace
  // pointing at an internal path — actionable only if you already know the
  // fix. Ten later tasks invoke this unattended against a possibly-fresh
  // clone, so name the exact command instead of letting that trace surface.
  console.error("capture-case-study-shots: failed to launch chromium.");
  console.error(`  ${e.message.split("\n")[0]}`);
  console.error("  If this is a missing-browser error, run:");
  console.error("    npx playwright install chromium");
  process.exit(1);
}

let captured = 0;
let failure = null;

try {
  for (const shot of cfg.shots) {
    const name = shot.out.startsWith("cover:") ? shot.out.slice(6) : shot.out;
    const dest = join(outDir, name);
    // Second line of defence against a traversal `out` — `_schema.mjs`
    // already rejects "/", "\", and ".." at config-authoring time, but this
    // check holds even if that guard is ever bypassed or a config file skips
    // defineShots entirely: the resolved write path must stay inside outDir.
    if (!(dest === outDir || dest.startsWith(outDir + sep))) {
      failure = { name: shot.out, reason: `resolves outside ${outDir}: ${dest}` };
      break;
    }

    let context;
    try {
      context = await browser.newContext({
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

      // `networkidle` fires once network activity settles, but that's before
      // web fonts finish swapping in and before below-the-fold `loading="lazy"`
      // images even start fetching. A screenshot that races either has the
      // right dimensions and a plausible byte count — it passes every
      // automated check we have — and is only catchable by a human looking at
      // it. So wait on the real signals instead of a blind timeout:
      //   1. document.fonts.ready — no more font-swap layout shift.
      //   2. scroll to the bottom and back to the top, so IntersectionObserver
      //      lazy-loading actually triggers for every image, then poll until
      //      every <img> reports complete && naturalWidth > 0.
      await page.evaluate(() => document.fonts.ready);
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
        window.scrollTo(0, 0);
      });
      await page.waitForFunction(
        () => Array.from(document.images).every((img) => img.complete && img.naturalWidth > 0),
        { timeout: 15000 }
      );
      // Short settle delay as a fallback only — not the primary mechanism —
      // for anything the two signals above don't cover (e.g. a CSS transition
      // still finishing after scroll-to-top).
      await page.waitForTimeout(150);

      await page.screenshot({ path: dest, type: "jpeg", quality: 82, scale: "css" });
      console.log(`  ✓ ${name}  ${shot.viewport.width}x${shot.viewport.height}`);
      captured += 1;
    } catch (e) {
      failure = { name: shot.out, reason: e.message.split("\n")[0] };
      // A failed shot may have left a partial/corrupt file from a screenshot
      // that started but didn't finish being reported — remove it so a later
      // check-assets.mjs run never validates a half-written capture.
      if (existsSync(dest)) unlinkSync(dest);
      break;
    } finally {
      // Always close the context, success or failure, so a mid-loop throw
      // never leaks a browser context (or, uncaught, the whole browser
      // process) past this script's exit.
      if (context) await context.close();
    }
  }
} finally {
  await browser.close();
}

if (failure) {
  console.error(`capture-case-study-shots: failed on ${failure.name}: ${failure.reason}`);
  console.error(`captured ${captured}/${cfg.shots.length} for ${slug}`);
  process.exit(1);
}

console.log(`captured ${captured}/${cfg.shots.length} for ${slug}`);
if (captured !== cfg.shots.length) process.exit(1);
