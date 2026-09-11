# Landscape Drainage Proz — case-study dossier

Source of record: **the live production site, `https://landscapedrainageproz.com`, and nothing
else.** There is no local source: `~/Projects/ShopifySite` holds only
`.claude/settings.local.json` (`find ~/Projects/ShopifySite -type f`, 2026-09-11), as Task 5
found. Every line in this file names the URL and the UTC time it was observed, or the command
run over the saved HTML (`$SCRATCH/ldp/*.html`, 17 URLs fetched 2026-09-11 18:22–18:24 UTC with
a desktop Chrome user agent). Nothing was taken from memory, and nothing on the page claims a
result: the outcome metric cut in Task 5 stays cut.

The page it backs: `/work/landscape-drainage-proz/` —
`src/components/site/work/landscape-drainage-proz/content.ts` and
`src/app/work/landscape-drainage-proz/page.tsx`.

**What "live only" means for every claim.** A claim survives onto the page only if the served
HTML or a rendered frame shows it today. What the HTML cannot show — who wrote which section,
when the engagement ran, whether a Google Ads campaign was ever funded, what any of it returned
— is listed under *Unverifiable claims* for the user and never printed. Read-only throughout:
`curl` GETs, one Playwright pass over eight routes and two single-route probes; no form
submitted, no cart, no account, no checkout.

---

## Stack (verified)

Read from the served HTML of `/` on 2026-09-11 18:22 UTC (`$SCRATCH/ldp/home.html`, 158,796
bytes, 200, 0 redirects).

| Component | Observed | Where |
| --- | --- | --- |
| Platform | Shopify (`powered-by: Shopify`; `Shopify.shop = "2cf453-3.myshopify.com"`; `Shopify.currency = {"active":"USD"}`; `Shopify.locale = "en"`) | response headers; inline `Shopify.*` globals |
| Theme | **Dawn 13.0.0** — `Shopify.theme = {"name":"Live Theme - Dawn","id":131369730185,"schema_name":"Dawn","schema_version":"13.0.0","theme_store_id":887,"role":"main"}`; assets under `cdn/shop/t/5/assets/` (33 distinct Dawn files referenced on `/`: `base.css`, `global.js`, `component-slideshow.css`, `component-predictive-search.css`, `section-footer.css` …) | `grep -o 'Shopify.theme = {[^}]*}'`; `grep -oE 'cdn/shop/t/[0-9]+/assets/[a-zA-Z0-9_.-]+' \| sort -u` |
| Custom Liquid | **2** Dawn `custom_liquid` sections with hand-written markup (below) | `grep -oE 'id="shopify-section-[^"]+"'` → 15 ids on `/`, two containing `custom_liquid` |
| Apps (by `BEGIN app block` / extension URLs) | **TinySEO** (`tinyseo-seo-speed`: `store-json-ld-embed`, `website-json-ld-embed`, `breadcrumbs-json-ld-embed`, `collection-json-ld-embed`, `product-json-ld-embed`, `article-json-ld-embed`, and a `tinyseo_heading_two_block` app block on `/`); **instaindex** (`seo-tags`, which emits a `speculationrules` prerender block for `/`, `/collections/*`, `/products/*`, `/pages/*`, `/blogs/*`); **GOAT trust badges** (`goat-badges-app-10`, a footer-group app block that renders the blue `#banner-1` strip at the foot of every page); **Essential icon badge banners** (`essential-icon-badge-banners-1-98`); a **Section Store** `ss-product-reviews-2` slider on product pages (Swiper 11 from jsDelivr) | `grep -oE 'BEGIN app block: shopify://apps/[^ ]+'`; `grep -oE 'cdn.shopify.com/extensions/[^/]+/[^/]+'` |
| Measurement | Google Tag Manager `GTM-W9LGV4T` (head snippet); a Shopify web pixel (`webPixelsConfigList` id `723222665`, `apiClientId` 1780363) configured with `google_tag_ids: ["G-7BGF2NM55P","GT-5TQ47LRZ"]`, `target_country: US`, and **11** `gtag_events`; a legacy Universal Analytics snippet `UA-101865123-1` (`ga('create', …)`, `ga('require','ecommerce')`) inside a script with the id `google-analytics-opt-out-js-after` | §Architecture decision 4 |
| Storefront features | predictive search (`component-predictive-search.css`, `predictive-search.js`); customer accounts (header account icon → `/customer_authentication/redirect`); cart drawer/notification; 8 payment icons in the footer (American Express, Apple Pay, Diners Club, Discover, Google Pay, Mastercard, Shop Pay, Visa); `shopify-payment-button` (Buy it now) on product pages; `Shipping calculated at checkout.` | `grep -c 'class="list-payment__item"'` → 8 |
| Edge | `server: cloudflare`; `x-frame-options: DENY`; `content-security-policy: block-all-mixed-content; frame-ancestors 'none'; upgrade-insecure-requests`; `strict-transport-security: max-age=7889238` (Shopify platform defaults) | `curl -sSI` |
| Hosts | apex is canonical: `https://www.landscapedrainageproz.com/` → 301 → apex; `http://` → 301 → `https://`; `<link rel="canonical" href="https://landscapedrainageproz.com/">` | `curl -o /dev/null -w '%{http_code} -> %{redirect_url}'` |

**No test suite, no repository, no manifest.** Nothing here is a version we chose; it is what
the store serves. No test count exists for this project and none is stated anywhere.

---

## Architecture decisions

Six a reader can check against the live site rather than an adjective. "We" below is the
studio's claim as the current page already makes it; what this section adds is the evidence
that each thing exists.

**1. Dawn, plus two hand-written Custom Liquid sections — one at the top of the home page,
one in every footer.** The home template's third section is
`shopify-section-template--16131210543241__custom_liquid_CUM4JD`, whose whole body is

```html
<h1 class="center-blue">Top Drainage Products Backed By Over 60 Years Of Drainage Supply Expertise</h1>
<style> #shopify-section-…__custom_liquid_CUM4JD .center-blue {background: #5092d0; color: #fff; font-size: 1em; padding: 7px 10px 10px 10px; … text-align: center; margin: 0px; font-weight: 600;} </style>
```

— the blue band between the header and the slideshow in the frozen cover. The footer group's
second section, `shopify-section-sections--16131210707081__custom_liquid_DmdrPT`, is a
three-column block (`.f`, `background: #0055a5`, `bg.webp` at top right at 45 %): the drop logo
(`drop_trans.png`, 150 px), the name, `mailto:info@landscapedrainageproz.com`,
`tel:203-951-9409`, `Hours: Monday - Friday 9AM - 5PM EST`, then seven links (Top Sellers,
Drainage Solutions, Paver Solutions, Municipal Orders, FAQs, About LDP, Contact Us), with a
`@media (max-width: 768px)` rule that stacks the columns. It is present on **13 of 13** fetched
routes (the census over `$SCRATCH/ldp/*.html`: every file has exactly one `custom_liquid` id
except `/`, which has two). Both are Dawn's `custom-liquid` section type carrying pasted
HTML/CSS; neither is a theme fork. That is what "custom Liquid" on the page means, and the
page says so. Dawn's own footer (`sections--16131210707081__footer`) still renders below it
with the payment icons, the policy links and `© 2026, Landscape Drainage Proz`.

**2. Eleven products, four collections, four pages, one article — and the sitemap agrees.**
`/sitemap.xml` (18:23:41 UTC) is an index of five children. Products: 12 `<url>` (the home
page plus **11** products); pages: **4** (`/pages/contact`, `/pages/faqs`,
`/pages/municipal-accounts`, `/pages/about`); collections: **4** (`frontpage`,
`drainage-solutions`, `grass-pavers`, `top-sellers`); blogs: **3** (two blogs, one article,
`case-study-greenville-admin-complex-nds-grass-pavers`). The collections print their own counts
in the served HTML: Drainage Solutions **7 products**, Paver Solutions **4 products** (7 + 4 =
11), Top Sellers **2 products** (a subset: the `EZ Roll Grass Pavers - EZ4X150 - 4' x 150'
Roll` at `$2,110.00` struck from `$2,532.00`, and the `"EZ FLOW" French Drain Solution BULK`
at `$72.25` struck from `$116.64`). The header menu is six items: Home, Top Sellers, Drainage,
Grass Pavers, Case Studies, Contact. The home page's multirow section lists the catalogue as
five drainage lines (French Drain Solutions, Dry Well Kits, Catch Basin Kits, Radius Coupling
Packs, Pro Channel Kits) and two paver lines (Grass Paver Rolls, Grass Paver Panels), each
column ending in a `See All …` button.

**3. A municipal quote path, in three places.** The home page's multicolumn section
`Municipal Orders & Quotes is Our Specialty` ends in `Learn More` →
`/pages/municipal-accounts`; that page (Article JSON-LD, hero `municipal_hero.webp`, H1
`Municipal Accounts`) runs from `Municipal Drainage Solutions: Expertise in Field-Wide
Challenges` through `Why Municipalities Choose EZflow French Drains` to a closing heading
`Contact Landscape Drainage Proz for Municipal Drainage Solutions` and the line `Contact us
today for a custom quote and expert guidance`; the contact page's two bullets are `Municipal
and large project pricing and support available – just ask!` and `Can't find a drainage
product that you're looking for? Ask us, we can help!`; and the custom footer's fourth link is
`Municipal Orders`. The contact form is Dawn's `form` section: Name, Email (required), Phone
number, Comment, Send. The FAQ page groups **7** visible questions under **4** headings (Paver
Installation & Usage; Ordering & Shipping; Reseller & Tax-Exempt Purchases; Cancellations &
Changes) and opens with `If you can't find the answers to your questions, please contact us`;
the contact page points back (`Please check our FAQs`).

**4. Eleven storefront events, seven Google Ads conversion labels, one container.** The web
pixel config on every route (parsed from `webPixelsConfigList` in `home.html`,
`$SCRATCH/ldp` regex pass) maps:

| Event | GA4 | Google Ads label on `AW-845953007` | Merchant Center `MC-PHPLHH8KJY` |
| --- | --- | --- | --- |
| `page_view` | ✓ | `aL70CM-NjbAaEO_vsJMD` | ✓ |
| `view_item` | ✓ | `SdGgCNKNjbAaEO_vsJMD` | ✓ |
| `add_to_cart` | ✓ | `e9ypCNiNjbAaEO_vsJMD` | |
| `begin_checkout` | ✓ | `ktDYCM2ajbAaEO_vsJMD` | |
| `add_payment_info` | ✓ | `g8RXCNCajbAaEO_vsJMD` | |
| `purchase` | ✓ | `yuLCCMyNjbAaEO_vsJMD` | ✓ |
| `search` | ✓ | `UdtJCNWNjbAaEO_vsJMD` | |
| `view_item_list`, `view_cart`, `remove_from_cart`, `add_shipping_info` | ✓ | | |

GTM `GTM-W9LGV4T` is in the head. A Universal Analytics snippet (`UA-101865123-1`) is also
still served, inside a script whose id (`google-analytics-opt-out-js-after`) is the shape a
WordPress plugin emits; UA stopped processing hits in 2023–24, so it is dead weight. The page
states the conversion actions exist and what they fire on; it does not say a campaign ran,
what it cost, or what it returned (Unverifiable 1–2).

**5. Structured data on every route, from an app, with one hand-pasted exception.** JSON-LD
types per route (census over the 13 fetched routes): `/` — `Organization` (Dawn's, with nine
empty `sameAs` strings), `WebSite` + `SearchAction` (TinySEO), `WholesaleStore` +
`ContactPoint` + `OpeningHoursSpecification` (TinySEO), `BreadcrumbList`; every other route —
`Organization` + `BreadcrumbList`; products — `Product` + `Offer` + `AggregateOffer` +
`Brand` (+ `PropertyValue`/`QuantitativeValue` on the grass paver); collections —
`CollectionPage` + `ItemList`; the article and the municipal page — `Article` + `WebPage` +
`ImageObject` (+ `Person` on the article); `/pages/faqs` — `FAQPage` with 2 `Question`s,
pasted into the page body by hand (the rich text contains a nested `<body>`, two `<meta>`s and
a second `<title>`). Every route carries a `rel="canonical"` naming itself; product titles are
written per product (`EZ FLOW French Drain | Easy Water Drainage for Landscaping`; `EZ Roll
Grass Paver - 4' x 150' Roll`) with a meta description each; collection titles too (`French
Drains, Channel Drains & Drainage Solutions`; `EZ Roll Grass Pavers by NDS`; `Best-Selling
Landscape Drainage Products`). No ranking, impression or traffic figure is available or
printed.

**6. The product page is Dawn's, with the catalogue's history in its filenames.** The grass
paver page serves **9** `product__media-item`s (eight photographs and a YouTube embed,
`youtube.com/embed/QM-az1qGYnQ`, `Play video`), the `Sale` badge, `FREE SHIPPING`, a
quantity stepper, `Add to cart` plus the dynamic checkout button, `You may also like`, and a
Section Store review slider. The CDN `?v=` timestamps on `files/` assets across the 13 routes
run from 2024-01-07 (`LDP-Logo-color.png`) through 2026-02-27 (`NDS_logo_sm.jpg`): the custom
footer's two assets 2024-02-07, nineteen product photographs 2025-02-26/28, the slideshow's
five `NDS_*.webp` 2025-03-21. Three photographs still carry WordPress media-library suffixes
(`EZflow_product_3-e1495133277507.jpg`, `ToughTrack-product_1-e1499715442369.jpg`,
`EZflow_product_2-scaled.jpg`; the `-e` numbers are 2017-05-18 and 2017-07-10), which is the
trace of the site the catalogue was carried over from. The page says "carried over", nothing
more: which platform, and when the move happened, is not in the HTML.

**Supporting observations:**

- **Three slideshow slides, one button each** (`slideshow_HLyph4`): `The Best
  Professional-Grade Catch Basins and Drainage Solutions on the Market` → `All Drainage
  Solutions`; `The NDS EZ-FLow System Makes Gravel-based Drains History` → `All Drainage
  Solutions`; `Introducing the EZ Roll Grass Paving System from NDS ®` → `All Paving
  Solutions`. Autoplaying (the pause control is in the cover).
- **The announcement bar** reads `FREE SHIPPING FOR ALL ORDERS OVER $2000!` on every route.
- **The GOAT strip at the foot of every page** repeats the home strip's sentence
  (`Top Drainage Products Backed By Over 60 Years Of Drainage Supply Expertise`) in the app's
  `#banner-1` (`background: #5092d0`), injected by `goat-badges-app-10/assets/app.js` — an app
  block in the footer group, not Liquid. Confirmed with a DOM walk on `/collections/top-sellers`
  and `/` (~18:31 UTC).
- **Two `<h1>`s on four routes.** `/` (Dawn's `header__heading` around the logo, empty text,
  plus the custom strip), `/pages/about`, `/pages/municipal-accounts` and the article (Dawn's
  page/article H1 plus an H1 inside the pasted body). Noted for the user; not a mechanism of
  ours.

---

## Gaps — in the site, absent from the page

The 2026-09-07 page had three blocks and four facts (Shopify, custom Liquid, CTA design,
Google Ads and SEO as words). Checkable capability it said nothing about:

1. **What "custom Liquid" is** (decision 1): two named sections, their content, and that the
   footer one is on every route.
2. **The shape of the store** (decision 2): 11 / 4 / 4 / 1, the two collection counts that sum
   to the catalogue, the six-item header.
3. **The municipal path** (decision 3): the home column, the page, the contact bullets, the
   footer link.
4. **What "Google Ads" is on this site** (decision 4): seven conversion labels on eleven
   events, GTM, GA4, Merchant Center.
5. **What "SEO" is on this site** (decision 5): per-route canonical, per-product titles, the
   JSON-LD types by route and where they come from.
6. **The product page and the catalogue's provenance** (decision 6).

All six shape the rewritten page.

---

## Audience, objection, primary action

Per `.agents/product-marketing.md` §2, segment 1 — **a local service-business owner**. This one
is an NDS drainage dealer selling to contractors and municipalities, with a $2,110 roll as its
top seller. The reader is someone like them: a trade business that sells a catalogue with a
few dozen SKUs, takes quotes by phone, and needs a store that does not need them.

**The objection this page has to answer:** *"A Shopify theme is a Shopify theme. What did you
actually do?"* Every decision above is an answer with a URL behind it: two hand-written
sections inside Dawn and where they sit; a catalogue whose collection counts add up; a quote
path for the buyer who will never use the cart; conversion labels on the checkout events that
matter; structured data on every route with a per-product title. The page argues *mechanism*,
never adjectives and never a sales figure.

**Secondary objection**, per §2: *"is this their one good project?"* — answered by the range
(`/work/` puts a Shopify dealer beside a routing solver) and by the specificity here.

**The primary action** is `/contact/` via `GeneralCta`. The CTA line names this reader's own
situation: "Do your biggest orders still start with a phone call?" — the buyer the municipal
page was built for.

**What the page must not do:** restore any sales, traffic or ranking figure (Task 5); claim a
Google Ads campaign ran or what it returned; claim we wrote a specific section (the HTML does
not sign its author); quote a price or a timeline for our work; claim a headcount; say "I";
restate the client's tenure figures (60 / 40 / 70 / 120+ years), free-shipping threshold or
prices as ours — they appear in the captures as the client's copy.

---

## Verifiable numbers

Each with the command that proves it, run over `$SCRATCH/ldp/` (the HTML saved 2026-09-11
18:22–18:24 UTC) or against the live site at the time given.

| Number | Command / location |
| --- | --- |
| **2** Custom Liquid sections on `/`; **1** on every other route (**13/13** fetched routes carry the footer one) | `grep -oE 'id="shopify-section-[^"]+"' home.html \| grep -c custom_liquid` → 2; `for f in *.html; do grep -oE 'id="shopify-section-[^"]+"' $f \| grep -c custom_liquid; done` → 2,1,1,… |
| Dawn **13.0.0**, `theme_store_id` **887**, theme slot **t/5** | `grep -o 'Shopify.theme = {[^}]*}' home.html` |
| **15** `shopify-section` ids on `/` | `grep -oE 'id="shopify-section-[^"]+"' home.html \| wc -l` |
| **11** products, **4** pages, **4** collections, **2** blogs + **1** article, **23** sitemap URLs | `grep -c '<url>' sitemap_products_1.xml` → 12 (home + 11); `…pages…` → 4; `…collections…` → 4; `…blogs…` → 3 |
| Drainage Solutions **7**, Paver Solutions **4**, Top Sellers **2** products | `grep -oE '[0-9]+ products?' collections_*.html \| head -1`; `grep -c 'class="card-wrapper'` → 7 / 4 / 2 |
| **6** header menu items | `grep -oE 'class="header__menu-item[^"]*"[^>]*>\s*<span[^>]*>\s*[^<]+' home.html` (Home, Top Sellers, Drainage, Grass Pavers, Case Studies, Contact) |
| **3** slideshow slides, **7** collection buttons on `/` | `grep -c 'slideshow__slide' home.html` → 3; `grep -oE '<a[^>]*class="[^"]*button[^"]*"[^>]*>\s*[^<]+' home.html` (All Drainage Solutions ×2, All Paving Solutions, See All Drainage Solutions, See All Paver Solutions, All Products, See All NDS Products) |
| **11** `gtag_events`; **7** with an `AW-845953007/…` label; **3** with `MC-PHPLHH8KJY`; `AW-845953007` **7** occurrences; `G-7BGF2NM55P` **12**; `GTM-W9LGV4T` **1**; `UA-101865123-1` **2** | `grep -oE 'AW-[0-9]{6,}\|G-[A-Z0-9]{8,}\|UA-[0-9]+-[0-9]+\|GTM-[A-Z0-9]+' home.html \| sort \| uniq -c`; the regex pass over `webPixelsConfigList` (task-15-report.md §0.2) |
| **8** payment icons | `grep -c 'class="list-payment__item"' home.html` |
| **9** media items and **1** YouTube embed on the grass paver page; **41** `<img>` in its HTML | `grep -c 'class="product__media-item' products_ez-roll-grass-paver-4x150-roll.html`; `grep -o 'youtube.com/embed/[A-Za-z0-9_-]*' … \| sort -u` |
| FAQ: **7** visible questions, **4** headings, **2** in the `FAQPage` JSON-LD | rendered frame `$SCRATCH/ldp/probe/_pages_faqs.jpg`; `grep -c '"@type": "Question"' pages_faqs.html` → 2 |
| Contact form: **4** fields + Send; Email the only `*` | `pages_contact.html` (Dawn `form` section) and the rendered frame |
| **4** app-block apps (`tinyseo-seo-speed`, `instaindex`, GOAT, Essential) + **1** Section Store section | `grep -ohE 'BEGIN app block: shopify://apps/[^/]+' *.html \| sort -u`; `grep -oE 'cdn.shopify.com/extensions/[^/]+/[^/]+' *.html \| sort -u`; `grep -c 'ss-product-reviews-2' products_*.html` |
| Asset uploads **2024-01-07 → 2026-02-27** (36 distinct `files/`+`products/` assets); **3** filenames with WordPress suffixes | `grep -ohE '/(files\|products)/[A-Za-z0-9_.%-]+\?v=[0-9]{10}' *.html \| sort -u` → Unix timestamps; `grep -ohE '[A-Za-z0-9_-]+-(e[0-9]{13}\|scaled)[A-Za-z0-9_.-]*\.(jpg\|png\|webp)' *.html \| sort -u` → 3 |
| Home HTML **158,796** bytes, **56** `<script>` tags | `wc -c home.html`; `grep -c '<script' home.html` |
| Page heights at 1600 wide: `/` 4,383 · municipal 3,291 · contact 1,479 · product 6,278 · drainage 1,791 · article 4,268 · faqs 1,407 · top-sellers 1,446 px | `$SCRATCH/ldp/probe.mjs`, 18:27–18:28 UTC |
| `www` → **301** → apex; `http` → **301** → `https`; apex **200** | `curl -sS -o /dev/null -w '%{http_code} -> %{redirect_url}\n' https://www.landscapedrainageproz.com/` |

**Numbers deliberately NOT used on the page:** the cut outcome ("tripled the client's online
sales"); the client's tenure claims (60 / 40 / 70 / 120+ years); the client's prices and the
$2,000 free-shipping threshold as anything but what the captures show; the two telephone
numbers; the Universal Analytics property (dead weight, listed for the user); the store's
`myshopify` handle and theme id (identifiers, not claims).

---

## Unverifiable claims

For the user. **Not written on the page**, and no later task should promote one to a fact.

1. **"Tripled the client's online sales."** Cut in Task 5; nothing on the live site can
   support a sales, traffic or ranking figure. Stays cut.
2. **That a Google Ads campaign ran, when, at what spend, with what return.** The HTML proves
   seven conversion actions and a Merchant Center link exist on `AW-845953007`; it cannot
   prove a campaign was ever funded. The page says "conversion actions", never "campaign
   results".
3. **Which sections we wrote.** The two Custom Liquid sections, the per-product titles, the
   pasted FAQ schema and the app configuration carry no author. The page attributes the
   *build* to us as the current page already does, and describes each thing as it exists.
4. **When the work happened.** The site's own asset timestamps run 2024-01-07 → 2026-02-27;
   the header's `2026 · Shopify` is this site's convention for every case study
   (`work/content.ts:140-292`, all `2026 · …`), not a date read from the store.
5. **The client's tenure and market claims.** "Backed By Over 60 Years Of Drainage Supply
   Expertise" (home strip), "For over 40 years" (drainage collection), "over 70 years" and
   "a combined total of 120+ years" (municipal page), "Official NDS partner", "Best Prices
   Guaranteed", "the highest compressive strength of any grass paver on the market" — the
   client's copy, visible in the captures, never restated as ours.
6. **The reviews** in the Section Store slider (`Camron, 15 hours ago`; `Excellent Customer
   Service`) — typed into section settings, no verification mechanism visible.
7. **The Trustpilot-style green stars** in that slider are the section's own SVG, not a
   Trustpilot integration (no Trustpilot script or widget on any fetched route).

---

## Shot list

Three runner captures, one frozen cover left alone. Every entry names the sentence in
`content.ts` it is evidence for. Base: `https://landscapedrainageproz.com` — no boot, no port,
no env. Chromium 1600x1000 at DPR 2 with `scale: "css"`, `reducedMotion: "reduce"`.

**What must be hidden.** Nothing. Probed at 18:27–18:28 UTC over eight routes: no cookie
banner, no chat widget, no popup, no promo modal; the only fixed elements are Dawn's sticky
header (1600x118 at y=30 on every route) and, on the product page only, its sticky columns and
the closed media modal. The telephone number and e-mail in the footer are the business's own
published contact details, on every route by design — and the footer is below the fold at
1600x1000 on all three routes anyway.

**What cannot be captured, and why.** The product page: Dawn's gallery and modal hold 24
`loading="lazy"` images that never enter the viewport, and the runner's every-`<img>` gate
timed out at 15 s (probed once: 24 of 39 incomplete). Same class of failure as
`new-york-fine-foods.config.mjs` records for its truck carousel; the runner is outside this
task's paths, so the catalogue is shown by a collection page instead. The custom footer:
every route is taller than 1,000 px above it and the runner captures from the top; the frozen
cover already shows the home strip, the other Custom Liquid section. The contact page: its
`tel:` link renders white-on-white today (the sentence reads "Our phone number is        ."),
which is the client's defect to fix, and a frame of it would put that on our page; the FAQ
page carries the same form-or-call loop and the same two-way link to contact.

| `out` | Route | Evidence for |
| --- | --- | --- |
| `landscape-drainage-proz-municipal.jpg` (1600x1000, new) | `/pages/municipal-accounts` | "The buyer who will never use the cart gets a page of their own." — the flooded-field hero, the page H1 `Municipal Accounts`, the H1 `Municipal Drainage Solutions: Expertise in Field-Wide Challenges`, the opening paragraph and the first H2 `Trusted Drainage Expertise for Municipalities` |
| `landscape-drainage-proz-drainage.jpg` (1600x1000, new) | `/collections/drainage-solutions` | "Eleven products in two collections whose counts add up." — the H1 `Drainage Solutions`, the collection description, `Filter: Availability · Price`, `Sort by: Best selling`, `7 products`, and the first four cards with the compare-at price struck through beside the sale price |
| `landscape-drainage-proz-faqs.jpg` (1600x1000, new) | `/pages/faqs` | "Seven questions under four headings, and both pages point at each other." — the H1 `FAQs`, the line `If you can't find the answers to your questions, please contact us.`, the four group headings and the seven question rows, with the GOAT strip visible at the foot of the frame |
| `landscapedrainage.jpg` (frozen cover, 1200x750, committed 2026-09-02) | NOT re-captured | Used by `/work/`, the home grid, `/services/web-development/`, `/services/data-intelligence/` and `/process/` with alt "The Landscape Drainage Proz Shopify storefront", and as this page's header (`alt: ""`). Opened and checked against the live home page (probe frame, 18:27 UTC): it IS today's home page — the announcement bar, the six-item header, the blue Custom Liquid strip, slide 2 of 3 with `All Drainage Solutions`, the pause control and the rich-text opener. Every alt stays true. |

---

## Cross-page deltas

Two consistency edits, none applied by this task (the same retired wording in this page's
own `PROJECT_DESCRIPTION`, `PROJECT_HEADER.lead` and `PROJECT_INTRO.body` was rewritten in
Stage B). Each is `{file, anchor, replacement, reason}`; anchors are exact current strings, each verified to occur exactly once in its file
by `grep -cF` (table at the end). The rule behind all three: the retired wording "custom
Liquid, CTA design, Google Ads, and SEO" lists two service claims (Google Ads, SEO) that the
live site supports only as a conversion tag and a structured-data layer, so the echoes are
brought to the same evidence the page now uses.

1. `{file: "public/llms.txt", line: 32, anchor: "- [Landscape Drainage Proz](https://neuragul.com/work/landscape-drainage-proz/): A Shopify storefront for a drainage-products retailer, built with custom Liquid, CTA design, Google Ads, and SEO.", replacement: "- [Landscape Drainage Proz](https://neuragul.com/work/landscape-drainage-proz/): A Dawn storefront for an NDS drainage dealer: eleven products in two collections, two hand-written Custom Liquid sections, a municipal quote path, Google Ads conversion labels on seven checkout events, and structured data on every route.", reason: "the current line repeats the retired wording; the replacement is the new PROJECT_DESCRIPTION's facts in the llms.txt entry shape (llms.txt is orchestrator-owned)"}`
2. `{file: "src/components/site/services/web-development/content.ts", line: 254, anchor: "A national wine importer's catalog on Vintus, and a Shopify buildout for Landscape Drainage Proz with custom Liquid, CTA design, Google Ads, and SEO.", replacement: "A national wine importer's catalog on Vintus, and a Dawn storefront for Landscape Drainage Proz with two hand-written Custom Liquid sections, a municipal quote path and Google Ads conversion labels on the checkout events.", reason: "the service page's Storefronts paragraph carries the retired 'Google Ads, and SEO' service wording; 'SEO' as a bare claim is replaced by nothing (the storefront's structured data is an app's output) and 'Google Ads' by what the HTML shows"}`

**Sweep accounting** (`grep -rn -i "landscape\|drainage\|landscapedrainage" src/ public/llms.txt
.agents/product-marketing.md scripts/ docs/`, excluding `work/landscape-drainage-proz/` and this
dossier), every hit: `src/components/site/home/content.ts:295-300` → the home grid tile
(title, `2026 · Shopify`, cover, alt "The Landscape Drainage Proz Shopify storefront"),
correct; `src/components/site/work/content.ts:263-273` → the `PORTFOLIO_PROJECTS` entry
(`web-development` + `data-intelligence`, same alt), correct — see the note on
`data-intelligence` below; `src/components/site/services/web-development/content.ts:7` → a
header comment naming the project, correct; `:254` → **delta 2**; `:377-383` → the project
card (same alt), correct; `src/components/site/services/data-intelligence/content.ts:326-332`
→ the full-bleed project card (same alt), correct; `src/components/site/process/content.ts:212-213`
→ the slider image (same alt), correct; `public/llms.txt:32` → **delta 1**; `:19` and `:44`
("Next.js and Shopify sites"; "with Shopify and custom Liquid where a storefront calls for
it") → true of this project as shown, unchanged; `.agents/product-marketing.md:21, 59, 170` →
the project listed among the ten and in segment 1, correct; `scripts/check-assets.mjs:201` →
the frozen-cover exemption; `docs/superpowers/{specs,plans}/…` → this task's own row. No page
prints the cut outcome metric anywhere (`grep -rn -i "tripled" src/ public/` → hits only in the comments of this page's own two files, which Stage B rewrites).

**Notes for the user (no anchor, nothing to apply):**

- **`data-intelligence` on this project's `PORTFOLIO_PROJECTS` entry** (`work/content.ts:266-267`)
  and its full-bleed tile on `/services/data-intelligence/` predate this task. What the live
  site offers as evidence for it is the measurement layer: GTM, GA4, the web pixel's eleven
  events, seven Google Ads conversion labels and the Merchant Center link. The page's
  measurement section is written so that the tile has something behind it. If the user judges
  that a tag configuration does not earn the filter, the change is a `services`/`topServices`
  edit plus `check-filter-counts.mjs`, on the orchestrator's side.
- **The contact page's telephone link is invisible on desktop** (2026-09-11 ~18:30 UTC:
  `a[href^="tel:"]` computed `color: rgba(255, 255, 255, 0.85)` on white; the number is in the
  DOM). A one-line theme or inline style fix on the client's side.
- **Two telephone numbers.** The TinySEO `WholesaleStore` node says `(203) 261-4955` and
  opening hours 00:00–23:59 seven days; the custom footer and the contact page say
  `203-951-9409`, Mon–Fri 9–5 EST. One of the two app settings is stale.
- **The FAQ page's pasted markup** carries a nested `<body>`, `<meta charset>`, `<meta
  viewport>` and a second `<title>` inside Dawn's rich text, and its `FAQPage` lists 2 of the 7
  visible questions.
- **A Universal Analytics snippet (`UA-101865123-1`) is still served** on every route; UA
  stopped processing hits in 2023–24. The script id (`google-analytics-opt-out-js-after`) is
  the shape a WordPress plugin emits, consistent with the WordPress-suffixed image filenames.
- **Two `<h1>`s** on `/`, `/pages/about`, `/pages/municipal-accounts` and the article.
- **Dawn's `Organization` node ships nine empty `sameAs` strings** (the theme's social links
  settings are blank).
- **Header year.** Every case study header on this site reads `2026 · …`; the store's own
  asset timestamps start 2024-01-07. If the year is meant to date the engagement rather than
  the case study, this project's needs the user's own record.

### Anchor uniqueness (so the controller can apply by exact replacement)

Checked at `a5e401c` on 2026-09-11 with `grep -cF -- "<anchor>" <file>` and `grep -nF` for
the line:

| Delta | File | Line | Check | Occurrences | At cited line |
| --- | --- | --- | --- | --- | --- |
| 1 | `public/llms.txt` | 32 | single-line `grep -cF` | 1 | yes |
| 2 | `src/components/site/services/web-development/content.ts` | 254 | single-line `grep -cF` | 1 | yes |

Re-run the same check before applying if the file has moved on.
