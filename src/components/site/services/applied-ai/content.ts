/**
 * Content for `/services/applied-ai/` — the parent Applied AI service page.
 *
 * Copy is drawn from the NeuraGul source site's `ai-consulting` service
 * (`pages/content.py`) and from the case studies that evidence it. Image paths
 * are the real screenshots under `/site/images`; `width`/`height` are the
 * assets' true pixel sizes, because `next/image` sets the reserved aspect ratio
 * from them.
 *
 * VOICE — the source is written in the first person singular because it was one
 * person. It is a team, so this page says "we". Nothing here claims a headcount,
 * a capacity or a team size, and the four child pages follow the same rule. See
 * `home/content.ts` for the full statement of it.
 *
 * ── Template note for the sibling service pages ─────────────────────────────
 * This file is the pattern the other service routes follow. Each export is
 * typed with the *shared block's own props interface*, so a sibling's content
 * file is structurally identical and the compiler catches a mis-shaped layout
 * (e.g. handing `layoutOne` three tiles) before the page ever renders.
 *
 * A sibling changes exactly these things:
 *   1. `META` — title and canonical.
 *   2. `HEADER.service` (drives the accent ground and the default type tone)
 *      and `HEADER.title` / `subtitle` / `image`. Only Applied AI has
 *      `subPages`; the other four omit the key entirely. Child pages swap
 *      `eyebrow` for `backLink`, drop `titleSize`, and mark one sub-page
 *      `current: true`.
 *   3. `INTRO.labels` / `statement` / `body`.
 *   4. `PROJECTS.title` + `button.title` and the `layouts` sequence.
 *   5. The four sibling service pages additionally pin a process block between
 *      `INTRO` and `PROJECTS`; this parent page has none, which is why it is a
 *      straight three-block stack with nothing pinned and no scroll spacer to
 *      account for.
 */
import type {
  BlockHeaderServicesProps,
  ServiceSubPageLink,
} from "@/components/site/shared/blocks/BlockHeaderServices";
import type { BlockIntroDoubleProps } from "@/components/site/shared/blocks/BlockIntroDouble";
import type { BlockProjectsHighlightProps } from "@/components/site/shared/blocks/BlockProjectsHighlight";
import type { ProjectCard } from "@/types/site";

const IMG = "/site/images";

export const META = {
  title: "Applied AI",
  canonical: "/services/applied-ai/",
  description:
    "Models and agents wired into a workflow you already have, scoped to one problem you can measure.",
} as const;

/**
 * The four child pages, in the order the source lists the deliverables they
 * are drawn from.
 *
 * Exported separately because all four sub-service pages render this same list
 * as their sibling nav, with one entry flagged `current: true`.
 */
export const APPLIED_AI_SUB_PAGES: ServiceSubPageLink[] = [
  { title: "AI Strategy", href: "/services/applied-ai/strategy/" },
  { title: "Custom Models", href: "/services/applied-ai/models/" },
  { title: "Retrieval & Agents", href: "/services/applied-ai/agents/" },
  { title: "Evaluation & Guardrails", href: "/services/applied-ai/evaluation/" },
];

/**
 * Parent-service header: an eyebrow (not a back link), a `font-3XL` title, and
 * the child grid that only Applied AI has.
 *
 * `service: "applied-ai"` selects the `--ng-applied-ai` (#625653) ground,
 * which the block's tone table pairs with white type. `titleSize` is passed
 * explicitly even though `3XL` is the no-`backLink` default, because the 75px
 * vs 56px step is the single clearest difference between a parent page and a
 * child page and is worth stating at the call site.
 */
export const HEADER: BlockHeaderServicesProps = {
  service: "applied-ai",
  eyebrow: "What we build",
  subtitle: "AI, applied",
  title: "Applied AI",
  titleSize: "3XL",
  subPages: APPLIED_AI_SUB_PAGES,
  image: {
    src: `${IMG}/delivery-routing.jpg`,
    alt: "",
    width: 1200,
    height: 750,
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
  labels: ["AI, applied"],
  statement:
    "Models and agents wired into a workflow you already have, scoped to one problem you can measure.",
  body: [
    "The first thing you get from us is a straight answer about where AI helps you and where it would be theatre. That answer is free and it is sometimes no. When it is yes, the work goes inside the tools your team already opens every day rather than beside them, because a system nobody opens is a system nobody uses.",
    "What that looks like in practice: a model on a phone that sizes a parcel from one photograph to about a centimetre. A solver that takes a messy delivery log, applies every business rule a dispatcher used to carry in their head, and returns routes a driver can actually drive. Both of those are running in production, and both of them are aimed at one number somebody was already tracking.",
    "Evaluations and guardrails ship with the system, not after it. The routing platform fails closed on a geocode it cannot trust and flags the row for a human instead of inventing an address, and 1,278 tests cover the rules. That is the part that decides whether the thing survives contact with real users.",
  ],
};

/* ------------------------------------------------------------------ *
 * Highlighted projects
 * ------------------------------------------------------------------ *
 *
 * The two projects that carry the Applied AI tag, plus the data pipeline that
 * sits underneath that kind of work. `location` carries each project's
 * year-and-platform meta, which is the slot the layout reserves for a city.
 */

const DELIVERY_ROUTING: ProjectCard = {
  title: "Delivery routing platform",
  location: "2026 · Web app",
  href: "/work/delivery-routing/",
  image: {
    src: `${IMG}/delivery-routing-routes.jpg`,
    alt: "Delivery routing platform",
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
  size: "small",
};

const RWD_PIPELINE: ProjectCard = {
  title: "Real-World Data Pipeline",
  location: "Product · 0-to-1",
  href: "/work/rwd-pipeline/",
  image: {
    src: `${IMG}/rwd-pipeline.jpg`,
    alt: "Real-World Data Pipeline",
    width: 1200,
    height: 750,
  },
  size: "small",
};

/** Layout five's full-bleed tile — the wide review screen, not a grid tile. */
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
 * Three layouts, one → five → three. The footer button on layout three points
 * at the service-filtered work index; the query string is part of the href, so
 * the filter row on `/work/` picks it up on mount.
 *
 * Only two projects carry the Applied AI tag, so layout three is not repeated
 * here — the block stops at the full-bleed tile and its footer rather than
 * padding the grid with work that belongs to another line.
 */
export const PROJECTS: BlockProjectsHighlightProps = {
  title: "Where this shipped",
  button: { title: "All Applied AI", href: "/work/?service=applied-ai" },
  layouts: [
    {
      variant: "one",
      large: DELIVERY_ROUTING,
      small: [PACKSHIP, RWD_PIPELINE],
    },
    { variant: "five", project: DELIVERY_ROUTING_REVIEW },
  ],
};
