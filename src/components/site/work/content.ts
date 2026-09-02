/**
 * Content for `/work/` — the project index.
 *
 * Everything here comes from the NeuraGul source: `CASE_STUDIES` in
 * `pages/content.py` (slug, `name`, `meta`, `image`) and the built
 * `work/index.html` (its `<title>`, `<h1>` and meta description). Nothing is
 * paraphrased and nothing is invented.
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
 * The source serves this page as `Work — NeuraGul`, which is exactly the root
 * layout's `"%s — NeuraGul"` template applied to `Work` — so the route sets the
 * bare word and lets the template suffix it, rather than opting out with an
 * absolute title.
 */
export const PORTFOLIO_TITLE = "Work";
export const PORTFOLIO_CANONICAL = "/work/";
/** Verbatim from the built page's `<meta name="description">`. */
export const PORTFOLIO_DESCRIPTION =
  "Selected work by Hamad Gul: dispatch software, an iOS app, e-commerce, data pipelines, and client sites, each with a link to the live project.";
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
 * The title is the source's own `<h1>`, "Everything I've shipped", hard-broken
 * into its two rendered lines: the block emits one `<br>` per array entry, and
 * at `font-3XL` (75px) across the seven columns it spans the phrase wraps in
 * two anyway — stating the break keeps it identical at every width instead of
 * letting the measure decide.
 *
 * Both small labels are strings the source already uses: "Work" is the nav and
 * breadcrumb label, "Selected work" opens the page's own meta description. The
 * block lowercases the right-hand label and re-capitalises its first letter, so
 * it renders as authored.
 */
export const PORTFOLIO_HEADER: BlockHeaderPortfolioProps = {
  eyebrow: "Work",
  label: "Selected work",
  title: ["Everything", "I've shipped"],
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
      alt: "PackShip",
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
      alt: "Food Truck Rentals",
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
      alt: "New York Fine Foods",
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
      alt: "New York Mobile Mechanic",
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
      alt: "Delivery routing platform",
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
      alt: "Vintus",
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
      alt: "Restaurant ordering portal",
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
      alt: "Real-World Data Pipeline",
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
      alt: "Landscape Drainage Proz",
      width: 1200,
      height: 750,
    },
  },
];
