import { defineShots } from "./_schema.mjs";

/**
 * `/work/landscape-drainage-proz/` — the live Shopify store at
 * https://landscapedrainageproz.com (Dawn 13.0.0). There is NO local source for the
 * build: `~/Projects/ShopifySite` holds only `.claude/settings.local.json`. Every shot is
 * taken from production, read-only (GET only; no form, cart, account or checkout).
 *
 * Every shot below names the sentence in
 * `src/components/site/work/landscape-drainage-proz/content.ts` it is evidence for. See
 * `docs/research/case-studies/landscape-drainage-proz.md` → Shot list for what was considered
 * and cut (the product page, whose lazy gallery times out the runner's every-<img> gate; the
 * custom footer, which sits below 1,000 px on every route; the contact page, whose `tel:` link
 * rendered white-on-white on 2026-09-11; the theme link colour was fixed 2026-09-22, SEO row 13).
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
 * ── The cover (re-shot 2026-09-25, user-approved) ───────────────────────────
 *
 *   landscapedrainage.jpg   the cover, 1200x750, filename FROZEN: used by `/work/`, the home
 *                           grid, `/services/web-development/`, `/services/data-intelligence/`
 *                           and `/process/` (alt "The Landscape Drainage Proz Shopify
 *                           storefront") and as this page's header and og:image. The 2026-09-02
 *                           capture showed the old home page (blue Custom Liquid strip,
 *                           slideshow); the store's home page changed in the 2026-09 SEO/CRO
 *                           pass, so it was re-shot as the `cover:` entry below. It now shows
 *                           the announcement bar, the five-item header with Request a quote,
 *                           and the static hero panel over the parking-lot photograph.
 *
 * 2026-09-25 re-shoot: all five files were captured by a scratch copy of the runner's recipe
 * with `channel: "chrome"` (deviceScaleFactor 2, scale "css", fonts.ready, scroll-to-bottom,
 * every-<img> naturalWidth gate), JPEG q82. A probe for `position: fixed` overlays over
 * 200x100 found none on any of the five routes, so no popup had to be dismissed.
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
    // The frozen cover (see above). The home hero is static now; the slideshow is gone.
    route: "/",
    viewport: { width: 1200, height: 750 },
    out: "cover:landscapedrainage.jpg",
    minBytes: 60000,
    waitFor: "main h1",
  },
  {
    // Evidence for: "Seven guides, with specs from the manufacturer's documents." —
    // `/pages/french-drain-installation-guide` (published 2026-09-24): the H1, the byline
    // `By the Landscape Drainage Proz team, an authorized NDS dealer. Product specs from NDS
    // technical documents. Last updated September 24, 2026.`, the opening answer and the
    // ten-item `On this page` box.
    route: "/pages/french-drain-installation-guide",
    viewport: { width: 1600, height: 1000 },
    out: "landscape-drainage-proz-guide.jpg",
    minBytes: 60000,
    waitFor: "main h1",
  },
  {
    // Evidence for: "The buyer who will never use the cart gets a page of their own." —
    // `/pages/municipal-accounts` (2026-09-25): the flooded-field hero (`municipal_hero.webp`),
    // the H1 `Municipal Accounts`, the `Request a municipal / tax-exempt quote` button beside
    // the phone and hours, and `How Municipal Ordering Works` with its first two steps.
    route: "/pages/municipal-accounts",
    viewport: { width: 1600, height: 1000 },
    out: "landscape-drainage-proz-municipal.jpg",
    minBytes: 60000,
    waitFor: "main h1",
  },
  {
    // Evidence for: "Drainage Solutions holds seven and Grass Pavers four, which is the eleven in
    // the sitemap." — `/collections/drainage-solutions` (2026-09-25): the H1, the Shop by type
    // line, the description, `Filter: Availability · Price`, `Sort by: Best selling`,
    // `7 products`, and the first four cards at a single price each (compare-at cleared).
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
    // seven question rows (2026-09-25; the subheading `EZ Roll Grass Paver, Gravel Paver &
    // Drainage FAQs` is new). The top edge of the blue footer shows at the foot of the frame.
    route: "/pages/faqs",
    viewport: { width: 1600, height: 1000 },
    out: "landscape-drainage-proz-faqs.jpg",
    minBytes: 60000,
    waitFor: "main h1",
  },
]);
