/**
 * Content for `/portfolio/` (page-key `portfolio-81ee5030`).
 *
 * Everything here is verbatim from the recon capture — never retyped:
 *  - `PORTFOLIO_PROJECTS` is the complete 71-row feed of
 *    `docs/research/lpas-com-76f4f1fd/portfolio-81ee5030/PROJECTS_DATASET.json`, i.e. the
 *    whole of `/wp-json/filter/projects?per_page=100`. The source pages it 14 at
 *    a time; `CollectionProjects` does the same client-side over this array,
 *    which is why the full collection has to ship, not just page 1.
 *  - Card `src` is the 1280w entry of each row's srcset, downloaded to this
 *    page's asset namespace under its own basename.
 *  - Every `width`/`height` comes from
 *    `docs/research/lpas-com-76f4f1fd/IMAGE_DIMENSIONS.json`, which records each
 *    downloaded file's true decoded size. CONTENT.json's own w/h are NOT usable
 *    for this: they capture whichever srcset variant lazysizes happened to have
 *    loaded, not the intrinsic size, so feeding them to `next/image` would set
 *    wrong aspect ratios. (All 71 cards resolve to 1280x800; the header and the
 *    two highlight banners to 1440x960.)
 *  - `markets` carries the project's own taxonomy terms (sub-markets included)
 *    and `topMarkets` the five top-tier slugs, because the filter is
 *    hierarchical: Housing's 27 is the sum of its four children, so a
 *    top-tier pill can only be matched through `topMarkets`.
 *
 * The filter config itself is NOT redeclared here — `CollectionProjects`
 * exports the measured `PORTFOLIO_MARKET_FILTERS` (housing 27 / interiors 13 /
 * higher-education 12 / civic 6 / commercial 14, and the four housing
 * sub-markets 6/3/13/5) and the page uses that default.
 */
import type {
  CollectionProjectsHighlight,
  CollectionProjectsProject,
} from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/CollectionProjects";
import type { BlockHeaderPortfolioProps } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockHeaderPortfolio";

const IMAGES = "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images";

/** Exact strings from CONTENT.json — the source serves this title unsuffixed. */
export const PORTFOLIO_TITLE = "LPAS — Portfolio";
export const PORTFOLIO_CANONICAL = "https://lpas.com/portfolio/";
/** The source ships no meta description on this page (`metaDescription: null`). */
export const PORTFOLIO_OG_IMAGE = `${IMAGES}/25_UCD-Pitzer-Center-1440x960-c-default.webp`;

/**
 * Header — eyebrow / label / title exactly as the block's builder measured them
 * ("Our Work" · "Overview" · "Portfolio"), over the 1440x960 Pitzer Center
 * backdrop, which is this page's LCP element.
 */
export const PORTFOLIO_HEADER: BlockHeaderPortfolioProps = {
  eyebrow: "Our Work",
  label: "Overview",
  title: "Portfolio",
  image: {
    src: `${IMAGES}/25_UCD-Pitzer-Center-1440x960-c-default.webp`,
    alt: "",
    width: 1440,
    height: 960,
  },
};

/**
 * The two interleaved banner cards, in source order (after targetOne and after
 * targetTwo). They are page furniture, not results — the source excludes both
 * from the feed via `&exclude=`, and `CollectionProjects` reproduces that by
 * dropping any project whose href matches a highlight.
 */
export const PORTFOLIO_HIGHLIGHTS: CollectionProjectsHighlight[] = [
  {
    title: "Prospera at Fiddyment Ranch",
    location: "Roseville, CA",
    href: "/portfolio/prospera-at-fiddyment-ranch/",
    image: {
      src: `${IMAGES}/DJI_0490_1-1440x960-c-default.webp`,
      alt: "",
      width: 1440,
      height: 960,
    },
  },
  {
    title: "American River College Student Center & Cafeteria",
    location: "Sacramento, CA",
    href: "/portfolio/american-river-college-student-center-cafeteria/",
    image: {
      src: `${IMAGES}/02_ARC-Student-Center_Extr-1440x960-c-default.webp`,
      alt: "",
      width: 1440,
      height: 960,
    },
  },
];

/** All 71 projects, in the feed order the source returns them. */
export const PORTFOLIO_PROJECTS: CollectionProjectsProject[] = [
  {
    title: "The Frederic",
    href: "/portfolio/the-frederic/",
    location: "Sacramento, CA",
    markets: ["market-rate-housing"],
    topMarkets: ["housing"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/05_FREDERIC_Storefront-1280x800-c-default.jpg",
      alt: "The Frederic",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "Iron Point",
    href: "/portfolio/iron-point/",
    location: "Folsom, CA",
    markets: ["interiors"],
    topMarkets: ["interiors"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/LeasingView_REVISEDAUG24-1280x800-c-default.jpg",
      alt: "Iron Point",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "The Emery",
    href: "/portfolio/the-emery/",
    location: "Emeryville, CA",
    markets: ["market-rate-housing"],
    topMarkets: ["housing"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/11_The-Emery-1280x800-c-default.jpg",
      alt: "The Emery",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "UC Berkeley Wu Performance Hall Renovation",
    href: "/portfolio/uc-berkeley-wu-performance-hall-renovation/",
    location: "Berkeley, CA",
    markets: ["higher-education"],
    topMarkets: ["higher-education"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/01_UCB_Wu-Performance-Hall-1280x800-c-default.jpg",
      alt: "UC Berkeley Wu Performance Hall Renovation",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "UC Davis Ann E. Pitzer Center Classroom & Recital Hall",
    href: "/portfolio/uc-davis-ann-e-pitzer-center-classroom-recital-hall/",
    location: "Davis, CA",
    markets: ["higher-education"],
    topMarkets: ["higher-education"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/22_UCD-Pitzer-Center-1280x800-c-default.jpg",
      alt: "UC Davis Ann E. Pitzer Center Classroom & Recital Hall",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "Elegance Hamilton Hill",
    href: "/portfolio/elegance-hamilton-hill/",
    location: "Novato, CA",
    markets: ["senior-housing"],
    topMarkets: ["housing"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/02_Elegance-Hamilton-Hill_Novato-1280x800-c-default.jpg",
      alt: "Elegance Hamilton Hill",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "Tower 222",
    href: "/portfolio/tower-222/",
    location: "San Pedro, CA",
    markets: ["interiors"],
    topMarkets: ["interiors"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/Lobby-1-copy-1280x800-c-default.jpg",
      alt: "Tower 222",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "Gio Apartments",
    href: "/portfolio/gio-apartments/",
    location: "Sacramento, CA",
    markets: ["market-rate-housing"],
    topMarkets: ["housing"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/06_Gio-1280x800-c-default.jpg",
      alt: "Gio Apartments",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "UC Davis Health Folsom Medical Care Clinic",
    href: "/portfolio/uc-davis-health-folsom-medical-care-clinic/",
    location: "Folsom, CA",
    markets: ["commercial"],
    topMarkets: ["commercial"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/18_UCDH_Folsom-MOB_FULLSIZE-1280x800-c-default.jpg",
      alt: "UC Davis Health Folsom Medical Care Clinic",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "730 I Street",
    href: "/portfolio/730-i-street/",
    location: "Sacramento, CA",
    markets: ["interiors"],
    topMarkets: ["interiors"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/12_CapRadio-730-I-Street-1280x800-c-default.jpg",
      alt: "730 I Street",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "The Ohlone College Building 5 Renovation",
    href: "/portfolio/the-ohlone-college-building-5-renovation/",
    location: "Fremont, CA",
    markets: ["higher-education"],
    topMarkets: ["higher-education"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/08_Ohlone-College-Building-5-Renovation-1280x800-c-default.jpg",
      alt: "The Ohlone College Building 5 Renovation",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "Alwell Pleasant Hill",
    href: "/portfolio/alwell-pleasant-hill/",
    location: "Pleasant Hill, CA",
    markets: ["market-rate-housing"],
    topMarkets: ["housing"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/08_Alwell_FULLSIZE-1280x800-c-default.jpg",
      alt: "Alwell Pleasant Hill",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "Reyes Coca-Cola",
    href: "/portfolio/reyes-coca-cola/",
    location: "Fresno, CA",
    markets: ["interiors"],
    topMarkets: ["interiors"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/BOARDROOM-1280x800-c-default.jpg",
      alt: "Reyes Coca-Cola",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "The A.J.",
    href: "/portfolio/the-a-j/",
    location: "Sacramento, CA",
    markets: ["interiors", "market-rate-housing"],
    topMarkets: ["interiors", "housing"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/02_The-AJ_FULLSIZE-1280x800-c-default.jpg",
      alt: "The A.J.",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "Sonrisa Senior Living",
    href: "/portfolio/sonrisa-senior-living/",
    location: "Roseville, CA",
    markets: ["senior-housing"],
    topMarkets: ["housing"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/04_SONRISA-1280x800-c-default.jpg",
      alt: "Sonrisa Senior Living",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "West Valley–Mission Public Safety Building",
    href: "/portfolio/west-valley-mission-community-college-district-public-safety-community-services-building/",
    location: "Saratoga, CA",
    markets: ["higher-education"],
    topMarkets: ["higher-education"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/03_West-Valley-College-Public-Safety-1280x800-c-default.jpg",
      alt: "West Valley–Mission Public Safety Building",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "CSU Stanislaus Residences Village 4",
    href: "/portfolio/csu-stanislaus-residences-village-4/",
    location: "Turlock, CA",
    markets: ["student-housing"],
    topMarkets: ["housing"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/CSU-Stanislaus-ASH-Residence_05-1280x800-c-default.jpg",
      alt: "CSU Stanislaus Residences Village 4",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "West Valley-Mission Community College District Housing Initiative",
    href: "/portfolio/west-valley-mission-community-college-district-housing-initiative/",
    location: "Santa Clara, CA",
    markets: ["student-housing"],
    topMarkets: ["housing"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/WVM-Student-Housing_01-1280x800-c-default.jpg",
      alt: "West Valley-Mission Community College District Housing Initiative",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "Chroma at Innovation Condominiums",
    href: "/portfolio/chroma-at-innovation-condominiums/",
    location: "Fremont, CA",
    markets: ["market-rate-housing"],
    topMarkets: ["housing"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/11_Chroma_Warm-Springs-Condos-1280x800-c-default.jpg",
      alt: "Chroma at Innovation Condominiums",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "Madison by Lennar Condominiums",
    href: "/portfolio/madison-by-lennar-condominiums/",
    location: "San Francisco, CA",
    markets: ["market-rate-housing"],
    topMarkets: ["housing"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/09_Block-52_Madison-by-Lennar-1280x800-c-default.jpg",
      alt: "Madison by Lennar Condominiums",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "Hawkins Interiors",
    href: "/portfolio/hawkins-interiors/",
    location: "San Francisco, CA",
    markets: ["interiors"],
    topMarkets: ["interiors"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/Hawkins-Interiors_Lennar-126-1280x800-c-default.jpg",
      alt: "Hawkins Interiors",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "Sacramento State Faculty & Staff Housing",
    href: "/portfolio/sacramento-state-faculty-staff-housing/",
    location: "Sacramento, CA",
    markets: ["student-housing"],
    topMarkets: ["housing"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/04_CSUS-Faculty-Housing-1280x800-c-default.jpg",
      alt: "Sacramento State Faculty & Staff Housing",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "Cosumnes River College College Center Expansion",
    href: "/portfolio/cosumnes-river-college-college-center-expansion/",
    location: "Sacramento, CA",
    markets: ["higher-education"],
    topMarkets: ["higher-education"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/03_Cosumnes-River-College-1280x800-c-default.jpg",
      alt: "Cosumnes River College College Center Expansion",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "17th & Broadway Interiors",
    href: "/portfolio/17th-broadway-interiors/",
    location: "Oakland, CA",
    markets: ["interiors"],
    topMarkets: ["interiors"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/68_17th-Broadway-1280x800-c-default.jpg",
      alt: "17th & Broadway Interiors",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "USCB Call Center",
    href: "/portfolio/uscb-call-center/",
    location: "Elk Grove, CA",
    markets: ["commercial"],
    topMarkets: ["commercial"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/10_USCB-Call-Center-1280x800-c-default.jpg",
      alt: "USCB Call Center",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "Sunrise Pointe",
    href: "/portfolio/sunrise-pointe/",
    location: "Citrus Heights, CA",
    markets: ["affordable-housing"],
    topMarkets: ["housing"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/Sunrise-Pointe_25-1280x800-c-default.jpg",
      alt: "Sunrise Pointe",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "Las Positas College Academic Support Building",
    href: "/portfolio/las-positas-college-academic-support-building/",
    location: "Livermore, CA",
    markets: ["higher-education"],
    topMarkets: ["higher-education"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/05_LAS-POSITAS-COLLEGE-ACADEMIC-SUPPORT-1280x800-c-default.jpg",
      alt: "Las Positas College Academic Support Building",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "19th & Harrison Apartments",
    href: "/portfolio/19th-harrison-apartments/",
    location: "Oakland, CA",
    markets: ["market-rate-housing"],
    topMarkets: ["housing"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/07_19th-Harrison_Jason-ORear-1280x800-c-default.jpg",
      alt: "19th & Harrison Apartments",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "980 Central",
    href: "/portfolio/980-central/",
    location: "West Sacramento, CA",
    markets: ["market-rate-housing"],
    topMarkets: ["housing"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/04_980-Central-1280x800-c-default.jpg",
      alt: "980 Central",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "100 Howe Tenant Improvement",
    href: "/portfolio/100-howe-tenant-improvement/",
    location: "Sacramento, CA",
    markets: ["commercial"],
    topMarkets: ["commercial"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/02_100-HOWE-1280x800-c-default.jpg",
      alt: "100 Howe Tenant Improvement",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "16 Powerhouse",
    href: "/portfolio/16-powerhouse/",
    location: "Sacramento, CA",
    markets: ["market-rate-housing"],
    topMarkets: ["housing"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/05_16-Powerhouse-1280x800-c-default.jpg",
      alt: "16 Powerhouse",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "University of the Pacific Elmsn",
    href: "/portfolio/university-of-the-pacific-elmsn/",
    location: "Sacramento, CA",
    markets: ["higher-education"],
    topMarkets: ["higher-education"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/09_UOP-ELMSN-Program-Classroom-Lab-1280x800-c-default.jpg",
      alt: "University of the Pacific Elmsn",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "2020 Gateway",
    href: "/portfolio/2020-gateway/",
    location: "Sacramento, CA",
    markets: ["commercial"],
    topMarkets: ["commercial"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/30_2020-Gateway_Exterior-1280x800-c-default.jpg",
      alt: "2020 Gateway",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "800J Lofts Lobby Renovation",
    href: "/portfolio/800j-lofts-lobby-renovation/",
    location: "Sacramento, CA",
    markets: ["interiors"],
    topMarkets: ["interiors"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/02_800J-Lobby-1280x800-c-default.jpg",
      alt: "800J Lofts Lobby Renovation",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "Pleasant Grove Apartments",
    href: "/portfolio/pleasant-grove-apartments/",
    location: "Roseville, CA",
    markets: ["affordable-housing"],
    topMarkets: ["housing"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/View_02-1280x800-c-default.jpg",
      alt: "Pleasant Grove Apartments",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "American River College Student Center & Cafeteria",
    href: "/portfolio/american-river-college-student-center-cafeteria/",
    location: "Sacramento, CA",
    markets: ["higher-education"],
    topMarkets: ["higher-education"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/02_ARC-Student-Center_Extr-1280x800-c-default.jpg",
      alt: "American River College Student Center & Cafeteria",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "Ansel Park Senior Living",
    href: "/portfolio/ansel-park-senior-living/",
    location: "Rocklin, CA",
    markets: ["senior-housing"],
    topMarkets: ["housing"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/12_Ansel-Park_Jason-ORear_hi-res-1280x800-c-default.jpg",
      alt: "Ansel Park Senior Living",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "LPAS Headquarters",
    href: "/portfolio/lpas-headquarters/",
    location: "Sacramento, CA",
    markets: ["commercial"],
    topMarkets: ["commercial"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/03_LPAS-723-S-Street-Headquarters-1280x800-c-default.jpg",
      alt: "LPAS Headquarters",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "Parker",
    href: "/portfolio/parker/",
    location: "Berkeley, CA",
    markets: ["market-rate-housing"],
    topMarkets: ["housing"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/03_Parker-1280x800-c-default.jpg",
      alt: "Parker",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "The 1960",
    href: "/portfolio/the-1960/",
    location: "Walnut Creek, CA",
    markets: ["market-rate-housing"],
    topMarkets: ["housing"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/01_AVE-Walnut-Creek-1280x800-c-default.jpg",
      alt: "The 1960",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "Aya Interiors",
    href: "/portfolio/aya-interiors/",
    location: "Fremont, CA",
    markets: ["interiors"],
    topMarkets: ["interiors"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/04_AYA-1280x800-c-default.jpg",
      alt: "Aya Interiors",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "California Highway Patrol Headquarters",
    href: "/portfolio/california-highway-patrol-headquarters/",
    location: "Sacramento, CA",
    markets: ["civic"],
    topMarkets: ["civic"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/10_CHP-Headquarters-1280x800-c-default.jpg",
      alt: "California Highway Patrol Headquarters",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "California Highway Patrol Truckee Field Office",
    href: "/portfolio/california-highway-patrol-truckee-field-office/",
    location: "Truckee, CA",
    markets: ["civic"],
    topMarkets: ["civic"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/02_CHP-Truckee-1280x800-c-default.jpg",
      alt: "California Highway Patrol Truckee Field Office",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "Bruceville Point",
    href: "/portfolio/bruceville-point/",
    location: "Elk Grove, CA",
    markets: ["senior-housing"],
    topMarkets: ["housing"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/33_Bruceville-Point-Exterior_FAVORITE-1280x800-c-default.jpg",
      alt: "Bruceville Point",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "California Lottery Headquarters",
    href: "/portfolio/california-lottery-headquarters/",
    location: "Sacramento, CA",
    markets: ["commercial"],
    topMarkets: ["commercial"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/08_CA-Lottery-Headquarter_bldg-1280x800-c-default.jpg",
      alt: "California Lottery Headquarters",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "Capitol 650 Interiors",
    href: "/portfolio/capitol-650-interiors/",
    location: "Milpitas, CA",
    markets: ["interiors"],
    topMarkets: ["interiors"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/13b_Capitol-650-1280x800-c-default.jpg",
      alt: "Capitol 650 Interiors",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "On Broadway",
    href: "/portfolio/on-broadway/",
    location: "Sacramento, CA",
    markets: ["affordable-housing"],
    topMarkets: ["housing"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/Night_01-1280x800-c-default.jpg",
      alt: "On Broadway",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "Carlton Plaza of Elk Grove",
    href: "/portfolio/carlton-plaza-of-elk-grove/",
    location: "Elk Grove, CA",
    markets: ["senior-housing"],
    topMarkets: ["housing"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/01_Carlton-Plaza-Elk-Grove-1280x800-c-default.jpg",
      alt: "Carlton Plaza of Elk Grove",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "City College of San Francisco Diego Rivera Theater Criteria Document",
    href: "/portfolio/city-college-of-san-francisco-diego-rivera-theater-criteria-document/",
    location: "San Francisco, CA",
    markets: ["higher-education"],
    topMarkets: ["higher-education"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/Concert-hall-1280x800-c-default.jpg",
      alt: "City College of San Francisco Diego Rivera Theater Criteria Document",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "316 Vernon Street Office",
    href: "/portfolio/316-vernon-street/",
    location: "Roseville, CA",
    markets: ["civic"],
    topMarkets: ["civic"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/19_316-Vernon-1280x800-c-default.jpg",
      alt: "316 Vernon Street Office",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "Elk Grove Commons",
    href: "/portfolio/elk-grove-commons/",
    location: "Elk Grove, CA",
    markets: ["commercial"],
    topMarkets: ["commercial"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/13_Elk-Grove-Commons-1280x800-c-default.jpg",
      alt: "Elk Grove Commons",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "LPAS Headquarters",
    href: "/portfolio/lpas-headquarters-int/",
    location: "Sacramento, CA",
    markets: ["interiors"],
    topMarkets: ["interiors"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/03_LPAS-723-S-Street-Headquarters-1280x800-c-default.jpg",
      alt: "LPAS Headquarters",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "Nellie Hannon Gateway",
    href: "/portfolio/nellie-hannon-gateway-affordable-housing/",
    location: "Emeryville, CA",
    markets: ["affordable-housing"],
    topMarkets: ["housing"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/37th-San-Pabo-corner_night_2-1280x800-c-default.jpg",
      alt: "Nellie Hannon Gateway",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "Harris Center for the Arts",
    href: "/portfolio/harris-center-for-the-arts/",
    location: "Folsom, CA",
    markets: ["higher-education"],
    topMarkets: ["higher-education"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/01_FLC-Harris-Center_Three-Stages-1280x800-c-default.jpg",
      alt: "Harris Center for the Arts",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "Laguna Springs Professional Center Phase 4",
    href: "/portfolio/laguna-springs-professional-center-phase-4/",
    location: "Elk Grove, CA",
    markets: ["commercial"],
    topMarkets: ["commercial"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/10_Laguna-Springs-Phase-4-1280x800-c-default.jpg",
      alt: "Laguna Springs Professional Center Phase 4",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "Capitol Avenue Garage",
    href: "/portfolio/capitol-avenue-garage/",
    location: "Sacramento, CA",
    markets: ["commercial"],
    topMarkets: ["commercial"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/12_Capitol-Avenue-Garage-1280x800-c-default.jpg",
      alt: "Capitol Avenue Garage",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "Yolo Federal Credit Union",
    href: "/portfolio/yolo-federal-credit-union/",
    location: "Davis, CA",
    markets: ["commercial"],
    topMarkets: ["commercial"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/IMG_4516-1280x800-c-default.jpg",
      alt: "Yolo Federal Credit Union",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "Solano Transportation Authority",
    href: "/portfolio/solano-transportation-authority/",
    location: "Suisun City, CA",
    markets: ["civic"],
    topMarkets: ["civic"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/07_STA-HQ-1280x800-c-default.jpg",
      alt: "Solano Transportation Authority",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "Lake Tahoe Community College Renovations for Efficiency",
    href: "/portfolio/lake-tahoe-community-college-renovations-for-efficiency/",
    location: "South Lake Tahoe, CA",
    markets: ["higher-education"],
    topMarkets: ["higher-education"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/07_LTCC-RFE-1280x800-c-default.jpg",
      alt: "Lake Tahoe Community College Renovations for Efficiency",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "Krush Burger",
    href: "/portfolio/krush-burger/",
    location: "Sacramento, CA",
    markets: ["commercial"],
    topMarkets: ["commercial"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/01_Krush-Burger-1280x800-c-default.jpg",
      alt: "Krush Burger",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "Oak Grove Apartments",
    href: "/portfolio/oak-grove-affordable-housing/",
    location: "Vacaville, CA",
    markets: ["affordable-housing"],
    topMarkets: ["housing"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/View_03-1280x800-c-default.jpg",
      alt: "Oak Grove Apartments",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "Prospera at Fiddyment Ranch",
    href: "/portfolio/prospera-at-fiddyment-ranch/",
    location: "Roseville, CA",
    markets: ["affordable-housing"],
    topMarkets: ["housing"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/DJI_0490_1-1280x800-c-default.jpg",
      alt: "Prospera at Fiddyment Ranch",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "Market West",
    href: "/portfolio/market-west/",
    location: "Sacramento, CA",
    markets: ["commercial"],
    topMarkets: ["commercial"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/MG_0672-1280x800-c-default.jpg",
      alt: "Market West",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "McClellan Jet Services FBO",
    href: "/portfolio/mcclellan-jet-services-fbo/",
    location: "McClellan Park, CA",
    markets: ["interiors"],
    topMarkets: ["interiors"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/08_McClellan-Jet-Services-FBO_FULLSIZE-1280x800-c-default.jpg",
      alt: "McClellan Jet Services FBO",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "Solano Community College Theater Renovation and Addition.",
    href: "/portfolio/solano-community-college-theater-renovation-and-addition/",
    location: "Fairfield, CA",
    markets: ["higher-education"],
    topMarkets: ["higher-education"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/24_Solano-College-Theater-1280x800-c-default.jpg",
      alt: "Solano Community College Theater Renovation and Addition.",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "Murphy Station Apartments",
    href: "/portfolio/murphy-station-apartments/",
    location: "Sunnyvale, CA",
    markets: ["market-rate-housing"],
    topMarkets: ["housing"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/25_Murphy-Station_Daniel-Gaines-1280x800-c-default.jpg",
      alt: "Murphy Station Apartments",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "Novo Interiors",
    href: "/portfolio/novo-interiors/",
    location: "Mountain View, CA",
    markets: ["interiors"],
    topMarkets: ["interiors"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/01_NOVO-1280x800-c-default.jpg",
      alt: "Novo Interiors",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "R Street Market",
    href: "/portfolio/r-street-market/",
    location: "Sacramento, CA",
    markets: ["commercial"],
    topMarkets: ["commercial"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/06_R-Street_Edited-1280x800-c-default.jpg",
      alt: "R Street Market",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "RagingWire CA3",
    href: "/portfolio/ragingwire-ca3/",
    location: "Sacramento, CA",
    markets: ["commercial"],
    topMarkets: ["commercial"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/46_RagingWire-CA3-1280x800-c-default.jpg",
      alt: "RagingWire CA3",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "Tehama County Courthouse",
    href: "/portfolio/tehama-county-courthouse/",
    location: "Red Bluff, CA",
    markets: ["civic"],
    topMarkets: ["civic"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/20_Tehama-County-Courthouse-edited-1280x800-c-default.jpg",
      alt: "Tehama County Courthouse",
      width: 1280,
      height: 800,
    },
  },
  {
    title: "California Department of Corrections and Rehabilitation Headquarters",
    href: "/portfolio/cdcr-headquarters/",
    location: "Elk Grove, CA",
    markets: ["civic"],
    topMarkets: ["civic"],
    image: {
      src: "/sites/lpas-com-76f4f1fd/portfolio-81ee5030/images/04_CDCR-Headquarters-1280x800-c-default.jpg",
      alt: "California Department of Corrections and Rehabilitation Headquarters",
      width: 1280,
      height: 800,
    },
  },
];
