/**
 * Content for `/about/`.
 *
 * Copy is lifted from the NeuraGul source site — the `about_lead` / `about_1..4`
 * keys of the HOME dict in `pages/content.py`, which is what the source's
 * `#about` section renders — rather than rewritten, so the voice rules that file
 * enforces still hold: first person, no "X, not Y" antithesis, at most three em
 * dashes, a checkable number wherever one exists.
 *
 * The five paragraphs are split across three blocks rather than dumped into one:
 * the header carries the one-line introduction, `BlockIntroDouble` carries the
 * lead plus the Freenome paragraph, and `BlockWysiwyg` carries the remaining
 * three. That is the same distribution the source uses (`ng-lead`, then a
 * three-paragraph `ng-prose`, then a closing `ng-margin` line), only mapped onto
 * this layout's blocks.
 *
 * Image paths are the real screenshots under `/site/images` and `/site/videos`;
 * `width`/`height` are the assets' true pixel sizes, because `next/image` sets
 * the reserved aspect ratio from them. Every asset here is landscape; the header
 * and the media block both crop with `object-cover`, so the shape holds.
 *
 * ── What is deliberately absent ─────────────────────────────────────────────
 * The team grid. The layout this page is adapted from closed with a 38-face
 * `CollectionTeam`; NeuraGul is one person, so that block is gone from the route
 * and from the repo, and nothing has been put in its place. The honest
 * compensation is the fuller `BlockWysiwyg` body below, not a one-card grid.
 */
import type { BlockHeaderGeneralProps } from "@/components/site/shared/blocks/BlockHeaderGeneral";
import type { BlockIntroDoubleProps } from "@/components/site/shared/blocks/BlockIntroDouble";
import type { BlockMediaDoubleQuoteProps } from "@/components/site/shared/blocks/BlockMediaDoubleQuote";
import type { BlockWysiwygProps } from "@/components/site/shared/blocks/BlockWysiwyg";

const IMG = "/site/images";
const VIDEO = "/site/videos";

export const META = {
  /** Plain stem: the root layout's "%s — NeuraGul" template adds the suffix. */
  title: "About",
  canonical: "/about/",
  description:
    "NeuraGul is Hamad Gul, working out of New York, plus the people he brings in when a project needs more hands.",
} as const;

/**
 * Header.
 *
 * `intro` is the source's own second lede line, minus its "That's the job."
 * lead-in — the sentence that names who is behind the site, which is exactly
 * what this row is for.
 *
 * The right column is `hero-poster.jpg`, the generic still: it is cropped with
 * `object-cover` into a ~715×600 box at 1280+, so a 16:9 frame loses its sides
 * and reads as a backdrop rather than as a claim about a specific room. The
 * notched highlight is a real project screenshot and its caption is the label
 * the source prints over this section.
 *
 * No `buttonHref`: the circle is a scroll affordance with no destination, the
 * same as every other instance of this block.
 */
export const ABOUT_HEADER: BlockHeaderGeneralProps = {
  title: "About",
  intro: "I'm Hamad Gul, I work out of New York, and I keep a handful of projects going at a time.",
  highlightImage: {
    src: `${IMG}/packship.jpg`,
    alt: "",
    width: 1200,
    height: 750,
  },
  highlightCaption: "Who you'd be working with",
  image: {
    src: `${IMG}/hero-poster.jpg`,
    alt: "",
    width: 1920,
    height: 1080,
  },
};

/**
 * Intro. One static caption, not the tabbed variant — hence a single-entry
 * `labels` array, which keeps the block in its muted non-tabbed rendering.
 *
 * `statement` is `about_lead` verbatim; `body` is `about_1` verbatim. One string
 * in the array, so the block renders a single paragraph rather than splitting a
 * run at a sentence boundary the source does not break at.
 */
export const ABOUT_INTRO: BlockIntroDoubleProps = {
  labels: ["Who you'd be working with"],
  statement: "NeuraGul is me, plus the people I bring in.",
  body: [
    "Before this I was a product manager at Freenome, building a 0-to-1 ETL pipeline that pulled messy real-world clinical data from dozens of sources into a single common model. Early cancer detection research ran on top of it.",
  ],
};

/**
 * Media pair. This is the site's one instance whose large slot is a `<video>`,
 * so it takes the `type: "video"` arm of the media union. 1920×1080 is
 * `office.mp4`'s real stream size, which is what holds the grid rows stable
 * before metadata loads.
 *
 * The footage is deliberately generic loft-office material: it sets the register
 * without claiming to be a particular room, which is the honest choice for a
 * one-person practice with no street office. The small slot is the real-world
 * data pipeline screenshot, which is the project the paragraph directly above it
 * describes.
 *
 * `quote` is a sentence from `about_3`, hoisted into the pull-quote column. It
 * is the site's own first-person copy, not a testimonial — nobody is being
 * quoted who did not write it.
 */
export const ABOUT_MEDIA: BlockMediaDoubleQuoteProps = {
  large: {
    type: "video",
    src: `${VIDEO}/office.mp4`,
    poster: `${VIDEO}/office-poster.jpg`,
    width: 1920,
    height: 1080,
  },
  small: {
    type: "image",
    src: `${IMG}/rwd-pipeline.jpg`,
    alt: "",
    width: 1200,
    height: 750,
  },
  quote: "I stay small on purpose, which is how I'm still the one who picks up the phone.",
};

/**
 * Rich-text body — `about_2`, `about_3` and `about_4`, verbatim and in source
 * order.
 *
 * The bare shape (no `tagline`, no `title`) is the one this block ships on an
 * about page: an empty first grid row, then a single wide text column. Three
 * `paragraph` nodes rather than one long string, so the block's `p + p`
 * 15px rhythm reproduces the source's paragraph breaks.
 *
 * This is also where the deleted team grid's weight went. The source's `#about`
 * runs to five paragraphs; the header and the intro take two, and the remaining
 * three land here, which is what keeps the route from ending on a stub.
 */
export const ABOUT_WYSIWYG: BlockWysiwygProps = {
  body: [
    {
      type: "paragraph",
      text: "These days I mostly build operational software. The dispatch app that plans those six vans. An ordering portal that lets a pizzeria skip delivery-app commissions. A wine importer's storefront. I also build the marketing sites that sell that kind of work, because most of my clients need both.",
    },
    {
      type: "paragraph",
      text: "When a project needs more hands I bring in people I've worked with before: a designer, a second engineer, someone who knows a stack better than me. You'll always know who is on it. I stay small on purpose, which is how I'm still the one who picks up the phone.",
    },
    {
      type: "paragraph",
      text: "I'm a good fit when you want one person who holds the whole system in their head and is still reachable six months after launch. I'm the wrong fit if you need a team of eight starting Monday.",
    },
  ],
};
