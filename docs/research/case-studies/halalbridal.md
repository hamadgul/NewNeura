# Halal Bridal — case-study dossier

Source of record: **the workspace `~/Projects/halalbridal-seo-audit` (read-only) and the live
store `https://halalbridal.com`, and nothing else.** Every line below names a file (with line
numbers where they exist), a deploy-log record, or a command run over HTML saved from the live
site on **2026-09-25 19:20–19:25 UTC** (`$SCRATCH/hb/*.html` and `$SCRATCH/hb/all/*.html`, 76
sequential GETs with a desktop Chrome user agent; `$SCRATCH` =
`/private/tmp/claude-501/-Users-hamadgul-Projects-NewNeura/3ac20464-9181-4124-adcf-51b47942484f/scratchpad`).
`.env` was not opened; no deploy script was run; nothing was written inside the workspace.

The page it would back: **none yet.** This is a new portfolio entry. There is no
`src/components/site/work/halalbridal/` and no mention of the client anywhere in the site
(`grep -rn -i "halal\|bridal" src public/llms.txt .agents` → 0 hits, 2026-09-25).

**What "deployed" means here.** A claim counts as deployed only if (a) a Shopify Admin API
mutation for it sits in `deploy/log/*.jsonl` with an empty `userErrors`, and (b) where the
storefront can show it, the 2026-09-25 fetch shows it. The log filenames are local time
(UTC−4): `deploy/log/20260918-010924.jsonl` publishes `bridal-hijab-styles`, and the article's
`publishedAt` is `2026-09-18T05:09:25Z` (`audit-2026-09-20/shopify/articles.json`).

**Engagement window, from the logs:** first write `deploy/log/20260917-222140.jsonl`
(2026-09-17 22:21 EDT), last write `deploy/log/phase1-20260920-182716.jsonl` (2026-09-20 18:27
EDT). Today is 2026-09-25: **5 to 8 days after the work shipped.** No search-performance number
in the workspace post-dates it (see *Measured numbers*).

---

## Is the client public?

Yes. **"Halal Bridal" is the store's public name** — in every `<title>` (`… | Halal Bridal`),
`og:site_name`, and the `Organization` JSON-LD `"name": "Halal Bridal"` on every fetched page.
The founder, **Sarah Aktim**, is named publicly on `/pages/about-us` ("I am Sarah Aktim, the
founder of Halal Bridal.") and as the byline on all 18 live posts — both put there by this
work, with the spelling confirmed by the client (`COMPETITOR-ANALYSIS-CAMILLASBRIDAL.md:242,246`).

**Must not appear on our page:** the street address and phone number. The 2026-09-20 plan held
both back as possibly residential, owner decision (`audit-2026-09-20/ACTION-PLAN.md:298-304`),
**yet the generated `/llms.txt` serves them live** (`$SCRATCH/hb/llms.txt.html` lines 145–146;
emitted by `deploy/llms_txt_deploy.py:296-298`). See *Notes for the user*. Also never print the
two customer first names in the unlisted bespoke-order handles (`ACTION-PLAN.md:39-40,48-50`).

---

## Stack (verified)

| Component | Observed | Where |
| --- | --- | --- |
| Platform | Shopify, **Horizon 3.5.1** (`theme_store_id` 2481, theme id `135109967969`, role `main`) | `grep -o 'Shopify.theme = {[^}]*}' $SCRATCH/hb/home.html` |
| Our tooling | **21 Python scripts** in `deploy/` (3,969 lines) calling the **Shopify Admin GraphQL API** (`API = "2025-07"` in `shopify_deploy.py:21`, `"2025-10"` in `phase1_20260920.py:18`) via `curl` subprocesses, authenticated by the OAuth `client_credentials` grant (`shopify_deploy.py:36-38`). Every script is dry-run by default, `--apply` to send, with a rollback command | `wc -l deploy/*.py`; script docstrings |
| Audit trail | **114** JSONL logs, **524** logged mutations, each record holds the query, variables and response; **5** carried `userErrors` (listed below). **146** backup snapshots in `deploy/backup/`, theme originals in `deploy/theme_backup/` | the log census (Python over `deploy/log/*.jsonl`) |
| Theme edits | **36** theme files written through `themeFilesUpsert` (templates, sections, snippets, blocks, `layout/theme.liquid`, `config/settings_data.json`, and four new snippets `hb-product-jsonld`, `hb-breadcrumbs`, `hb-article-jsonld`, `hb-blog-jsonld`, plus `templates/llms.txt.liquid`) | same census |
| Research data | DataForSEO REST API (keyword volumes, SERPs, competitor domains, ChatGPT visibility); **$1.42** for 56 calls on 09-16 | `KEYWORD-RESEARCH-AND-PAGE-PLAN.md:3`; `evidence/dataforseo/` |
| Measurement | Local Lighthouse 13.4.1 (mobile) JSONs; Google Search Console CSV exports (one, pre-work); Playwright lab CWV on 09-20 | `evidence/*.json`, `evidence/gsc/`, `audit-2026-09-20/raw/playwright_cwv_*.json` |
| Apps seen live (client's) | **Judge.me** reviews widget on product pages, "No reviews" (177 `jdgm` hits in `products_rana.html`) | `grep -o 'jdgm' … \| wc -l` |

No test suite; nothing here is a claim about tests.

---

## (a) Deployed — and what is live today

Each row: what the log proves was sent, then the 2026-09-25 check.

| # | Work (log evidence) | Live 2026-09-25 |
| --- | --- | --- |
| 1 | **Homepage title + meta + H1.** Before: `<title>Halal Bridal</title>` (12 chars), no meta description, H1 "Made for your most beautiful moments" (`FULL-AUDIT-REPORT.md:38,53,58`; original `theme_backup/templates__index.json`). `templates/index.json` upserted 9× 09-17→09-18 | **Verified.** Title `Modest Halal Wedding Dresses, Made to Measure \| Halal Bridal` (60); description 148 chars; one H1 `Modest wedding dresses, made for your most beautiful moments`; og:image present; the 368-word section "Wedding dresses made for the hijabi bride, not altered for her" (`deploy/content/homepage-section.html`) renders, with "Halal Bridal was founded by Sarah Aktim…" |
| 2 | **All 33 product SEO titles + metas** (`productUpdate` with `seo` on **33** distinct product ids; titles in `deploy/phase1_titles.json`) | **Verified 33/33:** every title ≤60 chars and ends `\| Halal Bridal`; 33/33 have a 1–160-char description; **30/33** carry Muslim/Hijab/Nikkah/Arabic — the 3 others (Beyda, Dua, Safa) were written as henna/evening gowns on purpose (`phase1_titles.json:96-107`) |
| 3 | **Product H1 = descriptive title.** A text block rendering `product.metafields.global.title_tag \| remove: ' \| Halal Bridal'` (`deploy/log/20260918-160358.jsonl`, `templates/product.json`) | **Verified 33/33** exactly one H1, e.g. `Rana Muslim Nikkah & Engagement Dress` (was the bare first name, `audit-2026-09-18/AUDIT-COMPARISON.md:28`) |
| 4 | **Product descriptions rewritten** (`descriptionHtml` on **32** distinct products, runs `20260918-005132`, `-124339`, `-144037`) | Live on `/products/rana` ("The details" H2 + Coverage/Silhouette/Fabric/Colour, see shot). Word counts from the 09-20 Admin snapshot: **31 of 33** active products ≥200 words (min Amal 164, Shamaal 176; max Rana 337) — *not* "all 33" as `COMPETITOR-ANALYSIS…md:258` says |
| 5 | **Two mislabeled handles fixed with 301s** (`sara`→`amsah`, `safiya`→`izza`, `redirectNewHandle: true`, `deploy/log/20260917-222253.jsonl`) — both were top-impression URLs (`FULL-AUDIT-REPORT.md:59,85`) | **Verified:** `/products/sara` 301 → `/products/amsah`; `/products/safiya` 301 → `/products/izza` |
| 6 | **Media alt text** (`productUpdateMedia`, 32 calls over **31** products) | Not re-counted; the 09-20 audit measured 2,489 images at 100% alt coverage (`audit-2026-09-20/FULL-AUDIT-REPORT.md:72`) |
| 7 | **8 collections created** — `muslim-wedding-dresses`, `hijab-wedding-dresses`, `nikkah-dresses`, `cape-wedding-dresses`, `high-neck-long-sleeve-wedding-dresses`, `red-wedding-dresses` (09-17 22:23), `arabic-wedding-dresses` (09-18 02:24), and a real `all` collection so `/collections/all` could carry its own copy; `henna-night` and `frontpage` rebuilt (11 collections updated in total) | **Verified:** collection sitemap lists **10** (was 2, `FULL-AUDIT-REPORT.md:80`); CollectionPage + ItemList + BreadcrumbList on 10/10. **But see regressions R1–R3** |
| 8 | **Collection long-form copy** (Muslim 529→1,405 words, Hijab 469→1,243, Arabic 884; `COMPETITOR-ANALYSIS…md:222-223,233`; sources `deploy/content/*.html`) | **NOT live** — R2 |
| 9 | **"Shop by style" internal-link strip** on collections and products (`deploy/content/shop-by-style.liquid`) | **Verified** on 10/10 collections and `/products/rana` |
| 10 | **Landing page `/pages/custom-wedding-dress`** (`pageCreate`, `deploy/log/20260917-222406.jsonl`) | **Verified:** H1 `A custom wedding dress, made to your measurements, no fitting appointment`, title `Custom Wedding Dresses, Made to Measure \| Halal Bridal`, ~950 words in `<main>` |
| 11 | **Page titles/metas and H1s** on About, FAQ, Shipping & Returns, Measuring Guide (`metafieldsSet` global title/description tags; page templates upserted). Before: "TBD" placeholders live, no H1 on four pages (`FULL-AUDIT-REPORT.md:54,57`) | **Verified:** About `About Halal Bridal: Modest Wedding Dresses Made to Measure`; FAQ `FAQ: Ordering, Shipping & Fit \| Halal Bridal`; Shipping `Shipping, Production Times & Returns \| Halal Bridal`; each has one H1 and a meta. No "TBD" on any fetched page |
| 12 | **18 blog posts written, 17 published** (`articleCreate` ×18, runs `20260918-010319` → `-191236`); the prom post is held unpublished until mid-December (`ACTION-PLAN.md:43`) | **Verified:** blog sitemap 19 URLs = index + the pre-existing June post + **17** new; `modest-prom-dresses-for-hijabis` → **404** (held). All 18 live posts: one H1, a meta ≤160, og:image, `Article` + `Person` + `BreadcrumbList`, byline "Sarah Aktim". The 09-20 audit: "19 posts averaging around 1,600 words" (`FULL-AUDIT-REPORT.md:75`) |
| 13 | **E-E-A-T:** founder named on About (`ProfilePage` + `Person` `@id …/pages/about-us#sarah-aktim`), author box on every post, `Organization.founder` → same `@id` (`deploy/eeat_deploy.py`, run `20260918-141826`) | **Verified:** "MY PERSONAL STORY: SARAH AKTIM, FOUNDER" on About; the Person `@id` referenced on posts; ProfilePage on About |
| 14 | **Sitewide Organization + WebSite.** Before: Organization `{name, logo, url}` only, no WebSite (`FULL-AUDIT-REPORT.md:70`). `sections/header.liquid` upserted 6× | **Verified:** `@id https://halalbridal.com/#organization`, description "Ships to 19 countries…", `founder`, `email`, `contactPoint`, 3 `sameAs`; `WebSite` + `SearchAction` on `/` |
| 15 | **Product JSON-LD rebuilt** in `snippets/hb-product-jsonld.liquid` (5 upserts 09-18 → 09-20): two `OfferShippingDetails` (US free, 18 paid), `MerchantReturnPolicy`, `handlingTime` 56–70 days (was 40–50, contradicting the page's "8 to 10 weeks", `audit-2026-09-20/FULL-AUDIT-REPORT.md:53`), `mpn`, `priceValidUntil` | **Verified 33/33:** Product + Offer + 2 × OfferShippingDetails + MerchantReturnPolicy + 19 DefinedRegion, handling 56–70, `mpn` (e.g. `RNA-001`), `priceValidUntil` 2027-09-25 (rolling) |
| 16 | **BreadcrumbList everywhere**, one snippet `snippets/hb-breadcrumbs.liquid` rendered by every template (27 extra URLs, `ACTION-PLAN.md:163,170-190`) | **Verified** on 33/33 products, 18/18 posts, 10/10 collections, the blog index, About, Contact, Custom, FAQ, Shipping — visible trail too (see shots) |
| 17 | **FAQPage** on `/pages/faq` built from the accordion rows (`deploy/faq_schema.py`, 09-18 17:52) | **Verified:** FAQPage with **6** Question/Answer. Note: the 09-16 plan said *not* to add it (`ACTION-PLAN.md:64`) — reversed without a recorded reason |
| 18 | **Curated `/llms.txt`** via `templates/llms.txt.liquid`, generated from live Admin data by `deploy/llms_txt_deploy.py` (`ACTION-PLAN.md:164,192-225`) | **Verified:** 200, **155 lines**, "33 gowns, 450 to 2,800 USD", the 19-country list, a line per gown. Also serves the address/phone (see above) |
| 19 | **Shipping expansion: 4 → 19 countries** (`marketUpdate` + `deliveryProfileUpdate`, `phase1-20260920-173855.jsonl`); an accidental 0 USD rate to Germany corrected (`ACTION-PLAN.md:94-110`); schema synced from the live profile (`deploy/schema_shipping_sync.py`) | **Verified** as schema and copy: 19 DefinedRegion on every product, 19 countries in llms.txt and Organization. The checkout gate itself (`shop.shipsToCountries`) is Admin-only |
| 20 | **Store policies** (Shipping, Refund, Contact) via `shopPolicyUpdate` ×3 (`20260918-145547`) | Not re-fetched; `/policies/*` are listed in llms.txt |
| 21 | **Merchant Center identifier exemption** `mm-google-shopping.custom_product = true` on **33/33** (`phase1-20260920-162435.jsonl`, 33 metafields returned) | Admin-only; not visible on the storefront |
| 22 | **Footer menu fix** (Shopify withheld the privacy link; item changed PAGE → HTTP, `phase1-20260920-181954.jsonl`, `ACTION-PLAN.md:278-289`) | Not re-checked |
| 23 | **Collection LCP fix** in `snippets/card-gallery.liquid` (eager images 24 → 4) | Consistent live: 2 of 96 `<img>` eager on `/collections/muslim-wedding-dresses`. Lab result in *Measured numbers* |
| 24 | **Taxonomy metafields** (`color-pattern`, `age-group`, `target-gender`, `neckline`… to 33/33; `ACTION-PLAN.md:229-233,320-331`); 7 `metaobjectCreate` logged | **Not verifiable from here.** `taxonomy_fill.py` sends its writes without the shared logger (`taxonomy_fill.py:189`); the only logged batch (`phase1-20260920-180456.jsonl`, 25 values) returned 0 written and 4 errors. The plan's counts are the only source |

**The five logged `userErrors`:** a `sections/header.liquid` upsert rejected
(`20260917-234340`); two `templates/product.json` upserts rejected for a Liquid filter in a
dynamic source (`20260918-160304`, `-160325`, fixed at `-160358`); the taxonomy batch above; one
`metaobjectCreate` with a wrong field name (`phase1-20260920-182320`, retried OK at `-182359`).

### Regressions observed live on 2026-09-25 (the store has moved since 09-20)

- **R1 — no H1 on any of the 10 collections.** Live markup is `<h2>Muslim Wedding Dresses</h2>`
  (`grep -c '<h1' $SCRATCH/hb/collections_*.html` → 0 × 10; the rendered DOM agrees:
  `document.querySelectorAll('h1').length` → 0). Our last push of `templates/collection.json`
  (`phase1-20260920-175547.jsonl`, 09-20 17:55 EDT) contains `<h1>{{ collection.title }}</h1>`,
  and the plan recorded "verified live: all 10" (`ACTION-PLAN.md:24`). The template changed
  after that, not through our logs — most likely a theme-editor save.
- **R2 — the long-form collection copy does not render on any of the 10 collections.** After
  the last product card there are 4 words ("Create your custom dress") before the Shop-by-style
  strip; "A wedding dress you don't have to fix" and the other deployed H2s are absent from the
  served HTML, page 2, and the scrolled, rendered DOM. The copy still exists in Shopify — its
  first sentence is the `CollectionPage.description` in the JSON-LD — it is just not rendered.
  The 09-20 audit saw it rendered below the grid (`audit-2026-09-20/FULL-AUDIT-REPORT.md:50`).
  Same probable cause as R1.
- **R3 — five collection SEO titles fell back to the default `<Name> – Halal Bridal`:** `all`,
  `frontpage`, `muslim-wedding-dresses`, `nikkah-dresses`, `cape-wedding-dresses` (e.g. `Muslim
  Wedding Dresses – Halal Bridal`, 37 chars; the 09-20 snapshot had `Muslim Wedding Dresses, Made
  to Measure | Halal Bridal`, `audit-2026-09-20/shopify/collections.json`). These are **exactly
  the five collections our own `deploy/collection_meta_ship.py` updated at 09-20 18:25–18:27**
  with `seo: {description}` and no `title` (`phase1-20260920-182543.jsonl`,
  `-182716.jsonl`; `collection_meta_ship.py:85`). The other five, not touched by that run, keep
  their titles. Inference, strong: sending `seo` without `title` cleared it. Their new meta
  descriptions are live.

None of R1–R3 is fixable from this task (read-only). The case study must not show a collection
H1, a collection's long-form copy, or those five titles as live until they are restored.

---

## (b) Recommended only — not done

From the three audits' plans, still open on 2026-09-25:

- **Blog index meta description** — the one page missing one (`audit-2026-09-20/FULL-AUDIT-REPORT.md:61`); live: none.
- **Contact page** — 25-char default title `Contact Us – Halal Bridal`, auto meta, 81 words (live); phone/address on the page (`ACTION-PLAN.md:378`).
- **Duties / import VAT disclosure** on `/pages/shipping-returns` and near price — "urgent" since 15 new countries went live on DAP terms (`ACTION-PLAN.md:118-127`); `grep -i duties pages_shipping-returns.html` → nothing.
- **Shipping copy now understates 19 countries:** `/pages/shipping-returns` meta "we also ship to Canada", `/pages/custom-wedding-dress` and FAQ metas "US or Canada", About "in the US and Canada" (live metas above; `ACTION-PLAN.md:129-134`).
- **Reviews** — Judge.me is now installed (client's action) but shows "No reviews"; seeding with past brides is the client's (`COMPETITOR-ANALYSIS…md:179,227,305`).
- **Link building** (weddings blogs, photographers, directories, Pinterest, Reddit, YouTube; target 20–30 clean referring domains by March 2027, `COMPETITOR-ANALYSIS…md:191-204`) — none started in the workspace.
- **GSC indexing requests** for the new URLs — no Search Console credentials (`COMPETITOR-ANALYSIS…md:218`).
- **Performance:** product-page mobile LCP still poor in the 09-20 lab (Aleena 6.9 s, `audit-2026-09-20/FULL-AUDIT-REPORT.md:196`); measurement-guide images and render-blocking CSS (`AUDIT-COMPARISON.md:45`).
- **International shipping content**, Canada duties (`audit-2026-09-20/FULL-AUDIT-REPORT.md:178`); EU/UK 14-day cancellation for Ready-to-Ship items (`ACTION-PLAN.md:136-145`).
- **Blog ideas not written:** Tier 3 of `BLOG-IDEAS-2026-09-18.md:178-202` (Arab bridal traditions, Turkish dresses, dress code update, how many dresses) has no matching post in the live sitemap.

## (c) Owner questions pending

1. **Publish the address and phone?** Held for schema and the contact page as possibly residential (`ACTION-PLAN.md:298-304`), though llms.txt already serves them.
2. **Fabric fibre and bead material** per gown — Shopify's Fabric list has no chiffon/lace/tulle, so 22 of 33 gowns stay blank rather than guessed (`audit-2026-09-20/TAXONOMY-OWNER-QUESTIONS.md`; `ACTION-PLAN.md:239-247`).
3. **Recategorise `beyda` and `bushra`** out of "Abayas & Jilbabs" (blocks four attributes and misroutes them in the Google channel, `ACTION-PLAN.md:249-258,331-333`).
4. **The fit remedy** for a made-to-measure gown that does not fit (`ACTION-PLAN.md:16`).
5. **The five unlisted products** — left alone on the owner's call; rename the two bespoke-order handles; SEO for Layla/Huda/prom before launch (`ACTION-PLAN.md:35-53`).
6. **Past brides** for real-wedding features and photographer credits; **reviews consent** (`COMPETITOR-ANALYSIS…md:302-306`).
7. **Terms of service** policy (`COMPETITOR-ANALYSIS…md:266`).
8. **"Prices exclude import duties"** — the one line in llms.txt that says it needs the owner's confirmation (`ACTION-PLAN.md:221-225`).

---

## Architecture decisions (what the page can argue, each with evidence)

**1. Everything through the Admin API, logged and reversible.** 524 mutations across 114 logs,
each with its response; dry-run by default; per-run backups and rollback commands
(`python3 deploy/phase1_deploy.py rollback deploy/backup/<run>`, `COMPETITOR-ANALYSIS…md:268`).
That is also what lets this dossier say, with a log line, which regression is ours (R3) and
which is not (R1, R2).

**2. Pages built for search demand, not a guess list.** The 09-16 plan's collection ideas were
replaced by a DataForSEO-validated set (`ACTION-PLAN.md:41`; `KEYWORD-RESEARCH-AND-PAGE-PLAN.md`
§2): e.g. `muslim wedding dress` group 4,400/mo US, `arabic wedding dress` 2,900
(`KEYWORD-RESEARCH…md` §1). The store went from 2 collections to 10, and from 1 blog post to 19.

**3. One source of truth per structured-data type.** Product, breadcrumb, article and blog
JSON-LD each live in one `hb-*` snippet; breadcrumbs replaced two copy-pasted blocks
(`ACTION-PLAN.md:177-182`). Shipping schema is regenerated from the live delivery profile so it
cannot drift from checkout (`ACTION-PLAN.md:112-116`); llms.txt is regenerated from live data
because Liquid in that context cannot read collections or policies (`ACTION-PLAN.md:200-210`).

**4. Nothing invented into the feed or the schema.** Taxonomy values only where the product's
own copy states them, the quoting phrase recorded (`ACTION-PLAN.md:235-237`); handling time
converted literally (56–70 calendar days) rather than 40–50 "business" days
(`ACTION-PLAN.md:147-154`); a free-shipping rate *not* extended to paid countries
(`ACTION-PLAN.md:72-74`); address/phone kept out of schema pending the owner.

**5. Found real business defects while doing SEO.** Germany was shipping free by accident
(`ACTION-PLAN.md:94-97`); "junk" unlisted products turned out to be two customer order records
and three real gowns — deletion cancelled (`ACTION-PLAN.md:33-46`); Beyda and Bushra are
miscategorised as abayas (`ACTION-PLAN.md:252-256`).

---

## Audience, objection, primary action

Per `.agents/product-marketing.md:61-66` (§2), closest to segment 1 — a small business owner who
is "not software people" and wants a site that "works, ranks" — though this one sells online
only, not locally. A single-brand, made-to-order bridal store with 33 gowns at $450–$2,800
(llms.txt live). The
objection: *"SEO is a black box — what did you actually change?"* The page answers with the
before/after of things a reader can open: the homepage title (12 chars → a keyword title), 2 →
10 collections, 1 → 19 posts, a founder with a name, schema on every page type, a curated
llms.txt. **It must not** claim traffic, rankings, sales or AI citations as results (none were
measured after the work); show a collection H1 or long-form copy as live (R1, R2); print the
address or phone; restate the client's prices or timelines as ours.

---

## Measured numbers (with date and source)

| Number | Date | Source | Usable as an outcome? |
| --- | --- | --- | --- |
| GSC: 286 clicks / 897 impressions, avg pos 3.9; "halal bridal" 93 clicks; "halal wedding dress" 1 click / 60 impr / pos 6.05 | 2026-06-15 → 09-14 | `evidence/gsc/Chart.csv` (92 rows, sums 286/897), `Queries.csv`; `FULL-AUDIT-REPORT.md:20,163` | **No — baseline only.** Ends 3 days before the first write. No later export exists |
| Rank tracker: halalbridal.com in the top 100 for **0 of 38** tracked SERPs | 2026-09-18 (one run) | `evidence/dataforseo/rank_history.csv` (38 rows, 1 date, `halalbridal.com` column empty on all) | No — baseline, one run |
| ChatGPT (gpt-4o-mini web search) already cites halalbridal.com for hijab-wedding-dress prompts | 2026-09-16 | `evidence/dataforseo/chatgpt_visibility.json` | **No — pre-work** |
| Lighthouse mobile, `/collections/muslim-wedding-dresses`: perf **61 → 81**, LCP **12.9 s → 4.4 s**, weight **4.49 MB → 2.72 MB** | 2026-09-18 05:51 → 06:13 UTC | `evidence/lh-collections_muslim-wedding-dresses-mobile-0918.json` → `evidence/lh-collection-mobile-after.json` (fetchTime fields) | **Yes, as a lab result**, one run each side, around the card-gallery change. Note R2 has since shortened this page, so today's number would differ |
| Lighthouse mobile, `/`: perf 66, LCP 6.6 s | 2026-09-16 21:03 UTC | `evidence/lighthouse-mobile.json` | Baseline |
| Lighthouse mobile, `/`: perf 89, LCP 3.5 s | 2026-09-18 05:51 UTC | `evidence/lh-home-mobile-0918.json` | Not attributable — no home-performance change is logged between the two runs; lab variance |
| Audit health score 45 (09-16) → 60 / 69 (09-18, two tools) → 69 (09-20) | as dated | `FULL-AUDIT-REPORT.md:19`; `AUDIT-COMPARISON.md:8`; `audit-2026-09-20/FULL-AUDIT-REPORT.md:29` | **No** — our own audit tools, different rubrics ("run fresh", `audit-2026-09-20/FULL-AUDIT-REPORT.md:9`) |

**Time since deploy:** 5–8 days. Rank and click changes on a young domain (registered
2026-05-10, `AUDIT-COMPARISON.md:66`) are not expected to be measurable yet; the plan's own
re-measure date is **2026-12-15** (`ACTION-PLAN.md` 09-16, line 72).

## Verifiable counts (for the page)

| Count | Proof |
| --- | --- |
| **33/33** product titles + metas rewritten; 33/33 live ≤60 chars | log census (33 ids with `seo`); `$SCRATCH/hb/all/p_*.html` parse |
| **2 → 10** collections (8 created) | `FULL-AUDIT-REPORT.md:80`; live collection sitemap 10 `<url>` |
| **17** new posts live (+1 held), **19** URLs in the blog sitemap | `articleCreate` ×18; `sitemap_blogs_1.xml` 19 `<url>` |
| **1** new landing page | `pageCreate` ×1 |
| **36** theme files edited | `themeFilesUpsert` census |
| **2** handles renamed with 301s | curl `-w '%{redirect_url}'` |
| **19** ship-to countries (from 4) | `ACTION-PLAN.md:110`; 19 DefinedRegion on 33/33 products |
| Schema types live: Organization(@id) + WebSite/SearchAction; Product/Offer/OfferShippingDetails/MerchantReturnPolicy (33/33); BreadcrumbList (all page types); CollectionPage/ItemList (10/10); Article/Person (18/18); ProfilePage; FAQPage | JSON-LD `@type` census over the saved HTML |
| llms.txt **155** lines | `wc -l $SCRATCH/hb/llms.txt.html` |
| **524** logged mutations, **114** logs, **5** with userErrors | log census |

(Blog sitemap: the 19 URLs are the blog index, the June post and the 17 new ones; the prom
post is not listed.)

---

## Unverifiable claims

For the user; **not written on the page.**

1. **Any SEO outcome** — clicks, impressions, rankings, CTR, traffic, sales — after the work.
   No post-deploy GSC, GA4 or rank data exists in the workspace.
2. **ChatGPT citation as a result** — it predates the work (09-16).
3. **Taxonomy metafield coverage** (33/33 colour, gender, age group…) — written by an
   unlogged path; Admin-only.
4. **Merchant Center effect** of `custom_product` — the flag is set (logged); approval status is
   not visible.
5. **Checkout accepts 19 countries** — `shop.shipsToCountries` is Admin-only; the logged
   market/profile updates and the schema agree with it, but a checkout was not attempted.
6. **Who changed `templates/collection.json` after 09-20** (R1, R2).
7. **Copy facts inferred from photos** — the 09-18 product rewrites added "visual details …
   only from the product photos" (`COMPETITOR-ANALYSIS…md:225,258`); the client confirmed
   lining/hijab only for Bushra, Safa, Rana (`:242`).
8. **The cost-guide's boutique/couture ranges** are hedged estimates (`COMPETITOR-ANALYSIS…md:235`).
9. **"Halal Bridal is already cited by ChatGPT"** and the competitor figures (camillasbridal
   traffic −62%) are third-party estimates (DataForSEO), not the client's.

---

## Shot list

Captured 2026-09-25 ~19:27 UTC with Playwright (`channel: 'chrome'`), deviceScaleFactor 1,
`reducedMotion: 'reduce'`, after `document.fonts.ready`, a scroll nudge, an in-viewport image
wait and an Escape press, into
`$SCRATCH/halalbridal-shots/` (script `$SCRATCH/shoot.mjs`). **No popup, cookie banner or chat
widget** appeared; the only fixed/sticky elements are Horizon's sticky header (122 px) and, on
products, the sticky gallery/info columns. All shots are **real live pages**, none are audit
charts.

| File | Size (`sips`) | Route | Shows / evidence for |
| --- | --- | --- | --- |
| `halalbridal-cover.jpg` | 1200×750 | `/` | **Cover.** Announcement bar, header, the hero H1 we rewrote ("Modest wedding dresses, made for your most beautiful moments"), subline, SHOP COLLECTION. Hero photo is the client's |
| `halalbridal-home.jpg` | 1600×1000 | `/` | Same, in-page size |
| `halalbridal-collection-muslim.jpg` | 1600×1000 | `/collections/muslim-wedding-dresses` | Breadcrumb trail (ours), collection title (rendered as H2 today, R1), "32 items", first row of gowns. Use for "a collection per search cluster"; do **not** caption it with its copy (R2) |
| `halalbridal-product-rana.jpg` | 1600×1000 | `/products/rana` | Breadcrumb, descriptive H1 `Rana Muslim Nikkah & Engagement Dress`, $499, rewritten description with "The details" list. Shows the client's Judge.me "No reviews" line under the price — crop or accept |
| `halalbridal-post-walima.jpg` | 1600×1000 | `/blogs/…/walima-dress-guide` | Breadcrumb, H1, byline "September 18, 2026 \| Sarah Aktim", answer-first opening and H2 "What is a walima dress?" |
| `halalbridal-custom-wedding-dress.jpg` | 1600×1000 | `/pages/custom-wedding-dress` | The landing page we created: breadcrumb "Custom Wedding Dress", H1, lead, two CTAs |
| `halalbridal-journal.jpg` | 1600×1000 | `/blogs/the-journal-modest-bridalwear` | Blog index with featured post "Modest Evening Gowns With Sleeves…" (ours) |

Existing images in the workspace (`audit-2026-09-20/screenshots/`, 24 PNGs captured
2026-09-20 14:05–14:09): desktop folds **1440×900**, desktop full pages 1440×3,195–9,386,
mobile **780×1688** folds and 780×8,942–25,782 full pages, of home, Muslim and Red collections,
Aleena and Rana products, and the hijab-styles post. Real live pages, but not the site's
1200×750 / 1600×1000 sizes, and they predate R1–R3 (the 09-20 collection shots show the H1
state of that afternoon, before the H1 fix at 16:24 EDT). No audit charts exist as images
(the PDF/HTML reports are not screenshot material).

---

## Notes for the user (nothing applied)

- **Address and phone are public via our llms.txt** (`/llms.txt` lines 145–146), contradicting
  the hold in `ACTION-PLAN.md:298-304`. If the owner has not approved publishing them, remove the
  Contact block's two lines in `deploy/llms_txt_deploy.py:296-298` and redeploy. Also note the
  prose line "The studio is in Shelton, Connecticut" (llms.txt line 11).
- **R3 is very likely our own script.** Re-sending the five SEO titles from
  `audit-2026-09-20/shopify/collections.json` together with the descriptions would restore them.
- **R1/R2** need a look at the theme editor history for `templates/collection.json` after
  2026-09-20 17:55 EDT; our last pushed version is `deploy/theme_backup/20260920-175547__templates__collection.json`.
- **FAQPage** was added against the 09-16 "Do NOT do" list (`ACTION-PLAN.md:64`); harmless, but
  it will not produce rich results for a store, per that same note.
- **Product-description count:** the status log says all 33 are over 200 words
  (`COMPETITOR-ANALYSIS…md:258`); the 09-20 Admin snapshot says 31 (Amal 164, Shamaal 176).
- **A page for this project** would need: a `PORTFOLIO_PROJECTS` entry in
  `src/components/site/work/content.ts`, a `src/app/work/<slug>/page.tsx` and `content.ts`, a
  home/services tile if wanted, a `public/llms.txt` line, and the three hand-maintained project
  counts (see memory "NeuraGul port: scope & decisions"). Service fit: SEO / web development on
  Shopify — no Shopify storefront *build* was done here; the theme is the client's Horizon.

---

## Cross-page deltas

Page built 2026-09-25 at `/work/halal-bridal/` (`src/app/work/halal-bridal/page.tsx`,
`src/components/site/work/halal-bridal/content.ts`). Images: `public/site/images/halalbridal.jpg`
(cover, 1200×750), `halalbridal-collection-muslim.jpg`, `halalbridal-custom-wedding-dress.jpg`,
`halalbridal-journal.jpg` (1600×1000). Rana product (shows "No reviews") and walima post (byline
names the founder) were not used. For the owners of the shared files to apply:

- **`/work/` card (`src/components/site/work/content.ts`)** — title `Halal Bridal`; href
  `/work/halal-bridal/`; location `2026 · Shopify SEO`; services `SEO`; image
  `/site/images/halalbridal.jpg` (1200×750); alt: `The Halal Bridal home page: the headline
  Modest wedding dresses, made for your most beautiful moments, beside a bride in a white
  hijab and veil.`
- **`public/llms.txt` line** — `[Halal Bridal](https://neuragul.com/work/halal-bridal/): SEO for
  a made-to-measure Shopify bridal store — 33 product titles rewritten, collections from 2 to
  10, 17 new posts and structured data on every page type, shipped as 524 logged Admin API
  changes.`
- **SEO service page summary** — `For Halal Bridal, a Shopify store selling made-to-measure
  modest wedding dresses, we rewrote all 33 product titles, grew its collections from 2 to 10,
  published 17 posts and added structured data to every page type.`

Also remember the three hand-maintained project counts (memory "NeuraGul port: scope &
decisions") and the sitemap entry.
