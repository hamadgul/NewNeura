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
 *
 * VOICE — the source site is written in the first person singular, because it
 * was one person. It is a team, so this site says "we", which on this page is
 * the second section's heading: "What we built". Every metric, stack entry,
 * outcome and live URL below is exactly as the source records it.
 *
 * ── What the SEO pass changed ───────────────────────────────────────────────
 * `PROJECT_TITLE` and `PROJECT_DESCRIPTION` are no longer the source's
 * strings. Both are metadata only — the `<title>` stem and the meta
 * description — and both were rewritten to compete in a result list rather
 * than to open a page; see the notes on each. Some `alt` strings were also
 * lengthened from a bare project name to a description of the screenshot.
 *
 * Everything a visitor reads is still the source's own: the header, the brief,
 * what we built, the outcome, every metric, stack entry and live URL.
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
 * still reads "New York Fine Foods" on the page and in the breadcrumb. The two diverge on
 * purpose: an `<h1>` sits under a header that has already established what the
 * page is, while a `<title>` is read cold in a result list, so it has to name
 * the category of work as well as the client. `PROJECT_TITLE` is referenced
 * only by `metadata` in the route file, so nothing visible moves with it.
 */
export const PROJECT_TITLE = "New York Fine Foods: a Catering Site";
export const PROJECT_CANONICAL = "/work/new-york-fine-foods/";
/**
 * The meta description. It was the project's `brief` verbatim, which reads as
 * the opening of a story rather than as a search result: the brief sets a scene
 * and names no technology, so the snippet said nothing a searcher could match.
 * This states what was built and what it was built with, in ~150 characters.
 * The brief itself is untouched and still opens the page.
 */
export const PROJECT_DESCRIPTION =
  "A cinematic Next.js site for a NYC catering, pizza-truck and mobile-bar brand, with media galleries, service menus and a booking inquiry flow.";
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
 * "Outcome". The middle one is rewritten to "What we built" for this site's
 * voice. The first two map onto this block exactly — the active label sits over
 * the `font-L` statement (the brief) and the muted one over the body copy (what
 * was built) — and the third gets its own `BlockWysiwyg` further down.
 */
export const PROJECT_INTRO: BlockIntroDoubleProps = {
  labels: ["The brief", "What we built"],
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
