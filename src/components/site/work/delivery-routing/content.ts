/**
 * Content for `/work/delivery-routing/`.
 *
 * Provenance for every string here is recorded in
 * `docs/research/case-studies/delivery-routing.md`, which cites the file and
 * line in `~/Projects/Routing` behind each claim. Nothing below is written from
 * memory, and the dossier's "Unverifiable claims" section lists what was
 * deliberately NOT written.
 *
 * Image sizing note: `width`/`height` are the assets' true decoded pixels
 * (1200x750 for the cover, 1600x1000 for the four screens), because
 * `next/image` reserves the aspect ratio from them and every block here sizes
 * itself from that ratio rather than from a fixed height.
 *
 * Alt text note: these are informative product screenshots, not decorative
 * photographs, so every `alt` describes what the screen shows and what it is
 * evidence for. `check-assets.mjs` fails the build on an empty one. The cover
 * is the single exception — it is a decorative backdrop behind the header's
 * title, and it is in that script's `FROZEN_COVERS` list.
 *
 * SYNTHETIC DATA — every screenshot was captured against a throwaway database
 * seeded with an invented roster, invented patients and invented street
 * addresses in real Connecticut towns. The client's own logo and the cut
 * sheet's masthead are hidden in every frame (see the `hideSelectors` in
 * `scripts/shots/delivery-routing.config.mjs`), because `PROJECT_OUTCOME`
 * promises the client is not named and the logo otherwise sits in the corner
 * of every app screen.
 *
 * VOICE — the site says "we", never "I", and nothing here claims a headcount.
 * See `.agents/product-marketing.md` for the shared positioning this page was
 * written against: the reader is an operator with a manual daily process, and
 * the objection the page answers is "software will get my day wrong in a way
 * my dispatcher never would, and I won't find out until a van is out."
 */
import type { BlockHeaderProjectsProps } from "@/components/site/shared/blocks/BlockHeaderProjects";
import type { BlockImageFullProps } from "@/components/site/shared/blocks/BlockImageFull";
import type { BlockIntroDoubleProps } from "@/components/site/shared/blocks/BlockIntroDouble";
import type { BlockMediaDoubleQuoteProps } from "@/components/site/shared/blocks/BlockMediaDoubleQuote";
import type { BlockWysiwygProps } from "@/components/site/shared/blocks/BlockWysiwyg";
import type { GeneralCtaProps } from "@/components/site/shared/blocks/GeneralCta";
import type { ProjectDetail } from "@/components/site/shared/blocks/BlockProjectDetails";

const IMAGES = "/site/images";

/**
 * The `<title>` stem, suffixed by the root layout's `"%s — NeuraGul"` template.
 *
 * This is NOT the project's display name — `PROJECT_HEADER.title` is, and it
 * still reads "Delivery routing platform" on the page and in the breadcrumb.
 * The two diverge on purpose: an `<h1>` sits under a header that has already
 * established what the page is, while a `<title>` is read cold in a result
 * list, so it has to name the category of work as well as the client.
 * `PROJECT_TITLE` is referenced only by `metadata` in the route file, so
 * nothing visible moves with it.
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
 * Block 2 — `BlockIntroDouble`, run through `projectIntroTabs`, which relabels
 * the tabs to "The brief" / "The tech stack" and fills the second panel from
 * the `Stack` row of `PROJECT_DETAILS`. So only `statement` and `body` below
 * reach the page; `labels` and `activeLabel` are overwritten by that helper.
 *
 * `statement` is the brief and is deliberately unchanged: it is the concrete
 * before-state the whole page argues against, and `.agents/product-marketing.md`
 * cites it as the shape every case study's opening should match.
 *
 * `body` is shorter than it was. It used to carry the parse rules, the solver,
 * the geocoding, the matrix budget, the cut sheet and the test count in one
 * paragraph, because there was nowhere else on the page to put them. There is
 * now: each of those is its own section below, next to the screenshot that
 * shows it working.
 */
export const PROJECT_INTRO: BlockIntroDoubleProps = {
  labels: ["The brief", "What we built"],
  activeLabel: 0,
  statement:
    "A home medical equipment provider planned every delivery day by hand. One dispatcher, a messy export of the day's tickets, six vans, and a yard full of drivers waiting to leave.",
  body: "A dispatch app that runs the whole morning in four steps: read the sheet, fix what it flags, solve the routes, print the cut sheets. Google OR-Tools solves for the shortest total drive time, inside the delivery windows, per-driver caps, town bans and vehicle eligibility the dispatcher used to carry in their head. 1,278 Python tests and 399 web tests cover those rules. It has run on Fly.io since August 2026.",
};

/**
 * Block 3 — `BlockWysiwyg`, the source's "Outcome" section.
 *
 * It sits BEFORE the media, and has to: the copy ends on "the screenshots
 * below", so the screenshots have to be below it. That last sentence is also a
 * promise the capture config has to keep — see the synthetic-data note at the
 * top of this file.
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
      text: "Every ticket on the sheet ends the morning in one of two places: on a driver's route, or on a short list of rows a human has to look at. The app calls that delivery accounting, and the two numbers have to add back up to the sheet. It runs in production on Fly.io. The client is not named here, and the screenshots below run on synthetic data.",
    },
  ],
};

/**
 * Block 4 — `BlockWysiwyg`: how the sheet is read.
 *
 * The page's central argument, and the one the reader's real objection is
 * about. Every sentence here is a mechanism in the source repo, cited in the
 * dossier's "Architecture decisions": the deterministic parse, the paste
 * endpoint with no model fallback, the held row, fail-closed geocoding, and
 * `items_text` kept verbatim.
 */
export const PROJECT_PARSE: BlockWysiwygProps = {
  title: "Reading the sheet",
  body: [
    {
      type: "paragraph",
      text: "The day arrives as a spreadsheet export: ticket number, patient, items, address, and a free-text priority cell. A recognised export is read by fixed rules and never reaches a language model, so nothing in that path can invent an address. Rows pasted straight out of the spreadsheet take the same path, and that route has no model behind it at all.",
    },
    {
      type: "paragraph",
      text: "What the parser cannot read with confidence, it refuses. An item code that is not equipment holds its row out of the solve and names itself on the review screen. An address that will not resolve to a building becomes a flagged task rather than an approximate pin, because a wrong pin sends a van to the wrong house and nothing later in the morning can catch it. The items cell is kept exactly as it was typed, so a log that said 3 ROLLATOR never prints as ROLLATOR.",
    },
  ],
};

/**
 * Block 5 — `BlockImageFull`: the review screen.
 *
 * The evidence for the paragraph immediately above it, and for `PROJECT_OUTCOME`
 * two blocks up: the header reads "47 tickets on the sheet → 46 will deliver ·
 * 1 need review", which is the delivery accounting that has to add back up.
 *
 * This block has no caption slot and no fixed height — the image's own 1.6
 * ratio drives it — so the screen's description lives in `alt`. It is the first
 * image after the header's own, so the page passes it `priority`; the other two
 * `BlockImageFull` instances stay lazy, which is the block's default.
 */
export const PROJECT_IMAGE_REVIEW: BlockImageFullProps = {
  image: {
    src: `${IMAGES}/delivery-routing-review.jpg`,
    alt: "The review screen: 47 tickets on the sheet, 46 will deliver, and one row held back under the app's own words, unknown code: RTS.",
    width: 1600,
    height: 1000,
  },
};

/**
 * Block 6 — `BlockWysiwyg`: the rules layer.
 *
 * Answers the objection under the objection — "what happens the first time my
 * business changes and you are not available." Both paragraphs are drawn from
 * `CLAUDE.md`'s Config section and the learned-items section; see the dossier's
 * "Gaps" list, where the learned layer and per-run overrides were the two
 * largest capabilities the page used to say nothing about.
 */
export const PROJECT_RULES: BlockWysiwygProps = {
  title: "The rules are configuration",
  body: [
    {
      type: "paragraph",
      text: "Item codes, drivers, vans, served towns, per-driver delivery caps, banned driver-and-address pairs, which driver may carry a hospital bed and which van may not: all of it is data. It lives in a config version that is published with a diff and can be rolled back. Nothing published is edited in place, and no driver name or item code is written into the code.",
    },
    {
      type: "paragraph",
      text: "The dispatcher feels that twice. An item code nobody has seen before is learned on sight and routes the same day, then waits on the config screen to be named properly. And who is driving today, which van they take, and a heavier cap for this one morning are choices on the run itself, so a one-off never needs a new published version.",
    },
  ],
};

/**
 * Block 7 — `BlockImageFull`: Day Setup.
 *
 * The evidence for the paragraph immediately above it. No `priority`: it is
 * several viewports down and the block lazy-loads by default.
 */
export const PROJECT_IMAGE_SETUP: BlockImageFullProps = {
  image: {
    src: `${IMAGES}/delivery-routing-setup.jpg`,
    alt: "Day Setup: six of seven drivers and six of seven vans switched on for this run only, with each driver's van chosen beside their name.",
    width: 1600,
    height: 1000,
  },
};

/**
 * Block 8 — `BlockWysiwyg`: the artefact the morning produces.
 *
 * One paragraph. The cut sheet is the only thing on this page a driver ever
 * touches, and the media block below it shows every noun in the sentence.
 */
export const PROJECT_CUTSHEET: BlockWysiwygProps = {
  title: "What goes out with the vans",
  body: [
    {
      type: "paragraph",
      text: "The app prints a cut sheet, one page per driver, built for a clipboard and a pen: stop order, ETA, the delivery window where there is one, the items, and a box at every stop for the driver to write in the time they actually delivered. A same-day discharge prints with its deadline on the row, because that delivery is the one the rest of the morning is planned around.",
    },
  ],
};

/**
 * Block 9 — `BlockMediaDoubleQuote`: the two things the morning produces.
 *
 * At `xl` the blockquote sits directly under the *small* media, so the quote is
 * the small image's own caption rather than a pull-quote lifted from elsewhere.
 * That pins the office-files line to the export screenshot; the cut sheet
 * carries its description in `alt`.
 *
 * Pairing them is the point: the cut sheet is what goes in the van and the
 * export is what stays in the office, and they are the same run seen from two
 * ends. The cut sheet takes the large slot because it is the artefact the
 * paragraph above is about.
 */
export const PROJECT_MEDIA_QUOTE: BlockMediaDoubleQuoteProps = {
  large: {
    type: "image",
    src: `${IMAGES}/delivery-routing-cutsheet.jpg`,
    alt: "A driver cut sheet: one page per driver, with stop order, ETA, items, a DONE checkbox and an empty box to write in the time delivered.",
    width: 1600,
    height: 1000,
  },
  small: {
    type: "image",
    src: `${IMAGES}/delivery-routing-export.jpg`,
    alt: "The export screen: an Excel workbook, a CSV delivery log, and a per-driver run summary.",
    width: 1600,
    height: 1000,
  },
  quote:
    "Four sheets of Excel for the office, a CSV delivery log, and a per-driver summary of stops, driving time and the hour each van gets back.",
};

/**
 * Block 10 — `BlockProjectDetails`. The real facts only: this project ships no
 * public URL (it runs inside one operator's business), so there is no live-link
 * row to write and none is invented.
 *
 * `Stack` is read by `projectIntroTabs` to fill the second intro tab and then
 * dropped from this table by `projectDetailsWithoutStack`, so it is written
 * once and printed once.
 *
 * `Tests` and `Deployment` are new. They carry the production argument that
 * would otherwise have needed a twelfth block of prose: a label/value row is
 * the denser place for a pair of numbers and a one-line topology.
 */
export const PROJECT_DETAILS: ProjectDetail[] = [
  { label: "Stack", value: "Python, FastAPI, OR-Tools, React, TypeScript, SQLite, Fly.io" },
  { label: "Tests", value: "1,278 Python · 399 web" },
  { label: "Deployment", value: "Fly.io — one machine, SQLite on a mounted volume" },
  { label: "Year", value: "2026" },
  { label: "Platform", value: "Web app" },
];

/**
 * Block 11 — `GeneralCta`, the site's call-to-action band.
 *
 * Declared here rather than imported from `GeneralCta.tsx`: that block is a
 * `"use client"` module, so a plain value imported from it into a server
 * component arrives as a client-reference proxy and spreads to undefined props
 * — an empty `<p>` and an href-less button, with no type or build error to
 * catch it. This file has no `"use client"`, so the value stays real in the
 * server graph. `/process/` declares its own for the same reason.
 *
 * The line is this project's own problem rather than `/process/`'s general
 * "Tell us what's broken.", per `.agents/product-marketing.md` §1: prefer a
 * line the reader recognises as their own situation where the case study
 * supports one, and this one does.
 */
export const PROJECT_CTA: GeneralCtaProps = {
  text: "Still planning the day by hand?",
  label: "Contact",
  href: "/contact/",
};
