/**
 * Content for `/work/new-york-mobile-mechanic/`.
 *
 * Provenance for every string here is recorded in
 * `docs/research/case-studies/new-york-mobile-mechanic.md`.
 *
 * ── Asset refresh, 2026-09-07 ───────────────────────────────────────────────
 * The client rebuilt the site's homepage hero, so `nymm.jpg` and
 * `nymm-hero.mp4` were both re-captured from the live site. What changed on
 * their end, and therefore what the old assets were still showing: the
 * wordmark ("ADAM'S" -> "ADAM"), the hero photograph (a dark SUV -> a red BMW
 * at dusk), the nav ("Contact" -> "Resources", and a reordering), the
 * sub-headline ("Skip the tow truck and save time." -> "Don't waste time at a
 * shop, we come to you."), the button case, and the review gauge (142+ ->
 * 158+).
 *
 * The VIDEO was the easy one to miss: it is a screen capture of this same
 * hero, so it was showing the previous branding for 12 seconds next to a cover
 * showing the new one. When a client changes a page, every asset OF that page
 * is stale, not just the still.
 *
 * Recipe, so a future refresh matches rather than drifts:
 *   cover  1200x750 viewport at deviceScaleFactor 2, downsampled to 1200x750.
 *          Not 1600 — the headline measures 480/1200 of the frame in the asset
 *          this replaced, which is a 1200-wide capture, and a wider one shrinks
 *          the type against every other still on the page.
 *   video  Playwright `recordVideo` at 1200x750, reloaded so the gauges count
 *          up on camera, held ~4s, eased scroll down over 3s, held, eased back.
 *          Transcoded `fps=24, crf 30` to land at 12.75s / 995KB against the
 *          previous 12.67s / 1026KB.
 *
 * `conversion.png` was checked and NOT re-captured: it already carries the new
 * "ADAM" wordmark, so it post-dates the rebrand. `mechanicseo.png` is the
 * borough matrix, not the homepage.
 *
 * Assets, and why each one sits where it does:
 *   nymm.jpg        1200x750   the cover; header, then the second media pair
 *   mechanicseo.png  512x265   the Lighthouse report — 100 for performance,
 *                              accessibility, best practices and SEO, plus 3/3
 *                              agentic browsing. NOT the borough matrix, which
 *                              is what the filename and this line used to claim
 *                              and what its caption described until 2026-09-10.
 *                              Small, so it goes in the
 *                              `small` slot of `BlockMediaDoubleQuote`, which
 *                              measures 530px at `xl` — a 3.5% upscale. In the
 *                              `large` slot (733px) or full-bleed (1440px) it
 *                              would be blown up 1.4x to 2.8x.
 *   conversion.png  1179x2203  the only portrait asset on the whole site.
 *                              Deliberately never handed to `BlockImageFull`:
 *                              that block is full-bleed at `h-auto w-full`, so
 *                              a 1.87 portrait would render 2,690px tall at
 *                              1440. The `small` slot caps it at ~990px.
 *   nymm-hero-loop.mp4
 *                   1200x750   a 3s loop of the hero alone, gauges counting.
 *                              Replaced the still in the SECOND media pair on
 *                              2026-09-10; it is the evidence for the "numbers
 *                              that move" feature, which a JPEG cannot carry.
 *   nymm-hero.mp4   1200x750   the project's own site capture. Fed to
 *                              `BlockMediaDoubleQuote`'s `type: "video"` arm,
 *                              which is the one media slot on this layout that
 *                              takes moving footage; `nymm.jpg` is its poster,
 *                              being a still of the same site.
 *
 * Alt text note: the source's two feature captions become the `alt` of the
 * images they were written for. The architecture layout this shell came from
 * shipped `alt=""` because its media were decorative photographs; these are
 * informative screenshots, so the caption is the description.
 *
 * `mechanicseo.png` is the one place where the `alt` and the `quote` are NOT
 * the same string, and deliberately. Both used to read "The service-by-borough
 * page matrix behind the local rankings", which describes an asset this page
 * does not contain — the picture is a Lighthouse report. Reworded to the
 * scores at the user's direction ("reword the caption to match the lighthouse
 * scores") rather than by re-shooting the matrix. The pull-quote is set large
 * and wants one clean line, while the `alt` has to describe everything in the
 * frame, so the two now carry different lengths of the same fact.
 *
 * The borough matrix itself is not lost: `PROJECT_FEATURE_ONE` still states it
 * in copy ("A landing-page matrix of service crossed with borough"). It simply
 * no longer claims a screenshot is showing it.
 *
 * Ordering note: `BlockMediaDoubleQuote` appears twice and `BlockWysiwyg`
 * three times, so the exported constants are numbered by their position on
 * the page. `BlockWysiwyg` no longer carries a fourth, "Outcome" instance:
 * its text was character-identical to `PROJECT_HEADER.lead`, so it was
 * deleted rather than printed twice.
 *
 * VOICE — the source site is written in the first person singular, because it
 * was one person. It is a team, so this site says "we". "What we built" was
 * the label on the second intro section before `projectIntroTabs` shipped;
 * that helper now overwrites both tab labels to "The brief" / "The tech
 * stack", so "What we built" no longer renders anywhere on this page. Every
 * metric, stack entry and live URL below is exactly as the source records it.
 *
 * ── What the SEO pass changed ───────────────────────────────────────────────
 * `PROJECT_TITLE` and `PROJECT_DESCRIPTION` are no longer the source's
 * strings. Both are metadata only — the `<title>` stem and the meta
 * description — and both were rewritten to compete in a result list rather
 * than to open a page; see the notes on each. Some `alt` strings were also
 * lengthened from a bare project name to a description of the screenshot.
 */
import type { BlockHeaderProjectsProps } from "@/components/site/shared/blocks/BlockHeaderProjects";
import type { BlockIntroDoubleProps } from "@/components/site/shared/blocks/BlockIntroDouble";
import type { BlockMediaDoubleQuoteProps } from "@/components/site/shared/blocks/BlockMediaDoubleQuote";
import type { BlockWysiwygProps } from "@/components/site/shared/blocks/BlockWysiwyg";
import type { ProjectDetail } from "@/components/site/shared/blocks/BlockProjectDetails";

const IMAGES = "/site/images";
const VIDEOS = "/site/videos";

/**
 * The `<title>` stem, suffixed by the root layout's `"%s — NeuraGul"` template.
 *
 * This is NOT the project's display name — `PROJECT_HEADER.title` is, and it
 * still reads "New York Mobile Mechanic" on the page and in the breadcrumb. The two diverge on
 * purpose: an `<h1>` sits under a header that has already established what the
 * page is, while a `<title>` is read cold in a result list, so it has to name
 * the category of work as well as the client. `PROJECT_TITLE` is referenced
 * only by `metadata` in the route file, so nothing visible moves with it.
 */
export const PROJECT_TITLE = "New York Mobile Mechanic: Local SEO Build";
export const PROJECT_CANONICAL = "/work/new-york-mobile-mechanic/";
/**
 * The meta description. It was the project's `brief` verbatim, which reads as
 * the opening of a story rather than as a search result: the brief sets a scene
 * and names no technology, so the snippet said nothing a searcher could match.
 * This states what was built and what it was built with, in ~150 characters.
 * The brief itself is untouched and still opens the page.
 */
export const PROJECT_DESCRIPTION =
  "A local SEO site for a 24/7 NYC mobile mechanic: a landing page for every service crossed with every borough, schema on every route, Core Web Vitals green.";
export const PROJECT_OG_IMAGE = `${IMAGES}/nymm.jpg`;

/**
 * Header. `lead` is the project's OUTCOME, not its brief: the brief is the
 * `BlockIntroDouble` statement two blocks down, and printing it in both slots
 * repeated the same sentence inside two screens on every case study.
 */
export const PROJECT_HEADER: BlockHeaderProjectsProps = {
  title: "New York Mobile Mechanic",
  lead: "A conversion-focused site aimed squarely at same-day repair demand.",
  location: "2026 · Web",
  service: "Web Development",
  breadcrumbLabel: "Work",
  breadcrumbHref: "/work/",
  backLabel: "All work",
  image: {
    src: `${IMAGES}/nymm.jpg`,
    alt: "",
    width: 1200,
    height: 750,
  },
};

/**
 * Block 2 — `BlockIntroDouble`, the two-label variant. The source's first two
 * headed sections map onto the block's own two halves: the active label over
 * the `font-L` statement, the muted one over the body copy.
 */
export const PROJECT_INTRO: BlockIntroDoubleProps = {
  labels: ["The brief", "What we built"],
  activeLabel: 0,
  statement:
    "A 24/7 mobile mechanic competing for the most urgent searches in the city. Someone is stranded and typing with one thumb.",
  body: "A high-energy Next.js site with stat gauges that count up as you scroll, plain-language service breakdowns, live Google reviews, and a one-tap call-to-book. Local SEO built to rank across all five boroughs.",
};

/**
 * Block 3 — `BlockMediaDoubleQuote` (first instance): the site itself, moving,
 * beside the borough matrix.
 *
 * The video takes the `large` slot; the block renders it with an explicit
 * aspect-ratio box and no wipe, which is the source's own treatment of a
 * `<video>` here. At `xl` the blockquote sits directly under the `small` media,
 * so the quote is the matrix screenshot's own caption.
 */
export const PROJECT_MEDIA_QUOTE_ONE: BlockMediaDoubleQuoteProps = {
  large: {
    type: "video",
    src: `${VIDEOS}/nymm-hero.mp4`,
    poster: `${IMAGES}/nymm.jpg`,
    width: 1200,
    height: 750,
  },
  small: {
    type: "image",
    src: `${IMAGES}/mechanicseo.png`,
    alt: "A Lighthouse report for the site scoring 100 for performance, accessibility, best practices and SEO, and 3/3 for agentic browsing.",
    width: 512,
    height: 265,
  },
  quote: "Lighthouse at 100 for performance, accessibility, best practices and SEO.",
};

/**
 * Blocks 4 and 5 — `BlockWysiwyg` (first and second instances): the first two
 * `features`, in source order.
 *
 * Each feature is a label, a title and a paragraph, which is exactly the
 * block's tagline / title / body shape. The source's single "How it works"
 * heading above the run is section chrome with no slot here, and is dropped
 * rather than repeated as a tagline the labels already earn.
 */
export const PROJECT_FEATURE_ONE: BlockWysiwygProps = {
  tagline: "Local SEO",
  title: "Built to rank.",
  body: [
    {
      type: "paragraph",
      text: "A landing-page matrix of service crossed with borough, schema markup on every route, and Core Web Vitals in the green. When your car dies on the BQE you call whoever ranks. Nobody comparison-shops from the shoulder.",
    },
  ],
};

export const PROJECT_FEATURE_TWO: BlockWysiwygProps = {
  tagline: "Framer Motion",
  title: "Numbers that move.",
  body: [
    {
      type: "paragraph",
      text: "Stat gauges count up as they scroll into view: jobs completed, average response time, star rating. Energy that earns trust without crowding out the one thing the page wants you to do.",
    },
  ],
};

/**
 * Block 6 — `BlockMediaDoubleQuote` (second instance): the pinned call-to-book
 * control, with its own caption as the quote.
 *
 * `conversion.png` takes the `small` slot for the reason set out at the top of
 * this file — it is the only portrait asset on the site, and 530px is the
 * widest slot that does not turn 2,203px of phone screen into a scroll of its
 * own. The `large` slot used to re-use the cover still; it now carries
 * `nymm-hero-loop.mp4` instead. See the note on the slot below.
 */
export const PROJECT_MEDIA_QUOTE_TWO: BlockMediaDoubleQuoteProps = {
  /*
    A 3-second loop of the hero, not the still it used to be. The point of the
    slot is `PROJECT_FEATURE_TWO` two blocks up — "Stat gauges count up as they
    scroll into view" — and a JPEG cannot show a count-up; it shows the number
    the count ARRIVES at, which is the one frame that proves nothing.

    Locked on the hero, no scroll. `nymm-hero.mp4` in the first media pair
    already pans down the page; this one holds the exact framing the still had,
    which is what was asked for: "keep the whole homepage hero in view (as it
    is currently but just make it a video)".

    1200x750, the still's own pixel size, so the block's `aspectRatio` box does
    not move. `poster` stays `nymm.jpg` — a frame of this same hero, so there is
    no flash of a different image before the first frame decodes. The block
    defaults `autoPlay`/`loop`/`muted` to true and adds `playsInline`, so none
    of those are restated here.

    Cut against the live count: the gauges move from first paint to settled in
    ~1.5s, and the clip holds the settled numbers for the remaining ~1.5s so
    they are readable before the loop restarts. 314KB at crf 25.
  */
  large: {
    type: "video",
    src: `${VIDEOS}/nymm-hero-loop.mp4`,
    poster: `${IMAGES}/nymm.jpg`,
    width: 1200,
    height: 750,
  },
  small: {
    type: "image",
    src: `${IMAGES}/conversion.png`,
    alt: "The call-to-book control, pinned so it follows the scroll.",
    width: 1179,
    height: 2203,
  },
  quote: "The call-to-book control, pinned so it follows the scroll.",
};

/** Block 7 — `BlockWysiwyg` (third instance): the third and last feature. */
export const PROJECT_FEATURE_THREE: BlockWysiwygProps = {
  tagline: "Conversion",
  title: "Panic into a phone call.",
  body: [
    {
      type: "paragraph",
      text: "Live Google reviews for immediate credibility, and a one-tap call-to-book that follows you down the page. The site has exactly one exit and it is the phone.",
    },
  ],
};

/**
 * Block 8 — `BlockProjectDetails`. The live row takes the source's own
 * `live_label` as its label; the block renders values as text, so the address
 * is written the way it would be read rather than as an unclickable full URL.
 */
export const PROJECT_DETAILS: ProjectDetail[] = [
  { label: "Stack", value: "TypeScript, Next.js, Tailwind CSS, Framer Motion" },
  { label: "Year", value: "2026" },
  { label: "Platform", value: "Web" },
  {
    label: "Live site",
    value: "newyorkmobilemechanic.com",
    href: "https://www.newyorkmobilemechanic.com",
  },
];
