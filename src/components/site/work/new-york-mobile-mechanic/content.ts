/**
 * Content for `/work/new-york-mobile-mechanic/`.
 *
 * Every string is verbatim from the `new-york-mobile-mechanic` entry of
 * `CASE_STUDIES` in the NeuraGul source's `pages/content.py`, cross-checked
 * against the built `work/new-york-mobile-mechanic/index.html`. Nothing is
 * paraphrased and nothing is invented.
 *
 * Assets, and why each one sits where it does:
 *   nymm.jpg        1200x750   the cover; header, then the second media pair
 *   mechanicseo.png  512x265   the borough matrix. Small, so it goes in the
 *                              `small` slot of `BlockMediaDoubleQuote`, which
 *                              measures 530px at `xl` — a 3.5% upscale. In the
 *                              `large` slot (733px) or full-bleed (1440px) it
 *                              would be blown up 1.4x to 2.8x.
 *   conversion.png  1179x2203  the only portrait asset on the whole site.
 *                              Deliberately never handed to `BlockImageFull`:
 *                              that block is full-bleed at `h-auto w-full`, so
 *                              a 1.87 portrait would render 2,690px tall at
 *                              1440. The `small` slot caps it at ~990px.
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
 * Ordering note: `BlockMediaDoubleQuote` appears twice and `BlockWysiwyg` four
 * times, so the exported constants are numbered by their position on the page.
 */
import type { BlockHeaderProjectsProps } from "@/components/site/shared/blocks/BlockHeaderProjects";
import type { BlockIntroDoubleProps } from "@/components/site/shared/blocks/BlockIntroDouble";
import type { BlockMediaDoubleQuoteProps } from "@/components/site/shared/blocks/BlockMediaDoubleQuote";
import type { BlockWysiwygProps } from "@/components/site/shared/blocks/BlockWysiwyg";
import type { ProjectDetail } from "@/components/site/shared/blocks/BlockProjectDetails";

const IMAGES = "/site/images";
const VIDEOS = "/site/videos";

/**
 * The live source title is "New York Mobile Mechanic — NeuraGul", i.e. the root
 * layout's `"%s — NeuraGul"` template applied to the project name.
 */
export const PROJECT_TITLE = "New York Mobile Mechanic";
export const PROJECT_CANONICAL = "/work/new-york-mobile-mechanic/";
/** The `brief`, which is what the source serves as this page's description. */
export const PROJECT_DESCRIPTION =
  "A 24/7 mobile mechanic competing for the most urgent searches in the city. Someone is stranded and typing with one thumb.";
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
  labels: ["The brief", "What I built"],
  activeLabel: 0,
  statement:
    "A 24/7 mobile mechanic competing for the most urgent searches in the city. Someone is stranded and typing with one thumb.",
  body: "A high-energy Next.js site with stat gauges that count up as you scroll, plain-language service breakdowns, live Google reviews, and a one-tap call-to-book. Local SEO built to rank across all five boroughs.",
};

/** Block 3 — `BlockWysiwyg` (first instance): the source's "Outcome" section. */
export const PROJECT_OUTCOME: BlockWysiwygProps = {
  title: "Outcome",
  body: [
    {
      type: "paragraph",
      text: "A conversion-focused site aimed squarely at same-day repair demand.",
    },
  ],
};

/**
 * Block 4 — `BlockMediaDoubleQuote` (first instance): the site itself, moving,
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
    alt: "The service-by-borough page matrix behind the local rankings.",
    width: 512,
    height: 265,
  },
  quote: "The service-by-borough page matrix behind the local rankings.",
};

/**
 * Blocks 5 and 6 — `BlockWysiwyg` (second and third instances): the first two
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
 * Block 7 — `BlockMediaDoubleQuote` (second instance): the pinned call-to-book
 * control, with its own caption as the quote.
 *
 * `conversion.png` takes the `small` slot for the reason set out at the top of
 * this file — it is the only portrait asset on the site, and 530px is the
 * widest slot that does not turn 2,203px of phone screen into a scroll of its
 * own. The `large` slot re-uses the cover: it is the only other still this
 * project has, and re-use across a page is how the original layout treats its
 * hero shots too.
 */
export const PROJECT_MEDIA_QUOTE_TWO: BlockMediaDoubleQuoteProps = {
  large: {
    type: "image",
    src: `${IMAGES}/nymm.jpg`,
    alt: "The New York Mobile Mechanic site.",
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

/** Block 8 — `BlockWysiwyg` (fourth instance): the third and last feature. */
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
 * Block 9 — `BlockProjectDetails`. The live row takes the source's own
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
