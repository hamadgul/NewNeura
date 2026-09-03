/**
 * Content for `/services/applied-ai/agents/` — a *child* of Applied AI.
 *
 * The page is the third `deliverables` bullet of the source site's
 * `ai-consulting` service: "Retrieval, automation, and agent workflows aimed at
 * a single measurable outcome." The evidence is the delivery routing platform,
 * whose `built` paragraph in `pages/content.py` describes an app that "runs the
 * whole morning in four steps" — those four steps are this page's process
 * slider, quoted from that paragraph.
 *
 * VOICE — the source is written in the first person singular because it was one
 * person. It is a team, so this page says "we", and it claims no headcount,
 * capacity or team size. The *client's* dispatcher carrying the rulebook in
 * their head is a fact about the client and stays as written. See
 * `home/content.ts` for the full statement of the rule.
 *
 * Image paths are the real screenshots under `/site/images`; `width`/`height`
 * are the assets' true pixel sizes, because `next/image` sets the reserved
 * aspect ratio from them. Everything is a landscape 1.6:1 capture, and both
 * slots that use one crop with `object-cover`, so the shape mismatch is
 * invisible.
 *
 * Follows the template in `services/applied-ai/content.ts`. What a *child*
 * changes on top of that: a `backLink` instead of an `eyebrow`, no `titleSize`
 * (children take the block's `font-XXL` 56px default rather than the parent's
 * 75px `font-3XL`), one sub-page flagged `current`, and a pinned `PROCESS`
 * slider between the intro and the rich text.
 *
 * The process and rich-text constants used to be imported from
 * `shared/blocks/content-presets.ts`. That file is gone; they live here now,
 * and they must stay in a plain module. A block module carries `"use client"`,
 * and a value imported from one reaches a server component as a
 * client-reference proxy, so spreading it spreads nothing.
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
 * Route metadata. `title` is the bare page name so the root layout's
 * "%s — NeuraGul" template supplies the suffix; `description` is the page's own
 * promise line.
 */
export const META = {
  title: "Retrieval & Agents",
  canonical: "/services/applied-ai/agents/",
  description:
    "Retrieval, automation, and agent workflows aimed at a single measurable outcome.",
} as const;

/**
 * The four Applied AI children, reusing the parent page's single source of
 * truth so the DOM order can never drift between the five pages that render it.
 * Matching on `href` against `META.canonical` keeps the `current` dot automatic
 * rather than hand-flagged.
 */
const SUB_PAGES: ServiceSubPageLink[] = APPLIED_AI_SUB_PAGES.map(
  (page: ServiceSubPageLink) =>
    page.href === META.canonical ? { ...page, current: true } : page,
);

/**
 * Child-page header. `service: "applied-ai"` is the *parent's* slug — children
 * inherit the `--ng-applied-ai` (#625653) ground and the white foreground the
 * block's tone table already pairs with it, so `tone` is left off.
 */
export const HEADER: BlockHeaderServicesProps = {
  service: "applied-ai",
  backLink: { label: "Applied AI", href: "/services/applied-ai/" },
  subtitle: "One workflow, run end to end",
  title: "Retrieval & Agents",
  subPages: SUB_PAGES,
  image: {
    src: `${IMG}/delivery-routing-routes.jpg`,
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
  labels: ["One workflow, run end to end"],
  statement:
    "Retrieval, automation, and agent workflows aimed at a single measurable outcome.",
  body: [
    "An automation earns its keep when it takes one whole job off somebody's morning. A home medical equipment provider had a dispatcher doing that job by hand: a messy export of the day's tickets, six vans, and a yard full of drivers waiting to leave.",
    "The app runs the whole morning in four steps. It parses the delivery log and refuses to invent anything it cannot read with confidence, so an unreadable row becomes a flagged task for a human. It applies the business rules the dispatcher used to carry in their head, all of them: per-driver caps, town bans, delivery windows, driver and vehicle eligibility. Google OR-Tools then solves for minimum drive time against live traffic.",
    "What comes out is a printed cut sheet designed for a clipboard and a pen, plus an Excel and CSV log for the office. Upload to printed routes in minutes, with every ticket accounted for. It is in daily production use on Fly.io, 1,278 tests cover the rules, and the screenshots on this site run on synthetic data because the client is not named here.",
  ],
};

/* ------------------------------------------------------------------ *
 * The pinned process slider
 * ------------------------------------------------------------------ *
 *
 * `pinDistance` is left at the block's measured 1305px default (a 2445px
 * pin-spacer around the 1140px block), which every page carrying this slider
 * uses.
 *
 * Five phases, because the carousel is measured for five cards. Phases 01–04
 * are the four steps the source's own `built` paragraph enumerates, in its
 * order; phase 05 is the engagement's last step, quoted as written.
 *
 * `dark` is left unset throughout, so the block's `index % 2 === 0` default
 * applies; every artwork here is a dense mid-tone screenshot, which reads on
 * both tones.
 *
 * No `href`: there is no per-phase route on this site, so the cards render as
 * `<div>`s.
 */
export const PROCESS: BlockProcessCardSliderProps = {
  tagline: "Workflow",
  intro: "How the routing platform runs a morning",
  title: "How we work",
  phasesLabel: "Phases",
  phases: [
    {
      number: "01",
      title: "Read the log, refuse to guess",
      caption: "An unreadable row is a task",
      text: "It parses the delivery log and refuses to invent anything it cannot read with confidence. An unreadable row becomes a flagged task for a human, which is the only safe thing to do with an address a van would otherwise drive to.",
      image: {
        src: `${IMG}/delivery-routing-review.jpg`,
        width: 1600,
        height: 1000,
      },
    },
    {
      number: "02",
      title: "Apply every rule the dispatcher carried",
      caption: "All of them, written down",
      text: "Per-driver caps, town bans, delivery windows, driver and vehicle eligibility. Every business rule one person used to hold in their head, applied the same way each morning whether or not that person is in today.",
      image: {
        src: `${IMG}/delivery-routing.jpg`,
        width: 1200,
        height: 750,
      },
    },
    {
      number: "03",
      title: "Solve for the real road",
      caption: "OR-Tools, live traffic",
      text: "Google OR-Tools solves for minimum drive time against live traffic. Geocoding fails closed. A per-solve travel-matrix budget makes a runaway maps bill structurally impossible.",
      image: {
        src: `${IMG}/delivery-routing-routes.jpg`,
        width: 1600,
        height: 1000,
      },
    },
    {
      number: "04",
      title: "Hand it to the van and the office",
      caption: "A clipboard and a pen",
      text: "What comes out is a printed cut sheet designed for a clipboard and a pen, plus an Excel and CSV log for the office. Upload to printed routes in minutes, with every ticket accounted for.",
      image: {
        src: `${IMG}/delivery-routing-export.jpg`,
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
        src: `${IMG}/packship.jpg`,
        width: 1200,
        height: 750,
      },
    },
  ],
};

/* ------------------------------------------------------------------ *
 * The single rich-text block
 * ------------------------------------------------------------------ *
 *
 * One instance here, against two on the strategy, models and evaluation
 * siblings. The count is per page.
 */

/**
 * The same four steps as the slider, in the reading layout rather than the
 * carousel — the slider clamps its body to three lines, so this is where the
 * detail that will not fit on a card goes, plus the measurable outcome the
 * whole page is named for.
 */
export const WYSIWYG: BlockWysiwygProps = {
  tagline: "One measurable outcome",
  title: "The morning, in four steps",
  body: [
    {
      type: "paragraph",
      lead: "Parse:",
      text: "The delivery log arrives as a messy export. The app reads what it can read with confidence and flags the rest for a person. Nothing gets invented to fill a gap.",
    },
    {
      type: "paragraph",
      lead: "Apply the rules:",
      text: "Per-driver caps, town bans, delivery windows, driver and vehicle eligibility. The whole rulebook a dispatcher used to run from memory, now written down and enforced identically every day.",
    },
    {
      type: "paragraph",
      lead: "Solve:",
      text: "Google OR-Tools solves for minimum drive time against live traffic. Geocoding fails closed, and a per-solve travel-matrix budget makes a runaway maps bill structurally impossible.",
    },
    {
      type: "paragraph",
      lead: "Hand over:",
      text: "A printed cut sheet designed for a clipboard and a pen, plus an Excel and CSV log for the office. Six drivers colour-matched to the map, with any stop movable between them.",
    },
    { type: "heading", text: "What it changed" },
    {
      type: "paragraph",
      text: "Upload to printed routes in minutes, with every ticket accounted for. In daily production use, deployed on Fly.io, with 1,278 tests covering the rules. The client is not named here, and the screenshots run on synthetic data.",
    },
    { type: "heading", text: "Who this is for" },
    {
      type: "paragraph",
      text: "You're sitting on data or a manual process, and you want a working result you can point at. If the process is genuinely one job with a number attached to it, this is the shape the work takes.",
    },
  ],
};

/* ------------------------------------------------------------------ *
 * Highlighted projects
 * ------------------------------------------------------------------ *
 *
 * `location` carries each project's year-and-platform meta, which is the slot
 * the layout reserves for a city. There is no city to print under a project
 * name on this site.
 */

const DELIVERY_ROUTING_ROUTES: ProjectCard = {
  title: "Delivery routing platform",
  location: "2026 · Web app",
  href: "/work/delivery-routing/",
  image: {
    src: `${IMG}/delivery-routing-routes.jpg`,
    alt: "Solved routes: six drivers colour-matched to the map",
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
    alt: "PackShip",
    width: 1200,
    height: 750,
  },
  size: "large",
};

/** Layout five's full-bleed tile — the wide 1600×1000 capture, not a grid tile. */
const DELIVERY_ROUTING_EXPORT: ProjectCard = {
  title: "Delivery routing platform",
  location: "2026 · Web app",
  href: "/work/delivery-routing/",
  image: {
    src: `${IMG}/delivery-routing-export.jpg`,
    alt: "Export: printable driver cut sheets for the van, Excel and CSV for the office",
    width: 1600,
    height: 1000,
  },
  size: "large",
};

/**
 * Layouts four → five. The route used to run four → five → two, but only two
 * projects carry the Applied AI tag, and the trailing `layoutTwo` could be
 * filled only by showing the routing platform a third time. The parent page
 * makes the same call for the same reason: the block stops rather than padding
 * the grid with work that belongs to another line.
 *
 * There is no `layoutThree` here, so no footer call-to-action either — the
 * header button is the only way out to the filtered work index. The query
 * string is part of the href, so the filter row on `/work/` picks it up on
 * mount.
 */
export const PROJECTS: BlockProjectsHighlightProps = {
  title: "Where this shipped",
  button: { title: "All Applied AI", href: "/work/?service=applied-ai" },
  layouts: [
    { variant: "four", left: DELIVERY_ROUTING_ROUTES, right: PACKSHIP },
    { variant: "five", project: DELIVERY_ROUTING_EXPORT },
  ],
};
