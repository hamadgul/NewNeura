import { defineShots } from "./_schema.mjs";

/**
 * `/work/packship/` — the Expo / React Native app in ~/Projects/MagicBoxer.
 *
 * NOT CAPTURED BY THE RUNNER. PackShip has no web build, so there is nothing for
 * `capture-case-study-shots.mjs` to point a browser at, and this config was never run
 * through it (`route` below is the app screen's name, not a URL). It exists so that
 * `check-assets.mjs` — which imports every config — asserts the same three things for
 * these images that it asserts for real captures: each file exists, is above `minBytes`,
 * and is exactly the declared pixel size.
 *
 * ── Where the images come from ──────────────────────────────────────────────
 *
 * Every screen is one of the app's own committed device screenshots
 * (`src/assets/GettingStarted/*.jpg`, 1206x2622, iPhone 16 Pro, committed 2026-05-13 in
 * MagicBoxer #58 — the in-app "Getting started" walkthrough images), or the developer's
 * screenshot embedded in the App Store composite `~/Desktop/PackShip Files/App Store
 * iPhone Screenshots/02_build.png` (2026-05-11; screen rectangle x 312..971, y 139..1565).
 * A scratch script (`packship-compose.mjs`, reproduced in full in task-10-report.md)
 * scales each screenshot and places it on the same dark ground and rounded card the frozen
 * cover `packship.jpg` uses (geometry measured from the cover: ground rgb(12,20,39) →
 * rgb(10,14,25); card 432x604 at 4/3 scale, radius 28; screen fitted to the card height,
 * corners rounded 20). Nothing inside any screenshot is edited.
 *
 * The repo's `demo/*.PNG` (2025-01-21) were checked and rejected: light-blue theme,
 * hamburger drawer, no tab bar, no AI chip, no AR scan buttons — the UI before the
 * 2025-12 LiDAR work and the 2026-03 redesign. See the dossier's Shot list.
 *
 * The cover is NOT re-made: `packship.jpg` is shared by `/`, `/work/`, `/process/` and six
 * service pages, and its two phones ARE the Optimal Box Size and Shipping Estimate screens,
 * which is why neither appears again below (Task 8's duplicate-cover trap).
 */
export default defineShots("packship", [
  {
    // Evidence for: "Type the dimensions, tap the AI chip beside the name field to look them
    // up, or tap the scan icon beside a field and measure it with the phone's LiDAR." Left
    // card: the Create Package form with the `AI` chip and the three scan icons. Right card:
    // the AR Measure Width screen, a 6.5" width measured across a keyboard, the app's own
    // "Ready to measure" pill, the 1–2 step indicator and the "Use 6.5"" button.
    route: "CreatePackage + DimensionMeasureScreen(width)",
    viewport: { width: 1600, height: 1000 },
    out: "packship-measure.jpg",
    minBytes: 60000,
  },
  {
    // Evidence for: "What comes back is saved to the account, so the second time is a tap."
    // Left: Saved Items, four items, three carrying the `AI` badge. Right: Saved Packages,
    // three packages with unique/total item counts and their dates.
    route: "SavedItemsPage + PackagesPage",
    viewport: { width: 1600, height: 1000 },
    out: "packship-library.jpg",
    minBytes: 40000,
  },
  {
    // Evidence for: "the answer comes back as dimensions in inches with a confidence level."
    // The AI Item Search result: `Product Found · Microsoft Xbox Series X (1TB)`, the
    // `AI Verified` badge (the confidence the app accepted), length / width / height in
    // inches, weight, and the screen's own note — "Dimensions retrieved from available
    // online resources." — which is the block's quote. It shows a high-confidence success,
    // NOT the refusal path; the refusal sentence in the same paragraph is carried by the code
    // citation (useAIDimensionLookup.js:73-80), not by this image. Portrait slot
    // (the site's 1179x2203 phone size, as `conversion.png` on the mechanic page); the raw
    // screenshot with its status bar cropped.
    route: "LookupItemPage",
    viewport: { width: 1179, height: 2203 },
    out: "packship-lookup.jpg",
    minBytes: 60000,
  },
]);
