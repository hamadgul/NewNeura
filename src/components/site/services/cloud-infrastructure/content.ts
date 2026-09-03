/**
 * Content for `/services/cloud-infrastructure/` — the Cloud & Infrastructure
 * service page.
 *
 * Copy is drawn from **two** of the NeuraGul source site's services
 * (`pages/content.py`): `cloud`, which supplies the promise, the "What you get"
 * deliverables and the `who_for` line, and `it-infrastructure`, which has no
 * page of its own in this port and so folds in here — networks, firewalls,
 * hardening, patching, monitoring and documentation. The evidence comes from
 * the delivery routing platform on Fly.io, the Vintus storefront and the
 * restaurant ordering portal on Square.
 *
 * VOICE — the source is written in the first person singular, because it was
 * written by one person. NeuraGul is a team, so this page says "we". Hamad Gul
 * is named only at the human moments (the contact promise, the About page, the
 * homepage intro), and this is a capability page, so he is not named here.
 * Nothing on this page claims a headcount or a capacity.
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
 *   3. Two `BlockWysiwyg` instances: the first is this line's own capabilities,
 *      the second is the folded-in IT & security service.
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
 * "%s — NeuraGul" template supplies the suffix. `description` is the `cloud`
 * service's promise line, verbatim.
 */
export const META = {
  title: "Cloud & Infrastructure",
  canonical: "/services/cloud-infrastructure/",
  description:
    "Infrastructure sized to your real load, with a bill that stays predictable.",
} as const;

/**
 * Parent-service header: an eyebrow (not a back link), a `font-3XL` title, and
 * **no** `subPages` key, because this line has no child pages.
 *
 * `service: "cloud-infrastructure"` selects the `--ng-cloud-infrastructure`
 * (#707569) ground, which the block's own tone table pairs with white type — so
 * `tone` is not passed. `titleSize` is stated explicitly even though `3XL` is
 * the no-`backLink` default, because the 75px vs 56px step is the single
 * clearest difference between a parent page and a child page.
 */
export const HEADER: BlockHeaderServicesProps = {
  service: "cloud-infrastructure",
  eyebrow: "What we build",
  subtitle: "Infrastructure sized to real load",
  title: "Cloud & Infrastructure",
  titleSize: "3XL",
  image: {
    // The restaurant ordering portal — one of the two projects tagged to this
    // line, and the one whose hosting story is the plainest.
    src: `${IMG}/pizzeria.jpg`,
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
 *
 * Paragraph two is where the folded-in `it-infrastructure` service lands: it
 * has no page of its own in this port, so its four deliverables run as prose
 * here and again as the second rich-text block below.
 */
export const INTRO: BlockIntroDoubleProps = {
  labels: ["Infrastructure sized to real load"],
  statement: "Infrastructure sized to your real load, with a bill that stays predictable.",
  body: [
    "Cost control is an architectural decision. The delivery routing platform runs on Fly.io with a per-solve travel-matrix budget, which is what makes a runaway maps bill structurally impossible rather than merely unlikely. Nobody has to remember to check it.",
    "Under that sit the unglamorous parts that keep the doors open: networks, servers and firewalls set up properly the first time, security hardening and patch management on a schedule, monitoring that surfaces a problem before your customers find it, and documentation your team can actually follow.",
    "The Vintus storefront carries a national wine importer's catalog, with inventory management, order processing and customer-relationship tooling behind it. WordPress and PHP on the surface, Python services doing the work underneath. The restaurant ordering portal plugs straight into a restaurant's existing Square POS, so orders, payments and SMS updates all flow through with nobody skimming the check.",
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
 * "What you get" on `/services/cloud/`, each carrying the evidence for it.
 * `intro` is that service's `who_for` line, verbatim.
 *
 * `href` is omitted on every phase, so each card renders as a `<div>`: the
 * source's service pages do not link their deliverables anywhere.
 *
 * `dark` is set explicitly on all four rather than left to the block's
 * `index % 2 === 0` default, because the flag tracks *artwork lightness* and
 * these are screenshots. Mean luminance of the top 23.8% of each file (the band
 * the number and caption sit over, given the card's 95px header on a 399px
 * `object-top` crop) runs 248 / 250 / 34 / 250 — three near-white product UIs
 * and one dark photograph. The default alternation gets slide 02 and slide 03
 * exactly backwards.
 */
export const PROCESS: BlockProcessCardSliderProps = {
  tagline: "Deliverables",
  intro: "You're moving off fragile hosting, or bracing for a growth curve.",
  title: "What you get",
  phasesLabel: "Deliverables",
  phases: [
    {
      number: "01",
      dark: true,
      title: "Architecture sized to your traffic",
      caption: "Sized to the load",
      text: "Architecture sized to your traffic and your budget. The delivery routing platform runs its morning solves on Fly.io, which is what that workload needs and no more.",
      image: {
        src: `${IMG}/delivery-routing-routes.jpg`,
        width: 1600,
        height: 1000,
      },
    },
    {
      number: "02",
      dark: true,
      title: "Automated deploys",
      caption: "Infrastructure as code",
      text: "Automated deploys and infrastructure as code, so shipping a change is a command rather than an afternoon, and so the next person can rebuild the whole environment from the repository.",
      image: {
        src: `${IMG}/delivery-routing-export.jpg`,
        width: 1600,
        height: 1000,
      },
    },
    {
      number: "03",
      dark: false,
      title: "Security, backups, monitoring",
      caption: "Configured on day one",
      text: "Security, backups and monitoring configured on day one. Network, server and firewall setup done properly the first time, then hardening and patch management on a schedule.",
      image: { src: `${IMG}/pizzeria.jpg`, width: 1200, height: 750 },
    },
    {
      number: "04",
      dark: true,
      title: "Cost controls",
      caption: "The bill tracks revenue",
      text: "Cost controls, so the bill tracks revenue. The routing platform holds a per-solve travel-matrix budget, which makes a runaway maps bill structurally impossible.",
      image: {
        src: `${IMG}/delivery-routing-review.jpg`,
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

/** First instance — what actually runs, and where. */
export const WYSIWYG_CAPABILITIES: BlockWysiwygProps = {
  tagline: "Hosting, and everything under it",
  title: "What we run for clients",
  body: [
    {
      type: "paragraph",
      lead: "Application hosting:",
      text: "Fly.io for the routing platform, Square's own infrastructure behind the ordering portal, WordPress and PHP with Python services under the Vintus storefront. The host follows the workload.",
    },
    {
      type: "paragraph",
      lead: "E-commerce operations:",
      text: "Vintus runs a national wine import catalog with inventory management, order processing and customer-relationship tooling behind it.",
    },
    {
      type: "paragraph",
      lead: "Point-of-sale integrations:",
      text: "Commission-free online ordering that plugs straight into a restaurant's existing Square POS, with orders, payments and SMS updates flowing through it.",
    },
    {
      type: "paragraph",
      lead: "Cost ceilings:",
      text: "A per-solve travel-matrix budget on the routing platform, so a runaway maps bill is structurally impossible rather than merely unlikely.",
    },
    {
      type: "paragraph",
      lead: "Handover:",
      text: "Clean, documented code and infrastructure your team can take over whenever they want it.",
    },
  ],
};

/**
 * Second instance — the source's `it-infrastructure` service, which gets no
 * page of its own in this port. Its `who_for` line opens the block as a plain
 * paragraph (no `lead`), then its four deliverables follow in source order.
 */
export const WYSIWYG_IT_SECURITY: BlockWysiwygProps = {
  tagline: "The unglamorous work",
  title: "IT and security",
  body: [
    {
      type: "paragraph",
      text: "Servers, networks, firewalls, and the unglamorous work that keeps the doors open. This is for you if you have no in-house IT, and a day of downtime costs you real money.",
    },
    {
      type: "paragraph",
      lead: "Network, server and firewall setup:",
      text: "Done properly the first time, so the second time is a change rather than a rescue.",
    },
    {
      type: "paragraph",
      lead: "Security hardening and patch management:",
      text: "On a schedule, so it happens whether or not anybody remembers it is due.",
    },
    {
      type: "paragraph",
      lead: "Monitoring:",
      text: "Alerting that surfaces a problem before your customers find it.",
    },
    {
      type: "paragraph",
      lead: "Documentation:",
      text: "Written so your team can actually follow it, including the parts nobody enjoys writing down.",
    },
  ],
};

/* ------------------------------------------------------------------ *
 * Highlighted projects — two tiles in one `layoutFour`
 * ------------------------------------------------------------------ *
 *
 * Two projects carry the Cloud & Infrastructure tag, and `layoutFour` takes
 * exactly two: a plain card on the left, a corner-notched one on the right,
 * side by side from 1280 up and stacked below it. Every other variant wants
 * three tiles, which would mean borrowing work from another service line, so
 * the sequence is shortened instead of padded.
 *
 * The cost of that choice is `layoutThree`'s "View all" footer, which only that
 * variant carries; the header button is therefore the single route out to the
 * filtered work index on this page.
 *
 * Both tiles are `size: "large"` — `layoutFour` gives each half the column band,
 * so both take the 665×415.63 aspect rather than the 328×205 stacked one.
 *
 * `location` carries each project's year-and-platform meta, which is the slot
 * the layout reserves for a city.
 */

const VINTUS: ProjectCard = {
  title: "Vintus",
  location: "2026 · E-commerce",
  href: "/work/vintus/",
  image: {
    src: `${IMG}/vintus.jpg`,
    alt: "Vintus",
    width: 1200,
    height: 750,
  },
  size: "large",
};

const RESTAURANT_ORDERING_PORTAL: ProjectCard = {
  title: "Restaurant ordering portal",
  location: "2026 · Product",
  href: "/work/restaurant-ordering-portal/",
  image: {
    src: `${IMG}/pizzeria.jpg`,
    alt: "Restaurant ordering portal",
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
  button: {
    title: "All Cloud & Infrastructure",
    href: "/work/?service=cloud-infrastructure",
  },
  layouts: [
    {
      variant: "four",
      left: VINTUS,
      right: RESTAURANT_ORDERING_PORTAL,
    },
  ],
};
