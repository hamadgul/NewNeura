/**
 * Content for `/work/landscape-drainage-proz/`.
 *
 * Provenance for every string here is recorded in
 * `docs/research/case-studies/landscape-drainage-proz.md`. The original build
 * has NO local source (`~/Projects/ShopifySite` holds one dotfile), so its
 * claims are traced to the LIVE store, `https://landscapedrainageproz.com`.
 * The 2026-09 SEO engagement DOES have a local record (dated change logs,
 * backups and verification output under `~/Projects/LDP /…-audit/`), read in
 * the dossier's "SEO engagement (2026-09 audit + phases)" section. Every
 * sentence below was re-checked against the store as served on 2026-09-25;
 * the one fact that curl cannot see (the invisible-link count, a colour) is a
 * "log only" row in that section. What neither source can show is listed in
 * the dossier's two "Unverifiable claims" lists and never printed here: any
 * ranking, traffic, click, Lighthouse, health-score, sales or conversion
 * figure. The source's outcome claim, "tripled the client's online sales,"
 * was cut in Task 5 and stays cut.
 *
 * Image sizing note: `width`/`height` are each file's true decoded pixels
 * (1200x750 for the frozen cover, 1600x1000 for the four runner captures),
 * because `next/image` reserves the aspect ratio from them. All five were
 * re-shot from the live store on 2026-09-25 (dossier, Shot list addendum).
 *
 * VOICE — "we", never "I"; no headcount. The client's own figures (tenure
 * claims, prices, the free-shipping threshold) appear in the captures as the
 * client's copy and are quoted, never restated as ours.
 *
 * ── What the 2026-09-25 update changed ──────────────────────────────────────
 * Added the SEO engagement: `PROJECT_SEARCH` is now the structured-data
 * audit-and-repair story, and three blocks are new (`PROJECT_GUIDES` +
 * `PROJECT_IMAGE_GUIDE`, `PROJECT_REPAIRS`, `PROJECT_CORRECTIONS`). Stale
 * facts fixed: one Custom Liquid section is served now (the home strip was
 * switched off 2026-09-23), six collections, twelve pages, 33 sitemap URLs,
 * a five-item header with a quote button, no compare-at prices, the quote
 * page and the municipal page's four steps. `service` gains "SEO".
 */
import type { BlockHeaderProjectsProps } from "@/components/site/shared/blocks/BlockHeaderProjects";
import type { BlockImageFullProps } from "@/components/site/shared/blocks/BlockImageFull";
import type { BlockIntroDoubleProps } from "@/components/site/shared/blocks/BlockIntroDouble";
import type { BlockMediaDoubleQuoteProps } from "@/components/site/shared/blocks/BlockMediaDoubleQuote";
import type { BlockWysiwygProps } from "@/components/site/shared/blocks/BlockWysiwyg";
import type { GeneralCtaProps } from "@/components/site/shared/blocks/GeneralCta";
import type { ProjectDetail } from "@/components/site/shared/blocks/BlockProjectDetails";

const IMAGES = "/site/images";

/**
 * The `<title>` stem, suffixed by the root layout's `"%s — NeuraGul"` template.
 *
 * This is NOT the project's display name — `PROJECT_HEADER.title` is, and it
 * still reads "Landscape Drainage Proz" on the page and in the breadcrumb. The
 * two diverge on purpose: an `<h1>` sits under a header that has already
 * established what the page is, while a `<title>` is read cold in a result
 * list, so it has to name the category of work as well as the client.
 * `PROJECT_TITLE` is referenced only by `metadata` in the route file.
 */
export const PROJECT_TITLE = "Landscape Drainage Proz: Shopify Build and SEO";
export const PROJECT_CANONICAL = "/work/landscape-drainage-proz/";
/**
 * The meta description, ~155 characters. "Dawn" is `Shopify.theme.schema_name`;
 * "eleven products" is the products sitemap; "structured data and redirects"
 * are dossier SEO rows 1 and 7; "seven guides … NDS" is row 9.
 */
export const PROJECT_DESCRIPTION =
  "A Dawn storefront for an NDS drainage dealer, then an SEO audit: structured data and redirects repaired, and seven guides written from NDS spec documents.";
export const PROJECT_OG_IMAGE = `${IMAGES}/landscapedrainage.jpg`;

/**
 * The apex, which is the canonical host: `www` 301s to it and every route's
 * `rel="canonical"` names it (dossier, Stack). Verified live 2026-09-11.
 *
 * `BlockProjectDetails` renders its values as plain `<span>`s with no anchor,
 * so the details row prints the readable host and this constant is where the
 * addressable URL survives.
 */
export const PROJECT_LIVE = {
  url: "https://landscapedrainageproz.com",
  label: "Live site",
  display: "landscapedrainageproz.com",
} as const;

/**
 * Header. `lead` is the engagement in one line: the theme (`Shopify.theme`),
 * then the SEO pass (dossier SEO rows 1-16) and its seven guides (row 9).
 * LENGTH IS MEASURED: the 2026-09-11 note put the ceiling at 87 characters
 * (four lines at 320/360/390, lead.bottom - meta.top = -0.9 at 1280). This
 * lead is 78. Swapped into the live slot with `textContent` on 2026-09-25
 * (scratch `slot2.mjs`): lead bottom 219 vs meta top 256 at 1280 and 1440.
 *
 * `service` gains "SEO" (page.tsx splits it on " · " for the CreativeWork's
 * `about`). Same probe: one line at 360-1920; at 320 it drops below the
 * location and wraps to two lines (bottom 369, `<h1>` top 394), no overlap.
 *
 * The cover is the live home page as re-shot 2026-09-25 at 1200x750: the
 * announcement bar, the five-item header with the Request a quote button, and
 * the new hero panel over the parking-lot photograph with its three buttons.
 */
export const PROJECT_HEADER: BlockHeaderProjectsProps = {
  title: "Landscape Drainage Proz",
  lead: "A Dawn storefront for a drainage dealer, then a search audit and seven guides.",
  location: "2026 · Shopify",
  service: "Web Development · Data Intelligence · SEO",
  breadcrumbLabel: "Work",
  breadcrumbHref: "/work/",
  backLabel: "All work",
  image: {
    src: `${IMAGES}/landscapedrainage.jpg`,
    alt: "",
    width: 1200,
    height: 750,
  },
};

/**
 * Block 2 — `BlockIntroDouble`, the two-label variant.
 *
 * `statement` is the brief. "NDS dealer": the home page's NDS dealer section
 * (`ldp_nds_dealer`); "contractors and municipalities": `/pages/about`;
 * "$2,110": the Top Sellers first card and `"price":"2110.00"` on the 4x150
 * product; "quoted": `/pages/request-a-quote` and `/pages/municipal-accounts`.
 * "carried over": four product photographs keep WordPress media-library
 * suffixes (decision 6). "September 2026": SEO section, 2026-09-21 → 09-24.
 * `body` is the stack as served 2026-09-25: Dawn 13.0.0; one `custom_liquid`
 * id (`DmdrPT`); `ldp-schema.liquid` (theme changelog 09-24); TinySEO only as
 * `tinyimg-collection-json-ld`; `apps/instaindex`; the goat-badges extension;
 * GTM + GA4 + the web pixel; predictive search; customer accounts; eight
 * `list-payment__item`s. `projectIntroTabs` overwrites both labels.
 */
export const PROJECT_INTRO: BlockIntroDoubleProps = {
  labels: ["The brief", "What we built"],
  activeLabel: 0,
  statement:
    "An NDS drainage dealer selling to contractors and municipalities: a catalogue of eleven products carried over from an earlier site, a $2,110 roll of grass paver as the top seller, and municipal orders that start with a quote request. In September 2026 we came back to audit how the store reads to a search engine.",
  body: "Shopify on the Dawn theme, version 13, with a footer written by hand as a Custom Liquid section. Structured data comes from a snippet in the theme; the TinySEO app still marks up the collection pages. Two more apps: instaindex for prerender rules and a trust-badge app. Google Tag Manager, Google Analytics 4 and a Google Ads conversion tag through a Shopify web pixel. Predictive search, customer accounts and eight payment methods, Shop Pay, Apple Pay and Google Pay among them. No repository and no test suite: the build is read from the live store, and the audit from our own change logs.",
};

/**
 * Block 3 — `BlockWysiwyg`: Dawn, with a footer written by hand.
 *
 * Footer: `…__custom_liquid_DmdrPT` (1 on `/`, 2026-09-25): three columns
 * (`repeat(3, minmax(0, 1fr))`, `1fr` at `max-width: 749px`), `#0055a5`, the
 * drop logo, `tel:` / `mailto:` / Request a quote / hours, Shop (8 links) and
 * Resources (9 links). Rebuilt in the SEO pass (row 12). The home strip
 * `custom_liquid_CUM4JD` was disabled 2026-09-23 (`ui-review/…/IMPL-CHANGELOG.md`
 * #10); the new hero H1 is the served `<h1>` on `/`. Catalogue: collection
 * `products.json` 2026-09-25 (drainage-solutions 7, grass-pavers 4 incl. the
 * gravel roll, gravel-pavers 1, channel-drains 3, catch-basins 2, top-sellers
 * 4); products sitemap 11; pages sitemap 12; blogs sitemap 1 blog + 1 article;
 * `/agents.md` → 33 `<loc>`s with the home page. Header: five menu items
 * (Top Sellers, Drainage, Grass Pavers, Guides, Contact) + the quote button.
 * Photographs: `EZflow_product_2-scaled`, `EZflow_product_3-e1495133277507`,
 * `ToughTrack-product_1-e1499715442369`, `…_2-e1499715495942` (the `-e`
 * suffixes are 2017 Unix timestamps).
 */
export const PROJECT_STOREFRONT: BlockWysiwygProps = {
  tagline: "Storefront",
  title: "Dawn, with a footer written by hand.",
  body: [
    {
      type: "paragraph",
      text: "We built the store on Shopify's Dawn theme, version 13. The footer on every route is a Custom Liquid section we wrote by hand: three columns in the company blue, with the drop logo, the phone and e-mail links, a quote button and the opening hours in the first, and seventeen links into the catalogue, the guides and the store's own pages in the other two. Below 750 pixels it folds into one column, and Dawn's own footer sits underneath with the eight payment icons and the policy links. A second hand-written strip ran under the header on the home page until September 2026. A new hero took its place, the one in the frame at the top of this page.",
    },
    {
      type: "paragraph",
      text: "Eleven products in six collections. Drainage Solutions holds seven and Grass Pavers four, which is the eleven in the sitemap. Gravel Pavers, Channel Drains and Catch Basins are narrower cuts of the same catalogue, and Top Sellers is four products led by the 4-by-150-foot roll of EZ Roll grass paver at $2,110. The header has five menus and a Request a quote button. The sitemap lists thirty-three URLs, twelve of them pages and one a Greenville case study. The photographs came with the business: four filenames still carry the suffixes a WordPress media library adds, three of them dated 2017.",
    },
  ],
};

/**
 * Block 4 — `BlockImageFull`: the Drainage Solutions collection, re-shot
 * 2026-09-25 from the live store. Evidence for paragraph 2 above: the H1, the
 * Shop by type line linking the two sub-collections, the description, the
 * filter and sort controls, `7 products`, and the first four cards at one
 * price each (compare-at prices cleared, SEO row 16).
 */
export const PROJECT_IMAGE_DRAINAGE: BlockImageFullProps = {
  image: {
    src: `${IMAGES}/landscape-drainage-proz-drainage.jpg`,
    alt: "The Drainage Solutions collection: the headline Drainage Solutions, a Shop by type line linking channel drains and catch basins and yard drains, a description opening For over 40 years, filter controls for availability and price, a sort control set to best selling, a count of 7 products, and four product cards, the NDS EZ-Flow gravel-free French drain at $2,890, the Flo-Well dry well kit, the 864 Pro Series channel drain 9-pack and a 9 by 9 catch basin 4-pack, each showing a single price.",
    width: 1600,
    height: 1000,
  },
};

/**
 * Block 5 — `BlockWysiwyg`: the quote path.
 *
 * As served 2026-09-25: the header's `Request a quote` button; the home
 * column `Municipal Orders & Quotes Are Our Specialty` → `Learn more about
 * municipal accounts and quotes`; `/pages/municipal-accounts` opens on
 * `municipal_hero.webp`, then `Request a municipal / tax-exempt quote`, the
 * phone, and `How Municipal Ordering Works` (four steps, CRO P1 changelog
 * "Municipal page"). `/pages/request-a-quote` (CRO changelog #9, ours): Name,
 * Company / agency, Email, Phone, Delivery ZIP code, Tax status (Standard +
 * three tax-exempt options), Product (the eleven), Quantity, Project size,
 * Needed on site by, Project details. Contact page: the phone, e-mail, hours
 * and `Pricing a project? Use the quote request form`. FAQ: seven questions
 * under four `<h3>`s (signature over $1,000; ship within 4 business days;
 * e-mail before a tax-exempt order; 48 hours and a 25 % restocking fee),
 * opening line `please contact us`; the contact page's `Please check our FAQs`.
 * The quote page and the steps are CRO work, not SEO; the page says so by not
 * putting them in the search blocks.
 */
export const PROJECT_QUOTE: BlockWysiwygProps = {
  tagline: "Quote path",
  title: "The buyer who will never use the cart gets a page of their own.",
  body: [
    {
      type: "paragraph",
      text: "Municipal and large-project orders are quoted, so they have a path that never touches the cart. A Request a quote button sits in the store's header, and the home page's Municipal Orders and Quotes column links to the municipal page. That page opens on a flooded playing field, puts the quote button and the phone number first, and sets out a municipal order in four steps, from the request to delivery. The quote page we added asks for the product, the quantity, the delivery ZIP code and one of four tax statuses, so a tax-exempt buyer says so on the form. The contact page repeats the phone number, the e-mail and the hours, and sends pricing questions to the quote form.",
    },
    {
      type: "paragraph",
      text: "The FAQ page holds seven questions under four headings: paver installation and usage, ordering and shipping, reseller and tax-exempt purchases, cancellations and changes. The answers are the terms a contractor asks about before a first order: a signature on delivery over $1,000, shipping within four business days on most orders, an e-mail before any tax-exempt purchase, a 48-hour window before a restocking fee. The page opens by pointing at the contact page, and the contact page points back at it.",
    },
  ],
};

/**
 * Block 6 — `BlockMediaDoubleQuote`: the municipal page beside the FAQ page.
 *
 * At `xl` the blockquote sits directly under the SMALL media, so the quote is
 * that image's own caption: the FAQ page goes with the FAQ frame. The large
 * slot carries the municipal page (paragraph 1 above). Both re-shot
 * 2026-09-25 from the live store.
 */
export const PROJECT_MEDIA_QUOTE: BlockMediaDoubleQuoteProps = {
  large: {
    type: "image",
    src: `${IMAGES}/landscape-drainage-proz-municipal.jpg`,
    alt: "The municipal page: the store's header over a photograph of a flooded playing field with two goalposts standing in brown water, then the headline Municipal Accounts, a button reading Request a municipal / tax-exempt quote beside the store's phone number and hours, and the heading How Municipal Ordering Works over the first two numbered steps, send a quote request and get a written quote.",
    width: 1600,
    height: 1000,
  },
  small: {
    type: "image",
    src: `${IMAGES}/landscape-drainage-proz-faqs.jpg`,
    alt: "The FAQ page: the headline FAQs, the subheading EZ Roll Grass Paver, Gravel Paver and Drainage FAQs, the line If you can't find the answers to your questions, please contact us, and seven question rows under four headings, Paver Installation and Usage, Ordering and Shipping, Reseller and Tax-Exempt Purchases, and Cancellations and Changes.",
    width: 1600,
    height: 1000,
  },
  quote: "The FAQ page. Seven questions under four headings, and both pages point at each other.",
};

/**
 * Block 7 — `BlockWysiwyg`: measurement. No image: the evidence is a JSON
 * config inside a `<script>`, and a frame of it would show nothing.
 *
 * `webPixelsConfigList` on every route, re-checked 2026-09-25: seven
 * `AW-845953007/…` labels, three `MC-PHPLHH8KJY`, `GTM-W9LGV4T` in the head.
 * `UA-101865123-1` 0 on `/` (was 2 on 2026-09-11; SEO row 2).
 */
export const PROJECT_MEASUREMENT: BlockWysiwygProps = {
  tagline: "Measurement",
  title: "Seven conversion labels on eleven events.",
  body: [
    {
      type: "paragraph",
      text: "A Shopify web pixel on every route maps eleven storefront events to Google Analytics 4: page view, item view, item-list view, search, add to cart, view cart, remove from cart, begin checkout, add shipping info, add payment info and purchase. Seven of those, from page view to purchase and including search, carry a Google Ads conversion label as well, and three, page view, item view and purchase, also carry the Merchant Center link. A Google Tag Manager container sits in the head. In September we removed an old Universal Analytics snippet, for a product Google has since shut down. That is the whole of what the served HTML can show about Google Ads: which actions count as conversions and where they report. What any campaign spent or returned is not in the HTML, so it is not on this page.",
    },
  ],
};

/**
 * Block 8 — `BlockWysiwyg`: the structured-data audit. No image: JSON-LD does
 * not render.
 *
 * Before (dossier Stack, 2026-09-11): TinySEO store / website / product /
 * breadcrumb / article embeds + Dawn's own Product node + the hand-pasted
 * FAQPage (2 of 7 questions); `WholesaleStore` with 24/7 hours and (203)
 * 261-4955. After (curl 2026-09-25, SEO row 7): `snippets/ldp-schema.liquid`;
 * `/` = WebSite + Organization (+1-203-951-9409, ContactPoint) +
 * MerchantReturnPolicy, no WholesaleStore, "261-4955" 0 hits; 4x150 = one
 * Product, Offer, OfferShippingDetails, MerchantReturnPolicy, BreadcrumbList;
 * municipal = Service; case study = 1 Article (was 3); FAQ page 7 Questions;
 * collections keep `tinyimg-collection-json-ld` on purpose. Titles: `/`,
 * 4x150 and EZ-Flow `<title>`s (row 5). Canonical + www → apex still hold.
 * Dates: audit 2026-09-21, fixes 09-22 → 09-24.
 */
export const PROJECT_SEARCH: BlockWysiwygProps = {
  tagline: "Search",
  title: "Structured data, audited and moved into the theme.",
  body: [
    {
      type: "paragraph",
      text: "We audited the store on 21 September 2026 and shipped the fixes over the next three days. The structured data, the part of each page written for search engines, was coming from three places at once: Dawn, an SEO app and a block pasted into the questions page. The home page described the business as a wholesale store open around the clock, with a phone number that was not the store's. Each product was described twice.",
    },
    {
      type: "paragraph",
      text: "One snippet in the theme now writes it. The home page names one organization with the right phone number and its return policy. Each product has one Product with an Offer for each variant, and every Offer carries the shipping details and the return policy. Every route has a breadcrumb trail. The municipal page is marked up as a Service, the Greenville case study as one Article where there were three, and the questions page's markup covers all seven of its questions where it covered two. The app still marks up the collection pages, which it did correctly. Every product and page got its own title and description, written around the NDS product names. Nothing here claims a ranking: each of these can be read from the page source today.",
    },
  ],
};

/**
 * Block 9 — `BlockWysiwyg`: the seven guides (SEO row 9). All seven return
 * 200 with FAQPage + Article on 2026-09-25: `/pages/grass-driveway-pavers`,
 * `permeable-driveway-pavers`, `fire-lane-overflow-parking-pavers` (09-22,
 * `phase3/PHASE3-CHANGELOG.md`), `french-drain-installation-guide`,
 * `dry-well-installation-guide`, `catch-basin-installation-guide`,
 * `channel-drain-installation-guide` (09-24, `guides-a` / `guides-b`). Each
 * byline names NDS documents as the spec source (wording varies: "NDS
 * technical documents"; "NDS catalogs, technical specifications and
 * installation details") and carries a "Last updated" date. The Guides menu is
 * in the header on every route.
 */
export const PROJECT_GUIDES: BlockWysiwygProps = {
  tagline: "Guides",
  title: "Seven guides, with specs from the manufacturer's documents.",
  body: [
    {
      type: "paragraph",
      text: "We wrote and published seven guides. Three are about pavers: grass driveways, permeable driveways compared, and fire lanes and overflow parking. Four are installation guides for French drains, dry wells, catch basins and channel drains. Every figure in their spec tables comes from an NDS catalogue, specification or installation detail, and each byline says so and gives a Last updated date. Each guide ends in a set of questions, marked up so a search engine can read them as questions and answers, and the guide itself is marked up as an article. They sit under a Guides menu in the store's header.",
    },
  ],
};

/**
 * Block 10 — `BlockImageFull`: `/pages/french-drain-installation-guide`,
 * captured 2026-09-25 at 1600x1000. Evidence for the byline and the table of
 * contents in block 9.
 */
export const PROJECT_IMAGE_GUIDE: BlockImageFullProps = {
  image: {
    src: `${IMAGES}/landscape-drainage-proz-guide.jpg`,
    alt: "The French drain guide: the headline French Drain Installation Guide: Depth, Slope, Cost and Steps, a byline reading By the Landscape Drainage Proz team, an authorized NDS dealer, product specs from NDS technical documents, last updated September 24, 2026, an opening answer giving a depth of 16 to 24 inches and a slope of at least 1%, and an On this page box listing ten sections from What Is a French Drain to Frequently Asked Questions.",
    width: 1600,
    height: 1000,
  },
};

/**
 * Block 11 — `BlockWysiwyg`: repairs (SEO rows 1, 6, 8, 13).
 *
 * 13 WordPress 404s → 301; 2 redirects into a DRAFT product repointed; 9
 * two-hop chains flattened (`phase1/PHASE1-CHANGELOG.md` 1.1–1.3); 70
 * redirects all 1 hop → 200 (`phase4/MONITOR-REPORT-2026-09-22.md`); seven
 * legacy paths spot-checked live 2026-09-25. 7 archived duplicates deleted +
 * 301'd, empty blogs out of the sitemap, `/collections/all` `noindex, follow`
 * (verified). Invisible links: `--color-link` `#ffffff`, 29 on 16 pages → 0
 * (`phase2/invis_before.json` → `invis_after.json`; LOG ONLY). H1s: 4 routes
 * with two (dossier 09-11) → 19/19 probed routes with one (curl 09-25).
 */
export const PROJECT_REPAIRS: BlockWysiwygProps = {
  tagline: "Repairs",
  title: "What the move from WordPress left behind.",
  body: [
    {
      type: "paragraph",
      text: "The store replaced an older WordPress site, and some of the old addresses had never been pointed anywhere. Thirteen of them returned a page-not-found error. Two redirects led to a product that was no longer published, and nine took two hops to land. We sent each one straight to a live page. The store now holds seventy redirects, and a check on 22 September found every one reaching a working page in a single hop. We also deleted seven archived duplicate products and redirected their addresses, took the empty blogs out of the sitemap and kept the all-products page out of search.",
    },
    {
      type: "paragraph",
      text: "Two faults sat in the theme itself. Dawn's link colour had been set to white, so a text link on a white background could not be seen: our scan found 29 of them across 16 pages, and 0 after the fix. Four routes printed two main headings, one of them the logo. The logo is plain markup now and pasted headings moved down a level, so each of the 19 routes we checked on 25 September has exactly one.",
    },
  ],
};

/**
 * Block 12 — `BlockWysiwyg`: corrections (SEO rows 3, 11, 16).
 *
 * "Rated 4.6 / 5 based on 1289 reviews", "15 hours ago", "Verified" and
 * `#00B67A` all 0 on 4x150, Flo-Well and Tufftrack (verified 09-25); stars to
 * brand blue (`cro/P0-CHANGELOG.md` #8); three named testimonials remain
 * (dossier contradictions #7). "100-year" / "crush-proof" 0 hits; 57,890 →
 * 53,683 psf (4x150 and the FAQ answer both print 53,683 on 09-25); Flo-Well
 * prints "250% more detention volume than a gravel dry well"; Tufftrack GTIN
 * `05206300482` → `052063004822`. Compare-at: `products.json` 2026-09-25,
 * every variant `compare_at_price: null`; `StrikethroughPrice` 0 on 4x150.
 * The $2,532 figure is deliberately not printed (dossier proposal 1).
 */
export const PROJECT_CORRECTIONS: BlockWysiwygProps = {
  tagline: "Corrections",
  title: "Taking out what wasn't true.",
  body: [
    {
      type: "paragraph",
      text: "A review widget on the product pages printed Rated 4.6 out of 5 based on 1,289 reviews, and its review times were hard-coded to read 15 hours ago. The stars were drawn in a review site's green with a Verified tag beside them. We removed the rating line and the timestamps, took the tag off and set the stars in the store's own blue. The reviews that carry a customer's name are still there.",
    },
    {
      type: "paragraph",
      text: "Product claims went back to the manufacturer's documents. The French drain's 100-year lifespan and crush-proof lines came off because we could not find either in an NDS document. The grass paver's compressive strength read 57,890 psf and now reads 53,683 psf, the NDS figure, on the product and in the questions page. The dry well now makes NDS's own claim, 250% more detention volume than a gravel dry well. One panel's barcode was eleven digits and is now a valid twelve-digit UPC. And every product carried a compare-at price, which search results were showing in place of the price a buyer pays. We cleared it on every variant.",
    },
  ],
};

/**
 * Block 13 — `BlockProjectDetails`. `Stack` feeds the intro's second tab and
 * is dropped from this block by `projectDetailsWithoutStack`. `Pages` is the
 * 2026-09-25 sitemap (11 products, 6 collections, 12 pages, 1 blog, 1
 * article, `/agents.md`, home → 33 URLs); `Theme` is `Shopify.theme`. No
 * Tests row: no test suite exists. The block auto-places pairs, so the five
 * rendered rows read (Pages | Theme), (Year | Platform), (Live site | empty).
 */
export const PROJECT_DETAILS: ProjectDetail[] = [
  { label: "Stack", value: "Shopify, Dawn 13, Custom Liquid, JSON-LD, GTM, GA4, Google Ads tag" },
  { label: "Pages", value: "11 products · 6 collections · 33 sitemap URLs" },
  { label: "Theme", value: "Dawn 13.0.0 · one Custom Liquid section" },
  { label: "Year", value: "2026" },
  { label: "Platform", value: "Shopify" },
  { label: PROJECT_LIVE.label, value: PROJECT_LIVE.display, href: PROJECT_LIVE.url },
];

/**
 * Block 14 — `GeneralCta`. Points at `/contact/`, never at the live site (the
 * live URL is a details row). The line names this reader's own situation: a
 * trade catalogue whose big orders still start with a phone call, which is
 * exactly the buyer the municipal page was built for.
 */
export const PROJECT_CTA: GeneralCtaProps = {
  text: "Do your biggest orders still start with a phone call?",
  label: "Tell us how you take orders",
  href: "/contact/",
};
