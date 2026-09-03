/**
 * Content for `/services/applied-ai/evaluation/` — a *child* of Applied AI.
 *
 * The page is the fourth `deliverables` bullet of the source site's
 * `ai-consulting` service: "Evaluations and guardrails, so the system holds up
 * once real users touch it." The evidence is the two builds in
 * `pages/content.py` that describe their own guardrails: the routing platform
 * (fail-closed geocoding, a per-solve travel-matrix budget, 1,278 tests) and
 * foodtruckrentals (119 Vitest tests, one of which fails the build when two
 * pages compete for a keyword cluster, and JSON-LD generated from a single
 * pricing module).
 *
 * VOICE — the source is written in the first person singular because it was one
 * person. It is a team, so this page says "we", and it claims no headcount,
 * capacity or team size. See `home/content.ts` for the full statement of it.
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
  title: "Evaluation & Guardrails",
  canonical: "/services/applied-ai/evaluation/",
  description:
    "Evaluations and guardrails, so the system holds up once real users touch it.",
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
 *
 * The artwork is the routing platform's review screen: the sheet with one
 * ticket held back for a human. That is a guardrail, photographed.
 */
export const HEADER: BlockHeaderServicesProps = {
  service: "applied-ai",
  backLink: { label: "Applied AI", href: "/services/applied-ai/" },
  subtitle: "What holds when real users touch it",
  title: "Evaluation & Guardrails",
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
  labels: ["What holds when real users touch it"],
  statement:
    "Evaluations and guardrails, so the system holds up once real users touch it.",
  body: [
    "Guardrails ship with the system. They are the part that decides whether the thing survives contact with a real Tuesday, and they are cheapest to build while the code is still being written.",
    "On the routing platform that means three things you can check. Geocoding fails closed, so a location the app cannot trust becomes a flagged task for a human. A per-solve travel-matrix budget makes a runaway maps bill structurally impossible. And 1,278 tests cover the business rules, which is what lets a dispatcher trust a sheet they did not plan themselves.",
    "The same discipline applies well outside models. The food-truck site carries 119 Vitest tests guarding its URL structure, including one that fails the build outright if two pages start competing for the same keyword cluster. Its JSON-LD Service, FAQ, and LocalBusiness data is generated from a single pricing module, so a published price can never drift away from the page it sits on.",
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
 * are this page's own — each one names a guardrail that exists in a shipped
 * build. Phase 05 is the engagement's last step, quoted as written, and it
 * belongs on this page more than any other: an evaluation written the week
 * before launch only describes the week before launch.
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
  intro: "How a system gets ready for real users",
  title: "How we work",
  phasesLabel: "Phases",
  phases: [
    {
      number: "01",
      title: "Write down what must never happen",
      caption: "The failure list first",
      text: "Before any guardrail there is a list. The address that must never reach a driver. The price that must never disagree with the page it sits on. The box that must never be too small for the thing going in it. Everything after this is that list made mechanical.",
      image: {
        src: `${IMG}/delivery-routing.jpg`,
        width: 1200,
        height: 750,
      },
    },
    {
      number: "02",
      title: "Fail closed",
      caption: "Geocoding that refuses",
      text: "The routing platform's geocoding fails closed. A location it cannot trust becomes a flagged task for a human. The review screen shows what that looks like on an ordinary morning: 47 tickets on the sheet, one of them held back.",
      image: {
        src: `${IMG}/delivery-routing-review.jpg`,
        width: 1600,
        height: 1000,
      },
    },
    {
      number: "03",
      title: "Tests that block the build",
      caption: "1,278 and 119",
      text: "1,278 tests cover the routing rules. The food-truck site carries 119 Vitest tests, one of which fails the build outright when two pages start competing for the same keyword cluster. A guardrail nobody can merge past is the only kind that holds.",
      image: {
        src: `${IMG}/foodtruckrentals-work.jpg`,
        width: 1600,
        height: 1000,
      },
    },
    {
      number: "04",
      title: "Put the budget in the structure",
      caption: "A bill that cannot run away",
      text: "A per-solve travel-matrix budget makes a runaway maps bill structurally impossible. On the food-truck site, JSON-LD generated from a single pricing module means a published price can never drift away from the page it sits on. Limits belong in the code, well upstream of a runbook nobody reads.",
      image: {
        src: `${IMG}/foodtruckrentals-home.jpg`,
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
 * Four guardrails that exist in production, each named and checkable. The bold
 * lead-in plus a `<br>` is the shape `WysiwygParagraphNode` exists for.
 */
export const WYSIWYG_GUARDRAILS: BlockWysiwygProps = {
  tagline: "Guardrails",
  title: "Four that are running now",
  body: [
    {
      type: "paragraph",
      lead: "Fail closed:",
      text: "The routing platform refuses to invent anything it cannot read with confidence. An unreadable row and an untrustworthy geocode both become the same thing, which is a flagged task for a person rather than an address a van would have driven to.",
    },
    {
      type: "paragraph",
      lead: "Budgets in the structure:",
      text: "A per-solve travel-matrix budget makes a runaway maps bill structurally impossible. The limit is part of the solver, so nobody has to remember it at 6am.",
    },
    {
      type: "paragraph",
      lead: "Tests that block the merge:",
      text: "1,278 tests cover the routing rules. On the food-truck site, 119 Vitest tests guard the URL structure, including one that fails the build outright if two pages start competing for the same keyword cluster.",
    },
    {
      type: "paragraph",
      lead: "One source for a published number:",
      text: "Every commercial page on that site carries JSON-LD Service, FAQ, and LocalBusiness data generated from a single pricing module, so a published price can never drift away from the page it sits on.",
    },
  ],
};

/**
 * Why the guardrails and the after-launch commitment are the same subject.
 *
 * The source's fit statement ("one person who holds the whole system in their
 * head", "the wrong fit if you need a team of eight starting Monday") is gone
 * rather than inverted: both halves are claims about size, and no size has been
 * established. The closing paragraph keeps only what is checkable — the people
 * who scope the work write it, and they are still reachable after launch.
 */
export const WYSIWYG_AFTER_LAUNCH: BlockWysiwygProps = {
  tagline: "After launch",
  title: "We hold the pager",
  body: [
    {
      type: "paragraph",
      text: "We stay on after launch. We fix what breaks and hand over once your team wants it. The same people are still reachable six months after launch.",
    },
    { type: "heading", text: "Why that belongs on this page" },
    {
      type: "paragraph",
      text: "An evaluation written the week before launch describes the week before launch. The ones that matter are still running six months later, when the data has drifted and somebody has pasted something nobody anticipated into a field. Being reachable is part of the guardrail.",
    },
    { type: "heading", text: "Who this is for" },
    {
      type: "paragraph",
      text: "You want a system that still behaves the way you agreed it would once real users are inside it. The people who scope your project are the people who write it, and they are still reachable six months after launch.",
    },
  ],
};

/* ------------------------------------------------------------------ *
 * Highlighted projects — three tiles in layout two
 * ------------------------------------------------------------------ *
 *
 * `location` carries each project's year-and-platform meta, which is the slot
 * the layout reserves for a city. There is no city to print under a project
 * name on this site.
 */

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
  size: "small",
};

/**
 * Tagged Web Development and Data Intelligence rather than Applied AI, so it
 * does not appear behind the header's filter. It is here because its 119 tests
 * are half of what this page is arguing, and a guardrail is a guardrail whether
 * or not a model sits behind it.
 */
const FOODTRUCKRENTALS: ProjectCard = {
  title: "Food Truck Rentals",
  location: "2026 · Web",
  href: "/work/foodtruckrentals/",
  image: {
    src: `${IMG}/foodtruckrentals-work.jpg`,
    alt: "The work index: every activation, with the client, the borough, and the year",
    width: 1600,
    height: 1000,
  },
  size: "small",
};

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

/**
 * `layoutTwo` is the mirrored variant: the two small tiles come first in the
 * DOM and the hero sits on the right. The review screen takes the hero because
 * it is the one image on the site of a guardrail doing its job.
 *
 * There is no `layoutThree` on this route, so no footer call-to-action either —
 * the header button is the only way out to the filtered work index. The query
 * string is part of the href, so the filter row on `/work/` picks it up on
 * mount.
 */
export const PROJECTS: BlockProjectsHighlightProps = {
  title: "Where this shipped",
  button: { title: "All Applied AI", href: "/work/?service=applied-ai" },
  layouts: [
    {
      variant: "two",
      small: [PACKSHIP, FOODTRUCKRENTALS],
      large: DELIVERY_ROUTING_REVIEW,
    },
  ],
};
