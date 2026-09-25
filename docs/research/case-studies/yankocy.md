# Yankocy Wholesale Building Materials: case-study dossier

Sources of record: **the local repo `~/Projects/Yankocy`** (git `1e098ea`, clean tree, remote
`github.com/hamadgul/yankocy-site`, **private**, per `gh api repos/hamadgul/yankocy-site`), **the
staging deploy `https://yankocy-site.vercel.app`**, and **the production domain
`https://www.yankocy.com`**. All three were observed on 2026-09-25 at about 19:19–19:30 UTC. Every
line below names the file (and line where it helps) or the command it came from. The repo was only
read. No `npm`, no build and no write ran inside it. Captures went to
`$SCRATCH/yankocy-shots/` (`/private/tmp/claude-501/-Users-hamadgul-Projects-NewNeura/3ac20464-9181-4124-adcf-51b47942484f/scratchpad/yankocy-shots/`).

Nothing here claims a business outcome, because none has been measured. See *Live status* and
*Unverifiable claims*.

---

## Live status (read this first)

**The new site is NOT live on the production domain. It is on staging only.**

| Host | Observed 2026-09-25 19:19 UTC | What it serves |
| --- | --- | --- |
| `https://www.yankocy.com/` | `200`, `Server: DPS/2.0.0+sha-8c289e6` (GoDaddy); `<meta name="generator" content="Starfield Technologies; Go Daddy Website Builder 7.0.5350">`; `<title>Home \| Yankocy Wholesale Building Materials</title>`; still fires `ga('create', 'UA-92508896-1')` | **The OLD GoDaddy site** |
| `https://yankocy.com/` | `301` → `https://www.yankocy.com/`, `Server: DPS` | GoDaddy's own apex redirect |
| `http://yankocy.com/` | `308` → `https://yankocy.com/` | GoDaddy |
| `https://yankocy-site.vercel.app/` | `200`, `server: Vercel`, **`x-robots-tag: noindex, nofollow`**; `<title>Wholesale Building Materials Distributor, CT \| Yankocy</title>`; H1 `Wholesale building materials supplier in Monroe, CT since 1950` | **The NEW site** |

Supporting checks (`curl -s -o /dev/null -w '%{http_code}'`):
- `www.yankocy.com/products/steeltex-pool-wire/` → **404**, and `/llms.txt` → **404**. The old
  `www.yankocy.com/pool-wire---steeltex.html` → **200**, not 301.
- `dig +short www.yankocy.com` → CNAME `yankocy.com.` → `13.248.243.5`, `76.223.105.230`. These are
  not Vercel addresses.
- Staging serves HEAD exactly. `/`, `/products/steeltex-pool-wire/`, `/products/` and `/about/` from
  staging are **byte-identical** (`cmp`) to `site-draft/dist/` at `1e098ea`. `gh api
  repos/hamadgul/yankocy-site/deployments` lists `1e098ea` as the newest Vercel "Production"
  deployment (2026-09-25T18:58:07Z). "Production" here is the Vercel project's own environment,
  which answers on `yankocy-site.vercel.app`, not on the client's domain.
- The repo itself says the same thing. `README.md:12` reads "Staging: https://yankocy-site.vercel.app
  (… noindex on every host except www.yankocy.com)". `yankocy.com-audit/MIGRATION-AUDIT.md:5` says
  "ready to switch once the launch-day steps below are done". The DNS switch in
  `launch-kit/launch-checklist.md:10-11` has not happened, as `dig` shows.

**So the page may say "built" and "ready to launch" (staging URL, private repo). It must not say
"launched", "live", "migrated" or anything that implies Google now sees it.** The staging host sends
noindex on purpose (`site-draft/vercel.json`, the header rule with `has: host .*\.vercel\.app`).

---

## Stack (verified)

| Component | Observed | Where |
| --- | --- | --- |
| Generator | A hand-written **Python static-site build**. `python3 _build/build.py` writes `dist/` (62,797-byte `build.py` plus 48,285-byte `catalog.py`, 647 lines of catalog data). It uses no framework and no npm dependencies. | `README.md:7`, `site-draft/README.md:6`, `ls -la site-draft/_build` |
| Build-time checks | `assert len(title) <= 60`, `assert len(desc) <= 160`, `assert body.count("<h1") == 1` | `site-draft/_build/build.py:355-357` |
| Host | **Vercel**, Git-connected (`hamadgul/yankocy-site`, Root Directory `site-draft`). Netlify was tried and then dropped (`b9b902c Drop Netlify: Vercel is the only host`). | `launch-kit/launch-checklist.md:5`, `git log` |
| `vercel.json` | Written by `build.py`: `framework: null`, `buildCommand: "python3 _build/build.py"`, `outputDirectory: "dist"`, `trailingSlash: true`, **77** redirect rules and 4 header rules | `python3 -c "json.load(open('vercel.json'))"` |
| Headers | `/(.*)` gets HSTS (`max-age=63072000; includeSubDomains; preload`), `nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, `X-Frame-Options: SAMEORIGIN`. `/assets/*` gets `max-age=31536000, immutable`. `/images/*` gets `max-age=2592000`. `*.vercel.app` gets `X-Robots-Tag: noindex, nofollow`. | `site-draft/vercel.json` |
| CSS / JS | `assets/site.css` is **42,800 B**. `assets/search.js` is **16,191 B** (deferred) and loads a `search.json` index of **262** items, 16 categories and 8 "popular" entries. There is also a small inline photo viewer. | `wc -c`; `json.load(dist/assets/search.json)` |
| Fonts | Barlow and Barlow Condensed, self-hosted. There are **5** woff2 files (`assets/fonts/`, OFL) and **2** `<link rel="preload">`. The site makes no third-party font requests. | `ls site-draft/assets/fonts`; `grep preload dist/index.html` |
| Images | **142** WebP files in `site-draft/images/` plus **13** 1200x630 OG JPEGs in `images/og/`. `images.json` holds **82** entries. The files use responsive `-240/-480/-960/-1440/-1600` variants. | `ls images \| sed 's/.*\.//' \| uniq -c` |
| Contact form | Formspree `xnpnzbeo` with a `_gotcha` honeypot, an AJAX in-place submit and a no-JS fallback | `build.py:36-38`; `site-draft/README.md:34` |
| Analytics | **None.** `GA4_ID = ""` and `GSC_VERIFY = ""`. They are "Fill in at launch". | `build.py:32-34` |
| Git | **26 commits**, 2026-09-24 16:24 → 2026-09-25 14:57 (-0400): 23 on 09-24 and 3 on 09-25. The first commit (`ca0bfa7`, 140 files, +3,702 lines) is a snapshot of work that already existed. The audit is dated 2026-09-21 and the draft README 2026-09-22. So git dates the repo, not the engagement. | `git log --format='%ad' --date=short \| sort \| uniq -c`; `git show --stat ca0bfa7` |

No test suite exists. The build asserts above are the only automated gate. The frontend audit's axe
and Playwright checks (`FRONTEND-AUDIT.md:18-23`) were run once and are not in the repo as scripts.

---

## (a) What was BUILT and is deployed to staging

These facts are checked against `site-draft/dist/` at `1e098ea`, which matches staging
byte-for-byte on the four routes compared.

**1. A 26-page static site replacing a 9-page GoDaddy Website Builder 7 site.** `find dist -name
'*.html'` gives 26 files. `sitemap.xml` lists **23** indexable URLs: home, `/products/`, **13
category pages**, the **3 nationwide product pages** (Steeltex pool wire, shingle backer board,
Bearcat wheelbarrows), plus `/about/`, `/delivery-area/`, `/vendors/`, `/gallery/` and `/contact/`.
Three pages carry `noindex,follow`: `404.html`, `/contact/thanks/` and `/search/`. The old site had
9 pages (`FULL-AUDIT-REPORT.md:7`, the table at `:49-59`).

**2. The one-page catalogue split into 13 category pages with spec tables.** The old
`services.html` held 100+ products on one 1,541-word page (`FULL-AUDIT-REPORT.md:20`). The new
`/products/` hub links 13 categories: drainage and septic, masonry supply, rebar and wire mesh,
concrete accessories, plaster/stucco/lath, masonry coatings and cleaners, fireplace and chimney,
site work and erosion control, poly sheeting, board and insulation, roofing/flashing/ventilation,
cellar doors and egress, and ice melt. Each category page has H2 product groups and `<th
scope>` spec tables. The census counts **271** `<tr>` across the built HTML (`grep -c '<tr'`).

**3. Titles and H1s rewritten, one H1 per page, checked at build time.** Every title follows
`Primary term — qualifier | Yankocy` in at most 60 characters (`build.py:355`). Examples from
`dist/`:
- `Wholesale Building Materials Distributor, CT | Yankocy` (home)
- `Steeltex Pool Wire — Wholesale for Pool Dealers | Yankocy`
- `Shingle Backer Board — Wholesale, 7/16" x 15" | Yankocy`
- `Rebar Supplier & Concrete Wire Mesh — Wholesale CT | Yankocy`

The census over 26 files finds `h1=1` on every page. The old site had no H1 on 8 of 9 pages
(`FULL-AUDIT-REPORT.md:61`, O1).

**4. Structured data on every page.** The census comes from parsing each `application/ld+json`
block in `dist/**/*.html`. The node counts are pages that carry the node.
- **Every page (26/26):** a sitewide `WholesaleStore` + `Organization` node, plus `WebSite`. It
  holds `foundingDate` "1950", `founder` Person "Ferdinand Yankocy", `PostalAddress` (143 Enterprise
  Drive, Monroe CT 06468), `GeoCoordinates` "from the GBP listing", `hasMap` (by place ID), 5
  `sameAs` directory listings, `OpeningHoursSpecification` (Mon–Fri 08:00–16:30) and two
  `ContactPoint`s. Its `areaServed` is Connecticut plus 5 `Place`s, each `containedInPlace` a
  `State` (`build.py:217-247`).
- **Every other page (22):** `BreadcrumbList`.
- **16 pages:** `FAQPage`, with **56** `Question`s in total.
- **14 pages:** `CollectionPage`, meaning the hub and the 13 categories.
- **3 pages:** `ItemPage`, meaning the three nationwide products.
- **1 page each:** `AboutPage`, `ContactPage`, `Service` (on `/delivery-area/`) and `ItemList` +
  `Brand` (on `/vendors/`).

The old site had zero JSON-LD (`FULL-AUDIT-REPORT.md:63-64`). **`Product` schema is deliberately
NOT emitted.** It is held until the client publishes a price. Without one Google flags it as
invalid, and the client does not want public-price rich results (`site-draft/README.md:20,39`;
`CLIENT-FEEDBACK-ADDENDUM.md:51`).

**5. Redirects for every old URL, verified on staging.** `site-draft/redirects.csv` has 38 rows:
one apex → www rule plus **37 old paths**. Those paths are the 9 `.html` pages, 8 legacy aliases,
their GoDaddy `/mobile/` copies and the two old sitemaps. `vercel.json` carries **77** rules: 39
host-independent rules and 38 duplicates conditioned on `host: yankocy.com`, which 301 to
`https://www.`. I ran `curl` over all 37 paths against `yankocy-site.vercel.app` on 2026-09-25 at
~19:25 UTC. **37 of 37 return `301` in one hop and land on a `200`.** `MIGRATION-AUDIT.md:39-40`
records that `/photos.html` → `/gallery/` and the `/mobile/*` set were fixed in the migration pass
(they had pointed at `/about/` or 404'd).

**6. The technical basics the old platform could not do.** The old platform's limits are listed in
`FULL-AUDIT-REPORT.md:22,36`.
- A self-canonical `https://www.yankocy.com/...` on every page.
- `robots.txt` set to `Allow: /` with the sitemap declared.
- A `sitemap.xml` whose per-page `lastmod` changes only when that page's content hash changes
  (`_build/lastmod.json`).
- One responsive document for every user agent. The old site used UA dynamic serving without
  `Vary`.
- `llms.txt`.
- A custom 404 page with search.
- 40 `rel="noopener"` vendor links on `/vendors/`, with the GoDaddy badge removed.
- No dead UA tag.

**7. Images rebuilt.** The old homepage carousel referenced 25.8 MB of JPEGs
(`FULL-AUDIT-REPORT.md:67`). It was replaced by one hero image. The draft says 81 images were
renamed and re-encoded as WebP with srcset and width/height (`site-draft/README.md:21`; 82 entries in
`images.json`), and that every image has alt text (`site-draft/README.md:22`). The old site had
alt text on 11 of 86 images.

**8. Product search.** A header search opens on `/` or Ctrl/Cmd+K. It is backed by a
build-generated index of 262 items, handles sizes, plurals and small typos, and deep-links to the
exact table row (`site-draft/README.md:9`). This feature did not exist on the old site.

**9. Positioning changed after client feedback, and the change is in the copy.** The client said
the mason and lumber yards are customers, not competitors, and that Steeltex and shingle backer are
wholesale only (`CLIENT-FEEDBACK-ADDENDUM.md:3-6`). What shipped in `dist/`:
- The Steeltex subhead reads "Heavy-duty paper-backed mesh, sold wholesale to dealers nationwide".
- The Steeltex body reads "serving pool supply dealers and yards … We do not sell to the public."
- There is a homeowner-redirect FAQ ("If you are building a pool, ask your pool builder or local
  pool sup[ply dealer]"), found by `grep -oi 'homeowner…' products/steeltex-pool-wire/index.html`.
- A nationwide-shipping callout on `/delivery-area/` links the three nationwide products (capture
  below).

**10. Accessibility and front-end hardening (as recorded, not re-run here).** The repo's own record
is in `FRONTEND-AUDIT.md:3-16`:
- The score went from 15/20 to all P0–P3 items fixed.
- axe reports "0 violations, 48 page views" at 1280 and 390.
- Phones have 0 non-inline tap targets under 44 px.
- Contact now loads 106–133 KB, because a static OSM map replaced the 1.7–2.4 MB Google Maps embed.
- Secondary text is at least 14 px.

These are the repo's claims from a one-off run. I did not re-run axe.

**11. Content carried over and expanded, measured against the old site.** `MIGRATION-AUDIT.md:46-56`
records a token-match parity check, and every snippet Google quotes was kept. Word counts:

| Page | Old | New |
| --- | --- | --- |
| Home | 457 | 726 |
| Steeltex | 288 | 574 |
| Shingle backer | 422 | 616 |
| Bearcat | 176 | 401 |
| About | 194 | 531 |
| Vendors | 83 | 590 |

My own `<main>` word census gives lower absolute numbers because it counts a narrower region (for
example home 574, Steeltex 443). Quote the audit's figures with their source or quote none.

## (b) What the audit only RECOMMENDED (not done, or not verifiable as done)

The audit and addendum recommended the items below, and nothing in the repo shows them done:
- **Rename the masonry supply title.** Still `Masonry Supply — Wholesale Distributor in CT |
  Yankocy` in `dist/products/masonry-supply/index.html`. The addendum asked for dealer wording
  (`CLIENT-FEEDBACK-ADDENDUM.md:54`).
- **Add `audience: BusinessAudience`** to the WholesaleStore schema (`CLIENT-FEEDBACK-ADDENDUM.md:55`).
  `grep -n audience build.py` finds nothing.
- **Reword the Bearcat FAQ.** "Can I buy a single Bearcat wheelbarrow? Yes…" is still served. The
  addendum left this as an open client question (`CLIENT-FEEDBACK-ADDENDUM.md:53,79`).
- **Add a "Where to buy" dealer-referral block.** It depends on the client (`:56`) and is not
  present.
- **Everything in the audit's Phase 4** (dealer-locator links, trade bodies, reviews, monitoring;
  `ACTION-PLAN.md:37-45`) and its **6-month targets** (`ACTION-PLAN.md:45`, rewritten in
  `CLIENT-FEEDBACK-ADDENDUM.md:69-74`). These are targets, not results.
- **The migration's expected gains** ("Why rankings should go up", `MIGRATION-AUDIT.md:88-94`),
  which that file itself qualifies: "None of this is guaranteed."

## (c) Off-site work PREPARED but not verifiably done

`launch-kit/README.md:15` says "All copy in these files is a draft. The client should approve it
before anything is sent or published." None of the items below can be confirmed from the repo or a
public check:
- **GBP rewrite** (`launch-kit/google-business-profile.md`): a 718-character description,
  categories (superseded by addendum §3), 13 GBP Products, service area and hours. The **17
  photos** in `launch-kit/gbp-photos/` are only 8 at 720 px or more.
- **Review requests** (`launch-kit/review-requests.md`): templates plus the target of 8 → 30
  reviews in 6 months.
- **Outreach** (`launch-kit/outreach.md`): a dealer-locator request to 12 manufacturers, trade
  bodies, and cleanup of directory listings.
- **Photo request to the client** (`launch-kit/photo-request.md`): a 19-item shot list. 45 site
  photos are under 700 px.
- **Disavow file** `yankocy.com-audit/disavow-yankocy.com.txt` (43 spam domains). Uploading it to
  Search Console is a launch-checklist step (`launch-checklist.md:31`) and is not verifiable.
- **Search Console, GA4 and Formspree target email.** `GA4_ID` and `GSC_VERIFY` are empty in
  `build.py`. Formspree's end-to-end email delivery is a launch-day test
  (`launch-checklist.md:21-27`).
- **The SEO audit and proposal themselves** (`Yankocy-SEO-Audit-Proposal.pdf`, "Prepared by: Hamad
  Gul, Date: 21 September 2026", page 1) *were* produced. Whether the client received them and what
  they bought is not recorded. The PDF has an "Investment and timeline" section. Never quote it.

---

## Audit baseline (the "before", measured, dated)

These describe the **old site**. They are a baseline, not an outcome of our work.

| Measure | Value | Source and date |
| --- | --- | --- |
| Audit health score | **39/100** (Technical 55, Content 40, On-page 45, Schema 0, Performance 35, AI readiness 45, Images 10) | `FULL-AUDIT-REPORT.md:2,9-17`, 2026-09-21 |
| Ranking keywords / est. organic visits | **51** / **~137/mo** | DataForSEO Labs, US, `FULL-AUDIT-REPORT.md:7`, 2026-09-21 |
| Domain Rank | **11**: 134 backlinks, 64 referring domains, **43 of 60** spam | `FULL-AUDIT-REPORT.md:76`, 2026-09-21 |
| GBP | 4.8★ from 8 reviews, 4 photos, no description, `http://` link | `FULL-AUDIT-REPORT.md:77`, 2026-09-21 |
| Homepage images referenced | **25.82 MB** (14 carousel JPEGs) | `FULL-AUDIT-REPORT.md:67` |
| Old home Lighthouse, desktop (DataForSEO) | Perf 93, A11y 80, BP 100, SEO 92; LCP 1.4 s; CLS 0.105; 7,830 KB | `FULL-AUDIT-REPORT.md:70` |
| Old home and products Lighthouse, mobile | `NO_FCP`, twice (a Lighthouse error: no first paint, so no score) | same; `data/dfs_lh_home_mobile.json` `status_code 50301` |
| Live positions of the OLD URLs, Monroe CT | steeltex **#1** (+ AI Overview); steel tex **#1**; steeltex pool wire **#2**; pool wire **#5**; shingle backer **#3**; shingle backer board **#4**; yankocy **#1**; wholesale building materials connecticut **local pack #1** / organic 14; building materials distributor connecticut **local pack #1** / organic 18 | `data/migration-2026-09-24/serps_live.json`, 2026-09-24 20:56–20:58 UTC (re-parsed; matches `MIGRATION-AUDIT.md:11-22`) |
| Pages indexed | 9 (`site:yankocy.com`, `se_results_count: 9`) | `data/migration-2026-09-24/site_serp.json`, 2026-09-24 20:56 UTC |

**Before and after on performance (new site on staging, old site live).**
- **Lighthouse mobile, Steeltex page** (`data/migration-2026-09-24/lh.json`, 2026-09-24):

  | Metric | Old | New |
  | --- | --- | --- |
  | Performance | 0.47 | 0.88 |
  | Accessibility | 0.53 | 1.00 |
  | LCP | 11.6 s | 1.9 s |
  | CLS | 0.761 | 0.235 |
  | Weight | 1,850 KiB | 167 KiB |

  The new home scored perf 0.88 at 258 KiB, and shingle backer 0.88 at 118 KiB. The new SEO
  score of 0.69 is caused by the staging noindex. `MIGRATION-AUDIT.md:66-67` says the 0.235 CLS
  went to **0** after a `font-display: optional` fix. **No saved Lighthouse run shows the 0**, so
  quote the lh.json figures or re-run Lighthouse.
- **My own Playwright pass** (2026-09-25 ~19:28 UTC; Chrome, no throttling, DPR 1; a
  `layout-shift` observer after a scroll-through):
  - **CLS was 0.0000 on all 9 staging routes captured.**
  - Decoded response bytes after scrolling were 623 KB on the new home against **8.01 MB** on the
    old home. The new Steeltex page was 219 KB against **1.84 MB** on the old one.
  - These are desktop, unthrottled numbers, not Lighthouse. Label them that way if used.

**Business outcomes: none measured.** No Search Console, GA4, call-tracking or post-launch ranking
data exists in the repo, and none can exist yet because the site has not launched.

---

## Target keywords (from the repo, by tier)

From `CLIENT-FEEDBACK-ADDENDUM.md:42-46`, which replaces the audit's tiers:
- **Tier 1, exclusive products for trade buyers nationwide:** steeltex, steeltex pool wire,
  steel tex, pool wire (480/mo, CPC $13.68), pool steel, gunite wire, swimming pool wire, shingle
  backer, shingle backer board, siding backer board.
- **Tier 2, wholesale distributor positioning:** wholesale building materials (1,900 US / 1,000
  CT), building materials distributor, building products distributor(s).
- **Tier 3, trade-worded categories:** rebar wholesale / rebar supplier, wire mesh supplier,
  septic tank distributor, bulk ice melt, firebrick supplier, wire lath, plus manufacturer brand
  names.
- **Deliberately removed as targets because they compete with the client's own customers:**
  masonry supply near me (12,100), masonry supply, building supply near me, and the DIY heads.

This is the most interesting decision in the project and it is fully documented: a live-SERP check
showed the "masonry supply near me" local pack is Yankocy's customers (`:26`).

---

## Audience, objection, primary action

Per `.agents/product-marketing.md` §2, this is segment 1, **a local service-business owner**. More
precisely, it is a 75-year family B2B distributor on a builder platform that was capping its SEO.

**Objection:** *"Is a site rebuild going to lose the rankings we already have?"* Yankocy held #1
for its own flagship product term. The answer is mechanical and checkable:
- 37 of 37 old URLs 301 in one hop to a 200 (staging).
- Every quoted snippet was kept.
- Word counts went up on every page.
- A dated pre-migration ranking snapshot exists, with rollback triggers
  (`MIGRATION-AUDIT.md:79-86`).

**Secondary objection:** *"Will more traffic just bring homeowners we don't sell to?"* It is
answered by the addendum's customer-conflict SERP check, and by the "We do not sell to the public"
copy and homeowner FAQ that shipped.

**What the page must not do:**
- Say launched, live or migrated.
- Claim a ranking, traffic, call or lead change.
- Present the audit's 6-month targets or "why rankings should go up" as results.
- Quote the proposal's pricing.
- Claim the GBP, reviews, outreach or disavow were done.
- Restate the client's own claims ("premier supplier", "thousands of items", "75 years") as ours.
- Say "I".

---

## Verifiable numbers

| Number | Command / location |
| --- | --- |
| **26** built HTML pages; **23** sitemap URLs; **3** noindex | `find site-draft/dist -name '*.html' \| wc -l`; `grep -c '<loc>' dist/sitemap.xml`; per-page `meta robots` census |
| **13** category pages + **3** nationwide product pages + hub | `dist/products/*/`; `/products/` H1 "Building materials catalog", intro "thirteen product categories" |
| **9** pages on the old site | `FULL-AUDIT-REPORT.md:7`; `site_serp.json` `se_results_count: 9` |
| **37** old paths, **37/37** one-hop 301 → 200 on staging; **77** rules in `vercel.json` (39 + 38 apex-host) | `curl` loop over `redirects.csv` rows 3-39, 2026-09-25 ~19:25 UTC; `json.load(vercel.json)['redirects']` |
| JSON-LD on **26/26** pages; `BreadcrumbList` 22; `FAQPage` 16 (**56** Questions); `CollectionPage` 14; `ItemPage` 3; 0 `Product` | JSON-LD parse census over `dist/**/*.html` |
| **1** H1 per page; titles ≤ **60** chars, descriptions ≤ **160**, asserted at build | `build.py:355-357`; census |
| **271** table rows; **262** search-index items | `grep -c '<tr'`; `dist/assets/search.json` |
| **338** internal links inside `<main>` across all pages | regex census `<a href="/…">` within `<main>` |
| CSS **42,800 B**; search JS **16,191 B**; **5** self-hosted woff2, **2** preloads | `wc -c`; `ls assets/fonts`; `grep preload` |
| **142** WebP, **13** OG JPEGs 1200x630 | `ls site-draft/images`, `sips` |
| **26** commits, 2026-09-24 → 2026-09-25 | `git log` |
| Lighthouse mobile Steeltex old → new: perf **47 → 88**, LCP **11.6 s → 1.9 s**, weight **1,850 → 167 KiB** | `yankocy.com-audit/data/migration-2026-09-24/lh.json` (2026-09-24) |
| Audit health score **39/100** (old site) | `FULL-AUDIT-REPORT.md:2` |

---

## Unverifiable claims

For the user. **Do not write these on the page.**

1. **That the site is launched.** It is not. `www.yankocy.com` served GoDaddy WSB 7 on 2026-09-25
   19:19 UTC. Re-check with `curl -sI https://www.yankocy.com/` and `dig +short www.yankocy.com`
   before the case study ships. Remember that the user may deploy between turns.
2. **Any ranking, traffic, call or account result.** Nothing has been measured post-launch, and
   GA4 and GSC are unset (`build.py:33-34`).
3. **CLS 0 in Lighthouse** (`MIGRATION-AUDIT.md:66`). The saved run says 0.235, and the 0 has no
   artifact behind it.
4. **"axe clean, 0 violations"** and the other `FRONTEND-AUDIT.md` fix-pass results. They come from
   a one-off run with no saved report or script in the repo.
5. **GBP changes, review asks, dealer-locator outreach, disavow upload, Search Console setup.**
   These are drafts in `launch-kit/` awaiting client approval (`launch-kit/README.md:15`).
6. **That the client approved the new copy.** `site-draft/README.md:33` lists category intros, FAQ
   answers, "How to order" and titles as "New copy to review".
7. **The engagement's dates and scope as sold.** Git starts 2026-09-24. The audit is dated
   2026-09-21. What the client contracted is not in the repo, and the proposal's pricing stays out.
8. **The client's own claims**: "premier wholesale supplier", "thousands of items", "75 years",
   "Fast, reliable nationwide shipping", and the named staff and their roles (`build.py:43-49`).
   These are the client's copy.
9. **The rankings table** describes the OLD site's positions (a baseline). It must never be read as
   our result.

### Client-name situation

The business is public and named on every page of both sites: Yankocy Wholesale Building
Materials, 143 Enterprise Drive, Monroe CT, with phone numbers, staff first names and emails
(`build.py:28-49`). The staging URL is public but noindexed. The GitHub repo is **private**. Naming
the client in a portfolio is normal, but:
- Linking the staging URL publicly exposes an unapproved draft.
- The captures show the client's phone numbers, email and, on `/about/`, family archive photos of
  named and unnamed people (`site-draft/README.md:37`: two archive photos have unconfirmed
  identities).
- The audit's spam-backlink finding (43 PBN domains) is unflattering to the client and should not
  be on a public page.

**Ask the user whether the client has agreed to be named before a pre-launch site is shown.**

---

## Shot list

**Existing files in the repo:**

| Path | px | What it shows | Usable? |
| --- | --- | --- | --- |
| `yankocy.com-audit/screenshots/home-desktop-fold.png` | 1366x768 | OLD GoDaddy home, above the fold | "Before" only; wrong size |
| `yankocy.com-audit/screenshots/home-desktop-full.png` | 1366x768 | **Identical file** to the fold capture (same md5 `79eb4ac0…`), mislabelled | No |
| `yankocy.com-audit/screenshots/home-mobile-fold.png` | 780x1688 | OLD home, mobile | Before (mobile) |
| `yankocy.com-audit/screenshots/home-mobile-full.png` | 780x6368 | OLD home, mobile full page | No |
| `yankocy.com-audit/screenshots/poolwire-desktop-fold.png` | 1366x768 | OLD Steeltex page | Before |
| `yankocy.com-audit/screenshots/products-mobile-fold.png` | 780x1688 | OLD products page, mobile | Before |
| `yankocy.com-audit/data/fig1-ranking-keywords.png`, `fig2-spam-links.png` | 1600x520 | Proposal charts | No (spam chart is unflattering, and these are charts rather than screenshots) |
| `yankocy.com-audit/data/fig3-clusters.png` | 1600x840 | Keyword-cluster chart | Possibly, as an in-page figure |
| `launch-kit/gbp-photos/01-yankocy-delivery-truck-flatbed.jpg` | 1600x901 | The client's red truck (the new hero photo) | Client photo, not our work |
| `site-draft/images/og/*.jpg` (13) | 1200x630 | OG cards cut from client photos | Wrong ratio for covers; client photos |

**No existing file is a screenshot of the NEW site.** I captured new ones with Playwright
(`channel: 'chrome'`, DPR 1, after `document.fonts.ready`, a scroll-through for lazy images, a
return to the top, and a check that every in-viewport `<img>` is `complete && naturalWidth > 0`).
Staging served all new-site shots, and the old shots came from live `www.yankocy.com`. All were
taken 2026-09-25 ~19:28 UTC in `$SCRATCH/yankocy-shots/`, and I opened and checked each one:

| File | px | Route | Shows |
| --- | --- | --- | --- |
| `yankocy-cover.jpg` | **1200x750** | staging `/` | Cover candidate. Maroon utility bar with hours and phones; nav with Search, 7 links and the Call button; maroon hero panel with the H1 "Wholesale building materials supplier in Monroe, CT since 1950"; Browse products / Call buttons; the truck photo and the "Weekday delivery" tag listing 6 regions |
| `yankocy-home.jpg` | 1600x1000 | staging `/` | The same hero at in-page width |
| `yankocy-steeltex.jpg` | 1600x1000 | staging `/products/steeltex-pool-wire/` | H1 "Steeltex pool wire mesh", subhead "sold wholesale to dealers nationwide", Specifications tag (3"x4", 48"x125', 12-gauge, 21 rolls/unit), "We do not sell to the public." |
| `yankocy-shingle-backer.jpg` | 1600x1000 | staging `/products/shingle-backer-board/` | Tier-1 product page 2 |
| `yankocy-catalog.jpg` | 1600x1000 | staging `/products/` | H1 "Building materials catalog", "thirteen product categories", search box, category rail, "Shipped nationwide" list |
| `yankocy-drainage.jpg` | 1600x1000 | staging `/products/drainage-septic/` | Category page: H1, intro, 4-photo strip, "On this page" rail, Pipe spec table |
| `yankocy-delivery-area.jpg` | 1600x1000 | staging `/delivery-area/` | H1 about delivery across Connecticut and the Northeast; the "These three products ship nationwide" callout; the region list; the old-site map image (Google map tiles, 415 px source) |
| `yankocy-about.jpg` | 1600x1000 | staging `/about/` | "Family owned since 1950", timeline 1950/1972/1986, family archive photos. **Contains identifiable people; ask before use** |
| `yankocy-vendors.jpg` | 1600x1000 | staging `/vendors/` | Manufacturer logos grid |
| `yankocy-old-home.jpg` | 1600x1000 | live `www.yankocy.com/` | "Before": GoDaddy header and nav, the 14-dot carousel ("Solid Dual Wall N-12 Pipe"), "Welcome to YANKOCY WHOLESALE BUILDING MATERIALS" |
| `yankocy-old-steeltex.jpg` | 1600x1000 | live `www.yankocy.com/pool-wire---steeltex.html` | "Before" for the Steeltex page: the same specs as a bullet list with no H1 |

Recommended set: cover `yankocy-cover.jpg`; in-page shots `yankocy-steeltex.jpg` (Tier-1 page),
`yankocy-drainage.jpg` (the one-page catalogue becomes 13 spec-table pages) and
`yankocy-delivery-area.jpg` (local SEO and nationwide positioning). A before/after pair
`yankocy-old-steeltex.jpg` ↔ `yankocy-steeltex.jpg` is available if the page format supports it.
These captures are **staging captures**. Re-shoot from `www.yankocy.com` once DNS switches, and
until then do not caption them as "the live site".

---

## Integration notes for NewNeura (no anchors applied)

Adding an eleventh project touches the hand-maintained counts:
- `PORTFOLIO_PROJECTS` (`src/components/site/work/content.ts`), including the "All ten projects"
  comment at `:124`.
- `WORK_SERVICE_FILTERS` (`CollectionProjects.tsx`) and `PORTFOLIO_FILTERS` (`home/content.ts`).
- `src/app/sitemap.ts:57` ("The ten case studies").
- The "ten" wording in `src/app/work/page.tsx:46,84`, `CollectionProjects.tsx:123` and
  `.agents/product-marketing.md:3-4,81,236`.

Run `scripts/check-filter-counts.mjs` afterwards. `grep -rli yankocy src public docs .agents` finds
no existing references.

---

## Cross-page deltas

Added 2026-09-25 with the `/work/yankocy/` page (`src/app/work/yankocy/page.tsx`,
`src/components/site/work/yankocy/content.ts`). The page agent did not edit any of the files
below; whoever owns them applies these. Remember the hand-maintained counts listed under
*Integration notes* above (ten → eleven projects).

**`/work/` card entry (`PORTFOLIO_PROJECTS` in `src/components/site/work/content.ts`):**

```ts
{
  title: "Yankocy",
  href: "/work/yankocy/",
  location: "2026 · Web",
  // Rebuild of a 9-page GoDaddy site into 26 static pages, plus the search
  // work (37 redirects, titles, JSON-LD on 26/26, the trade-only keyword call).
  // Built and on staging; www.yankocy.com still serves GoDaddy (2026-09-25).
  services: ["web-development", "seo"],
  topServices: ["web-development", "seo"],
  image: {
    src: `${IMAGES}/yankocy.jpg`,
    alt: "The rebuilt Yankocy Wholesale Building Materials home page",
    width: 1200,
    height: 750,
  },
},
```

**`public/llms.txt` line:**

- [Yankocy](https://neuragul.com/work/yankocy/): A 26-page rebuild of a Connecticut wholesale building materials distributor's nine-page GoDaddy site, being switched over now: thirteen catalogue pages with spec tables, 37 old addresses each redirected in one hop, structured data on every page, and a Steeltex product page that went from 47 to 88 in Lighthouse on mobile.

**SEO service page, one sentence:**

For Yankocy, a wholesale distributor moving off GoDaddy, we mapped all 37 of the old site's addresses to working pages before the switch and put structured data on all 26 new pages, with FAQ markup carrying 56 questions.

Do not add to any of these: a live link (the staging URL stays unlinked by user ruling), the old
site's search positions, or any ranking, traffic or call result. Re-check `curl -sI
https://www.yankocy.com/` before any copy says "live".
