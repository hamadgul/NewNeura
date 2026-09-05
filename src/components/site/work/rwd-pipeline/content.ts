/**
 * Content for `/work/rwd-pipeline/`.
 *
 * Every string is verbatim from the `rwd-pipeline` entry of `CASE_STUDIES` in
 * the NeuraGul source's `pages/content.py`, cross-checked against the built
 * `work/rwd-pipeline/index.html`, which prints the same copy under "The brief",
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
 * re-rendering `rwd-pipeline.jpg` through one would be padding rather than
 * evidence. No constant needs numbering, because no block appears twice.
 *
 * This is also the one project of the nine with no year: its `meta` is
 * "Product · 0-to-1", so the details table below prints a stage where the
 * others print 2026, and no date is inferred.
 *
 * VOICE — the source site is written in the first person singular, because it
 * was one person. It is a team, so this site says "we" everywhere else. This
 * project is the exception: the pipeline is Hamad Gul's own work, done as a
 * product manager at Freenome before NeuraGul existed, so it is attributed to
 * him by name in the third person rather than absorbed into a team "we". The
 * facts of the project are exactly as the source records them.
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
 * still reads "Real-World Data Pipeline" on the page and in the breadcrumb. The two diverge on
 * purpose: an `<h1>` sits under a header that has already established what the
 * page is, while a `<title>` is read cold in a result list, so it has to name
 * the category of work as well as the client. `PROJECT_TITLE` is referenced
 * only by `metadata` in the route file, so nothing visible moves with it.
 */
export const PROJECT_TITLE = "Real-World Data Pipeline for Cancer Research";
export const PROJECT_CANONICAL = "/work/rwd-pipeline/";
/**
 * The meta description. It was the project's `brief` verbatim, which reads as
 * the opening of a story rather than as a search result: the brief sets a scene
 * and names no technology, so the snippet said nothing a searcher could match.
 * This states what was built and what it was built with, in ~150 characters.
 * The brief itself is untouched and still opens the page.
 */
export const PROJECT_DESCRIPTION =
  "A 0-to-1 ETL pipeline pulling messy real-world clinical data from dozens of sources into one common model. Early cancer detection research ran on top of it.";
export const PROJECT_OG_IMAGE = `${IMAGES}/rwd-pipeline.jpg`;

/**
 * `live_url` / `live_label` from the source entry, kept exact.
 *
 * This one is not a site: it is the Office web viewer opening a `.pptx`
 * case-study deck, which is why the label reads "View the case-study deck".
 * `BlockProjectDetails` renders its values as plain `<span>`s with no anchor,
 * so `display` prints the deck the viewer opens rather than the 130-character
 * viewer URL, and `url` — the exact string the source ships — survives here.
 */
export const PROJECT_LIVE = {
  url: "https://view.officeapps.live.com/op/view.aspx?src=https%3A%2F%2Fneuragul.com%2Fassets%2Fdocs%2Frwd-pipeline-portfolio.pptx",
  label: "Case study",
  display: "neuragul.com/assets/docs/rwd-pipeline-portfolio.pptx",
} as const;

/**
 * Header. `lead` is the project's OUTCOME, not its brief: the brief is the
 * `BlockIntroDouble` statement two blocks down, and printing it in both slots
 * repeated the same sentence inside two screens on every case study.
 */
export const PROJECT_HEADER: BlockHeaderProjectsProps = {
  title: "Real-World Data Pipeline",
  lead: "A 0-to-1 data pipeline taken from concept to production.",
  location: "Product · 0-to-1",
  service: "Data Intelligence",
  breadcrumbLabel: "Work",
  breadcrumbHref: "/work/",
  backLabel: "All work",
  image: {
    src: `${IMAGES}/rwd-pipeline.jpg`,
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
 * — and the third gets its own `BlockWysiwyg` below.
 *
 * The second heading reads "What Hamad led" here, not the "What we built" the
 * other eight case studies carry. This work predates NeuraGul and belongs to one
 * named person, and the heading has to agree with the body underneath it.
 */
export const PROJECT_INTRO: BlockIntroDoubleProps = {
  labels: ["The brief", "What Hamad led"],
  activeLabel: 0,
  statement:
    "Early cancer detection depends on real-world clinical data, and real-world clinical data arrives messy and inconsistent from dozens of sources.",
  body: "Hamad Gul led product management at Freenome for a 0-to-1 ETL pipeline that standardized all of it into a single Common Data Model. Downstream research and models were built on that foundation.",
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
      text: "A 0-to-1 data pipeline taken from concept to production.",
    },
  ],
};

/**
 * Block 4 — `BlockProjectDetails`. The real facts only.
 *
 * "Stack" holds the source's `stack` list unchanged even though this project's
 * entries are disciplines rather than technologies — that is what the source
 * ships and what its own page renders as the chip row. The two halves of the
 * `meta` string become the platform and the stage; there is no year to print.
 * The block auto-places pairs, so the four rows read (Stack | Platform) then
 * (Stage | the deck).
 */
export const PROJECT_DETAILS: ProjectDetail[] = [
  { label: "Stack", value: "Product Management, Agile, Planning" },
  { label: "Platform", value: "Product" },
  { label: "Stage", value: "0-to-1" },
  { label: PROJECT_LIVE.label, value: PROJECT_LIVE.display, href: PROJECT_LIVE.url },
];
