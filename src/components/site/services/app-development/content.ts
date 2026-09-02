/**
 * Content for `/services/app-development/` — the App Development service page.
 *
 * Copy is drawn from the NeuraGul source site's `web-mobile` service
 * (`pages/content.py`), taking its **mobile** half, plus the one case study
 * that evidences it: PackShip, live on the App Store. The voice is the
 * source's own first person.
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
 *
 * ── One project, and that is the whole inventory ────────────────────────────
 * PackShip is the only shipped mobile app, so this page runs a single
 * `layoutFive` tile instead of padding the grid with web work. Every phase of
 * the process slider also reuses `packship.jpg`, because it is the only mobile
 * screenshot that exists. Reuse is deliberate here, not an oversight.
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
 * "%s — NeuraGul" template supplies the suffix. `description` is the mobile
 * half of the `web-mobile` promise line, carrying that service's own
 * "Native-quality mobile apps for iOS and Android" deliverable.
 */
export const META = {
  title: "App Development",
  canonical: "/services/app-development/",
  description:
    "Native-quality mobile apps for iOS and Android, built to stay maintainable long after I hand them over.",
} as const;

/**
 * Parent-service header: an eyebrow (not a back link), a `font-3XL` title, and
 * **no** `subPages` key, because this line has no child pages.
 *
 * `service: "app-development"` selects the `--ng-app-development` (#c9d3df)
 * ground. That is one of the two *light* accents, so the block's own tone table
 * pairs it with #262626 type — which is why `tone` is not passed here. Passing
 * it would duplicate a contrast fact that belongs in one place.
 *
 * `titleSize` is stated explicitly even though `3XL` is the no-`backLink`
 * default, because the 75px vs 56px step is the single clearest difference
 * between a parent page and a child page.
 */
export const HEADER: BlockHeaderServicesProps = {
  service: "app-development",
  eyebrow: "What I build",
  subtitle: "Native-quality mobile apps",
  title: "App Development",
  titleSize: "3XL",
  image: {
    src: `${IMG}/packship.jpg`,
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
  labels: ["Native-quality mobile apps"],
  statement:
    "Native-quality mobile apps for iOS and Android, built to stay maintainable long after I hand them over.",
  body: [
    "PackShip is the one that is live on the App Store. Shipping a parcel means guessing three things at once: which box, what it will cost, which carrier. The app answers all three from a single photograph.",
    "A model running on the phone estimates an item's dimensions from that photograph, with no LiDAR involved. Typical error lands around a centimetre, which is less than the padding most people were going to stuff in anyway. A live Three.js scene then fits your items into candidate boxes while you watch, inside React Native. Rotate it. Swap the box. See exactly how much empty air you were about to pay to ship across the country.",
    "Behind that, UPS, FedEx and USPS rates sit side by side and re-quote themselves every time the box changes. Postgres and Redis keep the lookups fast enough to feel instant, so the cheapest safe option surfaces while you are still holding the parcel. A multi-step, error-prone chore became one photo and a tap.",
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
 * The four phases are the mobile half of the source's "What you get" list on
 * `/services/web-mobile/`, each carrying PackShip's own feature copy as its
 * evidence. `intro` is that service's `who_for` line, verbatim.
 *
 * `href` is omitted on every phase, so each card renders as a `<div>`: the
 * source's service pages do not link their deliverables anywhere.
 *
 * `dark` is `false` on all four rather than left to the block's
 * `index % 2 === 0` default. Mean luminance of the top 23.8% of `packship.jpg`
 * (the band the number and caption sit over, given the card's 95px header on a
 * 399px `object-top` crop) is 24 — near-black. The default alternation would
 * paint #262626 type onto that on slides 01 and 03, which is unreadable.
 */
export const PROCESS: BlockProcessCardSliderProps = {
  tagline: "Deliverables",
  intro: "You need a site or an app that performs, and that still works a year from now.",
  title: "What you get",
  phasesLabel: "Deliverables",
  phases: [
    {
      number: "01",
      dark: false,
      title: "One photo, measured",
      caption: "On-device model",
      text: "A model running on the phone estimates an item's dimensions from a single photograph. No LiDAR needed. Typical error lands around a centimetre, which is less than the padding most people were going to stuff in anyway.",
      image: { src: `${IMG}/packship.jpg`, width: 1200, height: 750 },
    },
    {
      number: "02",
      dark: false,
      title: "Watch it pack itself",
      caption: "Three.js in React Native",
      text: "A live 3D scene fits your items into candidate boxes while you watch. Rotate it. Swap the box. See exactly how much empty air you were about to pay to ship across the country.",
      image: { src: `${IMG}/packship.jpg`, width: 1200, height: 750 },
    },
    {
      number: "03",
      dark: false,
      title: "Three carriers, racing",
      caption: "Carrier APIs on Redis",
      text: "UPS, FedEx, and USPS rates sit side by side and re-quote themselves every time the box changes. The cheapest safe option wins, usually by a wider margin than people expect.",
      image: { src: `${IMG}/packship.jpg`, width: 1200, height: 750 },
    },
    {
      number: "04",
      dark: false,
      title: "Shipped to the store",
      caption: "Live on iOS",
      text: "PackShip is live on the App Store as a consumer product. React Native on the front, Postgres and Redis behind it, and one codebase that can carry Android when the app calls for it.",
      image: { src: `${IMG}/packship.jpg`, width: 1200, height: 750 },
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

/** First instance — the mobile capabilities, all of them evidenced by PackShip. */
export const WYSIWYG_CAPABILITIES: BlockWysiwygProps = {
  tagline: "iOS and Android",
  title: "What I build on mobile",
  body: [
    {
      type: "paragraph",
      lead: "Native-quality apps:",
      text: "React Native and TypeScript, so one codebase reaches both stores without feeling like a website in a wrapper.",
    },
    {
      type: "paragraph",
      lead: "On-device models:",
      text: "PackShip sizes an item from one photograph to about a centimetre, with the model running on the phone and no LiDAR involved.",
    },
    {
      type: "paragraph",
      lead: "Real-time 3D:",
      text: "A live Three.js packing view running inside React Native, rotatable while the app fits your items into candidate boxes.",
    },
    {
      type: "paragraph",
      lead: "Third-party integrations:",
      text: "UPS, FedEx and USPS rates racing each other on screen, with Postgres and Redis behind them so a re-quote comes back fast enough to feel instant.",
    },
    {
      type: "paragraph",
      lead: "Something people can download:",
      text: "PackShip is live on the App Store as a consumer product, not a demo build passed around on TestFlight.",
    },
  ],
};

/**
 * Second instance — the source's four-step engagement, verbatim from
 * `PROCESS` in `pages/content.py`. Four steps, because every AI-written process
 * has three.
 */
export const WYSIWYG_HOW: BlockWysiwygProps = {
  tagline: "Four steps, start to handover",
  title: "How the work runs",
  body: [
    {
      type: "paragraph",
      lead: "You write, we talk:",
      text: "Half an hour on a call. You describe what's broken and how much it's costing you. I ask a lot of questions. If I don't think I can help, I'll tell you then and try to point you at someone who can.",
    },
    {
      type: "paragraph",
      lead: "I scope it in writing:",
      text: "You get a written scope, a fixed price, and a date. If I've misunderstood something, we find out here, while it's still only a document.",
    },
    {
      type: "paragraph",
      lead: "We build in the open:",
      text: "Working software lands in the first couple of weeks, then every week after that. You can redirect me while redirecting me is still cheap.",
    },
    {
      type: "paragraph",
      lead: "I stay on after launch:",
      text: "I hold the pager, fix what breaks, and hand over once your team wants it. Most of my clients have my mobile number.",
    },
  ],
};

/* ------------------------------------------------------------------ *
 * Highlighted projects — one full-bleed tile
 * ------------------------------------------------------------------ *
 *
 * PackShip is the only project carrying the App Development tag, so the block
 * is a single `layoutFive`: one full-bleed image whose caption card overlays
 * its top-left corner from 768 up. The alternative layouts all want two or
 * three tiles, and there is no second mobile app to put in them — padding the
 * grid with web work would be a claim this page cannot support.
 *
 * `layoutFive` keeps the image's intrinsic ratio (`h-auto w-full`), so the
 * 1200×750 screenshot renders roughly 837px tall across the 1340px column
 * band, comfortably under the layout's 1000px cap.
 *
 * `location` carries the project's year-and-platform meta, which is the slot
 * the layout reserves for a city.
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
  size: "large",
};

/**
 * The header button points at the service-filtered work index; the query string
 * is part of the href, so the filter row on `/work/` picks it up on mount. It
 * is the only route out of this block — `layoutThree` is the sole variant with
 * a footer call-to-action, and this page does not have the tiles to fill one.
 */
export const PROJECTS: BlockProjectsHighlightProps = {
  title: "Where this shipped",
  button: { title: "All App Development", href: "/work/?service=app-development" },
  layouts: [{ variant: "five", project: PACKSHIP }],
};
