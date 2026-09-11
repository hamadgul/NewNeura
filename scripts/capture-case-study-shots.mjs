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

// Announce the runner to the config before importing it. A config whose
// shots need out-of-band input (restaurant-ordering-portal's storageState,
// passed through NG_SHOTS_STORAGE_STATE) can then refuse to load under the
// runner when that input is missing — instead of silently capturing login
// pages — while still importing cleanly under check-assets.mjs, which never
// sets this and only reads the shot list.
process.env.NG_SHOTS_RUNNER = "1";
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
    // Set only at the moment `page.screenshot` is called. Every failure
    // before that point — a `goto` timeout, a missing `waitFor` selector, a
    // font/image gate timing out — leaves the file on disk exactly as it
    // was, which matters when `dest` is a tracked, frozen cover that a
    // `cover:` shot would overwrite: deleting it on a mere navigation
    // failure would take a committed asset off disk.
    let screenshotStarted = false;
    try {
      // Optional per-shot `storageState` (validated as an absolute path in
      // _schema.mjs): a Playwright cookies+localStorage file produced by a
      // scratch login script outside the repo. It is how an authenticated
      // route or a page that needs client state gets captured; a missing
      // file fails the shot by name here rather than silently capturing the
      // login page it would otherwise be redirected to.
      if (shot.storageState && !existsSync(shot.storageState)) {
        throw new Error(`storageState file not found: ${shot.storageState}`);
      }
      context = await browser.newContext({
        viewport: shot.viewport,
        deviceScaleFactor: 2,
        // Kill animation nondeterminism so a re-run is byte-comparable.
        reducedMotion: "reduce",
        ...(shot.storageState ? { storageState: shot.storageState } : {}),
      });
      const page = await context.newPage();
      // NOT "networkidle": a page with a continuously streaming response —
      // e.g. an autoplaying hero <video>, which several of our target sites
      // (this one included, plus NY Mobile Mechanic and NY Fine Foods) ship —
      // never lets the network go quiet, so "networkidle" hangs until
      // Playwright's timeout and hard-fails the whole batch. Reproduced
      // directly: this repo's own "/" times out at 30s under "networkidle"
      // while "domcontentloaded" returns immediately. It is also redundant
      // here regardless of streaming media — the readiness gates below
      // (fonts, lazy-image completion) are strictly stronger and more
      // specific than "network went quiet" for proving a page is painted. Do
      // not restore "networkidle"; it buys nothing and reintroduces the hang.
      await page.goto(new URL(shot.route, base).href, { waitUntil: "domcontentloaded" });

      if (shot.waitFor) await page.waitForSelector(shot.waitFor, { timeout: 15000 });
      for (const sel of shot.hideSelectors || []) {
        await page.locator(sel).evaluateAll((els) => els.forEach((e) => (e.style.visibility = "hidden")));
      }

      // "domcontentloaded" fires before web fonts finish swapping in, before
      // below-the-fold `loading="lazy"` images even start fetching, and
      // before a CSS `background-image` (this site uses one as a poster
      // backdrop under autoplay video, specifically to prevent a white flash
      // — see HeroIntroPanel.tsx, CardMedia.tsx, BlockMediaDoubleQuote.tsx)
      // has necessarily painted. A screenshot that races any of these has
      // the right dimensions and a plausible byte count — it passes every
      // automated check we have — and is only catchable by a human looking
      // at it. So wait on real signals instead of a blind timeout.
      //
      // This gates exactly three things: web fonts, every <img> element, and
      // every url(...) found in each element's OWN computed background-image
      // (via getComputedStyle(el) with no pseudo-element argument). It does
      // NOT gate: <video> first-frame paint, SVG <image> hrefs, anything
      // injected into the DOM after these waits complete, ::before/::after
      // pseudo-element background-image (getComputedStyle without a second
      // argument never returns pseudo-element styles — neither pattern
      // exists in src/ today, so this is a documented boundary, not a known
      // bug; walking pseudo-elements for every node would cost real time for
      // a case that doesn't exist here), or content inside a shadow root
      // (querySelectorAll("*") does not pierce shadow roots). A shot that
      // depends on one of those needs its own `waitFor` selector in its
      // config. Do not read the gates below as "the page is fully settled";
      // read them as "these three specific things are settled."
      //   1. document.fonts.ready — no more font-swap layout shift.
      //   2. scroll to the bottom and back to the top, so IntersectionObserver
      //      lazy-loading actually triggers for every image, then poll until
      //      every <img> reports complete && naturalWidth > 0.
      //   3. collect every url(...) inside a computed backgroundImage
      //      (skipping "none", CSS gradients, and data: URIs — none of those
      //      need a network wait) and wait for each to settle (load or
      //      error) before screenshotting. The browser's HTTP cache means
      //      this never refetches — <img> and background-image elements
      //      pointed at the same URL share one network request.
      await page.evaluate(() => document.fonts.ready);
      // Scrolling to the bottom and immediately back to top inside one
      // evaluate() runs both scrollTo calls synchronously with no render
      // frame in between, so IntersectionObserver never actually sees the
      // bottom-of-page state and a footer image's lazy fetch never starts.
      // A short pause between the two scrolls lets the browser paint the
      // scrolled-down frame so the observer fires before we scroll back up.
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(300);
      await page.evaluate(() => window.scrollTo(0, 0));
      // waitForFunction's signature is (pageFunction, arg, options) — with a
      // zero-arg pageFunction, an options object passed as the *second*
      // parameter is silently taken as `arg` instead, and `options` is left
      // undefined (falling back to Playwright's 30s default). Pass an
      // explicit `undefined` arg so the object lands in `options`.
      await page.waitForFunction(
        () => Array.from(document.images).every((img) => img.complete && img.naturalWidth > 0),
        undefined,
        { timeout: 15000 }
      );

      // Background images: <img> enumeration above sees none of these — a
      // CSS backgroundImage never appears in document.images. Collect every
      // fetchable url(...) via computed style first, so a shot with zero
      // background images (most shots) pays no extra cost and the caller can
      // log a real count rather than assume the gate found nothing because
      // it's broken.
      const bgUrls = await page.evaluate(() => {
        const found = new Set();
        for (const el of document.querySelectorAll("*")) {
          const bg = getComputedStyle(el).backgroundImage;
          if (!bg || bg === "none") continue;
          // backgroundImage can list multiple comma-separated layers mixing
          // url(...) and gradients (linear-gradient(...), etc.) in one
          // string — only the url(...) layers need a network wait.
          for (const m of bg.matchAll(/url\((['"]?)(.*?)\1\)/g)) {
            const raw = m[2];
            if (!raw || raw.startsWith("data:")) continue;
            found.add(new URL(raw, document.baseURI).href);
          }
        }
        return Array.from(found);
      });
      console.log(`    (${bgUrls.length} background-image url${bgUrls.length === 1 ? "" : "s"})`);
      if (bgUrls.length > 0) {
        // Not waitForFunction: that API takes (pageFunction, arg, options),
        // and the arg/options mixup already bit this file once (see the
        // comment above). A Node-side Promise.race sidesteps that entirely —
        // page.evaluate's returned promise races a plain setTimeout, so the
        // 15s bound applies to the whole batch regardless of how many URLs
        // there are.
        // The reject timer is cleared in `finally` so it cannot keep the
        // event loop alive (or reject into nowhere) after the evaluate
        // settles first — without that, node lingers up to 15s per shot.
        let bgTimer;
        await Promise.race([
          page.evaluate(
            (urls) =>
              Promise.all(
                urls.map(
                  (u) =>
                    new Promise((res) => {
                      const img = new Image();
                      // Settle (don't hang) on error too — a background image
                      // that 404s is a content bug for a human to notice in
                      // the capture, not something this gate should block on
                      // forever. What this gate exists to prevent is a
                      // capture that races a background image that WOULD
                      // have loaded fine, given a little more time.
                      img.onload = () => res();
                      img.onerror = () => res();
                      img.src = u;
                    })
                )
              ),
            bgUrls
          ),
          new Promise((_, reject) => {
            bgTimer = setTimeout(
              () => reject(new Error(`background-image wait timed out (15000ms): ${bgUrls.length} url(s)`)),
              15000
            );
          }),
        ]).finally(() => clearTimeout(bgTimer));
      }

      // Short settle delay as a fallback only — not the primary mechanism —
      // for anything the signals above don't cover (e.g. a CSS transition
      // still finishing after scroll-to-top).
      await page.waitForTimeout(150);

      screenshotStarted = true;
      await page.screenshot({ path: dest, type: "jpeg", quality: 82, scale: "css" });
      console.log(`  ✓ ${name}  ${shot.viewport.width}x${shot.viewport.height}`);
      captured += 1;
    } catch (e) {
      failure = { name: shot.out, reason: e.message.split("\n")[0] };
      // Only a screenshot call that was actually reached can leave a
      // partial/corrupt file at `dest` — remove that so a later
      // check-assets.mjs run never validates a half-written capture. A
      // failure anywhere earlier (navigation, `waitFor`, the readiness
      // gates) never touched the file, so whatever was there — possibly a
      // tracked frozen cover — stays.
      if (screenshotStarted && existsSync(dest)) unlinkSync(dest);
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
