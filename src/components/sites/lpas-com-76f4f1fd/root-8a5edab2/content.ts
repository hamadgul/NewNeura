/**
 * Verbatim content from the lpas.com homepage, captured 2026-08-31.
 *
 * Every string here was read from the live DOM via `textContent` — do not
 * paraphrase, retitle or "tidy" any of it. The double space in
 * "Higher  Education" is present in the source and is what makes the hero
 * card title wrap onto two lines, so it is preserved deliberately.
 */
import type {
  HeroMarketCard,
  LatestUpdate,
  NavGroup,
  NavLink,
  OfficeContact,
  PortfolioFilterItem,
  ProjectCard,
} from "@/types/lpas";

const IMG = "/sites/lpas-com-76f4f1fd/root-8a5edab2/images";
const VIDEO = "/sites/lpas-com-76f4f1fd/root-8a5edab2/videos";

/** The office video behind the hero intro panel and the preloader. */
export const HERO_VIDEO = {
  src: `${VIDEO}/file.mp4-1080p-.mp4`,
  poster: `${VIDEO}/LPAS-office-thumbnail.jpg`,
};

export const HERO_INTRO = {
  eyebrowLeft: "Architecture + Interiors",
  eyebrowRight: "A Market-Focused Approach",
  /** Shown ≥768px (the source's `#d` span). */
  scrollCueDesktop: "Scroll to explore",
  /** Shown <768px (the source's `#m` span). */
  scrollCueMobile: "Swipe up to explore",
  heading: "We’re a process driven architecture and interior design studio",
};

export const HERO_CARDS: HeroMarketCard[] = [
  {
    slug: "housing",
    title: "Housing",
    subtitle: ["Residential", "Housing"],
    index: 1,
    total: 5,
    href: "/markets/housing/",
    image: {
      src: `${IMG}/08_The-Emery-1280x849-c-default.webp`,
      alt: "Housing",
      width: 1280,
      height: 849,
    },
    mainColor: "#625653",
    contentColor: "#ffffff",
    subPages: [
      { title: "Affordable Housing", href: "/markets/housing/affordable-housing/" },
      { title: "Student Housing", href: "/markets/housing/student-housing/" },
      { title: "Market Rate Housing", href: "/markets/housing/market-rate-housing/" },
      { title: "Senior Housing", href: "/markets/housing/senior-housing/" },
    ],
  },
  {
    slug: "interiors",
    title: "Interiors",
    subtitle: ["Design for", "everyday life"],
    index: 2,
    total: 5,
    href: "/markets/interiors/",
    image: {
      src: `${IMG}/12_Block-52_Madison-by-Lennar-1280x873-c-default.webp`,
      alt: "Interiors",
      width: 1280,
      height: 873,
    },
    mainColor: "#925434",
    contentColor: "#ffffff",
  },
  {
    slug: "higher-education",
    // The double space is in the source and drives the two-line wrap.
    title: "Higher  Education",
    subtitle: ["Architecture for", "academic community"],
    index: 3,
    total: 5,
    href: "/markets/higher-education/",
    image: {
      src: `${IMG}/lpas_image-13-1280x794-c-default.webp`,
      alt: "Higher Education",
      width: 1280,
      height: 794,
    },
    mainColor: "#c9d3df",
    contentColor: "#111111",
  },
  {
    slug: "civic",
    title: "Civic",
    subtitle: ["Architecture in", "service"],
    index: 4,
    total: 5,
    href: "/markets/civic/",
    image: {
      src: `${IMG}/16_316-Vernon-1280x854-c-default.webp`,
      alt: "Civic",
      width: 1280,
      height: 854,
    },
    mainColor: "#707569",
    contentColor: "#ffffff",
  },
  {
    slug: "commercial",
    title: "Commercial",
    subtitle: ["Design for", "business value"],
    index: 5,
    total: 5,
    href: "/markets/commercial/",
    image: {
      src: `${IMG}/20_UCDH_Folsom-MOB_FULLSIZE-1280x854-c-default.webp`,
      alt: "Commercial",
      width: 1280,
      height: 854,
    },
    mainColor: "#e3c1aa",
    contentColor: "#111111",
  },
];

export const INTRO_BLOCK = {
  title: "Clear Process. Creative Results. Human Centered. Always Curious.",
  // The double space between "Plan." and "Analyze." is in the source.
  tagline: "Listen. Plan.  Analyze. Shape.",
  text: "At LPAS, we design with people at the center and purpose at every turn. We believe great architecture starts by listening, truly listening, to the communities, students, families, and leaders who will live, learn, and grow in the spaces we create. Our process is open, honest, and relentlessly collaborative.",
  cta: { label: "More about us", href: "/about/" },
};

export const PORTFOLIO_FILTERS: PortfolioFilterItem[] = [
  { label: "Housing", count: 27, href: "/portfolio/?market=housing" },
  { label: "Interiors", count: 13, href: "/portfolio/?market=interiors" },
  { label: "Higher Education", count: 12, href: "/portfolio/?market=higher-education" },
  { label: "Civic", count: 6, href: "/portfolio/?market=civic" },
  { label: "Commercial", count: 14, href: "/portfolio/?market=commercial" },
];

/** Row one: one large tile left, two small tiles stacked right. */
export const PROJECTS_ROW_ONE: ProjectCard[] = [
  {
    title: "Las Positas College Academic Support Building",
    location: "Livermore, CA",
    href: "/portfolio/las-positas-college-academic-support-building/",
    image: {
      src: `${IMG}/05_LAS-POSITAS-COLLEGE-ACADEMIC-SUPPORT-1280x800-c-default.webp`,
      alt: "Las Positas College Academic Support Building",
      width: 1280,
      height: 800,
    },
    size: "large",
  },
  {
    title: "Prospera at Fiddyment Ranch",
    location: "Roseville, CA",
    href: "/portfolio/prospera-at-fiddyment-ranch/",
    image: {
      src: `${IMG}/DJI_0490_1-1280x800-c-default.webp`,
      alt: "Prospera at Fiddyment Ranch",
      width: 1280,
      height: 800,
    },
    size: "small",
  },
  {
    title: "UC Davis Health Folsom Medical Care Clinic",
    location: "Folsom, CA",
    href: "/portfolio/uc-davis-health-folsom-medical-care-clinic/",
    image: {
      src: `${IMG}/18_UCDH_Folsom-MOB_FULLSIZE-1280x800-c-default.webp`,
      alt: "UC Davis Health Folsom Medical Care Clinic",
      width: 1280,
      height: 800,
    },
    size: "small",
  },
];

/** Row two mirrors row one: two small tiles left, one large tile right. */
export const PROJECTS_ROW_TWO: ProjectCard[] = [
  {
    title: "The Frederic",
    location: "Sacramento, CA",
    href: "/portfolio/the-frederic/",
    image: {
      src: `${IMG}/05_FREDERIC_Storefront-1280x800-c-default.webp`,
      alt: "The Frederic",
      width: 1280,
      height: 800,
    },
    size: "small",
  },
  {
    title: "California Highway Patrol Truckee Field Office",
    location: "Truckee, CA",
    href: "/portfolio/california-highway-patrol-truckee-field-office/",
    image: {
      src: `${IMG}/02_CHP-Truckee-1280x800-c-default.webp`,
      alt: "California Highway Patrol Truckee Field Office",
      width: 1280,
      height: 800,
    },
    size: "small",
  },
  {
    title: "The Emery",
    location: "Emeryville, CA",
    href: "/portfolio/the-emery/",
    image: {
      src: `${IMG}/11_The-Emery-1280x800-c-default.webp`,
      alt: "The Emery",
      width: 1280,
      height: 800,
    },
    size: "large",
  },
];

export const LATEST_UPDATES: LatestUpdate[] = [
  {
    title: "Instagram: 21 May 2026",
    excerpt:
      "We are proud to share that Pleasant Grove Apartments received the Affordable Housing Development of the Year award at the @sachousingalliance Annual Night of Champions event.",
    date: "05.21.26",
    href: "https://www.instagram.com/p/DYnEV_MCaDg/",
    image: {
      src: `${IMG}/705860006_18427634425120770_8881473772530157572_n-1000x1000-c-default.webp`,
      alt: "Pleasant Grove Apartments",
      width: 1000,
      height: 1000,
    },
  },
  {
    title: "Instagram: 12 May 2026",
    excerpt:
      "LPAS will be at the DBIA-WPR 2026 Education Summit & Awards May 17-20 in Scottsdale. Please say hello!",
    date: "05.12.26",
    href: "https://www.instagram.com/p/DYPz1AVicrN/",
    image: {
      src: `${IMG}/690281835_18426242710120770_3696790314565088558_n-1000x1000-c-default.webp`,
      alt: "DBIA-WPR 2026 Education Summit",
      width: 1000,
      height: 1000,
    },
  },
  {
    title: "Instagram: 26 Mar 2026",
    excerpt:
      "We’ll be at the Tradeline College & University Facilities 2026 Conference March 30-31. Say hello!",
    date: "03.26.26",
    href: "https://www.instagram.com/p/DWXNFWSEmi4/",
    image: {
      src: `${IMG}/656239942_18419359891120770_8400189846813213265_n-1000x1000-c-default.webp`,
      alt: "Tradeline College & University Facilities 2026 Conference",
      width: 1000,
      height: 1000,
    },
  },
  {
    title: "Instagram: 17 Mar 2026",
    excerpt:
      "We’ll be at the Housing California Annual Conference this week—if you’ll be there, let’s plan to connect!",
    date: "03.17.26",
    href: "https://www.instagram.com/p/DWASV2TD3bJ/",
    image: {
      src: `${IMG}/653667598_18417016015120770_3431999040994783478_n-1000x1000-c-default.webp`,
      alt: "Housing California Annual Conference",
      width: 1000,
      height: 1000,
    },
  },
  {
    title: "Instagram: 13 Mar 2026",
    excerpt:
      "Our new website is live. We reimagined the site to better reflect how we work and what sets LPAS apart. Our process is front and center, showing how programming, stakeholder engagement, and technical precision guide every project from the first conversation through construction.",
    date: "03.13.26",
    href: "https://www.instagram.com/p/DV1dMSGFFGl/",
    image: {
      src: `${IMG}/650368596_18416242555120770_3751658863105406351_n-1000x1250-c-default.webp`,
      alt: "New LPAS website",
      width: 1000,
      height: 1250,
    },
  },
  {
    title: "Instagram: 06 Mar 2026",
    excerpt:
      "Happy Women in Construction Week! Today we’re celebrating the incredible women on our team…our talented architects, creative interior designers, and the dedicated professionals who keep everything running behind the scenes.",
    date: "03.06.26",
    href: "https://www.instagram.com/p/DVjXotGlEFs/",
    image: {
      src: `${IMG}/645917596_18415092919120770_3490576865802946849_n-1000x1000-c-default.webp`,
      alt: "Women in Construction Week",
      width: 1000,
      height: 1000,
    },
  },
];

export const MARKET_LINKS: NavLink[] = [
  { label: "Housing", href: "/markets/housing/" },
  { label: "Interiors", href: "/markets/interiors/" },
  { label: "Higher Education", href: "/markets/higher-education/" },
  { label: "Civic", href: "/markets/civic/" },
  { label: "Commercial", href: "/markets/commercial/" },
];

export const EXPLORE_GROUP: NavGroup = {
  title: "Explore our",
  items: [{ label: "Portfolio", href: "/portfolio/" }],
};

export const COMPANY_GROUP: NavGroup = {
  title: "Company",
  items: [
    { label: "Latest Updates", href: "/latest/" },
    { label: "About", href: "/about/" },
    { label: "Culture", href: "/culture/" },
    { label: "Careers", href: "/careers/" },
    { label: "Contact", href: "/contact/" },
  ],
};

export const SOCIAL_LINKS: NavLink[] = [
  { label: "Instagram", href: "https://www.instagram.com/lpas.design" },
  { label: "Linkedin", href: "https://www.linkedin.com/company/lpas-architecture-design" },
  { label: "Facebook", href: "https://www.facebook.com/LPAS-Architecture-Design" },
];

export const OFFICES: OfficeContact[] = [
  {
    label: "Sacramento",
    address: ["723 S Street, Suite 150", "Sacramento, CA 95811"],
    phone: "916 443 0335",
    phoneHref: "tel:916-443-0335",
    mapHref: "https://maps.google.com/?q=723+S+Street+Suite+150+Sacramento+CA+95811",
    email: "ContactUs@lpas.com",
  },
  {
    label: "Oakland",
    address: ["10 Clay Street, Suite 250", "Oakland, CA 94607"],
    phone: "415 213 0335",
    phoneHref: "tel:415-213-0335",
    mapHref: "https://maps.google.com/?q=10+Clay+Street+Suite+250+Oakland+CA+94607",
    email: "ContactUs@lpas.com",
  },
];

export const FOOTER_IMAGE = {
  src: `${IMG}/12_Block-52_Madison-by-Lennar-1600x1091-c-default.webp`,
  alt: "Block 52 Madison by Lennar",
  width: 1600,
  height: 1091,
};

/**
 * The preloader wordmark. The source splits each word into a large leading
 * letter and the remainder, which is what produces the "L isten / P lan"
 * look — the capitals spell LPAS.
 */
export const PRELOADER_WORDS: Array<[string, string]> = [
  ["L", "isten"],
  ["P", "lan"],
  ["A", "nalyze"],
  ["S", "hape"],
];

export const FOOTER_COPYRIGHT = "© 2026. All rights reserved.";
export const FOOTER_BACK_TO_TOP = "Back to top";
export const FOOTER_CREDIT = { prefix: "Website by", label: "Naam", href: "https://studionaam.com" };
