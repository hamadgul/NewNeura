/**
 * Content for `/work/` — the project index.
 *
 * Everything here comes from the NeuraGul source: `CASE_STUDIES` in
 * `pages/content.py` (slug, `name`, `meta`, `image`) and the built
 * `work/index.html` (its `<h1>`). Every project name, metric and route is the
 * source's own.
 *
 * The two exceptions are `PORTFOLIO_TITLE` and `PORTFOLIO_DESCRIPTION`, which
 * the SEO pass rewrote. Both are metadata only — the `<title>` stem and the
 * meta description — and neither appears on the page; the `<h1>` still reads
 * "Everything we've shipped".
 *
 * VOICE — the source site is written in the first person singular, because it
 * was one person. It is a team, so this site says "we". The `<h1>` and the meta
 * description are the two strings that carried the singular, and both are moved
 * to the team's voice below; every project name, metric and route is untouched.
 *
 * Feed order is the source's own `CASE_STUDIES` order, which is also the order
 * `work/index.html` renders the nine rows in. It is deliberately not
 * alphabetical and not chronological.
 *
 * Image sizing note: every `width`/`height` below is the asset's true decoded
 * size, because `next/image` reserves the aspect ratio from those two numbers.
 * All nine covers are 1200x750 (1.6), which is exactly the ratio
 * `CollectionProjects` gives its cards (`aspect-[665/415.625]`), so no card
 * crops.
 *
 * `services` carries every slug on the project, Applied AI's four sub-service
 * slugs included; `topServices` carries only the five top-tier `ServiceSlug`
 * values. The filter is hierarchical — Applied AI's pill matches through
 * `topServices` while its four children match through `services` — so a project
 * that carries a sub-service has to list the parent too.
 *
 * The filter config itself is NOT redeclared here. `CollectionProjects` exports
 * the measured `WORK_SERVICE_FILTERS` and `/work/page.tsx` uses that default.
 */
import type {
  CollectionProjectsHighlight,
  CollectionProjectsProject,
} from "@/components/site/shared/blocks/CollectionProjects";
import type { BlockHeaderPortfolioProps } from "@/components/site/shared/blocks/BlockHeaderPortfolio";

const IMAGES = "/site/images";

/**
 * The `<title>` stem, suffixed by the root layout's `"%s — NeuraGul"` template.
 *
 * The bare word "Work" is still the nav label, the breadcrumb and the header's
 * eyebrow. It is not the title tag, because "Work" matches no query and tells a
 * searcher nothing about what is on the page. This stem names both things a
 * portfolio page is looked for as.
 */
export const PORTFOLIO_TITLE = "Software Development Portfolio & Case Studies";
export const PORTFOLIO_CANONICAL = "/work/";
/**
 * The meta description. The list of what is in the feed is the source's own;
 * what is added is the count (a number in a snippet is the single most
 * clickable thing you can put in one), the city, and the fact that every entry
 * links to something live — which is the reason to click through rather than
 * read the snippet and leave.
 */
export const PORTFOLIO_DESCRIPTION =
  "Nine NeuraGul case studies: dispatch software, an iOS app, e-commerce storefronts, data pipelines and New York client sites, each linking to the live build.";
/**
 * `hero-poster.jpg` is the only 1920x1080 asset we have and the only one that
 * is not a specific project's screenshot, so it is the one image that can back
 * a page header without implying the page is about that project.
 */
export const PORTFOLIO_OG_IMAGE = `${IMAGES}/hero-poster.jpg`;

/**
 * Header — eyebrow / label / title over the backdrop, which is this page's LCP
 * element.
 *
 * The title is the source's own `<h1>` in the team's voice, "Everything we've
 * shipped", hard-broken into its two rendered lines: the block emits one `<br>`
 * per array entry, and at `font-3XL` (75px) across the seven columns the phrase
 * wraps in two anyway — stating the break keeps it identical at every width
 * instead of letting the measure decide. The two lines stay within a word of
 * each other's length, which is what the source's own break was doing.
 *
 * Both small labels are strings the source already uses: "Work" is the nav and
 * breadcrumb label, "Selected work" opens the page's own meta description. The
 * block lowercases the right-hand label and re-capitalises its first letter, so
 * it renders as authored.
 */
export const PORTFOLIO_HEADER: BlockHeaderPortfolioProps = {
  eyebrow: "Work",
  label: "Selected work",
  title: ["Everything", "we've shipped"],
  image: {
    src: `${IMAGES}/hero-poster.jpg`,
    alt: "",
    width: 1920,
    height: 1080,
  },
};

/**
 * Deliberately empty, and the page does not pass it.
 *
 * `CollectionProjects` treats a highlight as page furniture *and* excludes that
 * project from the results, and it only paints a banner when a later target
 * container still has cards in it. Run those two rules against a nine-project
 * feed: the cards fill layouts 1-3 (targets one and two) and leave target three
 * empty, so banner one paints and banner two never can. Two highlights would
 * therefore delete two projects from the site's only index while showing one of
 * them back as a banner and the other nowhere at all.
 *
 * One highlight would render, but it still removes its project from the
 * results — including from its own service filter, whose count in
 * `WORK_SERVICE_FILTERS` would then be one higher than the number of cards on
 * screen. Nine projects is a small enough feed that every one of them earns a
 * card, so the banner is dropped rather than paid for with a missing project.
 */
export const PORTFOLIO_HIGHLIGHTS: CollectionProjectsHighlight[] = [];

/**
 * All nine projects, in `CASE_STUDIES` order.
 *
 * `location` carries the project's `meta` string ("2026 · iOS"), because there
 * is no city to print under a project name — the slot the original layout
 * reserved for one now holds the year and the platform.
 *
 * Applied AI's four sub-services are assigned from what each project actually
 * contains: PackShip is the straight where-does-AI-help call plus an on-device
 * model it needed a custom one for ("ai-strategy", "custom-models"), and the
 * routing platform is an automation aimed at one measurable outcome that fails
 * closed and ships 1,278 tests with it ("retrieval-agents",
 * "evaluation-guardrails"). That gives each of the four children exactly the
 * count `WORK_SERVICE_FILTERS` declares.
 */
export const PORTFOLIO_PROJECTS: CollectionProjectsProject[] = [
  {
    title: "PackShip",
    href: "/work/packship/",
    location: "2026 · iOS",
    services: ["applied-ai", "ai-strategy", "custom-models", "app-development"],
    topServices: ["applied-ai", "app-development"],
    image: {
      src: `${IMAGES}/packship.jpg`,
      alt: "The PackShip parcel-sizing app on iOS",
      width: 1200,
      height: 750,
    },
  },
  {
    title: "Food Truck Rentals",
    href: "/work/foodtruckrentals/",
    location: "2026 · Web",
    services: ["web-development", "data-intelligence"],
    topServices: ["web-development", "data-intelligence"],
    image: {
      src: `${IMAGES}/foodtruckrentals.jpg`,
      alt: "The Food Truck Rentals home page",
      width: 1200,
      height: 750,
    },
  },
  {
    title: "New York Fine Foods",
    href: "/work/new-york-fine-foods/",
    location: "2026 · Web",
    services: ["web-development"],
    topServices: ["web-development"],
    image: {
      src: `${IMAGES}/nyff.jpg`,
      alt: "The New York Fine Foods catering site",
      width: 1200,
      height: 750,
    },
  },
  {
    title: "New York Mobile Mechanic",
    href: "/work/new-york-mobile-mechanic/",
    location: "2026 · Web",
    services: ["web-development"],
    topServices: ["web-development"],
    image: {
      src: `${IMAGES}/nymm.jpg`,
      alt: "The New York Mobile Mechanic home page",
      width: 1200,
      height: 750,
    },
  },
  {
    title: "Delivery routing platform",
    href: "/work/delivery-routing/",
    location: "2026 · Web app",
    services: [
      "applied-ai",
      "retrieval-agents",
      "evaluation-guardrails",
      "data-intelligence",
    ],
    topServices: ["applied-ai", "data-intelligence"],
    image: {
      src: `${IMAGES}/delivery-routing.jpg`,
      alt: "The delivery routing platform, showing six drivers' solved routes",
      width: 1200,
      height: 750,
    },
  },
  {
    title: "Vintus",
    href: "/work/vintus/",
    location: "2026 · E-commerce",
    services: ["cloud-infrastructure", "web-development"],
    topServices: ["cloud-infrastructure", "web-development"],
    image: {
      src: `${IMAGES}/vintus.jpg`,
      alt: "The Vintus wine importer storefront",
      width: 1200,
      height: 750,
    },
  },
  {
    title: "Restaurant ordering portal",
    href: "/work/restaurant-ordering-portal/",
    location: "2026 · Product",
    services: ["cloud-infrastructure"],
    topServices: ["cloud-infrastructure"],
    image: {
      src: `${IMAGES}/pizzeria.jpg`,
      alt: "The restaurant's own online ordering portal",
      width: 1200,
      height: 750,
    },
  },
  {
    title: "Real-World Data Pipeline",
    href: "/work/rwd-pipeline/",
    location: "Product · 0-to-1",
    services: ["data-intelligence"],
    topServices: ["data-intelligence"],
    image: {
      src: `${IMAGES}/rwd-pipeline.jpg`,
      alt: "The real-world clinical data pipeline",
      width: 1200,
      height: 750,
    },
  },
  {
    title: "Landscape Drainage Proz",
    href: "/work/landscape-drainage-proz/",
    location: "2026 · Shopify",
    services: ["web-development", "data-intelligence"],
    topServices: ["web-development", "data-intelligence"],
    image: {
      src: `${IMAGES}/landscapedrainage.jpg`,
      alt: "The Landscape Drainage Proz Shopify storefront",
      width: 1200,
      height: 750,
    },
  },
];
