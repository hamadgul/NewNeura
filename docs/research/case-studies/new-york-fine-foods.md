# New York Fine Foods — case-study dossier

Source of record: `~/Projects/newyorkfinefoods`, read-only for this work; booted from a scratch
copy (`rsync -a --exclude .next --exclude .worktrees --exclude .git` into `$SCRATCH/nyff`).
Nothing in this file was taken from memory; every line names the file or command it came
from. HEAD at the time of reading: `93bd639` (2026-08-27, "seo"), branch `main`, 107 commits
since 2026-02-15.

The page it backs: `/work/new-york-fine-foods/` —
`src/components/site/work/new-york-fine-foods/content.ts` and
`src/app/work/new-york-fine-foods/page.tsx`.

**Credentials.** The repo has no `.env.local` and no `.env`. `.env.local.example` names one
variable, `NEXT_PUBLIC_FORMSPREE_ENDPOINT`; `src/lib/constants.ts` falls back to a hard-coded
public Formspree form URL when it is unset, and that URL is only ever fetched on a form
SUBMIT, never on render. It was set to the empty string on the boot command line anyway. No
route needs a credential; nothing here needed NEEDS_CONTEXT.

---

## Stack (verified)

Read from `package.json` on 2026-09-11. Versions are the declared ranges, not lockfile pins.

| Package | Declared | What it does here |
| --- | --- | --- |
| `next` | 16.1.6 (pinned) | App Router; three `generateStaticParams` matrices (`catering/[area]`, `pizza-trucks/[topic]`, `blog/[slug]`); `src/proxy.ts` (Next 16's middleware file) sets the security headers |
| `react`, `react-dom` | 19.2.3 (pinned) | |
| `typescript` | ^5 | strict, `@/` alias to `src/` (`tsconfig.json`) |
| `tailwindcss`, `@tailwindcss/postcss` | ^4 | the whole visual layer; `tw-animate-css` ^1.4 for the hero's `animate-in` entrance |
| `radix-ui` | ^1.4.3 | the shadcn primitives in `components/ui` (sheet, tabs, separator, label); `shadcn` ^3.8.4 is the CLI |
| `lucide-react` | ^0.564 | the mobile nav's menu icon |
| `marked`, `gray-matter` | ^18, ^4 | the three blog posts (`content/blog/*.md` → `lib/blog.ts` → `marked.parse`) |
| `class-variance-authority`, `clsx`, `tailwind-merge` | | `cn()` and the button variants |
| `@vercel/analytics`, `@vercel/speed-insights` | ^2 | mounted in the root layout |

Dev: `eslint` ^9 with `eslint-config-next`. **No test runner**: no `vitest`, `jest`,
`playwright` or `@testing-library/*` in either dependency block, no `*.test.*` or `*.spec.*`
file outside `node_modules` (`find . -path ./node_modules -prune -o -path ./.worktrees -prune
-o -name '*.test.*' -print` → nothing). Task 4 froze no test count for this project, and the
page must not state one.

Fonts: Playfair Display and DM Sans through `next/font/google` with `display: "swap"`
(`app/layout.tsx:17-27`).

**Deployment** — Vercel (the analytics and speed-insights packages; `.gitignore` lists
`.vercel`; no `vercel.json`). Canonical host `https://www.newyorkfinefoods.com`
(`metadataBase` in `app/layout.tsx`). Formspree receives every form.

---

## Architecture decisions

Six a reader can check rather than an adjective. File references are to the source repo.

**1. The site was expanded from a measured baseline, and the plan is in the repo.**
`docs/seo-page-plan-2026-08.md` (committed 2026-08-27) records the starting point, pulled
from the DataForSEO API that day: **29 ranked keywords, ~85 estimated monthly organic visits,
6 indexable pages**, with only three keywords on page one and all three branded. Its
diagnosis: "You cannot rank for terms you have no page for." The build order it sets is
sequenced by expected value — `/catering/brooklyn` first (1,300 searches a month in the New
York DMA, the largest single term), `/corporate-catering` second (the highest cost-per-click
in the dataset, $53.59 on `corporate event catering` at difficulty 0), then the rest — and
the two commits of that day ship 20 new URLs: ten `/catering/[area]` pages, four
`/pizza-trucks/[topic]` pages, `/corporate-catering`, `/mobile-bar/bartenders`, the blog index
(previously `noindex` and empty) and the first three posts. The sitemap went from 6 URLs
(`git show 1ab1de5^:src/app/sitemap.ts`) to 26 (`app/sitemap.ts`; `/sitemap.xml` on the booted
copy → 26 `<loc>`). The plan also records what it could NOT fix with code: "There is no claimed Google
Business Profile … Until this exists, the pages below compete for positions 4–10 only."

**2. Every area page has to pass a find-and-replace test.** The header of
`src/data/service-areas.ts:1-9` sets the rule: "Each area MUST carry material that is only
true of that place — the venue types, the access reality, the local milestones. Ten pages
built from one template with the name swapped is a doorway-page pattern and Google demotes
it. Test before shipping: if you could find-replace the area name and the page still read
correctly, it is not finished." The data shape enforces it: each of the ten `ServiceArea`
records carries an `angle` ("The argument that is true only of this area"), four
`cateringFor` sections, 10–12 real neighbourhoods in `places`, a `pizzaNote`, three FAQs and
two `siblings` for lateral links (`areas-nyc.ts`, `areas-tristate.ts`). Brooklyn's angle is
the walk-up ("Four flights with no elevator. A one-way street where the truck can't idle.
Alternate-side parking that turns a twenty-minute drop-off into a ticket."); Staten Island's
is "The Borough That Actually Has a Driveway"; Long Island's is graduation season ("half of
Nassau and Suffolk throws a party on the same four Saturdays"). Structured data follows the
same rule: each page's `Service` schema sets `areaServed` to that specific `City` or
`AdministrativeArea` (`app/catering/[area]/page.tsx:70-73`), not the generic "New York City"
string the hub uses. An unknown slug is a `notFound()` (booted copy: `/catering/hoboken` →
404).

**3. The pizza-truck hub kept its slug and gained spokes, because it already ranked.**
`docs/seo-pizza-truck-plan.md` (2026-07-13) records the Search Console baseline that
decided it: `/pizza-trucks` at position 8.1 for "pizza truck" with 88 impressions and one
click ("a CTR problem, not ranking"), 11.7 for "pizza truck nyc", 16.2 for the homepage on
"new york pizza catering". The rulings in its §0: `/pizza-trucks` is the sole target for
every non-branded pizza-truck query, the homepage keeps only branded intent and links down
with keyword anchor text, and "Do NOT change the URL slug … Renaming resets that and forces
redirects." The 2026-07-22 commit ("on-page + schema optimization for /pizza-trucks", #4)
moved the exact phrase into the H1 (`NYC Pizza Truck Catering`) and enriched the `Service`
schema with `areaServed`, a `hasOfferCatalog` built from the nine-item `pizzaMenu`, and a
`provider` that references the layout's `Organization` by `@id` rather than duplicating it
(`app/pizza-trucks/page.tsx:36-72`). The four `/pizza-trucks/[topic]` spokes (weddings,
parties, long-island, connecticut) each carry a `hook` ("the reason this page exists
separately"), an occasions/logistics section, five FAQs and two `related` links
(`data/pizza-truck-pages.ts`), and their schema carries a `minPrice: 1500` offer — the
client's published starting price.

**4. Prose data carries real links.** The area and spoke pages are plain-string data, which
meant a cross-reference like "see corporate catering" shipped as text: "/corporate-catering
was named on six pages and received no keyword-anchored internal link from any of them"
(`components/ui/rich-text.tsx:4-12`). `RichText` renders `[label](/path)` inside those
strings as `next/link` anchors, internal paths only; the fix commit is `fix(seo): repair
internal linking, orphaned two pizza-truck spokes (#6)`, 2026-08-27. Twelve inline links now
live in the area data (`grep -c '](/'` across `areas-nyc.ts` + `areas-tristate.ts`).

**5. The hero is a poster first and a video second.** `components/sections/hero-video.tsx`:
the poster JPEG (110 KB) is the eager `priority` image and the LCP element; the `<video>` is
`preload="none"` with NO sources until an `IntersectionObserver` (`rootMargin: "100px"`) sees
the hero, then `webm` (1.8 MB) and `mp4` (2.3 MB) sources are attached, `load()` and
`play()` are called, and the video fades in over 1,000 ms on `canplay`. A visitor with
`prefers-reduced-motion: reduce` never downloads it. Every other video on the site
(`LazyVideo`) gets its `src` only within 200 px of the viewport. (The footage itself: see
Unverifiable 1.)

**6. Every request carries seven security headers from `proxy.ts`.** CSP (`default-src
'self'`; images from self, data: and Unsplash only; `connect-src` and `form-action` allow
Formspree; `frame-ancestors 'none'`), `Referrer-Policy: strict-origin-when-cross-origin`,
`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection: 0` (per OWASP,
with the comment saying why), HSTS for a year with subdomains, and a `Permissions-Policy`
disabling camera, microphone, geolocation and payment. Confirmed on the booted copy with
`curl -sI /`. The commit: 2026-03-16.

**Supporting decisions worth knowing:**

- **The form asks which service first.** `components/forms/contact-form.tsx` is a two-step
  flow: a three-card chooser (Catering / Pizza Truck / Mobile Bar), then a form whose fields
  depend on the choice (event type for catering; location for the truck; location plus a
  package select with the seven published bar tiers for the bar), tagged `_form_type` for
  Formspree. Three further single-purpose forms sit inline on the hubs (`PizzaBookingForm`,
  `EventInquiryForm`, `MobileBarInquiryForm`).
- **A fixed booking bar on the three hubs, below `lg`.** `components/ui/sticky-booking-bar.tsx`
  appears once the `showAfter` section (the menu on `/pizza-trucks` and `/catering`, the
  packages on `/mobile-bar`) has scrolled above the viewport and hides while `#book` is on
  screen. (It is also rendered on the 16 newer pages WITHOUT `showAfter`, where the guard can
  never become true — see Notes for the user.)
- **Sitemap dates are constants, not build time.** `app/sitemap.ts:9-15`: per-page
  `lastModified` constants ("Using a constant avoids the 'lastmod = build time for every
  page' churn that gives Google a weak, identical freshness signal on every deploy"); `/events`
  is deliberately omitted because it 301s to `/catering` (`next.config.ts` `redirects()`;
  booted copy → 308).
- **Entity-linked JSON-LD.** The root layout emits `Organization` (with `@id`),
  `LocalBusiness` + `CateringService` (with `parentOrganization` by `@id`) and `WebSite`; 8 of
  the 13 route files add a page `Service` or `Article` plus `BreadcrumbList`; the blog posts
  get `Article` with `datePublished`. No `FAQPage` and no `aggregateRating`: both plans say
  why ("Google retired FAQ rich results, May 2026"; "never invent values — manual-action risk").
- **The email is never in the HTML.** `ProtectedEmail` renders `···@···············` on the
  server and the real address only after hydration (`useSyncExternalStore`), 2026-03-14.
- **Menus are one file.** `data/menus.ts` (22 catering items in four tabbed categories, nine
  pizzas with five marked vegetarian) feeds both hubs and the pizza `OfferCatalog`;
  `MENU_GUIDE.md` at the repo root tells the client how to edit it without a developer.

---

## Gaps — in the repo, absent from the page

Real, checkable capability the shipped page said nothing about.

1. **The 2026-08-27 expansion and the baseline it started from** (decision 1). The page
   described "media galleries, service menus, and a booking inquiry flow" — the site as it
   was in the spring. The 17 pages that are the point of the repo are not mentioned.
2. **The area-page rule and its data shape** (decision 2). The most checkable engineering
   decision in the repo.
3. **The slug ruling and the H1 swap on the hub** (decision 3), with the Search Console
   numbers that decided it.
4. **`RichText` and the orphaned-spoke fix** (decision 4). Small, and the kind of thing a
   reader who has been burnt by "we did SEO" will recognise.
5. **The poster-then-video hero mechanism** (decision 5). The page showed the motion and
   called it cinematic; the repo's point is what loads when.
6. **Seven security headers, entity-linked JSON-LD, the email obfuscation.** One sentence
   each, or left here.
7. **The two-step contact form** — the page said "booking inquiry flow"; the repo's flow
   branches by service.

Items 1–5 and 7 shape the rewritten page. 6 is a sentence.

---

## Audience, objection, primary action

Per `.agents/product-marketing.md` §2, segment 1 — **a local service-business owner**. This
one runs a catering, pizza-truck and mobile-bar company and books events on how memorable
they look; the reader is someone like them who already has a site and cannot say what it
does for the business.

**The objection this page has to answer:** *"My site looks fine too. What did yours actually
do?"* Everything checkable in the repo is an answer: a measured baseline (29 keywords, ~85
visits, 6 pages) and a plan sequenced by demand; ten borough pages each written around a
fact that is only true there, with a test for thinness written into the data file; a hub
that kept its slug because it already ranked; a form that asks the one question that decides
which fields matter. The page argues *mechanism and measurement*, never "cinematic".

**Secondary objection**, per §2: *"is this their one good project?"* — answered by the real
stack and the dated artefacts. Not by a test count: there is none.

**The primary action** is `/contact/` via `GeneralCta`. The CTA line names this reader's own
problem: a site whose pages nobody searched for.

**What the page must not do:** quote a price or timeline for OUR work; claim a headcount;
say "I"; repeat the client's About-page stats (Unverifiable 2); claim a ranking outcome
(Unverifiable 3); call the hero footage event photography (Unverifiable 1).

---

## Verifiable numbers

Each with the command that proves it. Run from `~/Projects/newyorkfinefoods` (or the scratch
copy) unless noted.

| Number | Command / location |
| --- | --- |
| **0** tests | no test runner in `package.json`; `find . -path ./node_modules -prune -o -path ./.worktrees -prune -o \( -name '*.test.*' -o -name '*.spec.*' \) -print` → nothing |
| **26** sitemap URLs: 9 static + 10 areas + 4 spokes + 3 posts | `app/sitemap.ts`; `curl /sitemap.xml \| grep -o '<loc>' \| wc -l` → 26 on the booted copy |
| **6 → 26** sitemap URLs, **20** added on 2026-08-27 | `git show 1ab1de5^:src/app/sitemap.ts` → 6 static entries and an empty posts loop; `1ab1de5` (#5) and `d5d929f` (#6) add 10 areas + 4 spokes + corporate + bartenders + `/blog` + 3 posts |
| **10** area pages: 5 boroughs + 5 regions | `grep -c '^    slug: "' src/data/areas-nyc.ts` → 5; `…areas-tristate.ts` → 5 |
| **4** pizza-truck spokes | `grep -c '^    slug: "' src/data/pizza-truck-pages.ts` → 4 |
| **3** blog posts, 2026-08-25/26/27 | `ls content/blog/*.md \| grep -v _example \| wc -l` → 3; `date:` front-matter |
| **4** `cateringFor` sections, **3** FAQs, **10–12** places, **2** siblings per area | node script over the two area files (task-12-report.md §2) |
| **12** inline links in the area data | `cat src/data/areas-nyc.ts src/data/areas-tristate.ts \| grep -o '](/' \| wc -l` → 12 |
| **29** ranked keywords, **~85** ETV, **6** indexable pages, 2026-08-27 | `docs/seo-page-plan-2026-08.md` §1 (DataForSEO, that day) — a dated record in the source, not re-measured |
| **1,300**/mo `catering brooklyn`; **$53.59** CPC / KD **0** `corporate event catering`; **~6,500**/mo addressable | same file, §3–§4 — dated record |
| Position **8.1** / **88** impressions / **1** click for "pizza truck", 2026-07-13 | `docs/seo-pizza-truck-plan.md` "GSC baseline" — dated record |
| **7** security headers | `grep -c "headers.set" src/proxy.ts` → 7; `curl -sI http://localhost:3102/` |
| **8 of 13** route files emit page-level JSON-LD; **3** schemas in the layout | `find src/app -name page.tsx \| wc -l` → 13; `for f in $(find src/app -name page.tsx); do grep -q '<JsonLd' $f && echo $f; done \| wc -l` → 8 — zero on `/`, `/about`, `/contact`, `/blog`, `/events` |
| **22** catering items in **4** categories; **9** pizzas, **5** vegetarian | `src/data/menus.ts` |
| **4** testimonials | `src/data/testimonials.ts` |
| **7** bar tiers ($26/34/45/62 open bar; $22/28/35 dry hire) | `contact-form.tsx` package select; `app/mobile-bar/page.tsx` — the client's prices, not restated on our page |
| Poster **110 KB**; video **2.3 MB** mp4 / **1.8 MB** webm; observer margin **100 px**; fade **1,000 ms** | `ls -la public/hero`; `hero-video.tsx:26-28, 56, 84` |
| `LazyVideo` margin **200 px** | `components/ui/lazy-video.tsx:24` |
| **25** Unsplash references (**19** unique URLs) still in the source | `grep -rc 'images.unsplash.com' src/app src/components src/data`; the plan's §6 counted 26 on 2026-08-27 |
| **107** commits, **2026-02-15 → 2026-08-27** | `git log --oneline \| wc -l`; `git log --reverse --format=%ad --date=short \| head -1`; `git log -1 --format=%ad` |
| Hero video **2026-05-29**; security headers **2026-03-16**; email protection **2026-03-14**; pizza-hub SEO **2026-07-22**; expansion **2026-08-27** | `git log --format='%ad %s' --date=short -- <file> \| tail -1` |

**Numbers deliberately NOT used on the page:** the 25 stock-image references, the 7 bar
tiers, the CPC figures, the Unsplash count, the commit count. True, and they measure the
wrong thing for this reader or belong to the client.

---

## Unverifiable claims

For the user. **Not written on the page**, and no later task should promote one to a fact.

1. **The hero footage.** The commit that added `hero-background.mp4/.webm` and the poster is
   `b791aaa`, 2026-05-29, titled "add AI video". Nothing else in the repo describes the
   footage's origin. `nyff-hero.mp4` on our page is a genuine 9.1 s capture of the live hero
   playing (oven → rooftop party → skyline → pizza truck under the headline), so the capture
   is real; the scenes inside it are, per that commit title, generated. The copy therefore
   describes the loading mechanism and never calls the footage "cinematic" or presents it as
   the client's events. Whether the page should say "AI-generated" outright is the user's
   call; the dossier says it here.
2. **"2,500+ Events Catered · 30+ Years of Experience · 98% Client Satisfaction · 50+ Team
   Members"** (`src/data/team.ts` `stats`, animated by `CountUp` on `/about`), and the four
   team members with Unsplash headshots. The repo's own plan (§6) calls these "unverified"
   and bars them from the new copy. Not repeated on our page; the About page is not captured.
3. **Any ranking or traffic outcome after 2026-08-27.** The plan's §7 schedules re-pulls at
   30/60/90 days; no re-pull, Search Console export or analytics export is committed. The
   page states the baseline and what was built, and makes no "now ranks" claim.
4. **"Born in 2010", "300 events each year", "1,000-guest galas"** (About page prose). The
   client's copy; not restated.
5. **Form conversions.** Formspree holds the submissions; nothing is in the repo. The old
   header lead ("turns browsing into event inquiries") is gone for this reason.
6. **Prices** (`From $1,500`, the bar tiers, `$$-$$$` price range with a `TODO: confirm
   with client` beside it in `layout.tsx:29`). The client's; visible in captures, not
   restated as ours.

---

## Shot list

Four runner captures, one frozen cover left alone, one orchestrator-owned video kept. Every
entry names the sentence in `content.ts` it is evidence for.

**How the source was booted.** From a scratch COPY (`rsync -a --exclude .next --exclude
.worktrees --exclude .git` into `$SCRATCH/nyff`; the inferred Turbopack root printed as the
copy), never the repo itself — the repo carries a 636 MB pre-existing `.next`. Through
`scripts/guarded-dev.sh` (4 GB / 15 % free / 1 h limits) with `NEXT_PUBLIC_FORMSPREE_ENDPOINT=`
set empty: `npx next dev --port 3102`. Group RSS: 569 MB at ready, 1,306 MB after four routes,
1,767 MB after the captures (all of it `next-server`); wrapper peak in task-12-report.md §3.

**What must be hidden.** `nextjs-portal` (Next's dev badge) on every shot. Nothing else: the
site is public and names its own business; the phone number on every hero is the client's
published line, present in their JSON-LD.

| `out` | Route | Evidence for |
| --- | --- | --- |
| `new-york-fine-foods-brooklyn.jpg` (1600x1000) | `/catering/brooklyn` | "Ten catering pages, one per borough or region, each written around a fact that is only true there" — the H1 `Brooklyn Catering`, the breadcrumb, the subtitle naming Bushwick and Williamsburg, the angle heading `Catering That Can Handle Your Brooklyn Walk-Up` and its first two paragraphs |
| `new-york-fine-foods-weddings.jpg` (1600x1000) | `/pizza-trucks/weddings` | "Four pizza-truck pages hang under the hub the site already ranked with" — `Pizza Truck Weddings`, the breadcrumb back to Pizza Trucks, `From $1,500`, the hook `The Best-Reviewed Thing at Your Wedding Won't Be the Cake` |
| `new-york-fine-foods-corporate.jpg` (1600x1000) | `/corporate-catering` | "The corporate page is written for the person who has to get a vendor past building management" — `For Companies`, `Corporate Catering NYC`, the hero paragraph naming the certificate of insurance and the invoicing, the section `Corporate Catering That Shows Up On Time` with the PO-number sentence |
| `new-york-fine-foods-contact.jpg` (1600x1000) | `/contact` | "The contact form asks which of the three services you want before it asks anything else" — `Get in Touch`, then the card `What are you looking for?` with Catering / Pizza Truck / Mobile Bar. The hero photograph behind it is a remote Unsplash image (Unverifiable 2's stock-image family), which the alt does not describe as the client's food |
| `nyff.jpg` (frozen cover, 1200x750) | NOT re-captured | Refreshed 2026-09-10 from the LIVE site; shared by `/`, `/work/`, `/process/` and `/services/web-development/` with alt "The New York Fine Foods catering site". The header renders it under the title, so the hero — the wordmark, the seven-item nav, the headline `Exceptional Food / Unforgettable Events`, the two menu buttons — is the page's opening image. |
| `nyff-hero.mp4` (orchestrator-owned, 1200x750, 9.1 s, 812 KB) | kept, not touched | The evidence for the poster-then-video sentence, which a still cannot carry: the frame is the cover, and the background cuts through four scenes under a headline that never moves. Poster `nyff.jpg`. |

**Not captured, and why.** `/` — the cover and the video already are it. `/pizza-trucks`
(the hub) — the first choice for decision 3, dropped because its truck carousel is a
horizontal scroller of 24 `loading="lazy"` images that the browser fetches one card at a
time as the carousel auto-advances every 3 s, so the runner's every-`<img>` gate times out at
15 s (probed twice, 5 → 0 incomplete over ~29 s, the server answering each in ~50 ms from
cache). The corporate page took its slot. `/about` — its stats are the ones the repo's own
plan calls unverified. The mobile sticky bar — only appears after a scroll the runner undoes
before the shot, and only below `lg`. `/blog/*` — a rendered Markdown post proves a
Markdown post.

---

## Cross-page deltas

Nothing on the current page is contradicted by the code, so no delta is mandatory. Two
echoes of the old intro sentence exist outside this page; replacements are offered for
consistency with the rewritten page and can be applied or left. Each entry is a `{file,
anchor, replacement, reason}`; anchors are exact current strings, each verified to occur
exactly once in its file by `grep -cF` (table at the end). **None applied by this task.**

1. `{file: "src/components/site/services/web-development/content.ts", line: 249, anchor: "New York Fine Foods, a cinematic Next.js build with full-bleed motion, media galleries, service menus, and a booking inquiry flow that catches people while the impression is still fresh.", replacement: "New York Fine Foods, a Next.js site grown from six indexable pages to twenty-six: ten borough and regional catering pages each written around a fact that is only true there, four pizza-truck pages under the hub that already ranked, and a contact form that asks which service you want before anything else.", reason: "optional; the old sentence is not false, but 'cinematic' and 'catches people while the impression is still fresh' are the two phrases the rewritten page dropped for having no checkable noun, and the same sentence still describes the project on the Web Development page"}`
2. `{file: "public/llms.txt", line: 30, anchor: "A cinematic Next.js site for a NYC catering, pizza-truck and mobile-bar brand, with media galleries, service menus and a booking inquiry flow.", replacement: "A Next.js site for a NYC catering, pizza-truck and mobile-bar brand: twenty-six pages from a measured six, ten borough and regional catering pages each written around a local fact, four pizza-truck pages under the hub that already ranked, JSON-LD on every service page.", reason: "optional; mirrors delta 1 and the new PROJECT_DESCRIPTION; llms.txt is orchestrator-owned"}`

**Notes for the user (no anchor, nothing to apply):**

- **The sticky booking bar is inert on 16 of the 19 pages that render it.** `StickyBookingBar`
  shows only once `pastMenu` is true, and `pastMenu` is only ever set inside `if (showAfter)`.
  The three hubs pass `showAfter`; `/corporate-catering`, `/mobile-bar/bartenders`, the ten
  area pages and the four spokes pass `href="/contact"` and no `showAfter`, so on those pages
  the bar never appears (`sticky-booking-bar.tsx:16-33`). A one-line default (`pastMenu`
  true when no `showAfter`) fixes it. This is a defect in the client's repo, not on our page;
  the copy describes the bar as "on the three service hubs", which is what the code does.
- **The truck carousel's `fill` images have no `sizes`**, so at a 1600 px viewport every card
  requests the 3840 px variant (`/_next/image?…&w=3840`). Same repo, same note.
- **The hero footage's provenance** (Unverifiable 1) and the 25 Unsplash references
  (Unverifiable 2) are the client's content decisions; the repo's own plan lists replacing
  the stock images as a step. Our page shows real captures of the real site and describes
  neither as the client's photography.

### Anchor uniqueness (so the controller can apply by exact replacement)

Checked at `50975f8` on 2026-09-11 with `grep -cF -- "<anchor>" <file>` and `grep -nF` for the
line:

| Delta | File | Lines | Check | Occurrences | At cited line |
| --- | --- | --- | --- | --- | --- |
| 1 | `services/web-development/content.ts` | 249 | single-line `grep -cF` | 1 | yes |
| 2 | `public/llms.txt` | 30 | single-line `grep -cF` | 1 | yes |

Both are single-line anchors. Re-run the same check before applying if either file has
moved on.
