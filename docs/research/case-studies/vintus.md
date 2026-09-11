# Vintus — case-study dossier

Source of record: **the live production site, `https://vintus.com`, and nothing else.** There
is no local source (the plan's row: "live site only", "No local source."). Every line in this
file names the URL and the UTC time it was observed, or the command run over the saved HTML
(`$SCRATCH/vintus/*.html`, 27 HTML documents, the WordPress sitemap index and its 12 children,
`robots.txt`, the theme's `style.css` and two `wp-json` GETs, all fetched 2026-09-11
18:55–19:20 UTC with a desktop Chrome user agent). Nothing was taken from memory, and nothing
on the page claims a result.

The page it backs: `/work/vintus/` — `src/components/site/work/vintus/content.ts` and
`src/app/work/vintus/page.tsx`.

**What "live only" means for every claim.** A claim survives onto the page only if the served
HTML or a rendered frame shows it today. What the HTML cannot show — who built which part, when
the engagement ran, what runs behind the login, whether any service outside WordPress exists,
what any of it returned — is listed under *Unverifiable claims* for the user and never printed.
Read-only throughout: `curl` GETs, two `wp-json` index GETs (the post-type index and one
`per_page=1` count per type, read for their `X-WP-Total` header), one Playwright pass over
twelve routes; no form submitted, no sign-in, no sign-up, no sell sheet generated, no
newsletter or SMS subscription. There is no age gate, cookie banner or chat widget on any
route (Shot list).

---

## Stack (verified)

Read from the served HTML of `/` on 2026-09-11 18:55 UTC (`$SCRATCH/vintus/home.html`,
168,882 bytes, 200, 0 redirects) and the response headers.

| Component | Observed | Where |
| --- | --- | --- |
| Platform | **WordPress 7.1** (`<meta name="generator" content="WordPress 7.1" />` on 15/15 fetched routes); `wp-json`, `xmlrpc.php?rsd`, `wp-login.php`, `admin-ajax.php` endpoints | `grep -ohE '<meta name="generator"[^>]*>' *.html \| sort \| uniq -c` → 15 |
| Theme | **`vintus`**, a custom theme: `wp-content/themes/vintus/style.css` header reads `Theme Name: Vintus` / `Theme URI: vintus.com` / `Description: Custom WordPress theme for Vintus` / **`Author: EventCreate`** / `Author URI: https://www.eventcreate.com` / `Version: 1.0` / `Tags: wine, events`. Bootstrap 3 (`assets/bootstrap.min.css`, `navbar navbar-default`, `col-md-8 col-md-offset-2`, `modal fade`) and Font Awesome 4 (`fa fa-instagram`) under the theme; no other theme directory referenced on any route | `curl -sS https://vintus.com/wp-content/themes/vintus/style.css \| head -10` (19:17 UTC); `grep -ohE 'wp-content/themes/[a-z0-9_-]+' *.html \| sort \| uniq -c` → `vintus` 167, nothing else |
| Content types | REST index `/wp-json/wp/v2/types` (19:17 UTC) lists three custom types beside WordPress's own: **`accounts`** (`Accounts`), **`producers`** (`Producers`), **`wines`** (labelled **`Products`**, `rest_base: wines`). A fourth, **`distributors`**, is in the sitemap index but not in the REST index (not `show_in_rest`) | `python3 -c 'import json; …'` over `$SCRATCH/vintus/wp-types.json` |
| Counts (published, public) | **2,304 wines · 161 producers · 6,039 posts · 43 pages · 19,017 media items · 10 users · 0 public accounts**; **379 distributors** (sitemap only) | `curl -sS -D - -o /dev/null 'https://vintus.com/wp-json/wp/v2/<type>?per_page=1' \| grep -i x-wp-total` (19:18 UTC); `grep -o '<url>' wp-sitemap-posts-distributors-1.xml \| wc -l` |
| Plugins (by asset path) | **Search & Filter Pro** (`search-filter-pro`, four forms: ids `9` producers, `113866` labels, `50` materials, `34` news); **Ajax Search Pro** (`ajax-search-pro`, the header search and the sell-sheet wine search; its WooCommerce add-on script is registered but there is no WooCommerce on the site); **Gravity Forms** (`gravityforms`, the *Share Trade Material* form and the reCAPTCHA iframes on the sell-sheet and subscribe pages); **Brevo** (`mailin`, the newsletter); **WP SMS** (`wp-sms`, `admin-ajax.php?action=wp_sms_subscribe` / `_verify_subscribe` / `_unsubscribe` endpoints); **`cgt-blocks`** | `grep -ohE 'wp-content/plugins/[a-z0-9_-]+' *.html \| sort \| uniq -c` → wp-sms 90, gravityforms 60, mailin 45, search-filter-pro 23, cgt-blocks 15, ajax-search-pro 15 |
| WooCommerce / cart | **None.** The only `woocommerce` string on any route is the Ajax Search Pro add-on's script registration; no `wc-`, `add-to-cart`, `cart`, checkout or price-list markup; the only price on a wine page is `Suggested Retail Price $35` | `grep -c -i woocommerce home.html` → 1 (the ASP addon path); `grep -oE 'wc-[a-z-]+' *.html` → nothing |
| Measurement | Google Analytics 4 `G-6YHJEHXH69` (38 occurrences across the fetched routes); no GTM container, no `AW-`, no `UA-` | `grep -ohE '(GTM-[A-Z0-9]+\|G-[A-Z0-9]{8,}\|UA-[0-9]+-[0-9]+\|AW-[0-9]{6,})' *.html \| sort \| uniq -c` |
| Fonts / media | Adobe Typekit `use.typekit.net/urr0vod.css` (`museo-sans` in `style.css`); Cloudinary `res.cloudinary.com/dzo0tmplh` in the CSP and on the home page | `grep -ohE 'use\.typekit\.net/[a-z0-9]+\.css\|res\.cloudinary\.com/[a-z0-9_-]+' home.html` |
| Edge | `server: nginx`; `strict-transport-security: max-age=31536000; includeSubDomains`; `x-frame-options: SAMEORIGIN`; `x-content-type-options: nosniff`; `referrer-policy: strict-origin-when-cross-origin`; a full `content-security-policy` (`default-src 'self'`, allow-lists for jsDelivr, unpkg, Google, Brevo, Typekit, Cloudinary, Vimeo, SoundCloud; `form-action 'self'`; `base-uri 'self'`); a `permissions-policy` that disables geolocation, camera, microphone, payment, USB and sensors | `curl -sS -D home.headers -o home.html https://vintus.com/` (18:55 UTC) |
| Hosts | apex is canonical: `https://www.vintus.com/` → 301 → `https://vintus.com/`; `http://` → 301 → `https://`; `<link rel="canonical" href="https://vintus.com/">` | `curl -sS -o /dev/null -w '%{http_code} -> %{redirect_url}\n' <url>` |
| Sitemap | WordPress core sitemap (`/wp-sitemap.xml`, `robots.txt` → `Sitemap: https://vintus.com/wp-sitemap.xml`); 12 children; `/sitemap.xml` 301s, `/sitemap_index.xml` 404s (no SEO plugin) | `curl -sS https://vintus.com/wp-sitemap.xml` (19:00 UTC) |
| Structured data | **None.** No `application/ld+json` and no `@type` on any of the 15 fetched routes | `for f in *.html; do grep -c '"@type"' $f; done` → 0 ×15 |

**No test suite, no repository, no manifest.** Nothing here is a version we chose; it is what
the site serves. No test count exists for this project and none is stated anywhere.

---

## Architecture decisions

Five a reader can check against the live site rather than an adjective. This section
describes each thing as it exists; who built which part is Unverifiable 1 and is not asserted
in the copy.

**1. A catalogue of 2,304 wines under 161 producers, one URL per vintage.** The REST index
labels the `wines` type *Products* and counts 2,304 published (19:18 UTC); the sitemap's two
wine children carry 2,000 + 304 URLs. A wine's bare URL redirects to its current vintage:
`/wines/crozes-hermitage/` → 302 → `/wines/crozes-hermitage/e-guigal-crozes-hermitage-2020/`
(19:11 UTC). That page's hero is three `<select>`s: **57** producers, **26** E. Guigal wines,
**6** vintages (2015–2020), each option a URL. Its left rail is five in-page anchors
(`#overview`, `#reviews`, `#news`, `#materials`, `#otherwines`); the body carries the
description, *Vineyard*, *Winemaking*, *Vintage* and *Tasting Note* paragraphs, four spec
bullets (Color Red, Appellation Crozes-Hermitage, Alcohol 13.5 %, Suggested Retail Price $35),
two scored reviews (Wine Spectator 92, 2023-09-22; James Suckling 91, 2023-05-25), two related
news posts, one tech sheet, and the producer's other wines. The producer page
(`/producers/chateau-margaux/`, 19:11 UTC) has the same shape one level up: hero selects for
producer and wine (*All Wines*), anchors Overview / Wines / Trade Materials, the estate text
with *Show more*, and a wine card per wine with its tech-sheet control (decision 3). Wines
sit under producers in the URL (`/wines/<wine>/<vintage>/`, `/producers/<producer>/`), and the
two browse pages filter the same objects: `/browse-producers` by country (6 options), the
labels and materials pages by producer and by wine (decision 2).

**2. Every post, label image and trade material is keyed to a producer and a wine.** Four
Search & Filter Pro forms: `/browse-producers` (form 9, `_sfm_estate_location[]`, All
Countries / Argentina / France / Italy / New Zealand / Spain / United States; 57 producer
cards); `/browse-labels` (form 113866, `_sfm_wine_producer[]` **59** producer options,
`_sfm_all_title_clone[]` **1,060** wine options, a Material Type radio: All Items / Bottle
Shot / Labels; rows dated to the day, the newest *Far Mountain Monte Rosso Vineyard Bottle
Shot, September 11, 2026*); `/browse-materials` (form 50, `_sfm_post_related_producer[]` 54
producers, `_sfm_post_related_wines[]` **1,029** wines); `/browse-news` (form 34, the same two
related-producer / related-wine facets, *Toggle View: Grid / List (filterable)*, the newest
post *Standing Up for Cabernet Sauvignon, September 09, 2026*). The facet names are the
mechanism: posts carry `post_related_producer` and `post_related_wines` fields, labels carry
`wine_producer` and a wine title, producers carry `estate_location`. The 6,039 posts are the
news layer, and each wine page's *News* section is that join run the other way (decision 1).
`/producers-summary/` is the portfolio as one page grouped by country and region (United
States → Napa Valley …; France → Champagne, Bordeaux, Burgundy, Beaujolais, Loire, Rhône,
Languedoc, Provence; Italy → Tuscany, Piedmont, Veneto, Friuli, Abruzzo, Basilicata, Puglia,
Sicily; Spain; Argentina; New Zealand; Spirits).

**3. Trade tools that produce documents: a tech sheet with the rep's own price, a sell
sheet from a search, a share-by-e-mail form.** On a producer page every wine card carries
`Tech Sheet ▾`, which opens `form.pricing_form` (`method="post"`, hidden `wine_id`,
`post_price_prod`, `parent_slug`): two checkboxes, **Add Pricing** (reveals a `price` text
field, `maxlength="80"`) and **Show Onboarding Specs**. The sell-sheet generator
(`/sell-sheet-generator/`, `<title>Sell Sheet Generator</title>`, 19:11 UTC) is one page:
*Select Wine(s)* (an Ajax Search Pro box: "Search by brand, wine and/or vintage"), Sheet
Title, Your Name, Date (prefilled 09/11/2026), Contact Info, *Include Reviews*, an optional
Recipient Email Address, *Generate Sell Sheet*, behind reCAPTCHA; the page's own
instructions say "Then Download or email the PDF sell sheet." Producer and wine pages carry a
Gravity Forms *Share Trade Material* modal: hidden user e-mail and material name, *Send to*,
*Select Material* (Technical Sheet / Case Card / Shelf Talker / Staff Training Card), an
optional message. The Trade Tools menu is nine items: Product Images, Point-Of-Sale, Media,
Producers, Producers Summary, Trade Materials, About, Reviews, Create Sell Sheet. The
materials page's rows are shelf talkers and tech sheets as PDFs (`/wp-content/uploads/2026/04/
Ponzi-Vineyards-Pinot-Gris-2024-Shelf-Talker.pdf` …).

**4. A login with a dashboard, orders and notes behind it, and a sign-up.** The header's
*Sign in* is `wp-login.php?redirect_to=%2Fmy-dashboard`; *Sign Up* is `/subscribe`. Three
pages answer `You must be logged in to view this page.` to a visitor: `/my-dashboard`
("My personal dashboard with the latest updates from the producers I follow."), `/my-orders/`
(`<title>My Orders</title>`), `/my-notes/` (in the pages sitemap; not fetched). The pages
sitemap also lists `/update-profile/`, `/unsubscribe/`, `/marketing-requests/`,
`/container-report/`, `/scoresearcher/` (`VINTUS Directory Bot`, one button *Open Request
Hub*) and `/chatbot/`. What any of these do for a signed-in user is not in the served HTML
(Unverifiable 3).

**5. Two subscription channels and a distributor directory.** `/subscribe/` is a Brevo form:
Email, First Name, Last Name, Company, State, *I am a* (Distributor / Restaurant / Retail /
Press / Consumer), two newsletter preferences (*Weekly Automated Newsletter — Every Monday,
scores, news and releases*; *Special Announcements*), a consent checkbox. WP SMS registers
subscribe / verify / unsubscribe `admin-ajax` actions on every route. The `distributors` type
holds 379 posts; the one fetched (`/distributors/tryon-distributing-nc/`, 19:18 UTC) is an
event sign-up card: *Event Details*, *Sign Up*, the distributor's name, *Direct (410)
980-8370*. The footer on every route: *Vintus on Instagram*, *Interested in NY
Distribution?*, `© VINTUS LLC, 2026`, Contact Us, Privacy Policy, Alcohol Disclaimer.

**Supporting observations:**

- **The home page** (frozen cover): the header (wordmark, search, PRODUCERS ▾, TRADE TOOLS ▾,
  NEWS ▾, REVIEWS, ABOUT, SIGN IN, SIGN UP), the H1 *Building a National Wine Import Business
  From Scratch* over a vineyard photograph, a *Search producers and wines* box, the
  SevenFiftyDaily teaser and *READ MORE*. Below the fold: *The Latest* (four tiles: Fall
  Rarities, Trésor Hunting, the newsletter, Gift Packs & Large Formats), *Producers* with the
  sentence **"We represent 40 benchmark producers in leading and emerging wine regions across
  10 countries and 4 continents."** and 57 producer `<h2>`s with a paragraph each.
- **The about page**: founded April 2004 by Michael Quinttus; "sold through a network of
  distributors in all 50 states and the Caribbean"; **"Wine Enthusiast Importer of the Year
  2017"**; an executive team list. The client's copy; quoted on our page only with
  attribution.
- **Contact**: `info@vintus.com`, `(914) 769 3000`, 48 West 38th Street, New York, NY 10018
  (VINTUS and VNY, Suite 1101).
- **Uploads** in the fetched HTML span `wp-content/uploads/2018/06` → `2026/09` (49 distinct
  year/months; producer photographs and the theme's hero images are 2018/07–2018/08, the
  favicon `cropped-Vintus-Web-V` is 2026/06, the tech-sheet arrow 2025/06).

---

## Gaps — in the site, absent from the page

The 2026-09-07 page had three blocks and six words of substance ("e-commerce", "large,
structured catalog", "inventory management, order processing, and customer-relationship
tooling", "WordPress and PHP … Python services"). Checkable capability it said nothing about:

1. **What the catalogue is** (decision 1): the counts, the URL shape, one URL per vintage, the
   three hero selects, the wine page's sections.
2. **What "structured" means** (decision 2): four filter forms over related-producer and
   related-wine fields; posts, labels and materials keyed to the catalogue.
3. **The trade tools** (decision 3): the tech sheet with a rep's own price, the sell-sheet
   generator, the share form, the nine-item menu.
4. **The login and what sits behind it** (decision 4): a dashboard, orders and notes, only
   their titles visible.
5. **The subscription channels and the distributor cards** (decision 5).

All five shape the rewritten page. Three claims on the old page get no support and are cut:
"e-commerce" (no cart, checkout or price list; decision 4 is the nearest thing), "inventory
management" (nothing), "Python services" (Unverifiable 2). "Leading" is cut; the site's own
*Importer of the Year 2017* line is quoted with attribution instead.

---

## Audience, objection, primary action

Per `.agents/product-marketing.md` §2, segment 1 — **a local service-business owner**. This one
is a wine importer whose customers are distributors, restaurants, retailers and press (the
subscribe form's *I am a* list) in all 50 states (about page). The reader is someone like
them: a business whose catalogue runs to thousands of items with a hierarchy (producer → wine
→ vintage), whose sales reps need documents from it every day, and whose site has to serve the
trade rather than sell a bottle.

**The objection this page has to answer:** *"A WordPress site is a WordPress site. What is
actually in it?"* Every decision above is an answer with a URL behind it: the counts from the
REST headers; one URL per vintage; four filter forms whose facet names show the joins; a tech
sheet that takes the rep's price; a sell sheet from a search; the pages behind the login. The
page argues *mechanism*, never adjectives and never a sales figure.

**Secondary objection**, per §2: *"is this their one good project?"* — answered by the range
(`/work/` puts a 2,304-wine catalogue beside a routing solver) and by the specificity here.

**The primary action** is `/contact/` via `GeneralCta`. The CTA line names this reader's own
situation: a catalogue that has outgrown the site that holds it.

**What the page must not do:** claim e-commerce, a cart, inventory or order processing (none
is served); claim any service outside WordPress (Unverifiable 2); say which parts we built
(Unverifiable 1); quote a traffic, sales or ranking figure; say anything about the wines'
quality in our voice; restate the client's *40 benchmark producers*, *50 states*, *Importer of
the Year* as ours (they are quoted as the client's copy); quote a price or a timeline for our
work; claim a headcount; say "I".

---

## Verifiable numbers

Each with the command that proves it, run over `$SCRATCH/vintus/` (the HTML saved 2026-09-11
18:55–19:20 UTC) or against the live site at the time given.

| Number | Command / location |
| --- | --- |
| **2,304** wines · **161** producers · **6,039** posts · **43** pages · **19,017** media · **10** users · **0** public accounts | `for t in wines producers posts pages media users accounts; do curl -sS -A "$UA" -D - -o /dev/null "https://vintus.com/wp-json/wp/v2/$t?per_page=1" \| grep -i x-wp-total; done` (19:18 UTC) |
| **379** distributors; sitemap children **12**; posts 2,000 + 2,000 + 2,000 + 39; wines 2,000 + 304; pages 43; producers 161; categories 7; tags 82; users 10 → **9,025** URLs | `for f in wp-sitemap-*.xml; do echo "$f $(grep -o '<url>' $f \| wc -l)"; done`; `grep -c '<sitemap>' wp-sitemap.xml` |
| Latest `<lastmod>`: producers **2026-09-11T10:58:59-04:00**, wines **2026-09-11T11:08:57-04:00**, posts **2026-09-09T13:46:54-04:00** | `grep -oE '<lastmod>[^<]*' wp-sitemap-posts-<type>-1.xml \| sort \| tail -1` |
| WordPress **7.1** on 15/15 routes; theme `vintus` **167** asset references, no other theme | `grep -ohE '<meta name="generator"[^>]*>' *.html \| sort \| uniq -c`; `grep -ohE 'wp-content/themes/[a-z0-9_-]+' *.html \| sort \| uniq -c` |
| `style.css` header: `Author: EventCreate`, `Version: 1.0`, `Tags: wine, events` | `curl -sS https://vintus.com/wp-content/themes/vintus/style.css \| sed -n 1,10p` |
| REST custom types **3** (`accounts`, `producers`, `wines`/Products) | `curl -sS https://vintus.com/wp-json/wp/v2/types \| python3 -c 'import json,sys; [print(k) for k in json.load(sys.stdin)]'` |
| Wine hero selects **57 / 26 / 6**; anchors **5**; reviews **2**; SRP `$35` | `python3` over `wine_crozes-hermitage-2020.html`: `re.findall(r'<select[^>]*>(.*?)</select>', w, re.S)` → option counts; `re.findall(r'class="link-scroll" href="#([a-z]+)"', w)`; `grep -c 'Wine Spectator\|James Suckling'` on the `#reviews` section |
| `/wines/crozes-hermitage/` → **302** → `…/e-guigal-crozes-hermitage-2020/`; `/producers/e-guigal/` → 301 → `/producers/e-guigal-2/` | `curl -sS -o /dev/null -w '%{http_code} -> %{redirect_url}\n' <url>` (19:11, 19:20 UTC) |
| Search & Filter Pro forms **4** (ids 9, 113866, 50, 34); country options **6**; labels producers **59**, wines **1,060**; materials producers **54**, wines **1,029** | `grep -ohE "data-sf-form-id='[0-9]+'" browse-*.html \| sort -u`; `python3`: count `<option>` inside each named `<select>` |
| `/browse-producers` **57** producer cards (114 links, 57 distinct) | `grep -oE 'href="https://vintus\.com/producers/[^"]+"' browse-producers.html \| sort -u \| wc -l` |
| Home: **57** producer `<h2>`s; the *40 benchmark producers* sentence **1**; lorem ipsum **1** (`Quisque interdum…` under *The Latest*) | `grep -c '<h2>   ' home.html`; `grep -c 'We represent 40' home.html`; `grep -c 'Quisque interdum' home.html` |
| Header menu **5** top items (PRODUCERS, TRADE TOOLS, NEWS, REVIEWS, ABOUT) + SIGN IN + SIGN UP; Trade Tools **9** items; News **3** (News, Videos, Listen) | `python3`: `<ul class="dropdown-menu">` walks over `home.html` |
| Tech-sheet form fields: `pricing`, `price` (`maxlength="80"`), `pricing1`, hidden `wine_id`, `post_price_prod`, `parent_slug` | `python3`: `h[h.find('Add Pricing')-500 : +300]` over `producers_chateau-margaux_.html` |
| Share Trade Material options **4** (Technical Sheet, Case Card, Shelf Talker, Staff Training Card) | text extraction of `producers_chateau-margaux_.html` after `Select Material` |
| Subscribe: **8** visible fields, *I am a* **5** options, **2** newsletter preferences | text extraction of `subscribe_.html` |
| Gated pages **3** fetched-or-listed (`/my-dashboard`, `/my-orders/`, `/my-notes/`); the two fetched print `You must be logged in to view this page.` | `grep -c 'You must be logged in' my-dashboard.html my-orders_.html` → 1, 1 |
| Plugins **6** (wp-sms 90, gravityforms 60, mailin 45, search-filter-pro 23, cgt-blocks 15, ajax-search-pro 15) | `grep -ohE 'wp-content/plugins/[a-z0-9_-]+' *.html \| sort \| uniq -c \| sort -rn` |
| GA4 `G-6YHJEHXH69` **38**; GTM/AW/UA **0** | `grep -ohE '(GTM-[A-Z0-9]+\|G-[A-Z0-9]{8,}\|UA-[0-9]+-[0-9]+\|AW-[0-9]{6,})' *.html \| sort \| uniq -c` |
| JSON-LD **0** on 15/15 routes; empty `<title></title>` on **6** of 20 fetched HTML documents (`/`, `/browse-producers`, `/browse-labels`, `/browse-materials`, `/browse-news`, `/my-dashboard`) | `for f in *.html; do grep -oE '<title>[^<]*</title>' $f \| head -1; done` |
| Home HTML **168,882** bytes, **36** `<script>` tags | `wc -c home.html`; `grep -c '<script' home.html` |
| Page heights at 1600 wide: `/` 2,317 · producers 3,700 · Margaux 2,711 · Crozes 2020 11,004 · sell sheet 1,701 · labels 4,644 · materials 5,594 · subscribe 1,845 · summary 2,671 · reviews 5,721 · news 6,472 · videos 4,713 px | `$SCRATCH/vintus/probe.mjs`, 19:13–19:16 UTC |
| `www` → **301** → apex; `http` → **301** → `https`; apex **200** | `curl -sS -o /dev/null -w '%{http_code} -> %{redirect_url}\n' https://www.vintus.com/` (18:55 UTC) |

**Numbers deliberately NOT used on the page:** the client's *40 benchmark producers / 10
countries / 4 continents*, *50 states*, *April 2004*, *20th anniversary*, *Importer of the
Year 2017* (quoted only as the client's copy where used at all); the telephone numbers and the
street address; the GA4 property id, form ids and the Cloudinary cloud name (identifiers, not
claims); the 19,017 media count (a library size, not a catalogue claim); the `$35` retail
price (the client's, visible only in the dossier).

---

## Unverifiable claims

For the user. **Not written on the page**, and no later task should promote one to a fact.

1. **Which parts of the site are our work.** The theme's `style.css` header credits
   **EventCreate** (`Author: EventCreate`, `Author URI: https://www.eventcreate.com`,
   `Version: 1.0`, `Tags: wine, events`), and the producer photographs and hero images were
   uploaded in 2018/07–2018/08; the newest uploads are 2026/09 and the sitemap's latest
   `lastmod` is today. The served HTML cannot say who wrote the theme's templates, the
   post-type registrations, the filter forms, the tech-sheet and sell-sheet code, or the
   gated pages, nor when. **The copy therefore describes each mechanism as it exists and
   makes no "we built" claim about any part of it** — the same rendered state as the
   2026-09-07 page, whose only "we" was a tab label that `projectIntroTabs` overwrites. If
   the user's record says which parts are ours (the catalogue structure, the trade tools,
   the login area, the hosting, or the whole site since a given date), that is the sentence
   to add, and the report names the slot.
2. **"Python services doing the work underneath"** (the old `PROJECT_INTRO.body` and the
   `Stack` row; also `services/cloud-infrastructure/content.ts:114, 216`). No route serves a
   trace of anything outside WordPress: every dynamic endpoint on the fetched pages is
   `admin-ajax.php` or `wp-json`; the CSP's `connect-src` is `'self'` plus Google. A backend
   service may exist and be invisible from the browser; the page cannot say so. Cut here;
   the service-page echoes are Cross-page deltas 4–5 for the user to decide.
3. **What the gated pages do.** `/my-dashboard`, `/my-orders/`, `/my-notes/`,
   `/update-profile/`, `/marketing-requests/`, `/container-report/`, `/chatbot/`,
   `/scoresearcher/` (*VINTUS Directory Bot*, *Open Request Hub*) exist; only their titles
   and one sentence each are served to a visitor. "Order processing", "inventory management"
   and "customer-relationship tooling" on the old page are not supported by anything served;
   the page says "a My Orders page behind the login" and no more.
4. **"E-commerce."** No cart, checkout, price list or payment integration is served on any
   fetched route, and the site's own header says *Sign in / Sign Up*, not *Shop*. The only
   price shown is a *Suggested Retail Price*. The old page's category word, the `Platform`
   row, the `2026 · E-commerce` location on three listing tiles and the llms.txt line are
   all corrected (deltas 1–3).
5. **"Leading."** No third party on the site ranks the importer; the about page's own line
   *Wine Enthusiast Importer of the Year 2017* is the nearest thing and is quoted as the
   client's copy, attributed.
6. **When the work happened.** Uploads span 2018/06 → 2026/09; the header's `2026 · …` is this
   site's convention for every case study, not a date read from Vintus.
7. **The client's copy** — *40 benchmark producers … 10 countries and 4 continents*, *all 50
   states and the Caribbean*, *the greatest collection of exceptional wines in the world*,
   *Importer of the Year 2017*, every review score — is quoted only as theirs, never restated,
   and nothing on our page says anything about the wines' quality.
8. **The 379 "distributors."** The one fetched is an event sign-up card, which with the
   theme's `Tags: wine, events` suggests the type holds distributor events; one of 379
   sampled, so the page says "a distributor directory of 379 entries" and nothing about what
   each holds.

---

## Shot list

Three runner captures, one frozen cover left alone. Every entry names the sentence in
`content.ts` it is evidence for. Base: `https://vintus.com` — no boot, no port, no env.
Chromium 1600x1000 at DPR 2 with `scale: "css"`, `reducedMotion: "reduce"`.

**What must be hidden.** Nothing. Probed at 19:13–19:16 UTC over twelve routes
(`$SCRATCH/vintus/probe.mjs`, the runner's own gates): no cookie banner, no age gate, no chat
widget, no popup, no `position: fixed` or `sticky` element with a box on any route; the only
iframes are Gravity Forms' reCAPTCHA anchors (sell sheet, subscribe) and empty `about:blank`
frames. The alcohol disclaimer is a footer link, not a gate. `hideSelectors` is therefore
unused, and no capture needed a declaration of any kind.

**What cannot be captured, and why.** *Producer and wine pages*: every one carries a
`<div class="hidden">` fancybox gallery of `loading="lazy"` `<img>`s that never enter the
viewport, so the runner's every-`<img>` gate times out at 15 s (Château Margaux: 5 of 16
incomplete; Crozes-Hermitage 2020: 5 of 34; both probed 19:13 UTC). Sampled **8 of 161**
producers by HTML (`chateau-margaux`, `gorgona`, `settlement`, `ginraw`, `anseillan`,
`bonanto`, `poggio-al-tufo`, `casisano`): all eight carry the hidden gallery (1–3 lazy
`<img>` each inside `div.hidden`), so no wine page passes either. Same class of failure as
`landscape-drainage-proz.config.mjs` records for Dawn's product gallery; the runner is
outside this task's paths, so the catalogue's hierarchy is shown by the producers page and
described from the saved HTML. *`/browse-materials`*: its rows use `<img src="…/*.pdf">`
(four shelf-talker PDFs as image sources), which never decode — a live defect that also
times out the gate. *`/reviews`*: 26 `<img>`s whose `src` is the page URL itself; same
failure. *`/browse-labels`*: passes the gate (5,011 ms) but its hero photograph is an
"Augmented Reality App" promo whose own type sits under the page's H1 in the 1600x1000
frame; rejected as a frame of our page. *`/subscribe/`* and *`/producers-summary/`*: pass, but
at 1600x1000 the first is a Brevo form and the second is two-thirds hero; both are
described in the copy instead.

| `out` | Route | Evidence for |
| --- | --- | --- |
| `vintus-producers.jpg` (1600x1000, new) | `/browse-producers` | "Fifty-seven producers on one page, filtered by country." — the H1 *OUR PRODUCERS*, the estate paragraph, the *COUNTRY: All Countries* Search & Filter panel, and the first twelve producer cards (Far Mountain … Xavier Milhade Wines) each with a thumbnail and a region line |
| `vintus-news.jpg` (1600x1000, new) | `/browse-news` | "Every post is keyed to a producer and a wine." — the H1 *News*, *Toggle View: Grid / List (filterable)*, the *PRODUCER / WINE* filter panel, and the first three dated posts (Standing Up for Cabernet Sauvignon, September 09, 2026; The 30 Best Sauvignon Blancs for 2026; Robb Report …) |
| `vintus-sell-sheet.jpg` (1600x1000, new) | `/sell-sheet-generator/` | "A sell sheet is a search, a title and a name." — the H1 *Generate a Sell Sheet*, the instructions paragraph, *Select Wine(s)* with its search box, Sheet Title, Your Name, Date (prefilled), Contact Info, *Include Reviews*, Recipient Email Address (optional) |
| `vintus.jpg` (frozen cover, 1200x750, committed 2026-09-02) | NOT re-captured | Used by `/work/`, the home grid, `/services/web-development/`, `/services/cloud-infrastructure/` and `/process/` with alt "The Vintus wine importer storefront", by `/about/` (`alt: ""`, the large media slot) and as this page's header (`alt: ""`). Opened and checked against the live home page (probe frame `$SCRATCH/vintus/probe/_.jpg`, 19:13 UTC): it IS today's home page — the header with its seven items, the H1, the *Search producers and wines* box, the SevenFiftyDaily teaser, *READ MORE*. Every alt stays true as a picture; "storefront" as a word is delta 6. |

---

## Cross-page deltas

Consistency edits, none applied by this task. Each is `{file, anchor, replacement, reason}`;
anchors are exact current strings, each verified to occur exactly once in its file by
`grep -cF` (table at the end). The rule behind them: the retired words "e-commerce",
"inventory management, order processing and customer-relationship tooling" and "Python
services" are not supported by anything the live site serves (Unverifiable 2–4), so the
echoes are brought to the same evidence the page now uses. Deltas 4–5 change a service page's
story and are the user's call; delta 6 is a word choice the user may keep.

1. `{file: "public/llms.txt", line: 31, anchor: "- [Vintus](https://neuragul.com/work/vintus/): E-commerce for a leading wine importer — a large structured catalogue and the operations behind it.", replacement: "- [Vintus](https://neuragul.com/work/vintus/): A wine importer's trade portal on WordPress: 2,304 wines under 161 producers, one URL per vintage, four filter forms keyed to producer and wine, a tech sheet with the rep's own price and a sell-sheet generator.", reason: "the current line repeats the retired 'e-commerce' and 'leading'; the replacement is the new PROJECT_DESCRIPTION's facts in the llms.txt entry shape (llms.txt is orchestrator-owned)"}`
2. `{file: "src/components/site/work/content.ts", line: 226, anchor: "    location: \"2026 · E-commerce\",", replacement: "    location: \"2026 · WordPress\",", reason: "the /work/ tile's location string names a category the live site does not serve; every other tile names its platform (Shopify, Fly.io …), and this page's own header now reads 2026 · WordPress; the string occurs once in the file (no other tile uses the E-commerce word), verified below"}`
3. `{file: "src/components/site/home/content.ts", line: 284, anchor: "    location: \"2026 · E-commerce\",", replacement: "    location: \"2026 · WordPress\",", reason: "the home grid's Vintus tile carries the same retired category word; same replacement as delta 2"}`
4. `{file: "src/components/site/services/cloud-infrastructure/content.ts", line: 114, anchor: "The Vintus storefront carries a national wine importer's catalog, with inventory management, order processing and customer-relationship tooling behind it. WordPress and PHP on the surface, Python services doing the work underneath.", replacement: "The Vintus site carries a national wine importer's catalogue of 2,304 wines under 161 producers on WordPress, with a login, a sell-sheet generator and a tech sheet that takes a rep's own price behind it.", reason: "'inventory management, order processing and customer-relationship tooling' and 'Python services' are not served by any route (dossier, Unverifiable 2–3); the replacement names what the live site shows. The paragraph continues with the restaurant portal sentence, which is untouched"}`
5. `{file: "src/components/site/services/cloud-infrastructure/content.ts", line: 216, anchor: "Fly.io for the routing platform, Square's own infrastructure behind the ordering portal, WordPress and PHP with Python services under the Vintus storefront. The host follows the workload.", replacement: "Fly.io for the routing platform, Square's own infrastructure behind the ordering portal, WordPress behind nginx with a strict content-security policy under the Vintus site. The host follows the workload.", reason: "'Python services' is Unverifiable 2; 'nginx' and the CSP are the served headers (dossier, Stack → Edge), which is the cloud-and-infrastructure evidence this project actually offers"}`
6. `{file: "src/components/site/services/cloud-infrastructure/content.ts", line: 221, anchor: "Vintus runs a national wine import catalog with inventory management, order processing and customer-relationship tooling behind it.", replacement: "Vintus runs a national wine importer's catalogue, 2,304 wines under 161 producers, with the trade's tools and a login behind it.", reason: "same three unsupported nouns as delta 4, in the service page's project-card lead"}`

**Alt strings — a note, not a delta.** Five files carry `alt: "The Vintus wine importer
storefront"` (`home/content.ts:288`, `work/content.ts:231`,
`services/cloud-infrastructure/content.ts:304`, `services/web-development/content.ts:370`,
`process/content.ts:208`). The picture is today's home page, so the alt is true as a
description of the frame; "storefront" is loose for a site with no cart. If the user wants
the word changed, `"The Vintus wine importer's home page"` is true in all five, and each
anchor occurs once per file (`grep -cF 'alt: "The Vintus wine importer storefront"'` → 1 in
each). Not filed as a delta because the current string is not false, only imprecise.

**Sweep accounting** (`grep -rn -i "vintus" src/ public/llms.txt .agents/product-marketing.md
scripts/ docs/`, excluding `work/vintus/` and this dossier), every hit:
`src/app/sitemap.ts:63` → the route in the sitemap, correct;
`src/components/site/home/content.ts:51` → a comment ("Vintus is a national importer", the
about page's *all 50 states*), correct; `:283-288` → the home grid tile: **delta 3** for the
location, alt noted above; `src/components/site/shared/blocks/BlockHeaderProjects.tsx:15-18`
→ a comment describing the cover's nav collision, still accurate (the nav reads PRODUCERS ·
TRADE TOOLS · NEWS · REVIEWS · ABOUT today), no change; `src/components/site/about/content.ts:147`
→ a comment ("the wine importer's storefront"), `:167` → the large media slot with `alt: ""`,
the frozen cover, correct; `src/components/site/work/content.ts:224-231` → the
`PORTFOLIO_PROJECTS` entry: **delta 2**, alt noted; `services/cloud-infrastructure/content.ts:10`
→ a header comment naming the project, correct; `:114` → **delta 4**; `:216` → **delta 5**;
`:221` → **delta 6**; `:298-304` → the project card (alt noted), `:337` → its placement,
correct; `services/web-development/content.ts:254` → "A national wine importer's catalog on
Vintus, …" — the Vintus half is true; the line is already Task 15's delta 2 anchor, and its
replacement keeps the Vintus clause unchanged, so nothing is filed here (one anchor, one
owner); `:364-370` → the project card (alt noted), `:405` → placement, correct;
`process/content.ts:33` → a comment, `:208` → the slider image (alt noted), correct;
`public/llms.txt:31` → **delta 1**; `.agents/product-marketing.md:21, 59, 170, 266` → the
project listed among the ten, in segment 1, and in open question 4 (client naming), correct;
`scripts/check-assets.mjs:199` → the frozen-cover exemption; `docs/research/case-studies/
foodtruckrentals.md:422-423`, `packship.md:442-443`, `landscape-drainage-proz.md:328` → other
tasks' sweeps citing this page's old line numbers (`work/vintus/content.ts:14, :84`), which
Stage B moves; those are historical records of what was checked at the time, not live claims,
and are not edited; `docs/superpowers/{specs,plans}/…` → this task's own row. No page prints a
sales, traffic or ranking figure for this project (`grep -rn -i "vintus" src/ public/ | grep
-iE "sales|traffic|rank"` → nothing).

**Notes for the user (no anchor, nothing to apply):**

- **The theme header credits EventCreate** (Unverifiable 1). The page is written without a
  "we built" claim; if the user's record names our part, the slot is `PROJECT_INTRO.body`'s
  first sentence and the storefront section's first sentence (report §5).
- **Service filters.** The `PORTFOLIO_PROJECTS` entry lists `cloud-infrastructure` and
  `web-development`. What the live site offers as cloud-and-infrastructure evidence is the
  edge: nginx, HSTS, a full CSP and permissions policy, Cloudinary and Typekit. The page's
  stack tab names those so the tile has something behind it. If a header set does not earn
  the filter, the change is a `services`/`topServices` edit plus `check-filter-counts.mjs`,
  on the orchestrator's side.
- **Live-site defects noticed, not ours to fix:** lorem ipsum (`Quisque interdum, dui
  vulputate…`) under *The Latest* on the home page; an empty `<title></title>` on `/`, the
  four browse pages and `/my-dashboard`; `/browse-materials` rows whose `<img src>` is a PDF;
  `/reviews` with 26 `<img>`s whose `src` is the page URL; `jQuery(...).datepicker is not a
  function` thrown on `/sell-sheet-generator/` (the Date field still prefilled); a hidden hero
  on `/browse-producers` whose H1 reads `Our Producers93`; a `test-wine-1` in the wines sitemap
  and an `xyz-distributor` in the distributors sitemap; `/producers/e-guigal/` and
  `/producers/finca-decero/` living at `-2` slugs; Ajax Search Pro's WooCommerce add-on
  registered with no WooCommerce; no JSON-LD on any route; the home page saying *40
  benchmark producers* while the page lists 57.
- **Header year.** Every case study header on this site reads `2026 · …`; the site's uploads
  start 2018/06. If the year is meant to date the engagement rather than the case study, this
  project's needs the user's own record.

### Anchor uniqueness (so the controller can apply by exact replacement)

Checked at `7899882` on 2026-09-11 with `grep -cF -- "<anchor>" <file>` and `grep -nF` for
the line:

| Delta | File | Line | Check | Occurrences | At cited line |
| --- | --- | --- | --- | --- | --- |
| 1 | `public/llms.txt` | 31 | single-line `grep -cF` | 1 | yes |
| 2 | `src/components/site/work/content.ts` | 226 | single-line `grep -cF` | 1 | yes |
| 3 | `src/components/site/home/content.ts` | 284 | single-line `grep -cF` | 1 | yes |
| 4 | `src/components/site/services/cloud-infrastructure/content.ts` | 114 | single-line `grep -cF` | 1 | yes |
| 5 | `src/components/site/services/cloud-infrastructure/content.ts` | 216 | single-line `grep -cF` | 1 | yes |
| 6 | `src/components/site/services/cloud-infrastructure/content.ts` | 221 | single-line `grep -cF` | 1 | yes |

Re-run the same check before applying if the file has moved on.
