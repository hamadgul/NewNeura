/**
 * Content for `/work/foodtruckrentals/`.
 *
 * Provenance for every string here is recorded in
 * `docs/research/case-studies/foodtruckrentals.md` (the dossier): every
 * mechanism sentence traces to a file:line in `~/Desktop/foodtruckrentals.com`
 * at HEAD `5ff670f`, every number to the command that measured it, and the
 * dated SERP positions to the source comment that records them. Nothing below
 * was taken from memory.
 *
 * Image sizing note: `width`/`height` are the assets' true decoded pixels
 * (1200x750 for the cover, 1600x1000 for every screen). `next/image` reserves
 * the aspect ratio from them, and every block takes its height from that ratio.
 *
 * VOICE — the source site is written in the first person plural ("we handle
 * wrap, staffing…") because it is the client speaking; this page is NeuraGul
 * speaking about the client's site, and says "we" only of ourselves. No
 * headcount, no "I", no exclamation points, no "X, not Y" constructions, no
 * em dashes in copy strings.
 *
 * ── What the 2026-09-11 expansion changed ───────────────────────────────────
 * The page had four blocks and three claims the code does not support as
 * written (task-13-report.md §0): the pricing module reaches the JSON-LD
 * offers on seven of 24 routes rather than "every commercial page", nothing
 * wires the tests to the build (they fail the test RUN), and the hero has
 * been a one-screen three-photograph collage since 2026-08-16 rather than a
 * "full-bleed activation hero". The header lead's "national site … competing
 * well past its first city" implied an outcome the repo does not record and a
 * market the pricing module explicitly excludes (NYC + tri-state only). All
 * rewritten to what the code does. `PROJECT_MEDIA_QUOTE` (home + work) is
 * gone: the home frame is the same hero as the frozen cover, and repeating the
 * cover in the body was Task 8's trap. The work frame moved to the guards
 * section it is evidence for.
 *
 * The 141 Vitest count was re-measured on 2026-09-11 (141 passed in 24 files,
 * none skipped) and matches Task 4's frozen number. The search-volume claims
 * cut in Task 5 stay cut; the page argues from mechanism and from the SERP
 * positions the source records, never from volumes.
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
 * still reads "Food Truck Rentals" on the page and in the breadcrumb. A
 * `<title>` is read cold in a result list, so it names the category of work as
 * well as the client. "24-Page" is the count of static route files (24; the
 * sitemap carries 31 URLs with the seven case studies).
 */
export const PROJECT_TITLE = "Food Truck Rentals: a 24-Page SEO Build";
export const PROJECT_CANONICAL = "/work/foodtruckrentals/";
/**
 * The meta description, ~150 characters, stating what was built and what
 * holds it in place. The old one said the JSON-LD was "from one pricing
 * module" for every page; seven pages build their offers from it, so this
 * names the two rules the tests actually enforce. "one owner for the New York
 * query" is scoped on purpose: `tests/nyc-cannibalization.test.ts` guards ONE
 * cluster (nine NYC phrasings) with one owner; no site-wide one-page-per-query
 * rule exists.
 */
export const PROJECT_DESCRIPTION =
  "A 24-page Next.js site for a New York food truck brand-activation company: one owner for the New York query, prices from one module, 141 Vitest tests.";
export const PROJECT_OG_IMAGE = `${IMAGES}/foodtruckrentals.jpg`;

/**
 * The live row. `metadataBase` in the source is `https://www.foodtruckrentals.com`
 * (`app/layout.tsx:63`; `lib/site.ts:12` says why it must be the `www` host).
 */
export const PROJECT_LIVE = {
  label: "Live site",
  display: "foodtruckrentals.com",
  url: "https://www.foodtruckrentals.com",
};

/**
 * Header. `lead` is the project's shape as the code shows it, in one line: the
 * two rules the suite enforces (`tests/nyc-cannibalization.test.ts`,
 * `tests/pricing.test.ts`) and the measured count. LENGTH IS MEASURED: the
 * header's lead slot at 390 px holds five lines (156 px) before the `<h1>`
 * runs into the cover's top edge; a six-line lead overlapped it by 10 px at
 * 390 and 41 px at 360 (`$SCRATCH/ftr-lead.mjs`, candidates swapped into the
 * live slot). The shipped 118 characters is four lines at 390 and five at
 * 320, clear at every width (re-measured after review round 1 scoped the
 * owner rule to the New York query; 130 and 120 characters overlapped by
 * 10 px at 320). Do not lengthen it without re-measuring. The old lead ("a live
 * national site, indexed and structured to compete well past its first city")
 * claimed a market the source excludes (`lib/pricing.ts:92-99`) and an outcome
 * it does not record (dossier, Unverifiable 1). The cover is the site's home
 * page at HEAD: the three-photograph hero collage.
 */
export const PROJECT_HEADER: BlockHeaderProjectsProps = {
  title: "Food Truck Rentals",
  lead: "Twenty-four pages, one owner for the New York query, prices from one file, and 141 Vitest tests holding both in place.",
  location: "2026 · Web",
  service: "Web Development · Data Intelligence",
  breadcrumbLabel: "Work",
  breadcrumbHref: "/work/",
  backLabel: "All work",
  image: {
    src: `${IMAGES}/foodtruckrentals.jpg`,
    alt: "",
    width: 1200,
    height: 750,
  },
};

/**
 * Block 2 — `BlockIntroDouble`, the two-label variant.
 *
 * `statement` is the brief, unchanged. `body` is the stack from `package.json`
 * (Next 16.2.10 and React 19.2.4 pinned; `motion` ^12; Tailwind 4; Vitest 4.1
 * with Testing Library and vitest-axe), the fonts from `app/layout.tsx:10-35`,
 * the deployment from `vercel.json` and `.gitignore`, and Resend from
 * `app/actions/inquiry.ts:52`. `projectIntroTabs` overwrites both labels to
 * "The brief" / "The tech stack".
 */
export const PROJECT_INTRO: BlockIntroDoubleProps = {
  labels: ["The brief", "What we built"],
  activeLabel: 0,
  statement:
    "A New York brand-activation company wraps, staffs, and permits food trucks for fashion houses, department stores, and restaurants. They were selling all of it without a website of their own.",
  body: "Next.js 16 and React 19 in TypeScript, Tailwind CSS 4, and Motion for the hero, the roster and the nav, with Archivo, Public Sans and Overpass Mono loaded through next/font. Vitest 4 with Testing Library and axe runs 141 tests across 24 files. Twenty-four routes plus seven case studies from one template, deployed on Vercel, with Resend delivering every inquiry to the client's inbox.",
};

/**
 * Block 3 — `BlockWysiwyg`: one query, one owner.
 *
 * The nine phrasings and the owner route: `tests/nyc-cannibalization.test.ts:27-40`.
 * The root-layout hole and its twelve days: lines 107-128 and
 * `app/layout.tsx:48-61`. The 2026-08-16 measurement (#45 vs absent from the
 * top 94; #57/#69/#83/#92) and what moved in the merge:
 * `app/food-truck-rental-nyc/page.tsx:1-28`, `next.config.ts:63-84`. The
 * chain test: test lines 159-168. Booted copy: `/nyc` → 308 → the owner.
 * "treated as one keyword" is the source's own finding (test lines 11-16),
 * stated without the volume it was measured from (Task 5 ruling).
 */
export const PROJECT_OWNER: BlockWysiwygProps = {
  tagline: "Search",
  title: "One query, one owner.",
  body: [
    {
      type: "paragraph",
      text: "Nine phrasings of the New York rental query, from food truck rental nyc to rent a food truck new york, are treated as one keyword, so exactly one page may claim any of them in its title, description or heading: the NYC rental page. A test lists the nine, scans every route file for a second claimant, and fails the run if it finds one. It scans the root layout too, because the homepage title lives there, read Food Truck Rentals NYC from launch, and sat outside the guard for twelve days.",
    },
    {
      type: "paragraph",
      text: "The guard stayed green while Google split two pages on their body copy anyway. Measured on 16 August 2026, the NYC hub sat at position 45 for food truck rentals while the money page it was built to feed was nowhere in the top 94, and food truck rentals nyc returned four of the site's own URLs at 57, 69, 83 and 92. So the hub was merged into the owner. Its five-borough ledger, its parking, permit and power notes and its case spreads moved across, and the old address became a permanent redirect, with a test that no redirect on the site chains through another.",
    },
  ],
};

export const PROJECT_IMAGE_NYC: BlockImageFullProps = {
  image: {
    src: `${IMAGES}/foodtruckrentals-nyc.jpg`,
    alt: "The NYC rental page, the one route allowed to own the New York query: the breadcrumb Food truck rental NYC, the headline Food truck rental in New York City, priced up front, a lead that publishes $1,500 a day unbranded and $10,000 custom-wrapped, and the top of the facts ledger.",
    width: 1600,
    height: 1000,
  },
};

/**
 * Block 5 — `BlockWysiwyg`: the pricing module.
 *
 * Tiers, add-ons, floor: `lib/pricing.ts:28-90`. The generated files and the
 * sitemap-sourced route list: `lib/agent-files.ts:13-50`, the three route
 * handlers under `app/`. Offer nodes from `TIERS` on seven routes:
 * `lib/schema.ts:36-49` (`pricedService` on `/`, catering, both market pages,
 * both cost guides) and `app/food-truck-rental/page.tsx:123-134`. The hero's
 * floor: `any-street-hero.tsx:218-220`; the service-area row:
 * `app/food-truck-rental/page.tsx:190`. The four literal `minPrice` routes and
 * the 138-vs-23 count: dossier, decision 3. The superseded-floor test and the
 * `$15K` expansion: `tests/pricing.test.ts:86-122`; the correction:
 * `c9d71de`, 2026-07-28. Booted copy: `/pricing.md` header line.
 */
export const PROJECT_PRICING: BlockWysiwygProps = {
  tagline: "Pricing",
  title: "Every price comes from one file.",
  body: [
    {
      type: "paragraph",
      text: "Three tiers, four add-ons and a $1,500 floor live in one module, and the files that machines read are generated from it on request: the price sheet at pricing.md and both llms files are route handlers, and nobody edits them by hand. Their route list comes from the sitemap, so a redirected URL cannot appear in them. Seven pages build their structured-data offers from the same tiers, the hero's day rate is the module's floor, and the rental page's service-area row prints the module's label word for word.",
    },
    {
      type: "paragraph",
      text: "The module does not reach every page. Four pages still hard-code a minimum price in their schema, and most prose prints its figures as literals, so the control there is a test. It scans every page and component for the two floors that were corrected in July 2026, unbranded $4,500 down to $1,500 and branded $15,000 down to $10,000, expands the $15K shorthand first so both spellings are covered, and fails the run if either reappears as the site's own price.",
    },
  ],
};

export const PROJECT_IMAGE_RENTAL: BlockImageFullProps = {
  image: {
    src: `${IMAGES}/foodtruckrentals-rental.jpg`,
    alt: "The rental page: the headline Food truck rental, handled end to end, a lead whose $1,500 a day is the pricing module's floor, and a facts ledger whose service-area row reads NYC + Long Island, New Jersey & Connecticut, the module's label verbatim.",
    width: 1600,
    height: 1000,
  },
};

/**
 * Block 7 — `BlockWysiwyg`: the guards.
 *
 * Sitemap: `app/sitemap.ts:7-44` (the two failures, dated) and
 * `tests/sitemap-freshness.test.ts:43-70, 93-124`. GBP: `lib/gbp.ts:13-22,
 * 58-67, 84`, `lib/schema.ts:5-8, 77-141`, `tests/gbp.test.ts` ("keeps the
 * telephone out of everything a person can read"; `:87` no `address` on the
 * ORG and LOCAL nodes), the page-level address test at
 * `tests/nyc-cannibalization.test.ts:237-255` (contact + NYC JSON-LD only). Specs: `lib/specs.ts:4-24, 106`,
 * `lib/pricing.ts:101-109`, `tests/specs.test.ts`. The 48-hour wording and the
 * built-HTML scan: `tests/rendered-copy.test.ts:5-19, 21-55`. Seven case
 * studies and the typed slug union: `lib/case-studies.ts:1-16`,
 * `app/work/[slug]/page.tsx`. Every count confirmed on the booted copy
 * (telephone in the visible body on 0 of 31 routes).
 */
export const PROJECT_GUARDS: BlockWysiwygProps = {
  tagline: "Guards",
  title: "Tests for the rules a comment could not hold.",
  body: [
    {
      type: "paragraph",
      text: "The sitemap dates every route by hand rather than stamping the build time on all of them, and the file's own comment says to bump a date when its page changes. That rule broke twice in two days: eight stale dates on 15 August 2026, sixteen of twenty-three the next morning. So a test now reads one git log for the whole history, finds each route's last commit, and fails when the sitemap claims a page is older than its own file. It also fails if it cannot read git at all, so a broken harness cannot pass by checking nothing.",
    },
    {
      type: "paragraph",
      text: "The Google Business Profile is wired into the structured data by stable ids, with the listing's spelling of the name carried as an alternate name so the listing and the site resolve to one company, and its hours as read off the profile on 16 August 2026. The listing's telephone number is in the JSON-LD and nowhere a person can read it; a test fails if it leaks into a page or a component. There is no street address on purpose, because the profile hides one, and tests assert that neither company node, nor the contact and NYC pages' own schema, carries one.",
    },
    {
      type: "paragraph",
      text: "When the brief asked for truck specifications lifted from competitors, the published numbers refused to agree: throughput ran from 40 to 150 guests an hour and generator draw from 3,000 to 25,000 watts, because the menu and the equipment on board set both. The site publishes those as category ranges under a standing caveat, keeps its own fleet's specs marked unverified until the owner supplies them, and a test fails if a range ever turns into a claim about these trucks.",
    },
    {
      type: "paragraph",
      text: "The same suite holds the contact page's reply promise to one wording, within 48 hours, reads the built HTML for a word fused onto a closing tag, and types the seven case studies' slugs as a union so a page cannot link to a study nobody wrote. All seven render from one template and one data file, with the client's own activation facts as their metrics.",
    },
  ],
};

/**
 * Block 8 — `BlockMediaDoubleQuote`: the contact page beside the work index.
 *
 * At `xl` the blockquote sits directly under the SMALL media, so the quote is
 * that image's own caption: the work index goes with the work-index frame.
 * The large slot carries the contact page, whose frame shows the 48-hour
 * promise and no telephone (paragraphs 2 and 4 above). `foodtruckrentals-work.jpg`
 * is the 2026-09-04 capture, shared by two service pages with this same alt
 * family; kept, not re-captured.
 */
export const PROJECT_MEDIA_GUARDS: BlockMediaDoubleQuoteProps = {
  large: {
    type: "image",
    src: `${IMAGES}/foodtruckrentals-contact.jpg`,
    alt: "The contact page: the headline Start an activation, a lead asking for the brand, the market and the dates, and a facts ledger led by Quote turnaround, within 48 hours, with no telephone number anywhere on the page.",
    width: 1600,
    height: 1000,
  },
  small: {
    type: "image",
    src: `${IMAGES}/foodtruckrentals-work.jpg`,
    alt: "The work index: every activation, with the client, the borough, and the year, opening on the Louis Vuitton spread and its two metrics.",
    width: 1600,
    height: 1000,
  },
  quote: "The work index. Seven activations from one template, each with the client, the borough, and the year.",
};

/**
 * Block 9 — `BlockWysiwyg`: the hero and the roster. No body image: the frozen
 * cover at the top of the page IS the hero at HEAD, and repeating it here was
 * Task 8's duplicate-cover trap. The copy points the reader back up.
 *
 * The old pin and the collage: `components/any-street-hero.tsx:30-38, 77-80,
 * 112-119` (rebuilt 2026-08-16, `bfeb878`); the retired generated video:
 * `579674e`, 2026-07-29; `tests/any-street-hero.test.tsx` (three photographs,
 * no video, one preload, no pin). The roster: `lib/clients.ts` (17), `app/globals.css:141-192`
 * (`wdth` 100 → 112, `nowrap`, the 24 px and 64 px measurements),
 * `components/roster-index.tsx:40-50, 52-81`. The photo script:
 * `scripts/prep-images.mjs:1-4, 13-36, 47-60` (22 files; rotation before
 * strip; the three that shipped rotated, fixed `f03da43` 2026-07-26).
 */
export const PROJECT_FRONT_DOOR: BlockWysiwygProps = {
  tagline: "Front door",
  title: "Three trucks at once.",
  body: [
    {
      type: "paragraph",
      text: "The hero was a pinned section two screens tall that scrubbed three photographs past the viewport one at a time, so a visitor scrolled through two screens before reaching any content and only ever saw one truck. Since 16 August 2026 it is one screen: a three-by-two collage with Louis Vuitton in the large panel because its near-square frame crops best there, and the other two stacked beside it. Only the large panel is preloaded. A generated video that once backed the hero was removed in July. The frame at the top of this page is that hero.",
    },
    {
      type: "paragraph",
      text: "Below it, seventeen clients from one data file. The active name widens on the typeface's width axis, from 100 to 112, and the names cannot wrap, because measured widening on wrapping text moved the wrap point and shoved the roster down 24 pixels mid-scroll. The card that shows each client's photographs exists from 1,280 pixels wide; below that, tapping a row opens its strip inline. The client's twenty-two phone photographs were converted by a script that bakes each rotation into the pixels before it strips the metadata, because doing it the other way round shipped three of them sideways.",
    },
  ],
};

/**
 * Block 10 — `BlockProjectDetails`. `Stack` feeds the intro's second tab and
 * is dropped from this block by `projectDetailsWithoutStack`. Every entry is
 * from `package.json`; `Pages` is the route-file count and the booted copy's
 * `/sitemap.xml`; `Tests` is the 2026-09-11 run; the live row takes the
 * domain from `metadataBase`.
 */
export const PROJECT_DETAILS: ProjectDetail[] = [
  {
    label: "Stack",
    value: "TypeScript, Next.js 16, React 19, Tailwind CSS 4, Motion, Vitest, Vercel",
  },
  { label: "Pages", value: "24 routes · 31 URLs in the sitemap" },
  { label: "Tests", value: "141 Vitest" },
  { label: "Deployment", value: "Vercel · Resend for every inquiry" },
  { label: "Year", value: "2026" },
  { label: "Platform", value: "Web" },
  { label: PROJECT_LIVE.label, value: PROJECT_LIVE.display, href: PROJECT_LIVE.url },
];

/**
 * Block 11 — `GeneralCta`. Points at `/contact/`, never at the live site (the
 * live URL is a details row). The line names this reader's own problem: two
 * pages on their site competing for one search.
 */
export const PROJECT_CTA: GeneralCtaProps = {
  text: "Do two of your pages compete for the same search?",
  label: "Ask us to check your pages",
  href: "/contact/",
};

/**
 * A client's Google review, quoted verbatim (an ellipsis marks a cut, nothing
 * is reworded) and attributed as the profile displays it. The `quote` node is
 * the block's pull-quote shape (`<h4><em>`); the attribution is an ordinary
 * paragraph. Placed directly above the CTA band, which is where a trust
 * signal earns its keep. Reviews are in the client's voice, so "he" and
 * "Hamad" are theirs and do not break the site's "we" rule. The user confirmed
 * (2026-09-13) that this reviewer is this client; his opening sentence is on
 * the Web Development service page.
 */
export const PROJECT_VOICE: BlockWysiwygProps = {
  title: "In the client's words",
  body: [
    {
      type: "quote",
      text: "“He took my ideas and turned them into a clean, modern, fast-loading site that looks great on every device. Communication was clear, deadlines were met, and the final result exceeded my expectations.”",
    },
    { type: "paragraph", text: "Brian Murphy, Google review, August 2026" },
  ],
};
