/**
 * Content for `/work/landscape-drainage-proz/`.
 *
 * Every string is verbatim from the `landscape-drainage-proz` entry of
 * `CASE_STUDIES` in the NeuraGul source's `pages/content.py`, cross-checked
 * against the built `work/landscape-drainage-proz/index.html`, which prints the
 * same copy under "The brief", "What I built" and "Outcome". Nothing is
 * paraphrased and nothing is invented — including the outcome, which is four
 * words long and stays four words long.
 *
 * Image sizing note: `width`/`height` are the file's true decoded pixels
 * (1200x750), because `next/image` reserves the aspect ratio from them and the
 * header sizes its crop from that ratio rather than from a fixed height.
 *
 * Block-count note: this is the shortest of the nine case studies — one image,
 * a one-sentence brief, and a one-sentence build — so the page runs four blocks
 * rather than the eleven the inherited template was built for; that sequence
 * existed to carry eighteen architecture photographs. There is deliberately no
 * media block: every one of them needs either a second asset
 * (`BlockMediaDouble`, `BlockMediaDoubleQuote`) or a picture the header has not
 * already shown (`BlockImageFull`), and re-rendering `landscapedrainage.jpg`
 * through one would be padding rather than evidence. No constant needs
 * numbering, because no block appears twice.
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
import type { BlockWysiwygProps } from "@/components/site/shared/blocks/BlockWysiwyg";
import type { ProjectDetail } from "@/components/site/shared/blocks/BlockProjectDetails";

const IMAGES = "/site/images";

/**
 * The `<title>` stem, suffixed by the root layout's `"%s — NeuraGul"` template.
 *
 * This is NOT the project's display name — `PROJECT_HEADER.title` is, and it
 * still reads "Landscape Drainage Proz" on the page and in the breadcrumb. The two diverge on
 * purpose: an `<h1>` sits under a header that has already established what the
 * page is, while a `<title>` is read cold in a result list, so it has to name
 * the category of work as well as the client. `PROJECT_TITLE` is referenced
 * only by `metadata` in the route file, so nothing visible moves with it.
 */
export const PROJECT_TITLE = "Landscape Drainage Proz: a Shopify Build";
export const PROJECT_CANONICAL = "/work/landscape-drainage-proz/";
/**
 * The meta description. It was the project's `brief` verbatim, which reads as
 * the opening of a story rather than as a search result: the brief sets a scene
 * and names no technology, so the snippet said nothing a searcher could match.
 * This states what was built and what it was built with, in ~150 characters.
 * The brief itself is untouched and still opens the page.
 */
export const PROJECT_DESCRIPTION =
  "A Shopify storefront for a drainage-products retailer that tripled the client's online sales. A NeuraGul e-commerce case study.";
export const PROJECT_OG_IMAGE = `${IMAGES}/landscapedrainage.jpg`;

/**
 * `live_url` / `live_label` from the source entry, kept exact.
 *
 * `BlockProjectDetails` renders its values as plain `<span>`s with no anchor,
 * so the details row prints the readable host and this constant is where the
 * addressable URL survives.
 */
export const PROJECT_LIVE = {
  url: "https://landscapedrainageproz.com",
  label: "Live site",
  display: "landscapedrainageproz.com",
} as const;

/**
 * Header. `lead` is the project's OUTCOME, not its brief: the brief is the
 * `BlockIntroDouble` statement two blocks down, and printing it in both slots
 * repeated the same sentence inside two screens on every case study.
 */
export const PROJECT_HEADER: BlockHeaderProjectsProps = {
  title: "Landscape Drainage Proz",
  lead: "Tripled the client's online sales.",
  location: "2026 · Shopify",
  service: "Web Development · Data Intelligence",
  breadcrumbLabel: "Work",
  breadcrumbHref: "/work/",
  backLabel: "All work",
  image: {
    src: `${IMAGES}/landscapedrainage.jpg`,
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
  statement: "A drainage-products retailer wanted a storefront that sold things.",
  body: "A Shopify buildout paired with the marketing work around it: CTA design and implementation, Google Ads, and an SEO strategy set up to compound.",
};

/**
 * Block 3 — `BlockWysiwyg`, carrying the source's third headed section.
 *
 * `title` only, no `tagline`: the narrow left column becomes the "Outcome"
 * heading and the wide right column the copy, which is the block's own
 * two-column shape. A tagline would add a second, duplicate label above it.
 *
 * The copy is one short sentence and it is the strongest fact on the page, so
 * it gets the block rather than being appended to the intro body where it would
 * read as a trailing clause.
 */
export const PROJECT_OUTCOME: BlockWysiwygProps = {
  title: "Outcome",
  body: [
    {
      type: "paragraph",
      text: "Tripled the client's online sales.",
    },
  ],
};

/**
 * Block 4 — `BlockProjectDetails`. The real facts only: the `stack` list as the
 * source records it, the year and platform split out of the `meta` string, and
 * the live link. "Shopify" appearing in both the platform and the stack is the
 * source's own duplication and is left alone. The block auto-places pairs, so
 * the four rows read (Stack | Year) then (Platform | live link).
 */
export const PROJECT_DETAILS: ProjectDetail[] = [
  { label: "Stack", value: "Shopify, Custom Liquid, SEO, Google Ads" },
  { label: "Year", value: "2026" },
  { label: "Platform", value: "Shopify" },
  { label: PROJECT_LIVE.label, value: PROJECT_LIVE.display, href: PROJECT_LIVE.url },
];
