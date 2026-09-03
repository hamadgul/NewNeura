/**
 * Content for `/work/new-york-fine-foods/`.
 *
 * Every string is verbatim from the `new-york-fine-foods` entry of
 * `CASE_STUDIES` in the NeuraGul source's `pages/content.py`, cross-checked
 * against the built `work/new-york-fine-foods/index.html`, which prints the
 * same copy under "The brief", "What I built" and "Outcome". Nothing is
 * paraphrased and nothing is invented.
 *
 * Image sizing note: `width`/`height` are the assets' true decoded pixels
 * (1200x750 for the cover, and the same for the video's stream, per `ffprobe`),
 * because `next/image` reserves the aspect ratio from them and the video
 * frame's `aspect-ratio` is computed from them too.
 *
 * Block-count note: this project owns one still and one motion capture, so the
 * page runs five blocks, not the eleven the inherited template was built for —
 * that sequence existed to carry eighteen architecture photographs. The one
 * repeat is `nyff.jpg`: it is the header's full-bleed backdrop, the video's
 * poster, and the media block's small slot. That is not padding but arithmetic
 * — `BlockMediaDoubleQuote` requires two slots and the video is the only other
 * asset — and the three renderings are visually distinct (130vh under a 44%
 * black scrim with the `<h1>` over it; a poster visible until the first frame
 * decodes; a small unfiltered figure). No constant needs numbering, because no
 * block appears twice.
 */
import type { BlockHeaderProjectsProps } from "@/components/site/shared/blocks/BlockHeaderProjects";
import type { BlockIntroDoubleProps } from "@/components/site/shared/blocks/BlockIntroDouble";
import type { BlockMediaDoubleQuoteProps } from "@/components/site/shared/blocks/BlockMediaDoubleQuote";
import type { BlockWysiwygProps } from "@/components/site/shared/blocks/BlockWysiwyg";
import type { ProjectDetail } from "@/components/site/shared/blocks/BlockProjectDetails";

const IMAGES = "/site/images";
const VIDEOS = "/site/videos";

/**
 * The live source title is "New York Fine Foods — NeuraGul", which is the root
 * layout's `"%s — NeuraGul"` template applied to the project name, so the route
 * sets the bare name.
 */
export const PROJECT_TITLE = "New York Fine Foods";
export const PROJECT_CANONICAL = "/work/new-york-fine-foods/";
/** The `brief`, which is what the source serves as this page's description. */
export const PROJECT_DESCRIPTION =
  "A NYC catering, pizza-truck, and mobile-bar brand books events on how memorable they look. The website had to do the same job.";
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
 * `BlockIntroDouble` statement two blocks down, and printing it in both slots
 * repeated the same sentence inside two screens on every case study.
 */
export const PROJECT_HEADER: BlockHeaderProjectsProps = {
  title: "New York Fine Foods",
  lead: "A live brand site that turns browsing into event inquiries.",
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
 * Block 2 — `BlockIntroDouble`, the two-label variant.
 *
 * The source page runs three headed sections: "The brief", "What I built" and
 * "Outcome". The first two map onto this block exactly — the active label sits
 * over the `font-L` statement (the brief) and the muted one over the body copy
 * (what I built) — and the third gets its own `BlockWysiwyg` further down.
 */
export const PROJECT_INTRO: BlockIntroDoubleProps = {
  labels: ["The brief", "What I built"],
  activeLabel: 0,
  statement:
    "A NYC catering, pizza-truck, and mobile-bar brand books events on how memorable they look. The website had to do the same job.",
  body: "A cinematic Next.js site with full-bleed motion, media galleries, service menus, and a booking inquiry flow that catches people while the impression is still fresh.",
};

/**
 * Block 3 — `BlockWysiwyg`, carrying the source's third headed section.
 *
 * `title` only, no `tagline`: the narrow left column becomes the "Outcome"
 * heading and the wide right column the copy, which is the block's own
 * two-column shape. A tagline would add a second, duplicate label above it.
 */
export const PROJECT_OUTCOME: BlockWysiwygProps = {
  title: "Outcome",
  body: [
    {
      type: "paragraph",
      text: "A live brand site that turns browsing into event inquiries.",
    },
  ],
};

/**
 * Block 4 — `BlockMediaDoubleQuote`, the `type: "video"` arm.
 *
 * The copy above claims full-bleed motion; this is the block that shows it
 * rather than asserting it, which is the whole reason the project's own capture
 * exists. `1200x750` is the real stream size (`ffprobe` on `nyff-hero.mp4`),
 * and the block turns it into the frame's `aspect-ratio` so the grid rows are
 * stable before metadata loads.
 *
 * No `quote`: at `xl` the blockquote sits under the small media and would carry
 * that image's caption, and the source ships no caption or testimonial for this
 * project. The element still renders — its 100px bottom margin is load-bearing
 * for the stacked layouts — it is simply empty.
 */
export const PROJECT_MEDIA_QUOTE: BlockMediaDoubleQuoteProps = {
  large: {
    type: "video",
    src: `${VIDEOS}/nyff-hero.mp4`,
    poster: `${IMAGES}/nyff.jpg`,
    width: 1200,
    height: 750,
  },
  // No `small`. This project owns one still and one video, and the still is
  // already the header band *and* the video's poster — a third copy of it, sat
  // right beside the second, was the page's worst moment. The block renders the
  // video alone now.
};

/**
 * Block 5 — `BlockProjectDetails`. The real facts only: the `stack` list as the
 * source records it, the year and platform split out of the `meta` string, and
 * the live link. The block auto-places pairs, so the four rows read
 * (Stack | Year) then (Platform | live link).
 */
export const PROJECT_DETAILS: ProjectDetail[] = [
  { label: "Stack", value: "TypeScript, Next.js, JavaScript" },
  { label: "Year", value: "2026" },
  { label: "Platform", value: "Web" },
  { label: PROJECT_LIVE.label, value: PROJECT_LIVE.display, href: PROJECT_LIVE.url },
];
