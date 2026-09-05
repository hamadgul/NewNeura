/**
 * Content for `/services/web-development/` — the Web Development service page.
 *
 * Copy is drawn from the NeuraGul source site's `web-mobile` service
 * (`pages/content.py`), taking its **web** half, plus the four case studies
 * that evidence it: Food Truck Rentals, New York Mobile Mechanic, New York Fine
 * Foods and Landscape Drainage Proz.
 *
 * VOICE — the source is written in the first person singular, because it was
 * written by one person. NeuraGul is a team, so this page says "we". Hamad Gul
 * is named only at the human moments (the contact promise, the About page, the
 * homepage intro), and this is a capability page, so he is not named here.
 * Nothing on this page claims a headcount or a capacity; what survives is only
 * what is checkable, which is that the people who scope the work are the people
 * who build it and that they are still reachable after launch.
 *
 * Image paths are the real screenshots under `/site/images`; `width`/`height`
 * are the assets' true pixel sizes, because `next/image` sets the reserved
 * aspect ratio from them. Every image on this page is a landscape 1.6:1
 * screenshot, which is what actually exists — no stock photography, no crops
 * invented to fill a portrait slot.
 *
 * ── How this differs from the `applied-ai` template ─────────────────────────
 * `services/applied-ai/content.ts` is the pattern every service module follows:
 * each export is typed with the *shared block's own props interface*, so a
 * mis-shaped layout (e.g. handing `layoutOne` three tiles) is a compile error
 * rather than a rendering surprise. What this file adds on top of it:
 *
 *   1. No `subPages` key at all. Applied AI is the only service line with
 *      children; here the sub-nav must disappear entirely rather than reserve
 *      space, so the key is omitted rather than passed empty.
 *   2. A `PROCESS` block. This page pins the process slider between the intro
 *      and the rich text, which the Applied AI parent does not.
 *   3. Two `BlockWysiwyg` instances, each with its own tagline/title/body.
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
 * Route metadata. `title` is the plain stem, so the root layout's
 * "%s — NeuraGul" template supplies the suffix.
 *
 * Neither string appears on the page. The `<h1>` is `HEADER.title` and the
 * promise line is `INTRO.statement`, both unchanged and both still the
 * source's own — which is what lets the title and description here be written
 * for a result list instead. See the note beside `description`.
 */
export const META = {
  title: "Web Development Company in New York",
  /*
    The old description was 78 characters — half the snippet Google would have
    rendered, and it named no technology, no city and no page type. This one
    keeps the same promise and spends the other half on the words a search
    actually contains.
  */
  canonical: "/services/web-development/",
  description:
    "A New York web development company building Next.js and Shopify sites that load fast, rank across the five boroughs, and stay maintainable after handover.",
} as const;

/**
 * Parent-service header: an eyebrow (not a back link), a `font-3XL` title, and
 * — the one structural difference from Applied AI — **no** `subPages` key,
 * because this line has no child pages.
 *
 * `service: "web-development"` selects the `--ng-web-development` (#925434)
 * ground, which the block's own tone table pairs with white type, so `tone` is
 * not passed. `titleSize` is stated explicitly even though `3XL` is the
 * no-`backLink` default, because the 75px vs 56px step is the single clearest
 * difference between a parent page and a child page.
 */
export const HEADER: BlockHeaderServicesProps = {
  service: "web-development",
  eyebrow: "What we build",
  subtitle: "Sites that load fast and rank",
  title: "Web Development",
  titleSize: "3XL",
  image: {
    // Food Truck Rentals — the 24-page build this page leans on hardest.
    src: `${IMG}/foodtruckrentals.jpg`,
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
  labels: ["Sites that load fast and rank"],
  statement:
    "Sites that load fast, rank, and stay maintainable long after we hand them over.",
  body: [
    "We are a web development company in New York. SEO and performance are part of the first commit rather than a phase somebody bolts on at the end. Foodtruckrentals.com is twenty-four pages of Next.js 16 and React 19 built that way: a full-bleed activation hero, a truck roster that animates along a variable-width axis, and a dedicated page for every way a truck actually gets rented. Weddings. Product launches. Film production, corporate events, ice cream, coffee carts, and the tri-state markets.",
    "Every commercial page on that site carries JSON-LD Service, FAQ and LocalBusiness data generated from a single pricing module, so a published price can never drift away from the page it sits on. Keyword research shapes the URL structure, and 119 Vitest tests guard it, including one that fails the build outright if two pages start competing for the same keyword cluster. The flagship URL now targets a 12,100/mo search term. It launched on a local qualifier worth 320.",
    "New York Mobile Mechanic points the same discipline at a stranded driver: a landing-page matrix of service crossed with borough, schema markup on every route, and Core Web Vitals in the green. Stat gauges count up as they scroll into view, live Google reviews carry the credibility, and a one-tap call-to-book follows you down the page. When your car dies on the BQE you call whoever ranks. Nobody comparison-shops from the shoulder.",
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
 * "What you get" on `/services/web-mobile/`, each carrying the case-study
 * evidence for it. `intro` is that service's `who_for` line, verbatim.
 *
 * `href` is omitted on every phase, so each card renders as a `<div>`: the
 * source's service pages do not link their deliverables anywhere.
 *
 * `dark` is set explicitly on all four rather than left to the block's
 * `index % 2 === 0` default, because the flag tracks *artwork lightness* and
 * these are screenshots, not art-directed crops. Mean luminance of the top
 * 23.8% of each file (the band the number and caption sit over, given the
 * card's 95px header on a 399px `object-top` crop) runs 137 / 250 / 242 / 33 —
 * so dark type belongs on slides 02 and 03 only. On the default alternation,
 * slide 01 would take dark type on a mid-grey hero and slide 03 white type on
 * a near-white UI screenshot, both illegible.
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
      title: "Fast, accessible front-ends",
      caption: "Every screen size",
      text: "Front-ends that behave on every screen size. Food Truck Rentals runs twenty-four pages of Next.js 16 and React 19, from the full-bleed activation hero down to the truck roster that animates along a variable-width axis.",
      image: {
        src: `${IMG}/foodtruckrentals-home.jpg`,
        alt: "The Food Truck Rentals home page",
        width: 1600,
        height: 1000,
      },
    },
    {
      number: "02",
      dark: true,
      title: "SEO from the first commit",
      caption: "Built to rank",
      text: "Keyword research shapes the URL structure before a page exists. New York Mobile Mechanic ships a landing-page matrix of service crossed with borough, schema markup on every route, and Core Web Vitals in the green.",
      image: {
        // A Lighthouse report: a row of five scores across the top, the big
        // 100 Performance ring on the left, the site's own screenshot on the
        // right.
        src: `${IMG}/mechanicseo.png`,
        alt: "A Lighthouse report for New York Mobile Mechanic, scoring 100 for performance and accessibility",
        width: 512,
        height: 265,
        /*
          The card crops this 512x265 shot to a 353x399 portrait slot, so
          `object-cover` scales it 1.51x and shows a 234px-wide window on a
          512px-wide image. Centred, that window is x=139..373 — which lands
          between the two things worth seeing, clipping the Performance ring at
          the left edge and catching only part of the screenshot at the right.

          The ring's measured centre is x=130.5 (green pixels, bbox 94..167).
          6% puts the window at roughly x=17..251 on the desktop card and
          x=18..232 on the phone's narrower one, holding the ring within a few
          pixels of centre at both, with the top row's 100 Performance and 100
          Accessibility above it.
        */
        position: "6% top",
      },
    },
    {
      number: "03",
      dark: true,
      title: "Structured data that cannot drift",
      caption: "One source, every page",
      text: "JSON-LD Service, FAQ and LocalBusiness data generated from a single pricing module, so a published price can never drift away from the page it sits on. 119 Vitest tests guard the structure.",
      image: {
        src: `${IMG}/foodtruckrentals-work.jpg`,
        alt: "The work index: every activation, with the client, the borough, and the year",
        width: 1600,
        height: 1000,
      },
    },
    {
      number: "04",
      dark: false,
      title: "A stack your team can hire for",
      caption: "TypeScript all the way down",
      text: "TypeScript, Next.js, React and Tailwind CSS, with Framer Motion where a page earns it. Nothing exotic, so the next person to open the repo is not the only person who can.",
      image: {
        src: `${IMG}/nymm.jpg`,
        alt: "The New York Mobile Mechanic home page",
        width: 1200,
        height: 750,
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

/** First instance — the kinds of web work that exist in the portfolio. */
export const WYSIWYG_CAPABILITIES: BlockWysiwygProps = {
  tagline: "Sites, and what runs behind them",
  title: "What we build on the web",
  body: [
    {
      type: "paragraph",
      lead: "Marketing sites built to rank:",
      text: "Twenty-four pages for Food Truck Rentals, indexed and structured to compete well past its first city.",
    },
    {
      type: "paragraph",
      lead: "Local service sites:",
      text: "New York Mobile Mechanic, aimed squarely at same-day repair demand and built to rank across all five boroughs.",
    },
    {
      type: "paragraph",
      lead: "Brand and booking sites:",
      text: "New York Fine Foods, a cinematic Next.js build with full-bleed motion, media galleries, service menus, and a booking inquiry flow that catches people while the impression is still fresh.",
    },
    {
      type: "paragraph",
      lead: "Storefronts:",
      text: "A national wine importer's catalog on Vintus, and a Shopify buildout for Landscape Drainage Proz that tripled the client's online sales.",
    },
    {
      type: "paragraph",
      lead: "The stack:",
      text: "TypeScript, Next.js, React, Tailwind CSS and Framer Motion, with Shopify and custom Liquid where a storefront calls for it.",
    },
  ],
};

/**
 * Second instance — why a client hands the whole build to us. The first three
 * items are the source's own New York page reasons; the fourth is the last step
 * of its four-step engagement, which is the part that decides whether any of the
 * rest of it survives the year after launch.
 *
 * The source wrote all four as a soloist's promise ("I write the scope and then
 * I write the code", "you get a number that reaches me"). Each is now stated as
 * the thing a team can actually stand behind: the people who scope the work are
 * the people who build it, and you can still reach them. Nothing here says how
 * many people there are, or how senior they are, because neither is established.
 */
export const WYSIWYG_WHY: BlockWysiwygProps = {
  tagline: "Scoped, built, still reachable",
  title: "Why clients hand us the whole build",
  body: [
    {
      type: "paragraph",
      lead: "Whoever scopes it, builds it:",
      text: "The people who write your scope are the people who write your code. You keep the same names from the first call through to launch, and nothing gets quietly reassigned once the contract is signed.",
    },
    {
      type: "paragraph",
      lead: "In your timezone, on the phone:",
      text: "We work out of New York. You get a number that reaches the people building your project and somebody picks it up. There is no ticket queue and no account manager sitting in the middle of it.",
    },
    {
      type: "paragraph",
      lead: "We rank New York businesses:",
      text: "Local SEO is part of the build rather than an upsell afterwards. The mobile mechanic we built ranks across all five boroughs for on-demand repair searches.",
    },
    {
      type: "paragraph",
      lead: "We stay on after launch:",
      text: "We hold the pager, fix what breaks, and hand over once your team wants it. The same people are still reachable six months after launch.",
    },
  ],
};

/* ------------------------------------------------------------------ *
 * Highlighted projects — five tiles across layouts one / four
 * ------------------------------------------------------------------ *
 *
 * Five projects carry the Web Development tag and exactly five tiles are laid
 * out for them: `layoutOne` takes three, `layoutFour` takes the remaining two
 * side by side. The alternative — `layoutOne` then `layoutThree` — wants six
 * tiles, so it would mean either repeating a project or borrowing one from
 * another service line. Neither is true, so the sequence is shortened instead.
 *
 * The cost of that choice is `layoutThree`'s "View all" footer, which only that
 * variant carries; the header button is therefore the single route out to the
 * filtered work index on this page.
 *
 * `location` carries each project's year-and-platform meta, which is the slot
 * the layout reserves for a city. NeuraGul has no city to print under a
 * project name.
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

const NEW_YORK_MOBILE_MECHANIC: ProjectCard = {
  title: "New York Mobile Mechanic",
  location: "2026 · Web",
  href: "/work/new-york-mobile-mechanic/",
  image: {
    src: `${IMG}/nymm.jpg`,
    alt: "The New York Mobile Mechanic home page",
    width: 1200,
    height: 750,
  },
  size: "small",
};

const NEW_YORK_FINE_FOODS: ProjectCard = {
  title: "New York Fine Foods",
  location: "2026 · Web",
  href: "/work/new-york-fine-foods/",
  image: {
    src: `${IMG}/nyff.jpg`,
    alt: "The New York Fine Foods catering site",
    width: 1200,
    height: 750,
  },
  size: "small",
};

/** Both `layoutFour` tiles take the 665×415.63 large aspect, not the 328×205 one. */
const VINTUS: ProjectCard = {
  title: "Vintus",
  location: "2026 · E-commerce",
  href: "/work/vintus/",
  image: {
    src: `${IMG}/vintus.jpg`,
    alt: "The Vintus wine importer storefront",
    width: 1200,
    height: 750,
  },
  size: "large",
};

const LANDSCAPE_DRAINAGE_PROZ: ProjectCard = {
  title: "Landscape Drainage Proz",
  location: "2026 · Shopify",
  href: "/work/landscape-drainage-proz/",
  image: {
    src: `${IMG}/landscapedrainage.jpg`,
    alt: "The Landscape Drainage Proz Shopify storefront",
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
  button: { title: "All Web Development", href: "/work/?service=web-development" },
  layouts: [
    {
      variant: "one",
      large: FOODTRUCKRENTALS,
      small: [NEW_YORK_MOBILE_MECHANIC, NEW_YORK_FINE_FOODS],
    },
    {
      variant: "four",
      left: VINTUS,
      right: LANDSCAPE_DRAINAGE_PROZ,
    },
  ],
};
