/**
 * Verbatim content for `/markets/higher-education/` — the parent Higher
 * Education market page.
 * site-key `lpas-com-76f4f1fd` · page-key `markets-higher-education-95395586`
 *
 * Every string was read from the live DOM and is reproduced from
 * `docs/research/lpas-com-76f4f1fd/markets-higher-education-95395586/CONTENT.json`
 * without paraphrase — including the doubled space in "Higher  Education" and
 * in the highlight button's "All Higher  Education", which the source really
 * ships and which is what wraps the hero title onto two lines. Image paths are
 * the `local` fields from that same file; `width`/`height` come from
 * `docs/research/lpas-com-76f4f1fd/IMAGE_DIMENSIONS.json`, which decodes the
 * downloaded files. CONTENT.json's own `w`/`h` are **not** used: they record
 * whichever srcset variant lazysizes happened to have loaded, not the intrinsic
 * size, and `next/image` needs the intrinsic ratio.
 *
 * Follows `markets-housing-588433c5/content.ts`, the template for the sibling
 * market routes. What differs from Housing:
 *   1. `IMG` / `META` — this page's own directory, title and canonical.
 *   2. `HEADER` omits `subPages` entirely: Higher Education is a parent market
 *      with no children, so the sub-nav must not reserve space. `tone` is also
 *      not passed — `BlockHeaderMarkets`' own table already pairs the light
 *      `--lpas-highered` (#c9d3df) ground with `#262626` type, which is what
 *      BLOCKS.json measures on `.blockHeaderMarkets__content`.
 *   3. A `PROCESS` block: unlike `/markets/housing/`, this page pins the
 *      "Our Process" slider between the intro and the rich text.
 *   4. Two `BlockWysiwyg` instances, each with its own tagline/title/body.
 *   5. `PROJECTS` runs layouts one → two (measured), with no layout-three
 *      footer — so there is no "View all …" call to action on this page.
 */
import type { BlockHeaderMarketsProps } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockHeaderMarkets";
import type { BlockIntroDoubleProps } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockIntroDouble";
import type { BlockProcessCardSliderProps } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockProcessCardSlider";
import type { BlockProjectsHighlightProps } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockProjectsHighlight";
import type { BlockWysiwygProps } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockWysiwyg";
import type { ProjectCard } from "@/types/lpas";

const IMG = "/sites/lpas-com-76f4f1fd/markets-higher-education-95395586/images";

/**
 * Route metadata. The source serves this title unsuffixed and with an em dash,
 * so it cannot go through the root layout's "%s - LPAS Architecture" template.
 *
 * The live page ships **no** `<meta name="description">` (CONTENT.json records
 * `metaDescription: null`), so none is invented here — see the page module.
 */
export const META = {
  title: "LPAS — Higher Education",
  canonical: "/markets/higher-education/",
  /** Absolute, as the source emits it — used for the OG `url`. */
  sourceUrl: "https://lpas.com/markets/higher-education/",
} as const;

/**
 * Parent-market header: eyebrow (not a back link), `font-3XL` title, and — the
 * one structural difference from Housing — **no** `subPages` key at all,
 * because Higher Education has no child markets.
 *
 * `market: "higher-education"` selects the `--lpas-highered` (#c9d3df) ground.
 * `tone` is deliberately omitted: the block's own `MARKET_TONE` table already
 * resolves this market to `"dark"`, which is the measured `rgb(38,38,38)` on
 * `.blockHeaderMarkets__content`. Passing it would only restate the default.
 *
 * `titleSize` is passed explicitly even though `3XL` is the no-`backLink`
 * default, because the 75px vs 56px step is the single clearest difference
 * between a parent page and a child page and is worth stating at the call site.
 *
 * The title carries the source's doubled space — "Higher  Education". Do not
 * normalise it; the same doubling appears on the homepage hero card and is what
 * the CMS actually stores.
 */
export const HEADER: BlockHeaderMarketsProps = {
  market: "higher-education",
  eyebrow: "Our focus on",
  subtitle: "Architecture for academic community",
  title: "Higher  Education",
  titleSize: "3XL",
  image: {
    src: `${IMG}/lpas_image-13-1440x893-c-default.webp`,
    // The source ships this decorative (alt="").
    alt: "",
    width: 1440,
    height: 893,
  },
};

/**
 * Single static caption (not the two-tab variant) plus one body paragraph.
 *
 * The source's statement and body are two separate elements (`h2` + `p`), so
 * unlike Housing there is nothing to split here.
 */
export const INTRO: BlockIntroDoubleProps = {
  labels: ["Architecture for academic community"],
  statement:
    "Higher education projects don't get do-overs. LPAS knows this and it shapes everything about how we work with colleges and universities, from the first stakeholder meeting to the day you open the doors.",
  body: [
    "We've spent decades learning the rhythms of campus life the budget pressures, the competing priorities, DSA approvals, and the students, faculty, and staff whose daily experience depends on getting the design right. Our process is built around listening first and designing second. We ask the right questions, bring the right people to the table, and stay closely involved from first sketch to final punch list because great educational spaces don't just happen. They're carefully, intentionally earned.",
  ],
};

/* ------------------------------------------------------------------ *
 * The pinned process slider
 * ------------------------------------------------------------------ *
 *
 * RECON.json records this block wrapped in a 2445px `pin-spacer`, i.e. the
 * block's default 1305px pin distance — so `pinDistance` is left at the
 * component's measured default.
 *
 * The five card images are the same `Frame-44xx` artwork the other market
 * pages use, re-downloaded under this page's own directory; the order below is
 * the order CONTENT.json lists them in.
 *
 * The source makes each slide a link to `/processes/<slug>/?ids=…`. Those
 * routes are not part of this clone (no `/processes/` segment exists), so
 * `href` is omitted and the cards render as `<div>`s — the same choice the
 * block's own `affordableHousingProcess` example makes.
 */
export const PROCESS: BlockProcessCardSliderProps = {
  tagline: "Workflow",
  intro: "The LPAS Higher Education Design Process",
  title: "Our Process",
  phasesLabel: "Phases",
  phases: [
    {
      number: "01",
      href: "/processes/discovery-mission-alignment-2/?ids=1111%2C1112%2C1113%2C1114%2C1115",
      title: "Discovery + Mission Alignment",
      caption: "Mission-driven beginnings",
      text: "No two campuses are the same, we never assume we already know what you need. Before any design work begins, we spend time on your campus talking to people, touring spaces, and understanding what's working and what isn't.",
      image: {
        src: `${IMG}/Frame-4460-1000x1156-c-default.webp`,
        width: 1000,
        height: 1156,
      },
    },
    {
      number: "02",
      href: "/processes/engagement-programming/?ids=1111%2C1112%2C1113%2C1114%2C1115",
      title: "Engagement + Programming",
      caption: "Collaboration to build alignment",
      text: "The best campus designs are shaped by the people who use them. We run an engagement process that makes it easy for every stakeholder from department heads to students to participate meaningfully and see their input reflected in the design.",
      image: {
        src: `${IMG}/Frame-4474-1000x1156-c-default.webp`,
        width: 1000,
        height: 1156,
      },
    },
    {
      number: "03",
      href: "/processes/design-development-technical-integration/?ids=1111%2C1112%2C1113%2C1114%2C1115",
      title: "Design Development + Technical Integration",
      caption: "Buildable, enduring solutions",
      text: "This is where ideas become buildings. We develop designs that are creative, contextually grounded, and technically sound exploring smart construction approaches and coordinating closely with engineers and builders so nothing gets lost in translation.",
      image: {
        src: `${IMG}/Frame-4473-1000x1156-c-default.webp`,
        width: 1000,
        height: 1156,
      },
    },
    {
      number: "04",
      href: "/processes/approvals-agency-navigation/?ids=1111%2C1112%2C1113%2C1114%2C1115",
      title: "Approvals + Agency Navigation",
      caption: "Navigating approvals with confidence",
      text: "Higher education projects move through a lot of checkpoints: DSA, the State Fire Marshal, peer review boards, and university system requirements. We've been doing this long enough to know how each agency thinks, what they need, and how to keep things moving.",
      image: {
        src: `${IMG}/Frame-4478-1000x1156-c-default.webp`,
        width: 1000,
        height: 1156,
      },
    },
    {
      number: "05",
      href: "/processes/delivery-continuous-improvement/?ids=1111%2C1112%2C1113%2C1114%2C1115",
      title: "Delivery + Continuous Improvement",
      caption: "Built with accountability",
      text: "Construction is where everything comes together. Our TAPS approach Transparent, Accountable, Predictable, Successful keeps the whole team aligned and gives you real-time visibility into exactly where things stand.",
      image: {
        src: `${IMG}/Frame-4462-1000x1156-c-default.webp`,
        width: 1000,
        height: 1156,
      },
    },
  ],
};

/* ------------------------------------------------------------------ *
 * Rich text — two instances
 * ------------------------------------------------------------------ */

/**
 * First instance (measured 1440×427).
 *
 * Note the paragraph shape differs from the housing sub-pages: BLOCKS.json
 * records eight sibling `<p>`s here — four of them containing nothing but a
 * `<strong>` (22px tall, one line) and four plain body paragraphs (43px, two
 * lines) — not the `<strong>` + `<br>` + text pairs that
 * `/markets/housing/affordable-housing/` uses. 4×22 + 4×43 + 7×15px gaps =
 * 365px against the measured 364px content box, which only resolves if every
 * one of the eight is its own paragraph with the block's uniform `p + p` rule
 * between them.
 *
 * So the bold lines are modelled as `lead`-only nodes. `BlockWysiwyg` emits a
 * trailing `<br>` after a `lead`; a forced break at the end of a block yields a
 * zero-height empty line box per CSS 2.1 §9.4.2, so the rendered height is
 * still one line and matches the capture.
 */
export const WYSIWYG_WHY_LPAS: BlockWysiwygProps = {
  tagline: "Inclusive, accountable, proven",
  title: "Why Higher Education Institutions Choose LPAS",
  body: [
    { type: "paragraph", lead: "Proven Track Record" },
    {
      type: "paragraph",
      text: "From the CSU and UC systems to community colleges across California, we have delivered projects that balance complex requirements, tight budgets, and high aspirations.",
    },
    { type: "paragraph", lead: "Inclusive by Design" },
    {
      type: "paragraph",
      text: "From accessibility that exceeds code requirements to spaces that genuinely welcome diverse populations, we design environments where every person feels they belong.",
    },
    { type: "paragraph", lead: "Fiscally Responsible" },
    {
      type: "paragraph",
      text: "We understand public budgets and how to stretch them. Our transparent process helps you see the trade-offs clearly and make decisions that maximize value without sacrificing mission.",
    },
    { type: "paragraph", lead: "Partners, Not Vendors" },
    {
      type: "paragraph",
      text: "We are invested in your success. Your goals become our goals, and your challenges become problems we solve together. That is how we have built relationships that last well beyond a single project.",
    },
  ],
};

/**
 * Second instance (measured 1440×689) — three client testimonials.
 *
 * **Known prop gap.** The source renders each quote as an italic `<h4>` at
 * `font-SM` metrics (24px / 32.4px at ≥992px, measured off `desktop-full.png`).
 * `BlockWysiwyg`'s rich text only models `heading` (always a non-italic `<h3>`
 * at `font-M`, 28px / 36.4px) and `paragraph`, so the quotes land one step too
 * large and upright. Expressing them faithfully needs a new node type on the
 * shared block, which this pass may not edit — flagged rather than fudged.
 *
 * The ` ` paragraphs are real: the source separates each testimonial from
 * the next with a `<p>&nbsp;</p>` spacer, and they are what produce the wide
 * gaps between quote groups in the reference screenshot. Reproduced verbatim,
 * including the trailing one after the last attribution.
 */
export const WYSIWYG_CLIENT_VOICES: BlockWysiwygProps = {
  tagline: "Trusted. Proven. Valued.",
  title: "Client Voices",
  body: [
    {
      type: "heading",
      text: "“Our goals of listening enhancement, visual improvements, third space, and better space management were all met or exceeded. The results of this project have created a wonderful experience for our students.”",
    },
    {
      type: "paragraph",
      text: "— Jonathan Latta, Chief of Staff, University of the Pacific",
    },
    { type: "paragraph", text: " " },
    {
      type: "heading",
      text: "“If I could sum up my experience in working with LPAS it would be collaboration and partnership!! I will be modeling future projects at this college after this one.”",
    },
    {
      type: "paragraph",
      text: "— Ann Kroll, Project Planner/Manager, Las Positas College",
    },
    { type: "paragraph", text: " " },
    {
      type: "heading",
      text: "“This project was a significant part of our bond process. LPAS met every challenge and deliverable and our experience has been nothing but positive.”",
    },
    {
      type: "paragraph",
      text: "— Owen Letcher, Vice Chancellor of Facilities and Bond Program, Las Positas College",
    },
    { type: "paragraph", text: " " },
  ],
};

/* ------------------------------------------------------------------ *
 * Highlighted projects — six tiles across layouts one / two
 * ------------------------------------------------------------------ *
 *
 * Layout order is measured, not chosen: BLOCKS.json records `__layoutOne`
 * (521px) then `__layoutTwo` (471px) as this block's two children after its
 * header, and nothing else — so there is no layout-three footer here.
 *
 * The source ships every tile with `alt=""`; the pass-1 convention is to
 * restate the project title instead, so the tiles are not silent to screen
 * readers. Kept.
 */

const SOLANO_COLLEGE_THEATER: ProjectCard = {
  // The trailing period is the source's own; not a typo to tidy.
  title: "Solano Community College Theater Renovation and Addition.",
  location: "Fairfield, CA",
  href: "/portfolio/solano-community-college-theater-renovation-and-addition/",
  image: {
    src: `${IMG}/24_Solano-College-Theater-1280x800-c-default.webp`,
    alt: "Solano Community College Theater Renovation and Addition.",
    width: 1280,
    height: 800,
  },
  size: "large",
};

const UC_DAVIS_PITZER_CENTER: ProjectCard = {
  title: "UC Davis Ann E. Pitzer Center Classroom & Recital Hall",
  location: "Davis, CA",
  href: "/portfolio/uc-davis-ann-e-pitzer-center-classroom-recital-hall/",
  image: {
    src: `${IMG}/22_UCD-Pitzer-Center-1280x800-c-default.webp`,
    alt: "UC Davis Ann E. Pitzer Center Classroom & Recital Hall",
    width: 1280,
    height: 800,
  },
  size: "small",
};

const LAKE_TAHOE_COMMUNITY_COLLEGE: ProjectCard = {
  title: "Lake Tahoe Community College Renovations for Efficiency",
  location: "South Lake Tahoe, CA",
  href: "/portfolio/lake-tahoe-community-college-renovations-for-efficiency/",
  image: {
    src: `${IMG}/07_LTCC-RFE-1280x800-c-default.webp`,
    alt: "Lake Tahoe Community College Renovations for Efficiency",
    width: 1280,
    height: 800,
  },
  size: "small",
};

const CITY_COLLEGE_DIEGO_RIVERA_THEATER: ProjectCard = {
  title: "City College of San Francisco Diego Rivera Theater Criteria Document",
  location: "San Francisco, CA",
  href: "/portfolio/city-college-of-san-francisco-diego-rivera-theater-criteria-document/",
  image: {
    src: `${IMG}/Concert-hall-1280x800-c-default.webp`,
    alt: "City College of San Francisco Diego Rivera Theater Criteria Document",
    width: 1280,
    height: 800,
  },
  size: "small",
};

const OHLONE_COLLEGE_BUILDING_5: ProjectCard = {
  title: "The Ohlone College Building 5 Renovation",
  location: "Fremont, CA",
  href: "/portfolio/the-ohlone-college-building-5-renovation/",
  image: {
    src: `${IMG}/08_Ohlone-College-Building-5-Renovation-1280x800-c-default.webp`,
    alt: "The Ohlone College Building 5 Renovation",
    width: 1280,
    height: 800,
  },
  size: "small",
};

const COSUMNES_RIVER_COLLEGE: ProjectCard = {
  title: "Cosumnes River College College Center Expansion",
  location: "Sacramento, CA",
  href: "/portfolio/cosumnes-river-college-college-center-expansion/",
  image: {
    src: `${IMG}/03_Cosumnes-River-College-1280x800-c-default.webp`,
    alt: "Cosumnes River College College Center Expansion",
    width: 1280,
    height: 800,
  },
  size: "large",
};

/**
 * Header copy is verbatim: capital "Projects" on this page (Housing uses
 * lowercase), and the button's **doubled** space in "All Higher  Education",
 * which BLOCKS.json captures on `.button__title`. The query string is part of
 * the href, so the filter row on `/portfolio/` picks it up.
 */
export const PROJECTS: BlockProjectsHighlightProps = {
  title: "Highlighted Projects",
  button: { title: "All Higher  Education", href: "/portfolio/?market=higher-education" },
  layouts: [
    {
      variant: "one",
      large: SOLANO_COLLEGE_THEATER,
      small: [UC_DAVIS_PITZER_CENTER, LAKE_TAHOE_COMMUNITY_COLLEGE],
    },
    {
      variant: "two",
      small: [CITY_COLLEGE_DIEGO_RIVERA_THEATER, OHLONE_COLLEGE_BUILDING_5],
      large: COSUMNES_RIVER_COLLEGE,
    },
  ],
};
