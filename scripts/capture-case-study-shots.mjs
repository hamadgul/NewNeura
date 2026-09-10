// scripts/capture-case-study-shots.mjs
/**
 * Boots nothing itself — the operator starts the target app (see the plan's per-project
 * tasks for the exact command and port) and passes --base. Keeping boot out of this file
 * is deliberate: each source repo has its own launch constraints, and encoding them here
 * would put repo-specific knowledge in NewNeura.
 *
 *   node scripts/capture-case-study-shots.mjs <slug> --base http://localhost:3101
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
import { mkdirSync } from "node:fs";
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
