/**
 * Content for `/services/data-intelligence/` — the Data Intelligence service
 * page.
 *
 * Copy is drawn from the NeuraGul source site's `data-intelligence` service
 * (`pages/content.py`) and from the three case studies that evidence it: the
 * Freenome 0-to-1 ETL pipeline, the delivery routing platform's log parsing and
 * exports, and the generated structured data behind Food Truck Rentals. The
 * voice is the source's own first person.
 *
 * Image paths are the real screenshots under `/site/images`; `width`/`height`
 * are the assets' true pixel sizes, because `next/image` sets the reserved
 * aspect ratio from them.
 *
 * ── How this differs from the `applied-ai` template ─────────────────────────
 * `services/applied-ai/content.ts` is the pattern every service module follows:
 * each export is typed with the *shared block's own props interface*, so a
 * mis-shaped layout is a compile error rather than a rendering surprise. What
 * this file adds on top of it:
 *
 *   1. No `subPages` key at all — Applied AI is the only line with children,
 *      and the sub-nav must disappear rather than reserve space.
 *   2. A `PROCESS` block pinned between the intro and the rich text.
 *   3. Two `BlockWysiwyg` instances.
 *
 * The process-slider and rich-text constants live here rather than in a shared
 * presets module: this file is a plain module with no `"use client"`, so its
 * values survive the server/client boundary intact. Importing a *value* from a
 * `"use client"` block module would hand the server component a client
 * reference proxy and kill the page at prerender.
 */
import type { BlockHeaderServicesProps } from "@/components/site/shared/blocks/BlockHeaderServices";
import type { BlockIntroDoubleProps } from "@/components/site/shared/blocks/BlockIntroDouble";
import type { BlockProcessCardSliderProps } from "@/components/site/shared/blocks/BlockProcessCardSlider";
import type { BlockProjectsHighlightProps } from "@/components/site/shared/blocks/BlockProjectsHighlight";
import type { BlockWysiwygProps } from "@/components/site/shared/blocks/BlockWysiwyg";
import type { ProjectCard } from "@/types/site";

const IMG = "/site/images";

/**
 * Route metadata. `title` is plain (not absolute) so the root layout's
 * "%s — NeuraGul" template supplies the suffix. `description` is the
 * `data-intelligence` service's promise line, verbatim.
 */
export const META = {
  title: "Data Intelligence",
  canonical: "/services/data-intelligence/",
  description:
    "Pipelines, dashboards, and migrations that turn a pile of data into a decision.",
} as const;

/**
 * Parent-service header: an eyebrow (not a back link), a `font-3XL` title, and
 * **no** `subPages` key, because this line has no child pages.
 *
 * `service: "data-intelligence"` selects the `--ng-data-intelligence` (#e3c1aa)
 * ground. That is one of the two *light* accents, so the block's own tone table
 * pairs it with #262626 type — which is why `tone` is not passed here. Passing
 * it would duplicate a contrast fact that belongs in one place.
 *
 * `titleSize` is stated explicitly even though `3XL` is the no-`backLink`
 * default, because the 75px vs 56px step is the single clearest difference
 * between a parent page and a child page.
 */
export const HEADER: BlockHeaderServicesProps = {
  service: "data-intelligence",
  eyebrow: "What I build",
  subtitle: "Data, turned into a decision",
  title: "Data Intelligence",
  titleSize: "3XL",
  image: {
    src: `${IMG}/rwd-pipeline.jpg`,
    alt: "",
    width: 1200,
    height: 750,
  },
};

/**
 * One static caption (not the two-tab variant) plus three body paragraphs.
 *
 * Split into three strings rather than one so the block's `[&>p+p]:mt-[21.6px]`
 * rhythm reproduces the paragraph breaks instead of collapsing them to a single
 * run.
 */
export const INTRO: BlockIntroDoubleProps = {
  labels: ["Data, turned into a decision"],
  statement:
    "Pipelines, dashboards, and migrations that turn a pile of data into a decision.",
  body: [
    "Before this I was a product manager at Freenome, leading a 0-to-1 ETL pipeline that pulled messy real-world clinical data from dozens of sources into a single Common Data Model. Early cancer detection research was built on that foundation, and the pipeline went from concept to production.",
    "The same discipline shows up at a much smaller scale. The delivery routing platform parses a messy delivery log and refuses to invent anything it cannot read with confidence; an unreadable row becomes a flagged task for a human rather than a quietly wrong address on a driver's sheet. Geocoding fails closed for the same reason. 1,278 tests cover the rules.",
    "What comes out the other end is whatever the office actually opens. On that project it is a printed cut sheet designed for a clipboard and a pen, plus an Excel and CSV log. Dashboards your team will open more than once, and reporting that answers the question you actually asked.",
  ],
};

/* ------------------------------------------------------------------ *
 * The pinned process slider
 * ------------------------------------------------------------------ *
 *
 * `pinDistance` is left at the component's measured default (2445px
 * pin-spacer − 1140px block = 1305px of travel), which is what every page
 * carrying this block uses.
 *
 * The four phases are the four `deliverables` bullets the source lists under
 * "What you get" on `/services/data-intelligence/`, each carrying the evidence
 * for it. `intro` is that service's `who_for` line, verbatim.
 *
 * `href` is omitted on every phase, so each card renders as a `<div>`: the
 * source's service pages do not link their deliverables anywhere.
 *
 * `dark` is set explicitly on all four rather than left to the block's
 * `index % 2 === 0` default, because the flag tracks *artwork lightness* and
 * these are screenshots. Mean luminance of the top 23.8% of each file (the band
 * the number and caption sit over, given the card's 95px header on a 399px
 * `object-top` crop) runs 12 / 250 / 248 / 250 — one near-black photograph and
 * three near-white product UIs. The default alternation would put #262626 type
 * on the black one and white type on a white one.
 */
export const PROCESS: BlockProcessCardSliderProps = {
  tagline: "Deliverables",
  intro: "You're sitting on data that nobody has been able to turn into an answer.",
  title: "What you get",
  phasesLabel: "Deliverables",
  phases: [
    {
      number: "01",
      dark: false,
      title: "One clean model",
      caption: "Scattered sources, consolidated",
      text: "Pipelines that consolidate scattered sources into one clean model. At Freenome that meant messy real-world clinical data from dozens of sources standardized into a single Common Data Model.",
      image: { src: `${IMG}/rwd-pipeline.jpg`, width: 1200, height: 750 },
    },
    {
      number: "02",
      dark: true,
      title: "Dashboards worth opening",
      caption: "Opened more than once",
      text: "Dashboards your team will open more than once. The routing platform's review screen puts 47 tickets on one sheet and flags the single row a human has to look at.",
      image: {
        src: `${IMG}/delivery-routing-review.jpg`,
        width: 1600,
        height: 1000,
      },
    },
    {
      number: "03",
      dark: true,
      title: "Migrations without losing history",
      caption: "History intact",
      text: "Migrations handled without losing history, because the answer you want next year depends on the rows somebody kept this year.",
      image: {
        src: `${IMG}/delivery-routing-routes.jpg`,
        width: 1600,
        height: 1000,
      },
    },
    {
      number: "04",
      dark: true,
      title: "Reporting the office can use",
      caption: "Excel, CSV, print",
      text: "Reporting that answers the question you actually asked. On the routing platform that is a printable driver cut sheet for the van, and an Excel and CSV log for the office.",
      image: {
        src: `${IMG}/delivery-routing-export.jpg`,
        width: 1600,
        height: 1000,
      },
    },
  ],
};

/* ------------------------------------------------------------------ *
 * Rich text — two instances
 * ------------------------------------------------------------------ *
 *
 * Both use the `<p><strong>lead</strong><br>text</p>` shape: one paragraph per
 * item, a bold lead-in, a break, then the descriptive line. That is why `lead`
 * and `text` are separate fields rather than one concatenated string — the
 * block emits the `<br>` itself, and only when a `lead` is actually followed by
 * `text`.
 */

/** First instance — the data work that exists, and what evidences each piece. */
export const WYSIWYG_CAPABILITIES: BlockWysiwygProps = {
  tagline: "Pipelines, and what they feed",
  title: "What I build with data",
  body: [
    {
      type: "paragraph",
      lead: "ETL pipelines:",
      text: "A 0-to-1 pipeline at Freenome that standardized real-world clinical data from dozens of sources into one Common Data Model, taken from concept to production.",
    },
    {
      type: "paragraph",
      lead: "Parsing that fails closed:",
      text: "The routing platform refuses to invent anything it cannot read with confidence. An unreadable row becomes a flagged task for a human.",
    },
    {
      type: "paragraph",
      lead: "Rules engines:",
      text: "Per-driver caps, town bans, delivery windows, driver and vehicle eligibility. Every rule a dispatcher used to carry in their head, with 1,278 tests covering them.",
    },
    {
      type: "paragraph",
      lead: "Exports and reporting:",
      text: "Printable driver cut sheets for the van, Excel and CSV for the office, and a solved route somebody can hand to a driver at seven in the morning.",
    },
    {
      type: "paragraph",
      lead: "Generated structured data:",
      text: "On Food Truck Rentals, JSON-LD Service, FAQ and LocalBusiness data generated from a single pricing module, so a published price can never drift away from the page it sits on.",
    },
  ],
};

/** Second instance — why the work survives contact with real, messy data. */
export const WYSIWYG_WHY: BlockWysiwygProps = {
  tagline: "How the work holds up",
  title: "Why it survives real data",
  body: [
    {
      type: "paragraph",
      lead: "It says what it does not know:",
      text: "A confidence threshold and a flagged human task beat a plausible guess. Geocoding fails closed rather than inventing an address.",
    },
    {
      type: "paragraph",
      lead: "The rules are tested:",
      text: "1,278 tests cover the routing rules, so changing one of them cannot quietly break another six weeks later.",
    },
    {
      type: "paragraph",
      lead: "Output lands where the work happens:",
      text: "A clipboard in a van, a spreadsheet in the office, a structured block on a web page. The format follows whoever has to act on it.",
    },
    {
      type: "paragraph",
      lead: "I stay on after launch:",
      text: "I hold the pager, fix what breaks, and hand over once your team wants it. Most of my clients have my mobile number.",
    },
  ],
};

/* ------------------------------------------------------------------ *
 * Highlighted projects — four tiles across layouts one / five
 * ------------------------------------------------------------------ *
 *
 * Four projects carry the Data Intelligence tag: `layoutOne` takes three, and
 * the fourth gets `layoutFive`'s full-bleed treatment rather than being dropped
 * or padded out to a six-tile `layoutOne` + `layoutThree` sequence. That longer
 * sequence would need two more tiles than there is true work to fill them with.
 *
 * The cost of that choice is `layoutThree`'s "View all" footer, which only that
 * variant carries; the header button is therefore the single route out to the
 * filtered work index on this page.
 *
 * `layoutFive` keeps the image's intrinsic ratio (`h-auto w-full`), so the
 * 1200×750 screenshot renders roughly 837px tall across the 1340px column band,
 * comfortably under the layout's 1000px cap.
 *
 * `location` carries each project's year-and-platform meta, which is the slot
 * the layout reserves for a city.
 */

const DELIVERY_ROUTING: ProjectCard = {
  title: "Delivery routing platform",
  location: "2026 · Web app",
  href: "/work/delivery-routing/",
  image: {
    src: `${IMG}/delivery-routing.jpg`,
    alt: "Delivery routing platform",
    width: 1200,
    height: 750,
  },
  size: "large",
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

const FOODTRUCKRENTALS: ProjectCard = {
  title: "Food Truck Rentals",
  location: "2026 · Web",
  href: "/work/foodtruckrentals/",
  image: {
    src: `${IMG}/foodtruckrentals.jpg`,
    alt: "Food Truck Rentals",
    width: 1200,
    height: 750,
  },
  size: "small",
};

/** The full-bleed tile — `layoutFive` takes one project and links the whole row. */
const LANDSCAPE_DRAINAGE_PROZ: ProjectCard = {
  title: "Landscape Drainage Proz",
  location: "2026 · Shopify",
  href: "/work/landscape-drainage-proz/",
  image: {
    src: `${IMG}/landscapedrainage.jpg`,
    alt: "Landscape Drainage Proz",
    width: 1200,
    height: 750,
  },
  size: "large",
};

/**
 * The header button points at the service-filtered work index; the query string
 * is part of the href, so the filter row on `/work/` picks it up on mount.
 */
export const PROJECTS: BlockProjectsHighlightProps = {
  title: "Where this shipped",
  button: { title: "All Data Intelligence", href: "/work/?service=data-intelligence" },
  layouts: [
    {
      variant: "one",
      large: DELIVERY_ROUTING,
      small: [RWD_PIPELINE, FOODTRUCKRENTALS],
    },
    { variant: "five", project: LANDSCAPE_DRAINAGE_PROZ },
  ],
};
