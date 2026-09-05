/**
 * Content contracts for the neuragul.com site.
 *
 * These mirror the shapes the page templates actually render, so component
 * props stay close to the markup rather than inventing an abstraction.
 */

/** The five service lines that drive the hero card strip. */
export type ServiceSlug =
  | "applied-ai"
  | "web-development"
  | "app-development"
  | "cloud-infrastructure"
  | "data-intelligence";

/**
 * One card in the horizontally-scrolling hero strip.
 *
 * `mainColor` / `contentColor` are per-card custom properties: the ground the
 * card paints and the type colour that survives on it.
 */
export interface HeroServiceCard {
  slug: ServiceSlug;
  /** Card heading, e.g. "Cloud & Infrastructure". */
  title: string;
  /** Right-aligned descriptor, split across two lines. */
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
  /** Card ground colour. */
  mainColor: string;
  /** Text/icon colour on that ground. */
  contentColor: string;
  /** Only Applied AI has these; every other card renders none. */
  subPages?: Array<{ title: string; href: string }>;
}

/**
 * A project tile in the work grid.
 *
 * `location` is the slot the architecture template used for a city. Here it
 * carries the project's year and platform ("2026 · iOS"), which is the
 * equivalent one-line qualifier under the name.
 */
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

/** A service pill with its project count in the work filter row. */
export interface PortfolioFilterItem {
  label: string;
  count: number;
  href: string;
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

/**
 * The studio contact block rendered in the menu overlay, the footer and on
 * `/contact/`.
 *
 * The architecture template carried two of these, one per office, each with a
 * street address. NeuraGul is a service-area business with no street office —
 * its Google Business Profile hides its address — so `address` carries locality
 * lines only ("Westchester County, NY" / "Working across NYC") and there is a
 * single record rather than a pair.
 */
export interface OfficeContact {
  /** Heading, e.g. "New York". */
  label: string;
  /** Locality or note lines, rendered one per line. */
  address: string[];
  /**
   * Optional: the second column on `/contact/` is a plain note ("Reply —
   * usually within a day") with nothing to dial or mail.
   */
  phone?: string;
  /** `tel:` target for `phone`. */
  phoneHref?: string;
  email?: string;
}
