import { defineShots } from "./_schema.mjs";

/**
 * `/work/foodtruckrentals/` — the Next.js 16.2.10 marketing site in ~/Desktop/foodtruckrentals.com.
 *
 * Every shot below names the sentence in
 * `src/components/site/work/foodtruckrentals/content.ts` it is evidence for. See
 * `docs/research/case-studies/foodtruckrentals.md` → Shot list for what was considered and
 * cut (the roster, which sits below the fold on `/` and the runner scrolls back to the top
 * before every shot; `/pricing.md`, served as `text/markdown`, which a browser downloads
 * rather than renders; the mobile sticky CTA, which only exists below `md`).
 *
 * ── Reproducing the captures ────────────────────────────────────────────────
 *
 *   1. Boot a COPY of the repo, never the repo itself (controller ruling, standard for any
 *      source repo with a stale `.next`): the repo carries a 269 MB pre-existing `.next`.
 *        rsync -a --exclude .next ~/Desktop/foodtruckrentals.com/ "$SCRATCH/ftr/"
 *      The copy carries the repo's gitignored `.env.local`; delete it from the copy
 *      (`rm "$SCRATCH/ftr/.env.local"`). Its three variables (`RESEND_API_KEY`,
 *      `INQUIRY_TO`, `INQUIRY_FROM`) are read only inside the inquiry server action on
 *      SUBMIT, never on render; `CRON_SECRET` gates `/api/indexnow`, which fails closed
 *      when it is unset. None is needed to render any route.
 *   2. Print Next's inferred root for the copy (must be the copy), then boot through the
 *      watchdog with all four names set EMPTY on the command line:
 *        RESEND_API_KEY= INQUIRY_TO= INQUIRY_FROM= CRON_SECRET= \
 *          scripts/guarded-dev.sh --limit-mb 4096 -- npx next dev --port 3106
 *      Request ONLY the three routes below. Fetching all 31 sitemap routes in one burst
 *      drove the dev server's group RSS to a 3,886 MB peak (Turbopack compiling 31 routes
 *      at once); the three-route boot for these captures peaked far lower — see the task
 *      report for both figures.
 *   3. node scripts/capture-case-study-shots.mjs foodtruckrentals --base http://localhost:3106
 *
 * ── Frozen assets, left alone ───────────────────────────────────────────────
 *
 *   foodtruckrentals.jpg        the cover, 1200x750. Shared by /, /work/, /process/ and
 *                               all four service pages with alt "The Food Truck Rentals
 *                               home page". Not re-captured.
 *   foodtruckrentals-home.jpg   1600x1000, captured 2026-09-04: the three-photograph hero
 *                               collage (Louis Vuitton, Sartiano's, Blank Street), the H1,
 *                               "From $1,500 a day", and the Trusted-by strip. Shared by
 *                               /services/web-development/ and /services/applied-ai-evaluation/
 *                               with alt "The Food Truck Rentals home page". It IS the hero
 *                               at HEAD `5ff670f` (the collage shipped 2026-08-16) and the
 *                               same frame as the frozen cover, so it is NOT placed on the
 *                               case-study page (duplicate-cover trap); the cover carries
 *                               the hero section. Kept in public/ for the two service pages.
 *   foodtruckrentals-work.jpg   1600x1000, captured 2026-09-04: `/work`, the case-study
 *                               index. Shared by the same two service pages with alt "The
 *                               work index: every activation, with the client, the borough,
 *                               and the year". Captured before the 2026-08-27 em-dash sweep
 *                               (the Louis Vuitton brief still shows one); the alt is
 *                               unaffected. Stays.
 *
 * ── What is hidden ──────────────────────────────────────────────────────────
 *
 *   nextjs-portal     Next's dev-mode indicator (the "N" badge, bottom-left). Dev-only chrome.
 *
 * Nothing else: the site is public and names its own business. Its telephone number is
 * emitted in JSON-LD only (`lib/gbp.ts:62-67`, guarded by `tests/gbp.test.ts`) and never
 * rendered, so no frame can show it.
 *
 * ── Motion ──────────────────────────────────────────────────────────────────
 *
 * The hero triad animates in over 0.15 + 3 × 0.12 s + 0.4 s (`any-street-hero.tsx`,
 * `motion.span`); `Reveal` wrappers elsewhere fade on intersection. All of it finishes well
 * inside the runner's font/image gates and its settle. Verified by eye after capture.
 */
export default defineShots("foodtruckrentals", [
  {
    // Evidence for: "One query, one owner." (the owner section) — the breadcrumb `Food truck rental
    // NYC`, the H1 `Food truck rental in New York City, priced up front.`, the subtitle
    // ("From $1,500 a day unbranded, or $10,000 custom-wrapped, published here rather than
    // quoted on request"), and the top of the facts ledger. This is the route
    // `tests/nyc-cannibalization.test.ts` names as OWNER (its `<title>` carries the cluster
    // phrase) and the route `/nyc`, `/newyork` and `/new-york` all 308 to since 2026-08-16.
    //
    // The `#:~:text=` fragment is a Chromium scroll-to-text fragment, and it is load-bearing:
    // the page is 11,578 px tall and two `loading="lazy"` case-spread images sit at
    // y≈6,833 and 7,388. Under the runner's `reducedMotion: "reduce"` the site switches
    // `scroll-behavior` to `auto` (`app/globals.css:66-67`), so the runner's instant
    // bottom-then-top jump never brings the first of them inside Chromium's lazy-load
    // distance, and the every-<img> gate times out at 15 s (probed: 1 image incomplete at
    // 0, 5, 10, 15 and 20 s; `scrollIntoView` loads it in under 3 s). Loading the URL at
    // the heading "Parked here already." (y≈6,188) makes the browser's own anchor scroll
    // fetch both images before the runner scrolls back to 0, so the captured frame is the
    // top of the page exactly as without the fragment, and the fragment's text highlight
    // is off-screen. `new URL(route, base)` preserves the fragment.
    route: "/food-truck-rental-nyc#:~:text=Parked%20here%20already.",
    viewport: { width: 1600, height: 1000 },
    out: "foodtruckrentals-nyc.jpg",
    minBytes: 60000,
    waitFor: "main h1",
    hideSelectors: ["nextjs-portal"],
  },
  {
    // Evidence for: "Every price comes from one file." (the pricing section) — `/food-truck-rental`, the
    // page whose three tiers, `From $1,500`, and JSON-LD `Offer` nodes are all rendered from
    // `TIERS` in `lib/pricing.ts` (`app/food-truck-rental/page.tsx:10, 123-134`).
    route: "/food-truck-rental",
    viewport: { width: 1600, height: 1000 },
    out: "foodtruckrentals-rental.jpg",
    minBytes: 60000,
    waitFor: "main h1",
    hideSelectors: ["nextjs-portal"],
  },
  {
    // Evidence for: "The same suite holds the contact page's reply promise to one wording,
    // within 48 hours" and "The listing's telephone number is in the JSON-LD and nowhere a
    // person can read it" — `/contact`, the inquiry
    // form (`components/inquiry.tsx`) whose delivery inbox and public address are kept
    // distinct by `tests/contact-address.test.tsx`, with the "within 48 hours" reply promise
    // the client confirmed on 2026-07-29 and `tests/rendered-copy.test.ts` holds to one
    // wording.
    route: "/contact",
    viewport: { width: 1600, height: 1000 },
    out: "foodtruckrentals-contact.jpg",
    minBytes: 60000,
    waitFor: "main h1",
    hideSelectors: ["nextjs-portal"],
  },
]);
