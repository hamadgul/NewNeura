# PackShip — case-study dossier

Source of record: `~/Projects/MagicBoxer` (the app and its Express backend; private, read-only
for this work; HEAD `71bbfbcd`, 2026-08-17), `~/Projects/docs` (design notes, not a git repo),
and `~/Desktop/PackShip Files` (App Store assets). `~/Projects/MagicBoxer copy` is a decoy and
was not opened. Nothing in this file was taken from memory; every line names the file or
command it came from. Line numbers are from HEAD `71bbfbcd`.

The page it backs: `/work/packship/` — `src/components/site/work/packship/content.ts` and
`src/app/work/packship/page.tsx`.

**No boot.** PackShip is an Expo / React Native app with no web build, so the capture runner
was not used. Every image on the page is one of the app's own device screenshots, committed
in the repo (`src/assets/GettingStarted/*.jpg`, 1206x2622, iPhone 16 Pro, committed
2026-05-13 in `#58`) or shipped to the App Store (`02_build.png`, 2026-05-11), placed on the
same dark ground and card the frozen cover already uses. See **Shot list**.

---

## The claim this page used to make, and why it is gone

The shipped page's first feature read: "A model running on the phone estimates an item's
dimensions from a single photograph. No LiDAR needed. Typical error lands around a
centimetre." Three checks, all against HEAD:

1. **No on-device model.** `grep -rniE "tflite|coreml|onnx|tensorflow|mlkit|monocular|photograph" src`
   → no hits. `git log --all --diff-filter=A --name-only | grep -iE "\.(tflite|mlmodel|onnx|pt|pb)$"`
   → nothing, ever, across 1,452 commits.
2. **Measuring needs LiDAR.** `ios/SmartBoxAI/LidarMeasureModule.swift:42-43` sets
   `supported = ARWorldTrackingConfiguration.isSupported && supportsFrameSemantics(.sceneDepth)`;
   `src/screens/FormPage.jsx:660-673` shows the scan buttons only when that returns true.
   `~/Projects/docs/LIDAR_MEASUREMENT_README.md` → "iPhone 12 Pro or later Pro models".
3. **The photo path is a server call.** `backend/api/openai.js:288` `POST /identify-image` →
   `gpt-4o` (line 307) returns a product *name*; dimensions come from the text lookup
   (`/chat`, `gpt-4o-mini`, line 121). Nothing estimates size from pixels; no accuracy figure
   exists anywhere in the repo or the docs.

The claim is cut from this page and filed as a cross-page delta everywhere it is echoed.

---

## Stack (verified)

Read from `package.json`, `backend/package.json`, `app.config.js` and `ios/SmartBoxAI/*.swift`
on 2026-09-11. Versions are the declared ranges, not lockfile pins.

**App** — `package.json` (`"name": "smartbox-ai"`; display name is `PackShip`,
`app.config.js:4`), Expo SDK `^54.0.25`, React Native `0.81.5`, React `19.1.0`, TypeScript
`~5.9.2`, `expo-router ~6.0.14` + React Navigation 7 (stack, tabs, drawer),
`react-native-reanimated ~4.1.1`, `three ^0.166.0` + `expo-three ^8.0.0` + `expo-gl ~16.0.7`
(the 3D packing view), `expo-camera`, `expo-image-picker`, `expo-print` + `expo-sharing` (PDF
export), `react-native-purchases ^9.6.5` + `react-native-purchases-ui` (RevenueCat),
`@sentry/react-native 7.13.0`, `expo-secure-store` (tokens, `WHEN_UNLOCKED_THIS_DEVICE_ONLY`,
`src/services/secureStorage.js:18`), `expo-apple-authentication`, `expo-auth-session`,
`csv-parse`, `axios`. Tests: `jest ^29.2.1` + `jest-expo ~54.0.13`; `detox ^20.45.1` (e2e, not
run). Lint: `eslint ^9.37.0` with `--max-warnings 0` in `lint:check`.

**Native (iOS)** — four Swift files under `ios/SmartBoxAI/`: `LidarMeasureModule.swift` (684
lines, ARKit `sceneDepth` box measurement), `ARMeasureView.swift` (507 lines, anchored
point-to-point measuring), `ARCameraView.swift`, `LidarGeometryTests.swift` (20 XCTest
functions, not run here — no Xcode build in this task). Bridged with three `.m` files.

**Backend** — `backend/package.json` (`smartbox-tracking-backend`), Node `>=18`:
`express ^4.18.2`, `pg ^8.10.0`, `redis ^4.6.5`, `node-pg-migrate ^8.0.4` (3 migrations),
`jsonwebtoken`, `bcryptjs`, `apple-signin-auth`, `google-auth-library`, `helmet`,
`express-rate-limit`, `joi`, `winston`, `node-cron`, `resend` (email), `@sentry/node ^7.43.0`,
`axios`. Tests: `jest ^30.3.0` + `supertest`. Deployed on **Railway**: `backend/railway.json`
(Nixpacks, `npm start`, health check `/health`, restart on failure up to 10 times) and
`backend/railway.toml`; `backend/Procfile` for the same.

**Store** — App Store id `6754204899`, listing name "PackShip: Shipping Calculator", version
1.2.0 (bundle version bumped in HEAD's own commit, `fix(ios): bump CFBundleShortVersionString
to 1.2.0`; the listing fetched 2026-09-11 shows 1.2.0, released August 18, seller Hamad Gul,
iOS 15.1+, iPhone and iPad, Utilities). Two in-app subscriptions and a free tier
(`src/config/subscriptionPlans.js`; prices deliberately not quoted on the page).

**Where the models are, and are not.** The only ML in the product is OpenAI, on the server:
`backend/api/openai.js` — `/chat` (`gpt-4o-mini`, dimension lookup by name) and
`/identify-image` (`gpt-4o`, product identification from a photo). Both sit behind
`authenticateToken`, a monthly per-user quota (`checkServiceLimit('openai')`), a circuit
breaker (`circuitBreakers.openai`: 5 failures, 60s timeout, 60s reset,
`backend/utils/circuitBreaker.js:203-209`) and, for images, a Redis-backed 10-per-minute
per-user limiter (`openai.js:31-43`). The packing solver runs entirely on the phone
(`src/packing_algo/`, 5,905 lines of TypeScript); the LiDAR measurement runs entirely on the
phone (ARKit).

---

## Architecture decisions

Six that cost real work. Each is a mechanism a reader can check, cited to the file.

**1. The solver picks the smallest box the items actually fit in, by geometry, and the
first fit wins.** `packingCore.ts:960-1176` (`pack`): boxes below the items' total volume are
dropped (`filterVol`), boxes that cannot hold the largest item in any rotation are dropped
(`preRejectImpossibleBoxes`), boxes whose weight limit the items exceed are dropped
(`filterByWeightLimit`), then the survivors are sorted envelopes and mailers first, boxes by
volume ascending (`sortWithEnvelopePriority`, comment at `:1102`: "cheaper options first").
`findBoxAsync` (`:1308`) then walks that list and tries **six item orderings** per box
(`packingUtils.ts:292-301`: heaviest first, max-dimension, aspect ratio, flattest first,
largest footprint, volume) with **six rotations** per item
(`utils/coordinateSystem.ts:226-242`, `ROTATION_COUNT = 6`) into a guillotine split tree
(`packingCore.ts:1653` "Guillotine split with orientation bias"). The first box every item
fits into is the answer. A quick-reject pass (`:1355-1371`) skips a box's other five orderings
when its first item cannot fit an empty box.

**2. A failed pack names the item that blocked it.** `PackingFailureAnalysis`
(`packing_algo/packingFailureAnalysis.ts`) records, per candidate box, how many items fitted
and which one failed; `pack` returns `reason: 'no_fit_found'` with `bestSuccessRate`,
`bestBoxType` and `failedItemName` (`packingCore.ts:1135-1153`) so the screen can say "9 of
10 items fit in [box]; [item] is the blocker" instead of a generic toast (the comment at
`:1128-1131`). Volume, longest-dimension and weight failures each carry a `bottleneckItem`
the same way (`:1002-1098`).

**3. What will not fit in one box is split into up to five.** `packingSplit.ts` — First Fit
Decreasing across `DEFAULT_MAX_PACKAGES = 5` (`:22`), a 70 lb default weight limit (`:23`),
oversized-item detection in batches of five (`:24`), and results cached across screens
through `packingCacheService`. Its screen is `SplitPackagePreviewPage.jsx`.

**4. A stability re-pack that can never change the box.** Design at
`docs/superpowers/specs/2026-05-15-stability-aware-restage-design.md`: the motivating case was
a USPS Large Flat Rate Box at 88.3% fill with six thin items stacked in one tall column that
would collapse in transit. The post-pass (`packingRestage.ts`) scores tall / thin / heavy /
void / deep-stack pathologies (`TALL_WEIGHT 2.0 … DEEP_STACK_WEIGHT 2.5`, `:11-17`), re-packs
into the **same** box with a stability-weighted profile, and keeps the result only if
instability improves by `MIN_IMPROVEMENT 0.10` and fill drops by no more than
`MAX_FILL_DROP 0.03` (`:23-25`). The gate `INSTABILITY_GATE 0.20` was "tuned 2026-05-19 from
Phase 1 timing data" on a real iPhone (`:23`). Hard constraints in the spec: same box always;
fall back to the original pack on any failure; deterministic, so the pack cache key stays
valid.

**5. Carrier rates are proxied, cached, quota'd and fused.** `backend/api/shipping.js`:
one endpoint per carrier (`/estimates/ups|fedex|usps`, `:279-295`; the all-carriers
endpoint returns `410 ENDPOINT_DEPRECATED`, `:297`). Each call checks a Redis key built from
carrier, both zips, the exact box the solver chose, packaging type, weight and residential
flag (`shippingCacheKey`, `:30-52`) with a **15-minute TTL** (`SHIPPING_CACHE_TTL = 900`,
`:23`); on a miss it runs the carrier call inside a **circuit breaker** (3 failures, 30s
timeout, 2-minute reset with exponential backoff, `circuitBreaker.js:181-201`) wrapped in a
**one-shot auth retry** that clears and refreshes the OAuth token on 401/403 so an expired
token never trips the breaker (`shipping.js:105-122`; token managers refresh 60s early,
`carrierAuth.js:15`). Rates come back sorted cheapest first (`:231`); a successful call
increments the user's monthly usage in Postgres (`increment_service_usage`, `:221-228`).
A user who links their own UPS/FedEx/USPS account (`carrier-accounts.js`, account numbers
stored `aes-256-gcm`, `utils/encryption.js:10`) gets negotiated rates, flagged
`isNegotiatedRate` (`shipping.js:501`).

**6. Usage quotas live in the database, and the increment was made atomic.** Free tier:
45 rate lookups a month (15 per carrier), 25 AI lookups, 10 saved items, 3 saved packages
(`src/config/subscriptionPlans.js:22-27`); `api_services.monthly_limit` seeds `('ups', 15)`
etc. (`migrations/1706990000000_initial-schema.js:274-277`); `check_service_quota` is a SQL
function (`:381-413`). Migration `1707000000000_fix-increment-service-usage-race-condition.js`
replaced a SELECT-then-INSERT with `INSERT … ON CONFLICT … DO UPDATE` after concurrent
requests produced duplicate-key failures (its own header, lines 1-16). RevenueCat is the
source of the tier: `backend/api/revenuecat-webhook.js` verifies the webhook's authorization
header (`:73-74`) and `utils/subscriptionTiers.js` maps entitlements to `free | casual | pro`.

**Supporting decisions worth knowing:**
- The AI lookup **refuses low confidence**: the prompt demands
  `"confidence": "high" | "medium" | "low" | "not_found"` (`src/hooks/useAIDimensionLookup.js:321`),
  and the hook throws on `not_found` and `low` (`:73-80`) after a local gibberish filter
  (`:14-52`). Clothing is forced to folded dimensions (`:273-275`). A hit is cached for
  **7 days in Redis** and written to Postgres via `save_item_to_cache`
  (`backend/services/openaiCache.js:12, 100-117`; the table's DDL is not in the repo's
  migrations — created out of band).
- AR point placement samples the centre raycast across frames and takes the component-wise
  median (`SAMPLES_NEEDED 5`, `MAX_SAMPLE_FRAMES 15`, `MIN_SAMPLES_ACCEPTED 3`,
  `ARMeasureView.swift:49-51, 137-156`); points are `ARAnchor`s so they stay put as the phone
  moves (`:20-26`). Placement fails loudly on limited tracking or no surface (`:141, 152`).
- The solver yields to the UI on a 16 ms budget (`YIELD_BUDGET_MS = 16`,
  `packingCore.ts:272`) and reports "Trying <box> (j/n)" progress (`:1333-1338`).
- Both sides report to Sentry: `src/config/sentry.ts:101-106` (`tracesSampleRate: 0.2`) and
  `backend/server.js:18-67` (production only).
- The backend stack of middleware: helmet, correlation ids, a 10 MB body cap, parameter
  pollution and NoSQL-injection filters, an idempotency layer, a global 1000-per-15-min
  limiter (`server.js:126-195`).

---

## Gaps — in the repo, absent from the page

1. **LiDAR measuring** — the whole `ios/SmartBoxAI` native layer, `DimensionMeasureScreen.tsx`,
   `LidarMeasureScreen.tsx`. The page said the opposite ("No LiDAR needed").
2. **AI Item Search by name or photo, with a confidence gate and a two-layer cache** — the
   page's "on-device model" sentence described none of this.
3. **The failure analysis that names the blocking item** (decision 2), and the
   **split-package** path (decision 3). The page said "watch it pack itself" and nothing about
   what happens when it cannot.
4. **The stability re-pack** (decision 4).
5. **Linked carrier accounts for negotiated rates**, AES-256-GCM at rest (decision 5).
6. **The account layer**: Apple / Google / email sign-in (`backend/api/auth.js`), saved items
   and packages in Postgres (`user_saved_items`, `user_packages`, `user_package_items` —
   9 tables in all), CSV import/export (`src/services/csvPackageService.js`), PDF rate export
   (`src/hooks/useShippingPDF.js:258`), custom box sizes (`CustomBoxSizesPage.jsx`), an
   offline banner (`OfflineBanner.jsx`).
7. **The catalogue**: 149 boxes and envelopes the solver can choose from — 81 retail, 20
   USPS, 32 FedEx, 16 UPS — with per-carrier packaging codes and weight limits
   (`packing_algo/carrierBoxes.ts`), plus the user's custom boxes in "No Carrier" mode.
8. **Tests**: 349 Jest tests on the app (348 pass, 1 skipped), 22 on the backend, 20 XCTest
   functions on the LiDAR geometry, 7 Detox e2e cases. The page named no number.

Items 1, 2, 3, 5 and 8 drive the rewrite. 4, 6 and 7 are on the page in one sentence each or
in the Details table; the rest is recorded here.

---

## Audience, objection, primary action

Per `.agents/product-marketing.md` §2 this is segment 3, **consumer-product builders** —
someone who wants an App Store-shippable product and wants to see it evidenced by working
code. Secondary readers from segments 1 and 2 browse past it on `/work/`.

**The objection this page has to answer:** *"An app-store app is a demo with an icon — is
there a real system under it, and does it hold up when the outside world misbehaves?"* The
answers on this page are all mechanisms: a solver that names the item it could not place, a
rate proxy with circuit breakers and a token-refresh retry, an AI lookup that refuses a low
confidence, quotas enforced in the database, three test suites with counts.

**Secondary objection** (§2): *"is this their one good project?"* — the real stack, the
store version, the numbers.

**Primary action:** `/contact/` via `GeneralCta`. The App Store link stays in
`PROJECT_DETAILS` as supporting proof, not as the CTA (§1, editorial decision). The CTA line
names this reader's own situation (an app idea that needs to reach the store) rather than
`/process/`'s generic line.

**What the page must not do:** quote NeuraGul's price or timeline; quote the app's
subscription prices (they are the client's pricing, not evidence of engineering); claim
download numbers, revenue or ratings (none in the repo); claim measurement accuracy.

---

## Verifiable numbers

Run from `~/Projects/MagicBoxer` unless stated.

| Number | Command / file |
| --- | --- |
| **349** app tests, 348 passing, 1 skipped, 31 files | `EXPO_NO_DOTENV=1 CI=1 npx jest --ci --maxWorkers=4` → `Tests: 1 skipped, 348 passed, 349 total`; `npx jest --listTests \| wc -l` → 31. The skip is `it.skip` in `flatStackPreference.test.js:71` (documented limitation). |
| **22** backend tests, 4 files | `cd backend && NODE_ENV=test CI=1 npx jest --ci --maxWorkers=4` → `Tests: 22 passed, 22 total` |
| **20** XCTest functions (not run) | `grep -c "func test" ios/SmartBoxAI/LidarGeometryTests.swift` |
| **7** Detox e2e cases (not run) | `grep -c "it(" e2e/starter.test.js` |
| **149** catalogue entries: 81 retail, 20 USPS, 32 FedEx, 16 UPS | count of `[L, W, H, …]` tuples per block in `packing_algo/carrierBoxes.ts` (`RETAIL_BOXES :34-153`, `USPS_BOXES :158-186`, `FEDEX_BOXES :193-244`, `UPS_BOXES :249-279`) |
| **6** rotations per item | `utils/coordinateSystem.ts:242` `ROTATION_COUNT = 6` |
| **6** item orderings per box | `packing_algo/packingUtils.ts:292-301` |
| up to **5** packages in a split | `packingSplit.ts:22` `DEFAULT_MAX_PACKAGES = 5` |
| **5,905** lines in the solver | `wc -l src/packing_algo/*.ts` |
| **15-minute** rate cache | `backend/api/shipping.js:23` |
| **7-day** AI lookup cache (Redis) | `backend/services/openaiCache.js:12` |
| breaker: **3** failures / **30 s** / **2 min** (carriers), **5** / **60 s** / **60 s** (OpenAI) | `backend/utils/circuitBreaker.js:181-209` |
| **10**/min image-recognition cap per user | `backend/api/openai.js:34-35` |
| free tier **45** lookups (15 per carrier), **25** AI lookups, **10** items, **3** packages | `src/config/subscriptionPlans.js:22-27`; `migrations/1706990000000_initial-schema.js:274-277` |
| **9** Postgres tables, **3** migrations | `grep -c "createTable(" backend/migrations/*.js` → 8 + 1; `ls backend/migrations \| wc -l` |
| **48** backend routes | `grep -n "router\.\(get\|post\|put\|delete\|patch\)(" backend/api/*.js \| wc -l` |
| **1,452** commits, 2022-11-19 → 2026-08-17 | `git rev-list --count HEAD`; `git log --format=%ad --date=short \| sort \| sed -n '1p;$p'` |
| AR measuring landed **2025-12-12** | `git log --reverse --format=%ad --date=short -- ios/SmartBoxAI/LidarMeasureModule.swift \| head -1` |
| App Store **1.2.0**, released **August 18** (2026) | HEAD commit subject; listing at `apps.apple.com/app/id6754204899` fetched 2026-09-11 |
| **5 / 15 / 3** AR sampling frames | `ios/SmartBoxAI/ARMeasureView.swift:49-51` |
| **18 of 31** test files are the solver's | `npx jest --listTests \| wc -l` → 31; `npx jest --listTests \| grep -c packing_algo/__tests__` → 18 |
| **two** subscriptions (plus a free tier) | `backend/utils/subscriptionTiers.js:23-26` `PRODUCT_TIER_MAP` has two product ids (`pro.yearly`, `casual.monthly1`); the App Store listing (fetched 2026-09-11) lists two in-app purchases. `subscriptionPlans.js` also defines an `enterprise` plan with no RevenueCat product mapped, so it is not sold. |

**Numbers deliberately NOT used on the page:** 48 routes, 9 tables, 5,905 lines, 1,452
commits, the 10/min image cap, the breaker constants. True, checkable, and they measure the
wrong thing for a reader; the test counts, the catalogue size, the rotations/orderings, the
cache TTLs and the free-tier quotas carry the argument.

---

## Unverifiable claims

For the user. **Not written on the page.**

1. **"Typical error lands around a centimetre."** No accuracy measurement exists for either
   the LiDAR path or the AI lookup. `LidarMeasureModule.swift` returns an
   `accuracy_estimate_in` per measurement, but nothing aggregates it. **Cut.**
2. **"No LiDAR needed."** False against the code (see the section at the top). **Cut**, and
   the page now says the opposite.
3. **"A model running on the phone."** False; the lookup is server-side OpenAI. **Cut.**
4. **"The cheapest safe option wins, usually by a wider margin than people expect."** No
   margin is measured anywhere. **Cut**; replaced with what the screen shows (cheapest and
   fastest marked, list sorted by price).
5. **"Resellers overpay $2-7 a package on the wrong box."** The App Store listing's own first
   line. The repo has no source for the figure. **Not written.**
6. **Downloads, ratings, revenue, active subscribers.** Not in the repo. **Not written.**
7. **"Fast enough to feel instant"** (the old intro body, about Redis). A 15-minute cache is a
   mechanism; "instant" is not measured. **Cut**; the mechanism is stated instead.
8. **The cover's "Schedule Pickup" buttons.** The rate cards in HEAD no longer render them
   (`src/components/EstimateResults.jsx:45-47`: "Pickup URLs kept for reference but no longer
   rendered"). The frozen cover predates that change and is shared by nine other pages, so it
   is left alone; the page does not mention pickups.

---

## Shot list

Three images, no captures. Each names the sentence it is evidence for. The cover is not
touched: `packship.jpg` is referenced by `/`, `/work/`, `/process/` and six service pages
with the alt "The PackShip parcel-sizing app on iOS" (the About page names it in a comment
only); its
`md5` equals `git show HEAD:public/site/images/packship.jpg`.

**Why the demo PNGs were not used.** `demo/1-5.PNG` (1179x2556, committed 2025-01-21) show a
light-blue UI with a hamburger drawer, no bottom tab bar, no AI lookup, no AR scan buttons, no
carrier chips on the Optimal Box screen, and a "Saved Packages" card layout that no longer
exists. HEAD's screens (`src/assets/GettingStarted/*.jpg`, committed 2026-05-13) are the dark
theme with the four-tab bar (Pack / Items / Packages / Help), the `AI` chip and the scan
icons on the form — the layout `FormPage.jsx` and `AppNavigator.js` render today. The demo
set is stale and none of it is on the page.

**Where the images come from.** No web boot exists, so
`$SCRATCH/packship-compose.mjs` (reproduced in full in `task-10-report.md`) reads the
committed screenshots and writes three JPEGs into `public/site/images/`, with `sharp` from
NewNeura's own `node_modules`. Geometry is measured from the frozen cover: ground gradient
`rgb(12,20,39) → rgb(10,14,25)`; card `432x604`, radius 28, at 4/3 scale for the 1600x1000
frames; the screen fitted to the card's height and centred, corners rounded 20. Nothing in
any screenshot is edited; each is scaled and placed. The AR screen is cropped from the App
Store composite `02_build.png` at its measured screen rectangle (`x 312..971, y 139..1565`),
which is the developer's own device screenshot rendered at 660 px wide.

| `out` | Source screen(s) | Evidence for |
| --- | --- | --- |
| `packship-measure.jpg` (1600x1000) | `CreatePackage.jpg` + the AR frame of `02_build.png` | "Type the dimensions, tap the AI chip beside the name field to look them up, or tap the scan icon beside a field and measure it with the phone's LiDAR." — the form shows the `AI` chip and the three scan icons; the AR screen shows a 6.5" width measured on a keyboard, with the app's own "Ready to measure", the 1–2 step pill, and "Use 6.5"". |
| `packship-library.jpg` (1600x1000) | `savedItems.jpg` + `savedPackages.jpg` | "What comes back is saved to the account, so the second time is a tap." — four saved items, three of them with the `AI` badge, and three saved packages with item counts. |
| `packship-lookup.jpg` (1179x2203, portrait slot) | `itemAILookUp.jpg`, status bar cropped | "the answer comes back as dimensions in inches with a confidence level" — `Product Found · Microsoft Xbox Series X (1TB)`, the `AI Verified` badge (the confidence the app accepted), length / width / height in inches, weight, and the screen's own note, which is the block's quote. The screen shows a high-confidence success; it does not show the refusal path, so the refusal sentence in the same paragraph is carried by the code citation, not by this image. |

**Not on the page, and why.** `3DPackage.jpg` and `shippingRates.jpg` are the two phones of
the frozen cover (same timestamps, 1:06 and 1:38); repeating either in the body is the Task 8
duplicate-cover trap. The App Store composites' headline text is marketing copy and is
cropped away. `FormPage.jpeg` in `demo/` is the old form.

---

## Cross-page deltas

The cut sentence — an on-device model sizing an item from a photograph, no LiDAR, about a
centimetre — is echoed outside this page in the files below. Each entry is a
`{file, anchor, replacement, reason}`; anchors are exact current strings (or, where the
string wraps, the unique fragment plus its line number). **None applied by this task.**
Line numbers are from `case-study-expansion` at `1456aaf`.

**The reasons, shared, so they are not repeated eighteen times:** (a) no on-device model
exists (`grep` of `src/`, all of git history); (b) measuring is ARKit `sceneDepth` and is
gated on LiDAR (`LidarMeasureModule.swift:42-43`, `FormPage.jsx:660-673`); (c) the photo path
is a server call to `gpt-4o` that returns a product name (`backend/api/openai.js:288-307`);
(d) no accuracy figure exists anywhere ("about a centimetre" is measured nowhere); (e) "the
cheapest safe option wins, usually by a wider margin than people expect" — no margin is
measured anywhere (Unverifiable item 4); (f) "fast enough to feel instant" — not measured
(Unverifiable item 7).

### `src/components/site/services/app-development/content.ts`

1. `{file: "src/components/site/services/app-development/content.ts", line: 106, anchor: "A model running on the phone estimates an item's dimensions from that photograph, with no LiDAR involved. Typical error lands around a centimetre, which is less than the padding most people were going to stuff in anyway. A live Three.js scene then fits your items into candidate boxes while you watch, inside React Native. Rotate it. Swap the box. See exactly how much empty air you were about to pay to ship across the country.", replacement: "The item's dimensions come from the phone's LiDAR scanner, or from a lookup by name or photo that refuses a low-confidence answer. A live Three.js scene then fits the items into the smallest carrier box that takes them, inside React Native. Rotate it. Swap the box. See how much empty air you were about to pay to ship.", reason: "(a) (b) (c) (d)"}`
2. `{file: "src/components/site/services/app-development/content.ts", line: 107, anchor: "Postgres and Redis keep the lookups fast enough to feel instant, so the cheapest safe option surfaces while you are still holding the parcel. A multi-step, error-prone chore became one photo and a tap.", replacement: "Each quote is cached in Redis for 15 minutes on the exact box and route, and the list comes back sorted cheapest first with the cheapest and the fastest marked.", reason: "(f); 'one photo and a tap' names one of three entry points — see delta 15 for the same sentence"}`
3. `{file: "src/components/site/services/app-development/content.ts", lines: "141-143", anchor: "title: \"One photo, measured\",\n      caption: \"On-device model\",\n      text: \"A model running on the phone estimates an item's dimensions from a single photograph. No LiDAR needed. Typical error lands around a centimetre, which is less than the padding most people were going to stuff in anyway.\"", replacement: "title: \"Measured, or looked up\",\n      caption: \"LiDAR and a lookup\",\n      text: \"Dimensions come in three ways: typed, measured with the phone's LiDAR scanner through ARKit, or looked up by name or photo through a server call that comes back with a confidence level and refuses anything below medium.\"", reason: "(a) (b) (c) (d); phase 01 of the process slider"}`
4. `{file: "src/components/site/services/app-development/content.ts", line: 159, anchor: "UPS, FedEx, and USPS rates sit side by side and re-quote themselves every time the box changes. The cheapest safe option wins, usually by a wider margin than people expect.", replacement: "UPS, FedEx and USPS rates are fetched in parallel through the backend, cached in Redis for 15 minutes on the exact box and route, and listed cheapest first with the cheapest and the fastest marked.", reason: "(e); phase 03 of the process slider"}`
5. `{file: "src/components/site/services/app-development/content.ts", lines: "196-197", anchor: "lead: \"On-device models:\",\n      text: \"PackShip sizes an item from one photograph to about a centimetre, with the model running on the phone and no LiDAR involved.\"", replacement: "lead: \"On the device:\",\n      text: \"PackShip's packing solver and its 3D view run on the phone, with 18 of the app's 31 Jest test files on the solver; measuring is ARKit with the LiDAR scanner, and the dimension lookup is a server call with a seven-day cache and a confidence gate.\"", reason: "(a) (b) (c) (d); the lead and the sentence are one claim, replaced together"}`

Fine as-is in this file: `:105` "The app answers all three from a single photograph." — the
photo path is real (`POST /identify-image` → name → dimensions → box → rates); the controller
has deferred this sentence's twin on the packship page. `:167` "React Native on the front,
Postgres and Redis behind it" — true; an Express-on-Railway mention would be fuller but
nothing is false. `:6, :36, :38, :120, :127, :254` — comments and a luminance measurement;
no claim. `:212` "not a demo build passed around on TestFlight" — true (App Store 1.2.0).

### `src/components/site/services/applied-ai-models/content.ts`

6. `{file: "src/components/site/services/applied-ai-models/content.ts", line: 103, anchor: "PackShip's sizing model runs on the phone that was going to take the photograph anyway, so nobody has to open a second app, upload anything, or wait on a round trip to a server.", replacement: "PackShip's packing solver runs on the phone, so choosing a box never waits on a server; the dimension lookup is a server call with a seven-day cache and a confidence gate.", reason: "(a); the lookup IS a round trip to a server (backend/api/openai.js); only the solver is on-device"}`
7. `{file: "src/components/site/services/applied-ai-models/content.ts", line: 104, anchor: "It estimates an item's dimensions from a single photograph, with no LiDAR. Typical error lands around a centimetre, which is less than the padding most people were going to stuff in the box anyway. From there a live 3D scene fits the item into candidate boxes while you watch, and UPS, FedEx, and USPS rates re-quote themselves every time the box changes.", replacement: "Measuring is ARKit with the LiDAR scanner on Pro iPhones; the lookup by name or photo comes back with a confidence level, and anything below medium is refused. From there a live 3D scene fits the items into the smallest carrier box while you watch, and UPS, FedEx and USPS rates are fetched in parallel and listed cheapest first.", reason: "(a) (b) (c) (d)"}`
8. `{file: "src/components/site/services/applied-ai-models/content.ts", line: 139, anchor: "PackShip's whole job happens inside the camera flow somebody was going to use regardless. A model that needs a new habit around it is a model that gets used twice.", replacement: "PackShip's whole job happens inside the form somebody fills to ship a parcel: a name, a photo or a LiDAR scan, and the box and rate follow. A model that needs a new habit around it is a model that gets used twice.", reason: "there is no camera-only flow; the form is the entry point (CreatePackage.jpg)"}`
9. `{file: "src/components/site/services/applied-ai-models/content.ts", lines: "149-151", anchor: "title: \"One photo, measured\",\n      caption: \"On-device model\",\n      text: \"A model running on the phone estimates an item's dimensions from a single photograph. No LiDAR needed. Typical error lands around a centimetre, which is less than the padding most people were going to stuff in anyway.\"", replacement: "title: \"Measured, or looked up\",\n      caption: \"LiDAR and a lookup\",\n      text: \"Dimensions come in three ways: typed, measured with the phone's LiDAR scanner through ARKit, or looked up by name or photo through a server call that comes back with a confidence level and refuses anything below medium.\"", reason: "(a) (b) (c) (d); phase 02 of the process slider"}`
10. `{file: "src/components/site/services/applied-ai-models/content.ts", lines: "162-163", anchor: "caption: \"Carrier APIs on Redis\",\n      text: \"UPS, FedEx, and USPS rates sit side by side and re-quote themselves every time the box changes. The cheapest safe option wins, usually by a wider margin than people expect.\"", replacement: "caption: \"Carrier APIs on Redis\",\n      text: \"UPS, FedEx and USPS rates are fetched in parallel through the backend, cached in Redis for 15 minutes on the exact box and route, and listed cheapest first with the cheapest and the fastest marked.\"", reason: "(e); phase 03 of the process slider. The text alone appears twice in this file (:163 and :224, the latter is delta 13's); the caption line makes this one unique"}`
11. `{file: "src/components/site/services/applied-ai-models/content.ts", lines: "213-214", anchor: "lead: \"On-device model:\",\n      text: \"A model running on the phone estimates an item's dimensions from a single photograph. No LiDAR needed. Typical error lands around a centimetre, which is less than the padding most people were going to stuff in anyway.\"", replacement: "lead: \"On the device:\",\n      text: \"The packing solver: 149 boxes, envelopes and mailers across USPS, FedEx, UPS and retail sizes, six item orderings by six rotations, first fit wins, all on the phone, with 18 of the app's 31 Jest test files on the solver. Measuring is ARKit with the LiDAR scanner.\"", reason: "(a) (b) (c) (d); 'PackShip, layer by layer' paragraph 1"}`
12. `{file: "src/components/site/services/applied-ai-models/content.ts", lines: "218-219", anchor: "lead: \"Three.js in React Native:\",\n      text: \"A live 3D scene fits your items into candidate boxes while you watch. Rotate it. Swap the box. See exactly how much empty air you were about to pay to ship across the country.\"", replacement: "lead: \"Three.js in React Native:\",\n      text: \"A live 3D scene draws the chosen box with the used volume against the box volume. Rotate it. Swap the box or the carrier and it re-packs.\"", reason: "true in substance (the 3D view, alternative boxes, the fill percentage on screen); tightened so the four paragraphs read as one set — optional"}`
13. `{file: "src/components/site/services/applied-ai-models/content.ts", lines: "223-224", anchor: "lead: \"Carrier APIs on Redis:\",\n      text: \"UPS, FedEx, and USPS rates sit side by side and re-quote themselves every time the box changes. The cheapest safe option wins, usually by a wider margin than people expect.\"", replacement: "lead: \"Carrier APIs on Redis:\",\n      text: \"UPS, FedEx and USPS rates are fetched in parallel through the backend, cached in Redis for 15 minutes on the exact box and route, and listed cheapest first with the cheapest and the fastest marked.\"", reason: "(e); 'PackShip, layer by layer' paragraph 3"}`
14. `{file: "src/components/site/services/applied-ai-models/content.ts", lines: "228-229", anchor: "lead: \"Where it ended up:\",\n      text: \"Live on the App Store as a consumer product. A multi-step, error-prone chore became one photo and a tap.\"", replacement: "lead: \"Where it ended up:\",\n      text: \"Live on the App Store as a consumer product, at version 1.2.0: measure or look up the item, get the smallest box that fits, see three carriers' rates on one screen.\"", reason: "'one photo and a tap' names one of three entry points; the packship page's lead was rewritten the same way"}`

Fine as-is in this file: `:6` and `:118, :203-209` are comments describing the copy (they
will be stale once the deltas land; the controller may trim them). `:57` and `:141-142,
:153-154, :300-301` — the meta description and cover alts; see Notes for the controller
below for `:57`.

### Other files

15. `{file: "src/components/site/services/applied-ai-strategy/content.ts", line: 233, anchor: "PackShip answers all three from one photograph, with the model running on the phone that was going to take the photograph anyway. Also a yes.", replacement: "PackShip answers all three from a name, a photo or a LiDAR scan, with the packing solver running on the phone and the lookup behind a confidence gate. Also a yes.", reason: "(a); the thing that runs on the phone is the solver"}`
16. `{file: "src/components/site/services/applied-ai/content.ts", line: 109, anchor: "a model on a phone that sizes a parcel from one photograph to about a centimetre.", replacement: "a solver on a phone that fits a parcel into the smallest of 149 carrier boxes, with the item measured by LiDAR or looked up by name.", reason: "(a) (d)"}`
17. `{file: "public/llms.txt", line: 27, anchor: "An iOS app that answers box size, shipping cost and carrier from one photo, using a model that runs on the device.", replacement: "An iOS app that measures an item with LiDAR or looks it up by name or photo, packs it into the smallest carrier box in 3D on the phone, and compares live UPS, USPS and FedEx rates.", reason: "(a); llms.txt is orchestrator-owned"}`
18. `{file: ".agents/product-marketing.md", line: 162, anchor: "on-device sizing model" (the sentence wraps :161-163: "- PackShip: live on the App Store (`apps.apple.com/app/id6754204899`), an\n  on-device sizing model, a live 3D packing view, three-carrier live rate\n  comparison."), replacement: "- PackShip: live on the App Store (`apps.apple.com/app/id6754204899`), LiDAR\n  measuring on Pro iPhones, an on-device packing solver with 349 tests and a\n  live 3D view, a name-or-photo dimension lookup with a confidence gate,\n  three-carrier live rate comparison.", reason: "(a); the proof-point list feeds every later copy pass and must not hand the cut claim to Tasks 11-17"}`
19. `{file: "src/components/site/services/app-development/content.ts", line: 207, anchor: "UPS, FedEx and USPS rates racing each other on screen, with Postgres and Redis behind them so a re-quote comes back fast enough to feel instant.", replacement: "UPS, FedEx and USPS rates fetched in parallel through the backend, with each quote cached in Redis for 15 minutes on the exact box and route.", reason: "(f)"}`
20. `{file: "src/components/site/services/applied-ai-models/content.ts", line: 105, anchor: "React Native on the front, Postgres and Redis behind it so the rate lookups come back fast enough to feel instant, and a stack your team can hire for.", replacement: "React Native on the front, an Express backend on Railway with Postgres and Redis behind it, a 15-minute Redis cache on every rate quote, and a stack your team can hire for.", reason: "(f)"}`

### Anchor uniqueness (so the controller can apply by exact replacement)

Checked at `1456aaf`+fixes on 2026-09-11: single-line anchors by `grep -cF` of the exact
string in the file; multi-line anchors by matching each line against consecutive source lines
(indentation stripped). Every anchor occurs exactly once and at the cited line. Re-run the
same two checks before applying if any of these files has moved on.

| Delta | File | Lines | Check | Occurrences | At cited line |
| --- | --- | --- | --- | --- | --- |
| 1 | `app-development/content.ts` | 106 | single-line `grep -cF` | 1 | yes |
| 2 | `app-development/content.ts` | 107 | single-line `grep -cF` | 1 | yes |
| 3 | `app-development/content.ts` | 141-143 | 3 consecutive lines | 1 | yes |
| 4 | `app-development/content.ts` | 159 | single-line `grep -cF` | 1 | yes |
| 5 | `app-development/content.ts` | 196-197 | 2 consecutive lines | 1 | yes |
| 6 | `applied-ai-models/content.ts` | 103 | single-line `grep -cF` | 1 | yes |
| 7 | `applied-ai-models/content.ts` | 104 | single-line `grep -cF` | 1 | yes |
| 8 | `applied-ai-models/content.ts` | 139 | single-line `grep -cF` | 1 | yes |
| 9 | `applied-ai-models/content.ts` | 149-151 | 3 consecutive lines | 1 | yes |
| 10 | `applied-ai-models/content.ts` | 162-163 | 2 consecutive lines | 1 | yes |
| 11 | `applied-ai-models/content.ts` | 213-214 | 2 consecutive lines | 1 | yes |
| 12 | `applied-ai-models/content.ts` | 218-219 | 2 consecutive lines | 1 | yes |
| 13 | `applied-ai-models/content.ts` | 223-224 | 2 consecutive lines | 1 | yes |
| 14 | `applied-ai-models/content.ts` | 228-229 | 2 consecutive lines | 1 | yes |
| 15 | `applied-ai-strategy/content.ts` | 233 | single-line `grep -cF` | 1 | yes |
| 16 | `applied-ai/content.ts` | 109 | single-line `grep -cF` | 1 | yes |
| 17 | `public/llms.txt` | 27 | single-line `grep -cF` | 1 | yes |
| 18 | `.agents/product-marketing.md` | 162 | single-line `grep -cF` | 1 | yes |
| 19 | `app-development/content.ts` | 207 | single-line `grep -cF` | 1 | yes |
| 20 | `applied-ai-models/content.ts` | 105 | single-line `grep -cF` | 1 | yes |

### Every grep hit, accounted for

`grep -rn -iE "on-device|LiDAR|centimetre|photograph" src/ public/llms.txt .agents/product-marketing.md`
at `1456aaf`, excluding `src/components/site/work/packship/` and `src/app/work/packship/`,
returns 53 lines. Each:

| Hit | Delta / why it is fine |
| --- | --- |
| `services/app-development/content.ts:105` | fine — the photo path is real; the twin sentence on the packship page is deferred by the controller |
| `services/app-development/content.ts:106` | delta 1 |
| `services/app-development/content.ts:142`, `:143` | delta 3 |
| `services/app-development/content.ts:196`, `:197` | delta 5 |
| `services/applied-ai-strategy/content.ts:233` | delta 15 |
| `services/applied-ai/content.ts:109` | delta 16 |
| `services/applied-ai-models/content.ts:57` | Notes for the controller (taxonomy positioning; a meta description) |
| `services/applied-ai-models/content.ts:103` | delta 6 |
| `services/applied-ai-models/content.ts:104` | delta 7 |
| `services/applied-ai-models/content.ts:150`, `:151` | delta 9 |
| `services/applied-ai-models/content.ts:213`, `:214` | delta 11 |
| `public/llms.txt:16` | Notes for the controller (taxonomy positioning) |
| `.agents/product-marketing.md:162` | delta 18 |
| `work/content.ts:129` | Notes for the controller (a comment justifying the `custom-models` tag) |
| `work/delivery-routing/content.ts:16`, `work/restaurant-ordering-portal/content.ts:17`, `work/foodtruckrentals/content.ts:14`, `work/new-york-mobile-mechanic/content.ts:11, :66`, `work/vintus/content.ts:14`, `work/rwd-pipeline/content.ts:14`, `work/new-york-fine-foods/content.ts:14`, `work/landscape-drainage-proz/content.ts:22` | fine — "photograph(s)" in comments about alt text or the source layout's eighteen architecture photographs; no PackShip claim |
| `app/about/page.tsx:72`, `app/work/{landscape-drainage-proz,new-york-fine-foods,vintus,rwd-pipeline}/page.tsx:78-80`, `app/work/hasina-hijama-cupping/page.tsx:85` | fine — same: comments about photographs the layout carried |
| `home/HeroServiceCard.tsx:229`, `home/content.ts:148`, `home/NavigationFooter.tsx:148, :156, :169, :199, :205`, `home/HeroIntroPanel.tsx:23`, `shared/ParallaxHeaderImage.tsx:8`, `shared/blocks/BlockProjectsHighlight.tsx:405`, `shared/blocks/BlockHeaderProjects.tsx:11, :12`, `shared/blocks/BlockProcessCardSlider.tsx:540` | fine — comments about photographic backdrops and crops; no claim |
| `about/content.ts:34, :103`, `process/content.ts:184`, `services/cloud-infrastructure/content.ts:138`, `services/data-intelligence/content.ts:133`, `services/web-development/content.ts:20`, `services/applied-ai-evaluation/content.ts:81` | fine — comments about photography or "a guardrail, photographed" (delivery routing); no PackShip claim |

Also filed although outside that grep (they carry Unverifiable items 4 and 7, which this
page cut): deltas 2, 4, 10, 12, 13, 14, 19, 20.
`grep -rn "wider margin\|one photo and a tap\|feel instant" src/ public/llms.txt .agents/product-marketing.md`
→ 8 hits outside `work/packship/`: `app-development/content.ts:107` (delta 2), `:159` (delta 4),
`:207` (delta 19), `applied-ai-models/content.ts:105` (delta 20), `:163` (delta 10), `:224`
(delta 13), `:229` (delta 14) — and `app-development/content.ts:107` carries both "feel
instant" and "one photo and a tap" (one line, delta 2). The first filing of this sweep missed
`:207` and `:105` (it grepped for the phrase but I transcribed only the "wider margin" hits);
the review caught it.

No test-count delta: `grep -rn "349\|348" src public/llms.txt` finds no PackShip test count
anywhere before this task, so the number is introduced here only.

### Notes for the controller — the frozen taxonomy leans on the cut claim

Not this task's to change; recorded so the consequence is visible:

- `src/components/site/work/content.ts:129-130` justifies PackShip's `custom-models` tag with
  "an on-device model it needed a custom one for". No custom model exists. What PackShip does
  have on the applied-AI side is the OpenAI-backed lookup with a confidence gate and a
  two-layer cache, and the deterministic packing solver. Whether that still earns
  `custom-models` (the page is "Fine-tuned and on-device models") is a taxonomy call.
- `src/components/site/services/applied-ai-models/content.ts:57` (meta description) and
  `public/llms.txt:16` position Custom AI Models as "fine-tuned and on-device models that
  live inside the tools your team already opens every day", and PackShip is that page's only
  proof (`applied-ai-models/content.ts:6-7, :310-325`: PackShip takes the hero). After deltas
  6-14 the page's worked example is a solver plus a gated server-side lookup, which is
  "integration" more than "on-device model". The positioning sentence may need to move with
  it, or the page needs a different proof.
- The three new images (`packship-measure.jpg`, `packship-library.jpg`, `packship-lookup.jpg`)
  exist if either service page wants a PackShip image that is not the cover
  (`app-development/content.ts:36-38` reuses `packship.jpg` four times for lack of one).
