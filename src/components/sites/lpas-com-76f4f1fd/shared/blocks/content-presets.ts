/**
 * Verbatim page content for the shared lpas.com blocks.
 *
 * WHY THIS FILE EXISTS — this is not organisational tidiness, it is a hard
 * Next.js constraint. `BlockWysiwyg`, `GeneralCta` and `BlockProcessCardSlider`
 * are all `"use client"` modules. When a **server** component imports a plain
 * *value* from a client module, the App Router hands it a client-reference
 * proxy rather than the value itself — so a spread like
 * `<BlockWysiwyg {...ABOUT_WYSIWYG} />` spreads nothing and the page dies at
 * prerender with `Cannot read properties of undefined (reading 'map')`.
 * Re-exporting through another module does not help: the proxy is minted at the
 * client-module boundary regardless of who imports it.
 *
 * This module has no `"use client"`, so the constants below stay real values in
 * the server graph. It imports only *types* from the block modules, and type
 * imports are erased at compile time, so importing them creates no boundary.
 *
 * Constants consumed as default parameter values *inside* a client component
 * (`LPAS_TEAM_ITEMS`, `LPAS_JOURNAL_POSTS`, `PORTFOLIO_MARKET_FILTERS`) are not
 * affected and deliberately stay where they are — they are never read across
 * the boundary.
 */
import type { BlockProcessCardSliderProps } from "./BlockProcessCardSlider";
import type { BlockWysiwygProps } from "./BlockWysiwyg";
import type { GeneralCtaProps } from "./GeneralCta";

/* ------------------------------------------------------------------ *
 * Verbatim content for the measured instances, lifted from the page
 * RECON.json captures so the page-assembly pass never has to retype it.
 * ------------------------------------------------------------------ */

/** /portfolio/las-positas-college-academic-support-building/ — 1440×166. */
export const LAS_POSITAS_WYSIWYG: BlockWysiwygProps = {
  body: [
    {
      type: "heading",
      text: "Fixed and lounge seating provide flexibility for a variety of interactions. A continuous work surface equipped with power and data overlooks the space from the second floor and provides a dynamic study and collaboration opportunity.",
    },
  ],
};

/** /about/ — 1440×108. Body copy only, at the block's base 16px. */
export const ABOUT_WYSIWYG: BlockWysiwygProps = {
  body: [
    {
      type: "paragraph",
      text: "With offices in Sacramento and Oakland, LPAS works collaboratively with clients on higher education, civic, mixed-use, housing, commercial, and adaptive-reuse projects that respond to context, community, and purpose. Our philosophy reflects a collaborative process that unites design disciplines and client goals to produce thoughtful, lasting built environments. Our work emphasizes environmental responsibility, sense of place, and design excellence that supports both performance and community value.",
    },
  ],
};

/** /markets/housing/affordable-housing/ — first instance, 1440×281. */
export const AFFORDABLE_HOUSING_WYSIWYG_DIVERSE_NEEDS: BlockWysiwygProps = {
  tagline: "Design for Diverse Needs",
  title: "Specialized Affordable Housing Expertise",
  body: [
    {
      type: "paragraph",
      lead: "Permanent Supportive Housing:",
      text: "Trauma-informed environments for formerly unhoused individuals and families with integrated service spaces.",
    },
    {
      type: "paragraph",
      lead: "Family Housing:",
      text: "Designing for multigenerational families with play areas, community spaces, and family-sized units.",
    },
    {
      type: "paragraph",
      lead: "Senior Affordable Housing:",
      text: "Age-appropriate design with accessibility, community spaces, and consideration for aging in place.",
    },
    {
      type: "paragraph",
      lead: "Mixed-Income Communities:",
      text: "Integrating affordable and market-rate units to create economically diverse, thriving communities.",
    },
  ],
};

/** /markets/housing/affordable-housing/ — second instance, 1440×404. */
export const AFFORDABLE_HOUSING_WYSIWYG_PROVEN_PARTNERS: BlockWysiwygProps = {
  tagline: "Proven Partners in Housing",
  title: "Why Affordable Housing Developers Choose LPAS",
  body: [
    {
      type: "paragraph",
      lead: "Mission-Driven Partnership:",
      text: "We understand affordable housing transforms lives. Our designs reflect the dignity and respect your residents deserve.",
    },
    {
      type: "paragraph",
      lead: "Regulatory Expertise:",
      text: "Deep experience with TCAC, LIHTC, SB 35, density bonuses, and complex compliance requirements.",
    },
    {
      type: "paragraph",
      lead: "Fiscal Responsibility:",
      text: "We make every dollar count, delivering quality housing within public funding and tax credit financing constraints.",
    },
    {
      type: "paragraph",
      lead: "Trauma-Informed Design:",
      text: "Creating environments that promote healing, safety, and wellbeing for vulnerable populations.",
    },
    {
      type: "paragraph",
      lead: "Proven Track Record:",
      text: "From permanent supportive to family developments, we’ve delivered affordable housing that communities celebrate.",
    },
  ],
};

/** Verbatim content for the /culture/ instance (the only one on the site). */
export const CULTURE_GENERAL_CTA: GeneralCtaProps = {
  text: "Explore our job opportunities Careers",
  label: "Careers",
  href: "/careers/",
};

/* ------------------------------------------------------------------ *
 * Content for /markets/housing/affordable-housing/, transcribed
 * verbatim from the DOM capture so the page-assembly pass can drop it
 * straight in. Phase 03's body is the one string the recon probe cut
 * short (it caps captured text at 500 characters); everything the card
 * shows is well inside the three-line clamp, so the visible result is
 * unaffected.
 * ------------------------------------------------------------------ */
const AFFORDABLE_HOUSING_IMAGE_BASE =
  "/sites/lpas-com-76f4f1fd/markets-housing-affordable-housing-5d96d8a6/images";

export const affordableHousingProcess: BlockProcessCardSliderProps = {
  tagline: "Workflow",
  intro: "The LPAS affordable housing design process",
  title: "Our Process",
  phasesLabel: "Phases",
  phases: [
    {
      number: "01",
      title: "Discovery + Feasibility",
      caption: "Shaping opportunity together",
      text: "Every project begins with understanding. LPAS examines the site, its context, and its potential to create a clear picture of what can be achieved within funding and entitlement frameworks. We begin by aligning around your mission, the population you serve, and the complex funding mechanisms making these projects possible. We connect the physical opportunities of the land with the financial realities of affordable housing, helping our clients make informed decisions early in the process.",
      image: {
        src: `${AFFORDABLE_HOUSING_IMAGE_BASE}/Frame-4460-1000x1156-c-default.webp`,
        width: 1000,
        height: 1156,
      },
    },
    {
      number: "02",
      title: "Community Engagement + Visioning",
      caption: "Trust Through Transparency",
      text: "Affordable housing succeeds when residents, neighbors, and agencies feel heard. LPAS leads transparent and collaborative engagement efforts that bring diverse voices into the process. Thoughtful engagement, transparent communication, and responsive design can transform skeptics into advocates. We translate feedback into clear design priorities that balance community character, livability, and long-term sustainability.",
      image: {
        src: `${AFFORDABLE_HOUSING_IMAGE_BASE}/Frame-4474-1000x1156-c-default.webp`,
        width: 1000,
        height: 1156,
      },
    },
    {
      number: "03",
      title: "Design Development + Optimization",
      caption: "Quality without compromise",
      text: "LPAS refines each project to deliver high-quality design within budget and schedule goals. Many affordable housing residents have experienced trauma or housing instability, and we employ trauma-informed design principles creating spaces that promote healing, dignity, and joy. We coordinate closely with consultants and contractors to ensure materials, systems, and layouts maximize efficiency and durability. Our process emphasizes creative problem-solving and technical precision to make every dollar count.",
      image: {
        src: `${AFFORDABLE_HOUSING_IMAGE_BASE}/Frame-4473-1000x1156-c-default.webp`,
        width: 1000,
        height: 1156,
      },
    },
    {
      number: "04",
      title: "Approvals + Delivery",
      caption: "Focused Project Delivery",
      text: "Affordable housing projects require alignment between multiple partners and agencies. Affordable housing faces compressed schedules driven by funding deadlines and tax credit timelines. LPAS manages that coordination with clarity, ensuring design quality remains consistent as the project moves through approvals, funding milestones, and construction. Our collaborative process helps clients stay on schedule and on budget while maintaining momentum.",
      image: {
        src: `${AFFORDABLE_HOUSING_IMAGE_BASE}/Frame-4478-1000x1156-c-default.webp`,
        width: 1000,
        height: 1156,
      },
    },
    {
      number: "05",
      title: "Occupancy + Community Evolution",
      caption: "Performance over time",
      text: "Our commitment to affordable housing extends beyond completion. LPAS studies how spaces perform over time, how they support residents, simplify maintenance, and strengthen neighborhoods. We apply lessons learned from each project to continually improve design outcomes across our portfolio.",
      image: {
        src: `${AFFORDABLE_HOUSING_IMAGE_BASE}/Frame-4462-1000x1156-c-default.webp`,
        width: 1000,
        height: 1156,
      },
    },
  ],
};
