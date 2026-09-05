/**
 * Content for `/work/delivery-routing/`.
 *
 * Every string is verbatim from the `delivery-routing` entry of `CASE_STUDIES`
 * in the NeuraGul source's `pages/content.py`, cross-checked against the built
 * `work/delivery-routing/index.html`. Nothing is paraphrased and nothing is
 * invented.
 *
 * Image sizing note: `width`/`height` are the assets' true decoded pixels
 * (1200x750 for the cover, 1600x1000 for the three screens), because
 * `next/image` reserves the aspect ratio from them and every block here sizes
 * itself from that ratio rather than from a fixed height.
 *
 * Alt text note: the source's own media captions become the images' `alt`
 * strings. The architecture layout this shell came from shipped `alt=""`
 * everywhere because its media were decorative photographs; these are
 * informative product screenshots, so the caption is the description.
 *
 * Block-count note: this project has four real images and is the richest of the
 * set, but it is still four — not the eighteen the original eleven-block
 * sequence was built for. It runs six blocks, and the only block that appears
 * more than once is none of them, so no exported constant needs numbering.
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
import type { BlockImageFullProps } from "@/components/site/shared/blocks/BlockImageFull";
import type { BlockIntroDoubleProps } from "@/components/site/shared/blocks/BlockIntroDouble";
import type { BlockMediaDoubleQuoteProps } from "@/components/site/shared/blocks/BlockMediaDoubleQuote";
import type { BlockWysiwygProps } from "@/components/site/shared/blocks/BlockWysiwyg";
import type { ProjectDetail } from "@/components/site/shared/blocks/BlockProjectDetails";

const IMAGES = "/site/images";

/**
 * The `<title>` stem, suffixed by the root layout's `"%s — NeuraGul"` template.
 *
 * This is NOT the project's display name — `PROJECT_HEADER.title` is, and it
 * still reads "Delivery routing platform" on the page and in the breadcrumb. The two diverge on
 * purpose: an `<h1>` sits under a header that has already established what the
 * page is, while a `<title>` is read cold in a result list, so it has to name
 * the category of work as well as the client. `PROJECT_TITLE` is referenced
 * only by `metadata` in the route file, so nothing visible moves with it.
 */
export const PROJECT_TITLE = "Delivery Routing Software for a Van Fleet";
export const PROJECT_CANONICAL = "/work/delivery-routing/";
/**
 * The meta description. It was the project's `brief` verbatim, which reads as
 * the opening of a story rather than as a search result: the brief sets a scene
 * and names no technology, so the snippet said nothing a searcher could match.
 * This states what was built and what it was built with, in ~150 characters.
 * The brief itself is untouched and still opens the page.
 */
export const PROJECT_DESCRIPTION =
  "How we built delivery routing software that turns a messy ticket export into printed van routes in minutes. Google OR-Tools, live traffic, 1,278 tests.";
export const PROJECT_OG_IMAGE = `${IMAGES}/delivery-routing.jpg`;

/**
 * Header. `lead` is the project's OUTCOME, not its brief: the brief is the
 * `BlockIntroDouble` statement two blocks down, and printing it in both slots
 * repeated the same sentence inside two screens on every case study.
 */
export const PROJECT_HEADER: BlockHeaderProjectsProps = {
  title: "Delivery routing platform",
  lead: "Upload to printed routes in minutes, with every ticket accounted for.",
  location: "2026 · Web app",
  service: "Applied AI · Data Intelligence",
  breadcrumbLabel: "Work",
  breadcrumbHref: "/work/",
  backLabel: "All work",
  image: {
    src: `${IMAGES}/delivery-routing.jpg`,
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
    "A home medical equipment provider planned every delivery day by hand. One dispatcher, a messy export of the day's tickets, six vans, and a yard full of drivers waiting to leave.",
  body: "A dispatch app that runs the whole morning in four steps. It parses the delivery log and refuses to invent anything it cannot read with confidence. An unreadable row becomes a flagged task for a human. It then applies the business rules the dispatcher used to carry in their head, all of them: per-driver caps, town bans, delivery windows, driver and vehicle eligibility. Google OR-Tools solves for minimum drive time against live traffic. Geocoding fails closed. A per-solve travel-matrix budget makes a runaway maps bill structurally impossible. What comes out is a printed cut sheet designed for a clipboard and a pen, plus an Excel and CSV log for the office. 1,278 tests cover the rules.",
};

/**
 * Block 4 — `BlockImageFull`: the solved routes.
 *
 * This block has no caption slot and no fixed height — the image's own 1.6
 * ratio drives it — so the source's caption for this screen lives in `alt`.
 * It is the one instance that can be reached in the first viewport or two after
 * the header, so the page passes it `priority`.
 */
export const PROJECT_IMAGE_FULL: BlockImageFullProps = {
  image: {
    src: `${IMAGES}/delivery-routing-routes.jpg`,
    alt: "Solved routes. Six drivers colour-matched to the map, with any stop movable between them.",
    width: 1600,
    height: 1000,
  },
};

/**
 * Block 5 — `BlockMediaDoubleQuote`.
 *
 * At `xl` the blockquote sits directly under the *small* media, so the quote is
 * the small image's own caption rather than a pull-quote lifted from elsewhere.
 * That pins the export caption to the export screenshot; the review screen
 * carries its caption in `alt`.
 */
export const PROJECT_MEDIA_QUOTE: BlockMediaDoubleQuoteProps = {
  large: {
    type: "image",
    src: `${IMAGES}/delivery-routing-review.jpg`,
    alt: "Review and fix. 47 tickets on the sheet, with one flagged for a human.",
    width: 1600,
    height: 1000,
  },
  small: {
    type: "image",
    src: `${IMAGES}/delivery-routing-export.jpg`,
    alt: "Export. Printable driver cut sheets for the van, Excel and CSV for the office.",
    width: 1600,
    height: 1000,
  },
  quote: "Export. Printable driver cut sheets for the van, Excel and CSV for the office.",
};

/**
 * Block 3 — `BlockWysiwyg`, carrying the source's third headed section.
 *
 * It sits before the media, exactly where the source puts it: the copy ends on
 * "the screenshots below run on synthetic data", so the screenshots have to be
 * below it.
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
      text: "Upload to printed routes in minutes, with every ticket accounted for. In daily production use, deployed on Fly.io. The client is not named here, and the screenshots below run on synthetic data.",
    },
  ],
};

/**
 * Block 6 — `BlockProjectDetails`. The real facts only: this project ships no
 * public URL (it runs inside one operator's business), so there is no live-link
 * row to write and none is invented.
 */
export const PROJECT_DETAILS: ProjectDetail[] = [
  { label: "Stack", value: "Python, FastAPI, OR-Tools, React, TypeScript, Fly.io" },
  { label: "Year", value: "2026" },
  { label: "Platform", value: "Web app" },
];
