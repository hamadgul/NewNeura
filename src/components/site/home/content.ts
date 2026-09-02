/**
 * Site-wide and homepage content for neuragul.com.
 *
 * Copy is lifted from the NeuraGul source site (`pages/content.py`, which is
 * that site's single source of truth) rather than rewritten, so the voice rules
 * it enforces still hold here: first person, no "X, not Y" antithesis, a
 * checkable number in place of an adjective wherever one exists.
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
 * claiming to be a specific room, which matters for a one-person practice with
 * no street office.
 */
export const HERO_VIDEO = {
  src: `${VIDEO}/office.mp4`,
  poster: `${VIDEO}/office-poster.jpg`,
};

export const HERO_INTRO = {
  eyebrowLeft: "Software + Applied AI",
  eyebrowRight: "Built and maintained by one person",
  /** Shown ≥768px. */
  scrollCueDesktop: "Scroll to explore",
  /** Shown <768px. */
  scrollCueMobile: "Swipe up to explore",
  heading: "I build the software that small companies actually run on",
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
      src: `${IMG}/vintus.jpg`,
      alt: "The Vintus storefront",
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
 * The homepage's about block. `tagline` is the four-beat engagement shorthand;
 * the four words are the same four the preloader unfolds.
 */
export const INTRO_BLOCK = {
  title: "One person who holds the whole system, and still picks up the phone.",
  tagline: "Talk. Scope. Build. Stay.",
  text: "NeuraGul is me, plus the people I bring in. Before this I was a product manager at Freenome, building a 0-to-1 ETL pipeline that pulled messy real-world clinical data from dozens of sources into a single common model. These days I mostly build operational software: the dispatch app that plans six vans every morning, an ordering portal that lets a pizzeria skip delivery-app commissions, a wine importer's storefront. I stay small on purpose, which is how I'm still the one who answers.",
  cta: { label: "More about me", href: "/about/" },
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
      alt: "Delivery routing platform",
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
      alt: "PackShip",
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
      alt: "Food Truck Rentals",
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
      alt: "Vintus",
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
      alt: "Landscape Drainage Proz",
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
      alt: "New York Mobile Mechanic",
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
    { label: "How I work", href: "/process/" },
    { label: "Contact", href: "/contact/" },
  ],
};

/**
 * A single contact record, where the layout was built for a pair of offices.
 *
 * There is no street address: NeuraGul is one person working out of New York,
 * so the locality line is the honest version of that slot.
 */
export const OFFICES: OfficeContact[] = [
  {
    label: "New York",
    address: ["NYC based", "Working across the five boroughs"],
    phone: "(203) 685 9193",
    phoneHref: "tel:+12036859193",
    email: "hamad@neuragul.com",
  },
];

/** The footer's parallax panel. */
export const FOOTER_IMAGE = {
  src: `${VIDEO}/office-poster.jpg`,
  alt: "",
  width: 1920,
  height: 1080,
};

/**
 * The preloader wordmark: the four beats of the engagement, each unfolding
 * from its own leading capital.
 *
 * These are the four steps the source site's process section describes — you
 * write and we talk, I scope it in writing, we build in the open, I stay on
 * after launch — compressed to one word each.
 */
export const PRELOADER_WORDS: Array<[string, string]> = [
  ["T", "alk"],
  ["S", "cope"],
  ["B", "uild"],
  ["S", "tay"],
];

export const FOOTER_COPYRIGHT = "© 2026 NeuraGul. All rights reserved.";
export const FOOTER_BACK_TO_TOP = "Back to top";
