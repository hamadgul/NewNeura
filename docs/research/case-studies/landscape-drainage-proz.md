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

---

## SEO engagement (2026-09 audit + phases)

Added 2026-09-25. **Source of record for this section:** the local engagement folder
`/Users/hamadgul/Projects/LDP /landscapedrainageproz.com-audit/` (the directory name ends in a
space; written as `$LDP/` below), read-only, plus the live store as fetched with `curl`
2026-09-25 ~19:15–19:25 UTC (desktop UA; saved to this session's scratchpad `ldp/page_*.html`).
`.env` and `phase1/.token` were not opened. Unlike everything above this line, this work *does*
have a local record: dated change logs, before/after backups and verification output. That
settles two items in *Unverifiable claims* for the SEO work only: **when** (2026-09-21 →
2026-09-24) and **who** (every change log is written by the operator making the Admin API /
theme edits, i.e. us). It does not settle them for the original build.

### What was deployed (change logs), and what is verified live today

"Verified live" = observed in the served HTML on 2026-09-25. "Log only" = the change log says it
shipped but curl cannot see it (visual, cart or admin-side).

| # | Change (date, source) | Live check 2026-09-25 |
| --- | --- | --- |
| 1 | **Redirect map repaired** (09-22, `$LDP/phase1/PHASE1-CHANGELOG.md` 1.1–1.3): 13 legacy WordPress 404s now 301; 2 redirects into a DRAFT product repointed; 9 two-hop chains flattened. Monitor: 70 redirects, all 1 hop → 200 (`$LDP/phase4/MONITOR-REPORT-2026-09-22.md`) | **Verified**: `/municipal-accounts/`, `/resources/`, `/ez-roll-grass-pavers-2/`, `/product-category/ancillary-products/`, `/collections/paver-solutions`, `/ez-roll-grass-pavers`, `/products/nds-864-pro-channel-kit-3-pack` each → one 301 to a live URL. `/blog` → home (the 09-24 plan's P2-22 still open) |
| 2 | **Dead tags removed** (09-22, 1.4): Universal Analytics `UA-101865123-1` opt-out + analytics.js, dead Google Customer Reviews badge | **Verified**: `UA-101865123` 0 occurrences on `/` (was 2 on 2026-09-11). GTM-W9LGV4T still 1; AW-845953007 still 7 |
| 3 | **Fake review widget removed** (09-22, 1.6): "Rated 4.6 / 5 based on 1289 reviews" + hard-coded "15 hours ago" timestamps; later "Verified" tag off and Trustpilot green → brand blue (`$LDP/cro/P0-CHANGELOG.md` #8) | **Verified**: "1289", "15 hours ago", "Verified", `#00B67A` absent on 4×150, Flo-Well, Tufftrack |
| 4 | **Collection renamed** "Paver Solutions" → **Grass Pavers**, hidden "Collection:" H1 prefix removed (1.7); Gravel Pavers collection created (2.4); Channel Drains + Catch Basins sub-collections (09-24, `$LDP/audit-2026-09-24/implementation/IMPLEMENTATION-SUMMARY.md` P1-13) | **Verified**: H1 `Grass Pavers`; sitemap collections = drainage-solutions, grass-pavers, top-sellers, gravel-pavers, channel-drains, catch-basins |
| 5 | **Titles/metas on every product and page** (09-22, 2.5, 4 §2): plain-ASCII NDS-branded titles, metas ≤160; home title set in theme | **Verified**: `/` = `NDS Grass Pavers & Drainage Products \| Landscape Drainage Proz`, meta 146 chars; 4×150 = `NDS EZ Roll Grass Pavers EZ4X150 4'x150' \| Free Shipping`; EZ-Flow = `NDS EZ-Flow French Drain \| Gravel-Free Prefab French Drain`; all 19 probed routes have 1 `<h1>` and a meta description |
| 6 | **One H1 per page** (2.11): logo `<h1>` → `<div>`, pasted body H1s demoted | **Verified**: 19/19 probed routes have exactly 1 `<h1>` (dossier above recorded 2 on four routes) |
| 7 | **Schema consolidated, then moved into the theme** (09-22 2.6/2.10/1.8/1.9/1.10; 09-24 `$LDP/audit-2026-09-24/implementation/theme/CHANGELOG.md`): duplicate Dawn Product node off; TinySEO store / product / website / breadcrumb / article embeds turned off; a new theme snippet `snippets/ldp-schema.liquid` emits WebSite, BreadcrumbList and Product with one Offer per variant incl. `shippingDetails` + `hasMerchantReturnPolicy`; one Organization `@id` with telephone + contactPoint + MerchantReturnPolicy; the wrong phone (203) 261-4955 in TinySEO's `WholesaleStore` removed with that node; municipal page `Article` → `Service`; case study 3 Article/BlogPosting nodes → 1; "NDS" removed from WebSite `alternateName` | **Verified** (JSON-LD parsed, 0 parse errors on 20 routes): `/` = WebSite + Organization + MerchantReturnPolicy, **no WholesaleStore**; products = Product, Offer, OfferShippingDetails, MerchantReturnPolicy, BreadcrumbList ×1, FAQPage; `/pages/municipal-accounts` = Service; case study = BreadcrumbList, Organization, 1 Article, no BlogPosting microdata; `alternateName` = `["LDP","LandscapeDrainageProz"]`; telephone `+1-203-951-9409`; "261-4955" 0 hits. TinySEO survives only as `tinyimg-collection-json-ld` on collections (CollectionPage + ItemList), kept on purpose |
| 8 | **Index hygiene** (2.10): 7 archived duplicate products deleted + 301'd; empty blogs and `/collections/frontpage` hidden from the sitemap; `/collections/all` `noindex, follow` | **Verified**: `/collections/all` robots `noindex, follow`; 33 sitemap `<loc>`s (incl. Shopify's `/agents.md`), no empty blogs |
| 9 | **Seven content pages written and published**: 3 paver guides (09-22, `$LDP/phase3/PHASE3-CHANGELOG.md` 3.1–3.3) and 4 drainage installation guides (09-24, `…/implementation/guides-a/CHANGELOG.md`, `guides-b/CHANGELOG.md`), each with TOC, spec tables sourced to NDS documents, FAQ + FAQPage + Article JSON-LD, team byline and "Last updated" | **Verified**: all 7 return 200 with the logged titles — `/pages/grass-driveway-pavers`, `/pages/permeable-driveway-pavers`, `/pages/fire-lane-overflow-parking-pavers`, `/pages/french-drain-installation-guide`, `/pages/dry-well-installation-guide`, `/pages/catch-basin-installation-guide`, `/pages/channel-drain-installation-guide`; each carries FAQPage + Article; byline "By the Landscape Drainage Proz team, an authorized NDS dealer. Product specs from NDS technical documents." |
| 10 | **Collection + product copy** (3.10, 2.3, 4 §1): below-grid content (`ldp-collection-content` section, `custom.seo_body` metafield) on Grass, Gravel, Drainage; 11 product descriptions restructured (spec tables, keyword H2s, FAQ); 7 drainage products rewritten | **Verified**: FAQPage on every collection probed and on 4×150 + EZ-Flow; spec text `53,683 psf` on 4×150 |
| 11 | **Spec and claim corrections against NDS documents** (3 "Spec fixes"; 4 §1; 09-24 P0-3): EZ Roll 57,890 → 53,683 psf; unsourced "100-year lifespan" and "crush-proof" removed from EZ-Flow; Flo-Well "50% more than peastone" → NDS's "250% more detention volume"; FAQ "58,000 lbs/sq ft" corrected; "Free Shipping" removed from titles where a cart test showed it was false; Tufftrack GTIN `05206300482` (11 digits) → `052063004822` (`$LDP/phase4/PHASE4-CHANGELOG.md`) | **Verified**: "100-year" / "crush-proof" 0 hits; "58,000" 0 on FAQs; Flo-Well prints "250% more detention volume than a gravel dry well"; Tufftrack page carries `052063004822` |
| 12 | **Internal linking** (2.8, 2.12, 09-24 P1-16): rebuilt footer, `ldp-related-links` section on products/collections, Guides + Drainage dropdowns in the main menu, case study linked from paver pages | **Verified** in part: the Guides dropdown (`Grass Driveway Guide` in the `/` HTML); the Drainage dropdown is in `…/implementation/final/screens/menu-drainage.png` |
| 13 | **Site-wide invisible links fixed** (2 follow-ups): Dawn set `--color-link` to `#ffffff` on white; 29 invisible links on 16 pages → 0 (`$LDP/phase2/invis_before.json` → `invis_after.json`); re-scanned 0 after every later pass | **Log only** (colour; not visible to curl). This is the root cause of the white-on-white `tel:` link the *Shot list* above refused to capture |
| 14 | **Speed work** (2.9; `$LDP/phase4/pagespeed-fixes/PAGESPEED-FIXES.md`; 09-24 theme #4–5): hero `fetchpriority`/preload, Swiper non-blocking, YouTube click-to-load facade, conditional announcement-bar CSS, homepage images re-encoded to WebP, phones no longer download the hidden desktop slide | **Verified** in part: instaindex `speculationrules` still present (1). The rest is log only |
| 15 | **Homepage "Authorized NDS Dealer" section** (09-24, `$LDP/nds-section/CHANGELOG.md`): H2 + six NDS product-line H3 tiles with keyword anchors, replacing a TinySEO heading block | **Verified**: `ldp_nds_dealer` section id on `/` |
| 16 | **Compare-at prices cleared** on all 22 variants (09-23, `$LDP/ez-roll-serp/fixes/FIXES-CHANGELOG.md`) because TinyIMG's StrikethroughPrice made Google show $2,532 instead of $2,110; grass/gravel collection intros de-duplicated (cannibalisation) | **Verified**: `StrikethroughPrice` 0 on 4×150 |

Also shipped in the same window but **not SEO** (listed so the page does not blur them in): CRO
cart/product changes (`$LDP/cro/P0-CHANGELOG.md`), per-item weight-tier shipping rates
(`$LDP/shipping/SHIPPING-CHANGELOG.md`), a UI/accessibility pass (axe 0 violations on 6 pages,
`$LDP/ui-review/UI-CHANGELOG.md`), a spacing pass (`$LDP/audit-2026-09-24/spacing/CHANGELOG.md`),
a desktop-hero change that disabled the home "60 Years" Custom Liquid strip
(`$LDP/ui-review/frontend-pass-2026-09-23/IMPL-CHANGELOG.md` #10).

**Only recommended / blocked (not deployed):** Search Console verification, sitemap submit and
request-indexing (owner; `$LDP/phase4/OWNER-CHECKLIST.md`); Merchant Center auto-tagging off
(`?srsltid=` duplicates) and diagnostics (LDP in 0 of the Popular Products carousels); a real
reviews app (no AggregateRating anywhere); Google Business Profile / Bing Places and `sameAs`
(only Facebook today); a named author; removing the privacy-policy address (auto-managed,
blocked); GTM removal (fires a second Ads account, owner decision); link building from
`$LDP/phase3/LINK-TARGETS.md` (123 gap domains, outreach manual, none done); `/llms.txt`
(platform-locked); more case studies. Weekly rank tracking was set up as a cron on the local
Mac (`$LDP/phase4/MONITORING.md`) but only the 2026-09-22 baseline run exists
(`$LDP/phase4/monitor/runs/`).

### Measured numbers, with date and source

| Metric | Before | After | Source | Usable on our page? |
| --- | --- | --- | --- | --- |
| Invisible (white-on-white) text links, 16 pages | 29 (09-22) | 0 (09-22; 0 on 22–24 pages in every later scan) | `$LDP/phase2/PHASE2-CHANGELOG.md`, `invis_*.json` | **Yes** — our own reproducible scan, a defect count, not an outcome |
| Legacy URLs returning 404 | 13 fixed; 9 chains flattened | 70 redirects, all 1 hop → 200 | `phase1/PHASE1-CHANGELOG.md`; `phase4/MONITOR-REPORT-2026-09-22.md` | **Yes** (spot-checked live) |
| Routes with >1 `<h1>` | 4 (dossier above, 09-11) | 0 of 19 probed (09-25) | this section's curl probe | **Yes** |
| JSON-LD on `/` | WholesaleStore (24/7 hours, wrong phone) + WebSite ×2 + empty `sameAs` ×9 | WebSite + one Organization with phone and return policy | dossier Stack (09-11) vs curl 09-25 | **Yes** |
| Product description readability (4×150, Flesch) | 27.9 | 49.1–49.9 | `rerun-2026-09-22/FULL-AUDIT-REPORT.md` A8; `phase4/MONITOR-REPORT-2026-09-22.md` | Possible, low value |
| axe WCAG A/AA contrast failures | 24 | 0 on 6 pages × 2 viewports | `ui-review/UI-CHANGELOG.md` | Not SEO; possible elsewhere |
| Mobile Lighthouse, home | 66 / LCP 13.1 s (09-21) | 87 / 2.8 s (09-22, single run) | `phase2/PHASE2-CHANGELOG.md` | **No** — the store's own logs call single runs bimodal (~57 vs ~90 on the same page, `PHASE4-CHANGELOG.md`); 09-24 runs of the same page read 69–76 (`implementation/theme/CHANGELOG.md`) |
| Mobile Lighthouse, 4×150 | 51 / 6.5 s | 78 / 3.3 s (09-22), 62–79 (09-24) | same | **No**, same reason |
| "SEO health score" | 50/100 (09-21, `FULL-AUDIT-REPORT.md`) · 43/100 (09-21 re-scored in `rerun-2026-09-22`) | 72/100 rubric, 74 → 76 dashboard (09-22); fresh audits 09-24: **73** (claude-seo) and **54** (seo skill) | `rerun-2026-09-22/FULL-AUDIT-REPORT.md`; `audit-2026-09-24/COMBINED-ACTION-PLAN.md` | **No** — self-scored by our own tooling, two rubrics disagree by 19 points on the same day, and the "before" is 50 or 43 depending on file |
| Ranked keywords / top-10 / est. traffic | 158 / 1 / ETV 59 (09-22 baseline) | 158 / 1 / ~59 visits (09-24) | `phase4/MONITOR-REPORT-2026-09-22.md`; `COMBINED-ACTION-PLAN.md` | **No** — no movement measured; the pages were published 09-22/24 and Google had not recrawled (`ez-roll-serp/FULL-AUDIT-REPORT.md` F1) |
| Target-keyword positions | 1 of 27 in top 100 (#36 "12x12 catch basin") | "ez roll grass paver" #16 mobile / #20 desktop (09-23) | `MONITOR-REPORT-2026-09-22.md`; `ez-roll-serp/FULL-AUDIT-REPORT.md` | **No** — different tools and devices a day apart; not a before/after |
| GSC clicks / impressions / positions | none | none | `phase4/OWNER-CHECKLIST.md` #6 (access never granted) | — no data exists |

### Overlap with, and contradictions of, the current case-study page

The 2026-09-11 page describes the store **before** this engagement. Much of it is now false on
the live site:

1. **`PROJECT_SEARCH` ("Structured data on every route")** — contradicted in five places:
   (a) "A structured-data app emits JSON-LD by route type" — the theme (`ldp-schema.liquid`) now
   emits it; TinySEO only does collections; (b) "The home page carries a WholesaleStore node" —
   removed; (c) "the case study and the municipal page Article" — municipal is now `Service`;
   (d) the quoted product titles ("EZ FLOW French Drain, Easy Water Drainage for Landscaping";
   "EZ Roll Grass Paver, 4 by 150 foot Roll") are replaced; (e) "the questions page a
   hand-placed FAQPage" — FAQPage is now on every guide, collection and product page, and the
   FAQ page's schema covers 7 of 7 questions (was 2). The canonical / www → apex sentences
   still hold.
2. **Decision 1 / `PROJECT_INTRO` / `PROJECT_DESCRIPTION` / `PROJECT_HEADER.lead` / details
   `Theme`** — "two hand-written Custom Liquid sections": the home strip `custom_liquid_CUM4JD`
   is disabled; only the footer one (`custom_liquid_DmdrPT`) is served (1 on `/`, 09-25), and
   the footer itself was rebuilt as a `<nav>` without the hexagon background.
3. **Frozen cover `landscapedrainage.jpg`** — the dossier says "it IS today's home page": no
   longer. The live home has a new H1 hero ("Grass pavers, gravel pavers and NDS drainage,
   shipped to your job site"), no blue strip, a 5-item header + "Request a quote" button. The
   alt text ("The Landscape Drainage Proz Shopify storefront") stays true; the dossier sentence
   does not. Used on five pages, so re-capturing is a cross-page decision for the user.
4. **Catalogue block** — "Paver Solutions four", "four collections", "four pages", "twenty-three
   URLs", "Top Sellers is a two-product subset", "each card showing the compare-at price struck
   through", "the header is six items", "the product handle the FAQ page still links to
   redirects" — all changed (Grass Pavers; 6 collections; 12 pages; 33 sitemap URLs; Top Sellers
   4; compare-at cleared; 5 items; FAQ link now direct).
5. **Captures** — `landscape-drainage-proz-drainage.jpg` shows struck-through compare-at prices
   that no longer exist; `landscape-drainage-proz-municipal.jpg` shows the body H1 that is now an
   H2; `landscape-drainage-proz-faqs.jpg` predates the spec corrections.
6. **Stack / `PROJECT_MEASUREMENT`** — the Stack table's UA snippet is gone (not on the page, but
   in the dossier). The measurement block (7 AW labels on 11 events) still verifies.
7. **Unverifiable 6–7** (the Section Store reviews, the Trustpilot-green stars) — the fake
   aggregate line and timestamps were removed by us and the stars recoloured; three named
   testimonials remain.

### Screenshot candidates (in `$LDP/`)

None is 1600x1000. All deployed-page shots are Playwright captures of the live store taken by
the verification passes, so they show real pages — but at 1366/1440/1280 widths and with the
state of that day. **Recommendation: re-capture the chosen routes with our runner at
1600x1000**; use these as the reference for what to frame.

| Path (under `$LDP/`) | px | Shows | Kind |
| --- | --- | --- | --- |
| `audit-2026-09-24/implementation/guides-a/screenshots/french-drain-installation-guide-desktop-top.png` | 1366x900 | Guide H1, team byline + "Last updated", quick answer, 10-item TOC | Real deployed page |
| `…/guides-a/screenshots/dry-well-installation-guide-desktop-top.png` | 1366x900 | Same layout, dry well guide | Real deployed page |
| `…/guides-b/screenshots/catch-basin-installation-guide-desktop-top.png`, `channel-drain-installation-guide-desktop-top.png` | 1280x900 | The two 09-24 drainage guides, top | Real deployed page |
| `…/guides-a/screenshots/*-desktop-full.png`, `…/guides-b/screenshots/*-desktop-full.png` | 1280–1366 x 8,488–9,652 | Whole guides (tables, FAQ) | Real; crop source |
| `nds-section/nds-desktop.png` | 1440x725 | Home "NDS Drainage Products…" H2 + six product-line tiles | Real deployed section |
| `audit-2026-09-24/implementation/final/screens/menu-drainage.png` | 1366x450 | Open Drainage dropdown (sub-collections) over the new home hero | Real deployed page |
| `audit-2026-09-24/implementation/content/screenshots/collections_drainage-solutions-desktop-full.png` | 1440x3588 | Drainage collection with the below-grid chooser table + FAQ | Real; crop source |
| `audit-2026-09-24/implementation/theme/screenshots/desktop-home.png`, `home-1440.png` | 1440x900 | New home hero (H1) | Real deployed page |
| `audit-2026-09-24/implementation/theme/screenshots/home-1920.png` | 1920x1000 | Same, wider | Real deployed page |
| `ez-roll-serp/fixes/shots/4x150-price-section.png` | 1440x900 | 4×150 "EZ Roll Grass Paver Price & Cost" section | Real deployed page |
| `audit-2026-09-24/spacing/final/desktop_*.png` (13 routes) | 1440x900 | Latest top-of-page state of home, collections, products, guides, FAQ, contact | Real deployed pages |
| `ui-review/diagram/grass-paver-base-cross-section.png` (+ `base-section.svg`, 1200x620) | 1920x992 | Grass paver base cross-section diagram (4/6/8 in. #57 base), drawn from the NDS detail; uploaded to Shopify Files and used on two guides | Real deployed asset (a diagram, not a page) |
| `phase4/images/nds-ez-roll-grass-paver-ez4x150-top-view.jpg`, `…-specs.jpg` | 2048x2048 | Product image + spec infographic built from NDS photography | Deployed product media (NDS's photography — not ours to show as our work) |
| `phase2/image-contact-sheets/*.jpg` (11) | — | Alt-text working sheets | Working files, not for the page |
| `SEO-REPORT-agentic.html`, `rerun-2026-09-22/SEO-REPORT-agentic-after-fixes.html` | HTML | Audit dashboards | Audit charts — do not use (self-scored) |
| `audit-2026-09-24/claude-seo/screenshots/*`, `seo-skill/screenshots/*` | 1366x900 / 750x1624 | Auditors' page captures | Real pages, audit context |

Not in the folder: `screenshots/` at the root is empty.

### Unverifiable claims (SEO engagement)

1. **Any ranking, traffic, click or impression gain.** No GSC access was ever granted; the only
   rank data is a 09-22 baseline and a 09-24 re-read showing no movement. Nothing may say the
   work "improved rankings".
2. **Any sales or conversion effect.** The user's rule stands: no sales claims. (`$LDP/cro/`
   contains a store-analytics baseline and `ui-review` a "2-year gross sales" ordering; neither
   was opened for this section and neither goes on the page.)
3. **The health scores** (50, 43, 72, 73, 54) — our own tools grading our own work, mutually
   inconsistent.
4. **Lighthouse before/after** — single lab runs the logs themselves call bimodal.
5. **"~96% of organic visibility lost since January 2024 (est. 1,382 → 55 visits/mo)"**
   (`FULL-AUDIT-REPORT.md` headline) — a DataForSEO estimate of the client's traffic; a traffic
   figure, so out under the existing rule.
6. **That the WordPress → Shopify migration (Aug/Sep 2024) caused the drop** — the audit's
   inference from Wayback + estimates, not a measurement.
7. **"Real-browser LCP 0.46–0.66 s"** — one Playwright run under throttling; not field data.
8. **The competitor figures** (landscapediscount 2,978 keywords, etc.) — third-party
   estimates about other businesses; not ours to print.
9. **That the invisible-link fix, readability or schema changes affected search** — they are
   verifiable as *changes*, not as *effects*.

### Proposed page changes

Facts only; copy to be written in the page's voice ("we", no headcount, no outcome).

1. **Rewrite `PROJECT_SEARCH` (block 8)** as the audit-and-repair story. Points:
   - We audited the live store on 2026-09-21 and shipped fixes over the next four days.
   - Structured data now comes from one theme snippet, not three sources: one Organization with
     the correct phone and return policy; Product with one Offer per variant, each carrying
     shipping details and the return policy; a three-level breadcrumb; Service on the municipal
     page; one Article on the case study.
   - Removed: a store node that published 24/7 hours and a wrong phone number; a duplicate
     Product node; a struck-through "compare-at" price that made Google show $2,532 for a $2,110
     roll (quote only if the user agrees the client's price can appear as our fact; otherwise
     "a higher crossed-out price").
   - Keep the canonical / www sentences; keep "Nothing here claims a ranking."
2. **New `BlockMediaDoubleQuote` or `BlockImageFull`: "Seven guides, specs from the
   manufacturer's documents".** Points: 3 paver guides + 4 drainage installation guides; every
   spec table sourced to an NDS document; FAQ blocks with matching FAQPage markup; team byline
   and "Last updated" date. Capture: re-shoot `/pages/french-drain-installation-guide` at
   1600x1000 (the top frame shows H1, byline, TOC).
3. **New `BlockWysiwyg`: "What the migration left behind".** Points: 13 old WordPress URLs
   returned 404, two redirects led to an unpublished product, nine chains took two hops; now 70
   redirects, each one hop to a live page. One `<h1>` per route (four routes had two). Seven
   archived duplicate products deleted and redirected; empty blogs out of the sitemap.
4. **New `BlockWysiwyg` (or fold into 3): "Taking out what wasn't true".** Points: a hard-coded
   "4.6 out of 5 from 1,289 reviews" line and fake "15 hours ago" timestamps removed; review
   stars no longer styled as a third-party verified badge; claims not in the manufacturer's
   documents removed ("100-year lifespan", "crush-proof") and spec figures corrected to NDS's
   (53,683 psf); a "free shipping" title removed after a cart test showed it applied only over
   $2,000; an 11-digit barcode corrected to a valid 12-digit UPC. This is the strongest
   proof-shaped block available and needs no result figure.
5. **Optional line in 3 or 4:** every text link on white was rendering white (a theme colour
   variable); 29 invisible links across 16 pages → 0.
6. **Update stale facts elsewhere** (see *Contradictions*): "two Custom Liquid sections" (×5
   places), the catalogue block's counts, the details row (`Pages` → "11 products · 6
   collections · 33 sitemap URLs"; `Theme` drop "two Custom Liquid sections"), `Stack` row may
   add nothing new; `PROJECT_MEASUREMENT` still holds.
7. **Captures:** the drainage and municipal captures no longer match the live store; re-capture
   or replace (candidates: `/collections/drainage-solutions` below-grid chooser, the home NDS
   dealer section). The frozen cover is shared by five pages — a user decision.
8. **Do not add:** any score, Lighthouse number, ranking, traffic, click, sales or conversion
   figure; the owner-blocked items as if done (reviews app, GBP, GSC, link building).

### Implemented on the page (2026-09-25)

Proposals 1–7 above are in `src/components/site/work/landscape-drainage-proz/content.ts` and
`src/app/work/landscape-drainage-proz/page.tsx` (14 blocks now). New constants: `PROJECT_GUIDES`
+ `PROJECT_IMAGE_GUIDE`, `PROJECT_REPAIRS`, `PROJECT_CORRECTIONS`; `PROJECT_SEARCH` rewritten.
Every sentence was re-checked by curl on 2026-09-25 (~19:35 UTC) except the 29 → 0
invisible-link count (log only, `phase2/invis_*.json`) and the 70-redirect monitor result
(`phase4/MONITOR-REPORT-2026-09-22.md`; seven legacy paths spot-checked live). Choices made:

- The $2,532 strikethrough figure is **not** printed (proposal 1's condition); the page says
  search results showed the compare-at price "in place of the price a buyer pays".
- The "Free Shipping" title removal is **not** printed: log only. The 4×150 title still ends
  `| Free Shipping`, which is true ($2,110 is over the $2,000 threshold); the logged removals
  were on other products and were not re-checked by curl.
- The quote page (`/pages/request-a-quote`) and the municipal page's four steps are CRO work
  (`cro/P0-CHANGELOG.md` #9, `cro/p1/P1-CHANGELOG.md` "Municipal page"), described in the
  existing quote-path block as live state, not in the SEO blocks.
- New live facts used: six collections by `products.json` (drainage-solutions 7, grass-pavers
  4 incl. the gravel roll, gravel-pavers 1, channel-drains 3, catch-basins 2, top-sellers 4);
  every variant `compare_at_price: null`; footer `custom_liquid_DmdrPT` = 3 columns, `#0055a5`,
  17 links (Shop 8, Resources 9), `max-width: 749px` → 1 column; four WordPress-suffixed
  photo filenames (three `-e<2017 timestamp>`, one `-scaled`); FAQ page JSON-LD 7 Questions;
  web pixel still 7 `AW-` labels, 3 `MC-`, `GTM-W9LGV4T`; two guide bylines word the NDS
  source differently ("NDS technical documents" / "NDS catalogs, technical specifications and
  installation details").
- `PROJECT_TITLE` is now "Landscape Drainage Proz: Shopify Build and SEO";
  `PROJECT_HEADER.service` is "Web Development · Data Intelligence · SEO" (probed in the live
  slot: one line 360–1920, two lines at 320 with no collision).

### Shot list addendum (2026-09-25)

All five images re-shot from the live store with the runner's recipe under
`channel: "chrome"` (scratch copy; `scripts/shots/landscape-drainage-proz.config.mjs` now lists
all five, the cover as `cover:landscapedrainage.jpg`). No fixed overlay/popup on any route.

| File | px | Bytes | Shows |
| --- | --- | --- | --- |
| `landscapedrainage.jpg` (cover, frozen name) | 1200x750 | 147,622 | New home: announcement bar, five-item header + Request a quote, hero panel "Grass pavers, gravel pavers and NDS drainage, shipped to your job site" over the parking-lot photo |
| `landscape-drainage-proz-guide.jpg` (new) | 1600x1000 | 178,030 | `/pages/french-drain-installation-guide` top: H1, byline + "Last updated September 24, 2026", opening answer, 10-item TOC |
| `landscape-drainage-proz-drainage.jpg` | 1600x1000 | 129,752 | Drainage Solutions: Shop by type line, `7 products`, four cards at one price each |
| `landscape-drainage-proz-municipal.jpg` | 1600x1000 | 209,526 | Municipal page: flooded field, quote button + phone, "How Municipal Ordering Works" |
| `landscape-drainage-proz-faqs.jpg` | 1600x1000 | 81,925 | FAQ page: new subheading, 7 questions under 4 headings (mostly white page, hence the low byte count) |

The new guide file follows the page's existing `landscape-drainage-proz-*` naming (required by
`scripts/shots/_schema.mjs`), not `landscapedrainage-guide.jpg`. The dossier's 2026-09-11 line
"it IS today's home page" for the cover is superseded by this row.

## Cross-page deltas (2026-09-25)

Not applied (outside this task's file ownership). Supersedes the two deltas in *Cross-page
deltas* above: `web-development/content.ts` no longer contains "two hand-written" (its line 265
already reads "a hand-written Custom Liquid section" and is still true), and the `llms.txt` line
has moved to 33. The six cover usages (`home/content.ts:391`, `work/content.ts:286`,
`services/web-development/content.ts:399`, `services/data-intelligence/content.ts:333`,
`process/content.ts:212`, `services/seo/content.ts:275`) keep alt "The Landscape Drainage Proz
Shopify storefront", which stays true of the re-shot cover: no change.

| # | File:line | Current text (exact) | Replace with (exact) | Why |
| --- | --- | --- | --- | --- |
| 1 | `public/llms.txt:33` | `A Dawn storefront for an NDS drainage dealer: eleven products in two collections, two hand-written Custom Liquid sections, a municipal quote path, Google Ads conversion labels on seven of its eleven storefront events, from page view to purchase, and structured data on every route.` | `A Dawn storefront for an NDS drainage dealer, then an SEO audit and repair: structured data moved into the theme, 70 redirects each landing in one hop, one H1 per page, a fake review rating and unsourced product claims removed, and seven guides with specs from NDS documents. Also a municipal quote path and Google Ads conversion labels on seven of eleven storefront events.` | Two collections → six; two Custom Liquid sections → one; the SEO work was missing |
| 2 | `src/components/site/services/seo/content.ts:197` | `Seven installation guides for Landscape Drainage Proz with specifications from the manufacturer's own documents,` | `Seven guides for Landscape Drainage Proz, four of them installation guides, with specifications from the manufacturer's own documents,` | Three of the seven are paver guides (grass driveways, permeable driveways, fire lanes), not installation guides |
| 3 | `src/components/site/services/seo/content.ts:182` | `Landscape Drainage Proz got an audit and then four days of repairs to the live store:` | `Landscape Drainage Proz got an audit and then three days of repairs to the live store:` | Audit 2026-09-21; every change log is dated 09-22, 09-23 or 09-24 (the window is four days *including* the audit day). Alternatively keep "four days" and drop "then" |
| 4 | `src/components/site/services/seo/content.ts:117` | `Every item on the list gets fixed, not filed.` | `Every item on the list goes on a fix list with a date.` — or simply delete the sentence | Style only: an "X, not Y" antithesis, which `.agents/product-marketing.md:238` bans. The facts in the line (redirect chains, 29 invisible links, four pages with two headings) verify |

**One-sentence summary for the SEO service page:** For Landscape Drainage Proz we audited a live
Shopify store and repaired it over three days: structured data now comes from one theme snippet
with the right phone number and shipping details, seventy redirects each land in one hop, every
page checked has one H1, a hard-coded "4.6 out of 5 from 1,289 reviews" line and unsourced
product claims are gone, and seven new guides take their specs from NDS documents.
