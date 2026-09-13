/**
 * Site-wide and homepage content for neuragul.com.
 *
 * Copy is drawn from the NeuraGul source site (`pages/content.py`) and carries
 * its voice rules: no "X, not Y" antithesis, at most three em dashes per block,
 * varied sentence length, a checkable number in place of an adjective wherever
 * one exists.
 *
 * VOICE — the source site is written in the first person singular, because it
 * was one person. It is a team, so this site says "we". Hamad Gul is named at
 * the human moments only: the contact promise, the About page's "who you'd be
 * working with", and the process step about staying on after launch. He is
 * "your primary point of contact and one of the developers on your project".
 *
 * Nothing here claims a headcount, a capacity or a team size. Those are not
 * facts anyone has established, and the copy stands without them.
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
const VIDEOS = "/site/videos";
const VIDEO = "/site/videos";

/**
 * The office loop behind the hero intro panel.
 *
 * Deliberately generic interior footage — it sets the studio register without
 * claiming to be a specific room, which matters for a practice with no street
 * office.
 */
export const HERO_VIDEO = {
  src: `${VIDEO}/office.mp4`,
  /*
   * WebP, not the `.jpg` beside it, and deliberately a *different* file rather
   * than a re-encode of it.
   *
   * The poster is the homepage's LCP element (PageSpeed named this `<video>`
   * under both LCP and FCP), and it is the only place the raw bitmap reaches a
   * browser: `/contact/` and `/process/` use the same still through
   * `next/image`, which serves its own WebP/AVIF derivatives from the JPEG and
   * never ships the original. So the JPEG stays — it is the optimiser's source
   * and the `og:image`, where a WebP is still a coin flip with link scrapers —
   * and only the `poster` attribute moves.
   *
   * 1600x900 at cwebp `-q 66 -sharp_yuv`: 85,114 bytes against the JPEG's
   * 157,248 (-46%). The JPEG was already progressive 4:2:0 at quality 61, so
   * there was nothing left to win by re-compressing it as a JPEG; the size is
   * in the detail, not the encoder settings. Checked at 1:1 against the
   * original with the hero's own `brightness(0.5)` applied, upscaled back to
   * 1920 as the browser will: the brick texture is a shade smoother and
   * nothing else reads as different. It is a darkened backdrop behind white
   * type for the moment before the video paints, so 1600 is ample.
   */
  poster: `${VIDEO}/office-poster.webp`,
};

export const HERO_INTRO = {
  /*
    The city is added here rather than to the `<h1>` below it. The headline
    ("the software that small companies actually run on") is true of clients in
    and well outside New York — Vintus is a national importer and the Freenome
    pipeline was not local work — so putting a city in it would narrow a claim
    that is currently accurate. The eyebrow states where the team is, which is
    the fact, and it is the first geographic signal above the fold.

    Slot check, swept 320-1728px: one line everywhere except the 768-900px
    band, where `[grid-column:1/7]` is only ~196px and it wraps to two. That is
    not a defect there — `eyebrowRight` ("Built and maintained by the same
    team") and the scroll cue already wrap to two lines at those widths, so the
    row is two lines tall regardless and all three now align. Measured: the
    title's top is unmoved (748px at 768, 744px at 800).

    Below 768 these two STACK — see the note on `homeHero__detail--two` in
    `HeroIntroPanel.tsx`. The source lays them out as overlapping grid areas on
    one row and relies on its own strings being short enough not to meet
    ("Architecture + Interiors" / "A Market-Focused Approach"); both of ours are
    longer and collided on every phone until they were stacked. So if you
    lengthen either string, check the phone widths, not just the desktop slot —
    and each must still fit ONE line inside `main-start`/`main-end` at 320px,
    which is 270px. Both currently do, with little to spare.
  */
  eyebrowLeft: "Software + Applied AI · New York",
  eyebrowRight: "Built and maintained by the same team",
  /** Shown ≥768px. */
  scrollCueDesktop: "Scroll to explore",
  /** Shown <768px. */
  scrollCueMobile: "Swipe up to explore",
  heading: "We build the software that small companies run on",
};

/**
 * The five service lines, in strip order.
 *
 * Two cards carry `subPages`. Applied AI's are real child routes (the two
 * that survived the 2026-09-12 trim). Web Development has no child routes, so
 * its three are fragment links into the parent page — a block for the first
 * and third, a slide of the pinned deliverables slider for "SEO" (see
 * `ProcessPhase.id`). Added 2026-09-13; "Web Apps" was floated for the middle
 * slot but nothing on that page is about web apps, so it was not linked to.
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
    subPages: [
      { title: "Websites", href: "/services/web-development/#websites" },
      { title: "SEO", href: "/services/web-development/#seo" },
      { title: "Our work", href: "/services/web-development/#work" },
    ],
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
    /*
      PackShip's shot is two phones side by side, measured at x 134-566 and
      634-1066 of 1200 with a 68px gap between them. The stacked band's strip is
      275px tall and 101-215px wide, so `object-cover` scales the image to 440px
      and shows only the middle ~100 of it — which is exactly that gap, plus a
      sliver of each device. This crop is the same photograph cut to 110-590,
      i.e. the LEFT-hand device centred, and it is the only card that needs one.

      The right-hand device (the shipping-rate list) was the first crop and the
      user replaced it: at ~100px wide those rows are unreadable grey type,
      while the box-packing view carries a red/blue/green solid that still
      reads. "The one its using right now is more bland than the other one".
    */
    imageStacked: {
      src: `${IMG}/packship-stacked.jpg`,
      alt: "PackShip on iOS",
      width: 480,
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
      src: `${IMG}/pizzeria.jpg`,
      alt: "The restaurant ordering portal",
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
 * The homepage's about block. `tagline` is the four-beat engagement shorthand.
 * It used to be the same four words the preloader unfolded; the preloader now
 * spells out NEURA, so the two are independent.
 *
 * This is the one place on the homepage where Hamad is named — the "who you'd
 * be working with" beat. Everywhere else on this page the voice is "we".
 */
export const INTRO_BLOCK = {
  title: "A team that holds the whole system, and one number that always answers.",
  tagline: "Talk. Scope. Build. Stay.",
  text: "NeuraGul is a software development team in New York: developers, designers and engineers. We mostly build operational software: the dispatch app that plans six vans every morning, an ordering portal that lets a pizzeria skip delivery-app commissions, a wine importer's trade portal we maintain. Hamad Gul is your primary point of contact and one of the developers on your project, so the person who scopes the work is also one of the people writing it. You always know who is on your project, and the same people are still reachable six months after launch.",
  /*
    The anchor text was "More about us", which describes the click and not the
    destination. Internal anchor text is one of the few on-page signals that
    acts on the *target* page, and `/about/` now competes on "New York software
    development team" — so the one link the homepage points at it should say so.
    `ButtonArrow` sets `whitespace-nowrap` on the label and the slot is an
    8-column span, so the longer string neither wraps nor overflows.
  */
  cta: { label: "About our New York team", href: "/about/" },
};

/** Service pills with their project counts, sized off the nine real projects. */
export const PORTFOLIO_FILTERS: PortfolioFilterItem[] = [
  { label: "Applied AI", count: 2, href: "/work/?service=applied-ai" },
  { label: "Web Development", count: 6, href: "/work/?service=web-development" },
  { label: "App Development", count: 1, href: "/work/?service=app-development" },
  { label: "Cloud & Infrastructure", count: 1, href: "/work/?service=cloud-infrastructure" },
  { label: "Data Intelligence", count: 4, href: "/work/?service=data-intelligence" },
];

/**
 * The homepage work grid: six of the ten, in the order the source site
 * features them. Hasina Hijama Cupping is not among them — the grid is a
 * curated six, not a feed, and the full list lives at `/work/`.
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
      alt: "The delivery routing platform, showing six drivers' solved routes",
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
      alt: "The PackShip parcel-sizing app on iOS",
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
      alt: "The Food Truck Rentals home page",
      width: 1200,
      height: 750,
    },
    size: "small",
  },
];

/** Row two mirrors row one: two small tiles left, one large tile right. */
export const PROJECTS_ROW_TWO: ProjectCard[] = [
  {
    title: "New York Fine Foods",
    location: "2026 · Web",
    href: "/work/new-york-fine-foods/",
    image: {
      src: `${IMG}/nyff.jpg`,
      alt: "The New York Fine Foods catering site",
      width: 1200,
      height: 750,
    },
    /*
      Replaced Vintus here on 2026-09-12: "replace vintus with newyorkfinefoods
      on the homepage under selected work section. make sure its the moving
      video we have". Same 9s hero capture the case study and the Work index
      play; `nyff.jpg` is its poster frame.
    */
    video: { src: `${VIDEOS}/nyff-hero.mp4` },
    size: "small",
  },
  {
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
  },
  {
    title: "New York Mobile Mechanic",
    location: "2026 · Web",
    href: "/work/new-york-mobile-mechanic/",
    image: {
      src: `${IMG}/nymm.jpg`,
      alt: "The New York Mobile Mechanic home page",
      width: 1200,
      height: 750,
    },
    /*
      The same 3s hero loop the case study runs. The still stays above it as the
      poster and the reduced-motion fallback — it is a frame of this very clip,
      so nothing flashes before the first frame decodes.

      Two of the six tiles move — this one and New York Fine Foods above — the
      same two that play on the Work index. Six that all play would read as a
      page that will not sit still.
    */
    video: { src: `${VIDEOS}/nymm-hero-loop.mp4` },
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
    { label: "How we work", href: "/process/" },
    { label: "Contact", href: "/contact/" },
  ],
};

/**
 * A single contact record, where the layout was built for a pair of offices.
 *
 * There is no street address: the team works out of New York with no street
 * office, so the locality line is the honest version of that slot.
 */
export const OFFICES: OfficeContact[] = [
  {
    /*
      Both strings below are governed by the Google Business Profile's own
      service-area list, transcribed into `AREA_SERVED` in `lib/seo.ts`. A page
      that claims a geography its own listing does not is the NAP inconsistency
      local ranking punishes, so these two move only when the profile moves.

      History worth not repeating: this record said "NYC based" / "Working
      across the five boroughs". The profile says "No location; deliveries and
      home services only", lists three boroughs rather than five, and lists
      three Connecticut towns the site never mentioned. An intermediate pass
      also put Westchester here, inferred by reverse-geocoding the profile's
      hidden pin — the profile lists no Westchester at all.
    */
    label: "New York & Connecticut",
    /*
      Two lines, because `ContactInfo` was measured against a 37.8px two-line
      box — so each entry must fit on ONE line or the box renders three deep.
      The slot is much narrower than it looks: 165px at 390, 170px at 1280,
      193px at 1440, 236px at 1728. Measured in the live slot, at all four:

        "Queens, Brooklyn, Manhattan"     wraps below 1440
        "Fairfield County, Connecticut"   wraps below 1440
        "New York City"                   1 line everywhere  ← used
        "and Fairfield County, CT"        1 line everywhere  ← used

      The six Queens neighbourhoods the profile lists do not fit two short
      lines and do not need to — they are carried in full by `areaServed`,
      which is what Google actually reads for service-area geography.
    */
    address: ["New York City", "and Fairfield County, CT"],
    phone: "(203) 685 9193",
    phoneHref: "tel:+12036859193",
    email: "hamad@neuragul.com",
  },
];

/** The footer's parallax panel. */
export const FOOTER_IMAGE = {
  src: `${IMG}/footer_image.png`,
  alt: "",
  width: 1672,
  height: 941,
};

/**
 * The preloader wordmark: NEURA unfolding into what the name stands for —
 * Next-Generation Engineering, Unified Research & AI. Each line grows from its
 * own leading capital, so the five capitals read as the name before the tails
 * open.
 *
 * Five words, not the four this was adapted from: the layout takes the count
 * from this array (`Preloader.tsx` chunks it two to a section), so the only
 * thing to keep in mind when editing is line length — "Next-Generation" is the
 * longest line the wordmark has ever carried and it sets the block's width at
 * every viewport.
 */
/**
 * The preloader's acronym — five letters, five words, and no sixth entry.
 *
 * The surname is NOT in this list. Adding `["G",""] ["U",""] ["L",""]` here was
 * the first attempt at "add Gul to the loading animation", and it left three
 * bare capitals hanging under "AI" at full word-line height: *"this looks kind
 * of ugly"*. A letter that expands into nothing has no business in a list whose
 * whole premise is that each letter expands into something.
 *
 * `Gul` arrives at the payoff instead — the acronym block cross-fades into the
 * `Wordmark`, so the intro explains what NEURA stands for and then lands on the
 * name the rest of the site wears. See `Preloader`.
 */
export const PRELOADER_WORDS: Array<[string, string]> = [
  ["N", "ext-Generation"],
  ["E", "ngineering"],
  ["U", "nified"],
  ["R", "esearch"],
  ["A", "I"],
];

export const FOOTER_COPYRIGHT = "© 2026 NeuraGul. All rights reserved.";
export const FOOTER_BACK_TO_TOP = "Back to top";
