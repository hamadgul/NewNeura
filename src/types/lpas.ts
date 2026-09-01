/**
 * Content contracts for the lpas.com homepage clone.
 * site-key `lpas-com-76f4f1fd` · page-key `root-8a5edab2`
 *
 * These mirror the shapes the source page actually renders, so component props
 * stay close to the original markup rather than inventing an abstraction.
 */

/** The five market categories that drive the hero card strip. */
export type MarketSlug = "housing" | "interiors" | "higher-education" | "civic" | "commercial";

/**
 * One card in the horizontally-scrolling hero strip.
 *
 * `mainColor` / `contentColor` correspond to the source's `--marketMainColor`
 * and `--marketContentColor` custom properties, set per card.
 */
export interface HeroMarketCard {
  slug: MarketSlug;
  /** Card heading, e.g. "Higher Education". */
  title: string;
  /** Right-aligned descriptor, split across two lines exactly as the source does. */
  subtitle: [string, string];
  /** 1-based position, rendered as "N / 5". */
  index: number;
  total: number;
  href: string;
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  /** Card ground colour (`--marketMainColor`). */
  mainColor: string;
  /** Text/icon colour on that ground (`--marketContentColor`). */
  contentColor: string;
  /** Only Housing has these; every other card renders none. */
  subPages?: Array<{ title: string; href: string }>;
}

/** A project tile in the "A selection of our work" grid. */
export interface ProjectCard {
  title: string;
  location: string;
  href: string;
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  /** `large` = 665×471 hero tile, `small` = 328×260 stacked tile. */
  size: "large" | "small";
}

/** A market pill with its project count in the portfolio filter row. */
export interface PortfolioFilterItem {
  label: string;
  count: number;
  href: string;
}

/** A row in the "Latest updates" list, with the image revealed on hover. */
export interface LatestUpdate {
  title: string;
  excerpt: string;
  /** Pre-formatted by the source as MM.DD.YY. */
  date: string;
  href: string;
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
}

/** A navigation entry used by both the menu overlay and the footer. */
export interface NavLink {
  label: string;
  href: string;
}

/** A titled group of navigation entries. */
export interface NavGroup {
  title: string;
  items: NavLink[];
}

/** One of the two office blocks in the menu overlay and footer. */
export interface OfficeContact {
  /** City label, e.g. "Sacramento". */
  label: string;
  /** Street address lines, rendered one per line. */
  address: string[];
  phone: string;
  /** `tel:` target for `phone`. */
  phoneHref: string;
  mapHref: string;
  email: string;
}
