import { defineShots } from "./_schema.mjs";

/**
 * `/work/hasina-hijama-cupping/` — the Next.js 16.3.2 marketing site in
 * "~/Projects/Hijama Site" (literal path with a space; quote it).
 *
 * Every shot below names the sentence in
 * `src/components/site/work/hasina-hijama-cupping/content.ts` it is evidence for. See
 * `docs/research/case-studies/hasina-hijama-cupping.md` → Shot list for what was considered
 * and cut (the About page's enquiry form, which sits ~4,000 px down a route the runner
 * always captures from the top; the evidence section of the guide, same reason; the mobile
 * booking bar, which only exists below 780 px and only while the page is scrolling).
 *
 * ── Reproducing the captures ────────────────────────────────────────────────
 *
 *   1. Boot a COPY of the repo, never the repo itself. Two reasons, both controller
 *      rulings: this Next version ships `node_modules/next/dist/server/lib/generate-agent-files.js`,
 *      which rewrites `AGENTS.md`/`CLAUDE.md` on `next dev` (both are TRACKED in this repo),
 *      and the repo carries a 535 MB pre-existing `.next`.
 *        rsync -a --exclude .next "/Users/hamadgul/Projects/Hijama Site/" "$SCRATCH/hijama/"
 *      There is no `.env*` file to strip: the source has none, and `grep -rn process.env
 *      app components lib` finds only `NODE_ENV` in `next.config.ts:33`. Nothing needs a
 *      credential to render.
 *   2. Print Next's inferred root for the copy (must be the copy; `next.config.ts:86` also
 *      pins `turbopack.root`), then boot through the watchdog:
 *        NEXT_TELEMETRY_DISABLED=1 scripts/guarded-dev.sh --limit-mb 4096 -- npx next dev --port 3104
 *      Ten routes is small: fetching all ten plus the crawl files in one pass peaked the
 *      group at ~1.3 GB (figures in task-14-report.md §3). The three capture routes alone
 *      need far less.
 *   3. node scripts/capture-case-study-shots.mjs hasina-hijama-cupping --base http://localhost:3104
 *
 * ── Frozen assets, left alone ───────────────────────────────────────────────
 *
 *   hasinahijama.jpg   the cover, 1200x750, captured 2026-09-07 from the live site. Used
 *                      by `/work/` (`work/content.ts:296`, alt "The Hasina Hijama Cupping
 *                      site for a Queens cupping practice") and as this page's header and
 *                      og:image. Opened and checked against HEAD `bfec627`: it IS the hero
 *                      at HEAD — the single photograph on the full-bleed ink field, the
 *                      Sunnah underline, the 5.0 line, both buttons, the "most-reviewed"
 *                      claim, and the $10-a-cup offer strip (`app/page.tsx:250-481`, the
 *                      2026-08-29 rebuild). Not re-captured; not repeated in the body.
 *
 * ── What is hidden ──────────────────────────────────────────────────────────
 *
 *   nextjs-portal     Next's dev-mode indicator (the "N" badge, bottom-left). Dev-only chrome.
 *
 * Nothing else. The site is public and names its own practice; the telephone number and
 * street address it prints in its masthead and hero are the practice's own published
 * contact details (`lib/site.ts:24-50`), on every route by design.
 *
 * ── Motion ──────────────────────────────────────────────────────────────────
 *
 * The home hero's headline and claim line animate in (per-line and per-word focus-in,
 * `app/page.tsx:13-32`, `.hero__h1` / `.hero__claim` in globals.css); none of the three
 * routes below is the home page, and every entrance animation on the site sits under
 * `@media (prefers-reduced-motion: no-preference)` (globals.css:818, 875, 946), which the
 * runner's `reducedMotion: "reduce"` switches off. Each route has exactly one `<img>`
 * (the masthead logo, `loading="lazy"`, ~48 px), and the runner's every-<img> gate
 * settled in under 200 ms on all three (probed).
 */
export default defineShots("hasina-hijama-cupping", [
  {
    // Evidence for: "Six pages, one question each." — the city-level page added on
    // 2026-08-27 (`6b970ad`): the breadcrumb `Home / Hijama in NYC`, the eyebrow NEW YORK
    // CITY, the H1 `Hijama in New York City`, the lede, and the four-cell strip ($10 per
    // cup · $60–$150 a session for the rest of the city · 5.0 from 175+ reviews · women
    // and men seen separately), with the on-page contents list starting `Getting here from
    // across the city` (`app/hijama-nyc/page.tsx:11-30, 56-83`).
    route: "/hijama-nyc",
    viewport: { width: 1600, height: 1000 },
    out: "hasina-hijama-cupping-nyc.jpg",
    minBytes: 60000,
    waitFor: "main h1",
    hideSelectors: ["nextjs-portal"],
  },
  {
    // Evidence for: "the cost page's H1 is the question itself" — `/cupping-therapy-cost`:
    // the breadcrumb `What cupping therapy costs`, the H1 `How much does cupping therapy
    // cost?`, the lede's `$60 and $150` against `$10 per cup`, and the price grid (THE ONLY
    // CHARGE $10 · three INCLUDED FREE cells). The page's header comment records why it
    // exists (`app/cupping-therapy-cost/page.tsx:10-16`) and its FAQ schema is worded as
    // the People-Also-Ask blocks are (`lib/schema.ts:192-229`).
    route: "/cupping-therapy-cost",
    viewport: { width: 1600, height: 1000 },
    out: "hasina-hijama-cupping-cost.jpg",
    minBytes: 60000,
    waitFor: "main h1",
    hideSelectors: ["nextjs-portal"],
  },
  {
    // Evidence for: "the guide's visible byline, its Article dateModified and its sitemap
    // lastmod are one constant" — `/what-is-hijama`: the H1 `What is hijama, or wet cupping
    // therapy?`, the lede, the byline `Written by Hasina, certified hijama practitioner ·
    // Last updated August 23, 2026` rendered from `GUIDE_UPDATED`
    // (`app/what-is-hijama/page.tsx:186-195`; `lib/schema.ts:255-262, 301-302`;
    // `app/sitemap.ts:23`), and the At-a-glance aside (`components/GuideFacts.tsx`).
    route: "/what-is-hijama",
    viewport: { width: 1600, height: 1000 },
    out: "hasina-hijama-cupping-guide.jpg",
    minBytes: 60000,
    waitFor: "main h1",
    hideSelectors: ["nextjs-portal"],
  },
]);
