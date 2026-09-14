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
 * All ten covers are 1200x750 (1.6), which is exactly the ratio
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
import type { GeneralCtaProps } from "@/components/site/shared/blocks/GeneralCta";

const IMAGES = "/site/images";
const VIDEOS = "/site/videos";

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
 * clickable thing you can put in one) and the fact that every entry links to
 * something live — which is the reason to click through rather than read the
 * snippet and leave. Held under 160 characters, so the city went.
 */
export const PORTFOLIO_DESCRIPTION =
  "Ten NeuraGul case studies: dispatch software, an iOS app, a Shopify storefront, a wine trade portal, data pipelines, client sites, each linked to a live build.";
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
 * The block's two small labels ("Work" / "Selected work") were dropped on
 * 2026-09-12 at the user's request; the video backdrop and the title carry the
 * header alone.
 */
export const PORTFOLIO_HEADER: BlockHeaderPortfolioProps = {
  // No eyebrow or label: the video backdrop and the title carry the header on
  // their own; the block's label band stays in the grid so nothing shifts.
  title: ["Everything", "we've shipped"],
  image: {
    src: `${IMAGES}/hero-poster.jpg`,
    alt: "",
    width: 1920,
    height: 1080,
  },
  // The still above is frame 0 of this clip, so the poster-to-video hand-off
  // is seamless and the reduced-motion / pre-paint state is the same shot.
  video: { src: `${VIDEOS}/hero.mp4` },
};

/**
 * Deliberately empty, and the page does not pass it.
 *
 * `CollectionProjects` treats a highlight as page furniture *and* excludes that
 * project from the results, and it only paints a banner when a later target
 * container still has cards in it. Run those two rules against a ten-project
 * feed: the cards fill layouts 1-3 (targets one and two) and leave target three
 * empty, so banner one paints and banner two never can. Two highlights would
 * therefore delete two projects from the site's only index while showing one of
 * them back as a banner and the other nowhere at all.
 *
 * One highlight would render, but it still removes its project from the
 * results — including from its own service filter, whose count in
 * `WORK_SERVICE_FILTERS` would then be one higher than the number of cards on
 * screen. Ten projects is a small enough feed that every one of them earns a
 * card, so the banner is dropped rather than paid for with a missing project.
 */
export const PORTFOLIO_HIGHLIGHTS: CollectionProjectsHighlight[] = [];

/**
 * All ten projects: the source's nine in `CASE_STUDIES` order, then
 * Hasina Hijama Cupping.
 *
 * `location` carries the project's `meta` string ("2026 · iOS"), because there
 * is no city to print under a project name — the slot the original layout
 * reserved for one now holds the year and the platform.
 *
 * Applied AI's four sub-services are assigned from what each project actually
 * contains: PackShip is the straight where-does-AI-help call ("ai-strategy")
 * and nothing more — its dimension lookup is a gated call to a hosted model and
 * its packing solver is deterministic, so it earns no "custom-models" (the
 * on-device model that tag once cited does not exist; user ruling 2026-09-11)
 * — and the routing platform is an automation aimed at one measurable outcome
 * that fails closed and ships 1,278 tests with it ("retrieval-agents",
 * "evaluation-guardrails"). That leaves "custom-models" at zero and gives each
 * other child exactly the count `WORK_SERVICE_FILTERS` declares.
 */
export const PORTFOLIO_PROJECTS: CollectionProjectsProject[] = [
  {
    title: "PackShip",
    href: "/work/packship/",
    location: "2026 · iOS",
    services: ["applied-ai", "ai-strategy", "app-development"],
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
    video: { src: `${VIDEOS}/nyff-hero.mp4` },
    /*
      Promoted into a large card slot. These two are the only projects whose
      thumbnail MOVES, and a 334x209 tile is not enough room to notice a
      3-second count-up or a slideshow cross-fade — the motion reads as a
      flicker at that size and as the point at 678x424.
    */
    featured: true,
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
    video: { src: `${VIDEOS}/nymm-hero-loop.mp4` },
    /*
      Promoted into a large card slot. These two are the only projects whose
      thumbnail MOVES, and a 334x209 tile is not enough room to notice a
      3-second count-up or a slideshow cross-fade — the motion reads as a
      flicker at that size and as the point at 678x424.
    */
    featured: true,
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
    location: "2026 · WordPress",
    // `web-development` only (user ruling 2026-09-11): ongoing maintenance and
    // feature work on an inherited theme. The nginx, HSTS and CSP headers the
    // site serves are the host's, not infrastructure we built, so no
    // `cloud-infrastructure`.
    services: ["web-development"],
    topServices: ["web-development"],
    image: {
      src: `${IMAGES}/vintus.jpg`,
      alt: "The Vintus wine importer trade portal",
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
    // `data-intelligence` is the measurement layer, not the storefront: seven
    // Google Ads conversion labels on the web pixel's eleven checkout events,
    // GTM and GA4, and the Merchant Center link (kept by user ruling
    // 2026-09-11; see docs/research/case-studies/landscape-drainage-proz.md).
    services: ["web-development", "data-intelligence"],
    topServices: ["web-development", "data-intelligence"],
    image: {
      src: `${IMAGES}/landscapedrainage.jpg`,
      alt: "The Landscape Drainage Proz Shopify storefront",
      width: 1200,
      height: 750,
    },
  },
  /*
    The tenth, and the first entry here that is not in the source's
    `CASE_STUDIES` — added 2026-09-07. Appended rather than slotted in, because
    the feed order is the source's own and this one has no place in it.

    `web-development` only. The build is a Next.js marketing site; the SEO and
    the AI-crawler files are part of shipping a marketing site, not a second
    service, and claiming `data-intelligence` for a keyword spreadsheet would
    inflate a filter count with nothing behind it.

    Cover is a 1200x750 screenshot of the live home page, captured at 1600x1000
    on a 2x device and downsampled — the same ratio as the other nine, which is
    exactly `CollectionProjects`' card ratio, so it does not crop.
  */
  {
    title: "Hasina Hijama Cupping",
    href: "/work/hasina-hijama-cupping/",
    location: "2026 · Next.js",
    services: ["web-development"],
    topServices: ["web-development"],
    image: {
      src: `${IMAGES}/hasinahijama.jpg`,
      alt: "The Hasina Hijama Cupping site for a Queens cupping practice",
      width: 1200,
      height: 750,
    },
  },
];

/**
 * `GeneralCta` — the contact band that closes the page. Declared here, not
 * imported from `GeneralCta.tsx`: that block is `"use client"`, so a value
 * imported from it into a server component arrives as a client-reference
 * proxy and spreads to undefined props with no build error. The line names
 * the reader's own problem; the label names the next step, never a page name
 * ("Contact"). Every CTA band on the site follows that pair.
 */
export const PORTFOLIO_CTA: GeneralCtaProps = {
  text: "Have a problem that looks like one of these?",
  label: "Tell us about it",
  href: "/contact/",
};
