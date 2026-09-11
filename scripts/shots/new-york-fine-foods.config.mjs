import { defineShots } from "./_schema.mjs";

/**
 * `/work/new-york-fine-foods/` — the Next.js 16 marketing site in ~/Projects/newyorkfinefoods.
 *
 * Every shot below names the sentence in
 * `src/components/site/work/new-york-fine-foods/content.ts` it is evidence for. See
 * `docs/research/case-studies/new-york-fine-foods.md` → Shot list for what was considered
 * and cut (the home page, which the frozen cover and `nyff-hero.mp4` already are; the
 * mobile sticky booking bar, which only appears after a scroll the runner undoes; the
 * About page, whose stats the repo's own plan calls unverified).
 *
 * ── Reproducing the captures ────────────────────────────────────────────────
 *
 *   1. Boot a COPY of the repo, never the repo itself (controller ruling, standard for any
 *      source repo with a stale `.next`): the repo carries a 636 MB pre-existing `.next`.
 *        rsync -a --exclude .next --exclude .worktrees --exclude .git \
 *          ~/Projects/newyorkfinefoods/ "$SCRATCH/nyff/"
 *   2. Print Next's inferred root for the copy (must be the copy), then boot through the
 *      watchdog with the one variable named in `.env.local.example` set EMPTY on the
 *      command line, so no form could reach Formspree even if submitted (the site has a
 *      hard-coded public fallback endpoint, hit only on submit, never on render):
 *        NEXT_PUBLIC_FORMSPREE_ENDPOINT= scripts/guarded-dev.sh --limit-mb 4096 -- \
 *          npx next dev --port 3102
 *   3. node scripts/capture-case-study-shots.mjs new-york-fine-foods --base http://localhost:3102
 *
 * ── Frozen assets, left alone ───────────────────────────────────────────────
 *
 *   nyff.jpg          the cover, 1200x750, refreshed 2026-09-10 from the LIVE site (the nav
 *                     with `Corporate` in it). Shared by /, /work/, /process/ and
 *                     /services/web-development/ with alt "The New York Fine Foods catering
 *                     site". Not re-captured.
 *   nyff-hero.mp4     public/site/videos/ is orchestrator-owned. 9.1 s capture of the live
 *                     hero playing, 1200x750, poster nyff.jpg. Kept on the page as the one
 *                     piece of evidence a still cannot carry (the poster-then-video hero).
 *
 * ── What is hidden ──────────────────────────────────────────────────────────
 *
 *   nextjs-portal     Next's dev-mode indicator (the "N" badge, bottom-left). Dev-only chrome.
 *
 * Nothing else: the site is public and names its own business. The phone number on every
 * hero is the client's published business line, printed in their own JSON-LD.
 *
 * ── Motion ──────────────────────────────────────────────────────────────────
 *
 * Sections are wrapped in a `FadeIn` (opacity 0 → 1, translateY 28px → 0 over 0.7 s once an
 * IntersectionObserver fires at threshold 0.1). Everything inside the first 1000 px
 * intersects on hydration, well before the runner's font/image/background gates and its
 * 150 ms settle, so the frames below are captured settled. Verified by eye after capture.
 */
export default defineShots("new-york-fine-foods", [
  {
    // Evidence for: "Ten catering pages, one per borough or region, each written around a
    // fact that is only true there" — the Brooklyn page's H1 `Brooklyn Catering`, its
    // breadcrumb, its subtitle ("from a third-floor walk-up in Bushwick to a rooftop in
    // Williamsburg"), and below the hero the angle section "Catering That Can Handle Your
    // Brooklyn Walk-Up" with "Four flights with no elevator…". The borough with the most
    // search demand in the plan (1,300/mo, build-order #1).
    route: "/catering/brooklyn",
    viewport: { width: 1600, height: 1000 },
    out: "new-york-fine-foods-brooklyn.jpg",
    minBytes: 60000,
    waitFor: "main h1",
    hideSelectors: ["nextjs-portal"],
  },
  {
    // Evidence for: "Four pages now hang under it, one per occasion or region: weddings,
    // parties, Long Island and Connecticut" — `Pizza Truck Weddings`, the breadcrumb back to
    // Pizza Trucks, `From $1,500` (the client's published starting price, also the
    // `minPrice` in the page's Service schema), and the hook heading "The Best-Reviewed
    // Thing at Your Wedding Won't Be the Cake".
    route: "/pizza-trucks/weddings",
    viewport: { width: 1600, height: 1000 },
    out: "new-york-fine-foods-weddings.jpg",
    minBytes: 60000,
    waitFor: "main h1",
    hideSelectors: ["nextjs-portal"],
  },
  {
    // Evidence for: "The corporate page is written for whoever gets blamed if lunch is
    // late: a certificate of insurance sent to building management before the date, a
    // confirmed delivery window, an invoice with a PO number on it" — the H1 `Corporate
    // Catering NYC`, the eyebrow `For Companies`, and the hero paragraph naming the certificate of
    // insurance and the invoicing.
    //
    // NOT `/pizza-trucks` (the hub), which was the first choice: its truck carousel is a
    // horizontal scroller of 24 `loading="lazy"` images that the browser fetches one card
    // at a time as the carousel auto-advances every 3 s, and the runner's every-<img>
    // gate times out at 15 s (probed twice: 5 → 0 incomplete over ~29 s, the server
    // answering each in ~50 ms from cache). A per-shot "viewport images only" option in
    // the runner would make that route capturable; the runner is outside this task's paths.
    route: "/corporate-catering",
    viewport: { width: 1600, height: 1000 },
    out: "new-york-fine-foods-corporate.jpg",
    minBytes: 60000,
    waitFor: "main h1",
    hideSelectors: ["nextjs-portal"],
  },
  {
    // Evidence for: "The contact form asks which of the three services you want before it
    // asks anything else, then shows only that service's fields" — the step-one chooser
    // ("What are you looking for?" with the Catering / Pizza Truck / Mobile Bar cards)
    // sitting over the hero. The page's hero background is a remote Unsplash image; the
    // runner's background-image gate waits for it.
    route: "/contact",
    viewport: { width: 1600, height: 1000 },
    out: "new-york-fine-foods-contact.jpg",
    minBytes: 60000,
    waitFor: "main h1",
    hideSelectors: ["nextjs-portal"],
  },
]);
