/**
 * Content for `/work/vintus/`.
 *
 * Every string is verbatim from the `vintus` entry of `CASE_STUDIES` in the
 * NeuraGul source's `pages/content.py`, cross-checked against the built
 * `work/vintus/index.html`, which prints the same copy under "The brief",
 * "What I built" and "Outcome". Nothing is paraphrased and nothing is invented.
 *
 * Image sizing note: `width`/`height` are the file's true decoded pixels
 * (1200x750), because `next/image` reserves the aspect ratio from them and the
 * header sizes its crop from that ratio rather than from a fixed height.
 *
 * Block-count note: this project has exactly one image and the header already
 * paints it full-bleed, so the page runs four blocks rather than the eleven the
 * inherited template was built for — that sequence existed to carry eighteen
 * architecture photographs. There is deliberately no media block: every one of
 * them needs either a second asset (`BlockMediaDouble`, `BlockMediaDoubleQuote`)
 * or a picture the header has not already shown (`BlockImageFull`), and
 * re-rendering `vintus.jpg` through one would be padding rather than evidence.
 * No constant needs numbering, because no block appears twice.
 */
import type { BlockHeaderProjectsProps } from "@/components/site/shared/blocks/BlockHeaderProjects";
import type { BlockIntroDoubleProps } from "@/components/site/shared/blocks/BlockIntroDouble";
import type { BlockWysiwygProps } from "@/components/site/shared/blocks/BlockWysiwyg";
import type { ProjectDetail } from "@/components/site/shared/blocks/BlockProjectDetails";

const IMAGES = "/site/images";

/**
 * The live source title is "Vintus — NeuraGul", which is the root layout's
 * `"%s — NeuraGul"` template applied to the project name, so the route sets the
 * bare name.
 */
export const PROJECT_TITLE = "Vintus";
export const PROJECT_CANONICAL = "/work/vintus/";
/** The `brief`, which is what the source serves as this page's description. */
export const PROJECT_DESCRIPTION =
  "A leading wine importer needed e-commerce that could carry a large, structured catalog and the operations sitting behind it.";
export const PROJECT_OG_IMAGE = `${IMAGES}/vintus.jpg`;

/**
 * `live_url` / `live_label` from the source entry, kept exact.
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
 * Header. `lead` is the project's OUTCOME, not its brief: the brief is the
 * `BlockIntroDouble` statement two blocks down, and printing it in both slots
 * repeated the same sentence inside two screens on every case study.
 */
export const PROJECT_HEADER: BlockHeaderProjectsProps = {
  title: "Vintus",
  lead: "A production storefront running a national wine import catalog.",
  location: "2026 · E-commerce",
  service: "Cloud & Infrastructure · Web Development",
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
 * The source page runs three headed sections: "The brief", "What I built" and
 * "Outcome". The first two map onto this block exactly — the active label sits
 * over the `font-L` statement (the brief) and the muted one over the body copy
 * (what I built) — and the third gets its own `BlockWysiwyg` below.
 */
export const PROJECT_INTRO: BlockIntroDoubleProps = {
  labels: ["The brief", "What I built"],
  activeLabel: 0,
  statement:
    "A leading wine importer needed e-commerce that could carry a large, structured catalog and the operations sitting behind it.",
  body: "An e-commerce platform with inventory management, order processing, and customer-relationship tooling. WordPress and PHP on the surface, Python services doing the work underneath.",
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
      text: "A production storefront running a national wine import catalog.",
    },
  ],
};

/**
 * Block 4 — `BlockProjectDetails`. The real facts only: the `stack` list as the
 * source records it, the year and platform split out of the `meta` string, and
 * the live link. The block auto-places pairs, so the four rows read
 * (Stack | Year) then (Platform | live link).
 */
export const PROJECT_DETAILS: ProjectDetail[] = [
  { label: "Stack", value: "WordPress, PHP, Python" },
  { label: "Year", value: "2026" },
  { label: "Platform", value: "E-commerce" },
  { label: PROJECT_LIVE.label, value: PROJECT_LIVE.display, href: PROJECT_LIVE.url },
];
