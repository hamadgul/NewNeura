import { defineShots } from "./_schema.mjs";

/**
 * `/work/delivery-routing/` — the dispatch app in ~/Projects/Routing.
 *
 * Every shot below names the sentence in
 * `src/components/site/work/delivery-routing/content.ts` it is evidence for. A shot that only
 * showed "the app exists" is not here: the Upload screen proves a file input exists and
 * nothing else, and the Recent-runs screen holds a single row on synthetic data. See
 * `docs/research/case-studies/delivery-routing.md` → Shot list for the two that were
 * considered and cut, and why.
 *
 * ── Reproducing these captures ──────────────────────────────────────────────
 *
 *   1. node /tmp/ng-shots/make_sheet.py's env: seed a SCRATCH database and a synthetic sheet
 *      (see the dossier). It never opens ~/Projects/Routing/dlw-cache.sqlite, which is live
 *      data including two caches of PAID Google results.
 *   2. Boot the API against the scratch DB and WITHOUT --env-file, so no real key is loaded:
 *        cd ~/Projects/Routing && DLW_DB=/tmp/ng-shots/synthetic.sqlite \
 *          .venv/bin/uvicorn dlw_routing.api.app:create_app --factory --port 8000 --app-dir src
 *      Port 8000 is not negotiable — web/vite.config.ts hardcodes its proxy targets to it.
 *   3. Serve the UI. NOT the repo's own vite config: its `'/runs'` proxy rule forwards every
 *      /runs path to the API, so a direct `page.goto('/runs/<id>/routes')` — which is the only
 *      thing the capture runner can do — gets the API's 404 JSON instead of the app, and its
 *      `'/config'` prefix rule swallows the /config-admin route the same way. The screenshot
 *      run uses a config in /tmp that hands those client-side routes back to index.html.
 *   4. node scripts/capture-case-study-shots.mjs delivery-routing --base http://localhost:3105
 *
 * RUN_ID is a uuid4 minted at upload time, so re-seeding produces a new one and the six
 * routes below have to be re-pointed. It is a single constant for that reason.
 *
 * ── What is hidden, and why it is the most important line in this file ──────
 *
 * The page states that the client is not named. Two elements name them, and both would
 * otherwise appear in the published JPEGs:
 *
 *   header a img   the top bar's <img src="/logo.png" alt="DME Living Well">
 *                  (web/src/components/TopBar.tsx) — on all five app screens.
 *   .org           the cut sheet's "DLW HME · Delivery cut sheet" masthead line
 *                  (src/dlw_routing/export/printable.py) — printable screen only.
 *
 * `hideSelectors` sets visibility:hidden, so the layout does not reflow and the frame matches
 * the app's real geometry. Do not drop either one.
 *
 * ── Capture notes ──────────────────────────────────────────────────────────
 *
 * `waitFor` on every shot gates a rendered-data signal, not the shell: each of these screens
 * paints a skeleton first, and a skeleton screenshot has the right dimensions and a plausible
 * byte count — it passes `minBytes` and the pixel assert and is only catchable by eye.
 * The Routes shots wait on `.leaflet-tile-loaded`, which is stronger than waiting for the map
 * container: the container exists before a single tile has arrived.
 */
export default defineShots("delivery-routing", [
  {
    // Evidence for: "Google OR-Tools solves for the shortest total drive time, inside the
    // delivery windows, per-driver caps, town bans and vehicle eligibility the dispatcher
    // used to carry in their head."
    //
    // This is the COVER, and it is the only capture of the Routes screen. `BlockHeaderProjects`
    // renders it full-bleed directly under the page title, so the solve is the first thing on
    // the page — and the same frame is this project's card on /, /work/ and /process/. An
    // earlier draft also ran it as a 1600x1000 `BlockImageFull` a screen further down; the two
    // read as the same picture twice within one scroll, so the body instance was cut rather
    // than duplicated. The per-driver load against each van's own cap (4/17, 10/15) is the
    // eligibility rule showing its work, and the `estimated (haversine)` badge is the
    // travel-matrix budget refusing to spend.
    route: "/runs/6d05f891b173/routes",
    viewport: { width: 1200, height: 750 },
    out: "cover:delivery-routing.jpg",
    minBytes: 70000,
    waitFor: ".leaflet-tile-loaded",
    hideSelectors: ["header a img"],
  },
  {
    // Evidence for: "It refuses to invent anything it cannot read with confidence. A row it
    // cannot read becomes a flagged task for a human." The header reads
    // "47 tickets on the sheet → 46 will deliver · 1 need review", and the flagged row carries
    // the app's own words — `unknown code: RTS` — rather than a generic error.
    route: "/runs/6d05f891b173/review",
    viewport: { width: 1600, height: 1000 },
    out: "delivery-routing-review.jpg",
    minBytes: 70000,
    waitFor: "tbody tr",
    hideSelectors: ["header a img"],
  },
  {
    // Evidence for: "an Excel workbook and a CSV log for the office." The run summary under
    // it — stops, deliveries, driving time, back at depot, per driver — is the same accounting
    // the dispatcher used to do by hand.
    route: "/runs/6d05f891b173/export",
    viewport: { width: 1600, height: 1000 },
    out: "delivery-routing-export.jpg",
    minBytes: 60000,
    waitFor: "table tbody tr",
    hideSelectors: ["header a img"],
  },
  {
    // Evidence for: "Who is driving today and which van they take is a choice on the day, not
    // a code change." `Drivers 6/7` and `Vans 6/7` are the published roster with one of each
    // switched off for this run only.
    route: "/runs/6d05f891b173/setup",
    viewport: { width: 1600, height: 1000 },
    out: "delivery-routing-setup.jpg",
    minBytes: 50000,
    waitFor: "select",
    hideSelectors: ["header a img"],
  },
  {
    // Evidence for: "a printed cut sheet designed for a clipboard and a pen." One page per
    // driver, a DONE checkbox and a hand-written TIME DELIVERED box at every stop, and a
    // NOTES & EXCEPTIONS block at the foot.
    route: "/runs/6d05f891b173/printable",
    viewport: { width: 1600, height: 1000 },
    out: "delivery-routing-cutsheet.jpg",
    minBytes: 50000,
    waitFor: ".driver-name",
    hideSelectors: [".org"],
  },
]);
