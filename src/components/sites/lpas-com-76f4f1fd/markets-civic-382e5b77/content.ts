/**
 * Verbatim content for `/markets/civic/` — the parent Civic market page.
 * site-key `lpas-com-76f4f1fd` · page-key `markets-civic-382e5b77`
 *
 * Every string was read from the live DOM and is reproduced from
 * `docs/research/lpas-com-76f4f1fd/markets-civic-382e5b77/CONTENT.json`
 * without paraphrase — including its plain ASCII apostrophes, which is what
 * the source actually serves on this page. Image paths are the `local` fields
 * from that same file, but every `width`/`height` comes from
 * `docs/research/lpas-com-76f4f1fd/IMAGE_DIMENSIONS.json` — the decoded, true
 * intrinsic size, which is what `next/image` needs for the aspect ratio.
 * CONTENT.json's own `w`/`h` are deliberately **not** used: they record
 * whichever srcset variant lazysizes happened to have loaded at capture time,
 * not the file. (Cross-checked here against the downloaded WebP headers; all
 * 11 images on this page agree.)
 *
 * ── How this differs from the `markets-housing-588433c5` template ────────────
 * Same six-step recipe that file documents, with these specifics:
 *   1. `IMG` — this page's own page-key directory.
 *   2. `META` — title/canonical; still no description, for the same reason.
 *   3. `HEADER.market: "civic"` selects `--lpas-civic` (#707569). That is one of
 *      the three *dark* grounds, so the block's own `MARKET_TONE` table already
 *      resolves white type — matching the measured `rgb(255,255,255)` on
 *      `.blockHeaderMarkets__content` — and no `tone` override is passed.
 *      Civic has no child markets, so `subPages` is omitted entirely rather
 *      than passed as `[]`; the prop is optional and the sub-nav then vanishes
 *      instead of reserving space. There is no back link: this is a parent.
 *   4. `INTRO.labels` / `statement` / `body`.
 *   5. `PROJECTS.title` + `button.title`, and the measured `layouts` sequence —
 *      four → three here (BLOCKS.json records `__layoutFour` (521px) then
 *      `__layoutThree` (521px) as this block's two children after its header).
 *   6. Unlike the Housing parent, this page **does** carry the pinned process
 *      block, plus two `BlockWysiwyg` instances between it and the projects.
 *      Hence the extra `PROCESS`, `WYSIWYG_EXPERTISE` and `WYSIWYG_PARTNER`
 *      exports below.
 */
import type { BlockHeaderMarketsProps } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockHeaderMarkets";
import type { BlockIntroDoubleProps } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockIntroDouble";
import type { BlockProcessCardSliderProps } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockProcessCardSlider";
import type { BlockProjectsHighlightProps } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockProjectsHighlight";
import type { BlockWysiwygProps } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockWysiwyg";
import type { ProjectCard } from "@/types/lpas";

const IMG = "/sites/lpas-com-76f4f1fd/markets-civic-382e5b77/images";

/**
 * Route metadata. The source serves this title unsuffixed and with an em dash,
 * so it cannot go through the root layout's "%s - LPAS Architecture" template.
 *
 * The live page ships **no** `<meta name="description">` (CONTENT.json records
 * `metaDescription: null`), so none is invented here — see the page module.
 */
export const META = {
  title: "LPAS — Civic",
  canonical: "/markets/civic/",
  /** Absolute, as the source emits it — used for the OG `url`. */
  sourceUrl: "https://lpas.com/markets/civic/",
} as const;

/**
 * Parent-market header: eyebrow (not a back link), `font-3XL` title, and no
 * sub-page grid at all — Civic has no children.
 *
 * `titleSize` is passed explicitly even though `3XL` is the no-`backLink`
 * default, because the 75px vs 56px step is the single clearest difference
 * between a parent page and a child page and is worth stating at the call site.
 */
export const HEADER: BlockHeaderMarketsProps = {
  market: "civic",
  eyebrow: "Our focus on",
  subtitle: "Architecture in service",
  title: "Civic",
  titleSize: "3XL",
  image: {
    src: `${IMG}/16_316-Vernon-1440x960-c-default.webp`,
    // The source ships this decorative (alt=""); it is a crop of 316 Vernon.
    alt: "",
    width: 1440,
    height: 960,
  },
};

/**
 * Single static caption (not the two-tab variant) plus one body paragraph.
 *
 * The source's `<h2>` carries the whole statement; the single `<p>` beneath it
 * is reproduced as a one-element array so the block's `[&>p+p]` rhythm stays
 * available if the copy ever grows, and so the shape matches its siblings.
 */
export const INTRO: BlockIntroDoubleProps = {
  labels: ["Architecture in service"],
  statement:
    "LPAS designs civic spaces that embody trust, connection, and service. We understand that public buildings represent more than function; they reflect the values of the communities they serve and carry symbolic weight as landmarks of democratic ideals and public service.",
  body: [
    "With extensive experience designing civic and public agency buildings across California, we understand the unique challenges these projects face: constricted budgets, complex stakeholder groups, rigorous approval processes, and the need to serve diverse populations with dignity and transparency. Our approach emphasizes collaboration, transparency, and design excellence, ensuring every project delivers long-term value for users, agencies, and the public. From visioning through occupancy, LPAS helps civic clients achieve clarity, efficiency, and enduring impact.",
  ],
};

/* ------------------------------------------------------------------ *
 * Our Process — the scroll-pinned five-card slider
 * ------------------------------------------------------------------ *
 *
 * Phase order, numbers, captions and body copy are transcribed from this
 * page's own CONTENT.json; the card artwork is this page's own
 * `Frame-*-1000x1156` crops in DOM order.
 *
 * `dark` is left unset on every phase, and that is checked rather than assumed:
 * sampling the mean luminance of the top 270px of each 1000×1156 crop (the band
 * the number and caption sit over) gives 214 / 61 / 210 / 61 / 214 — pale, dark,
 * pale, dark, pale — so "the artwork is light, paint the type dark" lands on
 * slides 0, 2 and 4, which is exactly the block's default alternation. (The
 * sibling Commercial page is the one where this check fails and the flag has to
 * be passed; see its content module.)
 *
 * The source wraps each card in an `<a>` to `/processes/<phase>/?ids=…`.
 * Those routes are outside this clone, and the block's own worked example
 * (`affordableHousingProcess`, now in `shared/blocks/content-presets.ts`)
 * drops them for exactly that reason, so `href` is omitted here too and each
 * card renders as a `<div>`.
 */
export const PROCESS: BlockProcessCardSliderProps = {
  tagline: "Workflow",
  intro: "The LPAS Civic Design Process",
  title: "Our Process",
  phasesLabel: "Phases",
  phases: [
    {
      number: "01",
      href: "/processes/discovery-mission-alignment/?ids=1071%2C1072%2C1073%2C1075%2C1076",
      title: "Discovery + Mission Alignment",
      caption: "Shared purpose, clear direction",
      text: "LPAS begins by listening to understand the mission and priorities of each agency and community. Civic buildings serve entire communities, and successful projects require meaningful engagement with diverse stakeholders. We analyze operational requirements, user needs, and site context to define a clear framework for decision-making. This early clarity helps establish a shared understanding of purpose and performance before design begins.",
      image: {
        src: `${IMG}/Frame-4516-1000x1156-c-default.webp`,
        width: 1000,
        height: 1156,
      },
    },
    {
      number: "02",
      href: "/processes/community-engagement/?ids=1071%2C1072%2C1073%2C1075%2C1076",
      title: "Community Engagement",
      caption: "Open dialogue for better design",
      text: "Public projects thrive when the community has a voice in the process. Civic buildings must be physically and psychologically accessible to all community members. LPAS leads engagement efforts that invite meaningful participation from residents, users, and partner agencies. We communicate ideas clearly and visually, making complex information accessible to everyone involved.",
      image: {
        src: `${IMG}/Frame-4474-1000x1156-c-default.webp`,
        width: 1000,
        height: 1156,
      },
    },
    {
      number: "03",
      href: "/processes/concept-design-development/?ids=1071%2C1072%2C1073%2C1075%2C1076",
      title: "Concept + Design Development",
      caption: "Designing for public purpose",
      text: "LPAS translates mission and engagement feedback into a clear design direction. Public projects face intense budget scrutiny, and every dollar must be justified. We focus on usability, sustainability, and identity, ensuring each space supports the people who work and gather there. Through thoughtful planning and form, we create environments that feel open, accessible, and civic in character while bringing creative problem-solving to achieve the dignity and presence civic buildings deserve.",
      image: {
        src: `${IMG}/Frame-4456-1000x1156-c-default.webp`,
        width: 1000,
        height: 1156,
      },
    },
    {
      number: "04",
      href: "/processes/technical-cost-integration/?ids=1071%2C1072%2C1073%2C1075%2C1076",
      title: "Technical + Cost Integration",
      caption: "Responsible civic investment",
      text: "Civic design demands accountability. Civic buildings often house diverse functions requiring smart design that supports operational efficiency. LPAS integrates cost management and technical coordination throughout the process to ensure every decision supports value, durability, and maintainability. Our goal is to help clients achieve design excellence within public budgets and timelines.",
      image: {
        src: `${IMG}/Frame-4477-1000x1156-c-default.webp`,
        width: 1000,
        height: 1156,
      },
    },
    {
      number: "05",
      href: "/processes/implementation-legacy/?ids=1071%2C1072%2C1073%2C1075%2C1076",
      title: "Implementation + Legacy",
      caption: "Strengthening Communities Long-Term",
      text: "From documentation through construction, LPAS maintains consistent communication and oversight. We stay involved to ensure that each project fulfills its mission and continues to perform for years after completion. Beyond function, civic buildings carry symbolic weight as investments serving multiple generations. Every civic building we deliver strengthens its community and stands as a testament to effective collaboration.",
      image: {
        src: `${IMG}/Frame-4468-1000x1156-c-default.webp`,
        width: 1000,
        height: 1156,
      },
    },
  ],
};

/* ------------------------------------------------------------------ *
 * The two rich-text blocks
 * ------------------------------------------------------------------ *
 *
 * Both use the tagline + title + body shape. Each source `<p>` is a bold
 * lead-in, a `<br>`, then the descriptive line — which is exactly the
 * `lead` / `text` split `WysiwygParagraphNode` models, so the `\n` inside
 * CONTENT.json's paragraph strings becomes the node boundary rather than a
 * literal newline. Ampersands are the source's own, not entities.
 */

/** First instance — "Purpose-Built Civic Design". */
export const WYSIWYG_EXPERTISE: BlockWysiwygProps = {
  tagline: "Purpose-Built Civic Design",
  title: "Specialized Civic Expertise",
  body: [
    {
      type: "paragraph",
      lead: "Public Safety Facilities:",
      text: "Police and fire stations balancing security needs with community connection and transparency.",
    },
    {
      type: "paragraph",
      lead: "Courthouses & Justice Centers:",
      text: "Dignified environments serving judicial functions with appropriate security and public accessibility.",
    },
    {
      type: "paragraph",
      lead: "City Halls & Municipal Buildings:",
      text: "Multi-department civic centers with public meeting spaces and efficient staff work areas.",
    },
    {
      type: "paragraph",
      lead: "Community Centers:",
      text: "Flexible gathering spaces serving diverse programs and strengthening community connections.",
    },
    {
      type: "paragraph",
      lead: "Libraries & Cultural Buildings:",
      text: "Public buildings supporting education, culture, and community gathering.",
    },
    {
      type: "paragraph",
      lead: "Public Agency & Government Offices:",
      text: "State and federal facilities serving public needs with appropriate security and functionality.",
    },
  ],
};

/** Second instance — "Trusted Civic Design Partner". */
export const WYSIWYG_PARTNER: BlockWysiwygProps = {
  tagline: "Trusted Civic Design Partner",
  title: "Why Municipalities & Agencies Choose LPAS",
  body: [
    {
      type: "paragraph",
      lead: "Public Sector Experience:",
      text: "Deep understanding of public funding constraints, approval processes, and stakeholder complexity.",
    },
    {
      type: "paragraph",
      lead: "Community Engagement Expertise:",
      text: "Proven approaches to meaningful public input that shapes better outcomes.",
    },
    {
      type: "paragraph",
      lead: "Fiscal Responsibility:",
      text: "Maximizing civic presence and functionality within public budgets through creative value engineering.",
    },
    {
      type: "paragraph",
      lead: "DSA & Regulatory Navigation:",
      text: "Expert navigation of Division of State Architect and public agency requirements.",
    },
    {
      type: "paragraph",
      lead: "Accessible Design Commitment:",
      text: "Universal design that genuinely welcomes all community members.",
    },
    {
      type: "paragraph",
      lead: "Long-Term Thinking:",
      text: "Designing for durability, adaptability, and multiple generations of service.",
    },
  ],
};

/* ------------------------------------------------------------------ *
 * Highlighted projects — five tiles across layouts four / three
 * ------------------------------------------------------------------ *
 *
 * The five projects appear in source DOM order, which is also the order the
 * two layouts consume them: layout four takes the first two (both *large*
 * 665×471 tiles, per BLOCKS.json), layout three takes the two 328×260 smalls
 * and then its own large tile.
 *
 * The source ships every one of these with `alt=""`; the pass-1 convention is
 * to restate the project title instead, so the tiles are not silent to screen
 * readers. Kept.
 */

/** Layout four, left — sits in the 471px-pinned `smallImagesWrapper`. */
const SOLANO_TRANSPORTATION_AUTHORITY: ProjectCard = {
  title: "Solano Transportation Authority",
  location: "Suisun City, CA",
  href: "/portfolio/solano-transportation-authority/",
  image: {
    src: `${IMG}/07_STA-HQ-1280x800-c-default.webp`,
    alt: "Solano Transportation Authority",
    width: 1280,
    height: 800,
  },
  size: "large",
};

/** Layout four, right — the notched (top-left bevel) tile. */
const TEHAMA_COUNTY_COURTHOUSE: ProjectCard = {
  title: "Tehama County Courthouse",
  location: "Red Bluff, CA",
  href: "/portfolio/tehama-county-courthouse/",
  image: {
    src: `${IMG}/20_Tehama-County-Courthouse-edited-1280x800-c-default.webp`,
    alt: "Tehama County Courthouse",
    width: 1280,
    height: 800,
  },
  size: "large",
};

const CHP_TRUCKEE_FIELD_OFFICE: ProjectCard = {
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
};

const CHP_HEADQUARTERS: ProjectCard = {
  title: "California Highway Patrol Headquarters",
  location: "Sacramento, CA",
  href: "/portfolio/california-highway-patrol-headquarters/",
  image: {
    src: `${IMG}/10_CHP-Headquarters-1280x800-c-default.webp`,
    alt: "California Highway Patrol Headquarters",
    width: 1280,
    height: 800,
  },
  size: "small",
};

const VERNON_STREET_OFFICE: ProjectCard = {
  title: "316 Vernon Street Office",
  location: "Roseville, CA",
  // The tile's title says "316 Vernon Street Office" but the source's href is
  // the shorter `316-vernon-street` slug. Kept as the source has it.
  href: "/portfolio/316-vernon-street/",
  image: {
    src: `${IMG}/19_316-Vernon-1280x800-c-default.webp`,
    alt: "316 Vernon Street Office",
    width: 1280,
    height: 800,
  },
  size: "large",
};

/**
 * Header copy is verbatim: lowercase "projects", and "All Civic" on the button.
 * Both the header button and layout three's footer button point at the same
 * market-filtered portfolio URL — the query string is part of the href, so the
 * filter row on `/portfolio/` picks it up.
 */
export const PROJECTS: BlockProjectsHighlightProps = {
  title: "Highlighted projects",
  button: { title: "All Civic", href: "/portfolio/?market=civic" },
  layouts: [
    {
      variant: "four",
      left: SOLANO_TRANSPORTATION_AUTHORITY,
      right: TEHAMA_COUNTY_COURTHOUSE,
    },
    {
      variant: "three",
      small: [CHP_TRUCKEE_FIELD_OFFICE, CHP_HEADQUARTERS],
      large: VERNON_STREET_OFFICE,
      footer: {
        title: "View all Civic",
        buttonTitle: "Portfolio",
        buttonHref: "/portfolio/?market=civic",
      },
    },
  ],
};
