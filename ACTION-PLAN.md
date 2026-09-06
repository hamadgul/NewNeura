# SEO Action Plan — neuragul.com

Ordered by impact ÷ effort. Companion to `FULL-AUDIT-REPORT.md`.

---

## Decision needed first

**Which host is canonical — `neuragul.com` or `www.neuragul.com`?**

Today the code says apex and the server says www. Everything in Priority 1 depends
on this answer.

**Recommendation: pick the apex (`neuragul.com`).** All 26 source files, the
sitemap, `robots.txt`, `llms.txt` and the JSON-LD entity graph already declare it.
Choosing apex makes every existing signal correct with a single dashboard change
and no code edit. Choosing www requires editing 26 files and re-submitting the
sitemap.

---

## Priority 1 — This week

### 1.1 Fix the host mismatch · ~5 min · **highest impact**
Vercel → Project → Settings → Domains → set `neuragul.com` as primary so
`www.neuragul.com` redirects to it (currently reversed).

Then verify:
```bash
curl -sI https://www.neuragul.com/ | grep -i location   # expect → https://neuragul.com/
curl -s https://neuragul.com/ | grep -o '<link rel="canonical"[^>]*>'
# canonical must equal the URL that served the page
```
Finally, in Search Console submit `https://neuragul.com/sitemap.xml` and confirm
the Business Profile's website field uses the same host.

### 1.2 Compress the hero video · ~20 min · **largest performance win**
`public/site/videos/office.mp4` is 32 MB. The site's three other hero videos are
1.0–1.4 MB. Target the same range:
```bash
ffmpeg -i public/site/videos/office.mp4 -vcodec libx264 -crf 30 -preset slow \
  -vf "scale=1920:-2" -an -movflags +faststart public/site/videos/office.opt.mp4
```
`-an` drops the audio track — the video is `muted` and looping, so it is dead
weight. Then add `preload="none"` to the `<video>` element; the existing
`office-poster.jpg` covers the load.

### 1.3 Add caching + security headers · ~10 min
One `headers()` block in `next.config.ts` closes both Warning #3 and #7:
```ts
async headers() {
  return [
    { source: "/site/:path*", headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" } ] },
    { source: "/:path*", headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" } ] },
  ];
}
```

---

## Priority 2 — This month

### 2.1 Write real alt text for case-study images · ~45 min
Every content image is currently `alt=""`. Give each `/work/*` project image and
`about-studio.jpg` a description naming the project and what is shown. **Leave
`footer_image.png` as `alt=""`** — it is genuinely decorative and correct today.

### 2.2 Deepen the six thin pages · ~3–4 hrs
`/work/vintus/` (217w), `/work/landscape-drainage-proz/` (206w),
`/work/new-york-fine-foods/` (227w), `/work/restaurant-ordering-portal/` (228w),
`/work/rwd-pipeline/` (228w), `/work/` (197w).

Target ~400–500 words each: the problem, the constraint, the approach, the
outcome. The service pages (726–1,037w) are the model — match their depth and
voice. Do not pad; if a project genuinely has less to say, say less and let the
page be short.

### 2.3 Route every absolute URL through `SITE_URL` · ~1 hr
Replace the hardcoded `https://neuragul.com` in 26 files with `abs()` / `SITE_URL`,
and set `metadataBase: new URL(SITE_URL)` in `layout.tsx`. Prevents the next
domain change from shipping a half-migrated site.
```bash
grep -rn "https://neuragul\.com" src/ | grep -v "^\s*\*"   # should return only seo.ts:29
```

---

## Priority 3 — Backlog

- **Get real CWV data.** Add a PageSpeed API key or read field data in Search
  Console — this audit could not obtain it (rate limited).
- **Connect Search Console + GA4** so the next audit can cover indexation coverage
  and actual query performance rather than on-page signals alone.
- **Add a Content-Security-Policy.** Left out of 1.3 because it needs testing
  against the site's inline styles and video; the other four headers are safe to
  ship immediately.

---

## What NOT to touch

Verified correct — changing these would be a regression:

- Titles (46–56 chars) and meta descriptions (127–159 chars) on all 23 routes
- One H1 per page, all 23 routes
- `og:image` on all 23 routes
- The JSON-LD graph — correct types, correct `@id` reuse, no fabricated ratings,
  no `FAQPage`/`HowTo`
- Image `srcset` / `loading="lazy"` / LCP preload setup
- `trailingSlash: true` and the matching sitemap
- `llms.txt`
- `/contact/` at 112 words — correct length for its purpose
