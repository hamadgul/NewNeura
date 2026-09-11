import { defineShots } from "./_schema.mjs";

/**
 * `/work/landscape-drainage-proz/` — the live Shopify store at
 * https://landscapedrainageproz.com (Dawn 13.0.0). There is NO local source for this
 * project: `~/Projects/ShopifySite` holds only `.claude/settings.local.json`. Every shot is
 * taken from production, read-only (GET only; no form, cart, account or checkout).
 *
 * Every shot below names the sentence in
 * `src/components/site/work/landscape-drainage-proz/content.ts` it is evidence for. See
 * `docs/research/case-studies/landscape-drainage-proz.md` → Shot list for what was considered
 * and cut (the product page, whose lazy gallery times out the runner's every-<img> gate; the
 * custom footer, which sits below 1,000 px on every route; the contact page, whose `tel:` link
 * renders white-on-white today).
 *
 * ── Reproducing the captures ────────────────────────────────────────────────
 *
 *   node scripts/capture-case-study-shots.mjs landscape-drainage-proz --base https://landscapedrainageproz.com
 *
 * No boot, no port, no env, no storageState. Do not hammer the store: the runner loads each
 * route once. Probed 2026-09-11 18:27–18:28 UTC (`$SCRATCH/ldp/probe.mjs`): the every-<img>
 * gate settled in 775 ms / 1,313 ms / 824 ms on the three routes below; no cookie banner,
 * chat widget or popup exists on any route, so nothing is hidden.
 *
 * ── Frozen assets, left alone ───────────────────────────────────────────────
 *
 *   landscapedrainage.jpg   the cover, 1200x750, committed 2026-09-02. Used by `/work/`, the
 *                           home grid, `/services/web-development/`,
 *                           `/services/data-intelligence/` and `/process/` (alt "The Landscape
 *                           Drainage Proz Shopify storefront") and as this page's header and
 *                           og:image. Checked against the live home page on 2026-09-11: it IS
 *                           today's home page — the announcement bar, the six-item header, the
 *                           blue Custom Liquid strip, slide 2 of 3 (`The NDS EZ-FLow System
 *                           Makes Gravel-based Drains History` / `All Drainage Solutions`),
 *                           the pause control and the rich-text opener. Not re-captured; not
 *                           repeated in the body.
 *
 * ── Motion ──────────────────────────────────────────────────────────────────
 *
 * Dawn's `scroll-trigger animate--slide-in` reveals are under
 * `@media (prefers-reduced-motion: no-preference)` in `animations.js`/`base.css`, which the
 * runner's `reducedMotion: "reduce"` switches off, so every section is painted at rest. The
 * home slideshow autoplays, which is one reason the home page is the frozen cover and not a
 * shot. None of the three routes below carries a slideshow or a lazy carousel.
 */
export default defineShots("landscape-drainage-proz", [
  {
    // Evidence for: "The buyer who will never use the cart gets a page of their own." —
    // `/pages/municipal-accounts`: the flooded-field hero (`municipal_hero.webp`), the page H1
    // `Municipal Accounts`, the pasted H1 `Municipal Drainage Solutions: Expertise in
    // Field-Wide Challenges`, the opening paragraph and the first H2 `Trusted Drainage
    // Expertise for Municipalities`. Reached from the home page's `Municipal Orders & Quotes is
    // Our Specialty` → `Learn More` and from the custom footer's `Municipal Orders` link; the
    // page ends in `Contact Landscape Drainage Proz for Municipal Drainage Solutions`.
    route: "/pages/municipal-accounts",
    viewport: { width: 1600, height: 1000 },
    out: "landscape-drainage-proz-municipal.jpg",
    minBytes: 60000,
    waitFor: "main h1",
  },
  {
    // Evidence for: "Eleven products in two collections whose counts add up." —
    // `/collections/drainage-solutions`: the H1 `Drainage Solutions`, the collection
    // description, `Filter: Availability · Price`, `Sort by: Best selling`, `7 products`
    // (Paver Solutions prints `4 products`; 7 + 4 = the 11 products in the sitemap), and the
    // first four cards with the compare-at price struck through beside the sale price.
    route: "/collections/drainage-solutions",
    viewport: { width: 1600, height: 1000 },
    out: "landscape-drainage-proz-drainage.jpg",
    minBytes: 60000,
    waitFor: "main h1",
  },
  {
    // Evidence for: "Seven questions under four headings, and both pages point at each
    // other." — `/pages/faqs`: the H1 `FAQs`, the line `If you can't find the answers to your
    // questions, please contact us.`, the four group headings (Paver Installation & Usage;
    // Ordering & Shipping; Reseller & Tax-Exempt Purchases; Cancellations & Changes) and the
    // seven question rows. The GOAT badges app's blue strip is visible at the foot of the
    // frame (the app-rendered echo of the home strip, not the Custom Liquid section).
    route: "/pages/faqs",
    viewport: { width: 1600, height: 1000 },
    out: "landscape-drainage-proz-faqs.jpg",
    minBytes: 60000,
    waitFor: "main h1",
  },
]);
