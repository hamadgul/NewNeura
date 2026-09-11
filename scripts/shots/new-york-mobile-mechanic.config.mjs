import { defineShots } from "./_schema.mjs";

/**
 * `/work/new-york-mobile-mechanic/` — the Next.js 16 marketing site in
 * ~/Projects/Adam's Mobile Mechanic (the literal path, apostrophe and spaces).
 *
 * Every shot below names the sentence in
 * `src/components/site/work/new-york-mobile-mechanic/content.ts` it is evidence for. See
 * `docs/research/case-studies/new-york-mobile-mechanic.md` → Shot list for what was
 * considered and cut (the home page, which the cover already is; `/reviews`, whose numbers
 * are fallbacks on a local boot; `/contact`, `/services`, `/service-areas`).
 *
 * ── Reproducing the two runner captures ─────────────────────────────────────
 *
 *   1. Boot a COPY of the repo, never the repo itself (controller ruling, 2026-09-11): the
 *      repo's pre-existing `.next/dev` holds a stale Turbopack cache that 500s the home route
 *      and pushed the dev server past the 4 GB watchdog; `next dev` also rewrites the tracked
 *      `next-env.d.ts`.
 *        rsync -a --exclude .next "~/Projects/Adam's Mobile Mechanic/" "$SCRATCH/nymm/"
 *   2. Print Next's inferred root for the copy (must be the copy), then boot through the
 *      watchdog with the four credential names from `.env.example` set EMPTY on the command
 *      line, so no Places, Featurable or Formspree call can be made — `@next/env` never
 *      overrides a key that is already in the environment:
 *        GOOGLE_PLACES_API_KEY= FEATURABLE_WIDGET_ID= FEATURABLE_API_KEY= FORMSPREE_ENDPOINT= \
 *          scripts/guarded-dev.sh --limit-mb 4096 -- npx next dev --port 3101
 *      The site fails soft without them (lib/google-reviews.ts, app/api/contact/route.ts).
 *   3. node scripts/capture-case-study-shots.mjs new-york-mobile-mechanic --base http://localhost:3101
 *
 * ── The three images that are NOT runner captures ───────────────────────────
 *
 * `new-york-mobile-mechanic-lighthouse.jpg`, `-chatgpt-nyc.jpg` and `-chatgpt-queens.jpg`
 * are the user's own screenshots from `~/Desktop/NYMM Results`, resized to 1600 wide with
 * `sharp` (lanczos3, JPEG q82); nothing inside any of them is edited:
 *
 *   Screenshot 2026-07-09 at 2.35.19 PM.png  2556x1344 → 1600x841, whole (no crop)
 *   Screenshot 2026-07-28 at 3.54.30 PM.png  2150x1554 → 1600x1156, then cropped to 1600x1000:
 *                                            60px off the top, 96px off the bottom (y 60..1060)
 *   Screenshot 2026-08-07 at 5.17.18 PM.png  2180x1600 → 1600x1174, then cropped to 1600x1000:
 *                                            60px off the top, 114px off the bottom (y 60..1060)
 *
 * Crop ruling (review round 1): the two ChatGPT frames are cropped to the runner's 1600x1000.
 * A full 156 / 174px top crop would have cut the typed prompt (its bubble sits at y≈94-143 and
 * y≈84-132 of the resized frames), so 60px comes off the top and the remainder off the bottom.
 * What survives in each: the prompt, the map with its 4.9 card, and "1. Adam Mobile Mechanic".
 * The NYC frame also keeps "4.9/5 (133 reviews)" (y≈993 → 933). The Queens frame's Reddit
 * line (y≈1127 of 1174) falls outside the crop; the body copy's "in the second case, Reddit"
 * is sourced to the original screenshot in the dossier, not to this frame.
 *
 * The Lighthouse frame is 1600x841 and cannot be cropped UP to 1000 tall: the report is that
 * shape, and cropping it to 1600x1000 is impossible without adding pixels. WAIVED by the
 * controller (review round 1); `content.ts` declares it 1600x841 and check-assets verifies
 * that.
 *
 * They are deliberately NOT entries in this config: the runner iterates every entry, treats
 * `route` as a URL, and deletes the destination of any shot that fails, so a non-URL entry
 * would break the run and destroy the file. `check-assets.mjs` still asserts each exists,
 * that its declared width/height in content.ts match the pixels, and that its alt is
 * non-empty; only `minBytes` goes unchecked for them. The resize script lives in the
 * scratchpad and is reproduced in task-11-report.md.
 *
 * ── Frozen assets, all left alone ───────────────────────────────────────────
 *
 *   nymm.jpg         the cover, captured from the LIVE site on 2026-09-07 with the live
 *                    `158+` Google Reviews dial; shared by /, /work/, /process/ and
 *                    /services/web-development/ (twice). A local re-capture would read the
 *                    config fallback `144+`. Not re-captured.
 *   mechanicseo.png  the same Lighthouse report at 512x265; stays for
 *                    /services/web-development/. This page now uses the 1600-wide version.
 *   conversion.png   the live /reviews page on a phone (4.9, 147 reviews, the fixed
 *                    Call / Text Now bar). Not re-captured — locally the page would read
 *                    `5.0` from 8 curated reviews.
 *
 * ── What is hidden ──────────────────────────────────────────────────────────
 *
 *   nextjs-portal    Next's dev-mode indicator (the "N" badge, bottom-left). Dev-only chrome.
 *
 * Nothing else: the site is public and names its own business.
 */
export default defineShots("new-york-mobile-mechanic", [
  {
    // Evidence for: "Nine services crossed with five boroughs make forty-five pages, each one
    // composed from the service's own angle and a paragraph written for that borough". The
    // H1 `Mobile Brake Repair in Queens, NY`, the "near me" intro from
    // `comboServiceMeta["brake-jobs"]`, the service's own description, and — below the fold
    // of the frame, but in it — "Why get brake repair done on-site in Queens" (the service
    // angle with the borough's own spots appended) and "Mobile mechanic service in Queens"
    // (the borough paragraph). No price chip renders on a combo page.
    route: "/service-areas/queens/brake-jobs",
    viewport: { width: 1600, height: 1000 },
    out: "new-york-mobile-mechanic-combo.jpg",
    minBytes: 60000,
    waitFor: "main h1",
    hideSelectors: ["nextjs-portal"],
  },
  {
    // Evidence for: "thirty pages that each take one question a driver actually types … with
    // its own price chip and a note saying what that price covers". `Diagnosis from $95`, the
    // note that the alternator itself is quoted once testing confirms it, and the
    // answer-first lead.
    route: "/services/starter-alternator/alternator-replacement",
    viewport: { width: 1600, height: 1000 },
    out: "new-york-mobile-mechanic-topic.jpg",
    minBytes: 60000,
    waitFor: "main h1",
    hideSelectors: ["nextjs-portal"],
  },
]);
