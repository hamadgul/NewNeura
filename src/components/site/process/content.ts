/**
 * Content for `/process/` — "How I work".
 *
 * Copy is lifted from the NeuraGul source site: the four-step `PROCESS` list in
 * `pages/content.py` (which is what the source's `#process` section renders),
 * plus that section's own `<h2>` label. The four step titles are the four words
 * the preloader unfolds — Talk / Scope / Build / Stay, see `PRELOADER_WORDS` in
 * `home/content.ts` — so this route is where that promise gets explained, and
 * the bodies below are verbatim rather than summarised.
 *
 * Block order:
 *   BlockHeaderGeneral → BlockIntroDouble → BlockWysiwyg → BlockImageSlider
 *   → BlockImageFull → GeneralCta
 *
 * ── Why the four steps are a wysiwyg and not the process card slider ────────
 * `BlockProcessCardSlider` is the obvious candidate — it is the site's dedicated
 * numbered-phase block and it carries the signature scroll pin. Two things rule
 * it out here:
 *
 *   1. Its card body is `line-clamp-3` (BlockProcessCardSlider.tsx:485) inside a
 *      353px card. Step 01 runs to 46 words and step 04 to 29; both would be
 *      truncated mid-sentence. The one page whose entire job is to state the
 *      four promises in full cannot be the page that cuts them off.
 *   2. `ProcessPhase.image` is required, and it is card artwork — a tall
 *      portrait frame behind a big ordinal. Every asset we have is a landscape
 *      product screenshot, so the four cards would end up with a picture of the
 *      Vintus storefront sitting behind "I scope it in writing". That is
 *      decoration standing in for content.
 *
 * `BlockWysiwyg`'s `lead` + `text` paragraph shape gives each step a bold
 * ordinal-and-title lead-in, a line break, and the body copy at full length,
 * with the block's own `p + p` 15px rhythm between them. It is the same shape
 * the service pages use for their deliverable lists. The rest of the page's
 * blocks are untouched around it.
 *
 * Image paths are the real screenshots under `/site/images` and `/site/videos`;
 * `width`/`height` are the assets' true pixel sizes, because `next/image` sets
 * the reserved aspect ratio from them.
 */
import type { BlockHeaderGeneralProps } from "@/components/site/shared/blocks/BlockHeaderGeneral";
import type { BlockImageFullImage } from "@/components/site/shared/blocks/BlockImageFull";
import type { BlockIntroDoubleProps } from "@/components/site/shared/blocks/BlockIntroDouble";
import type { BlockWysiwygProps } from "@/components/site/shared/blocks/BlockWysiwyg";
import type { GeneralCtaProps } from "@/components/site/shared/blocks/GeneralCta";
import type { SliderImage } from "@/components/site/shared/blocks/BlockImageSlider";

const IMG = "/site/images";
const VIDEO = "/site/videos";

export const META = {
  /** Plain stem: the root layout's "%s — NeuraGul" template adds the suffix. */
  title: "How I work",
  canonical: "/process/",
  description:
    "Four steps: you write and we talk, I scope it in writing, we build in the open, and I stay on after launch.",
} as const;

/* ── BlockHeaderGeneral ────────────────────────────────────────────────── */

/**
 * No `intro`.
 *
 * This is the block's second, documented variant: the wrapper renders empty,
 * which collapses grid row 2 to 0px and hands its slack to the highlight row
 * (measured `415px 0px 140px` against `/about/`'s `350.219px 64.781px 140px` —
 * the same 555px total). It is used here because the source has no separate
 * standfirst for this section, only the `<h2>` label and the list itself, and
 * inventing one would be a content change rather than a port.
 *
 * The caption is the four-beat shorthand the homepage's about block already
 * prints and the preloader already spells out; the notched image and the
 * right-hand column are real screenshots, cropped by the block (`object-cover`
 * on the full-bleed side, `h-auto` on the notched one, so a landscape frame just
 * renders shorter there).
 *
 * No `buttonHref`: the circle is a scroll affordance with no destination.
 */
export const PROCESS_HEADER: BlockHeaderGeneralProps = {
  title: "How I work",
  // The highlight box is ~193x120. A dense dashboard screenshot
  // (`delivery-routing-review.jpg`) is unreadable mush at that size; the
  // PackShip shot is two phone silhouettes on a dark ground and still reads as
  // something at 193px, which is all this slot is asked to do.
  highlightImage: {
    src: `${IMG}/packship.jpg`,
    alt: "",
    width: 1200,
    height: 750,
  },
  highlightCaption: "Talk. Scope. Build. Stay.",
  image: {
    src: `${VIDEO}/office-poster.jpg`,
    alt: "",
    width: 1920,
    height: 1080,
  },
};

/* ── BlockIntroDouble ──────────────────────────────────────────────────── */

/**
 * One static caption, not the tabbed variant — a single-entry `labels` array
 * keeps the block in its muted non-tabbed rendering.
 *
 * `statement` is the four step titles in order, which is the whole engagement in
 * one `.font-L` line; each of the four is then paid off at length in the
 * wysiwyg below. `body` is omitted, so the block collapses its second text row —
 * the same shape `/about/`'s intro ships. Restating the steps here in prose and
 * again in the list underneath would say the same thing twice.
 */
export const PROCESS_INTRO: BlockIntroDoubleProps = {
  labels: ["How this usually goes"],
  statement:
    "You write, we talk. I scope it in writing. We build in the open. I stay on after launch.",
};

/* ── BlockWysiwyg — the four steps ─────────────────────────────────────── */

/**
 * The four steps, verbatim from `PROCESS` in `content.py`, in source order.
 *
 * `lead` + `text` rather than `heading` + `paragraph`: the block gives a heading
 * a 20px *bottom* margin and no top margin, so four heading/paragraph pairs
 * would run together with the previous step's body. The lead-in shape emits
 * `<strong>` + `<br>` + body inside one `<p>`, which picks up the block's
 * `p + p { margin-top: 15px }` rule and separates the steps.
 *
 * The ordinals are the source's own: its `#process` section is an `<ol>`. They
 * are printed with the middot the site already uses as a meta separator
 * ("2026 · iOS") rather than a period, so the numeral does not read as the start
 * of a sentence.
 */
export const PROCESS_STEPS: BlockWysiwygProps = {
  title: "How this usually goes",
  body: [
    {
      type: "paragraph",
      lead: "01 · You write, we talk",
      text: "Half an hour on a call. You describe what's broken and how much it's costing you. I ask a lot of questions. If I don't think I can help, I'll tell you then and try to point you at someone who can.",
    },
    {
      type: "paragraph",
      lead: "02 · I scope it in writing",
      text: "You get a written scope, a fixed price, and a date. If I've misunderstood something, we find out here, while it's still only a document.",
    },
    {
      type: "paragraph",
      lead: "03 · We build in the open",
      text: "Working software lands in the first couple of weeks, then every week after that. You can redirect me while redirecting me is still cheap.",
    },
    {
      type: "paragraph",
      lead: "04 · I stay on after launch",
      text: "I hold the pager, fix what breaks, and hand over once your team wants it. Most of my clients have my mobile number.",
    },
  ],
};

/* ── BlockImageSlider ──────────────────────────────────────────────────── */

/**
 * The nine project covers, one slide each.
 *
 * The layout this block came from fed it 32 studio-life photographs. There is no
 * office-life library here, so the strip is the actual work instead — which is
 * the honest substitute, and it is what "we build in the open" is evidenced by.
 * No file is repeated to pad the track: nine slides is a shorter strip than 32
 * and that is fine, the block sizes its progress thumb off `images.length`.
 *
 * Every cover is 1200×750, the assets' real pixels. Slides are `h-auto w-full`,
 * so a landscape frame simply renders shorter than the 3:4 portraits the block
 * was measured against; nothing is cropped and no ratio is faked.
 *
 * `alt` carries the project name rather than the source convention's empty
 * string: these are not decorative here, they are the work.
 */
export const PROCESS_SLIDER_IMAGES: SliderImage[] = [
  {
    src: `${IMG}/delivery-routing.jpg`,
    alt: "Delivery routing platform",
    width: 1200,
    height: 750,
  },
  { src: `${IMG}/packship.jpg`, alt: "PackShip", width: 1200, height: 750 },
  { src: `${IMG}/foodtruckrentals.jpg`, alt: "Food Truck Rentals", width: 1200, height: 750 },
  { src: `${IMG}/nymm.jpg`, alt: "New York Mobile Mechanic", width: 1200, height: 750 },
  { src: `${IMG}/nyff.jpg`, alt: "New York Fine Foods", width: 1200, height: 750 },
  { src: `${IMG}/vintus.jpg`, alt: "Vintus", width: 1200, height: 750 },
  { src: `${IMG}/pizzeria.jpg`, alt: "Restaurant ordering portal", width: 1200, height: 750 },
  { src: `${IMG}/rwd-pipeline.jpg`, alt: "Real-World Data Pipeline", width: 1200, height: 750 },
  {
    src: `${IMG}/landscapedrainage.jpg`,
    alt: "Landscape Drainage Proz",
    width: 1200,
    height: 750,
  },
];

/* ── BlockImageFull ────────────────────────────────────────────────────── */

/**
 * The block has no `height` prop: the image's own ratio drives the band at every
 * breakpoint. 1600×1000 gives 0.625, i.e. 900px at a 1440 viewport, which is
 * enough to actually read the solved routes rather than glance at them — the
 * point of the slide it follows.
 */
export const PROCESS_FULL_IMAGE: BlockImageFullImage = {
  src: `${IMG}/delivery-routing-routes.jpg`,
  alt: "Six drivers' solved routes on the dispatch map",
  width: 1600,
  height: 1000,
};

/* ── GeneralCta ────────────────────────────────────────────────────────── */

/**
 * Declared here, not imported from a shared preset.
 *
 * `shared/blocks/content-presets.ts` is gone, and the constant must not move
 * into `GeneralCta.tsx` either: that block is a `"use client"` module, so a
 * plain value imported from it into a server component arrives as a
 * client-reference proxy and spreads to undefined props — an empty
 * `<p class="font-L">` and an href-less arrow button, with no type or build
 * error to catch it. This file has no `"use client"`, so the value stays real in
 * the server graph.
 *
 * The old target was `/careers/`. There is no careers page and there must not be
 * one, so the CTA points at `/contact/` and the copy is the source's own
 * `contact_lead`.
 */
export const PROCESS_GENERAL_CTA: GeneralCtaProps = {
  text: "Tell me what's broken.",
  label: "Contact",
  href: "/contact/",
};
