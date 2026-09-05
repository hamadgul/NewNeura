/**
 * Content for `/services/applied-ai/strategy/` — a *child* of Applied AI.
 *
 * The page exists because the source site's `ai-consulting` service lists four
 * deliverables and this is the first of them: "A straight answer about where AI
 * helps you and where it would be theatre." Everything below is drawn from
 * `pages/content.py` (the service entry, the four-step `PROCESS`, the `HOME`
 * about copy, and the case studies that evidence the claim).
 *
 * VOICE — the source is written in the first person singular because it was one
 * person. It is a team, so this page says "we", and it claims no headcount,
 * capacity or team size. Hamad Gul is named here once, in the third person, for
 * the one paragraph that is his own biography rather than the team's work. A
 * *client's* rules living in one person's head is a fact about the client and
 * stays as written.
 *
 * Image paths are the real screenshots under `/site/images`; `width`/`height`
 * are the assets' true pixel sizes, because `next/image` sets the reserved
 * aspect ratio from them. Every asset here is a landscape 1.6:1 capture, which
 * is fine in both slots that use one: the process card crops with
 * `object-cover object-top` inside a 353×399 box, and the project tiles crop
 * too.
 *
 * Follows the template in `services/applied-ai/content.ts`; see that file's
 * header for the list of things a sibling changes. What a *child* changes on
 * top of that:
 *   1. `HEADER` takes a `backLink` instead of an `eyebrow`, drops `titleSize`
 *      (children take the block's `font-XXL` 56px default rather than the
 *      parent's 75px `font-3XL`), and flags one sub-page `current`.
 *   2. A `PROCESS` block is pinned between the intro and the rich text. The
 *      parent has none.
 *
 * The process and rich-text constants used to be imported from
 * `shared/blocks/content-presets.ts`. That file is gone; they live here now.
 * They must never move into a block module: those carry `"use client"`, and a
 * plain value imported from a client module reaches a server component as a
 * client-reference proxy, so spreading it spreads nothing and the page dies at
 * prerender.
 */
import { APPLIED_AI_SUB_PAGES } from "@/components/site/services/applied-ai/content";
import type {
  BlockHeaderServicesProps,
  ServiceSubPageLink,
} from "@/components/site/shared/blocks/BlockHeaderServices";
import type { BlockIntroDoubleProps } from "@/components/site/shared/blocks/BlockIntroDouble";
import type { BlockProcessCardSliderProps } from "@/components/site/shared/blocks/BlockProcessCardSlider";
import type { BlockProjectsHighlightProps } from "@/components/site/shared/blocks/BlockProjectsHighlight";
import type { BlockWysiwygProps } from "@/components/site/shared/blocks/BlockWysiwyg";
import type { ProjectCard } from "@/types/site";

const IMG = "/site/images";

/**
 * Route metadata. `title` is the plain stem, so the root layout's
 * "%s — NeuraGul" template supplies the suffix.
 *
 * Neither string appears on the page. The `<h1>` is `HEADER.title` and the
 * promise line is `INTRO.statement`, both unchanged and both still the
 * source's own — which is what lets the title and description here be written
 * for a result list instead. See the note beside `description`.
 */
export const META = {
  title: "AI Strategy Consulting for Small Business",
  canonical: "/services/applied-ai/strategy/",
  description:
    "AI strategy consulting from a New York team: a straight answer about where AI helps and where it would be theatre. That answer is free, and sometimes it is no.",
} as const;

/**
 * The four Applied AI children, reusing the parent page's single source of
 * truth so the DOM order can never drift between the five pages that render it.
 * This page's own entry carries the `current` dot; matching on `href` against
 * `META.canonical` keeps that automatic rather than hand-flagged.
 */
const SUB_PAGES: ServiceSubPageLink[] = APPLIED_AI_SUB_PAGES.map(
  (page: ServiceSubPageLink) =>
    page.href === META.canonical ? { ...page, current: true } : page,
);

/**
 * Child-page header.
 *
 * `service: "applied-ai"` is the *parent's* slug — children inherit the
 * `--ng-applied-ai` (#625653) ground and the white foreground the block's tone
 * table already pairs with it, so `tone` is left off.
 *
 * The artwork is the routing platform's review screen: a sheet of tickets with
 * one held back for a human. That is the picture of a judgement call, which is
 * what this page sells.
 */
export const HEADER: BlockHeaderServicesProps = {
  service: "applied-ai",
  backLink: { label: "Applied AI", href: "/services/applied-ai/" },
  subtitle: "Where AI helps, and where it would be theatre",
  title: "AI Strategy",
  subPages: SUB_PAGES,
  image: {
    src: `${IMG}/delivery-routing-review.jpg`,
    // Decorative: the caption that explains this screen lives on the project page.
    alt: "",
    width: 1600,
    height: 1000,
  },
};

/**
 * One static caption (not the two-tab variant) plus three body paragraphs.
 *
 * Split into three strings rather than one so the block's `[&>p+p]:mt-[21.6px]`
 * rhythm reproduces the paragraph breaks instead of collapsing them to a
 * single run.
 */
export const INTRO: BlockIntroDoubleProps = {
  labels: ["Where AI helps, and where it would be theatre"],
  statement:
    "A straight answer about where AI helps you and where it would be theatre. That answer is free, and it is sometimes no.",
  body: [
    "AI strategy consulting, from a team in New York that also writes the code. Most of what gets sold as AI strategy is a deck. What you get from us is half an hour on a call, a lot of questions about what the problem is actually costing you, and then either a written scope with a fixed price and a date, or a no. If we don't think we can help, we'll tell you on that call and try to point you at someone who can.",
    "The test we apply is whether there is one number somebody is already tracking. A home medical equipment provider had a dispatcher planning six vans by hand every morning from a messy export of the day's tickets. That is a measurable problem, and a solver fixed it. A brand-activation company selling wrapped food trucks to fashion houses had no website of its own, which is a different problem, and the answer there was 24 pages of Next.js with keyword research under the URL structure and no model anywhere in it.",
    "Where the answer is yes, the work goes inside the tools your team already opens every day. A system nobody opens is a system nobody uses, and we would rather say that before you pay for it than after.",
  ],
};

/* ------------------------------------------------------------------ *
 * The pinned process slider
 * ------------------------------------------------------------------ *
 *
 * `pinDistance` is left at the block's measured 1305px default (a 2445px
 * pin-spacer around the 1140px block), which is what every page carrying this
 * slider uses.
 *
 * Five phases, because the block's carousel is measured for five cards. Four of
 * them are the source's four-step engagement (`PROCESS` in content.py), quoted
 * as written; phase 02 is this page's own step, the one thing that differs
 * between the four Applied AI children.
 *
 * `dark` is left unset throughout, so the block's `index % 2 === 0` default
 * applies. Every artwork here is a screenshot of a dense, mid-tone UI, so the
 * alternation reads on all five.
 *
 * No `href`: there is no per-phase route on this site, so the cards render as
 * `<div>`s.
 */
export const PROCESS: BlockProcessCardSliderProps = {
  tagline: "Workflow",
  intro: "How we decide whether AI is the answer",
  title: "How we work",
  phasesLabel: "Phases",
  phases: [
    {
      number: "01",
      title: "You write, we talk",
      caption: "Half an hour on a call",
      text: "Half an hour on a call. You describe what's broken and how much it's costing you. We ask a lot of questions. If we don't think we can help, we'll tell you then and try to point you at someone who can.",
      image: {
        src: `${IMG}/hero-poster.jpg`,
        width: 1920,
        height: 1080,
      },
    },
    {
      number: "02",
      title: "The straight answer",
      caption: "Sometimes it is no",
      text: "We come back with where AI helps you and where it would be theatre. The bar is one number somebody is already tracking. If what you have is a manual process with rules in somebody's head, that usually clears it. If what you have is a website you don't have yet, it does not, and the answer costs you nothing.",
      image: {
        src: `${IMG}/delivery-routing-review.jpg`,
        alt: "Review and fix: 47 tickets on the sheet, one flagged for a human",
        width: 1600,
        height: 1000,
      },
    },
    {
      number: "03",
      title: "We scope it in writing",
      caption: "Fixed price, and a date",
      text: "You get a written scope, a fixed price, and a date. If we've misunderstood something, we find out here, while it's still only a document.",
      image: {
        src: `${IMG}/rwd-pipeline.jpg`,
        alt: "The real-world clinical data pipeline",
        width: 1200,
        height: 750,
      },
    },
    {
      number: "04",
      title: "We build in the open",
      caption: "Working software in weeks",
      text: "Working software lands in the first couple of weeks, then every week after that. You can redirect us while redirecting us is still cheap.",
      image: {
        src: `${IMG}/delivery-routing-routes.jpg`,
        alt: "Solved routes: six drivers colour-matched to the map",
        width: 1600,
        height: 1000,
      },
    },
    {
      number: "05",
      title: "We stay on after launch",
      caption: "We hold the pager",
      text: "We hold the pager, fix what breaks, and hand over once your team wants it. The same people are still reachable six months after launch.",
      image: {
        src: `${IMG}/delivery-routing-export.jpg`,
        alt: "Export: printable driver cut sheets for the van, Excel and CSV for the office",
        width: 1600,
        height: 1000,
      },
    },
  ],
};

/* ------------------------------------------------------------------ *
 * The two rich-text blocks, in page order
 * ------------------------------------------------------------------ */

/**
 * Four worked examples of the judgement itself, three of which end in a build
 * and one of which ends in "no model". The bold lead-in plus a `<br>` is the
 * shape `WysiwygParagraphNode` exists for.
 */
export const WYSIWYG_WHEN_IT_HELPS: BlockWysiwygProps = {
  tagline: "The judgement",
  title: "Four calls we have actually made",
  body: [
    {
      type: "paragraph",
      lead: "A manual operation with rules in one person's head:",
      text: "A home medical equipment provider planned every delivery day by hand. One dispatcher, six vans, and a yard full of drivers waiting to leave. Per-driver caps, town bans, delivery windows, driver and vehicle eligibility, all of it carried between somebody's ears. That is a yes.",
    },
    {
      type: "paragraph",
      lead: "A chore with a model-shaped hole in it:",
      text: "Shipping a parcel means guessing three things at once: which box, what it will cost, which carrier. PackShip answers all three from one photograph, with the model running on the phone that was going to take the photograph anyway. Also a yes.",
    },
    {
      type: "paragraph",
      lead: "A pile of data nobody has turned into an answer:",
      text: "Real-world clinical data arrives messy and inconsistent from dozens of sources. Before NeuraGul, Hamad Gul led a 0-to-1 ETL pipeline at Freenome that standardised all of it into a single Common Data Model, and the research ran on top of that. The work there was plumbing before it was anything cleverer.",
    },
    {
      type: "paragraph",
      lead: "A problem AI would only decorate:",
      text: "A brand-activation company was wrapping, staffing, and permitting food trucks for fashion houses and selling all of it without a website. The fix was 24 pages, keyword research shaping the URL structure, and 119 tests holding it in place. No model would have rented a single truck.",
    },
  ],
};

/**
 * Who the page is for, in the source's own words, plus who does the work. The
 * `who_for` line is quoted from `content.py`; the closing paragraph replaces the
 * source's "NeuraGul is me, I stay small on purpose" copy, which claimed a size
 * nobody has established. What survives is what is checkable: the people who
 * scope the work write it, and they are still reachable after launch.
 */
export const WYSIWYG_WHO_ITS_FOR: BlockWysiwygProps = {
  tagline: "Who this is for",
  title: "A result you can point at",
  body: [
    {
      type: "paragraph",
      text: "You're sitting on data or a manual process, and you want a working result you can point at.",
    },
    { type: "heading", text: "What the first call costs" },
    {
      type: "paragraph",
      text: "Nothing. We read every message and we answer all of them, including the ones we turn down. If we're the wrong fit for your project we'll usually know within a day, and we'll say so.",
    },
    { type: "heading", text: "Who is doing the work" },
    {
      type: "paragraph",
      text: "NeuraGul is a team of developers, designers and engineers working out of New York. The people who scope your project are the people who write it, so you always know who is on it. The same people are still reachable six months after launch.",
    },
  ],
};

/* ------------------------------------------------------------------ *
 * Highlighted projects — four tiles across layouts five / three
 * ------------------------------------------------------------------ *
 *
 * `location` carries each project's year-and-platform meta, which is the slot
 * the layout reserves for a city. There is no city to print under a project
 * name on this site.
 */

/** Layout five's full-bleed tile — the wide 1600×1000 capture, not a grid tile. */
const DELIVERY_ROUTING_REVIEW: ProjectCard = {
  title: "Delivery routing platform",
  location: "2026 · Web app",
  href: "/work/delivery-routing/",
  image: {
    src: `${IMG}/delivery-routing-review.jpg`,
    alt: "Review and fix: 47 tickets on the sheet, one flagged for a human",
    width: 1600,
    height: 1000,
  },
  size: "large",
};

const PACKSHIP: ProjectCard = {
  title: "PackShip",
  location: "2026 · iOS",
  href: "/work/packship/",
  image: {
    src: `${IMG}/packship.jpg`,
    alt: "The PackShip parcel-sizing app on iOS",
    width: 1200,
    height: 750,
  },
  size: "small",
};

const RWD_PIPELINE: ProjectCard = {
  title: "Real-World Data Pipeline",
  location: "Product · 0-to-1",
  href: "/work/rwd-pipeline/",
  image: {
    src: `${IMG}/rwd-pipeline.jpg`,
    alt: "The real-world clinical data pipeline",
    width: 1200,
    height: 750,
  },
  size: "small",
};

/**
 * The counter-example, kept deliberately: the build where the honest answer was
 * that no model belonged in it. Its own tags are Web Development and Data
 * Intelligence, so it does not appear behind the header's Applied AI filter —
 * which is the point of showing it on the page about deciding.
 */
const FOODTRUCKRENTALS: ProjectCard = {
  title: "Food Truck Rentals",
  location: "2026 · Web",
  href: "/work/foodtruckrentals/",
  image: {
    src: `${IMG}/foodtruckrentals.jpg`,
    alt: "The Food Truck Rentals home page",
    width: 1200,
    height: 750,
  },
  size: "large",
};

/**
 * Layouts five → three, the sequence this route has always run. Layout three
 * carries the footer call-to-action; the header button and the footer button
 * point at the same service-filtered work index, and the query string is part
 * of the href so the filter row on `/work/` picks it up on mount.
 */
export const PROJECTS: BlockProjectsHighlightProps = {
  title: "Where this shipped",
  button: { title: "All Applied AI", href: "/work/?service=applied-ai" },
  layouts: [
    { variant: "five", project: DELIVERY_ROUTING_REVIEW },
    {
      variant: "three",
      small: [PACKSHIP, RWD_PIPELINE],
      large: FOODTRUCKRENTALS,
      footer: {
        title: "See the rest of the work",
        buttonTitle: "Work",
        buttonHref: "/work/?service=applied-ai",
      },
    },
  ],
};
