/**
 * Content for `/work/restaurant-ordering-portal/`.
 *
 * Every string is verbatim from the `restaurant-ordering-portal` entry of
 * `CASE_STUDIES` in the NeuraGul source's `pages/content.py`, cross-checked
 * against the built `work/restaurant-ordering-portal/index.html`, which prints
 * the same copy under "The brief", "What I built" and "Outcome". Nothing is
 * paraphrased and nothing is invented.
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
 * re-rendering `pizzeria.jpg` through one would be padding rather than evidence.
 * No constant needs numbering, because no block appears twice.
 *
 * VOICE — the source site is written in the first person singular, because it
 * was one person. It is a team, so this site says "we", which on this page is
 * the second section's heading: "What we built". Every metric, stack entry,
 * outcome and live URL below is exactly as the source records it.
 */
import type { BlockHeaderProjectsProps } from "@/components/site/shared/blocks/BlockHeaderProjects";
import type { BlockIntroDoubleProps } from "@/components/site/shared/blocks/BlockIntroDouble";
import type { BlockWysiwygProps } from "@/components/site/shared/blocks/BlockWysiwyg";
import type { ProjectDetail } from "@/components/site/shared/blocks/BlockProjectDetails";

const IMAGES = "/site/images";

/**
 * The live source title is "Restaurant ordering portal — NeuraGul", which is
 * the root layout's `"%s — NeuraGul"` template applied to the project name, so
 * the route sets the bare name.
 */
export const PROJECT_TITLE = "Restaurant ordering portal";
export const PROJECT_CANONICAL = "/work/restaurant-ordering-portal/";
/** The `brief`, which is what the source serves as this page's description. */
export const PROJECT_DESCRIPTION =
  "Third-party delivery apps take a punishing cut of every restaurant order. This one removes the middleman.";
export const PROJECT_OG_IMAGE = `${IMAGES}/pizzeria.jpg`;

/**
 * `live_url` / `live_label` from the source entry, kept exact — this one points
 * at a demo deployment rather than a client's storefront, which is why the
 * label reads "demo" and not "site".
 *
 * `BlockProjectDetails` renders its values as plain `<span>`s with no anchor,
 * so the details row prints the readable host and this constant is where the
 * addressable URL survives.
 */
export const PROJECT_LIVE = {
  url: "https://pizzeria-software.vercel.app",
  label: "Live demo",
  display: "pizzeria-software.vercel.app",
} as const;

/**
 * Header. `lead` is the project's OUTCOME, not its brief: the brief is the
 * `BlockIntroDouble` statement two blocks down, and printing it in both slots
 * repeated the same sentence inside two screens on every case study.
 */
export const PROJECT_HEADER: BlockHeaderProjectsProps = {
  title: "Restaurant ordering portal",
  lead: "A working portal that lets a restaurant keep the full value of every order.",
  location: "2026 · Product",
  service: "Cloud & Infrastructure",
  breadcrumbLabel: "Work",
  breadcrumbHref: "/work/",
  backLabel: "All work",
  image: {
    src: `${IMAGES}/pizzeria.jpg`,
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
 * was built) — and the third gets its own `BlockWysiwyg` below.
 */
export const PROJECT_INTRO: BlockIntroDoubleProps = {
  labels: ["The brief", "What we built"],
  activeLabel: 0,
  statement:
    "Third-party delivery apps take a punishing cut of every restaurant order. This one removes the middleman.",
  body: "Commission-free online ordering that plugs straight into a restaurant's existing Square POS. Orders, payments, and SMS updates all flow through with nobody skimming the check.",
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
      text: "A working portal that lets a restaurant keep the full value of every order.",
    },
  ],
};

/**
 * Block 4 — `BlockProjectDetails`. The real facts only: the `stack` list as the
 * source records it, the year and platform split out of the `meta` string, and
 * the live demo. The block auto-places pairs, so the four rows read
 * (Stack | Year) then (Platform | live demo).
 */
export const PROJECT_DETAILS: ProjectDetail[] = [
  { label: "Stack", value: "TypeScript, Square SDK, Delivery APIs" },
  { label: "Year", value: "2026" },
  { label: "Platform", value: "Product" },
  { label: PROJECT_LIVE.label, value: PROJECT_LIVE.display, href: PROJECT_LIVE.url },
];
