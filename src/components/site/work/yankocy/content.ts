/**
 * Content for `/work/yankocy/`.
 *
 * Provenance for every string here is recorded in
 * `docs/research/case-studies/yankocy.md` (the local repo `~/Projects/Yankocy`
 * at `1e098ea`, the staging deploy, and the live GoDaddy domain, all observed
 * 2026-09-25). Nothing on this page claims a ranking, traffic, call or lead
 * result: the new site has NOT replaced the GoDaddy site on www.yankocy.com
 * yet, so no outcome exists to measure (dossier, Live status).
 *
 * USER RULING (2026-09-25): "Publish as a rebuild". Name the client, describe
 * what was built, say it is being switched over, and never link the staging
 * URL. The old site's search positions (Steeltex #1 and the rest) are the OLD
 * site's baseline and appear nowhere here. Everything on the dossier's
 * Unverifiable list stays off the page: CLS 0, the axe pass, the GBP / review /
 * outreach / disavow drafts, client approval of the copy, engagement dates or
 * price, and the client's own claims ("premier", "75 years", named staff).
 *
 * Image sizing note: `width`/`height` are each file's true decoded pixels
 * (1200x750 for the cover, 1600x1000 for the in-page captures). All new-site
 * captures come from STAGING, so no caption calls them "the live site".
 *
 * VOICE: "we", never "I"; no headcount; no em dashes in the prose below.
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
export const PROJECT_TITLE = "Yankocy: a Wholesale Distributor Site Rebuild";
export const PROJECT_CANONICAL = "/work/yankocy/";
/**
 * The meta description (160 characters). "26 pages" is `find dist -name
 * '*.html'`; "37 old addresses" is `redirects.csv` rows 3-39, 37/37 one-hop
 * 301 → 200 on staging; the Steeltex LCP is `lh.json` (2026-09-24).
 */
export const PROJECT_DESCRIPTION =
  "A 26-page rebuild of a Connecticut building materials distributor's GoDaddy site: 37 old addresses redirected, schema on every page, Steeltex LCP 11.6s to 1.9s.";
export const PROJECT_OG_IMAGE = `${IMAGES}/yankocy.jpg`;

/**
 * Header. The lead is 80 characters, inside the ~83-character budget the NYMM
 * header measured at 320-1440 (3-4 lines with the 35px gap intact); this
 * project's one-word title wraps less than that one, so there is headroom.
 * Re-measure at 320 and 1280 before lengthening.
 *
 * `service` carries SEO as its own line: most of the work (redirects, titles,
 * schema, the keyword decision) is search work, and `caseStudySchema.about`
 * is split off this string.
 *
 * Cover: staging `/` at 1200x750, the maroon utility bar, the nav with Search
 * and the Call button, the hero H1 and the truck photo (dossier, Shot list).
 */
export const PROJECT_HEADER: BlockHeaderProjectsProps = {
  title: "Yankocy",
  lead: "A 26-page trade site to replace nine GoDaddy pages, with every old address kept.",
  location: "2026 · Web",
  service: "Web Development · SEO",
  breadcrumbLabel: "Work",
  breadcrumbHref: "/work/",
  backLabel: "All work",
  image: {
    src: `${IMAGES}/yankocy.jpg`,
    alt: "",
    width: 1200,
    height: 750,
  },
};

/**
 * Block 2 — `BlockIntroDouble`, turned into two tabs by `projectIntroTabs`
 * (the brief, and the `Stack` row of `PROJECT_DETAILS`).
 *
 * Statement: "nine pages", "no H1 on eight", "one page of 100+ products",
 * `FULL-AUDIT-REPORT.md:7,20,61`; "11.6 seconds" is the old Steeltex page's
 * mobile LCP in `lh.json`. "sells to the trade" is `CLIENT-FEEDBACK-ADDENDUM.md:3-6`.
 * Body: the stack as verified (dossier, Stack): the Python build, no npm
 * dependencies, 42,800 B CSS, 16,191 B deferred search JS, 5 self-hosted woff2,
 * Vercel with 77 redirect rules and 4 header rules, the three build asserts
 * (`build.py:355-357`).
 */
export const PROJECT_INTRO: BlockIntroDoubleProps = {
  labels: ["The brief", "What we built"],
  activeLabel: 0,
  statement:
    "A wholesale building materials distributor in Monroe, Connecticut, that sells to the trade, on a nine-page GoDaddy site: more than a hundred products on one page, no main heading on eight of the nine, and a Steeltex pool wire page that took 11.6 seconds to show its main content on a phone.",
  body: "A static site built by a Python script we wrote, with no framework and no npm dependencies. Plain HTML, one 42.8 KB stylesheet, a 16 KB search script that loads after the page, and two typefaces served from the site itself. It is hosted on Vercel, with the redirects and the security and caching headers written into one config file by the build. The build stops if any page has more than one main heading, a title over 60 characters or a description over 160.",
};

/**
 * Block 3 — `BlockWysiwyg`: the catalogue.
 *
 * Old: `services.html`, 100+ products on one 1,541-word page
 * (`FULL-AUDIT-REPORT.md:20`). New: `/products/` hub + 13 category pages
 * (listed in dossier (a)2), H2 product groups, `<th scope>` spec tables,
 * 271 `<tr>`; 3 nationwide product pages. Search: 262-item index, `/` or
 * Ctrl/Cmd+K, sizes / plurals / small typos, deep link to the table row
 * (`site-draft/README.md:9`).
 */
export const PROJECT_CATALOGUE: BlockWysiwygProps = {
  tagline: "Catalogue",
  title: "One long product page became thirteen.",
  body: [
    {
      type: "paragraph",
      text: "The old site listed more than a hundred products on a single page of 1,541 words. We split it into thirteen category pages under one catalogue: drainage and septic, masonry supply, rebar and wire mesh, concrete accessories, and nine more down to ice melt. Each product group has its own heading and a spec table of sizes and options, 271 rows across the site. The three products that ship nationwide, Steeltex pool wire, shingle backer board and Bearcat wheelbarrows, each got a page of their own.",
    },
    {
      type: "paragraph",
      text: "A contractor who knows the part number should not have to scroll for it. The search box in the header opens with the slash key or Ctrl+K, reads from an index of 262 items built with the site, copes with sizes, plurals and small typos, and jumps to the exact row in the table.",
    },
  ],
};

/**
 * Block 4 — `BlockImageFull`: staging `/products/drainage-septic/`, captured
 * 2026-09-25 ~19:28 UTC. Evidence for Block 3: the H1, the intro, the photo
 * strip, the "On this page" rail and the Pipe spec table.
 */
export const PROJECT_IMAGE_DRAINAGE: BlockImageFullProps = {
  image: {
    src: `${IMAGES}/yankocy-drainage.jpg`,
    alt: "The drainage and septic category page: the headline Drainage pipe, fittings and septic supplies, an intro listing pipe types, a strip of four product photos, an On this page list of product groups, and a Pipe table with rows for triplewall drain, SDR35 solvent weld, SDR35 gasketed and PVC ASTM-2729 with their sizes.",
    width: 1600,
    height: 1000,
  },
};

/**
 * Block 5 — `BlockWysiwyg`: the move.
 *
 * 37 old paths (9 `.html` pages, 8 aliases, the `/mobile/` copies, the two
 * old sitemaps), 37/37 one-hop 301 → 200 on staging, curl 2026-09-25 ~19:25
 * UTC. Word counts: `MIGRATION-AUDIT.md:46-56` (home 457 → 726, Steeltex
 * 288 → 574, About 194 → 531); quoted snippets kept, same file. Dated
 * pre-switch snapshot with rollback triggers: `MIGRATION-AUDIT.md:79-86`.
 * Launch state: www.yankocy.com still GoDaddy on 2026-09-25 (dossier, Live
 * status), so "being switched over", never "launched".
 */
export const PROJECT_MIGRATION: BlockWysiwygProps = {
  tagline: "The move",
  title: "Thirty-seven old addresses, each sent to a working page.",
  body: [
    {
      type: "paragraph",
      text: "A business that already shows up in search has the most to lose from a new site. So before anything else we listed every address the old site had ever answered on: the nine pages, eight older aliases, the copies GoDaddy served to phones, and two old sitemaps. That came to 37. On the new site each one redirects permanently, in one hop, to a page that loads, and we checked all 37 against the new site.",
    },
    {
      type: "paragraph",
      text: "The words moved over too. We kept every line Google was quoting from the old pages, and each page grew: the home page from 457 words to 726, the Steeltex page from 288 to 574, About from 194 to 531. Before the switch we saved a dated record of where each old page stood, with the signs that would mean rolling back. The site is built and is being switched over from GoDaddy now.",
    },
  ],
};

/**
 * Block 6 — `BlockWysiwyg`: performance. Lighthouse mobile, Steeltex page,
 * `yankocy.com-audit/data/migration-2026-09-24/lh.json` (2026-09-24): perf
 * 0.47 → 0.88, a11y 0.53 → 1.00, LCP 11.6 s → 1.9 s, weight 1,850 → 167 KiB.
 * CLS (0.761 → 0.235) is left out: the saved run is still above Google's
 * 0.1 line, and the later "0" has no artifact (Unverifiable 3). The 25.82 MB
 * carousel is `FULL-AUDIT-REPORT.md:67`; WebP + srcset + width/height is
 * `site-draft/README.md:21`; fonts are 5 self-hosted woff2, 2 preloads.
 */
export const PROJECT_PERFORMANCE: BlockWysiwygProps = {
  tagline: "Speed",
  title: "The Steeltex page, before and after.",
  body: [
    {
      type: "paragraph",
      text: "Steeltex pool wire is one of the three products Yankocy ships nationwide, so its page is the one we report here. On a phone, in Lighthouse, on 24 September 2026, the old page scored 47 for performance and the new one 88. The main content showed in 1.9 seconds, down from 11.6. The page weighs 167 KiB, down from 1,850, and accessibility went from 53 to 100.",
    },
    {
      type: "paragraph",
      text: "Most of that is what the page no longer carries. The old home page loaded a carousel of fourteen photos, 25.8 MB of them. It now opens on one. Every image was re-encoded as WebP in several widths with its size declared, so a phone downloads the small one, and the fonts come from the site itself with no request to anyone else.",
    },
  ],
};

/**
 * Block 7 — `BlockMediaDoubleQuote`: the new Steeltex page (large, staging
 * `/products/steeltex-pool-wire/`) beside the old one (small, live
 * `www.yankocy.com/pool-wire---steeltex.html`), both 2026-09-25 ~19:28 UTC.
 * At `xl` the quote sits under the SMALL frame, so it captions the old page.
 */
export const PROJECT_MEDIA_STEELTEX: BlockMediaDoubleQuoteProps = {
  large: {
    type: "image",
    src: `${IMAGES}/yankocy-steeltex.jpg`,
    alt: "The new Steeltex page: a maroon bar with office hours and phone numbers, a header with search and a Call button, the headline Steeltex pool wire mesh, the line Heavy-duty paper-backed mesh, sold wholesale to dealers nationwide, Call and Email for a quote buttons, a photo of the mesh, and a specifications panel listing mesh size, roll dimensions, wire gauge, backing and packaging.",
    width: 1600,
    height: 1000,
  },
  small: {
    type: "image",
    src: `${IMAGES}/yankocy-old-steeltex.jpg`,
    alt: "The old Steeltex page on the GoDaddy site: a dark tab navigation bar, three photos of wire rolls, the title Steeltex Pool Wire Mesh, and the specifications as a bulleted list beside a photo of a pool under construction.",
    width: 1600,
    height: 1000,
  },
  quote: "The same page on the GoDaddy site. The specifications were a bullet list, and nothing on the page was marked as its heading.",
};

/**
 * Block 8 — `BlockWysiwyg`: positioning. `CLIENT-FEEDBACK-ADDENDUM.md:3-6`
 * (yards are customers; Steeltex and shingle backer wholesale only), `:26`
 * (the "masonry supply near me" local pack is Yankocy's customers), `:42-46`
 * (tiers; the removed targets, 12,100/mo). Shipped copy quoted from `dist/`:
 * the Steeltex subhead and body, the homeowner FAQ, the delivery-area
 * nationwide callout.
 */
export const PROJECT_POSITIONING: BlockWysiwygProps = {
  tagline: "Positioning",
  title: "Written for dealers and yards.",
  body: [
    {
      type: "paragraph",
      text: "The first keyword plan included searches like masonry supply near me, which gets about 12,100 a month. Then Yankocy told us the mason yards and lumber yards are its customers. We looked at who Google shows for that search, and the local results were those same yards. So we took the phrase off the list, along with the do-it-yourself searches, and aimed the site at what only a distributor sells: Steeltex, shingle backer board and wholesale building materials.",
    },
    {
      type: "paragraph",
      text: "The copy says it plainly. The Steeltex page is sold wholesale to dealers nationwide and ends with We do not sell to the public. A homeowner who lands there finds a question written for them, pointing to their pool builder or local pool supply dealer. The delivery page lists the six regions the trucks cover and, for anyone outside them, names the three products that ship anywhere.",
    },
  ],
};

/**
 * Block 9 — `BlockImageFull`: staging `/delivery-area/`, 2026-09-25 ~19:28
 * UTC. Evidence for the last sentence of Block 8: the nationwide callout and
 * the six regions.
 */
export const PROJECT_IMAGE_DELIVERY: BlockImageFullProps = {
  image: {
    src: `${IMAGES}/yankocy-delivery-area.jpg`,
    alt: "The delivery area page: the headline Building materials delivery across Connecticut and the Northeast, a maroon panel reading Outside our delivery area? These three products ship nationwide, with buttons for Steeltex pool wire, Shingle backer and Bearcat wheelbarrows, then a Where we deliver list of six regions beside a road map of Connecticut, Long Island and the Hudson Valley.",
    width: 1600,
    height: 1000,
  },
};

/**
 * Block 10 — `BlockWysiwyg`: the search layer. No image: JSON-LD does not
 * render. JSON-LD census over `dist/**` (dossier (a)4): 26/26 sitewide
 * WholesaleStore + Organization + WebSite; BreadcrumbList 22; FAQPage 16 with
 * 56 Questions; CollectionPage 14; ItemPage 3; 0 Product, held until a price
 * is published (`site-draft/README.md:20,39`). Old site: zero JSON-LD
 * (`FULL-AUDIT-REPORT.md:63-64`). Canonicals, robots, sitemap (23 URLs,
 * hash-based lastmod), llms.txt, one document for every device (dossier (a)6).
 */
export const PROJECT_SEARCH: BlockWysiwygProps = {
  tagline: "Search",
  title: "Structured data on all 26 pages.",
  body: [
    {
      type: "paragraph",
      text: "The old site had none. Every new page tells search engines the same facts about the business: a wholesale store at 143 Enterprise Drive in Monroe, its hours, its phone lines and the regions it serves. Twenty-two pages add a breadcrumb trail, fourteen are marked as catalogue pages and three as product pages. Sixteen carry their questions and answers as FAQ markup, 56 questions in all. Product markup is held back on purpose, because it expects a price and Yankocy does not publish prices.",
    },
    {
      type: "paragraph",
      text: "Underneath that are the basics the old builder could not do. Each page names its own address as the canonical one. The sitemap lists 23 pages and changes a page's date only when that page's content changes. Phones and desktops now share one page, where GoDaddy served phones a copy of their own, and an llms.txt file describes the business for AI assistants. Nothing here claims a ranking. The site has not switched over yet, so there is nothing to measure.",
    },
  ],
};

/**
 * Block 11 — `BlockProjectDetails`. `Stack` feeds the intro's second tab and
 * is dropped here by `projectDetailsWithoutStack`. No Tests row: the repo has
 * no test suite, only the build asserts, which get their own row. No live-site
 * row and no `href`: the staging URL must not be linked (user ruling) and the
 * production domain still serves the old GoDaddy site.
 */
export const PROJECT_DETAILS: ProjectDetail[] = [
  { label: "Stack", value: "Python static-site build, HTML, CSS, vanilla JS, JSON-LD, Vercel" },
  { label: "Pages", value: "26 pages · 13 categories · 23 sitemap URLs" },
  { label: "Redirects", value: "37 old addresses, one hop each" },
  { label: "Build checks", value: "One heading per page · titles ≤ 60 characters" },
  { label: "Year", value: "2026" },
  { label: "Status", value: "Built · switching over from GoDaddy" },
];

/**
 * Block 12 — `GeneralCta`. Points at `/contact/`. The line names this
 * reader's problem: a site builder they have outgrown, and the fear of losing
 * what already works on the way out. "Send us your site's address" is honest
 * for an email-and-phone contact page.
 */
export const PROJECT_CTA: GeneralCtaProps = {
  text: "Outgrown your site builder, but afraid to lose the pages that already work?",
  label: "Send us your site's address",
  href: "/contact/",
};
