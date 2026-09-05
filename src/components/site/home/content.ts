/**
 * Site-wide and homepage content for neuragul.com.
 *
 * Copy is drawn from the NeuraGul source site (`pages/content.py`) and carries
 * its voice rules: no "X, not Y" antithesis, at most three em dashes per block,
 * varied sentence length, a checkable number in place of an adjective wherever
 * one exists.
 *
 * VOICE — the source site is written in the first person singular, because it
 * was one person. It is a team, so this site says "we". Hamad Gul is named at
 * the human moments only: the contact promise, the About page's "who you'd be
 * working with", and the process step about staying on after launch. He is
 * "your primary point of contact and one of the developers on your project".
 *
 * Nothing here claims a headcount, a capacity or a team size. Those are not
 * facts anyone has established, and the copy stands without them.
 *
 * Everything the navigation, the footer and the hero share lives in this file,
 * because all three read from it — the same arrangement the layout was built
 * around.
 */
import type {
  HeroServiceCard,
  NavGroup,
  NavLink,
  OfficeContact,
  PortfolioFilterItem,
  ProjectCard,
} from "@/types/site";

const IMG = "/site/images";
const VIDEO = "/site/videos";

/**
 * The office loop behind the hero intro panel.
 *
 * Deliberately generic interior footage — it sets the studio register without
 * claiming to be a specific room, which matters for a practice with no street
 * office.
 */
export const HERO_VIDEO = {
  src: `${VIDEO}/office.mp4`,
  poster: `${VIDEO}/office-poster.jpg`,
};

export const HERO_INTRO = {
  /*
    The city is added here rather than to the `<h1>` below it. The headline
    ("the software that small companies actually run on") is true of clients in
    and well outside New York — Vintus is a national importer and the Freenome
    pipeline was not local work — so putting a city in it would narrow a claim
    that is currently accurate. The eyebrow states where the team is, which is
    the fact, and it is the first geographic signal above the fold.

    Slot check, swept 320-1728px: one line everywhere except the 768-900px
    band, where `[grid-column:1/7]` is only ~196px and it wraps to two. That is
    not a defect there — `eyebrowRight` ("Built and maintained by the same
    team") and the scroll cue already wrap to two lines at those widths, so the
    row is two lines tall regardless and all three now align. Measured: the
    title's top is unmoved (748px at 768, 744px at 800).
  */
  eyebrowLeft: "Software + Applied AI · New York",
  eyebrowRight: "Built and maintained by the same team",
  /** Shown ≥768px. */
  scrollCueDesktop: "Scroll to explore",
  /** Shown <768px. */
  scrollCueMobile: "Swipe up to explore",
  heading: "We build the software that small companies actually run on",
};

/**
 * The five service lines, in strip order.
 *
 * Only Applied AI carries `subPages`: it is the one line deep enough to need
 * its own routes, and the four beneath it are the four deliverables the source
 * site already lists under "AI, applied".
 *
 * Each card's image is a real screenshot of the project that best evidences
 * that line, so the strip doubles as proof rather than decoration.
 */
export const HERO_CARDS: HeroServiceCard[] = [
  {
    slug: "applied-ai",
    title: "Applied AI",
    subtitle: ["Models in", "a real workflow"],
    index: 1,
    total: 5,
    href: "/services/applied-ai/",
    image: {
      src: `${IMG}/delivery-routing.jpg`,
      alt: "Solved delivery routes in the dispatch app",
      width: 1200,
      height: 750,
    },
    mainColor: "#625653",
    contentColor: "#ffffff",
    subPages: [
      { title: "AI Strategy", href: "/services/applied-ai/strategy/" },
      { title: "Custom Models", href: "/services/applied-ai/models/" },
      { title: "Retrieval & Agents", href: "/services/applied-ai/agents/" },
      { title: "Evaluation & Guardrails", href: "/services/applied-ai/evaluation/" },
    ],
  },
  {
    slug: "web-development",
    title: "Web Development",
    subtitle: ["Sites that load,", "rank and last"],
    index: 2,
    total: 5,
    href: "/services/web-development/",
    image: {
      src: `${IMG}/foodtruckrentals.jpg`,
      alt: "Food Truck Rentals home page",
      width: 1200,
      height: 750,
    },
    mainColor: "#925434",
    contentColor: "#ffffff",
  },
  {
    slug: "app-development",
    title: "App Development",
    subtitle: ["Native quality,", "iOS and Android"],
    index: 3,
    total: 5,
    href: "/services/app-development/",
    image: {
      src: `${IMG}/packship.jpg`,
      alt: "PackShip on iOS",
      width: 1200,
      height: 750,
    },
    mainColor: "#c9d3df",
    contentColor: "#111111",
  },
  {
    slug: "cloud-infrastructure",
    title: "Cloud & Infrastructure",
    subtitle: ["Sized to load,", "priced to match"],
    index: 4,
    total: 5,
    href: "/services/cloud-infrastructure/",
    image: {
      src: `${IMG}/pizzeria.jpg`,
      alt: "The restaurant ordering portal",
      width: 1200,
      height: 750,
    },
    mainColor: "#707569",
    contentColor: "#ffffff",
  },
  {
    slug: "data-intelligence",
    title: "Data Intelligence",
    subtitle: ["Pipelines that", "end in a decision"],
    index: 5,
    total: 5,
    href: "/services/data-intelligence/",
    image: {
      src: `${IMG}/rwd-pipeline.jpg`,
      alt: "The real-world data pipeline case study",
      width: 1200,
      height: 750,
    },
    mainColor: "#e3c1aa",
    contentColor: "#111111",
  },
];

/**
 * The homepage's about block. `tagline` is the four-beat engagement shorthand.
 * It used to be the same four words the preloader unfolded; the preloader now
 * spells out NEURA, so the two are independent.
 *
 * This is the one place on the homepage where Hamad is named — the "who you'd
 * be working with" beat. Everywhere else on this page the voice is "we".
 */
export const INTRO_BLOCK = {
  title: "A team that holds the whole system, and one number that always answers.",
  tagline: "Talk. Scope. Build. Stay.",
  text: "NeuraGul is a software development team in New York: developers, designers and engineers. We mostly build operational software: the dispatch app that plans six vans every morning, an ordering portal that lets a pizzeria skip delivery-app commissions, a wine importer's storefront. Hamad Gul is your primary point of contact and one of the developers on your project, so the person who scopes the work is also one of the people writing it. You always know who is on your project, and the same people are still reachable six months after launch.",
  /*
    The anchor text was "More about us", which describes the click and not the
    destination. Internal anchor text is one of the few on-page signals that
    acts on the *target* page, and `/about/` now competes on "New York software
    development team" — so the one link the homepage points at it should say so.
    `ButtonArrow` sets `whitespace-nowrap` on the label and the slot is an
    8-column span, so the longer string neither wraps nor overflows.
  */
  cta: { label: "About our New York team", href: "/about/" },
};

/** Service pills with their project counts, sized off the nine real projects. */
export const PORTFOLIO_FILTERS: PortfolioFilterItem[] = [
  { label: "Applied AI", count: 2, href: "/work/?service=applied-ai" },
  { label: "Web Development", count: 5, href: "/work/?service=web-development" },
  { label: "App Development", count: 1, href: "/work/?service=app-development" },
  { label: "Cloud & Infrastructure", count: 2, href: "/work/?service=cloud-infrastructure" },
  { label: "Data Intelligence", count: 4, href: "/work/?service=data-intelligence" },
];

/**
 * The homepage work grid: six of the nine, in the order the source site
 * features them.
 *
 * `location` carries the year-and-platform qualifier the source prints under
 * each name, which is the equivalent of the city line the layout expects.
 */

/** Row one: one large tile left, two small tiles stacked right. */
export const PROJECTS_ROW_ONE: ProjectCard[] = [
  {
    title: "Delivery routing platform",
    location: "2026 · Web app",
    href: "/work/delivery-routing/",
    image: {
      src: `${IMG}/delivery-routing.jpg`,
      alt: "The delivery routing platform, showing six drivers' solved routes",
      width: 1200,
      height: 750,
    },
    size: "large",
  },
  {
    title: "PackShip",
    location: "2026 · iOS",
    href: "/work/packship/",
    image: {
      src: `${IMG}/packship.jpg`,
      alt: "The PackShip parcel-sizing app on iOS",
      width: 1200,
      height: 750,
    },
    size: "small",
  },
  {
    title: "Food Truck Rentals",
    location: "2026 · Web",
    href: "/work/foodtruckrentals/",
    image: {
      src: `${IMG}/foodtruckrentals.jpg`,
      alt: "The Food Truck Rentals home page",
      width: 1200,
      height: 750,
    },
    size: "small",
  },
];

/** Row two mirrors row one: two small tiles left, one large tile right. */
export const PROJECTS_ROW_TWO: ProjectCard[] = [
  {
    title: "Vintus",
    location: "2026 · E-commerce",
    href: "/work/vintus/",
    image: {
      src: `${IMG}/vintus.jpg`,
      alt: "The Vintus wine importer storefront",
      width: 1200,
      height: 750,
    },
    size: "small",
  },
  {
    title: "Landscape Drainage Proz",
    location: "2026 · Shopify",
    href: "/work/landscape-drainage-proz/",
    image: {
      src: `${IMG}/landscapedrainage.jpg`,
      alt: "The Landscape Drainage Proz Shopify storefront",
      width: 1200,
      height: 750,
    },
    size: "small",
  },
  {
    title: "New York Mobile Mechanic",
    location: "2026 · Web",
    href: "/work/new-york-mobile-mechanic/",
    image: {
      src: `${IMG}/nymm.jpg`,
      alt: "The New York Mobile Mechanic home page",
      width: 1200,
      height: 750,
    },
    size: "large",
  },
];

export const SERVICE_LINKS: NavLink[] = [
  { label: "Applied AI", href: "/services/applied-ai/" },
  { label: "Web Development", href: "/services/web-development/" },
  { label: "App Development", href: "/services/app-development/" },
  { label: "Cloud & Infrastructure", href: "/services/cloud-infrastructure/" },
  { label: "Data Intelligence", href: "/services/data-intelligence/" },
];

export const EXPLORE_GROUP: NavGroup = {
  title: "See the",
  items: [{ label: "Work", href: "/work/" }],
};

export const COMPANY_GROUP: NavGroup = {
  title: "Studio",
  items: [
    { label: "About", href: "/about/" },
    { label: "How we work", href: "/process/" },
    { label: "Contact", href: "/contact/" },
  ],
};

/**
 * A single contact record, where the layout was built for a pair of offices.
 *
 * There is no street address: the team works out of New York with no street
 * office, so the locality line is the honest version of that slot.
 */
export const OFFICES: OfficeContact[] = [
  {
    label: "New York",
    /*
      Was ["NYC based", "Working across the five boroughs"]. "NYC based" is not
      true: the Google Business Profile is pinned in Westchester County, and a
      page that claims a city its own listing contradicts breaks the NAP
      agreement local ranking is built on — quite apart from being wrong.

      What replaces it is the tiered geography the whole SEO layer now states:
      based in Westchester, working across both. `areaServed` in `lib/seo.ts`
      says the same thing in the same order.

      Two lines, because `ContactInfo` was measured against a 37.8px two-line
      box — so each entry has to fit on ONE line or the box is three deep.

      Measured in the live slot (165px at 390, 170px at 1280, 193px at 1440,
      236px at 1728), which is narrower than it looks:

        "Working across the five boroughs"   2 lines below 1728  (the original,
                                             so the old copy already overflowed)
        "Working across NYC and Westchester" 2 lines everywhere
        "Serving NYC and Westchester"        2 lines below 1440
        "Working across NYC"                 1 line everywhere  ← this

      Westchester is not repeated on the second line because the first already
      names it, which is also what buys the room.
    */
    address: ["Westchester County, NY", "Working across NYC"],
    phone: "(203) 685 9193",
    phoneHref: "tel:+12036859193",
    email: "hamad@neuragul.com",
  },
];

/** The footer's parallax panel. */
export const FOOTER_IMAGE = {
  src: `${IMG}/footer_image.png`,
  alt: "",
  width: 1672,
  height: 941,
};

/**
 * The preloader wordmark: NEURA unfolding into what the name stands for —
 * Next-Generation Engineering, Unified Research & AI. Each line grows from its
 * own leading capital, so the five capitals read as the name before the tails
 * open.
 *
 * Five words, not the four this was adapted from: the layout takes the count
 * from this array (`Preloader.tsx` chunks it two to a section), so the only
 * thing to keep in mind when editing is line length — "Next-Generation" is the
 * longest line the wordmark has ever carried and it sets the block's width at
 * every viewport.
 */
export const PRELOADER_WORDS: Array<[string, string]> = [
  ["N", "ext-Generation"],
  ["E", "ngineering"],
  ["U", "nified"],
  ["R", "esearch"],
  ["A", "I"],
];

export const FOOTER_COPYRIGHT = "© 2026 NeuraGul. All rights reserved.";
export const FOOTER_BACK_TO_TOP = "Back to top";
