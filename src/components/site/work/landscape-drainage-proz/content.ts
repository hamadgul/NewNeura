/**
 * Content for `/work/landscape-drainage-proz/`.
 *
 * Provenance for every string here is recorded in
 * `docs/research/case-studies/landscape-drainage-proz.md`. This project has NO
 * local source (`~/Projects/ShopifySite` holds one dotfile), so every claim is
 * traced to the LIVE store, `https://landscapedrainageproz.com`, as served on
 * 2026-09-11 (times in the dossier), and every count carries the command that
 * produced it over the saved HTML. What the served HTML cannot show is listed in
 * the dossier under "Unverifiable claims" and never printed here: who wrote
 * which section, when the engagement ran, whether a Google Ads campaign ever
 * ran, what any of it returned. The source's outcome claim, "tripled the
 * client's online sales," was cut in Task 5 and stays cut; no sales, traffic or
 * ranking figure appears in any slot a visitor reads.
 *
 * Image sizing note: `width`/`height` are each file's true decoded pixels
 * (1200x750 for the frozen cover, 1600x1000 for the three runner captures),
 * because `next/image` reserves the aspect ratio from them.
 *
 * VOICE — "we", never "I"; no headcount. The client's own figures (the tenure
 * claims on four routes, the prices, the free-shipping threshold) appear in
 * the captures as the client's copy and are quoted, never restated as ours.
 *
 * ── What the 2026-09-11 expansion changed ───────────────────────────────────
 * The 2026-09-07 page had three blocks and four facts. `PROJECT_DESCRIPTION`,
 * `PROJECT_HEADER.lead` and `PROJECT_INTRO` no longer say "CTA design, Google
 * Ads, and SEO" as bare service words: the live HTML supports a set of named
 * calls to action, seven Google Ads conversion labels on a web pixel, and a
 * structured-data layer, so the page now names those. "SEO strategy set up to
 * compound" was a results claim and is gone. Four sections and three captures
 * were added, each beside the sentence it proves.
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
export const PROJECT_TITLE = "Landscape Drainage Proz: a Shopify Build";
export const PROJECT_CANONICAL = "/work/landscape-drainage-proz/";
/**
 * The meta description, ~150 characters, stating what was built and the
 * mechanisms the page argues from. "Dawn" is `Shopify.theme.schema_name` on the
 * served home page; "two hand-written Custom Liquid sections" are the two
 * `custom_liquid` section ids on `/`; "eleven products" is the products sitemap;
 * "a municipal quote path" is dossier decision 3; "conversion labels" is the web
 * pixel's seven `AW-` action labels (decision 4).
 */
export const PROJECT_DESCRIPTION =
  "A Dawn storefront for a drainage dealer: eleven products, two hand-written Custom Liquid sections, a municipal quote path and Google Ads conversion labels.";
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
 * Header. `lead` is the store's shape in one line: the theme
 * (`Shopify.theme`), the product count (the products sitemap, 11), the two
 * Custom Liquid sections (decision 1) and the quote path (decision 3).
 * LENGTH IS MEASURED: the header's lead slot at 390 px holds five lines
 * (156 px) before the `<h1>` runs into the cover's top edge, and this
 * project's three-word title wraps once more at 320 px, which leaves FOUR
 * lines there. Candidates were swapped into the live slot with `textContent`
 * (`$SCRATCH/ldp-lead.mjs`, task-15-report.md §5): the 92-character draft
 * ("…for an NDS drainage dealer…") was five lines at 320 and overlapped the
 * cover by 25 px there (measured before 5ab9d32); the shipped 87 characters
 * is four lines at 320, 360 and 390 (h1 bottom 494 / 448 / 448 inside the
 * 500px band). Since 5ab9d32 the band is `minmax(500px, auto)` below `md`,
 * so a longer lead can no longer run the `<h1>` into the cover there; it
 * pushes the cover down instead. The band is still a fixed 500px from `md`
 * up, and the xl lead column (1280, ~27 chars/line) is the tightest slot:
 * this lead is four lines there with the 35px design gap fully consumed
 * (lead.bottom - meta.top = -0.9 at 1280, task-19-report.md). Re-measure at
 * 1280 as well as 320 before lengthening. The cover is the live home page as of
 * 2026-09-11: the announcement bar, the six-item header, the blue Custom
 * Liquid strip, slide 2 of 3 with its one button, and the rich-text opener.
 */
export const PROJECT_HEADER: BlockHeaderProjectsProps = {
  title: "Landscape Drainage Proz",
  lead: "A Dawn storefront for a drainage dealer: eleven products, two sections written by hand.",
  location: "2026 · Shopify",
  service: "Web Development · Data Intelligence",
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
 * `statement` is the brief. "NDS dealer": the home page's rich text
 * (`Authorized NDS Products Dealer`) and the `NDS: Our Exclusive Manufacturing
 * Partner` section; "contractors and municipalities": `/pages/about`
 * (`Serving Developers, Contractors & Municipalities`); "$2,110": the Top
 * Sellers collection's first card; "quoted": `/pages/municipal-accounts`
 * (`Contact us today for a custom quote`) and the contact page's first bullet.
 * "carried over": three product photographs keep WordPress media-library
 * suffixes (decision 6). `body` is the stack as the served HTML shows it
 * (dossier, Stack): Dawn 13.0.0, the two `custom_liquid` ids, the four
 * app-block apps and the Section Store section, GTM + GA4 + the web pixel,
 * predictive search, customer accounts, the eight payment icons.
 * `projectIntroTabs` overwrites both labels to "The brief" / "The tech stack".
 */
export const PROJECT_INTRO: BlockIntroDoubleProps = {
  labels: ["The brief", "What we built"],
  activeLabel: 0,
  statement:
    "An NDS drainage dealer selling to contractors and municipalities: a catalogue of eleven products carried over from an earlier site, a $2,110 roll of grass paver as the top seller, and municipal orders that start with a quote request.",
  body: "Shopify on the Dawn theme, version 13, with two Custom Liquid sections written by hand. Four apps: TinySEO for structured data, instaindex for prerender rules, and two trust-badge apps, plus a Section Store review slider on product pages. Google Tag Manager, Google Analytics 4 and a Google Ads conversion tag through a Shopify web pixel. Predictive search, customer accounts and eight payment methods, Shop Pay, Apple Pay and Google Pay among them. No repository and no test suite: everything on this page is read from the live store.",
};

/**
 * Block 3 — `BlockWysiwyg`: Dawn, with two sections written by hand.
 *
 * The strip: `shopify-section-template--16131210543241__custom_liquid_CUM4JD`
 * on `/` (an `<h1 class="center-blue">` with its own `<style>`; dossier
 * decision 1 quotes it). The footer: `…__custom_liquid_DmdrPT`, on 13/13
 * fetched routes (the `.f` block, `#0055a5`, `drop_trans.png`, `mailto:`,
 * `tel:`, hours, seven links, the 768 px media query). Dawn's own footer with
 * `list-payment__item` ×8 renders below it. The catalogue: products sitemap 12
 * URLs (home + 11); `7 products` / `4 products` / `2 products` printed on the
 * three collections; the two Top Sellers cards and their struck prices; six
 * `header__menu-item`s; the announcement bar; three `slideshow__slide`s with
 * one `button` each; pages sitemap 4, blogs sitemap 3 (two blogs, one article);
 * 23 URLs in all. The FAQ's old product handle 301s to the current one (live,
 * 18:38 UTC). Provenance: the `?v=` timestamps 2024-01-07 → 2026-02-27 and the
 * three `-e…`/`-scaled` filenames (decision 6).
 */
export const PROJECT_STOREFRONT: BlockWysiwygProps = {
  tagline: "Storefront",
  title: "Dawn, with two sections written by hand.",
  body: [
    {
      type: "paragraph",
      text: "We built the store on Shopify's Dawn theme, version 13, and wrote two of its sections by hand as Custom Liquid blocks. The first is the blue band under the header on the frame at the top of this page: one h1, Top Drainage Products Backed By Over 60 Years Of Drainage Supply Expertise, with its own style rule. The second is the footer on every route of the store: a three-column block in the company blue with the drop logo, the e-mail and telephone links, the opening hours and seven links into the catalogue. It collapses to one column at 768 pixels and below, and Dawn's own footer, with the eight payment icons and the policy links, sits underneath it.",
    },
    {
      type: "paragraph",
      text: "Eleven products in two collections whose counts add up: Drainage Solutions prints seven products and Paver Solutions four, and the sitemap lists eleven. Top Sellers is a two-product subset, the 4-by-150-foot roll of EZ Roll grass paver at $2,110 and the EZ Flow French drain, each card showing the compare-at price struck through. The header is six items, the announcement bar carries the free-shipping threshold, and each of the three slideshow slides has one button into a collection. Four pages, two blogs and one article, a Greenville case study, complete the sitemap at twenty-three URLs. The product handle the FAQ page still links to redirects to the current one. The photographs came with the business: three filenames still carry the suffixes a WordPress media library adds, two of them dated 2017, and the store's own uploads run from the logo in January 2024 to a new NDS mark in February 2026.",
    },
  ],
};

/**
 * Block 4 — `BlockImageFull`: the Drainage Solutions collection, captured
 * 2026-09-11 18:36 UTC from the live store. Evidence for paragraph 2 above:
 * the H1, the description, the filter and sort controls, `7 products`, and the
 * first four cards with the compare-at price struck through.
 */
export const PROJECT_IMAGE_DRAINAGE: BlockImageFullProps = {
  image: {
    src: `${IMAGES}/landscape-drainage-proz-drainage.jpg`,
    alt: "The Drainage Solutions collection: the headline Drainage Solutions, a description opening For over 40 years, filter controls for availability and price, a sort control set to best selling, a count of 7 products, and four product cards, the EZ Flow French drain, the NDS 864 Pro Channel kit, a 9 by 9 catch basin four-pack and the Flo-Well dry well kit, each with a struck compare-at price beside its sale price.",
    width: 1600,
    height: 1000,
  },
};

/**
 * Block 5 — `BlockWysiwyg`: the quote path.
 *
 * Home column `Municipal Orders & Quotes is Our Specialty` → `<a
 * href="/pages/municipal-accounts">Learn More`; that page's hero
 * `municipal_hero.webp`, its H1s and its last H2 `Contact Landscape Drainage
 * Proz for Municipal Drainage Solutions` (`pages_municipal-accounts.html`).
 * Contact page: Dawn `form` section (Name, Email `*`, Phone number, Comment,
 * Send) and the two bullets (`pages_contact.html`). Footer `tel:` / `mailto:` /
 * hours: the Custom Liquid footer, 13/13 routes. FAQ: seven `faq-button`s under
 * four `<h3>`s, answers in `faq-content` divs (signature over $1,000; ship
 * within 4 business days; e-mail before a tax-exempt order; 48 hours and a 25 %
 * restocking fee), opening line `please contact us`; the contact page's
 * `Please check our FAQs` (`pages_faqs.html`, `pages_contact.html`).
 */
export const PROJECT_QUOTE: BlockWysiwygProps = {
  tagline: "Quote path",
  title: "The buyer who will never use the cart gets a page of their own.",
  body: [
    {
      type: "paragraph",
      text: "Municipal and large-project orders are quoted, so we gave them a path that never touches the cart. The home page's Municipal Orders and Quotes column ends in a Learn More link to the municipal page, which opens on a flooded playing field and closes on the heading Contact Landscape Drainage Proz for Municipal Drainage Solutions. The contact page's two bullets say the same in one line each: municipal and large-project pricing on request, and ask if a product is not listed. Its form takes a name, an e-mail, a phone number and a comment, and the footer on every route carries the telephone and e-mail links and the hours.",
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
 * slot carries the municipal page (paragraph 1 above). Both captured
 * 2026-09-11 18:36 UTC from the live store.
 */
export const PROJECT_MEDIA_QUOTE: BlockMediaDoubleQuoteProps = {
  large: {
    type: "image",
    src: `${IMAGES}/landscape-drainage-proz-municipal.jpg`,
    alt: "The municipal page: the store's header over a photograph of a flooded playing field with two goalposts standing in brown water, then the headline Municipal Accounts, the subheading Municipal Drainage Solutions: Expertise in Field-Wide Challenges, an opening paragraph about towns and municipalities, and the heading Trusted Drainage Expertise for Municipalities.",
    width: 1600,
    height: 1000,
  },
  small: {
    type: "image",
    src: `${IMAGES}/landscape-drainage-proz-faqs.jpg`,
    alt: "The FAQ page: the headline FAQs, the line If you can't find the answers to your questions, please contact us, and seven question rows under four headings, Paver Installation and Usage, Ordering and Shipping, Reseller and Tax-Exempt Purchases, and Cancellations and Changes, with a blue banner reading Top Drainage Products Backed By Over 60 Years Of Drainage Supply Expertise at the foot.",
    width: 1600,
    height: 1000,
  },
  quote: "The FAQ page. Seven questions under four headings, and both pages point at each other.",
};

/**
 * Block 7 — `BlockWysiwyg`: measurement. No image: the evidence is a JSON
 * config inside a `<script>`, and a frame of it would show nothing.
 *
 * `webPixelsConfigList` on every route: pixel `723222665`, `google_tag_ids`
 * `G-7BGF2NM55P` (+ `GT-5TQ47LRZ`), eleven `gtag_events`; seven with an
 * `AW-845953007/…` label (`page_view`, `view_item`, `add_to_cart`,
 * `begin_checkout`, `add_payment_info`, `purchase`, `search`); three with
 * `MC-PHPLHH8KJY` (`page_view`, `view_item`, `purchase`); `GTM-W9LGV4T` in the
 * head (dossier decision 4, the table). The UA snippet is a user note in the
 * dossier, not a sentence here.
 */
export const PROJECT_MEASUREMENT: BlockWysiwygProps = {
  tagline: "Measurement",
  title: "Seven conversion labels on eleven events.",
  body: [
    {
      type: "paragraph",
      text: "A Shopify web pixel on every route maps eleven storefront events to Google Analytics 4: page view, item view, item-list view, search, add to cart, view cart, remove from cart, begin checkout, add shipping info, add payment info and purchase. Seven of those, from page view to purchase and including search, carry a Google Ads conversion label as well, and three, page view, item view and purchase, also carry the Merchant Center link. A Google Tag Manager container sits in the head. That is the whole of what the served HTML can show about Google Ads: which actions count as conversions and where they report. What any campaign spent or returned is not in the HTML, so it is not on this page.",
    },
  ],
};

/**
 * Block 8 — `BlockWysiwyg`: the search layer. No image: JSON-LD and canonical
 * tags do not render.
 *
 * `rel="canonical"` on 13/13 fetched routes; `www` → 301 → apex (curl,
 * 2026-09-11 18:22 UTC). Titles: `<title>` of the two products and three
 * collections (dossier decision 5). JSON-LD by route from the TinySEO app
 * blocks (`store`, `website`, `breadcrumbs`, `product`, `collection`,
 * `article` json-ld embeds) and the hand-pasted `FAQPage`; the instaindex
 * `speculationrules` block (`eagerness: moderate`). Every figure a rank report
 * would carry is absent on purpose (dossier, Unverifiable 1–2).
 */
export const PROJECT_SEARCH: BlockWysiwygProps = {
  tagline: "Search",
  title: "Structured data on every route, and a title per product.",
  body: [
    {
      type: "paragraph",
      text: "Every route names itself as canonical, and the www host redirects to the bare domain. Product titles are written one by one, each with its own description: EZ FLOW French Drain, Easy Water Drainage for Landscaping; EZ Roll Grass Paver, 4 by 150 foot Roll. The three collection titles are written the same way. A structured-data app emits JSON-LD by route type. The home page carries a WholesaleStore node with a contact point and a WebSite node with a search action; every route carries a breadcrumb list; the eleven products carry Product and Offer, the collections CollectionPage and ItemList, the case study and the municipal page Article, and the questions page a hand-placed FAQPage. A second app writes prerender rules for the catalogue, page and blog links, for browsers that honour them. Nothing here claims a ranking. The mechanism is what a crawler finds on each route, and each of those items can be read from the page source today.",
    },
  ],
};

/**
 * Block 9 — `BlockProjectDetails`. `Stack` feeds the intro's second tab and
 * is dropped from this block by `projectDetailsWithoutStack`. `Pages` is the
 * sitemap (11 products, 4 pages, 4 collections, 2 blogs, 1 article → 23 URLs);
 * `Theme` is `Shopify.theme`. No Tests row: no test suite exists. The block
 * auto-places pairs, so the five rendered rows read (Pages | Theme),
 * (Year | Platform), (Live site | empty).
 */
export const PROJECT_DETAILS: ProjectDetail[] = [
  { label: "Stack", value: "Shopify, Dawn 13, Custom Liquid, GTM, GA4, Google Ads tag" },
  { label: "Pages", value: "11 products · 4 collections · 23 sitemap URLs" },
  { label: "Theme", value: "Dawn 13.0.0 · two Custom Liquid sections" },
  { label: "Year", value: "2026" },
  { label: "Platform", value: "Shopify" },
  { label: PROJECT_LIVE.label, value: PROJECT_LIVE.display, href: PROJECT_LIVE.url },
];

/**
 * Block 10 — `GeneralCta`. Points at `/contact/`, never at the live site (the
 * live URL is a details row). The line names this reader's own situation: a
 * trade catalogue whose big orders still start with a phone call, which is
 * exactly the buyer the municipal page was built for.
 */
export const PROJECT_CTA: GeneralCtaProps = {
  text: "Do your biggest orders still start with a phone call?",
  label: "Tell us how you take orders",
  href: "/contact/",
};
