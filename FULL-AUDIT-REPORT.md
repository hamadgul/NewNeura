# SEO Audit — neuragul.com

**Audited:** 2026-09-05 · **Scope:** all 23 routes in the sitemap, crawled live
**Served host:** `https://www.neuragul.com` · **Declared host:** `https://neuragul.com`

## Health Score: 74 / 100 — Good

| Category | Weight | Score | Notes |
|---|---|---|---|
| Technical SEO | 25% | 62 | Canonical/host split on 23/23 routes; no cache policy |
| Content Quality | 20% | 78 | Strong distinctive copy; 6 thin case-study pages |
| On-Page SEO | 15% | 92 | Titles, descriptions, H1s essentially perfect |
| Schema / Structured Data | 15% | 88 | Correct types, `@id` graph; wrong host in URLs |
| Performance (CWV) | 10% | 40 | 33 MB autoplay hero video, no browser caching |
| Image Optimization | 10% | 70 | Excellent delivery, no descriptive alt text |
| AI Search Readiness (GEO) | 5% | 92 | `llms.txt` present and genuinely well-written |

The on-page and structured-data work on this site is better than most professional
builds. The score is held down by two systemic issues — a host mismatch and an
unoptimized hero video — both of which are narrow, mechanical fixes rather than
content or architecture problems.

---

## 🔴 Critical

### 1. Every canonical, sitemap entry and schema `@id` points at a host that redirects

**Evidence.** `https://neuragul.com` returns `308 → https://www.neuragul.com/`. Yet:

| Signal | Value | Served from |
|---|---|---|
| `<link rel="canonical">` | `https://neuragul.com/` | `https://www.neuragul.com/` |
| `og:url` | `https://neuragul.com/` | same |
| `sitemap.xml` `<loc>` × 23 | `https://neuragul.com/...` | same |
| `robots.txt` `Sitemap:` | `https://neuragul.com/sitemap.xml` | same |
| JSON-LD `@id` / `url` | `https://neuragul.com/#organization` | same |
| `metadataBase` (`layout.tsx:32`) | `https://neuragul.com` | same |

Verified on **23 of 23 routes** — not one page has a self-referential canonical.

**Impact.** Google is being handed a sitemap where all 23 URLs are redirects, and
every page declares a canonical that is not the URL it was served from. Google
usually resolves this by following the 308 and picking www, but that means the
canonical tag is being *overridden* rather than obeyed — you lose deterministic
control of which host accumulates authority, every crawl of the sitemap costs an
extra hop, and the `sameAs`/`@id` entity graph anchors to a URL that never serves
a 200. This is also why the Google Business Profile link and the site can fail to
consolidate into one entity.

**Fix (recommended).** Make the apex the primary domain in Vercel → Project →
Domains, so `www.neuragul.com` 308s to `neuragul.com` instead of the reverse.
Zero code changes: all 26 source files, the sitemap, robots.txt, `llms.txt` and
the JSON-LD already say apex. This is a one-click change and it makes every
existing signal correct at once.

**Fix (alternative).** If www must stay primary, change `SITE_URL` in
`src/lib/seo.ts:29` *and* `metadataBase` in `src/app/layout.tsx:32` — but note
the origin is **hardcoded in 26 files**, not read from `SITE_URL`, so this path
requires editing all of them (see Warning 4).

---

## ⚠️ Warnings

### 2. The homepage ships a 33 MB autoplaying video

**Evidence.**

```
/site/videos/office.mp4   content-length: 33,204,843  (31.7 MB)
<video src="/site/videos/office.mp4" poster="/site/videos/office-poster.jpg"
       autoplay muted loop playsinline>   ← no preload attribute
```

Total homepage subresource weight: **33.77 MB across 22 files.** The video is
**96%** of it. Everything else is well-built — the largest image is 119 KB, total
JS is ~660 KB.

**Impact.** `autoplay` instructs the browser to begin downloading immediately, on
mobile data, for a decorative background sitting at `-z-[2]` behind the hero text.
It competes directly with the LCP image for bandwidth. `office.mp4` is 32 MB while
the site's three other videos (`hero.mp4`, `nyff-hero.mp4`, `nymm-hero.mp4`) are
1.0–1.4 MB each — this one file is an outlier by ~25×, which suggests it was never
compressed rather than that it needs to be large.

**Fix.** Re-encode to the scale of the other three (H.264 CRF 28 + a WebM/AV1
source, target 2–3 MB), and add `preload="none"`. The poster already exists and
already carries the first frame, so nothing regresses visually while it loads.

### 3. No cache policy on `/public` assets or `next/image`

**Evidence.**

```
/_next/static/...css          cache-control: public,max-age=31536000,immutable   ✅
/site/videos/office.mp4       cache-control: public, max-age=0, must-revalidate  ❌
/site/images/packship.jpg     cache-control: public, max-age=0, must-revalidate  ❌
/_next/image/?url=...         cache-control: public, max-age=0, must-revalidate  ❌
```

`next.config.ts` has no `headers()` block, so only Next's built-in `_next/static`
rule applies. **Impact:** the 33 MB video and every image are revalidated on every
repeat visit and every internal navigation. These are immutable files in `/public`.
**Fix:** add a `headers()` entry for `/site/:path*` with
`public, max-age=31536000, immutable`.

### 4. The canonical origin is hardcoded in 26 files despite `SITE_URL` existing

**Evidence.** `src/lib/seo.ts:29` declares `SITE_URL` as the single source of
truth and `abs()` exists to build absolute URLs from it — but `grep -rn
"https://neuragul.com" src/` returns hits in **26 files**, including every route's
`openGraph.url` (`page.tsx:35`, `contact/page.tsx:29`, `about/page.tsx:32`, all
10 `work/*` pages, all 9 `services/*` pages) and `layout.tsx:32`.

**Impact.** Not a live ranking issue today, but it is the reason Critical #1
cannot be fixed in one line, and it guarantees the next domain change ships a
partial migration where some routes point at one host and some at another. Given
this codebase's history of exactly that failure mode, it is worth closing.

**Fix.** Replace the literals with `abs()` / `SITE_URL`, and set `metadataBase:
new URL(SITE_URL)`.

### 5. Every content image has `alt=""`

**Evidence.** All 16 homepage images carry an explicitly empty alt. The same
pattern holds site-wide (2–5 per page):

```
[EMPTY] /site/images/packship.jpg          ← case-study screenshot
[EMPTY] /site/images/foodtruckrentals.jpg  ← case-study screenshot
[EMPTY] /site/images/vintus.jpg            ← case-study screenshot
[EMPTY] /site/images/about-studio.jpg      ← team/studio photo
[EMPTY] /site/images/footer_image.png      ← decorative (correct as-is)
```

**Impact.** `alt=""` is the correct, deliberate marking for *decorative* images,
and it is right for `footer_image.png`. But the case-study screenshots are the
substantive proof of the work — they are the page's evidence, not ornament. Empty
alt removes them from Google Images entirely, and gives screen-reader users no
access to the portfolio. This looks like a global default applied without
distinguishing the two cases.

**Fix.** Give every `/work/*` project image and `about-studio.jpg` a descriptive
alt naming the project and what is shown. Leave `footer_image.png` empty.

### 6. Six case-study pages are thin

| Page | Words |
|---|---|
| `/work/vintus/` | 217 |
| `/work/landscape-drainage-proz/` | 206 |
| `/work/new-york-fine-foods/` | 227 |
| `/work/restaurant-ordering-portal/` | 228 |
| `/work/rwd-pipeline/` | 228 |
| `/work/` (index) | 197 |

For contrast, the service pages run 726–1,037 words and are genuinely strong.
`/contact/` at 112 words is *not* a defect — that is the right length for a
contact page.

**Impact.** These are the pages that should rank for "[service] for [industry] New
York" long-tail queries and they carry the least substance to do it with. **Fix:**
bring each to ~400–500 words with the problem, the constraint, the approach and
the outcome. The service pages are the model — match their depth.

### 7. Five security headers missing

`Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`,
`Referrer-Policy`, `Permissions-Policy` are all absent. HSTS is present
(`max-age=63072000`) but lacks `includeSubDomains`. Not a direct ranking factor;
it is a trust/quality signal and cheap to fix in the same `headers()` block as #3.

---

## ✅ Passing — do not change

These were checked and are correct. Listing them so they don't get "fixed."

- **Titles** — all 23 between 46 and 56 characters. No truncation, no duplication.
- **Meta descriptions** — all 23 between 127 and 159 characters. All unique.
- **H1** — exactly one per page, all 23 routes.
- **`og:image`** — present on all 23 routes with explicit `width`/`height`. (This
  was a past defect on four routes; it is fixed and has held.)
- **Structured data** — `ProfessionalService` + `WebSite` sitewide, plus
  `BreadcrumbList` and `Service`/`CreativeWork` per route. Correct `@id` graph, no
  fabricated `aggregateRating`. No `FAQPage`, no `HowTo` — both correctly avoided.
- **Image delivery** — 16/16 with `srcset`, 15/16 `loading="lazy"`, the one eager
  image is the LCP image and it is `<link rel="preload">`ed. This is textbook.
- **`trailingSlash: true`** with a sitemap that matches — no redirect hops
  internally.
- **`llms.txt`** — present, 5.5 KB, accurate, well-structured.
- **`robots.txt`** — clean, no accidental blocks. No AI crawler is blocked.
- **HTTPS + HSTS**, single 308 hop, `x-vercel-cache: HIT` on HTML.

---

## Environment Limitations

- **Core Web Vitals field data unavailable.** The PageSpeed Insights API returned
  `429 Rate limited` on two attempts. Per audit policy retries were bounded and
  not repeated. The Performance score above is derived from **directly measured
  transfer sizes and markup**, not from CrUX/Lighthouse — treat the *specific
  findings* (#2, #3) as Confirmed and the *numeric score* as `Likely`.
  To complete: add a `PAGESPEED_API_KEY` and re-run, or read field data in Search
  Console.
- **Google Search Console / GA4 not connected**, so indexation coverage, actual
  impressions and query data were not part of this audit.
- **Google Business Profile** was verified only as far as the `cid` link in
  `seo.ts`; the profile's own website field was not inspected and should be
  checked to match whichever host is chosen in Critical #1.

## Confidence

| Finding | Confidence |
|---|---|
| #1 Canonical/host mismatch | **Confirmed** — 23/23 measured |
| #2 33 MB video | **Confirmed** — `content-length` measured |
| #3 Cache headers | **Confirmed** — headers measured |
| #4 Hardcoded origin ×26 | **Confirmed** — grep |
| #5 Empty alt | **Confirmed** — parsed |
| #6 Thin pages | **Confirmed** — word counts |
| #7 Security headers | **Confirmed** — headers measured |
| Performance *score* | Likely (no field data) |
