/**
 * Content for `/work/new-york-fine-foods/`.
 *
 * Provenance for every string here is recorded in
 * `docs/research/case-studies/new-york-fine-foods.md` (Task 12, 2026-09-11):
 * the stack from the manifest, every number with the command that proves it,
 * and the sentence each image is evidence for. Nothing below is from memory.
 *
 * ── What the 2026-09-11 rewrite changed, and why ────────────────────────────
 * Nothing on the previous page was contradicted by the repo; it was thin. It
 * described the site as it stood in the spring ("media galleries, service
 * menus, and a booking inquiry flow") and said nothing about the 2026-08-27
 * search expansion that is the point of the repo: 20 new URLs from a measured
 * baseline of 29 ranked keywords, ~85 visits a month and 6 indexable pages.
 * Two strings were cut for having no checkable noun behind them:
 *   the header lead     — "A live brand site that turns browsing into event
 *                          inquiries." No analytics or form export exists.
 *   "cinematic"         — an adjective; and the hero footage was added by a
 *                          commit titled "add AI video" (dossier, Unverifiable
 *                          1), so the copy describes the hero's loading
 *                          mechanism and never characterises the footage.
 * The stack row read "TypeScript, Next.js, JavaScript"; it now reads what
 * `package.json` declares. No test count is stated because no test runner
 * exists in the repo.
 *
 * ── Assets, and why each one sits where it does ─────────────────────────────
 *   nyff.jpg          1200x750  the cover, refreshed 2026-09-10 from the LIVE
 *                               site. Shared by /, /work/, /process/ and
 *                               /services/web-development/. Header only: the
 *                               hero with the wordmark, the seven-item nav and
 *                               the headline is the page's opening image, so it
 *                               is not repeated in the body.
 *   new-york-fine-foods-brooklyn.jpg   1600x1000  runner capture of
 *                               /catering/brooklyn from a scratch copy of the
 *                               repo. Full-bleed under the area-page section.
 *   new-york-fine-foods-weddings.jpg   1600x1000  the same for
 *                               /pizza-trucks/weddings, under the hub section.
 *   new-york-fine-foods-corporate.jpg  1600x1000  /corporate-catering, the
 *                               large slot of the booking block.
 *   new-york-fine-foods-contact.jpg    1600x1000  /contact with the form's
 *                               three-card first step, the small slot beside
 *                               it. Its hero photograph is one of the client's
 *                               remote stock images; the alt describes the
 *                               form, which is the evidence.
 *   nyff-hero.mp4     1200x750  9.1 s capture of the live hero playing, poster
 *                               nyff.jpg. public/site/videos/ is
 *                               orchestrator-owned; the file is referenced, not
 *                               touched. It is the evidence for the
 *                               poster-then-video sentence, which a still
 *                               cannot carry. Also used by /work/ and
 *                               /services/web-development/.
 *
 * VOICE — the source site is written as the client ("we bring fine dining").
 * This site says "we" about our own work. No headcount, no "I", no em dash in
 * any copy string. Every number and every quoted phrase below is exactly as
 * the repo records it.
 *
 * ── What the SEO pass changed ───────────────────────────────────────────────
 * `PROJECT_TITLE` and `PROJECT_DESCRIPTION` are metadata only — the `<title>`
 * stem and the meta description — and are written to compete in a result
 * list rather than to open a page; see the notes on each.
 */
import type { BlockHeaderProjectsProps } from "@/components/site/shared/blocks/BlockHeaderProjects";
import type { BlockImageFullProps } from "@/components/site/shared/blocks/BlockImageFull";
import type { BlockIntroDoubleProps } from "@/components/site/shared/blocks/BlockIntroDouble";
import type { BlockMediaDoubleQuoteProps } from "@/components/site/shared/blocks/BlockMediaDoubleQuote";
import type { BlockWysiwygProps } from "@/components/site/shared/blocks/BlockWysiwyg";
import type { GeneralCtaProps } from "@/components/site/shared/blocks/GeneralCta";
import type { ProjectDetail } from "@/components/site/shared/blocks/BlockProjectDetails";

const IMAGES = "/site/images";
const VIDEOS = "/site/videos";

/**
 * The `<title>` stem, suffixed by the root layout's `"%s — NeuraGul"` template.
 *
 * This is NOT the project's display name — `PROJECT_HEADER.title` is, and it
 * still reads "New York Fine Foods" on the page and in the breadcrumb. A
 * `<title>` is read cold in a result list, so it names the category of work
 * as well as the client. Referenced only by `metadata` in the route file.
 */
export const PROJECT_TITLE = "New York Fine Foods: NYC Catering Site Build";
export const PROJECT_CANONICAL = "/work/new-york-fine-foods/";
/**
 * The meta description. Says what was built and what it was built with, in
 * ~150 characters. "Cinematic" is gone from it (see the header comment); the
 * numbers are the sitemap count before and after the 2026-08-27 commits.
 */
export const PROJECT_DESCRIPTION =
  "A Next.js site for a NYC catering and pizza-truck brand: 26 pages from 6, ten borough and regional pages each built on a local fact, JSON-LD on every service page.";
export const PROJECT_OG_IMAGE = `${IMAGES}/nyff.jpg`;

/**
 * `live_url` / `live_label` from the source entry, kept exact.
 *
 * `BlockProjectDetails` renders its values as plain `<span>`s with no anchor,
 * so the details row prints the readable host and this constant is where the
 * addressable URL survives.
 */
export const PROJECT_LIVE = {
  url: "https://www.newyorkfinefoods.com",
  label: "Live site",
  display: "newyorkfinefoods.com",
} as const;

/**
 * Header. `lead` is the project's OUTCOME, not its brief: the brief is the
 * `BlockIntroDouble` statement below. 6 and 26 are the sitemap's URL counts
 * before and after the 2026-08-27 commits (`git show 1ab1de5^:src/app/sitemap.ts`
 * → 6 entries; `/sitemap.xml` on the booted copy → 26). "Most" = 10 borough
 * and regional area pages + 4 pizza-truck spokes + corporate + bartenders, 16
 * of the 26 (dossier, Verifiable numbers).
 *
 * LENGTH IS MEASURED, NOT CHOSEN. The header's text band is a fixed 500px
 * from `md` up and the lead shares its columns with the service line; the
 * lead's slot is three lines at 1280 (xl: lines 12-19, ~27 chars/line), five
 * at 320. The previous 190-char lead ran seven lines at 768 and printed over
 * "Web Development" by 106x14px there and 109x18px at 1024, and passed the
 * meta row by 108px at 1280. This 83-char lead measures 3 lines at 768/1024/
 * 1280/1440 with the block's own 35px gap intact (lead.bottom - meta.top =
 * -110.7 / -66.3 / -37.3 / -37.3), 3 lines at 390 and 4 at 320. The 29-keyword
 * / 85-visit baseline it used to carry is still on the page, in the
 * `BlockWysiwyg` baseline paragraph below.
 */
export const PROJECT_HEADER: BlockHeaderProjectsProps = {
  title: "New York Fine Foods",
  lead: "Six indexable pages became twenty-six, most built for a borough or occasion search.",
  location: "2026 · Web",
  service: "Web Development",
  breadcrumbLabel: "Work",
  breadcrumbHref: "/work/",
  backLabel: "All work",
  image: {
    src: `${IMAGES}/nyff.jpg`,
    alt: "",
    width: 1200,
    height: 750,
  },
};

/**
 * Block 2 — `BlockIntroDouble`. `projectIntroTabs` turns this into two tabs:
 * the brief (statement + body) and the `Stack` row of `PROJECT_DETAILS`.
 * The statement is the original brief, unchanged. The body is the stack in
 * prose, every item from `package.json` or the source (`proxy.ts` for the
 * headers; the four form components for Formspree).
 */
export const PROJECT_INTRO: BlockIntroDoubleProps = {
  labels: ["The brief", "What we built"],
  activeLabel: 0,
  statement:
    "A NYC catering, pizza-truck, and mobile-bar brand books events on how memorable they look. The website had to do the same job.",
  body: "Next.js 16 and React 19 in TypeScript, Tailwind CSS 4 with shadcn components on Radix, Markdown posts through gray-matter and marked, JSON-LD on every service page, and seven security headers set in the proxy. Deployed on Vercel. Every form posts to Formspree.",
};

/**
 * Block 3 — `BlockWysiwyg`: the baseline and the build order.
 *
 * Every figure is `docs/seo-page-plan-2026-08.md` (DataForSEO, 2026-08-27):
 * §1 the 29 / ~85 / 6 baseline and the three branded page-one terms; §3 the
 * 1,300/mo `catering brooklyn` and the $53.59 CPC / KD 0 `corporate event
 * catering`; §4 the build order; §2 the Google Business Profile note. The
 * 20 URLs are the sitemap diff (6 → 26). The hand-dated sitemap is
 * `app/sitemap.ts:9-15`. No image: a plan file is not a screenshot.
 */
export const PROJECT_BASELINE: BlockWysiwygProps = {
  tagline: "Search",
  title: "Twenty-six pages, from a measured six.",
  body: [
    {
      type: "paragraph",
      text: "On 27 August 2026 the site had 29 ranked keywords, an estimated 85 organic visits a month and six pages Google could index. Three keywords sat on page one, and all three were the brand's own name. The plan in the repo says it plainly: you cannot rank for terms you have no page for.",
    },
    {
      type: "paragraph",
      text: "So the pages were built in the order the numbers set. Brooklyn first, because catering brooklyn is searched 1,300 times a month in the New York market. Corporate second, because corporate event catering had the highest cost per click in the dataset at a keyword difficulty of zero. Then Staten Island, weddings, Long Island, parties, and on down the list. Twenty new URLs shipped that day, and the sitemap dates each one by hand rather than stamping every page with the build time.",
    },
    {
      type: "paragraph",
      text: "The same plan records the one thing code could not fix: the business had no claimed Google Business Profile, and every commercial result page it checked starts with a local pack. Until that profile exists the new pages compete for positions four to ten, and the plan says so in its second section.",
    },
  ],
};

/**
 * Block 4 — `BlockWysiwyg`: the ten area pages.
 *
 * The rule is the header comment of `src/data/service-areas.ts:1-9`, quoted.
 * The Brooklyn, Staten Island and Long Island angles are `areas-nyc.ts` and
 * `areas-tristate.ts` verbatim. The record shape is the `ServiceArea`
 * interface (angle, cateringFor x4, places 10–12, pizzaNote, faqs x3,
 * siblings x2). `areaServed` per page: `app/catering/[area]/page.tsx:70-73`.
 * The 404: `getServiceArea` → `notFound()`; `/catering/hoboken` on the booted
 * copy.
 */
export const PROJECT_AREAS: BlockWysiwygProps = {
  tagline: "Ten area pages",
  title: "A page that survives find-and-replace.",
  body: [
    {
      type: "paragraph",
      text: "Ten catering pages, one per borough or region, each written around a fact that is only true there. The data file that builds them carries the rule in its first lines: if you could swap the area name and the page still read correctly, it is not finished. Brooklyn's page is about the walk-up, four flights with no elevator and a one-way street where the truck cannot idle. Staten Island's is about the driveway. Long Island's is about late May through June, when half of Nassau and Suffolk throws a party on the same four Saturdays.",
    },
    {
      type: "paragraph",
      text: "Each record carries its own angle, four occasions, ten to twelve real neighborhoods, a note on where the pizza truck can park, three questions, and two neighboring pages to link sideways to. The structured data follows the same rule: every page's schema names its own borough or county as the area served, and a slug that is not in the list returns a 404.",
    },
  ],
};

export const PROJECT_IMAGE_BROOKLYN: BlockImageFullProps = {
  image: {
    src: `${IMAGES}/new-york-fine-foods-brooklyn.jpg`,
    alt: "The Brooklyn catering page: the headline Brooklyn Catering, a subtitle running from a third-floor walk-up in Bushwick to a rooftop in Williamsburg, quote and call buttons, and below the hero the section Catering That Can Handle Your Brooklyn Walk-Up.",
    width: 1600,
    height: 1000,
  },
};

/**
 * Block 6 — `BlockWysiwyg`: the pizza-truck hub and its spokes.
 *
 * Search Console figures and the slug ruling: `docs/seo-pizza-truck-plan.md`
 * (2026-07-13), §0 and "GSC baseline". The H1 swap and schema: the 2026-07-22
 * commit (#4), `app/pizza-trucks/page.tsx:36-72`. The spokes: `data/pizza-truck-
 * pages.ts` (hook, 5 faqs, `related` = one sibling spoke + one non-spoke page each) and `minPrice: 1500` in
 * `app/pizza-trucks/[topic]/page.tsx`. The orphaned spokes and the six
 * unlinked mentions: commit `d5d929f` (#6) and `components/ui/rich-text.tsx:4-12`.
 */
export const PROJECT_HUB: BlockWysiwygProps = {
  tagline: "The hub",
  title: "The pizza page kept its slug because it already ranked.",
  body: [
    {
      type: "paragraph",
      text: "In July 2026 Search Console had the pizza-truck page at position 8.1 for pizza truck, with 88 impressions and one click. The plan written that week called it a click-through problem, ruled that the page keeps its URL because renaming it would reset the history, and moved the search phrase into the H1. The schema on that page gained the nine-pizza menu as an offer catalog and a provider that points at the organization's own ID rather than repeating it.",
    },
    {
      type: "paragraph",
      text: "Four pages now hang under it, one per occasion or region: weddings, parties, Long Island and Connecticut. Each opens with the reason it exists apart from the hub, carries five questions and links to one sibling and one related page, and its schema states the client's published starting price. The same day they shipped, a fix commit repaired the internal linking: two of the four spokes had gone out with no link pointing at them, and the corporate page was named on six pages without a keyword-anchored link from any of them, so the plain-text data now carries real links.",
    },
  ],
};

export const PROJECT_IMAGE_WEDDINGS: BlockImageFullProps = {
  image: {
    src: `${IMAGES}/new-york-fine-foods-weddings.jpg`,
    alt: "The Pizza Truck Weddings page: a breadcrumb back to Pizza Trucks, the headline, the line From $1,500, a Check Your Wedding Date button, and below the hero the section The Best-Reviewed Thing at Your Wedding Won't Be the Cake.",
    width: 1600,
    height: 1000,
  },
};

/**
 * Block 8 — `BlockWysiwyg`: the corporate page and the contact form.
 *
 * Corporate: `app/corporate-catering/page.tsx` (hero paragraph; the five
 * `steps`; six FAQs); its build-order rank and CPC are the 2026-08 plan §3–§4.
 * Form: `components/forms/contact-form.tsx` (three-card chooser, per-service
 * fields, `_form_type` appended); the three inline forms are imported by the
 * three hubs; the bar is `components/ui/sticky-booking-bar.tsx`, `lg:hidden`,
 * gated on `showAfter`, which only the three hubs pass (dossier, Notes).
 */
export const PROJECT_BOOKING: BlockWysiwygProps = {
  tagline: "Booking",
  title: "Two pages for the person who has to place the order.",
  body: [
    {
      type: "paragraph",
      text: "The corporate page is written for whoever gets blamed if lunch is late: a certificate of insurance sent to building management before the date, a confirmed delivery window, an invoice with a PO number on it, and a five-step section that says so in order. It was second in the build order because corporate event catering had the highest cost per click in the whole dataset.",
    },
    {
      type: "paragraph",
      text: "The contact form asks which of the three services you want before it asks anything else, then shows only that service's fields: an event type for catering, a location for the truck, a location and a package for the bar. Each submission reaches Formspree tagged with the service it came from. Three shorter forms sit inline on the service hubs, and on a phone a fixed booking bar appears on those three hubs once the menu or package section comes into view.",
    },
  ],
};

export const PROJECT_MEDIA_BOOKING: BlockMediaDoubleQuoteProps = {
  large: {
    type: "image",
    src: `${IMAGES}/new-york-fine-foods-corporate.jpg`,
    alt: "The corporate catering page: the eyebrow For Companies, the headline Corporate Catering NYC, a paragraph naming the certificate of insurance and invoicing, and the section Corporate Catering That Shows Up On Time ending on an invoice with a PO number on it.",
    width: 1600,
    height: 1000,
  },
  small: {
    type: "image",
    src: `${IMAGES}/new-york-fine-foods-contact.jpg`,
    alt: "The contact page: the Get in Touch hero, and the form's first step, a card headed What are you looking for? with three choices, Catering, Pizza Truck and Mobile Bar.",
    width: 1600,
    height: 1000,
  },
  quote: "Which service first, then only that service's fields.",
};

/**
 * Block 10 — `BlockWysiwyg`: the hero mechanism and the headers.
 *
 * Hero: `components/sections/hero-video.tsx` (poster `priority`, `preload="none"`,
 * sources attached after the observer with `rootMargin: "100px"`, 1,000 ms
 * fade on `canPlay`, reduced-motion early return); `ls -la public/hero` →
 * poster 109,966 B. `LazyVideo`: `rootMargin: "200px"`. Headers: `src/proxy.ts`,
 * seven `headers.set`, confirmed with `curl -sI` on the booted copy. Email:
 * `components/ui/protected-email.tsx`.
 */
export const PROJECT_FRONT_DOOR: BlockWysiwygProps = {
  tagline: "Front door",
  title: "A poster first, a video second.",
  body: [
    {
      type: "paragraph",
      text: "The home hero is a still until it is on screen. The poster is a 110 KB JPEG marked as the priority image, so it is fetched first and is what the browser paints before the video exists. The video has no sources at all until an observer sees the hero within 100 pixels; then the WebM and MP4 are attached and it fades in over a second. A visitor who has asked their system for reduced motion never downloads it. Every other video on the site gets its source only within 200 pixels of the viewport.",
    },
    {
      type: "paragraph",
      text: "Every page response carries seven security headers from the proxy: a content security policy that limits images to the site's own and one photo host and form posts to Formspree, no framing, a year of HSTS, and a permissions policy that switches off camera, microphone, location and payment. The email address is never in the HTML; it renders after hydration.",
    },
  ],
};

/**
 * Block 11 — `BlockMediaDoubleQuote`, the `type: "video"` arm, alone.
 *
 * The one piece of evidence a still cannot carry: the frame is the cover, and
 * the background cuts through four scenes under a headline that never moves.
 * `1200x750` is the real stream size (`ffprobe`), 9.125 s, 811,992 B. The
 * block defaults `autoPlay` / `loop` / `muted` to true and adds `playsInline`;
 * `poster` is `nyff.jpg`, a frame of this same hero, so nothing flashes before
 * the first frame decodes. No `small`: the cover is already the header, and a
 * third copy of it beside the video was the old page's worst moment. No
 * `quote`: the source ships no caption for this project, and the blockquote's
 * 100px spacer still renders for the stacked layouts.
 */
export const PROJECT_MEDIA_HERO: BlockMediaDoubleQuoteProps = {
  large: {
    type: "video",
    src: `${VIDEOS}/nyff-hero.mp4`,
    poster: `${IMAGES}/nyff.jpg`,
    width: 1200,
    height: 750,
  },
};

/**
 * Block 12 — `BlockProjectDetails`. `Stack` feeds the intro's second tab and
 * is dropped from this block by `projectDetailsWithoutStack`. Every entry is
 * from `package.json`; `Pages` is the booted copy's `/sitemap.xml`; the live
 * row takes the domain from `metadataBase`. No `Tests` row: none exist.
 */
export const PROJECT_DETAILS: ProjectDetail[] = [
  {
    label: "Stack",
    value: "TypeScript, Next.js 16, React 19, Tailwind CSS 4, Radix UI, Markdown, Vercel",
  },
  { label: "Pages", value: "26 in the sitemap" },
  { label: "Deployment", value: "Vercel · Formspree for every form" },
  { label: "Year", value: "2026" },
  { label: "Platform", value: "Web" },
  { label: PROJECT_LIVE.label, value: PROJECT_LIVE.display, href: PROJECT_LIVE.url },
];

/**
 * Block 13 — `GeneralCta`. Points at `/contact/`, never at the live site (the
 * live URL is a details row). The line names this reader's own problem: a
 * site with no page for the thing people search.
 */
export const PROJECT_CTA: GeneralCtaProps = {
  text: "Does your site have a page for what people search?",
  label: "Contact",
  href: "/contact/",
};
