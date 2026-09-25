/**
 * Content for `/work/halal-bridal/`.
 *
 * Provenance for every string here is recorded in
 * `docs/research/case-studies/halalbridal.md`. This was an SEO engagement on a
 * Shopify store the client already ran (theme Horizon, the client's own); we
 * built no storefront. Every claim is one the dossier lists as LIVE on
 * 2026-09-25, backed by a Shopify Admin API log line.
 *
 * USER RULING (2026-09-25): the store has partly regressed since the work
 * shipped (dossier R1-R3). The page claims only what is verifiably live today,
 * so it never mentions collection H1s, the collection long-form copy or the
 * five collection SEO titles that fell back to defaults, and it does not
 * describe the store's llms.txt. The business is named "Halal Bridal"; the
 * founder is never named (which is also why the walima-post capture, whose
 * byline names her, is not used). No traffic, ranking or sales outcome is
 * claimed: the work is 5-8 days old and the plan's re-measure date is
 * 2026-12-15. The single lab result is labelled as a lab run.
 *
 * Image sizing note: `width`/`height` are each file's true decoded pixels
 * (1200x750 cover, 1600x1000 captures), captured 2026-09-25 ~19:27 UTC.
 *
 * VOICE — "we", never "I"; no headcount.
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
 * Names the category of work as well as the client, because a `<title>` is
 * read cold in a result list. Referenced only by `metadata` in the route file.
 */
export const PROJECT_TITLE = "Halal Bridal: Shopify SEO for a Bridal Store";
export const PROJECT_CANONICAL = "/work/halal-bridal/";
/**
 * The meta description (~150 characters). "33 product titles": 33 distinct
 * product ids in `productUpdate` with `seo`, 33/33 live. "2 to 10": the live
 * collection sitemap (10) against `FULL-AUDIT-REPORT.md:80` (2). "17 posts":
 * blog sitemap. "every page type": BreadcrumbList census.
 */
export const PROJECT_DESCRIPTION =
  "SEO for a made-to-measure Shopify bridal store: 33 product titles rewritten, collections from 2 to 10, 17 new posts, structured data on every page type.";
export const PROJECT_OG_IMAGE = `${IMAGES}/halalbridal.jpg`;

/**
 * `BlockProjectDetails` renders values as plain `<span>`s; this constant is
 * where the addressable URL survives.
 */
export const PROJECT_LIVE = {
  url: "https://halalbridal.com",
  label: "Live site",
  display: "halalbridal.com",
} as const;

/**
 * Header. `service` is "SEO" alone: it is split on " · " into the
 * `CreativeWork.about` topics, which take service names only. No storefront
 * was built, so Web Development is not claimed.
 *
 * `lead` is 84 characters, under the 87 that Landscape Drainage Proz measured
 * as four lines at 320/360/390 and 1280 (see that file's note); this title is
 * two short words, so it wraps no more than that one.
 *
 * The cover is the live home page: the announcement bar, the header and the
 * hero H1 we rewrote ("Modest wedding dresses, made for your most beautiful
 * moments"). The hero photograph is the client's.
 */
export const PROJECT_HEADER: BlockHeaderProjectsProps = {
  title: "Halal Bridal",
  lead: "SEO for a made-to-measure bridal store: 33 product titles, 10 collections, 17 posts.",
  location: "2026 · Shopify SEO",
  service: "SEO",
  breadcrumbLabel: "Work",
  breadcrumbHref: "/work/",
  backLabel: "All work",
  image: {
    src: `${IMAGES}/halalbridal.jpg`,
    alt: "",
    width: 1200,
    height: 750,
  },
};

/**
 * Block 2 — `BlockIntroDouble`. `statement` is the before state: the 12-char
 * `<title>Halal Bridal</title>` and no meta description
 * (`FULL-AUDIT-REPORT.md:38,53`); product H1s were the bare first name
 * (`AUDIT-COMPARISON.md:28`); 2 collections (`:80`). "33 gowns": the 33
 * active products. `body` is the method: 524 logged mutations across 114 logs,
 * first write 2026-09-17 22:21 EDT, last 2026-09-20 18:27 EDT; dry-run by
 * default with per-run backups (dossier decision 1).
 */
export const PROJECT_INTRO: BlockIntroDoubleProps = {
  labels: ["The brief", "What we built"],
  activeLabel: 0,
  statement:
    "A bridal store that makes modest wedding dresses to each bride's measurements and sells them online. Its home page title in a search result was the store's two-word name, with no description under it. Each of its 33 gowns was titled with a first name, and the whole catalogue sat in two collections.",
  body: "We worked inside the store the client already had, on the theme the client already had. Every change went through Shopify's Admin API from Python scripts: 524 changes between 17 and 20 September 2026, each one logged next to the response Shopify sent back. Each script runs as a dry run first and keeps a backup, so any change can be put back.",
};

/**
 * Block 3 — `BlockWysiwyg`: titles and descriptions. Home: title `Modest Halal
 * Wedding Dresses, Made to Measure | Halal Bridal`, 148-char description, one
 * H1 (dossier row 1). Products: 33/33 titles ≤60 chars, 33/33 descriptions
 * (row 2). Handles: `sara` → `amsah`, `safiya` → `izza`, both 301 live, both
 * top-impression URLs before the work (row 5). The cover shows the home H1,
 * so this block has no frame of its own (no duplicate cover).
 */
export const PROJECT_TITLES: BlockWysiwygProps = {
  tagline: "Titles",
  title: "The first thing a search result shows.",
  body: [
    {
      type: "paragraph",
      text: "The home page now reads Modest Halal Wedding Dresses, Made to Measure in a search result, with a 148-character description under it. Its headline, at the top of this page, was rewritten to match. We did the same for all 33 products: a title of 60 characters or fewer that says what the dress is and what it is for, and a description written for that dress.",
    },
    {
      type: "paragraph",
      text: "Two product addresses carried the name of a different dress. Both were among the store's most-shown pages in Google, so we renamed them and set up permanent redirects. Anyone following an old link still lands on the right gown.",
    },
  ],
};

/**
 * Block 4 — `BlockWysiwyg`: collections. 8 created (`muslim-wedding-dresses`,
 * `hijab-wedding-dresses`, `nikkah-dresses`, `cape-wedding-dresses`,
 * `high-neck-long-sleeve-wedding-dresses`, `red-wedding-dresses`,
 * `arabic-wedding-dresses`, `all`), live sitemap 10 (dossier row 7). The set
 * came from keyword research (decision 2); no volume is printed. Says nothing
 * about collection copy, H1s or titles (R1-R3).
 */
export const PROJECT_COLLECTIONS: BlockWysiwygProps = {
  tagline: "Collections",
  title: "From two collections to ten.",
  body: [
    {
      type: "paragraph",
      text: "Brides search for the dress they have in mind: a hijab wedding dress, a nikkah dress, a red one, one with a cape, one with a high neck and long sleeves. The store had two collections, so those searches had no page made for them. We checked which phrases people actually type, then built a collection for each: Muslim, hijab, nikkah, cape, high-neck and long-sleeve, red, and Arabic wedding dresses, plus a proper page for the full catalogue. With the two that already existed, that is ten.",
    },
  ],
};

/**
 * Block 5 — `BlockImageFull`: `/collections/muslim-wedding-dresses`, live
 * 2026-09-25. Shows our breadcrumb trail, the collection name, `32 items` and
 * the first row. The alt says "name", never "headline": the name renders as an
 * h2 today (R1).
 */
export const PROJECT_IMAGE_COLLECTION: BlockImageFullProps = {
  image: {
    src: `${IMAGES}/halalbridal-collection-muslim.jpg`,
    alt: "The Muslim Wedding Dresses collection: a breadcrumb trail reading Home, Muslim Wedding Dresses, the collection name, availability and price filters, a count of 32 items, and a row of five gowns on dress forms, Shamaal, Bushra, Safa, Khadija and Beyda, each with its price.",
    width: 1600,
    height: 1000,
  },
};

/**
 * Block 6 — `BlockWysiwyg`: new pages. `/pages/custom-wedding-dress`
 * (`pageCreate`, H1 quoted from the live page). 17 posts published, blog
 * sitemap; the prom post is held and not counted. Post topics quoted from the
 * live walima post and the journal index. No byline is described. Internal
 * linking from posts is not claimed (not verified).
 */
export const PROJECT_PAGES: BlockWysiwygProps = {
  tagline: "New pages",
  title: "A page for the question behind the search.",
  body: [
    {
      type: "paragraph",
      text: "Some brides search for the service before the style: can a dress be made to fit without a fitting? We wrote a page for that question. It opens on the headline A custom wedding dress, made to your measurements, no fitting appointment, and sets out the steps, from choosing a gown to sending ten measurements.",
    },
    {
      type: "paragraph",
      text: "We also published 17 posts in the store's journal. Each one answers something brides ask before they buy, from what a walima dress is to how to dress for a formal evening in hijab.",
    },
  ],
};

/**
 * Block 7 — `BlockMediaDoubleQuote`: the custom wedding dress page (large)
 * beside the journal index (small). At `xl` the quote sits under the SMALL
 * frame, so it captions the journal.
 */
export const PROJECT_MEDIA_PAGES: BlockMediaDoubleQuoteProps = {
  large: {
    type: "image",
    src: `${IMAGES}/halalbridal-custom-wedding-dress.jpg`,
    alt: "The custom wedding dress page: a breadcrumb reading Home, Custom Wedding Dress, the headline A custom wedding dress, made to your measurements, no fitting appointment, a short lead about sending ten measurements, and two buttons, Choose Your Gown and See the Measuring Guide.",
    width: 1600,
    height: 1000,
  },
  small: {
    type: "image",
    src: `${IMAGES}/halalbridal-journal.jpg`,
    alt: "The journal index, The Journal - Modest Bridalwear, with a breadcrumb trail and a featured post, Modest Evening Gowns With Sleeves: Dressing for a Formal Event in Hijab, dated September 18, 2026.",
    width: 1600,
    height: 1000,
  },
  quote: "The journal. Seventeen new posts, each with a breadcrumb trail back to the store.",
};

/**
 * Block 8 — `BlockWysiwyg`: structured data. No image: JSON-LD does not
 * render. BreadcrumbList on products, posts, collections, blog index and
 * pages (row 16). Product 33/33: two OfferShippingDetails, 19 DefinedRegion,
 * handling 56-70 days (the page says 8 to 10 weeks), `mpn` (row 15).
 * Organization with `@id` + WebSite/SearchAction (row 14); FAQPage with 6
 * questions (row 17).
 */
export const PROJECT_SCHEMA: BlockWysiwygProps = {
  tagline: "Structured data",
  title: "Facts a search engine can read without guessing.",
  body: [
    {
      type: "paragraph",
      text: "Every page type now carries a breadcrumb trail, both on screen and in the code search engines read. Each of the 33 products describes itself the same way: price, a product number, shipping to 19 countries, and a production time of 56 to 70 days. That last figure used to say something shorter than the 8 to 10 weeks printed on the page, so we made the two agree.",
    },
    {
      type: "paragraph",
      text: "The store as a whole describes itself too, as one business with one website and a search box. The FAQ page marks up its six questions and answers. None of this changes how the store looks. It changes what a search engine can be sure of.",
    },
  ],
};

/**
 * Block 9 — `BlockWysiwyg`: speed, and what is not yet known. The only
 * before/after in the dossier: Lighthouse 13.4.1 mobile,
 * `/collections/muslim-wedding-dresses`, 2026-09-18 05:51 → 06:13 UTC, one
 * run each side, around the card-gallery change (eager images 24 → 4, row 23).
 * Labelled a lab run. The re-measure date is ACTION-PLAN.md's 2026-12-15.
 */
export const PROJECT_MEASURE: BlockWysiwygProps = {
  tagline: "Measuring",
  title: "One lab result, and the rest still to come.",
  body: [
    {
      type: "paragraph",
      text: "Collection pages loaded 24 images up front. We cut that to 4, so the rest load as a shopper scrolls. In a lab test on a simulated phone, one run before and one after on 18 September, the Muslim wedding dresses collection went from a performance score of 61 to 81. The main image appeared in 4.4 seconds instead of 12.9, and the page weighed 2.72 MB instead of 4.49.",
    },
    {
      type: "paragraph",
      text: "Rankings and traffic take months to move, and this work shipped in September. So this page makes no claim about either yet. We are measuring, and the next check is set for 15 December.",
    },
  ],
};

/**
 * Block 10 — `BlockProjectDetails`. `Stack` feeds the intro's second tab and
 * is dropped here by `projectDetailsWithoutStack`. Theme: Horizon 3.5.1
 * (`Shopify.theme`), the client's. The block auto-places pairs: (Scope |
 * Changes), (Theme | Year), (Platform | Live site).
 */
export const PROJECT_DETAILS: ProjectDetail[] = [
  { label: "Stack", value: "Shopify Admin GraphQL API, Python, Liquid, JSON-LD, Lighthouse" },
  { label: "Scope", value: "33 products · 10 collections · 17 posts · 1 new page" },
  { label: "Changes", value: "524 logged API changes · 17–20 Sept 2026" },
  { label: "Theme", value: "Horizon 3.5.1 (the client's)" },
  { label: "Year", value: "2026" },
  { label: "Platform", value: "Shopify" },
  { label: PROJECT_LIVE.label, value: PROJECT_LIVE.display, href: PROJECT_LIVE.url },
];

/**
 * Block 11 — `GeneralCta`. The line names this reader's own problem: a store
 * whose search listing is just its name, the before state of the brief. The
 * label is true to `/contact/` (an e-mail address and a phone number).
 */
export const PROJECT_CTA: GeneralCtaProps = {
  text: "Does your store show up in Google as just its name?",
  label: "Send us your store's link",
  href: "/contact/",
};
