import { defineShots } from "./_schema.mjs";

/**
 * `/work/vintus/` — the live WordPress site at https://vintus.com (WordPress 7.1, custom
 * theme `vintus`). There is NO local source for this project (the plan's row: "live site
 * only"). Every shot is taken from production, read-only (GET only; no sign-in, sign-up,
 * form, sell sheet or subscription).
 *
 * Every shot below names the sentence in `src/components/site/work/vintus/content.ts` it is
 * evidence for. See `docs/research/case-studies/vintus.md` → Shot list for what was
 * considered and cut: producer and wine pages (a `div.hidden` fancybox gallery of
 * `loading="lazy"` images times out the runner's every-<img> gate — 8 of 161 producers
 * sampled, all carry it), `/browse-materials` (rows whose `<img src>` is a PDF, same
 * failure), `/reviews` (26 `<img>`s whose src is the page URL), `/browse-labels` (passes, but
 * its hero photograph carries its own type under the H1), `/subscribe/` and
 * `/producers-summary/` (pass, but a Brevo form and a two-thirds-hero frame at 1600x1000).
 *
 * ── Reproducing the captures ────────────────────────────────────────────────
 *
 *   node scripts/capture-case-study-shots.mjs vintus --base https://vintus.com
 *
 * No boot, no port, no env, no storageState. Do not hammer the site: the runner loads each
 * route once. Probed 2026-09-11 19:13–19:16 UTC (`$SCRATCH/vintus/probe.mjs`): the
 * every-<img> gate settled in 1,630 ms / 1,799 ms / 1,207 ms on the three routes below; no
 * cookie banner, age gate, chat widget or popup exists on any route (no fixed or sticky
 * element with a box anywhere), so nothing is hidden. The alcohol disclaimer is a footer
 * link, not a gate.
 *
 * ── Frozen assets, left alone ───────────────────────────────────────────────
 *
 *   vintus.jpg   the cover, 1200x750, committed 2026-09-02. Used by `/work/`, the home
 *                grid, `/services/web-development/`, `/services/cloud-infrastructure/` and
 *                `/process/` (alt "The Vintus wine importer storefront"), by `/about/`'s
 *                large media slot (`alt: ""`), and as this page's header and og:image.
 *                Checked against the live home page on 2026-09-11 19:13 UTC: it IS today's
 *                home page — the seven-item header, the H1 `Building a National Wine Import
 *                Business From Scratch` over the vineyard photograph, the `Search producers
 *                and wines` box, the SevenFiftyDaily teaser and `READ MORE`. Not
 *                re-captured; not repeated in the body.
 *
 * ── Motion ──────────────────────────────────────────────────────────────────
 *
 * The theme is Bootstrap 3 with no scroll-triggered reveals; the only JS-driven state on
 * the three routes is the Search & Filter Pro auto-count (which runs server-side on the
 * first render) and the sell-sheet page's Ajax Search Pro box at rest. `/sell-sheet-generator/`
 * throws `jQuery(...).datepicker is not a function` on load (a live defect); the Date field
 * is still server-prefilled, and the frame is painted before the throw.
 */
export default defineShots("vintus", [
  {
    // Evidence for: "Fifty-seven producers on one page, filtered by country." —
    // `/browse-producers`: the H1 `OUR PRODUCERS`, the estate paragraph, the Search & Filter
    // Pro panel (`COUNTRY: All Countries` — six options: Argentina, France, Italy, New
    // Zealand, Spain, United States) and the first twelve of the 57 producer cards (Far
    // Mountain … Xavier Milhade Wines), each a thumbnail, an italic name and a region line.
    route: "/browse-producers",
    viewport: { width: 1600, height: 1000 },
    out: "vintus-producers.jpg",
    minBytes: 60000,
    waitFor: "form.searchandfilter",
  },
  {
    // Evidence for: "Posts are filed against a producer and a wine." — `/browse-news`: the H1
    // `News`, `Toggle View: Grid / List (filterable)`, the `PRODUCER / WINE` filter panel
    // (Search & Filter Pro form 34, facets `_sfm_post_related_producer[]` and
    // `_sfm_post_related_wines[]`), and the first three dated posts, the newest `Standing Up
    // for Cabernet Sauvignon, September 09, 2026`.
    route: "/browse-news",
    viewport: { width: 1600, height: 1000 },
    out: "vintus-news.jpg",
    minBytes: 60000,
    waitFor: "form.searchandfilter",
  },
  {
    // Evidence for: "A sell sheet is a search, a title and a name." —
    // `/sell-sheet-generator/`: the H1 `Generate a Sell Sheet`, the instructions paragraph
    // ("Search by brand, wine and/or vintage … Then Download or email the PDF sell sheet."),
    // `Select Wine(s)` with its search box, Sheet Title, Your Name, Date (server-prefilled
    // with today's date), Contact Info, the `Include Reviews` checkbox and the optional
    // Recipient Email Address.
    route: "/sell-sheet-generator/",
    viewport: { width: 1600, height: 1000 },
    out: "vintus-sell-sheet.jpg",
    minBytes: 60000,
    waitFor: "input[name=sellsheet_title]",
  },
]);
