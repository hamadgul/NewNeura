/**
 * Content for `/services/applied-ai/models/` — a *child* of Applied AI.
 *
 * The page is the second `deliverables` bullet of the source site's
 * `ai-consulting` service: "Custom models and integrations that live inside the
 * tools your team already opens every day." The evidence is PackShip, whose
 * three `features` entries in `pages/content.py` are quoted here almost whole,
 * plus the four-step engagement from that file's `PROCESS`.
 *
 * Image paths are the real screenshots under `/site/images`; `width`/`height`
 * are the assets' true pixel sizes, because `next/image` sets the reserved
 * aspect ratio from them. Every asset is a landscape 1.6:1 capture; both slots
 * that use one crop with `object-cover`, so the shape mismatch is invisible.
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
  title: "Custom Models",
  canonical: "/services/applied-ai/models/",
  description:
    "Custom models and integrations that live inside the tools your team already opens every day.",
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
  subtitle: "A model inside the app you already opened",
  title: "Custom Models",
  subPages: SUB_PAGES,
  image: {
    src: `${IMG}/packship.jpg`,
    // Decorative: the caption that explains this screen lives on the project page.
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
  labels: ["A model inside the app you already opened"],
  statement:
    "Custom models and integrations that live inside the tools your team already opens every day.",
  body: [
    "A model on its own is a demo. What makes it useful is where it sits. PackShip's sizing model runs on the phone that was going to take the photograph anyway, so nobody has to open a second app, upload anything, or wait on a round trip to a server.",
    "It estimates an item's dimensions from a single photograph, with no LiDAR. Typical error lands around a centimetre, which is less than the padding most people were going to stuff in the box anyway. From there a live 3D scene fits the item into candidate boxes while you watch, and UPS, FedEx, and USPS rates re-quote themselves every time the box changes.",
    "The integration work is the unglamorous half and it is most of the job. React Native on the front, Postgres and Redis behind it so the rate lookups come back fast enough to feel instant, and a stack your team can hire for. The code is clean and documented, and it is yours to take over whenever you want it.",
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
 * Five phases, because the carousel is measured for five cards. Phases 01–03
 * are this page's own — they are PackShip's three `features` entries, which are
 * literally the three layers of a model shipped inside an app. Phases 04 and 05
 * are the source's engagement steps, quoted as written.
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
  intro: "How a custom model ends up in daily use",
  title: "How I work",
  phasesLabel: "Phases",
  phases: [
    {
      number: "01",
      title: "Find the screen they already look at",
      caption: "No second app",
      text: "Before any model, I find the tool your team already opens. PackShip's whole job happens inside the camera flow somebody was going to use regardless. A model that needs a new habit around it is a model that gets used twice.",
      image: {
        src: `${IMG}/packship.jpg`,
        width: 1200,
        height: 750,
      },
    },
    {
      number: "02",
      title: "One photo, measured",
      caption: "On-device model",
      text: "A model running on the phone estimates an item's dimensions from a single photograph. No LiDAR needed. Typical error lands around a centimetre, which is less than the padding most people were going to stuff in anyway.",
      image: {
        src: `${IMG}/packship.jpg`,
        width: 1200,
        height: 750,
      },
    },
    {
      number: "03",
      title: "Three carriers, racing",
      caption: "Carrier APIs on Redis",
      text: "UPS, FedEx, and USPS rates sit side by side and re-quote themselves every time the box changes. The cheapest safe option wins, usually by a wider margin than people expect.",
      image: {
        src: `${IMG}/delivery-routing-export.jpg`,
        width: 1600,
        height: 1000,
      },
    },
    {
      number: "04",
      title: "I scope it in writing",
      caption: "Fixed price, and a date",
      text: "You get a written scope, a fixed price, and a date. If I've misunderstood something, we find out here, while it's still only a document.",
      image: {
        src: `${IMG}/rwd-pipeline.jpg`,
        width: 1200,
        height: 750,
      },
    },
    {
      number: "05",
      title: "I stay on after launch",
      caption: "I hold the pager",
      text: "I hold the pager, fix what breaks, and hand over once your team wants it. Most of my clients have my mobile number.",
      image: {
        src: `${IMG}/delivery-routing-routes.jpg`,
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
 * PackShip's three `features` entries from `content.py`, each under its own
 * label as a bold lead-in. This is the whole argument of the page in three
 * paragraphs: a model, a thing to look at, and the systems behind both.
 */
export const WYSIWYG_HOW_IT_FITS: BlockWysiwygProps = {
  tagline: "Worked example",
  title: "PackShip, layer by layer",
  body: [
    {
      type: "paragraph",
      lead: "On-device model:",
      text: "A model running on the phone estimates an item's dimensions from a single photograph. No LiDAR needed. Typical error lands around a centimetre, which is less than the padding most people were going to stuff in anyway.",
    },
    {
      type: "paragraph",
      lead: "Three.js in React Native:",
      text: "A live 3D scene fits your items into candidate boxes while you watch. Rotate it. Swap the box. See exactly how much empty air you were about to pay to ship across the country.",
    },
    {
      type: "paragraph",
      lead: "Carrier APIs on Redis:",
      text: "UPS, FedEx, and USPS rates sit side by side and re-quote themselves every time the box changes. The cheapest safe option wins, usually by a wider margin than people expect.",
    },
    {
      type: "paragraph",
      lead: "Where it ended up:",
      text: "Live on the App Store as a consumer product. A multi-step, error-prone chore became one photo and a tap.",
    },
  ],
};

/**
 * Who the page is for, and what the integration half of the work commits to.
 * The `who_for` line and the custom-software deliverables are quoted from
 * `content.py`.
 */
export const WYSIWYG_WHAT_YOU_GET: BlockWysiwygProps = {
  tagline: "Who this is for",
  title: "Shaped around how you already work",
  body: [
    {
      type: "paragraph",
      text: "You're sitting on data or a manual process, and you want a working result you can point at.",
    },
    { type: "heading", text: "What integration means here" },
    {
      type: "paragraph",
      text: "Software shaped around how your business already works, built to survive the next three years of it. Discovery maps the real problem before I write any code. What comes out is clean, documented code your team can take over whenever they want it, and support after launch for as long as you need me.",
    },
    { type: "heading", text: "The stack, so you can hire for it" },
    {
      type: "paragraph",
      text: "React Native and TypeScript on the phone. Postgres and Redis behind it. Python, FastAPI, and OR-Tools where the maths lives, React and TypeScript where somebody has to look at the result. Nothing exotic, because you will be hiring against it after I hand over.",
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

/**
 * `layoutTwo` is the mirrored variant: the two small tiles come first in the
 * DOM and the hero sits on the right. PackShip takes the hero because it is the
 * project this page is about.
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
      small: [DELIVERY_ROUTING, RWD_PIPELINE],
      large: PACKSHIP,
    },
  ],
};
