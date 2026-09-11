# Hasina Hijama Cupping — case-study dossier

Source of record: `~/Projects/Hijama Site` (a literal path with a space; quoted in every
command), read-only for this work; booted from a scratch copy (`rsync -a --exclude .next`
into `$SCRATCH/hijama`). Nothing in this file was taken from memory; every line names the
file or command it came from. HEAD at the time of reading: `bfec627` (2026-08-29, "AI
stuff"), branch `main`, 29 commits since 2026-08-24.

The page it backs: `/work/hasina-hijama-cupping/` —
`src/components/site/work/hasina-hijama-cupping/content.ts` and
`src/app/work/hasina-hijama-cupping/page.tsx`.

**Why a copy, not the repo.** This Next version (16.3.2) ships
`node_modules/next/dist/server/lib/generate-agent-files.js`, which rewrites `AGENTS.md` and
`CLAUDE.md` on `next dev`; both files are TRACKED here (`git ls-files`), so a boot in place
could dirty the user's tree. The repo also carries a 535 MB pre-existing `.next`. The copy
booted clean: `AGENTS.md`/`CLAUDE.md` in the copy were byte-identical (md5) before and
after `next dev` because the generator's block was already present, and the original's
`git status --short` was empty before and after with both files' md5 and mtimes unchanged.

**Credentials.** None. The source has no `.env*` file (`find "<repo>" -maxdepth 2 -name
".env*"` → nothing; `.gitignore` lists `.env*` so one could have been invisible to `git
status`, hence the explicit check), and `grep -rn "process.env" app components lib` finds
only `NODE_ENV` in `next.config.ts:33` (dev-vs-prod CSP). Every route renders from constants
in `lib/site.ts` and `lib/schema.ts`. Nothing needed NEEDS_CONTEXT.

---

## Stack (verified)

Read from `package.json` on 2026-09-11. Every version is pinned exactly except the tooling.

| Package | Declared | What it does here |
| --- | --- | --- |
| `next` | 16.3.2 (pinned; installed 16.3.2 per `node_modules/next/package.json`) | App Router, ten static routes (`app/page.tsx` + nine `app/*/page.tsx`), `app/sitemap.ts`, `app/robots.ts`; `turbopack.root` pinned (`next.config.ts:84-86`); one host-based redirect and five security headers (`next.config.ts:148-181`); `images.qualities: [75, 82]` (`:129`) |
| `react`, `react-dom` | 19.2.8 (pinned) | |
| `typescript` | ^5 | strict; `@/` alias (`tsconfig.json`) |
| `eslint`, `eslint-config-next` | ^9, 16.3.2 | |
| `@types/node`, `@types/react`, `@types/react-dom` | ^20, ^19, ^19 | |

That is the whole manifest: **no test runner, no test script** (`scripts`: `dev`, `build`,
`start`, `lint`, `typecheck`), no CSS framework, no animation library, no analytics
dependency, no form backend. Styling is one hand-written stylesheet, `app/globals.css`
(3,036 lines, 116,270 bytes), with a ten-step type scale `--t-3xs` … `--t-3xl`
(`globals.css:88-97`) and zero occurrences of `border-radius` or `box-shadow` outside the
comment that says so (`globals.css:1826-1827`; `grep -c` → 1 each, both in that comment).
Fonts: Newsreader through `next/font/google` at weights 300/400/500 (`app/layout.tsx:15-21`)
and a pre-subset Noto Naskh Arabic through `next/font/local` (`app/fonts/noto-naskh-arabic-ayah.woff2`,
10,136 bytes; `app/layout.tsx:23-41`). Body text is a system sans stack (`README.md:66-69`).

**Deployment** — Vercel: `.gitignore` lists `.vercel`; `next.config.ts:3-13` describes every
route as "static and served from the Vercel edge cache (`x-nextjs-prerender: 1`)", and the
live host returns that header (curl, 2026-09-11). Canonical host
`https://www.hasinahijamacupping.com` (`lib/site.ts:23`); the apex 308s to it (curl, 2026-09-11:
`308 -> https://www.hasinahijamacupping.com/`). The Vercel-side `www` redirect is a dashboard
setting the repo cannot show; the repo's own redirect is the `*.vercel.app` → canonical rule
(`next.config.ts:148-157`), confirmed on the booted copy with a spoofed `Host`.

---

## Architecture decisions

Nine a reader can check rather than an adjective. File references are to the source repo.

**1. Six of the ten pages exist to answer one search each, and the source says which.**
Four pages are the brochure (`/`, `/services`, `/what-is-hijama`, `/about`); the other six
are `/hijama-nyc`, `/cupping-therapy-queens`, `/cupping-therapy-cost`,
`/massage-cupping-and-red-light`, `/cupping-marks-and-bruising` and `/hijama-for-women`
(`app/sitemap.ts:16-28`). Each of the six opens with a header comment naming the query it
answers and why it earned a route: the cost page because "every People-Also-Ask block on
all four local SERPs is cost-led" and its H1 is the question itself (`app/cupping-therapy-cost/page.tsx:10-16, 76-80`);
the marks page because the marks are "the single biggest pre-booking worry people arrive
with" (`cupping-marks-and-bruising/page.tsx:11-16`); the women's page because "hijama near
me female" appears in the related searches of three of the four local results pulled and
"a female practitioner in a partitioned room is the single strongest reason someone picks
this practice" (`hijama-for-women/page.tsx:11-17`); the massage page because it "converts
anyone who cannot or will not have wet cupping" (`massage-cupping-and-red-light/page.tsx:10-15`);
the Queens page as the plain service-in-location page the organic results under the local
pack are made of (`cupping-therapy-queens/page.tsx:11-17`). The six stay out of the header
("five items is already the top of the 4–7 range") and are reached from the footer, the
breadcrumbs and contextual links (`lib/site.ts:173-183`). Booted copy: ten routes, all 200,
exactly one `h1` on each, `BreadcrumbList` on the nine inner pages.

**2. The city page came three days later, because the site was answering the city query
with nothing.** `app/hijama-nyc/page.tsx` (2026-08-27, `6b970ad`) opens: until it existed
"every route said Queens or Flushing, and the built HTML mentioned New York four times on
the home page against ninety-two for Queens" (lines 11-19; the plan's own count,
`NYC-SEO-PLAN.md:127-129`). The page it had to beat "holds #1 … with a *single* 2,070-word
homepage on an exact-match domain", so this one competes on "a real answer to 'where in
the city, and how do I get there', and a price the rest of the city cannot match" (lines
20-25): door-to-door travel times by borough with the subway lines (`TRAVEL`, lines 56-83),
a five-point buyer's guide "written to be useful to someone who books elsewhere" (`CHOOSING`,
lines 85-116), and the five questions that repeat across the results (`QUESTIONS`, lines
118-139). "Deliberately not a borough page": the borough variants measured zero volume, so
"one city-level page is the whole of the geographic expansion this data supports" (lines
27-29). The same commit put `New York City` first in `areaServed` and added Manhattan and
the Bronx (`lib/schema.ts:103-111, 124-125`).

**3. Headlines say Queens; body copy keeps Flushing.** `README.md:102-107`: the title, H1,
section headings, brand tagline and share card "all widened to Queens", while Flushing is
"deliberately *kept* in every meta description, all body copy, the photo alt text, the
address and the areas-served list, so the local keyword still works." The Visit section's
comment shows the rule being applied: the `h2` stays "Find us in Queens" and the city goes
in the lede (`app/page.tsx:789-792`). Booted copy, visible text with scripts stripped: the
home page prints Queens 6 times and Flushing 6 times.

**4. One file for the facts, and the hours summary is derived.** `lib/site.ts:3-6` is the
"single source of truth for the details that repeat across every page. Change a phone
number or an opening hour here, not in nine JSX files": name, tagline, canonical URL,
telephone (three forms), WhatsApp, Instagram, the Maps link and keyless embed, the rating
as read off the profile, the postal address, every image path with its intrinsic size, the
hours table, the nav sets, the areas-served string. `hoursSummary` (lines 84-117) builds the
hero's "Sun–Tue & Thu · 9 AM – 7 PM" from the same `hours` array the Visit table renders,
collapsing consecutive open days into runs and stating a time only when every open day
shares one, "so the sentence cannot become true-looking and wrong" (line 92) — because "a
hand-kept summary is a second copy of the opening times that nothing forces anyone to
update" (lines 88-90). Four open days, three closed (`hours`, lines 74-82).

**5. The canonical host was wrong on every page, and one line fixed it.** `lib/site.ts:11-22`
(2026-08-27): the apex 308-redirects to `www` at the Vercel edge, but `site.url` declared
the apex, so "every canonical, every sitemap entry and every `og:image`" pointed at a URL
that redirected back to the page announcing it — "Google discards a canonical it cannot
resolve to a 200, and the sitemap shipped nine redirecting URLs." Now `www`, with the
verification command in the comment (line 21). "Whichever host is primary is arbitrary;
that all of these agree with it is not." Booted copy: canonical on all ten routes is the
`www` host. Live, 2026-09-11: apex → 308 → `www`; `www` → 200.

**6. Open Graph goes through one helper because Next's shallow merge dropped the image.**
`lib/site.ts:132-153`: a route that declares `openGraph` *replaces* the layout's object, so
"every page had lost the layout's image, and WhatsApp, which is the booking channel,
rendered every shared link as a bare grey blob." Every page now calls `openGraph({...})`,
which defaults `siteName`, `locale`, `type: 'website'` and `images: [ogImage]` (line 157;
11 call sites: ten pages plus the layout). `type` is a helper default for the same reason:
"adding `type` to the layout did nothing, because `app/page.tsx` declares its own
`openGraph` and replaced the whole object again" (lines 142-148). Booted copy: `og:image`
1/1 and `og:type` 1/1 on all ten routes. The share card is a static 1200×630 JPEG rebuilt
by `scripts/og-card.py` (`lib/site.ts:119-123`).

**7. The business node ships on every page, and the rating is deliberately not in it.**
`lib/schema.ts:16-25`: `provider`, `publisher` and `worksFor` are `@id` references to
`#business`, and "an `@id` only resolves if the node it names is on the *same page*", so
`businessSchema` is emitted on all ten routes (10 of 10 `page.tsx` files import it; booted
copy: `LocalBusiness+HealthAndBeautyBusiness` on 10/10). The node is typed
`['LocalBusiness', 'HealthAndBeautyBusiness']` for parsers that string-match rather than
resolve the hierarchy (lines 51-59), carries `geo` as distinct from the postal address
(lines 66-71), `knowsLanguage` on the business rather than either practitioner because "who
speaks which is not something the site states, and schema should not assert more than the
page does" (lines 79-84), and **no `aggregateRating`**: "the 5.0 from 175+ reviews is real,
but it lives on the Google Business Profile — re-publishing it as our own markup about
ourselves is a self-serving review under Google's structured data policy" (lines 85-93;
`README.md:88-91`). Booted copy: `aggregateRating` on 0/10 routes. Two practitioners carry
stable `@id`s so the `Person` on `/about` and the `Article` author on the guides read as one
entity (lines 5-14, 279-290, 352-377); the guide's author is a full node rather than a bare
`@id` because the guide does not render `practitionerSchemas` and "a reference alone would
dangle" (lines 279-283).

**8. The visible byline, the Article `dateModified` and the sitemap `lastmod` are one
constant.** `lib/schema.ts:255-262`: `GUIDE_UPDATED` drives the guide's `dateModified`
(line 302) and its visible "Last updated" line (`app/what-is-hijama/page.tsx:186-195`); the
same constant is the sitemap's `lastModified` for that route (`app/sitemap.ts:23`), and
`MARKS_UPDATED` / `SITE_UPDATED` do the same for the marks guide and the eight other pages
(`schema.ts:264-270, 306-307`; `sitemap.ts:18-27`). The sitemap sets only `lastModified`:
Google "ignores both `priority` and `changefreq`, and it reads `lastmod` only while a site
keeps it honest" (`sitemap.ts:9-14`). All three constants read `2026-08-23`.

**9. Crawl policy written down, not inherited.** `app/robots.ts:26-46` names nineteen AI
crawlers in one list and allows all of them, "because 'allowed by default' and 'allowed on
purpose' look identical to a crawler and different to anyone auditing the site" (lines 4-13),
with the warning that a `disallow` added to `*` alone would not reach any named group
(lines 21-24). `public/ai.txt` (2026-08-29) states the same policy in prose and points a
model at `public/llms.txt`, whose `## Facts` block carries the price, what is included, the
practitioners, hours, address, areas served, frequency, hygiene, who should not have it,
and the evidence summary (`llms.txt:8-41`), then indexes all ten pages (lines 43-78). Booted
copy: `/robots.txt` has 20 `User-Agent` lines, 2 `Allow: /`, 0 `Disallow`; `/llms.txt` and
`/ai.txt` serve as `text/plain`.

**Supporting decisions worth knowing:**

- **The `.vercel.app` host redirect, and the stale duplicate it cannot reach.**
  `next.config.ts:132-157` (2026-08-27): a stale deployment at `hasina-hijama-site.vercel.app`
  serves an older build — 200, no canonical, no `noindex` — and is "the URL on the Google
  Business Profile and the one ChatGPT cites when asked for hijama in NYC"; `.vercel.app`
  is on the Public Suffix List, so none of that authority transfers. Any `*.vercel.app`
  host now 308s to the canonical domain (booted copy, `Host: hasina-hijama-site.vercel.app`
  → `308 -> https://www.hasinahijamacupping.com/about`). The rule "cannot fix the existing
  stale one — that build predates this config", which is a dashboard action
  (`NYC-SEO-PLAN.md:179-184`). **Still open on 2026-09-11:** that host answers 200 with the
  title `Hasina Hijama — Sunnah Cupping for Women`.
- **Security headers on every route.** A non-nonce CSP — the nonce recipe "requires every
  page to be dynamically rendered", the wrong trade for a static ten-page site with no
  accounts, cookies, user input or third-party JavaScript (`next.config.ts:3-49`; 13
  directives, `'unsafe-inline'` kept for the hydration payload and the one `animationDelay`
  style attribute, `frame-src` only for the keyless Maps embed, `'unsafe-eval'` and `ws:`
  in dev only); a Permissions-Policy denying eighteen features with `fullscreen` granted to
  the Maps embed (lines 51-81); `X-Frame-Options: DENY` duplicated on purpose beside
  `frame-ancestors 'none'` for older scanners (lines 159-181). Verified on the booted copy
  and on the live host.
- **The hero is one photograph and ships no JavaScript.** `app/page.tsx:250-297`
  (2026-08-29): the copy-left/picture-right hero became a full-bleed ink field with the copy
  set on the photograph, because on a phone the old layout was "a 137px letterbox band
  squeezed above a wall of stacked paragraphs"; the three-frame crossfading gallery with
  its timer, indicators and motion-preference subscription — "a client component, on the
  hero, in front of the LCP element" — became one server-rendered `<Image>` (`lib/site.ts:216-224`;
  `components/HeroGallery.tsx` deleted). `app/page.tsx` has no `'use client'`. The old
  notice bar's three claims became the three cells of the offer strip, so the price stopped
  being "12px of tracked grey in a strip that, below 780px, scrolled past as a marquee"
  (lines 443-455).
- **Image quality 82, on measurement.** `next.config.ts:88-129`: the hero source is
  1019×1020 against a full-bleed field, so it is upscaled on any desktop (0.94× at 390 px,
  2.51× at 1280, 3.77× at 1920 at DPR 2), and Next caps at the source width — every srcset
  entry returns "the identical 63,915-byte 1019x1020 JPEG". Against the q=75 baseline,
  q=82 cost +19 KB (+24%) and q=90 would cost +56 KB (+72%); only the hero opts in. Booted
  copy: `/_next/image?…&w=1920&q=82` → 63,915 bytes, exactly the figure in the comment.
  The real fix is a re-exported original at ≥3,000 px, "until Hasina supplies one" (lines
  125-128).
- **The Arabic face is subset to eighteen codepoints.** `app/layout.tsx:23-41`: one ayah on
  one page; the full Google face is ~92 KB on every route, "over a fifth of the page
  weight, for six words", and this Next version's `next/font/google` types expose no
  `text` option, so the file is subset ahead of time (10,136 bytes on disk) with GSUB/GPOS/GDEF
  retained so the letters still join. Newsreader's three weights come from one variable
  file per style, "so naming a third weight here adds a rule, not a request" (lines 9-14).
- **The enquiry form has no backend, and does not need one.** `components/EnquiryForm.tsx:33-52`
  (rewritten 2026-08-27, `89dd55b`): submitting composes the fields into plain text and
  hands it to the visitor's own messaging app as a prepared `sms:` draft, with a WhatsApp
  link carrying the same text; "nothing is claimed to have been sent, because nothing has
  been." Which button leads is decided by viewport in CSS: `sms:` has no handler on a
  desktop browser, so above 780 px WhatsApp leads and the SMS button is hidden outright
  "rather than left as a control that does nothing"; below 780 px the order flips (lines
  92-104). The README's "wire up the enquiry form" item (`README.md:126-128`) predates this.
- **The mobile booking bar shows on any scroll and leaves 1.5 s after it stops.**
  `components/MobileCta.tsx:6-40`: the literal reading of the request ("hide on the first
  idle frame") was unusable — the bar leaves "exactly as your thumb arrives" — so `IDLE_MS`
  is 1,500; the bar never hides while a keyboard user is standing on it (lines 53-63); the
  scroll handler skips the state update once the bar is up, because otherwise "every scroll
  event schedules a state update that React then bails out of" (lines 46-51).
- **The drawer is a dialog.** `components/SiteHeader.tsx:34-112`: it hangs from the measured
  bottom edge of the sticky masthead, closes on Escape and on `popstate`, locks body
  scroll, moves focus in and traps Tab, and hands focus back to the toggle on close; the
  scrim and drawer are siblings of the header, not children, because a `backdrop-filter`
  ancestor collapses `position: fixed` on iOS Safari (lines 207-213).
- **One design rule for glyphs.** `components/CuppingCup.tsx:1-18`: the stylesheet's only
  marks are line drawings, so the cup beside two headings is a stroked SVG at the same
  weight, with the suction valve kept "so it reads as a *cupping* cup instead of a bell or
  a jar"; stroke 1.8 so it survives a 15 px box at 320 px wide (lines 26-32).

---

## Gaps — in the repo, absent from the page

Real, checkable capability the shipped page said nothing about, or said imprecisely.

1. **"no website" was wrong** (task-14-report.md §0.1). The practice's Google listing
   pointed at a live one-page deployment on a `.vercel.app` host; its own domain served a
   parking page. The brief now says both.
2. **Which six questions** (§0.2). The old list named five topics for six pages and left
   out the Queens landing page.
3. **The city page's reason for existing** (decision 2) — the page said nothing about the
   4-vs-92 count or the borough-page refusal.
4. **The one-file rule and the derived hours line** (decision 4).
5. **The canonical-host fix and the Open Graph helper** (decisions 5, 6) — two dated
   failures with a one-line and a one-helper fix.
6. **Schema by `@id`, the rating kept out of it** (decision 7). The old page mentioned
   "LocalBusiness structured data on every page" and nothing else.
7. **One constant for byline, `dateModified` and `lastmod`** (decision 8).
8. **The crawl policy, the headers, the hero rebuild, the q=82 measurement, the Arabic
   subset, the form's draft, the mobile bar.** A sentence each.

Items 1–7 shape the rewritten page; 8 is a sentence each in the last section.

---

## Audience, objection, primary action

Per `.agents/product-marketing.md` §2, segment 1 — **a local service-business owner**. This
one is a two-practitioner cupping practice in Flushing whose listing already wins its map
pack; the reader is someone like them: a good local business with a Google listing and a
domain that either does nothing or points somewhere it should not.

**The objection this page has to answer:** *"I already have a Google listing and people
find me. What would a site actually add?"* Every decision above is an answer with a file
behind it: a page for each question the practice's own customers type; a city page for the
query the site was not answering at all; one file for the facts so a phone number or an
opening hour changes in one place; canonicals, sitemap and share images that all agree on
one host; business data on every page with the rating deliberately left to Google; dated
bylines that cannot drift from the sitemap; a crawl policy written for the answer engines
the practice's customers now ask. The page argues *mechanism*, never adjectives and never
search volumes.

**Secondary objection**, per §2: *"is this their one good project?"* — answered by the
real stack, the dated artefacts and the measured numbers.

**The primary action** is `/contact/` via `GeneralCta`. The CTA line names this reader's own
situation: a listing that points at the wrong place.

**What the page must not do:** quote a price or timeline for OUR work; claim a headcount;
say "I"; claim a ranking or traffic outcome (Unverifiable 1); print a search volume
(Unverifiable 2); assert that cupping works or relieves anything, in our voice — the page
describes what the client's site says and what we built, including the evidence section
the site refuses to soften (Unverifiable 3, 4); present the client's rating, review count,
years or client count as ours (Unverifiable 5).

---

## Verifiable numbers

Each with the command that proves it. Run from the scratch copy (`$SCRATCH/hijama`, which
carries `.git`) unless noted.

| Number | Command / location |
| --- | --- |
| **10** routes; **10** sitemap URLs; **9** inner pages with a breadcrumb | `ls app/page.tsx app/*/page.tsx \| wc -l` → 10; booted copy `curl /sitemap.xml \| grep -o '<loc>' \| wc -l` → 10; `grep -l "<Breadcrumb " app/*/page.tsx \| wc -l` → 9 |
| **0** tests, **0** test scripts | `package.json` — `scripts` are `dev`, `build`, `start`, `lint`, `typecheck`; no test runner in either dependency block |
| **6** search pages, each with a query in its header comment | `app/{hijama-nyc,cupping-therapy-queens,cupping-therapy-cost,massage-cupping-and-red-light,cupping-marks-and-bruising,hijama-for-women}/page.tsx`, lines 10-30 of each |
| Built home page: New York **4** × vs Queens **92** × (the source's own count, 2026-08-27) → **15** after the city page | `app/hijama-nyc/page.tsx:17-19`; `NYC-SEO-PLAN.md:127-129, 161` — a dated record in the source, not re-measured (my scripts-stripped count of the served copy is 2 / 6 / 6 for New York / Queens / Flushing, a different measure) |
| **11** `openGraph(` call sites (10 pages + layout); `og:image` **10/10**, `og:type` **10/10** | `grep -l "openGraph(" app/page.tsx app/*/page.tsx app/layout.tsx \| wc -l` → 11; `$SCRATCH/hh-count.py` over the ten served routes |
| `businessSchema` on **10/10** pages; `LocalBusiness+HealthAndBeautyBusiness` on **10/10** served routes; `aggregateRating` **0/10**; exactly **1** `h1` on **10/10** | `grep -l businessSchema app/page.tsx app/*/page.tsx \| wc -l` → 10; `hh-count.py` |
| Canonical = `www` host on **10/10** served routes; apex → **308** → `www` live; `*.vercel.app` → **308** on the booted copy | `hh-count.py`; `curl -sS -o /dev/null -w '%{http_code} -> %{redirect_url}\n' https://hasinahijamacupping.com/`; `curl -H "Host: hasina-hijama-site.vercel.app" http://localhost:3104/about` |
| **19** AI crawlers named; robots: **20** `User-Agent` lines, **2** `Allow: /`, **0** `Disallow` | `sed -n 26,46p app/robots.ts \| grep -c "'"` → 19; booted `/robots.txt` |
| **13** CSP directives; **18** Permissions-Policy features; **5** security headers | `sed -n 35,49p next.config.ts \| grep -c '^\s*\`'` → 13; `sed -n 62,81p next.config.ts \| grep -c '=('` → 18; `curl -sSI http://localhost:3104/` |
| **4** open days, **3** closed; `hoursSummary` → `Sun–Tue & Thu · 9 AM – 7 PM` | `lib/site.ts:74-82`; the frozen cover's offer strip prints the derived string |
| **16** `areaServed` entries (City + AdministrativeArea + **14** Places); **7** home FAQ questions in schema (8 on the page); **5** cost FAQ questions; **5** services in the ItemList | `lib/schema.ts:102-128, 153-190, 200-229, 231-237`; `grep -c "^\s*q: '" app/page.tsx` → 8 |
| Three date constants all **2026-08-23** | `lib/schema.ts:261-262, 270, 307` |
| Hero source **1019×1020**; served `w=1920&q=82` → **63,915 B**; q=82 vs q=75 **+19 KB (+24%)**, q=90 **+56 KB (+72%)** (source's measurement) | `sips -g pixelWidth -g pixelHeight public/hijama-cups-under-red-light-therapy-flushing-queens.jpg`; `curl -o /dev/null -w '%{size_download}' 'http://localhost:3104/_next/image?url=%2Fhijama-cups-under-red-light-therapy-flushing-queens.jpg&w=1920&q=82'` → 63915; `next.config.ts:100-122` |
| Three treatment-room photographs **765×1020**; share card **1200×630**; logo **759×1126** | `sips` over `public/*.jpg`, `public/*.png` |
| Arabic subset **10,136 B** (≈9.9 KB) vs **~92 KB** full face | `ls -l app/fonts/noto-naskh-arabic-ayah.woff2`; `app/layout.tsx:25-28` |
| Type scale **10** steps; `border-radius` / `box-shadow` **0** uses | `sed -n 88,97p app/globals.css`; `grep -n "border-radius\|box-shadow" app/globals.css` → one comment line (1826-1827) |
| Stylesheet **3,036** lines, **116,270** bytes; `IDLE_MS` **1,500**; form/bar breakpoint **780 px** | `wc -l -c app/globals.css`; `components/MobileCta.tsx:21`; `components/EnquiryForm.tsx:100-103`, `globals.css:2520` |
| **29** commits, **2026-08-24 → 2026-08-29** | `git log --oneline \| wc -l`; `git log --reverse --format=%ad --date=short \| head -1`; `git log -1 --format=%ad --date=short` |
| City page + canonical fix + `.vercel.app` redirect **2026-08-27** (`6b970ad`); form draft **2026-08-27** (`89dd55b`); hero rebuild **2026-08-29**; robots list + `ai.txt` + CSP **2026-08-29** (`bfec627`); nine of ten pages in the initial commit **2026-08-24** (`b8a0ee2`) | `git log --format='%h %ad' --date=short -- <file>`; `git show --stat <hash>` |

**Numbers deliberately NOT used on the page:** every search volume (27,100 / 1,300 · 2,400 /
260 · 720 / 480 · 8,100 · 3,600 · 1,900 · 1,300 · 390 · 30 · 20 — in the six page header
comments, `lib/schema.ts:105-106` and `NYC-SEO-PLAN.md:38-67`) per the standing Task 5
ruling; the dated rank (#24 for `hijama near me` in Queens on 2026-08-27, `NYC-SEO-PLAN.md:12-15`)
and the map-pack positions (`:94-105`), which are outcomes; the audit tool's own scores
(69 → 85 → 91, `ACTION-PLAN.md:4`), whose method is not in the repo; the competitor table
behind the hero's "most-reviewed" claim (`NYC-SEO-PLAN.md:209-223`); the 1,494-word count
of the city page (`NYC-SEO-PLAN.md:127`; my count of the served text is 1,510, a different
method); the commit count; the CPC.

---

## Unverifiable claims

For the user. **Not written on the page**, and no later task should promote one to a fact.

1. **Any ranking or traffic outcome.** The repo records one organic position (#24, Queens,
   2026-08-27) and three local-pack readings on that day. No later measurement, Search
   Console export or analytics export is committed; `ACTION-PLAN.md:68-70` says GA4 and
   Search Console IDs were still outstanding. The page states what was built and why.
2. **The search volumes.** DataForSEO / Google Ads figures written into source comments
   and `NYC-SEO-PLAN.md`, sourced on this machine but kept off the page per the Task 5
   ruling.
3. **That cupping relieves, treats or helps anything.** The client's site says so in its
   own voice ("Relief you can feel", `app/page.tsx:172-173`; the conditions litany, lines
   90-101; the services' bodies) and, in the same breath, publishes an evidence section
   that says the research is "mixed and mostly small", that cupping "is close to impossible
   to blind", and that "claims that hijama detoxifies the blood, cures chronic disease or
   replaces medication run well ahead of anything demonstrated"
   (`app/what-is-hijama/page.tsx:322-345`; `public/llms.txt:30-34`), with a disclaimer in
   every footer (`components/SiteFooter.tsx:4`) and the audit's refusal to soften it
   (`ACTION-PLAN.md:81`). Our page describes that section and that refusal; it asserts no
   efficacy.
4. **"New York City's most-reviewed five-star hijama practice."** The hero's claim,
   substantiated in a source comment and a dated table (`app/page.tsx:385-404`;
   `NYC-SEO-PLAN.md:209-223`) with the note that it "fails the day another NYC hijama
   practice passes 175 reviews at 5.0". It is the client's claim about the client; the page
   mentions only that the source records the check and its expiry condition.
5. **5.0 from 175+ reviews, ten years, over a thousand clients, "certified".** The
   practice's own figures (`lib/site.ts:36`; `app/about/page.tsx:74-81`), the certification
   deliberately naming no body (`README.md:108-111`). Visible in the captures as the client's
   copy; not restated as ours.
6. **The competitor prices ($60–$150 a session; $30–$80 add-ons).** The client's
   market claim (`app/cupping-therapy-cost/page.tsx:40-53`, which itself says "we are not
   going to pretend the city-wide figures are precise", lines 142-146). Visible in the
   captures; not restated as ours.
7. **The two review quotes and the three testimonials** (`app/page.tsx:185-201`). Not
   restated.

---

## Shot list

Three runner captures, one frozen cover left alone. Every entry names the sentence in
`content.ts` it is evidence for.

**How the source was booted.** From a scratch COPY (`rsync -a --exclude .next` into
`$SCRATCH/hijama`; inferred Turbopack root printed for the original — the repo — and for the
copy — the copy; `next.config.ts:86` also pins it), through `scripts/guarded-dev.sh`
(4 GB / 15 % free / 3,600 s) as `npx next dev --port 3104`. One boot: ready at 383 MB group
RSS; 1,209 MB after all ten routes plus the crawl files; wrapper-recorded **peak 1,312 MB**
on clean exit. No env names to neutralise (none exist). The copy's tracked `AGENTS.md` and
`CLAUDE.md` were byte-identical after `next dev`; the original's `git status --short` was
empty before and after, `diff` → clean.

**What must be hidden.** `nextjs-portal` (Next's dev badge) on every shot. Nothing else:
the telephone number and street address in every frame are the practice's own published
contact details, on every route of its public site by design (`lib/site.ts:24-50`).

| `out` | Route | Evidence for |
| --- | --- | --- |
| `hasina-hijama-cupping-nyc.jpg` (1600x1000, new) | `/hijama-nyc` | "Six pages, one question each." / the city page — the breadcrumb `Home / Hijama in NYC`, the eyebrow NEW YORK CITY, the H1 `Hijama in New York City`, the lede, the four-cell strip ($10 per cup · $60–$150 a session · 5.0 from 175+ reviews · Women and men) and the contents list opening `Getting here from across the city` |
| `hasina-hijama-cupping-cost.jpg` (1600x1000, new) | `/cupping-therapy-cost` | "the cost page's H1 is the question itself" — the breadcrumb `What cupping therapy costs`, the H1 `How much does cupping therapy cost?`, the lede's `$60 and $150` against `$10 per cup`, the price grid (THE ONLY CHARGE $10 · three INCLUDED FREE cells) |
| `hasina-hijama-cupping-guide.jpg` (1600x1000, new) | `/what-is-hijama` | "one constant" — the byline `Written by Hasina, certified hijama practitioner · Last updated August 23, 2026`, rendered from `GUIDE_UPDATED`, beside the At-a-glance aside |
| `hasinahijama.jpg` (frozen cover, 1200x750, 2026-09-07) | NOT re-captured | Used by `/work/` with alt "The Hasina Hijama Cupping site for a Queens cupping practice" and as this page's header. Opened and checked against HEAD: it IS the 2026-08-29 hero — the single photograph on the ink field, the Sunnah underline, the 5.0 line, both buttons, the claim line, and the offer strip printing the derived hours string. The page's front-door section points at it rather than repeating it. |

**Not captured, and why.** The About page's enquiry form (~4,000 px down `/about`; the
runner captures every route from the top and the form has no lazy image to justify a text
fragment). The guide's evidence section (same reason). The mobile booking bar (below 780 px
only, and only while scrolling). The home page (it is the cover). The About hero (a client
photograph of the treatment room under the H1 "Ten years of steady hands" — the client's
claim, not a mechanism of ours).

---

## Cross-page deltas

One consistency defect (task-14-report.md §0.3): the tenth project is missing from
`public/llms.txt`. Each entry is a `{file, anchor, replacement, reason}`; anchors are exact
current strings, each verified to occur exactly once in its file by `grep -cF` (table at the
end). **None applied by this task.**

1. `{file: "public/llms.txt", line: 34, anchor: "- [Real-World Data Pipeline](https://neuragul.com/work/rwd-pipeline/): A 0-to-1 ETL pipeline pulling messy clinical data from dozens of sources into one common model. Early cancer detection research ran on top of it.", replacement: "- [Real-World Data Pipeline](https://neuragul.com/work/rwd-pipeline/): A 0-to-1 ETL pipeline pulling messy clinical data from dozens of sources into one common model. Early cancer detection research ran on top of it.\n- [Hasina Hijama Cupping](https://neuragul.com/work/hasina-hijama-cupping/): A ten-page Next.js site for a Queens cupping practice: six pages that each answer one question its customers search, business data on every page with the rating left to Google, and one host that every canonical, sitemap entry and share image agrees on.", reason: "the 2026-09-07 commit that added the tenth case study (b8ae883) updated the sitemap, PORTFOLIO_PROJECTS, the filter counts and the home grid but not llms.txt, whose Work section lists nine; the anchor is the current last Work entry and the replacement appends the tenth after it (llms.txt is orchestrator-owned)"}`

**Comment-only echoes (no anchor, nothing rendered):** `src/app/work/page.tsx:43-44` ("an
index of nine specific things … the nine case studies … nine links") and `:82` ("with nine
projects the cards stop at target two"); `src/components/site/work/content.ts:105` ("a
nine-project feed") and `:115` ("Nine projects is a small enough feed"). The rendered
`ItemList` uses `PORTFOLIO_PROJECTS.length` (`work/page.tsx:59`), so it already says 10.
`.agents/product-marketing.md:16-22, 60, 171` already list the project.

**Sweep accounting** (`grep -rn -i "hijama\|hasina" src/ public/llms.txt
.agents/product-marketing.md docs/ scripts/`, excluding `work/hasina-hijama-cupping/`),
every hit: `src/app/sitemap.ts:69` → the route, correct; `src/components/site/home/content.ts:233`
→ a comment saying the project is not in the six-tile home grid, correct;
`src/components/site/work/content.ts:122, 290-297` → the `PORTFOLIO_PROJECTS` entry
(`web-development` only, cover alt "The Hasina Hijama Cupping site for a Queens cupping
practice"), correct; `.agents/product-marketing.md:22, 60, 171` → the project listed among
the ten and in segment 1, correct; `scripts/check-assets.mjs:200` → the frozen-cover
exemption; `docs/research/case-studies/packship.md:443` → a reviewer's note about a page
comment, unaffected; the design spec and plan under `docs/superpowers/` → this task's own
row. `public/llms.txt` → **0 hits**, which is delta 1. No other page prints a claim about
this project, so there is nothing to retire.

**Notes for the user (no anchor, nothing to apply):**

- **The stale `hasina-hijama-site.vercel.app` deployment is still live on 2026-09-11** (200,
  title `Hasina Hijama — Sunnah Cupping for Women`). The repo's redirect rule cannot reach it;
  `NYC-SEO-PLAN.md:173-184` lists the two dashboard actions (repoint the Google Business
  Profile's website field; delete or alias the old Vercel project). Whether the GBP field
  has since been changed is not knowable from the repo.
- **The README is stale in two places** (`README.md:118` "all four URLs"; `:126-128` the
  form "tells the visitor plainly that nothing was sent"). Harmless; the page follows the
  code.
- **`site.images.roomTwo` has no reader** since the hero became one photograph
  (`lib/site.ts:223-224`, left in place on purpose).
- **The photographs are 765×1020 against slots that upscale them** (`README.md:129-132`;
  `next.config.ts:88-129`); the source asks for a ≥3,000 px re-export of the hero and
  ≥1,200 px for the Article image (`lib/schema.ts:292-298`). Nothing in code can fix it.

### Anchor uniqueness (so the controller can apply by exact replacement)

Checked at `e227d18` on 2026-09-11 with `grep -cF -- "<anchor>" <file>` and `grep -nF` for
the line:

| Delta | File | Line | Check | Occurrences | At cited line |
| --- | --- | --- | --- | --- | --- |
| 1 | `public/llms.txt` | 34 | single-line `grep -cF` | 1 | yes |

Re-run the same check before applying if the file has moved on.
