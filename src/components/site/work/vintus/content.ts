/**
 * Content for `/work/vintus/`.
 *
 * Provenance for every string here is recorded in
 * `docs/research/case-studies/vintus.md`. This project has NO local source,
 * so every claim is traced to the LIVE site, `https://vintus.com`, as served
 * on 2026-09-11 (times in the dossier), and every count carries the command
 * that produced it over the saved HTML or the REST header that returned it.
 * What the served HTML cannot show is listed in the dossier under
 * "Unverifiable claims" and never printed here: which parts are our work (the
 * theme's stylesheet header credits EventCreate), whether any service outside
 * WordPress exists, what the pages behind the login do, when the engagement
 * ran. No sales, traffic or ranking figure appears in any slot a visitor
 * reads, and nothing says anything about the wines in our voice.
 *
 * Image sizing note: `width`/`height` are each file's true decoded pixels
 * (1200x750 for the frozen cover, 1600x1000 for the three runner captures),
 * because `next/image` reserves the aspect ratio from them.
 *
 * VOICE — "we", never "I"; no headcount. ATTRIBUTION, per the user's ruling
 * of 2026-09-11 ("Ongoing maintenance / features on an inherited theme",
 * dossier Unverifiable 1): the page says once, in the stack tab, that the
 * theme is an inherited build we maintain and extend (the served
 * `style.css` header credits EventCreate; the earliest uploads are 2018/06),
 * and attributes NO specific feature to us — the filters, the sell-sheet
 * generator, the tech sheet, the gated pages and the edge headers are all
 * described as what the portal does, because the HTML cannot sign them and
 * the user did not name them. No sentence on the page reads "we built X".
 * The client's own figures (40 benchmark producers, all 50 states, Importer
 * of the Year 2017, every review score) appear only as quoted client copy or
 * inside alt text describing a frame, never restated as ours.
 *
 * ── What the 2026-09-11 expansion changed ───────────────────────────────────
 * The 2026-09-07 page had three blocks and one paragraph of substance, and
 * four of its nouns get no support from the live site: "e-commerce" (no cart,
 * checkout, price list or payment integration on any route), "inventory
 * management, order processing, and customer-relationship tooling" (nothing
 * served; three pages ask a visitor to log in), "Python services"
 * (every dynamic endpoint is admin-ajax.php or wp-json) and "leading" (no
 * one on the site ranks the importer). All four are gone. What replaces them
 * is measured: 703 wines and 1,600 vintage pages under 161 producers, four
 * filter forms keyed to producer and wine, a tech sheet that takes a rep's
 * own price, a sell-sheet generator, and a login with a dashboard, orders and
 * notes behind it. Four sections and three captures were added, each frame
 * directly under the sentence it proves.
 */
import type { BlockHeaderProjectsProps } from "@/components/site/shared/blocks/BlockHeaderProjects";
import type { BlockImageFullProps } from "@/components/site/shared/blocks/BlockImageFull";
import type { BlockIntroDoubleProps } from "@/components/site/shared/blocks/BlockIntroDouble";
import type { BlockWysiwygProps } from "@/components/site/shared/blocks/BlockWysiwyg";
import type { GeneralCtaProps } from "@/components/site/shared/blocks/GeneralCta";
import type { ProjectDetail } from "@/components/site/shared/blocks/BlockProjectDetails";

const IMAGES = "/site/images";

/**
 * The `<title>` stem, suffixed by the root layout's `"%s — NeuraGul"` template.
 *
 * This is NOT the project's display name — `PROJECT_HEADER.title` is, and it
 * still reads "Vintus" on the page and in the breadcrumb. The two diverge on
 * purpose: an `<h1>` sits under a header that has already established what
 * the page is, while a `<title>` is read cold in a result list, so it has to
 * name the category of work as well as the client. "Trade portal" replaces
 * the old "E-Commerce": the site has no cart (dossier, Unverifiable 4).
 * `PROJECT_TITLE` is referenced only by `metadata` in the route file.
 */
export const PROJECT_TITLE = "Vintus: a Wine Importer's Trade Portal";
export const PROJECT_CANONICAL = "/work/vintus/";
/**
 * The meta description, ~150 characters, stating what the site is and the
 * mechanisms the page argues from. "703 wines and 1,600 vintage pages" is the
 * wines sitemap split by URL depth (2,304 `wines` posts in all, the REST
 * `X-WP-Total`); "161 producers" is the producers header; "filters keyed to producer and wine" are
 * the four Search & Filter Pro forms' facet names; the sell-sheet generator
 * is `/sell-sheet-generator/` (dossier, decisions 1–3).
 */
export const PROJECT_DESCRIPTION =
  "A wine importer's trade portal on WordPress: 703 wines and 1,600 vintage pages under 161 producers, filters keyed to producer and wine, a sell-sheet generator.";
export const PROJECT_OG_IMAGE = `${IMAGES}/vintus.jpg`;

/**
 * The apex, which is the canonical host: `www` 301s to it and the home page's
 * `rel="canonical"` names it (dossier, Stack). Verified live 2026-09-11.
 *
 * `BlockProjectDetails` renders its values as plain `<span>`s with no anchor,
 * so the details row prints the readable host and this constant is where the
 * addressable URL survives.
 */
export const PROJECT_LIVE = {
  url: "https://vintus.com",
  label: "Live site",
  display: "vintus.com",
} as const;

/**
 * Header. `lead` is the site's shape in one line: what it is (a trade portal,
 * dossier decision 3–4) and the three counts (decision 1: the producers
 * REST header, and the wines sitemap split by URL depth into 703 wines and
 * 1,600 vintage pages).
 * LENGTH IS MEASURED: the header's lead slot at 390 px holds five lines
 * (156 px) before the `<h1>` runs into the cover's top edge; this project's
 * one-word title never wraps, so the slot is a line more forgiving than the
 * three-word titles in Tasks 14–15. Measured in the live slot on the user's
 * :3000 (`$SCRATCH/vintus-look.mjs`, task-16-report.md §5): the shipped 81
 * characters is three lines at 390 (h1 bottom 371) and four lines at 320
 * and 360 (h1 bottom 402), all inside the 500px band. Since 5ab9d32 the
 * band is `minmax(500px, auto)` below `md`, so a longer lead can no longer
 * run the `<h1>` into the cover there; it pushes the cover down instead.
 * The band is still a fixed 500px from `md` up, and the xl lead column
 * (1280, ~27 chars/line, three lines) is the tightest slot, so re-measure
 * at 1280 as well as 320 before lengthening. The eyebrow row: under `md`
 * `location` and `service` share one cell, and this page's former
 * 40-character service line ("Cloud & Infrastructure · Web Development",
 * then the longest of the ten) overprinted the location text by 42 px at
 * 390 and 112 px at 320 (54 / 124 px with the old "2026 · E-commerce").
 * Fixed in `BlockHeaderProjects` (5ab9d32): the pair is a wrapping flex row
 * below `md`, and the service line drops to its own right-aligned line at
 * 320-430 (text overlap 0 at 320/360/390/414/430, measured on the
 * production build; unchanged at 767+ where it never overlapped). The
 * service line is now the 15-character "Web Development" (user retag,
 * 2026-09-11, matching `services` in work/content.ts), so this page no
 * longer holds the longest one — the 36-character "Web Development · Data
 * Intelligence" on foodtruckrentals and landscape-drainage-proz does; the
 * measurements above are kept as the worst case the fix was proven on.
 * The cover is the live home page as of
 * 2026-09-11: the seven-item header, the H1 "Building a National Wine Import
 * Business From Scratch" over a vineyard, the search box, the SevenFiftyDaily
 * teaser and READ MORE.
 */
export const PROJECT_HEADER: BlockHeaderProjectsProps = {
  title: "Vintus",
  lead: "A wine importer's trade portal: 161 producers, 703 wines and 1,600 vintage pages.",
  location: "2026 · WordPress",
  service: "Web Development",
  breadcrumbLabel: "Work",
  breadcrumbHref: "/work/",
  backLabel: "All work",
  image: {
    src: `${IMAGES}/vintus.jpg`,
    alt: "",
    width: 1200,
    height: 750,
  },
};

/**
 * Block 2 — `BlockIntroDouble`, the two-label variant.
 *
 * `statement` is the brief, as the site describes the business: "national"
 * is the home page's own H1 ("Building a National Wine Import Business") and
 * the about page's "distributors in all 50 states"; "distributors,
 * restaurants, retailers and press" is the subscribe form's "I am a" list;
 * the counts are the producers REST header and the wines sitemap; "a tech sheet, a sell sheet or a bottle
 * shot" are the Trade Tools menu's Product Images, Trade Materials and
 * Create Sell Sheet items (dossier, decision 3). `body` opens with the
 * one attribution sentence the user's ruling allows (an inherited theme we
 * maintain and extend; "its stylesheet still credits the studio that first
 * built it" is the `Author: EventCreate` header, dossier Stack → Theme), then
 * the stack as the served HTML shows it (dossier, Stack): the generator meta,
 * the theme directory, the REST type index (accounts, producers, wines), the
 * distributors sitemap, the six plugin paths, the GA4 tag, Typekit,
 * Cloudinary, and the response headers. `projectIntroTabs` overwrites both
 * labels to "The brief" / "The tech stack".
 */
export const PROJECT_INTRO: BlockIntroDoubleProps = {
  labels: ["The brief", "What we built"],
  activeLabel: 0,
  statement:
    "A national wine importer whose portfolio runs to 161 producers and 703 wines, whose customers are distributors, restaurants, retailers and press, and whose sales reps need a tech sheet, a sell sheet or a bottle shot for any wine on any day.",
  body: "WordPress 7.1 on a custom theme we inherited and now maintain and extend; its stylesheet still credits the studio that first built it. Four custom post types: producers, wines, accounts and distributors, the last a directory of 379 entries. Search & Filter Pro runs the four filter forms, Ajax Search Pro the header search and the sell-sheet search, Gravity Forms the share-by-e-mail form and Brevo the newsletter; the WP SMS plugin's subscribe endpoints and a WonderPush web-push loader are registered on every route. Google Analytics 4, Adobe Typekit and Cloudinary. nginx in front, with HSTS, a full content-security policy and a permissions policy that switches off geolocation, camera, microphone and payment. No repository and no test suite: everything on this page is read from the live site.",
};

/**
 * Block 3 — `BlockWysiwyg`: the catalogue.
 *
 * Counts: `X-WP-Total` on `/wp-json/wp/v2/wines` (2304) and `/producers`
 * (161), 19:18 UTC; the REST index labels the wines type "Products"; the
 * wines sitemap splits by URL depth into 703 parent wines and 1,600 vintage
 * children (`awk -F/ 'NF==6'` / `'NF==7'` over its 2,304 URLs), 650 of the
 * parents having at least one vintage under them. The
 * redirect: `/wines/crozes-hermitage/` → 302 →
 * `/wines/crozes-hermitage/e-guigal-crozes-hermitage-2020/` (19:11 UTC). The
 * hero: three `<select>`s with 57 / 26 / 6 options (`python3` over the saved
 * HTML); the rail: five `link-scroll` anchors; the spec bullets and the two
 * reviews are in the `#overview` and `#reviews` sections. Producer page:
 * `producers_chateau-margaux_.html` (selects, anchors, wine cards). Browse
 * page: 57 distinct `/producers/` hrefs after the form; country facet six
 * options; `/producers-summary/` grouped by country and region (dossier,
 * decisions 1–2). The home page says "40 benchmark producers" while listing
 * 57; that is the client's copy and a note for the user, not a sentence here.
 */
export const PROJECT_CATALOGUE: BlockWysiwygProps = {
  tagline: "Catalogue",
  title: "One page per vintage, 1,600 of them.",
  body: [
    {
      type: "paragraph",
      text: "The catalogue is 161 producers, 703 wines and 1,600 vintage pages, 2,304 wine pages in all. A wine's bare address redirects to its current vintage, and the page's hero is three drop-downs, producer, wine and vintage, so a rep can move from E. Guigal to any of the house's 26 wines to any of a wine's six vintages, each choice loading that page. Below the hero the page runs in five sections. The overview holds the vineyard, the winemaking, the vintage and a tasting note, then four spec lines: colour, appellation, alcohol and suggested retail price. After it come the scored reviews with their publication and date, the news posts about that wine, its trade materials, and the producer's other wines. The producer page is the same shape one level up, with a card per wine.",
    },
    {
      type: "paragraph",
      text: "Fifty-seven producers on one page, filtered by country. The producers page lists every estate with a thumbnail and a region line under a single country filter with six options. A second page prints the whole portfolio grouped by country and region, from Napa Valley through Champagne, Bordeaux, Burgundy and the Rhône to Tuscany, Piedmont, Rioja, Mendoza and Marlborough.",
    },
  ],
};

/**
 * Block 4 — `BlockImageFull`: `/browse-producers`, captured 2026-09-11 19:25
 * UTC from the live site. Evidence for paragraph 2 above: the H1, the estate
 * paragraph, the country filter and the first twelve cards.
 */
export const PROJECT_IMAGE_PRODUCERS: BlockImageFullProps = {
  image: {
    src: `${IMAGES}/vintus-producers.jpg`,
    alt: "The producers page: the headline Our Producers over a paragraph about the estates, a grey filter panel labelled Country set to All Countries, and twelve producer cards in three columns, each a small photograph, an italic name and a region line, from Far Mountain in Sonoma Valley through Champagne Bollinger and Château Margaux to Xavier Milhade Wines in Bordeaux.",
    width: 1600,
    height: 1000,
  },
};

/**
 * Block 5 — `BlockWysiwyg`: the relations.
 *
 * Four Search & Filter Pro forms (`data-sf-form-id` 9, 113866, 50, 34) and
 * their facet names: `_sfm_estate_location[]` (producers),
 * `_sfm_wine_producer[]` + `_sfm_all_title_clone[]` (labels, 59 / 1,060
 * options), `_sfm_post_related_producer[]` + `_sfm_post_related_wines[]`
 * (materials 54 / 1,029; news). Post count: `X-WP-Total` 6039. "Filed
 * against" is what the facet names show and no more: the copy does not say
 * every post carries both fields, because only the filter markup and one
 * wine page's `#news` section (two posts) were read (dossier, decision 2).
 * The labels page is not one of the three frames, so its same-day row is a
 * dossier fact, not a sentence here.
 */
export const PROJECT_RELATIONS: BlockWysiwygProps = {
  tagline: "Relations",
  title: "Posts are filed against a producer and a wine.",
  body: [
    {
      type: "paragraph",
      text: "The site holds 6,039 posts, and posts are filed against a producer and a wine. That is what the four filter pages run on. The news page filters by producer and by wine; the bottle-shot and label page by producer, by wine and by material type; the trade-materials page by producer and by wine; the producers page by country. The wine drop-down on the label page offers 1,060 titles and the one on the materials page 1,029. On the one wine page fetched, the news section holds the two posts filed against that wine.",
    },
  ],
};

/**
 * Block 6 — `BlockImageFull`: `/browse-news`, captured 2026-09-11 19:25 UTC.
 * Evidence for the paragraph above: the producer and wine filter panel, the
 * grid/list toggle and three dated posts.
 */
export const PROJECT_IMAGE_NEWS: BlockImageFullProps = {
  image: {
    src: `${IMAGES}/vintus-news.jpg`,
    alt: "The news page: the headline News over a photograph of old newsprint, a line reading Browse the most recent news, information and activities from our producers, a Toggle View control reading Grid and List (filterable), a grey filter panel with a Producer drop-down set to All Producers and a Wine drop-down set to All Wines, and three dated posts with thumbnails, the first Standing Up for Cabernet Sauvignon, September 09, 2026.",
    width: 1600,
    height: 1000,
  },
};

/**
 * Block 7 — `BlockWysiwyg`: the trade tools.
 *
 * Sell sheet: `sell-sheet-generator_.html` (the instructions paragraph, the
 * `sellsheet_*` inputs, the `includereviews` checkbox, the reCAPTCHA iframe).
 * Tech sheet: `form.pricing_form` on every wine card of a producer page
 * (`pricing` / `price` maxlength 80 / `pricing1`, hidden `wine_id`). Share
 * form: the Gravity Forms modal's Select Material options. Menu: the nine
 * Trade Tools items in the header's dropdown (dossier, decision 3). Materials
 * page: shelf-talker and tech-sheet PDFs under `/wp-content/uploads/2026/04/`.
 */
export const PROJECT_TOOLS: BlockWysiwygProps = {
  tagline: "Trade tools",
  title: "A sell sheet is a search, a title and a name.",
  body: [
    {
      type: "paragraph",
      text: "The sell-sheet generator is one page. A rep searches by brand, wine or vintage and adds wines one at a time. They type a sheet title, their name and contact details, tick whether to include reviews, and either download the PDF or have it sent to an address they enter. The date is filled in for them.",
    },
    {
      type: "paragraph",
      text: "On the one producer page fetched, a wine card carries a tech-sheet control with two options: add pricing, which opens a field for the rep's own price, and show onboarding specs. Beside it, a share form sends any of four documents, the technical sheet, the case card, the shelf talker or the staff training card, to an address the rep enters. The trade-materials page lists those documents as PDFs with a producer and a wine filter, and the Trade Tools menu is nine items long: product images, point-of-sale, media, producers, the producers summary, trade materials, about, reviews and create sell sheet.",
    },
  ],
};

/**
 * Block 8 — `BlockImageFull`: `/sell-sheet-generator/`, captured 2026-09-11
 * 19:25 UTC. Evidence for paragraph 1 above: the instructions, the wine
 * search, the five fields, the reviews checkbox and the recipient field.
 */
export const PROJECT_IMAGE_SELL_SHEET: BlockImageFullProps = {
  image: {
    src: `${IMAGES}/vintus-sell-sheet.jpg`,
    alt: "The sell-sheet generator: the headline Generate a Sell Sheet over a vineyard photograph, a paragraph of instructions ending Then Download or email the PDF sell sheet, a Select Wine(s) search box, then the fields Sheet Title, Your Name, Date prefilled with 09/11/2026, Contact Info, an Include Reviews checkbox and an optional Recipient Email Address.",
    width: 1600,
    height: 1000,
  },
};

/**
 * Block 9 — `BlockWysiwyg`: the login and the lists. No image: two of the
 * three pages print one sentence to a visitor, and a frame of a sign-in
 * prompt shows nothing.
 *
 * Sign in: `wp-login.php?redirect_to=%2Fmy-dashboard`; `/my-dashboard` and
 * `/my-orders/` print "You must be logged in to view this page." (19:11 UTC);
 * `/my-notes/` prints "Please log in to view this page." (19:52 UTC). The dashboard's one sentence: "My
 * personal dashboard with the latest updates from the producers I follow."
 * Subscribe: the Brevo form's fields, the five "I am a" options and the two
 * newsletter preferences (`subscribe_.html`; the second list's live label is
 * "Special Announcements — Producer Profiles, events, and announcements").
 * No route renders an SMS form (`<form[^>]*sms` → 0), so the text list is
 * not a sentence here; WP SMS and WonderPush are named in the stack tab as
 * registered endpoints and a loader, which is all the HTML shows. Distributors: 379 sitemap URLs; the one
 * fetched is an event sign-up card (dossier, decisions 4–5, Unverifiable 3
 * and 8).
 */
export const PROJECT_LOGIN: BlockWysiwygProps = {
  tagline: "Behind the login",
  title: "A dashboard, orders and notes behind one sign-in.",
  body: [
    {
      type: "paragraph",
      text: "Sign in leads to a personal dashboard that the site describes as the latest updates from the producers a user follows, and beside it sit a My Orders page and a My Notes page. To a visitor each answers with a single line asking them to log in, and what they hold for a signed-in user is not in the served pages, so it is not on this one. Sign up is a newsletter form that asks whether the reader is a distributor, a restaurant, a retailer, press or a consumer. It offers two lists, a weekly Monday digest of scores, news and releases, and producer profiles, events and announcements. A directory of 379 distributor entries completes the set.",
    },
  ],
};

/**
 * Block 10 — `BlockProjectDetails`. `Stack` feeds the intro's second tab and
 * is dropped from this block by `projectDetailsWithoutStack`. `Catalogue` is
 * the producers REST header and the wines sitemap split by depth; `Theme` is the generator meta, the theme
 * directory and the user's ruling (inherited). No Tests row: no test suite exists. The block auto-places pairs,
 * so the five rendered rows read (Catalogue | Theme), (Year | Platform),
 * (Live site | empty).
 */
export const PROJECT_DETAILS: ProjectDetail[] = [
  { label: "Stack", value: "WordPress 7.1, PHP, Search & Filter Pro, Gravity Forms, Brevo, GA4" },
  { label: "Catalogue", value: "161 producers · 703 wines · 1,600 vintages" },
  { label: "Theme", value: "Inherited custom theme · WordPress 7.1" },
  { label: "Year", value: "2026" },
  { label: "Platform", value: "WordPress" },
  { label: PROJECT_LIVE.label, value: PROJECT_LIVE.display, href: PROJECT_LIVE.url },
];

/**
 * Block 11 — `GeneralCta`. Points at `/contact/`, never at the live site (the
 * live URL is a details row). The line names this reader's own situation: a
 * catalogue with a hierarchy and a sales team that needs documents from it,
 * held by a site that was not built for either.
 */
export const PROJECT_CTA: GeneralCtaProps = {
  text: "Has your catalogue outgrown the site that holds it?",
  label: "Contact",
  href: "/contact/",
};
