# New York Mobile Mechanic — case-study dossier

Source of record: `~/Projects/Adam's Mobile Mechanic` (the literal path, apostrophe and
spaces; `~/Projects/Adam's%20Mobile%20Mechanic` is a separate directory that was not opened)
plus `~/Desktop/NYMM Results` (three dated screenshots). Read-only for this work. Nothing in
this file was taken from memory; every line names the file or command it came from. HEAD at
the time of reading: `5701b92` (2026-08-31), branch `master`, 251 commits since 2026-06-19.

The page it backs: `/work/new-york-mobile-mechanic/` —
`src/components/site/work/new-york-mobile-mechanic/content.ts` and
`src/app/work/new-york-mobile-mechanic/page.tsx`.

**Credentials.** The repo's gitignored `.env.local` holds `GOOGLE_PLACES_API_KEY`,
`FEATURABLE_WIDGET_ID` and `FORMSPREE_ENDPOINT` (names from `.env.example`; values never read).
All three, plus `FEATURABLE_API_KEY`, are overridden to the empty string on every command line
in this task. The app is written to fail soft without them (see Architecture decision 3), so
nothing here needed a real key.

---

## Stack (verified)

Read from `package.json` on 2026-09-11. Versions are the declared ranges, not lockfile pins.

| Package | Declared | What it does here |
| --- | --- | --- |
| `next` | 16.2.9 (pinned) | App Router; every content route is statically generated (`dynamicParams = false` on both dynamic matrices) |
| `react`, `react-dom` | 19.2.4 (pinned) | |
| `typescript` | ^5 | strict, `@/` alias to the repo root (`tsconfig.json`) |
| `tailwindcss`, `@tailwindcss/postcss` | ^4 | the whole visual layer; `experimental.inlineCss` inlines it into `<head>` (`next.config.ts`) |
| `gsap`, `@gsap/react` | ^3.15, ^2.1 | ONE use: the hero's headline/CTA/stats entrance, dynamically imported so it stays out of the LCP bundle (`components/hero/HeroVideo.tsx:92-107`) |
| `zod` | ^4.4 | the site-config schema (`content/site.schema.ts`) and the contact-form schema (`lib/contact-schema.ts`); imported by tests and the API route only, never by the client bundle |
| `react-hook-form`, `@hookform/resolvers` | ^7.80, ^5.4 | the contact form |
| `next-mdx-remote`, `gray-matter`, `remark-gfm` | ^6, ^4, ^4 | the four `/resources` posts |
| `lucide-react` | ^1.21 | icons (a four-entry allow-list on the dials, `GaugeCounter.tsx:18-23`) |
| `clsx`, `tailwind-merge` | | `cn()` |
| `@vercel/analytics`, `@vercel/speed-insights` | ^2 | |

Dev: `vitest` ^4.1 (resolved 4.1.9) with `jsdom`, Testing Library and `@vitejs/plugin-react`;
`playwright` ^1.61 (the repo's own `scripts/screenshot.mjs`); `eslint` ^9 with
`eslint-config-next`; `tsx` for the asset and Place-ID scripts.

**Not in the stack:** `framer-motion`. It is in neither manifest nor lockfile nor source
(`grep -rn framer app components lib package.json package-lock.json` → nothing). The page
used to name it twice.

**Deployment** — Vercel (`.vercel/project.json` exists; `vercel.json` schedules
`/api/indexnow` every Monday 09:00). Canonical host `https://www.newyorkmobilemechanic.com`
(`site.config.ts` `seo.siteUrl`; the apex 301s to www, per the comment beside it).
Formspree delivers contact-form leads; Featurable (primary) and the Google Places API (New)
(fallback) supply the live rating and review feed, both server-side.

---

## Architecture decisions

Six that a reader can check rather than an adjective. File references are to the source repo.

**1. Two content matrices, both closed.** `lib/service-area-combos.ts` crosses nine service
slugs with five borough slugs — `COMBO_SERVICE_SLUGS` (9) × `COMBO_AREA_SLUGS` (5) = 45
`/service-areas/[area]/[service]` pages — and `lib/service-topics.ts` hangs 30
`/services/[slug]/[topic]` pages under the eleven services. Both routes export
`dynamicParams = false` (`app/service-areas/[area]/[service]/page.tsx:24`,
`app/services/[slug]/[topic]/page.tsx:22`), so a pair that is not in the list 404s rather
than rendering a thin page; `test/combo-page.test.tsx` "generates exactly the matrix params"
and "404s for an off-matrix pair" pin it. Every combo page is composed, not templated: a
per-service `comboAngle` and `nearMeIntro` are crossed with a per-borough paragraph
(`comboBoroughLocal`) that is deliberately NOT the borough landing page's own `local` text,
"so a combo never duplicates its parent" (`service-area-combos.ts:120-128`). The file's own
header records the risk it took: 17 area pages + 45 combos = 62 location pages, "past Google's
~50-page doorway caution line", justified by per-cell uniqueness and to be pruned from GSC
data if held back (`service-area-combos.ts:14-19`).

**2. The deep pages went under the services because the blog earned nothing.** The header of
`lib/service-topics.ts:5-12` records the measurement that decided it (GSC, 90 days to
2026-08-17): `/resources/*` — 4 posts, 31 impressions, 0 clicks; `/services/*` — 11 pages,
1,918 impressions, 10 clicks, positions 24.8–57.8. The service pages were being surfaced on
pages 3–6 at ~560 words, "too thin to convert an impression into a click." So each topic page
takes one sub-intent (`car-wont-start`, `battery-light-on`, `pedal-goes-to-floor`, …), answers
it with sections, a decision table and FAQs, and links back up; they are kept OUT of
`siteConfig.services` so the nav and grid stay at eleven. A pricing rule is written into the
same header: only figures already in `site.config.ts` may appear, and the starter-alternator
parent's "Starts at $150" prices the starter only, so no topic page may state an alternator
labour rate. (These GSC figures are a dated record in the source, not something this task
could re-measure — see Unverifiable claims 5.)

**3. Every live number has a fallback, and the fallback is the real data.**
`lib/google-reviews.ts` fetches Featurable first (full feed + live aggregate, past the Places
API's 5-review cap), Places second, and "never throws — returns null/[] on any failure so the
site renders its curated fallback" (`:1-5`). The curated set is the eight real reviews in
`site.config.ts` `reviews` (the first five are the live Places set, synced verbatim on
2026-06-24). `lib/rating.ts` `resolveRating` is the single place the fallback average is
computed. The hero's review chip, the Google Reviews dial (`stats[2].source =
"googleReviewCount"`), the `/reviews` aggregate and the JSON-LD `AggregateRating` all read the
same resolved value, so three surfaces can never show three numbers (`HeroVideo.tsx:27-33`).
Both fetches carry `next: { revalidate: 86400 }`.

**4. The copy is guarded by a blacklist test.** "An outside review flagged the site copy as
reading AI-generated" (`test/copy-tells.test.ts:8-11`). The 2026-07-02 rewrite
(`docs/superpowers/specs/2026-07-02-de-ai-copy-rewrite-design.md`; commit `de-AI ify`) pinned
eight patterns — `no guesswork`, `plain English`, `no surprises`, `peace of mind`, `back up and
running`, `fade-free`, `rattle-free`, and the em dash — and the test walks every service
blurb, description, detail, FAQ and include, every process step, every borough paragraph,
every topic page section and table cell, and the raw MDX of every resource post. Customer
reviews are excluded as verbatim text. The test's own comment records why the MDX was added
later: the posts were scoped out of the rewrite, "nothing scanned them for the next six weeks,
which is how two 'no surprises' lines sat live until 2026-08-17."

**5. Config is data, validated once, and never ships the validator.** `content/site.config.ts`
is a single typed object (brand, business NAP, hours, 17 areas, nav, 4 stats, 11 services with
FAQs and price labels, 4 process steps, 6 site FAQs, 12 gallery items, 8 reviews, SEO, media).
Its zod schema lives in `content/site.schema.ts` and is imported only by
`test/site-config.test.ts`, so zod never enters the client bundle (`site.config.ts:1-8`).
`app/sitemap.ts`, `app/llms.txt/route.ts` and `app/llms-full.txt/route.ts` are generated from
the same object, "so it never drifts out of sync." The business is a service-area business,
so no street address or postal code exists anywhere in config, UI or structured data — only
city/region plus `areaServed` (`site.schema.ts:66-71`).

**6. Performance decisions that are on-screen in the Lighthouse report.** `inlineCss: true`
in `next.config.ts` removes the render-blocking stylesheet request (the comment marks it
LOAD-BEARING and experimental, with the check to re-run on upgrade). The hero's poster is the
eager LCP element and the 755 KB loop only loads once the hero is on screen, never for
reduced-motion visitors (`HeroVideo.tsx:4-10, 44-60`). The reviews and gallery sections are
`next/dynamic` with `ssr: false` so their markup stays out of the initial HTML
(`app/page.tsx:7-9`). The dials repaint through refs, not React state, so eight dials on the
home route never re-render (`GaugeCounter.tsx:114-118`). Six response headers on every route,
including a CSP with `frame-ancestors 'none'` (`next.config.ts` `headers()`).

**Supporting decisions worth knowing:**

- **Motion is a tachometer, not a bar filling.** The dial's rev curve is nine keyframes —
  a stab off idle, two progressively higher blips, then the pull to redline — over a 2,400 ms
  sweep, with `easeOutCubic` on rises and `easeInOut` on releases (`GaugeCounter.tsx:36-83,
  175`). Reduced-motion visitors get the settled number.
- **Book and Call are one tap away on every page.** A mobile-only fixed bottom bar with `Call`
  (`tel:`) and `Text Now` (`sms:`) is hidden by an `IntersectionObserver` while the hero (which
  has its own call button) is on screen, and suppressed on `/contact`, where the same actions
  already live (`components/layout/Nav.tsx:32-44, 438-483`).
- **The contact API defends itself three ways:** a hidden honeypot field that returns `ok:
  true` without sending, a zod parse of the body, and a per-IP fixed-window limit of 5
  requests per 10 minutes (`app/api/contact/route.ts`, `lib/rate-limit.ts:35-38`). Without a
  Formspree endpoint the lead is logged and the form still reports success; with one, a
  Formspree failure is surfaced as "Could not send your request. Please call us." rather than
  a false success.
- **Indexing is pushed, not waited for.** `/api/indexnow` reads the live sitemap and submits
  every URL to the IndexNow endpoint on a weekly Vercel cron (`lib/indexnow.ts`,
  `vercel.json`); `scripts/google-index-submit.mjs` does the same for Google's Indexing API
  from a gitignored service-account key.
- **A snapshot guard on metadata.** `test/metadata-snapshot.test.ts` asserts a non-empty
  title, description and self-canonical on every page that exports metadata, static or
  dynamic, "against a reskin that ships with empty SEO tags."

---

## Gaps — in the repo, absent from the page

Real, checkable capability the shipped page said nothing about.

1. **The 30 topic pages and the GSC measurement behind them** (decision 2). The page
   described the borough matrix only.
2. **The copy-tells test** (decision 4). The most distinctive engineering decision in the repo
   and the one a local-business reader will recognise.
3. **The fail-soft review pipeline** (decision 3). The page said "live Google reviews"; the
   repo's point is that every number on the site has one live source and one real fallback.
4. **`llms.txt` and `llms-full.txt`**, generated from config with every topic page and its
   price chip listed "so an LLM answering 'what does an alternator replacement cost in NYC'
   can reach the page that actually answers it" (`app/llms.txt/route.ts:33-39`).
5. **The contact API's honeypot and rate limit**, and IndexNow. Operator detail; recorded
   here, left off the page.
6. **The dial mechanism** — the page said "Framer Motion"; the repo has a hand-built SVG
   instrument with a nine-keyframe rev curve.
7. **Price labels in config** — `Starts at $70` (general maintenance, oil change), `$95`
   (brakes, diagnostics, pre-purchase, battery), `$150` (starter), `$130` (tune-up), `Quote
   only` (suspension, flat tire, roadside); each topic page carries its own chip and a note
   scoping what the price covers. Left off this page: prices are the client's, not ours to
   restate.

Items 1–3 and 6 shape the rewritten page. 4 is one sentence. 5 and 7 stay here.

---

## Audience, objection, primary action

Per `.agents/product-marketing.md` §2, segment 1 — **a local service-business owner**, not a
software buyer. The one who currently has "a site that a friend's cousin built", or a
GoHighLevel funnel an agency spun up without asking (the repo's `FULL-AUDIT-REPORT.md` records
exactly that competing domain for this client).

**The objection this page has to answer:** *"A site is a site. Why would yours bring me a
single extra phone call?"* Everything checkable in the repo is an answer to that: 117 URLs
where a template would have 8, every one composed from config and closed to thin variants;
copy guarded by a test against sounding machine-written; Lighthouse at 100 across the board;
every trust number live with a real fallback; the phone one tap away on every page. The page
should argue *mechanism and measurement*, not "modern" or "fast".

**Secondary objection**, per §2: *"is this their one good project?"* — answered by the real
stack, 157 tests and the dated artefacts.

**The primary action** is `/contact/` via `GeneralCta`. The CTA line names this reader's own
problem (a site that does not bring the phone calls the business needs).

**What the page must not do:** quote a price or timeline for OUR work, claim a headcount, say
"I", or attribute the ChatGPT placements to the site alone (see Unverifiable 3).

---

## Verifiable numbers

Each with the command that proves it. Run from `~/Projects/Adam's Mobile Mechanic` unless
noted; the four credential names are set empty on every command that boots or tests.

| Number | Command / location |
| --- | --- |
| **157** Vitest tests, **29** files, 0 skipped | `CI=1 npx vitest run --no-file-parallelism` → `Test Files 29 passed (29) / Tests 157 passed (157)`, 2026-09-11 |
| **11** services | `grep -c '^      slug: "' content/site.config.ts` → 11 |
| **9 × 5 = 45** service-by-borough pages | `COMBO_SERVICE_SLUGS` (9), `COMBO_AREA_SLUGS` (5), `lib/service-area-combos.ts:21-39`; `test/combo-page.test.tsx` "generates exactly the matrix params" |
| **30** topic pages | `grep -c '^    topic: "' lib/service-topics.ts` → 30 |
| **17** service areas, all 17 with hand-written local copy | `serviceAreas.areas` in `site.config.ts` (17 entries); `grep -cE '^  ("[a-z-]+"\|[a-z]+): \{$' lib/area-content.ts` → 17 |
| **4** resource posts | `ls content/resources/*.mdx \| wc -l` → 4 |
| **117** sitemap URLs | 10 static + 11 services + 30 topics + 17 areas + 4 resources + 45 combos (`app/sitemap.ts`); confirmed by counting `<loc>` in the booted server's `/sitemap.xml` (see task-11-report.md §3) |
| **12 of 15** route files emit JSON-LD | `for f in $(find app -name page.tsx); do grep -c JsonLd $f; done` — zero on `gallery`, `privacy`, `terms` |
| **13** JSON-LD builders | `grep -c '^export function' lib/jsonld.ts` → 13 (AutoRepair, Service, ItemList, BreadcrumbList, BlogPosting, WebSite, VideoObject, FAQPage ×2, Person, ContactPage, areaServed, Review items) |
| **8** blacklisted copy patterns | `BLACKLIST` in `test/copy-tells.test.ts:13-22` |
| **5** requests per **10** minutes, per IP | `lib/rate-limit.ts:35-38` defaults |
| **6** response headers on every route | `grep -c "key:" next.config.ts` → 6 (HSTS, nosniff, X-Frame-Options, Referrer-Policy, Permissions-Policy, CSP) |
| **2,400 ms**, **9** keyframes | `DURATION` `GaugeCounter.tsx:175`; `REV_KEYS` `:44-54` |
| **4** dials: Years in Business 5+, Cars Serviced 1000+, Google Reviews (live; fallback 144+), Avg Text Reply < 5 min | `stats` in `site.config.ts:136-145` |
| **8** curated reviews (5 from the Places API, 3 from the old testimonial page, 2026-06-24) | `reviews` in `site.config.ts:836-886` |
| **12** gallery items, **4** of them video | `gallery` in `site.config.ts` |
| **755 KB** hero loop (1280x700), **14 KB** AVIF poster | `ls -la public/media/hero-loop-1280x700.mp4 public/media/hero-poster.avif` |
| **86,400 s** revalidation on both review fetches | `lib/google-reviews.ts` `next: { revalidate: 86400 }` |
| **251** commits, **2026-06-19 → 2026-08-31** | `git log --oneline \| wc -l`; `git log --reverse --format=%ad --date=short \| head -1`; `git log -1 --format=%ad` |
| Combo matrix landed **2026-07-10**; topic pages **2026-08-17**; copy test **2026-07-02**; reviews client **2026-06-23** | `git log --format='%ad %s' --date=short -- <file> \| tail -1` |
| Lighthouse **100 / 100 / 100 / 100**, Agentic Browsing **3/3** | `~/Desktop/NYMM Results/Screenshot 2026-07-09 at 2.35.19 PM.png` (2556x1344); the source of the frozen `mechanicseo.png` |
| ChatGPT, "whats the top 5 mobile mechanics in New York city": **#1**, 4.9/5, 133 reviews | `~/Desktop/NYMM Results/Screenshot 2026-07-28 at 3.54.30 PM.png` (2150x1554) |
| ChatGPT, "best mobile mechanic in queens?": **#1** | `~/Desktop/NYMM Results/Screenshot 2026-08-07 at 5.17.18 PM.png` (2180x1600) |

**Numbers deliberately NOT used on the page:** 13 builders, 12/15 route files, 6 headers,
86,400 s, 251 commits, gallery counts, the price labels. True, and they measure the wrong
thing for this reader.

---

## Unverifiable claims

For the user. **Not written on the page**, and no later task should promote one to a fact.

1. **"Core Web Vitals in the green."** Field CWV is not in the repo. `FULL-AUDIT-REPORT.md`
   (2026-07-01) scores Performance 85 "carried from prior optimized state — live PageSpeed
   call was rate-limited", and `ACTION-PLAN.md` item 4 is "Confirm CWV with fresh field data."
   The Lighthouse lab report of 2026-07-09 is what exists. The page now says "Lighthouse";
   the CWV phrase survives in `PROJECT_DESCRIPTION`'s echoes on other pages — filed as deltas.
2. **Ranking on Google.** The same audit records the site "NOT in the top-30 organic and NOT
   in the local 3-pack" on 2026-07-01, and the 2026-08-17 GSC note has the service pages at
   positions 24.8–57.8. Nothing in the repo shows a later organic position. The page makes no
   Google-ranking claim.
3. **That the site caused the ChatGPT placements.** The two screenshots are real and dated,
   and are printed as what they are: the answer ChatGPT gave on that day. ChatGPT's map cards
   draw on the Google Business Profile (its 4.9 rating and review count are the GBP's), and
   the second answer cites Reddit. The site's `llms.txt`, schema and 117 pages are the parts
   of that outcome we can show; the causal share is not measurable. The copy says "listed
   first", never "because of the site".
4. **"1000+ cars serviced", "5+ years", "< 5 min avg text reply".** The client's own figures
   in config; the site prints them and so does the cover. Not restated as our claims.
5. **The GSC figures in `service-topics.ts:5-12`** (31 impressions / 0 clicks; 1,918 / 10).
   A dated record written by the developer into the source, not re-measurable from the repo.
   Used on the page as the reason the topic pages exist, attributed to Search Console and the
   date.
6. **Time or money the client saved, calls or bookings the site produced.** No analytics
   export exists in the repo (`analytics.googleAnalyticsId` is configured; no data is
   committed). Not written.
7. **Ismaeel Weish's Google review** ("I used NeuraGul Labs for my local mechanic business …
   My business the same week got an increase in calls", August 2026) is quoted in
   `PROJECT_VOICE`. It was first kept off this page because the config names the owner as
   Adam and carries no "786 Motosport"; **the user confirmed on 2026-09-13**: "ismaeel is the
   mechanic". The causal caveat in 3 still stands — the review is his experience, printed as
   such, not a measurement.
8. **"Certified Technician", "Licensed & Insured".** The config comment says "verify each with
   Adam before launch" (`site.config.ts:107-108`). Not repeated on our page.

---

## Shot list

Two runner captures, three images made from the user's own screenshots, one frozen cover
left alone, two frozen off-pattern assets left alone. Every entry names the sentence in
`content.ts` it is evidence for.

**How the source was booted.** From a scratch COPY (`rsync -a --exclude .next` into
`$SCRATCH/nymm`; the inferred Turbopack root printed as the copy), never the repo itself —
the repo's own `.next/dev` holds a stale cache that 500s `/` and pushed a first boot past the
4 GB watchdog, and `next dev` rewrites the tracked `next-env.d.ts`. Through
`scripts/guarded-dev.sh` (4 GB / 15 % free / 1 h limits; peak group RSS 2,397 MB) with the
four credential names set empty, so no Places, Featurable or Formspree call
can be made: `GOOGLE_PLACES_API_KEY= FEATURABLE_WIDGET_ID= FEATURABLE_API_KEY=
FORMSPREE_ENDPOINT= npx next dev --port 3101`. The inferred Turbopack root was printed first
and is the repo itself. Consequence: any dial or badge that reads the live review count shows
the config fallback (`144+`, or `5.0 / 8` on `/reviews`), which is why neither the home hero
nor `/reviews` is captured here — the frozen cover and `conversion.png` already show the live
values from the production site.

**What must be hidden.** `nextjs-portal` (Next's dev badge, bottom-left) on every runner
shot. Nothing else: the site is public and names its own business.

| `out` | Route / source | Evidence for |
| --- | --- | --- |
| `new-york-mobile-mechanic-combo.jpg` (1600x1000, runner) | `/service-areas/queens/brake-jobs` | "Nine services crossed with five boroughs make 45 pages … each one composed from a service angle and a borough paragraph" — the H1 `Mobile Brake Repair in Queens, NY`, the service's "near me" intro, and the two crossed sections ("Why get brake repair done on-site in Queens", "Mobile mechanic service in Queens") |
| `new-york-mobile-mechanic-topic.jpg` (1600x1000, runner) | `/services/starter-alternator/alternator-replacement` | "thirty pages that each take one question … with its own price chip and the note scoping what the price covers" — `Diagnosis from $95`, the answer-first lead, the section headings |
| `new-york-mobile-mechanic-lighthouse.jpg` (1600x841, from the 2026-07-09 screenshot) | `~/Desktop/NYMM Results/Screenshot 2026-07-09 at 2.35.19 PM.png`, 2556x1344, resized whole; cannot be cropped up to 1000 tall, waived by the controller (review round 1) | "Lighthouse scored the home page 100 for performance, accessibility, best practices and SEO, and 3 of 3 for agentic browsing" |
| `new-york-mobile-mechanic-chatgpt-nyc.jpg` (1600x1000, from the 2026-07-28 screenshot) | `…/Screenshot 2026-07-28 at 3.54.30 PM.png`, 2150x1554, resized to 1600x1156 then cropped to y 60..1060 (60px off the top, 96px off the bottom); the prompt, the 4.9 card, "1. Adam Mobile Mechanic" and "4.9/5 (133 reviews)" all survive | "asked for the top five mobile mechanics in New York City, ChatGPT listed the business first" |
| `new-york-mobile-mechanic-chatgpt-queens.jpg` (1600x1000, from the 2026-08-07 screenshot) | `…/Screenshot 2026-08-07 at 5.17.18 PM.png`, 2180x1600, resized to 1600x1174 then cropped to y 60..1060 (60px off the top, 114px off the bottom); the prompt, the 4.9 card and "1. Adam Mobile Mechanic" survive; the Reddit line (y≈1127) does not, so the copy's Reddit mention is sourced to the original file, not this frame | "asked for the best mobile mechanic in Queens ten days later, it did the same" |
| `nymm.jpg` (frozen cover, 1200x750) | NOT re-captured | Shared by `/`, `/work/`, `/process/` and `/services/web-development/` (twice) with alt "The New York Mobile Mechanic home page"; captured from the LIVE site on 2026-09-07 with the live `158+` dial. A local re-capture would show `144+`. The header renders it under the title, so the hero, the four dials and the two call buttons are the page's opening image. |
| `mechanicseo.png` (frozen, 512x265) | NOT re-captured; no longer placed on this page | The same Lighthouse report, downscaled. It stays on disk for `/services/web-development/` (alt "…scoring 100 for performance and accessibility"). This page uses the 1600-wide version above instead, so the numbers are legible. |
| `conversion.png` (frozen, 1179x2203) | NOT re-captured. Provenance: committed to NewNeura on 2026-09-02 in `17b2b8c` ("Port neuragul.com onto the cloned studio layout"); a capture of the live `/reviews` page on a phone, capture date not recorded; it shows the post-rebrand `ADAM` wordmark, so it post-dates the client's hero rebuild. | `4.9`, `147 Google reviews` (the live count on its undated capture day; the cover's `158+` is 2026-09-07 and ChatGPT's `133` is 2026-07-28, so no figure from it is quoted on the page), two review cards, and the fixed `Call` / `Text Now` bar. Evidence for the fixed-bar sentence. Only this page references it. |

**The Desktop-derived images are not runner shots.** `capture-case-study-shots.mjs` iterates
every entry in a slug's config and deletes the destination of any shot that fails, so a
non-URL entry cannot sit in the config beside real routes without breaking (and destroying)
the run. The three are therefore produced by scratch scripts (`$SCRATCH/nymm-resize.mjs`,
`$SCRATCH/nymm-crop.mjs`, both reproduced in task-11-report.md) with `sharp` from NewNeura's
own `node_modules`: the Lighthouse report resized whole, the two ChatGPT frames resized then
cropped to 1600x1000 as the rows above record. Nothing inside any frame is edited. The crop
and the Lighthouse waiver are the controller's review-round-1 rulings. `check-assets.mjs`
still asserts, for each, that the file exists, that its declared width/height match the
pixels, and that its alt is non-empty; only `minBytes` is unchecked for them.

**Not captured, and why.** `/` — the cover already is it. `/reviews` — fallback numbers
locally (`5.0`, 8 reviews) would contradict the live values `conversion.png` shows. `/contact`
— a form proves a form exists. `/services` and `/service-areas` — index grids; the two
captured pages prove the matrices by showing a cell of each, which the indexes cannot.

---

## Cross-page deltas

Echoes, outside this page, of the four claims this task cut or rewrote. Each entry is a
`{file, anchor, replacement, reason}`; anchors are exact current strings, each verified to
occur exactly once in its file by `grep -cF` (table at the end). **None applied by this
task.** Line numbers are from `case-study-expansion` at `62402fd`.

**The reasons, shared:** (a) `framer-motion` is in no manifest, lockfile or source file of
the repo; the site declares `gsap` and uses it in one file, and the dials are hand-built SVG
on `requestAnimationFrame`. No other shipped NeuraGul project declares `framer-motion` either
(`grep -l framer-motion ~/Projects/*/package.json` → two unshipped templates only). (b)
"schema markup on every route": 12 of 15 route files emit JSON-LD; `/gallery`, `/privacy`,
`/terms` emit none. (c) "Core Web Vitals in the green": field CWV is measured nowhere in the
repo (`FULL-AUDIT-REPORT.md` 2026-07-01: PageSpeed call rate-limited, score carried); what
exists is the Lighthouse report of 2026-07-09 at 100 / 100 / 100 / 100 (Unverifiable 1). (d)
"ranks across all five boroughs": the repo's own audit has the site absent from the top 30
organic on 2026-07-01 and the service pages at positions 24.8–57.8 on 2026-08-17; no later
organic position is recorded (Unverifiable 2). (e) "stat gauges count up as they scroll into
view" is true; kept wherever it appears.

### `src/components/site/services/web-development/content.ts`

1. `{file: "src/components/site/services/web-development/content.ts", line: 114, anchor: "a landing-page matrix of service crossed with borough, schema markup on every route, and Core Web Vitals in the green. Stat gauges count up as they scroll into view, live Google reviews carry the credibility, and a one-tap call-to-book follows you down the page.", replacement: "forty-five pages of service crossed with borough and thirty more that each answer one question, JSON-LD on every one of them, and a Lighthouse 100 for performance, accessibility, best practices and SEO. Stat dials rev as they scroll into view, the Google rating is pulled live with the real reviews as its fallback, and on a phone a Call and Text bar follows you down the page.", reason: "(b) (c); the sentence is the old case-study intro verbatim"}`
2. `{file: "src/components/site/services/web-development/content.ts", line: 166, anchor: "New York Mobile Mechanic ships a landing-page matrix of service crossed with borough, schema markup on every route, and Core Web Vitals in the green.", replacement: "New York Mobile Mechanic ships forty-five pages of service crossed with borough, thirty pages that each answer one question a driver types, JSON-LD on every one of them, and a Lighthouse 100 across all four categories.", reason: "(b) (c); phase 02 of the process slider, beside the `mechanicseo.png` Lighthouse card, whose alt (`:172`) already says 100 for performance and accessibility and stays true"}`
3. `{file: "src/components/site/services/web-development/content.ts", line: 209, anchor: "TypeScript, Next.js, React and Tailwind CSS, with Framer Motion where a page earns it.", replacement: "TypeScript, Next.js, React and Tailwind CSS, with GSAP where a page earns it.", reason: "(a); phase 04, and its image (`:211-216`) is the New York Mobile Mechanic cover, so the illustrated project is the one that declares GSAP"}`
4. `{file: "src/components/site/services/web-development/content.ts", line: 259, anchor: "TypeScript, Next.js, React, Tailwind CSS and Framer Motion, with Shopify and custom Liquid where a storefront calls for it.", replacement: "TypeScript, Next.js, React, Tailwind CSS and GSAP, with Shopify and custom Liquid where a storefront calls for it.", reason: "(a); a service-wide stack line — GSAP is verified for this repo, and no shipped repo declares framer-motion; the controller may prefer to drop the motion library from the line altogether"}`
5. `{file: "src/components/site/services/web-development/content.ts", line: 293, anchor: "The mobile mechanic we built ranks across all five boroughs for on-demand repair searches.", replacement: "The mobile mechanic we built has a page for every service in every borough, and on 28 July 2026 ChatGPT, asked for the top five mobile mechanics in New York City, listed it first.", reason: "(d); the replacement is the dated observation the case study now makes, with no causal claim"}`

Fine as-is in this file: `:172` (the Lighthouse alt, true); `:244` "built to rank across all
five boroughs" (intent, not a ranking claim); `:212`, `:341` and the other cover alts.

### Other files

6. `{file: "public/llms.txt", line: 29, anchor: "A local SEO site for a 24/7 mobile mechanic — a landing page for every service crossed with every borough, schema on every route, Core Web Vitals in the green.", replacement: "A Next.js site for a 24/7 mobile mechanic: 117 pages keyed off one config file, a service-by-borough matrix of forty-five pages plus thirty single-question pages, JSON-LD on every one of them, Lighthouse at 100 across all four categories.", reason: "(b) (c); llms.txt is orchestrator-owned"}`
7. `{file: "public/llms.txt", line: 44, anchor: "The stack is TypeScript, Next.js, React, Tailwind CSS and Framer Motion, with Shopify and custom Liquid where a storefront calls for it, and Python where a pipeline does.", replacement: "The stack is TypeScript, Next.js, React, Tailwind CSS and GSAP, with Shopify and custom Liquid where a storefront calls for it, and Python where a pipeline does.", reason: "(a); mirrors delta 4"}`

**Notes for the controller (no anchor, nothing to apply):** `public/site/videos/nymm-hero.mp4`
(994,714 B, the 12-second pan of the home page) is no longer referenced by any file after
this task (`grep -rn nymm-hero.mp4 src/` → only a comment in this page's `content.ts`). It
sits outside this task's owned paths; delete or keep at the controller's discretion. The
home/work/process/web-development alts "The New York Mobile Mechanic home page" remain true.
`.agents/product-marketing.md` needs no change: its proof-point list already sends Tasks
12–17 to this dossier for this project's numbers.

### Anchor uniqueness (so the controller can apply by exact replacement)

Checked at `62402fd` on 2026-09-11 with `grep -cF -- "<anchor>" <file>`:

All seven are single-line anchors. Every anchor occurs exactly once and at the cited line.
Re-run the same check before applying if any of these files has moved on.

| Delta | File | Lines | Check | Occurrences | At cited line |
| --- | --- | --- | --- | --- | --- |
| 1 | `services/web-development/content.ts` | 114 | single-line `grep -cF` | 1 | yes |
| 2 | `services/web-development/content.ts` | 166 | single-line `grep -cF` | 1 | yes |
| 3 | `services/web-development/content.ts` | 209 | single-line `grep -cF` | 1 | yes |
| 4 | `services/web-development/content.ts` | 259 | single-line `grep -cF` | 1 | yes |
| 5 | `services/web-development/content.ts` | 293 | single-line `grep -cF` | 1 | yes |
| 6 | `public/llms.txt` | 29 | single-line `grep -cF` | 1 | yes |
| 7 | `public/llms.txt` | 44 | single-line `grep -cF` | 1 | yes |

Deltas 3, 4 and 7 are the only three occurrences of "Framer Motion" outside this page
(`grep -rn "Framer Motion" src/ public/llms.txt` → 3 after this task's rewrite).
