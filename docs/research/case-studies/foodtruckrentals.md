# Food Truck Rentals — case-study dossier

Source of record: `~/Desktop/foodtruckrentals.com`, read-only for this work; booted from a
scratch copy (`rsync -a --exclude .next` into `$SCRATCH/ftr`, the copy's gitignored
`.env.local` deleted from the copy). The raw client photographs live beside it in
`~/Desktop/truckrentalsmedia` (22 files + an `foodtruckrentals.com-audit/` folder); see
"Provenance of the photographs" below. Nothing in this file was taken from memory; every
line names the file or command it came from. HEAD at the time of reading: `5ff670f`
(2026-08-27, "neuragul"), branch `main`, 141 commits since 2026-07-20.

The page it backs: `/work/foodtruckrentals/` —
`src/components/site/work/foodtruckrentals/content.ts` and
`src/app/work/foodtruckrentals/page.tsx`.

**Credentials.** The repo has a gitignored `.env.local` naming three variables:
`RESEND_API_KEY`, `INQUIRY_TO`, `INQUIRY_FROM` (names read with `awk -F= '{print $1}'`;
no value was read or printed anywhere). All three are consumed only inside
`app/actions/inquiry.ts` (`'use server'`), on a form SUBMIT; when the key is unset the action
returns a friendly failure and delivers nothing. A fourth name, `CRON_SECRET`, gates
`app/api/indexnow/route.ts`, which fails closed when unset. No route reads any of them at
render time. The scratch copy's `.env.local` was deleted and all four names were set to the
empty string on every command line (tests and boot). Nothing here needed NEEDS_CONTEXT.

---

## Stack (verified)

Read from `package.json` on 2026-09-11. Versions are the declared ranges, not lockfile pins.

| Package | Declared | What it does here |
| --- | --- | --- |
| `next` | 16.2.10 (pinned) | App Router, 24 static route files + `app/work/[slug]` (7 case studies from `lib/case-studies.ts`); route handlers for `/llms.txt`, `/llms-full.txt`, `/pricing.md`, `/api/indexnow`; `experimental.inlineCss` (`next.config.ts:100-112`, production only); six permanent redirects (`next.config.ts:25-99`) |
| `react`, `react-dom` | 19.2.4 (pinned) | |
| `motion` | ^12.42 | the hero triad's blur-in and the roster's `AnimatePresence` (`any-street-hero.tsx`, `roster-index.tsx`); 5 importers |
| `geist` | ^1.7 | declared, **not imported anywhere** (`grep -rn "from 'geist" app components lib` → 0); the fonts in use are Archivo, Public Sans and Overpass Mono through `next/font/google` (`app/layout.tsx:10-35`) |
| `typescript` | ^5 | strict, `@/` alias to the repo root (`tsconfig.json`) |
| `tailwindcss`, `@tailwindcss/postcss` | ^4 | the whole visual layer; `app/globals.css` is 12.4 KB of source |
| `vitest` | ^4.1.10 (installed 4.1.10) | 24 test files, 141 tests; `jsdom` ^29, `@testing-library/react` ^16, `@testing-library/user-event` ^14, `@testing-library/jest-dom` ^7, `vitest-axe` ^0.1 (axe accessibility assertions in `tests/a11y.test.tsx`), `@vitejs/plugin-react` ^6 |
| `eslint`, `eslint-config-next` | ^9, 16.2.10 | |

No `@vercel/*` package, no analytics dependency. **Deployment** — Vercel: `vercel.json` carries
one weekly cron (`0 9 * * 1` → `/api/indexnow`); `.gitignore` lists `.vercel`. Canonical host
`https://www.foodtruckrentals.com` (`lib/site.ts:12`, with the reason: the apex 308s to `www`,
and canonicals emitted on the apex put every page into "crawled – currently not indexed" in
July 2026). Email delivery is the Resend REST API (`app/actions/inquiry.ts:52`).

**No CI wiring for the tests.** `package.json` `build` is `next build`; there is no
`prebuild`/`pretest`, no `.github/`, no `.husky/`. Three source comments say a test "fails
the build" (`app/sitemap.ts:16-17`, `tests/pricing.test.ts:27`, `lib/pricing.ts:7`); what the
repo actually does is fail `vitest run`. The page says "fails the test run".

---

## Architecture decisions

Eight a reader can check rather than an adjective. File references are to the source repo.

**1. One query, one owner — and the title-level guard was not enough.**
`tests/nyc-cannibalization.test.ts` (2026-07-29, rewritten 2026-08-16) lists nine phrasings
of the New York rental query (`CLUSTER`, lines 27-37) and names one route allowed to carry
them in its `<title>`, meta description or `<h1>`: `app/food-truck-rental-nyc/page.tsx`
(`OWNER`, line 40). Every other `page.tsx` is scanned and fails the run on a match; since
2026-08-01 the root layout is scanned too, because the homepage title lived there, read
"Food Truck Rentals NYC" from launch, and sat outside the guard for twelve days
(lines 107-128; `app/layout.tsx:48-61`). Then the harder lesson: the guard stayed green while
Google split two pages on body content anyway. The header of
`app/food-truck-rental-nyc/page.tsx:1-28` records the measurement of 2026-08-16 (DataForSEO
live SERP, New York): the `/nyc` hub at #45 for "food truck rentals" while the money page it
existed to feed was absent from the top 94, and "food truck rentals nyc" returning four of
the site's URLs at #57, #69, #83 and #92. So `/nyc` was merged INTO the owner page — the
five-borough ledger, parking/permits/power, seasonality and the NYC case spreads moved over —
and `/nyc`, `/newyork` and `/new-york` became 308s straight to it, with a test that no
redirect chains through another (`next.config.ts:63-84`; test lines 146-168). Booted copy:
`/nyc` → 308 `/food-truck-rental-nyc`; `/newyork` → 308 same.

**2. The sitemap's dates come from git, because the docblock failed twice in two days.**
`app/sitemap.ts` hand-dates every route (`lastModified` was `new Date()` at launch, which
stamped every URL with the build time; lines 7-17). The file's own comment records that on
2026-08-15 eight entries were older than the pages they described, and on 2026-08-16, one
commit later, sixteen of twenty-three were (lines 19-44). `tests/sitemap-freshness.test.ts`
(2026-08-16) reads one `git log --format=%cs --name-only` for the whole history, resolves
each sitemap route to its `page.tsx` (all seven case studies to the one template), and fails
if a sitemap date is older than that file's last commit — one-directional on purpose, since
stamping a route ahead of a change is legitimate (lines 36-40, 52-70, 106-124). It also
fails if it cannot read git at all, so a broken harness cannot pass by checking nothing
(lines 93-104). Booted copy: `/sitemap.xml` → 31 `<loc>`.

**3. Every published price is one module; the machine-readable files are generated from
it.** `lib/pricing.ts` holds the three tiers (`$1,500–$9,000 per day`; `From $10,000 · up
to $45,000`; `From $50,000`), the four add-ons, `PRICE_FLOOR = 1500` and the service area.
Since 2026-08-17 (`7748a92`, "Stop hand-writing the files only machines read")
`/pricing.md`, `/llms.txt` and `/llms-full.txt` are route handlers built from it by
`lib/agent-files.ts`, which also takes its route list from the sitemap so a redirected URL
cannot appear in them (lines 13-45; the motivating rot on 2026-08-16 is listed there). The
`Offer` nodes on seven routes are built from `TIERS` (`lib/schema.ts:36-49` via
`pricedService` on `/`, `/food-truck-catering`, both market pages, both cost guides, and the
inline `TIERS.map` on `/food-truck-rental`, `page.tsx:123-134`). The hero's "From $1,500 a
day" is `PRICE_FLOOR` (`any-street-hero.tsx:7, 218-220`), the rental page's service-area
row is `SERVICE_AREA.label` and its tier table maps `TIERS` (`page.tsx:190`,
`components/ui/pricing-table.tsx:39`). **What the module does NOT reach:** four routes
hard-code `minPrice` literals in their `Offer` (`experiential-marketing:202`,
`food-truck-marketing:117`, `food-truck-rental-for-parties:107`,
`food-trucks-for-weddings:214`), and page prose carries 138 literal price strings against
23 module-driven renders. The control for those is `tests/pricing.test.ts` "no page
advertises a superseded floor as our price" (lines 86-122): it scans every `.tsx` under
`app/` and `components/`, expands `$15K` shorthand, and fails on the two floors that were
corrected on 2026-07-28 (`c9d71de`: unbranded $4,500 → $1,500, branded $15,000 → $10,000),
allowing the wrap add-on's legitimate `$5,000–$15,000+` and the competitor quote in the
cost guide. Booted copy: `/pricing.md` prints `Generated from lib/pricing.ts at build time
by lib/agent-files.ts`; `/llms.txt` lines 56-58 carry the three tier prices.

**4. The Google Business Profile and the site resolve to one entity, and the phone number
is data, not copy.** `lib/gbp.ts` (2026-08-16) records the listing as read off the live
profile that day (`verifiedOn: '2026-08-16'`, the place ID, the CID, hours Mon–Sun 09:00–17:00,
the listing name "Food truck rentals" and its telephone), with the profile URL in the
place-ID form because the share-link form encodes a viewport centred on open ocean for a
hidden-address listing (lines 47-56). `lib/schema.ts` gives `Organization`,
`LocalBusiness` and `WebSite` stable `@id`s (`#organization`, `#localbusiness`,
`#website`), carries the listing's spelling as `alternateName`, links the profile in
`sameAs`, and puts the telephone in the JSON-LD only: `tests/gbp.test.ts` "keeps the
telephone out of everything a person can read" fails if the number appears in `app/` or
`components/` (`lib/gbp.ts:58-67`). No `address` on purpose: the listing hides its address
because it is a service-area business, and `tests/nyc-cannibalization.test.ts:237-255`
fails if a `streetAddress` or `PostalAddress` appears. Booted copy: `/` carries
`"telephone":"+1-516-205-7629"` six times inside `<script type="application/ld+json">` and
zero times in the visible body, on all 31 routes.

**5. Planning ranges, not borrowed specs.** `lib/specs.ts` (2026-08-15) is the answer to a
request to lift truck specifications from competitors: checked against published sources
that day, guests served per hour spread 40–150 and generator draw 3,000–25,000 W, so
"throughput and power are set by the MENU and the EQUIPMENT, not by the vehicle" (lines
4-24). The file publishes category ranges labelled as ranges with a standing caveat
(`PLANNING_CAVEAT`, line 106), while `TRUCK_SPECS` in `lib/pricing.ts:101-109` stays
`verified: false` until the owner supplies real numbers (`docs/TRUCK-SPEC-REQUEST.md` lists
what to ask for). `tests/specs.test.ts` fails if any throughput figure stops being a range
or any page publishes a dimension, weight or wattage as this fleet's own.

**6. The homepage was being deduplicated against its own parked-domain past.**
`next.config.ts:27-62` (2026-08-24, `170b0df`): `site:foodtruckrentals.com` returned 28 of
the site's pages and NOT the homepage; an exact-phrase search for the hero's triad returned
nothing; Google still held `http://foodtruckrentals.com/lander`, GoDaddy's parking path,
titled with the bare domain. The root's identity had been filed under `/lander` before the
site existed, and `/lander` chained to a 404. It is now a permanent redirect to `/`, with
`tests/legacy-parked-domain.test.ts` asserting it, that it does not chain, and that it is not
in the sitemap. The other half (a URL-inspection request and a removal request in Search
Console) cannot be done from the repo, and the comment says so. Booted copy: `/lander` →
308 `/`.

**7. IndexNow, scoped honestly.** `lib/indexnow.ts` (2026-08-17) reads the URL set from
the LIVE sitemap rather than importing `app/sitemap.ts`, so it can never announce a page
that is not deployed (lines 34-48); `public/afea90c9046f5f9df9647e244a2310a4.txt` is the
key file; `vercel.json` runs it weekly; `app/api/indexnow/route.ts` refuses without
`CRON_SECRET`. The header says what it buys: Google does not consume IndexNow; this reaches
Bing, and ChatGPT search and Copilot answer from Bing's index — so it is the supply line for
the agent-facing files, "NOT … Google rankings, which it cannot move" (lines 3-14).
`app/robots.ts` names nine AI crawlers and four bulk crawlers and allows all of them, as a
documented stance rather than an inherited default.

**8. Three photographs at once, and a roster that widens without reflowing.**
`components/any-street-hero.tsx` (rebuilt 2026-08-16, `bfeb878`): the hero had been a
130vh/210vh pinned section scrubbing three photographs past a sticky viewport — "two full
screens of scrolling before a visitor reached any content, and only ever one truck on
screen at a time" (lines 77-80). It is now one `100svh` screen with a 3x2 collage: Louis
Vuitton in the two-thirds panel because its 1800x1776 frame crops best there, not because
of the name (lines 30-38); only that panel is `priority` + `fetchPriority="high"`, the
other two eager but unpreloaded (lines 112-119); the copy sits on a scrim that stops at the
grid's own column seam (lines 137-150). The generated hero video that preceded it was
removed on 2026-07-29 (`579674e`, `public/genAI-video.mp4`, 789 KB → 0).
`tests/any-street-hero.test.tsx` asserts three photographs, no `<video>`, one preload, and no
multi-screen pin. The roster (`components/roster-index.tsx`, `app/globals.css:141-192`)
lists 17 clients from `lib/clients.ts`; the active name widens on Archivo's `wdth` axis from
100 to 112, and it is `white-space: nowrap` because measured widening on wrapping text
moved the wrap point ("Eleven Madison Park" went 2 → 3 lines and shoved the roster down
24 px mid-scroll; the safe ceiling on wrapping text was 100, i.e. none). The card only
exists from 1280 px; below it, tapping a row expands its photo strip inline. The
call-sheet card's photo cache is warmed with the exact `srcset` the card asks for, via
`getImageProps`, and only once a pointer reaches the roster on a viewport that has a card
— replacing 17 1-px images that fetched 1.56 MB at idle to warm nothing (lines 52-81).

**Supporting decisions worth knowing:**

- **The form is the one human-facing channel.** `components/inquiry.tsx`: name, company,
  email and the brief are required; budget, dates and market fold behind a toggle on phones;
  a honeypot field is silently accepted without delivery; the server action re-validates
  (`app/actions/inquiry.ts:34-39`). The delivery inbox and the public address are two
  constants, and `tests/contact-address.test.tsx` fails if the failure copy ever shows the
  delivery one. The reply promise is "within 48 hours", client-confirmed on 2026-07-29
  (`5aa61cc`), and `tests/rendered-copy.test.ts:21-55` fails on any rival wording.
- **A test reads the built HTML.** The same file's first case scans `.next/server/app/**/*.html`
  for a lowercase word fused onto a closing inline tag ("VIEWACTIVATION", "$4,000for") — a
  defect no DOM assertion sees (lines 5-19). It skips when no build exists.
- **Seven case studies from one template**, `lib/case-studies.ts` → `app/work/[slug]/page.tsx`,
  with the slug union typed so a page cannot reference a study that was never written
  (lines 1-16). Metrics are the client's own activation facts ("2,000+ meals a week",
  "100,000+ meals", "Full summer") rather than modelled numbers (lines 29-33).
- **Accessibility in the suite.** `tests/a11y.test.tsx` runs axe over the inquiry form, the
  logo strip, `/contact` and `/food-truck-rental-nyc`; one `h1` per page (confirmed on all
  31 booted routes); both breadcrumb navs named.
- **CSS inlined in production.** `next.config.ts:100-112`: the whole stylesheet is one
  ~10.6 KiB file and was the only render-blocking request (measured 150 ms blocking), so
  `experimental.inlineCss` ships it inside the document. Dev mode still emits a `<link>`;
  the booted copy shows one stylesheet link, as expected.
- **Image prep is a script with an order that matters.** `scripts/prep-images.mjs` maps 22
  raw phone files to kebab-case JPEGs at an 1800 px long edge, then auto-orients BEFORE
  stripping metadata, because stripping first shipped three photographs rotated
  (`neapolitan-frontline-1` 180°, `-2` 90°, `baby-brasa-2` 90°; lines 47-60; fixed
  2026-07-26, `f03da43`).

### Provenance of the photographs

`~/Desktop/truckrentalsmedia` holds 22 image files (HEIC, JPEG, PNG screenshots) and an
`foodtruckrentals.com-audit/` folder. The 22 filenames are exactly the keys of `MAP` in
`scripts/prep-images.mjs:13-36` ("the project-root photo folder"), so the folder is the
repo's own source photography, supplied by the client. `public/work` holds 26 processed
JPEGs (16 MB): the 22 plus four added later (`blank-street-1`, `organic-valley-1/2`,
`sartianos-truck`; `8b362e8`, `bfeb878`). No raw photograph is placed on our page: every
image on it is a capture of the site itself, and the roster/hero captures show the
processed photographs in situ.

---

## Gaps — in the repo, absent from the page

Real, checkable capability the shipped page said nothing about, or said imprecisely.

1. **The one-owner rule and the merge it took** (decision 1). The page said "one [test]
   that fails the build outright if two pages start competing" — true as a test, wrong as a
   build, and silent on the finding that the test was not enough.
2. **The git-derived sitemap freshness test** (decision 2). Two dated failures and the fix.
3. **What the pricing module actually reaches** (decision 3). The page overstated it.
4. **The GBP entity work and the phone-in-data-only rule** (decision 4).
5. **Planning ranges over borrowed specs** (decision 5). The most reader-legible refusal in
   the repo.
6. **The parked-domain redirect** (decision 6) and **IndexNow's honest scope** (decision 7).
7. **The hero rebuild and the roster's nowrap** (decision 8). The page described the hero
   as it was before 2026-08-16.
8. **The form's separation of delivery and public address, the 48-hour wording guard, the
   built-HTML test.** One sentence each.

Items 1–5 and 7 shape the rewritten page; 6 and 8 are a sentence each.

---

## Audience, objection, primary action

Per `.agents/product-marketing.md` §2, segment 1 — **a local service-business owner**. This
one wraps, staffs and permits food trucks for brands; the reader is someone like them whose
site either does not exist or does not rank, and who has been told "SEO" too many times.

**The objection this page has to answer:** *"Everyone says they do SEO. What did you
actually do, and how would I know?"* Every decision above is an answer with a file behind
it: a test that names the one page allowed to own a query and the day the test proved
insufficient; sitemap dates derived from git after two dated failures; a price module that
generates the machine-readable files and a test that scans every page for a superseded
floor; a Google listing wired into the schema by `@id` with the phone kept out of the copy;
a refusal to publish borrowed specs. The page argues *mechanism and dated measurement*,
never adjectives and never search volumes.

**Secondary objection**, per §2: *"is this their one good project?"* — answered by the real
stack, the 141 measured tests, and the dated artefacts.

**The primary action** is `/contact/` via `GeneralCta`. The CTA line names this reader's own
problem: pages that compete with each other for the same search.

**What the page must not do:** quote a price or timeline for OUR work; claim a headcount;
say "I"; restore the search-volume figures cut in Task 5; claim a ranking outcome
(Unverifiable 1); present the client's activation metrics as ours (Unverifiable 3); print
the telephone number or the delivery inbox.

---

## Verifiable numbers

Each with the command that proves it. Run from the scratch copy (`$SCRATCH/ftr`, which
carries `.git`) unless noted.

| Number | Command / location |
| --- | --- |
| **141** Vitest tests in **24** files, all passing, none skipped | `RESEND_API_KEY= INQUIRY_TO= INQUIRY_FROM= CRON_SECRET= CI=1 npx vitest run --no-file-parallelism` → `Test Files 24 passed (24)`, `Tests 141 passed (141)`, 10.3 s (with the 33 prebuilt HTML files copied into the scratch `.next/server/app` so `rendered-copy`'s three cases run rather than skip) — matches Task 4's frozen 141 |
| **24** static route files; **31** sitemap URLs (24 + 7 case studies) | `find app -name page.tsx \| grep -v '\[slug\]' \| wc -l` → 24; `curl /sitemap.xml \| grep -o '<loc>' \| wc -l` → 31; `PAGE_NOTES` in `lib/agent-files.ts:75-107` has 24 keys |
| **9** cluster phrasings, **1** owner route | `tests/nyc-cannibalization.test.ts:27-40` |
| **6** permanent redirects, **0** chains | `grep -c "source: '" next.config.ts` → 6; booted copy `/nyc`, `/newyork` → 308 `/food-truck-rental-nyc`; `/lander` → 308 `/`; `/ice-cream-truck-rental-nyc` → 308 `/ice-cream-truck-rental` |
| Position **#45** (`/nyc`) vs absent from the top **94**; four URLs at **#57, #69, #83, #92** — 2026-08-16 | `app/food-truck-rental-nyc/page.tsx:9-14`, `next.config.ts:66-72` — dated records in the source, not re-measured |
| **8** stale sitemap dates on 2026-08-15; **16 of 23** on 2026-08-16 | `app/sitemap.ts:19-44`; `tests/sitemap-freshness.test.ts:17-26` |
| **3** tiers, **4** add-ons, floor **$1,500**; floors corrected **2026-07-28** ($4,500 → $1,500; $15,000 → $10,000) | `lib/pricing.ts:28-90`; `tests/pricing.test.ts:72-90`; `git log -1 --format=%ad --date=short c9d71de` |
| **7** routes with Offer nodes from the module; **4** with literal `minPrice`; **138** literal price strings vs **23** module-driven renders in page code | `grep -ln "pricedService\|offersFromTiers\|TIERS.map" app/page.tsx app/*/page.tsx app/guides/*/page.tsx` → 7; `grep -rnE '\$(1,500\|10,000\|50,000\|9,000\|45,000)' app components \| grep -vE '^\S+:\s*(//\|\*)' \| wc -l` → 138; `grep -rnE 'PRICE_FLOOR\|\.price\b\|priceLow' app components \| grep -vE '^\S+:\s*(//\|\*)' \| wc -l` → 23 |
| **3** generated agent files; `/llms.txt` **71** lines, dated **2026-08-27** | `curl /pricing.md`, `/llms.txt`, `/llms-full.txt` on the booted copy; `lib/agent-files.ts:62-65` (the date is the newest sitemap lastmod) |
| JSON-LD on the booted copy: `LocalBusiness` on **31/31**, `BreadcrumbList` **30/31**, page-level `Service` **21/31**, `FAQPage` **20/31**, `Offer` **12/31**; **1** `h1` on every route; telephone visible on **0/31** | `$SCRATCH/ftr-count.py` over all 31 sitemap routes fetched from the booted copy |
| GBP verified **2026-08-16**; hours **Mon–Sun 09:00–17:00**; **3** `@id` nodes | `lib/gbp.ts:35-85`; `lib/schema.ts:6-8`; `curl /` → `#organization`, `#localbusiness`, `#website` |
| Category spreads **40–150** guests/hour, **3,000–25,000 W** | `lib/specs.ts:10-11` |
| **17** roster clients; **7** case studies; `wdth` **100 → 112**; card from **1280 px**; roster reflow **24 px** / **64 px** measured | `lib/clients.ts` (`grep -c "^  { name:"` → 17); `lib/case-studies.ts:6-14`; `app/globals.css:141-192`; `roster-index.tsx:40-50` |
| Hero: **3** photographs, **1** preloaded; old pin **130vh / 210vh**; retired video **789 KB** | `any-street-hero.tsx:39-71, 77-80, 112-119`; `git show --stat 579674e` |
| **22** raw files = **22** `MAP` entries; **26** processed JPEGs, **16 MB** | `find ~/Desktop/truckrentalsmedia -maxdepth 1 -type f \| wc -l`; `grep -c "': '" scripts/prep-images.mjs`; `ls public/work \| wc -l`; `du -sh public/work` |
| **9** AI crawlers + **4** bulk crawlers named in robots | `curl /robots.txt` on the booted copy |
| **141** commits, **2026-07-20 → 2026-08-27** | `git log --oneline \| wc -l`; `git log --reverse --format=%ad --date=short \| head -1`; `git log -1 --format=%ad --date=short` |
| Hero rebuilt **2026-08-16**; `/nyc` merge + freshness test **2026-08-16**; agent files generated **2026-08-17**; GBP **2026-08-16**; `/lander` **2026-08-24**; planning ranges **2026-08-15**; canonical host **2026-07-28**; image prep fix **2026-07-26** | `git log --format='%h %ad' --date=short -- <file>` (table in task-13-report.md §2) |

**Numbers deliberately NOT used on the page:** every search volume (320/mo, 12,100/mo,
3,600, 1,600, 6,600, 880 — present in source comments and in `tests/nyc-cannibalization.test.ts:11-16`,
`app/layout.tsx:56-57`, `app/sitemap.ts:69-81`, `next.config.ts:88-90`), per the Task 5
ruling; the CPCs and competitor keyword counts in `SEO-TRANSFER-PLAN-2026-08-17.md`; the
client's activation metrics; the commit count; the 138/23 literal-vs-module split (it is
here for the reviewer, and the page says "the module does not reach every page" instead).

---

## Unverifiable claims

For the user. **Not written on the page**, and no later task should promote one to a fact.

1. **Any ranking or traffic outcome.** The repo records SERP positions on 2026-08-16 and
   2026-08-24 as the reason for two changes, and `SEO-TRANSFER-PLAN-2026-08-17.md` §1 records
   "US ranked keywords: 4 (moved 2 → 4 since 2026-08-15)". No later measurement, Search
   Console export or analytics export is committed. The page states what was built and why,
   and makes no "now ranks" claim. (The old header lead, "indexed and structured to compete
   well past its first city", implied an outcome; replaced.)
2. **The search volumes** cut in Task 5. They are DataForSEO figures written into source
   comments (see "Numbers deliberately NOT used"). Sourced on this machine now, but the
   controller's ruling stands and the page argues without them.
3. **The client's activation metrics** ("2,000+ meals a week", "100,000+ meals", "Five
   trucks") in `lib/case-studies.ts`, described there as "taken from the client's own
   activations overview". Visible in the `/work` capture; not restated as ours.
4. **The roster `program` lines** ("Retail takeover · SoHo", "Holiday campaign · Give
   Happy"): `lib/clients.ts:5-8` says they are "descriptive labels derived from the verified
   photo content — NOT confirmed facts. Have the client verify wording before launch."
   Visible in the home capture's Trusted-by strip only as names; not restated.
5. **The 48-hour reply promise** is the client's commitment (`5aa61cc`), not ours; the page
   describes the guard that holds its wording, not the promise.
6. **Form conversions.** Resend holds the deliveries; nothing is in the repo.
7. **The prices** are the client's published guidance (`lib/pricing.ts:9`); the page cites
   them only as the numbers the module carries.

---

## Shot list

Three runner captures, one earlier capture kept on the page (the work index), one earlier capture kept in `public/` but not on this page (the home frame, which is the cover), one frozen cover left alone. Every entry
names the sentence in `content.ts` it is evidence for.

**How the source was booted.** From a scratch COPY (`rsync -a --exclude .next` into
`$SCRATCH/ftr`; the copy's `.env.local` deleted; the inferred Turbopack root printed as the
copy), never the repo itself — the repo carries a 269 MB pre-existing `.next`. Through
`scripts/guarded-dev.sh` (4 GB / 15 % free limits) with `RESEND_API_KEY= INQUIRY_TO=
INQUIRY_FROM= CRON_SECRET=` set empty: `npx next dev --port 3106`. **Two boots.** The first
was used for the served-HTML census of all 31 sitemap routes and reached a wrapper-recorded
peak of **3,886 MB** group RSS (Turbopack compiling 31 routes in one burst; `next-server`
alone 2,202 MB at my last `ps` sample); it was stopped at once under the addendum's ~2 GB
rule. The second boot served only the three capture routes and peaked at **1,815 MB**
(394 MB at first ready; 1,342 MB at second ready with the first boot's `.next/dev` cache).
Both figures are in task-13-report.md §3.

**What must be hidden.** `nextjs-portal` (Next's dev badge) on every shot. Nothing else:
the site is public and names its own business; its telephone is JSON-LD-only and never
rendered, so no frame can show it.

| `out` | Route | Evidence for |
| --- | --- | --- |
| `foodtruckrentals-nyc.jpg` (1600x1000, new) | `/food-truck-rental-nyc` (loaded at `#:~:text=Parked%20here%20already.`, see below) | "One query, one owner." — the breadcrumb `Food truck rental NYC`, the H1 `Food truck rental in New York City, priced up front.`, the price-led subtitle, and the top of the facts ledger ($1,500 / day; From $10,000) |
| `foodtruckrentals-rental.jpg` (1600x1000, new) | `/food-truck-rental` | "Every price comes from one file." — the H1 `Food truck rental, handled end to end.`, the hero's `$1,500 a day` (`PRICE_FLOOR`), and the facts ledger whose `Service area` row is `SERVICE_AREA.label` verbatim (`NYC + Long Island, New Jersey & Connecticut`) |
| `foodtruckrentals-contact.jpg` (1600x1000, new) | `/contact` | "The same suite holds the contact page's reply promise to one wording, within 48 hours" and "The listing's telephone number is in the JSON-LD and nowhere a person can read it" — the H1 `Start an activation.`, the ledger's `Quote turnaround · Within 48 hours`, and no telephone anywhere in the frame |
| `foodtruckrentals-home.jpg` (1600x1000, kept, 2026-09-04) | `/` | "Three trucks at once." — the 3x2 collage (Louis Vuitton large, Sartiano's and Blank Street stacked), the H1 `Branded food truck rentals`, `From $1,500 a day`, the Trusted-by strip. It IS the hero at HEAD (the collage shipped 2026-08-16) and the same frame as the frozen cover, so it is NOT placed on this page (Task 8's duplicate-cover trap); it stays in `public/` for the two service pages that use it with alt "The Food Truck Rentals home page" |
| `foodtruckrentals-work.jpg` (1600x1000, kept, 2026-09-04) | `/work` | "All seven render from one template and one data file" — `The work.`, the Louis Vuitton spread with its client · borough · year tag and its two metrics. Captured before the 2026-08-27 em-dash sweep (the brief still shows one dash); the shared alt is unaffected |
| `foodtruckrentals.jpg` (frozen cover, 1200x750) | NOT re-captured | Shared by `/`, `/work/`, `/process/` and all four service pages with alt "The Food Truck Rentals home page". The header renders it under the title. |

**The NYC capture needed a text fragment.** The page is 11,578 px tall with two
`loading="lazy"` case-spread images at y≈6,833 and 7,388. The runner sets
`reducedMotion: "reduce"`, under which the site switches `scroll-behavior` to `auto`
(`app/globals.css:66-67`), so the runner's instant bottom-then-top jump never brings the
first image inside Chromium's lazy-load distance and the every-`<img>` gate times out
(probed: 1 incomplete at 0/5/10/15/20 s; `scrollIntoView` loads it in < 3 s; a run without
reduced motion loads it because smooth scrolling passes through). Loading the route at
Chromium's scroll-to-text fragment for the heading "Parked here already." (y≈6,188) makes the
browser's own anchor scroll fetch both images before the runner scrolls back to 0; the
captured frame is the top of the page, identical to a fragment-less capture, and the
fragment's highlight is off-screen. Config-only; the runner is unchanged.

**Not captured, and why.** The roster — it is the second section of `/`, and the runner
scrolls to the top before every shot; no anchor exists on it. `/pricing.md` — served as
`text/markdown`, which a browser downloads rather than renders; its generated header line is
quoted in the dossier from `curl` instead. The mobile sticky CTA — only below `md`. The
raw client photographs — real, but a capture of the site shows them in situ and proves more.

---

## Cross-page deltas

Two claims on other pages are contradicted or overstated by the code (findings 1 and 2 in
task-13-report.md §0), and one describes the hero as it was before 2026-08-16. Each entry is a
`{file, anchor, replacement, reason}`; anchors are exact current strings, each verified to
occur exactly once in its file by `grep -cF` (table at the end). **None applied by this
task.**

1. `{file: "src/components/site/services/web-development/content.ts", line: 113, anchor: "Every commercial page on that site carries JSON-LD Service, FAQ and LocalBusiness data generated from a single pricing module, so a published price can never drift away from the page it sits on. Keyword research shapes the URL structure, and 141 Vitest tests guard it, including one that fails the build outright if two pages start competing for the same keyword cluster.", replacement: "Every published price on that site lives in one module: the machine-readable price sheet and both llms files are generated from it, seven pages build their JSON-LD offers from it, and one of the site's 141 Vitest tests fails the run if a superseded price reappears in any page's copy. Another names the one page allowed to own the New York rental query and fails if a second page claims it.", reason: "the module reaches seven of 24 routes' Offer nodes, not every commercial page (four hard-code minPrice; 138 literal price strings in prose); nothing wires the tests to the build (no CI, build = next build)"}`
2. `{file: "src/components/site/services/web-development/content.ts", line: 153, anchor: "Food Truck Rentals runs twenty-four pages of Next.js 16 and React 19, from the full-bleed activation hero down to the truck roster that animates along a variable-width axis.", replacement: "Food Truck Rentals runs twenty-four pages of Next.js 16 and React 19, from a hero that shows three wrapped trucks at once down to a client roster whose active name widens on the typeface's width axis without reflowing a single row.", reason: "the hero has been a one-screen three-photograph collage since 2026-08-16 (any-street-hero.tsx:77-80); 'full-bleed activation hero' described the retired pinned scroll section"}`
3. `{file: "src/components/site/services/web-development/content.ts", line: 196, anchor: "JSON-LD Service, FAQ and LocalBusiness data generated from a single pricing module, so a published price can never drift away from the page it sits on. 141 Vitest tests guard the structure.", replacement: "Published prices live in one module that generates the price sheet, both llms files and the JSON-LD offers on seven pages; 141 Vitest tests guard the structure, one of them scanning every page for a superseded price.", reason: "same overstatement as delta 1"}`
4. `{file: "src/components/site/services/web-development/content.ts", line: 239, anchor: "Twenty-four pages for Food Truck Rentals, indexed and structured to compete well past its first city.", replacement: "Twenty-four pages for Food Truck Rentals, with one owner per search query and a test that keeps it that way.", reason: "'indexed and structured to compete' implies a ranking outcome the repo does not record (Unverifiable 1); mirrors the rewritten header lead"}`
5. `{file: "src/components/site/services/data-intelligence/content.ts", line: 232, anchor: "On Food Truck Rentals, JSON-LD Service, FAQ and LocalBusiness data generated from a single pricing module, so a published price can never drift away from the page it sits on.", replacement: "On Food Truck Rentals, one pricing module generates the machine-readable price sheet, both llms files and the JSON-LD offers on seven pages, and a test fails the run if a superseded price reappears in any page's copy.", reason: "same overstatement as delta 1"}`
6. `{file: "src/components/site/services/applied-ai-strategy/content.ts", line: 243, anchor: "The fix was 24 pages, keyword research shaping the URL structure, and 141 tests holding it in place.", replacement: "The fix was 24 pages, one owner per search query, and 141 tests holding it in place.", reason: "optional; 'keyword research shaping the URL structure' is true (docs/KEYWORD-RESEARCH.md, DataForSEO) but the checkable noun is the owner rule; apply or leave"}`
7. `{file: "src/components/site/services/applied-ai-evaluation/content.ts", line: 112, anchor: "The food-truck site carries 141 Vitest tests guarding its URL structure, including one that fails the build outright if two pages start competing for the same keyword cluster. Its JSON-LD Service, FAQ, and LocalBusiness data is generated from a single pricing module, so a published price can never drift away from the page it sits on.", replacement: "The food-truck site carries 141 Vitest tests guarding its URL structure, including one that fails the run if a second page claims the New York rental query the owner page holds. Its published prices live in one module that generates the price sheet, both llms files and the JSON-LD offers on seven pages, with another test scanning every page for a superseded price.", reason: "findings 1 and 2"}`
8. `{file: "src/components/site/services/applied-ai-evaluation/content.ts", line: 171, anchor: "The food-truck site carries 141 Vitest tests, one of which fails the build outright when two pages start competing for the same keyword cluster.", replacement: "The food-truck site carries 141 Vitest tests, one of which fails the run when a second page claims the search query the owner page holds.", reason: "finding 2"}`
9. `{file: "src/components/site/services/applied-ai-evaluation/content.ts", line: 231, anchor: "On the food-truck site, 141 Vitest tests guard the URL structure, including one that fails the build outright if two pages start competing for the same keyword cluster.", replacement: "On the food-truck site, 141 Vitest tests guard the URL structure, including one that fails the run if a second page claims the search query the owner page holds.", reason: "finding 2"}`
10. `{file: "public/llms.txt", line: 28, anchor: "A 24-page Next.js site for a New York brand-activation company. JSON-LD Service, FAQ and LocalBusiness data generated from one pricing module; 141 Vitest tests, one of which fails the build if two pages compete for the same keyword cluster.", replacement: "A 24-page Next.js site for a New York brand-activation company: one pricing module generating the price sheet, both llms files and the JSON-LD offers on seven pages; 141 Vitest tests, one of which fails the run if a second page claims the search query the owner page holds.", reason: "findings 1 and 2; llms.txt is orchestrator-owned"}`
11. `{file: ".agents/product-marketing.md", line: 166, anchor: "- Food Truck Rentals: 141 Vitest tests, JSON-LD generated from a single", replacement: "- Food Truck Rentals: 141 Vitest tests, a price module that generates the", reason: "the proof-point bullet spans lines 166-168 ('pricing module (so a published price can never drift from the page it sits on), a national, technical-SEO-driven Next.js build.'); the anchor is its first line only, so the controller can rewrite the three-line bullet as: '- Food Truck Rentals: 141 Vitest tests, a price module that generates the machine-readable price sheet and the JSON-LD offers on seven pages (with a test that fails on any superseded price in page copy), one owner page per search query, a Next.js 16 build.' — also drop 'national': lib/pricing.ts:92 and tests/pricing.test.ts:150-163 say NYC metro only and fail on LA/Houston/Vegas"}`

Three comment-only echoes exist in `applied-ai-evaluation/content.ts:9` and `:295` (doc
comments, "fails the build") and `data-intelligence/content.ts:8`; no anchor, nothing
rendered.

**Notes for the user (no anchor, nothing to apply):**

- **"National" is wrong for this site.** The old header lead and `.agents/product-marketing.md`
  call it "a live national site" / "national, technical-SEO-driven". `lib/pricing.ts:92-99`
  (`SERVICE_AREA`, "Markets we actually service. Do NOT add a market without confirming
  coverage") is NYC plus Long Island, New Jersey and Connecticut, and
  `tests/pricing.test.ts:150-163` fails if a machine-readable file claims Los Angeles,
  Houston, Las Vegas, Chicago or San Francisco. The site targets the head term nationally
  in its titles (`app/layout.tsx:48-61`) while serving one metro. Our page now says
  "New York and the tri-state area".
- **`geist` is a declared, unused dependency** in the client's repo; harmless.
- **The `.git` of the source has a 2026-09-11 12:56 mtime** on its directory entry (a
  `git status` from an earlier task or the user); no tracked file changed, `status --short`
  empty before and after.

### Anchor uniqueness (so the controller can apply by exact replacement)

Checked at `3231d68` on 2026-09-11 with `grep -cF -- "<anchor>" <file>` and `grep -nF` for the
line:

| Delta | File | Line | Check | Occurrences | At cited line |
| --- | --- | --- | --- | --- | --- |
| 1 | `services/web-development/content.ts` | 113 | single-line `grep -cF` | 1 | yes |
| 2 | `services/web-development/content.ts` | 153 | single-line `grep -cF` | 1 | yes |
| 3 | `services/web-development/content.ts` | 196 | single-line `grep -cF` | 1 | yes |
| 4 | `services/web-development/content.ts` | 239 | single-line `grep -cF` | 1 | yes |
| 5 | `services/data-intelligence/content.ts` | 232 | single-line `grep -cF` | 1 | yes |
| 6 | `services/applied-ai-strategy/content.ts` | 243 | single-line `grep -cF` | 1 | yes |
| 7 | `services/applied-ai-evaluation/content.ts` | 112 | single-line `grep -cF` | 1 | yes |
| 8 | `services/applied-ai-evaluation/content.ts` | 171 | single-line `grep -cF` | 1 | yes |
| 9 | `services/applied-ai-evaluation/content.ts` | 231 | single-line `grep -cF` | 1 | yes |
| 10 | `public/llms.txt` | 28 | single-line `grep -cF` | 1 | yes |
| 11 | `.agents/product-marketing.md` | 166 | single-line `grep -cF` | 1 | yes |

All are single-line anchors. Re-run the same check before applying if any file has moved on.
