/**
 * Verbatim content for `/markets/housing/student-housing/` — a Housing **child**
 * market page.
 * site-key `lpas-com-76f4f1fd` · page-key `markets-housing-student-housing-72e66e7d`
 *
 * Follows `markets-housing-588433c5/content.ts` (the parent Housing page) as its
 * template: every export is typed with the shared block's own props interface, so
 * a mis-shaped layout is a compile error rather than a rendering surprise.
 *
 * Strings come from
 * `docs/research/lpas-com-76f4f1fd/markets-housing-student-housing-72e66e7d/CONTENT.json`
 * without paraphrase — including "Performance beyond move-In" with its capital I,
 * and the lowercase "The LPAS student housing design process" (the senior-housing
 * sibling title-cases the same sentence).
 *
 * Image `src` values are that file's `local` paths. `width`/`height` are the
 * **decoded file** dimensions taken from `docs/research/lpas-com-76f4f1fd/
 * IMAGE_DIMENSIONS.json` — NOT CONTENT.json's `w`/`h`, which record whichever
 * srcset variant lazysizes had loaded at capture time (see BUILDER_CONVENTIONS
 * trap #4).
 *
 * ── How this differs from the parent template ────────────────────────────────
 *   · `HEADER` swaps the "Our focus on" eyebrow for a `backLink` to
 *     `/markets/housing/`, drops `titleSize` (children take the `font-XXL` 56px
 *     default instead of the parent's 75px `font-3XL`), and keeps
 *     `market: "housing"` so the child inherits the parent's `--lpas-housing`
 *     (#625653) ground and its white foreground.
 *   · `subPages` reuses the parent's exported `HOUSING_SUB_PAGES` — the same four
 *     child markets in the same source DOM order — with this page's own entry
 *     flagged `current: true`.
 *   · A `BlockProcessCardSlider` sits between the intro and the projects, and two
 *     `BlockWysiwyg` instances sit between the slider and the projects. The
 *     parent market pages have none of the three.
 *   · `PROJECTS` is a single `layoutTwo` — measured, `BLOCKS.json` records exactly
 *     one `blockProjectsHighlight__layoutTwo` (1340×471) after the header.
 */
import { HOUSING_SUB_PAGES } from "@/components/sites/lpas-com-76f4f1fd/markets-housing-588433c5/content";
import type {
  BlockHeaderMarketsProps,
  MarketSubPageLink,
} from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockHeaderMarkets";
import type { BlockIntroDoubleProps } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockIntroDouble";
import type { BlockProcessCardSliderProps } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockProcessCardSlider";
import type { BlockProjectsHighlightProps } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockProjectsHighlight";
import type { BlockWysiwygProps } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockWysiwyg";
import type { ProjectCard } from "@/types/lpas";

const IMG = "/sites/lpas-com-76f4f1fd/markets-housing-student-housing-72e66e7d/images";

/**
 * Route metadata.
 *
 * The live `<title>` is "Student Housing - LPAS Architecture", which is exactly
 * what the root layout's `"%s - LPAS Architecture"` template produces from
 * "Student Housing" — so, unlike the parent markets with their em-dash titles,
 * this route feeds the template rather than opting out with an absolute title.
 *
 * `metaDescription` is `null` in CONTENT.json (the live page ships no
 * `<meta name="description">`), so none is declared — see the page module.
 */
export const META = {
  /** Fed through the root layout's title template; never restate the suffix. */
  title: "Student Housing",
  canonical: "/markets/housing/student-housing/",
  /** Absolute, as the source emits it — used for the OG `url`. */
  sourceUrl: "https://lpas.com/markets/housing/student-housing/",
} as const;

/** The sibling this page is. Matched by title against the shared list below. */
const CURRENT_SUB_PAGE = "Student Housing";

/**
 * The parent's four child markets, reused verbatim (source DOM order, which is
 * not alphabetical), with this page's own entry flagged so the header renders
 * its leading dot marker.
 */
const SUB_PAGES: MarketSubPageLink[] = HOUSING_SUB_PAGES.map((page) =>
  page.title === CURRENT_SUB_PAGE ? { ...page, current: true } : page,
);

/**
 * Child-page header: `backLink` instead of `eyebrow`, no `titleSize` (the block
 * defaults to `XXL` whenever a `backLink` is present, which is the measured 56px
 * step down from the parent's 75px).
 *
 * Note the header tagline ("Student-centered housing design") and the intro's
 * caption ("Designing for student life") are *different* strings on this page —
 * on the senior-housing sibling they happen to be identical, so neither can be
 * derived from the other.
 */
export const HEADER: BlockHeaderMarketsProps = {
  market: "housing",
  backLink: { label: "Back to Housing", href: "/markets/housing/" },
  subtitle: "Student-centered housing design",
  title: "Student Housing",
  subPages: SUB_PAGES,
  image: {
    src: `${IMG}/05_CSUS-Faculty-Housing-1440x699-c-default.webp`,
    // Decorative in the source (alt=""); it is a crop of Sacramento State
    // Faculty & Staff Housing.
    alt: "",
    width: 1440,
    height: 699,
  },
};

export const INTRO: BlockIntroDoubleProps = {
  labels: ["Designing for student life"],
  statement:
    "For many students, a residence hall is their first home away from home. LPAS designs student housing that goes beyond a place to sleep, creating communities where students connect, thrive, and feel like they belong.",
  body: [
    "We work with universities, colleges, and public-private partnerships across California to deliver housing that fits the realities of campus life: constrained budgets, diverse student populations, tight academic calendars, and evolving expectations for community and inclusivity. We listen closely to students and institutions alike, making sure every design decision serves the people who will actually live there. The result is housing that supports student success from move-in day through graduation.",
  ],
};

/**
 * The scroll-pinned process carousel. Five phases, same shape as the worked
 * `affordableHousingProcess` example in `shared/blocks/content-presets.ts`, but
 * every string and every image is this page's own.
 *
 * `dark` is deliberately left unset on all five: the block alternates the
 * dark-on-light header treatment across slides 0, 2 and 4 by default, which is
 * the source's own pattern.
 *
 * Each card is an `<a>` in the source, pointing at a `/processes/<slug>/` detail
 * page with the same `?ids=` sibling list on all five. Those hrefs are reproduced
 * verbatim (percent-encoded commas included); `/processes/` is outside this
 * clone's route set, so they are dead links here exactly as the portfolio hrefs
 * on the parent page are.
 */
export const PROCESS: BlockProcessCardSliderProps = {
  tagline: "Workflow",
  intro: "The LPAS student housing design process",
  title: "Our Process",
  phasesLabel: "Phases",
  phases: [
    {
      number: "01",
      title: "Discovery + Partnership Alignment",
      caption: "Insight-Led Housing Design",
      text: "Good student housing starts with good questions. Before any design work begins, we dig into how students actually use their spaces, what the institution needs to achieve, and what success looks like for everyone involved.",
      href: "/processes/discovery-partnership-alignment/?ids=947%2C949%2C951%2C3200%2C969",
      image: {
        src: `${IMG}/Frame-4470-1000x1156-c-default.webp`,
        width: 1000,
        height: 1156,
      },
    },
    {
      number: "02",
      title: "Visioning + Experience Planning",
      caption: "Inclusive by Design",
      text: "Today's student populations are wonderfully diverse, and housing needs to reflect that. We lead collaborative sessions that explore how design can foster connection, comfort, and belonging, turning stakeholder input into a clear, actionable vision.",
      href: "/processes/visioning-experience-planning/?ids=947%2C949%2C951%2C3200%2C969",
      image: {
        src: `${IMG}/Frame-4518-1000x1156-c-default.webp`,
        width: 1000,
        height: 1156,
      },
    },
    {
      number: "03",
      title: "Design Development + Integration",
      caption: "From vision to reality",
      text: "Modern residence halls are living-learning communities, not just dormitories. We develop designs that support academic success, social connection, and personal growth, while keeping a close eye on quality, efficiency, and long-term maintainability.",
      // Unsuffixed slug — the senior-housing sibling's identically-named phase
      // points at `design-development-integration-2`. Both are verbatim.
      href: "/processes/design-development-integration/?ids=947%2C949%2C951%2C3200%2C969",
      image: {
        src: `${IMG}/Frame-4456-1000x1156-c-default.webp`,
        width: 1000,
        height: 1156,
      },
    },
    {
      number: "04",
      title: "Community Engagement + Approvals",
      caption: "Clear paths to approval",
      text: "Student housing projects involve a lot of stakeholders, from campus review boards to neighboring communities. We manage that engagement proactively, making sure design solutions reflect feedback without losing sight of quality or vision.",
      href: "/processes/community-engagement-approvals/?ids=947%2C949%2C951%2C3200%2C969",
      image: {
        src: `${IMG}/Frame-4474-1000x1156-c-default.webp`,
        width: 1000,
        height: 1156,
      },
    },
    {
      number: "05",
      title: "Delivery + Post-Occupancy Evaluation",
      // Verbatim, capital "I" in "move-In" and all.
      caption: "Performance beyond move-In",
      text: "Student housing runs on a fixed calendar. Students need to move in on time, and there is no flexibility on that deadline. Our disciplined delivery process keeps construction on track and design intent intact all the way through.",
      href: "/processes/delivery-post-occupancy-evaluation/?ids=947%2C949%2C951%2C3200%2C969",
      image: {
        src: `${IMG}/Frame-4467-1000x1156-c-default.webp`,
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
 * These do NOT use the `<strong>lead</strong><br>text` shape the senior-housing
 * sibling does. This page's `blocks/BLOCKS.json` records each item as *two*
 * sibling `<p>`s — `<p><strong>Title</strong></p>` then `<p>body</p>` — with no
 * `<br>` anywhere, and the block screenshot confirms the wider gap that implies.
 * So each item is modelled as two `paragraph` nodes: a `lead`-only one and a
 * `text`-only one, which is what puts the source's `p + p { margin-top: 15px }`
 * between the bold line and its body.
 *
 * This page's rich text is NOT the usual market-page shape. Instead of
 * `<p><strong>lead</strong><br>text</p>`, the source ships a bold-only `<p>`
 * followed by a separate body `<p>`, with no `<br>` at all — hence the
 * `lead`-only nodes below, each followed by its own `text`-only node. The bold
 * line and its body sit 38px apart (21.6 + the source's `p + p` 15px).
 *
 * `BlockWysiwyg` used to emit the `<br>` unconditionally after any `lead`,
 * which added an empty line box and inflated each item by 21.6px; this file
 * carried a `[&_br]:hidden` workaround for it. The block now emits the break
 * only when a `lead` is actually followed by `text`, so the workaround is gone.
 */

export const WYSIWYG_EXPERTISE: BlockWysiwygProps = {
  tagline: "Tailored Campus Living",
  title: "Specialized Student Housing Expertise",
  body: [
    { type: "paragraph", lead: "First-Year Experience Housing" },
    {
      type: "paragraph",
      text: "Living away from home for the first time is a big transition. We design residence halls that ease that shift with strong community spaces, clear wayfinding, and environments that help new students find their footing.",
    },
    { type: "paragraph", lead: "Upper-Division and Graduate Housing" },
    {
      type: "paragraph",
      text: "Older students need more independence. We design apartment-style units with the privacy, amenities, and flexibility that upper-division and graduate students expect.",
    },
    { type: "paragraph", lead: "Living-Learning Communities" },
    {
      type: "paragraph",
      text: "When academic programming and residential life share the same space, something special happens. We design integrated environments where themed communities and shared academic spaces reinforce each other.",
    },
    { type: "paragraph", lead: "Accessible and Inclusive Housing" },
    {
      type: "paragraph",
      text: "We go beyond code minimums to create housing that works for everyone, with universal design principles, enhanced accessibility, and gender-inclusive facilities built in from the start.",
    },
  ],
};

export const WYSIWYG_WHY_LPAS: BlockWysiwygProps = {
  tagline: "Experience Universities Trust",
  title: "Why Universities Choose LPAS for Student Housing",
  body: [
    { type: "paragraph", lead: "Students Come First" },
    {
      type: "paragraph",
      text: "We listen to students before we start designing. That means housing reflects how they actually live, not just how administrators imagine they do.",
    },
    { type: "paragraph", lead: "Inclusive by Design" },
    {
      type: "paragraph",
      text: "From gender-inclusive facilities to universal accessibility and affinity-focused planning, we create environments where every student genuinely feels they belong.",
    },
    { type: "paragraph", lead: "We Know the Budget Realities" },
    {
      type: "paragraph",
      text: "University capital budgets are tight and scrutinized. We bring deep experience maximizing value within constraints, without cutting corners on the things that matter most.",
    },
    { type: "paragraph", lead: "Regulatory Experience" },
    {
      type: "paragraph",
      text: "We know DSA, university system requirements, and the approval processes that come with public institution projects. We navigate them confidently so your project stays on schedule.",
    },
    { type: "paragraph", lead: "Housing That Supports Success" },
    {
      type: "paragraph",
      text: "We design living-learning communities that do more than provide shelter. They support retention, academic performance, and the kind of campus experience students remember for life.",
    },
  ],
};

/* ------------------------------------------------------------------ *
 * Highlighted projects — one `layoutTwo`, three tiles
 * ------------------------------------------------------------------ *
 *
 * `layoutTwo` is the mirrored variant: the `smallImagesWrapper` comes first in
 * the DOM, the large tile second. That is the order `BLOCKS.json` records (CSU
 * Stanislaus and West Valley-Mission in the wrapper, Sacramento State after it),
 * and the tile crops confirm it — the first two are 1280×800 grid crops rendered
 * at 328×205, the third the 665×415 hero.
 *
 * The source ships all three with `alt=""`; the pass-1 convention restates the
 * project title so the tiles are not silent to screen readers. Kept.
 */

const CSU_STANISLAUS: ProjectCard = {
  title: "CSU Stanislaus Residences Village 4",
  location: "Turlock, CA",
  href: "/portfolio/csu-stanislaus-residences-village-4/",
  image: {
    src: `${IMG}/CSU-Stanislaus-ASH-Residence_05-1280x800-c-default.webp`,
    alt: "CSU Stanislaus Residences Village 4",
    width: 1280,
    height: 800,
  },
  size: "small",
};

const WEST_VALLEY_MISSION: ProjectCard = {
  title: "West Valley-Mission Community College District Housing Initiative",
  location: "Santa Clara, CA",
  href: "/portfolio/west-valley-mission-community-college-district-housing-initiative/",
  image: {
    src: `${IMG}/WVM-Student-Housing_01-1280x800-c-default.webp`,
    alt: "West Valley-Mission Community College District Housing Initiative",
    width: 1280,
    height: 800,
  },
  size: "small",
};

const SACRAMENTO_STATE_FACULTY_STAFF_HOUSING: ProjectCard = {
  title: "Sacramento State Faculty & Staff Housing",
  location: "Sacramento, CA",
  href: "/portfolio/sacramento-state-faculty-staff-housing/",
  image: {
    src: `${IMG}/04_CSUS-Faculty-Housing-1280x800-c-default.webp`,
    alt: "Sacramento State Faculty & Staff Housing",
    width: 1280,
    height: 800,
  },
  size: "large",
};

/**
 * Header copy is verbatim: capital "Projects" here (the senior-housing sibling
 * lowercases it), and "All Student Housing" on the button. There is no
 * `layoutThree` on this page, so no footer call-to-action either — the header
 * button is the only route out to the filtered portfolio.
 */
export const PROJECTS: BlockProjectsHighlightProps = {
  title: "Highlighted Projects",
  button: { title: "All Student Housing", href: "/portfolio/?market=student-housing" },
  layouts: [
    {
      variant: "two",
      small: [CSU_STANISLAUS, WEST_VALLEY_MISSION],
      large: SACRAMENTO_STATE_FACULTY_STAFF_HOUSING,
    },
  ],
};
