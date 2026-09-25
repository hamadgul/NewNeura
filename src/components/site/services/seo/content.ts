/**
 * Content for `/services/seo/` — the SEO service page.
 *
 * Added 2026-09-25, when the user asked to "put an emphasis on SEO as a
 * service on the site" and chose a sixth service line over folding it into
 * Web Development. Until then SEO was one slide of the Web Development
 * slider (`web-development/content.ts`, `id: "seo"`) and a clause on its
 * homepage card. That slide stays: SEO is still part of every site we build,
 * and this page is for the reader who has a site already and needs it found.
 *
 * Evidence comes from five projects, every claim traced to its dossier under
 * `docs/research/case-studies/`:
 *
 *   yankocy                  rebuild + SEO, NOT yet live on yankocy.com
 *                            (user ruling 2026-09-25: describe the build,
 *                            no live link, no ranking/traffic claims)
 *   halalbridal              SEO on a Shopify store; only what is verified
 *                            live on 2026-09-25 (the store has since lost
 *                            some of it — user ruling: "just flag it")
 *   landscape-drainage-proz  audit + repair on a Shopify store, 09-21..24
 *   new-york-mobile-mechanic built to rank; Lighthouse 100 on 9 July 2026
 *   hasina-hijama-cupping    six pages, one search each
 *
 * NO ranking, traffic, call or sales outcome is claimed for any of the three
 * September engagements. None has been measured: two have no Search Console
 * access and the third re-measures on 2026-12-15. The numbers printed are
 * counts of work done and lab measurements, each dated where it is lab data.
 *
 * VOICE — "we", never "I"; Hamad is not named on a capability page. The
 * homepage card rule of 2026-09-14 ("found on Google", never "SEO") was about
 * a non-technical reader's first glance; the service now carries the word
 * itself in its title, and the body copy still says what it means in plain
 * words.
 *
 * Structure and types follow `web-development/content.ts` exactly, which is
 * the pattern this file copies: every export typed with the shared block's
 * own props, no `subPages` key, and a pinned `PROCESS` slider.
 */
import type { BlockHeaderServicesProps } from "@/components/site/shared/blocks/BlockHeaderServices";
import type { BlockIntroDoubleProps } from "@/components/site/shared/blocks/BlockIntroDouble";
import type { BlockProcessCardSliderProps } from "@/components/site/shared/blocks/BlockProcessCardSlider";
import type { BlockProjectsHighlightProps } from "@/components/site/shared/blocks/BlockProjectsHighlight";
import type { BlockWysiwygProps } from "@/components/site/shared/blocks/BlockWysiwyg";
import type { GeneralCtaProps } from "@/components/site/shared/blocks/GeneralCta";
import type { ProjectCard } from "@/types/site";

const IMG = "/site/images";
const VIDEOS = "/site/videos";

/**
 * Route metadata. Neither string appears on the page. The geography is the
 * Google Business Profile's own service area (`AREA_SERVED` in `lib/seo.ts`):
 * New York City and Fairfield County, Connecticut.
 */
export const META = {
  title: "SEO Services in New York City & Connecticut",
  canonical: "/services/seo/",
  description:
    "SEO for small businesses in NYC and Fairfield County, CT: audits that end in fixes, site moves that keep your rankings, Shopify SEO, and pages built to be found.",
} as const;

/**
 * Parent-service header. `service: "seo"` selects `--ng-seo` (#4d5e52), a
 * dark ground the tone table pairs with white type.
 *
 * The backdrop is the Yankocy rebuild's home page: the one project on this
 * page that is both a new site and an SEO job.
 */
export const HEADER: BlockHeaderServicesProps = {
  service: "seo",
  eyebrow: "What we do",
  subtitle: "Get found by people already searching",
  title: "SEO",
  titleSize: "3XL",
  image: {
    src: `${IMG}/yankocy.jpg`,
    alt: "",
    width: 1200,
    height: 750,
  },
};

/**
 * One static caption plus three body paragraphs, split so the block's
 * paragraph rhythm reproduces the breaks.
 */
export const INTRO: BlockIntroDoubleProps = {
  labels: ["Get found by people already searching"],
  statement:
    "Your customers are already searching for what you sell. We make sure they find you.",
  body: [
    "SEO means showing up when someone types what you sell into Google, or asks an AI assistant for it. Most of the work is unglamorous: fixing the links that break, the titles that say nothing, the pages that claim things that are not true, and the missing page for the one product half your buyers are looking for.",
    "For Yankocy, a wholesale building-materials supplier in Monroe, Connecticut, we rebuilt a nine-page site as twenty-six, with a page for each product line buyers search for by name, and pointed every one of the old site's 37 addresses at a working page so nothing that already ranked is lost in the move. For Landscape Drainage Proz, a Shopify drainage store, we audited the site and then repaired it: broken redirects, 29 links that rendered white on white, pages with two headings where Google expects one.",
    "For Halal Bridal, a Shopify bridal store, we rewrote the search title and description of all 33 products, grew two collections to ten, and published seventeen articles, in three days of scripted changes to the store. We tell you what we changed, what we measured, and when it is still too early to measure anything.",
  ],
};

/* ------------------------------------------------------------------ *
 * The pinned process slider — four steps of an SEO engagement
 * ------------------------------------------------------------------ *
 *
 * `dark` tracks the lightness of the top ~24% of each image (the band the
 * number and caption sit over), measured on the files themselves — see the
 * matching note in `web-development/content.ts`.
 */
export const PROCESS: BlockProcessCardSliderProps = {
  tagline: "What we do",
  intro: "You have a site. People search for what you sell and find somebody else.",
  title: "How an SEO job runs",
  phasesLabel: "Steps",
  phases: [
    {
      number: "01",
      dark: true,
      title: "Find what is broken",
      caption: "Audit first",
      text: "We crawl the site and list what stops it ranking. On Landscape Drainage Proz: redirect chains, 29 invisible links.",
      image: {
        src: `${IMG}/yankocy-old-steeltex.jpg`,
        alt: "Yankocy's old Steeltex pool wire page, before the rebuild",
        width: 1600,
        height: 1000,
      },
    },
    {
      number: "02",
      dark: true,
      title: "A page for every search",
      caption: "Built around real queries",
      text: "Buyers search by product name, so each product line gets a page, with its sizes and gauges on it.",
      image: {
        src: `${IMG}/yankocy-steeltex.jpg`,
        alt: "The rebuilt Yankocy Steeltex pool wire page, with its specifications panel",
        width: 1600,
        height: 1000,
      },
    },
    {
      number: "03",
      dark: true,
      title: "Details Google can read",
      caption: "Structured data",
      text: "Labels that tell Google what a page is. Every Halal Bridal gown now states its 19 shipping countries.",
      image: {
        src: `${IMG}/halalbridal-collection-muslim.jpg`,
        alt: "Halal Bridal's Muslim wedding dresses collection page",
        width: 1600,
        height: 1000,
      },
    },
    {
      number: "04",
      dark: true,
      title: "Fast on a phone",
      caption: "Speed counts",
      text: "In a mobile Lighthouse test, Yankocy's Steeltex page scored 88, up from 47, its main image showing in 1.9 seconds.",
      image: {
        src: `${IMG}/mechanicseo.png`,
        alt: "A Lighthouse report for New York Mobile Mechanic, scoring 100 for performance and accessibility",
        width: 512,
        height: 265,
        // Same crop reasoning as the Web Development slide that uses this
        // file: 6% holds the Performance ring near the card's centre.
        position: "6% top",
      },
    },
  ],
};

/* ------------------------------------------------------------------ *
 * Rich text — two instances
 * ------------------------------------------------------------------ */

/** What the service covers, each item evidenced by a project on the site. */
export const WYSIWYG_CAPABILITIES: BlockWysiwygProps = {
  tagline: "On your site, and off it",
  title: "What SEO covers",
  body: [
    {
      type: "paragraph",
      lead: "Audits that end in fixes:",
      text: "Landscape Drainage Proz got an audit and then three days of repairs to the live store: seventy redirects that each land in one hop, one heading per page, new page titles and structured data from the theme itself.",
    },
    {
      type: "paragraph",
      lead: "Moving a site without losing its rankings:",
      text: "When Yankocy's nine-page site became twenty-six, each of its 37 old addresses was pointed at a working page on the new one, checked one by one.",
    },
    {
      type: "paragraph",
      lead: "Shopify SEO:",
      text: "Product titles and descriptions, collections, breadcrumbs, renamed product addresses with redirects, and shipping details Google can show in results. Halal Bridal and Landscape Drainage Proz both run on Shopify.",
    },
    {
      type: "paragraph",
      lead: "Pages that answer a search:",
      text: "Seven guides for Landscape Drainage Proz, four of them on installation, with specifications from the manufacturer's own documents, seventeen articles for Halal Bridal, and six pages for Hasina Hijama Cupping that each answer one question its customers type.",
    },
    {
      type: "paragraph",
      lead: "Local search:",
      text: "Pages for each service in each place you work. New York Mobile Mechanic has one for every service in every borough.",
    },
  ],
};

/** Why the work holds up, stated as things a reader can check. */
export const WYSIWYG_WHY: BlockWysiwygProps = {
  tagline: "What you can hold us to",
  title: "How we do SEO",
  body: [
    {
      type: "paragraph",
      lead: "We take out what is not true:",
      text: "Landscape Drainage Proz was showing a review score and \"15 hours ago\" timestamps that had nothing behind them. We removed them, along with product claims no manufacturer document supported. Google rewards pages it can trust, and so do buyers.",
    },
    {
      type: "paragraph",
      lead: "We say what we measured:",
      text: "Every number on this page is a count of work done or a dated lab test. Rankings take months to move, so we set a date to re-measure and report back then.",
    },
    {
      type: "paragraph",
      lead: "We work with what you have:",
      text: "Shopify, a site we built, or one somebody else did. Your store does not have to be rebuilt for its search to be fixed.",
    },
    {
      type: "paragraph",
      lead: "We stay reachable:",
      text: "The people who do the work are the people you talk to, and they are still reachable six months later.",
    },
  ],
};

/* ------------------------------------------------------------------ *
 * Highlighted projects — five tiles across layouts one / four
 * ------------------------------------------------------------------ *
 *
 * Same five-tile shape as Web Development: `layoutOne` takes three,
 * `layoutFour` the other two side by side.
 */

const YANKOCY: ProjectCard = {
  title: "Yankocy",
  location: "2026 · Web · SEO",
  href: "/work/yankocy/",
  image: {
    src: `${IMG}/yankocy.jpg`,
    alt: "The rebuilt Yankocy wholesale building materials home page",
    width: 1200,
    height: 750,
  },
  size: "large",
};

const HALAL_BRIDAL: ProjectCard = {
  title: "Halal Bridal",
  location: "2026 · Shopify SEO",
  href: "/work/halal-bridal/",
  image: {
    src: `${IMG}/halalbridal.jpg`,
    alt: "The Halal Bridal Shopify store home page",
    width: 1200,
    height: 750,
  },
  size: "small",
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
  size: "small",
};

/** Both `layoutFour` tiles take the 665×415.63 large aspect. */
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
  video: { src: `${VIDEOS}/nymm-hero-loop.mp4` },
  size: "large",
};

const HASINA_HIJAMA_CUPPING: ProjectCard = {
  title: "Hasina Hijama Cupping",
  location: "2026 · Next.js",
  href: "/work/hasina-hijama-cupping/",
  image: {
    src: `${IMG}/hasinahijama.jpg`,
    alt: "The Hasina Hijama Cupping site for a Queens cupping practice",
    width: 1200,
    height: 750,
  },
  size: "large",
};

export const PROJECTS: BlockProjectsHighlightProps = {
  id: "work",
  title: "Where this shipped",
  button: { title: "All SEO work", href: "/work/?service=seo" },
  layouts: [
    {
      variant: "one",
      large: YANKOCY,
      small: [HALAL_BRIDAL, LANDSCAPE_DRAINAGE_PROZ],
    },
    {
      variant: "four",
      left: NEW_YORK_MOBILE_MECHANIC,
      right: HASINA_HIJAMA_CUPPING,
    },
  ],
};

/**
 * `GeneralCta` — declared here, not imported from the `"use client"` block.
 * `/contact/` is an email address and a phone number, so "send us" is what a
 * reader can literally do there.
 */
export const CTA: GeneralCtaProps = {
  text: "Searching for what you sell, and finding someone else?",
  label: "Send us your site's address",
  href: "/contact/",
};
