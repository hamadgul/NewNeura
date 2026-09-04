/**
 * Content for `/work/packship/`.
 *
 * Every string is verbatim from the `packship` entry of `CASE_STUDIES` in the
 * NeuraGul source's `pages/content.py`, cross-checked against the built
 * `work/packship/index.html`. Nothing is paraphrased and nothing is invented.
 *
 * Image note: PackShip has exactly one asset, `packship.jpg` (1200x750), and it
 * is spent on the page header. There is no second shot, so this page carries no
 * media block at all — three `BlockImageFull` instances of the same cover would
 * be padding, not content. What the project does have is three written
 * `features`, and `BlockWysiwyg`'s tagline + title + body shape carries one
 * feature per instance exactly as the source lays them out.
 *
 * Ordering note: `BlockWysiwyg` appears four times (three features, then the
 * outcome), so the exported constants are numbered by their position on the
 * page.
 *
 * VOICE — the source site is written in the first person singular, because it
 * was one person. It is a team, so this site says "we", which on this page is
 * the second section's heading: "What we built". Every metric, stack entry,
 * outcome and live URL below is exactly as the source records it.
 */
import type { BlockHeaderProjectsProps } from "@/components/site/shared/blocks/BlockHeaderProjects";
import type { BlockIntroDoubleProps } from "@/components/site/shared/blocks/BlockIntroDouble";
import type { BlockWysiwygProps } from "@/components/site/shared/blocks/BlockWysiwyg";
import type { ProjectDetail } from "@/components/site/shared/blocks/BlockProjectDetails";

const IMAGES = "/site/images";

/**
 * The live source title is "PackShip — NeuraGul", i.e. the root layout's
 * `"%s — NeuraGul"` template applied to the project name.
 */
export const PROJECT_TITLE = "PackShip";
export const PROJECT_CANONICAL = "/work/packship/";
/** The `brief`, which is what the source serves as this page's description. */
export const PROJECT_DESCRIPTION =
  "Shipping a parcel means guessing three things at once: which box, what it will cost, which carrier. PackShip answers all three from one photo.";
export const PROJECT_OG_IMAGE = `${IMAGES}/packship.jpg`;

/**
 * Header. `lead` is the project's OUTCOME, not its brief: the brief is the
 * `BlockIntroDouble` statement two blocks down, and printing it in both slots
 * repeated the same sentence inside two screens on every case study.
 */
export const PROJECT_HEADER: BlockHeaderProjectsProps = {
  title: "PackShip",
  lead: "Live on the App Store as a consumer product, where a multi-step chore became one photo and a tap.",
  location: "2026 · iOS",
  service: "Applied AI · App Development",
  breadcrumbLabel: "Work",
  breadcrumbHref: "/work/",
  backLabel: "All work",
  image: {
    src: `${IMAGES}/packship.jpg`,
    alt: "",
    width: 1200,
    height: 750,
  },
};

/**
 * Block 2 — `BlockIntroDouble`, the two-label variant.
 *
 * The source page's first two headed sections, "The brief" and "What I built"
 * (rewritten to "What we built" for this site's voice), map onto the block's own
 * two halves: the active label sits over the `font-L` statement, the muted one
 * over the body copy.
 */
export const PROJECT_INTRO: BlockIntroDoubleProps = {
  labels: ["The brief", "What we built"],
  activeLabel: 0,
  statement:
    "Shipping a parcel means guessing three things at once: which box, what it will cost, which carrier. PackShip answers all three from one photo.",
  body: "An iOS app that sizes an item from a photograph, fits it into the right box with a live 3D packing view, then races UPS, FedEx, and USPS rates against each other on screen. React Native on the front, Postgres and Redis behind it so the rate lookups come back fast enough to feel instant.",
};

/** Block 3 — `BlockWysiwyg` (first instance): the source's "Outcome" section. */
export const PROJECT_OUTCOME: BlockWysiwygProps = {
  title: "Outcome",
  body: [
    {
      type: "paragraph",
      text: "Live on the App Store as a consumer product. A multi-step, error-prone chore became one photo and a tap.",
    },
  ],
};

/**
 * Blocks 4-6 — `BlockWysiwyg` (second, third and fourth instances): the three
 * `features`, in source order.
 *
 * Each feature is a label, a title and a paragraph, which is precisely the
 * block's tagline / title / body shape — the same shape the service sub-pages
 * use. The source's single "How it works" heading above the run is section
 * chrome with no slot here, and it is dropped rather than repeated three times
 * as a tagline the labels already earn.
 */
export const PROJECT_FEATURE_ONE: BlockWysiwygProps = {
  tagline: "On-device model",
  title: "One photo, measured.",
  body: [
    {
      type: "paragraph",
      text: "A model running on the phone estimates an item's dimensions from a single photograph. No LiDAR needed. Typical error lands around a centimetre, which is less than the padding most people were going to stuff in anyway.",
    },
  ],
};

export const PROJECT_FEATURE_TWO: BlockWysiwygProps = {
  tagline: "Three.js in React Native",
  title: "Watch it pack itself.",
  body: [
    {
      type: "paragraph",
      text: "A live 3D scene fits your items into candidate boxes while you watch. Rotate it. Swap the box. See exactly how much empty air you were about to pay to ship across the country.",
    },
  ],
};

export const PROJECT_FEATURE_THREE: BlockWysiwygProps = {
  tagline: "Carrier APIs on Redis",
  title: "Three carriers, racing.",
  body: [
    {
      type: "paragraph",
      text: "UPS, FedEx, and USPS rates sit side by side and re-quote themselves every time the box changes. The cheapest safe option wins, usually by a wider margin than people expect.",
    },
  ],
};

/**
 * Block 7 — `BlockProjectDetails`. The live row uses the source's own
 * `live_label` as its label and the App Store URL as its value; the block
 * renders values as text, so the address is written the way it would be read
 * aloud rather than as an unclickable full URL.
 */
export const PROJECT_DETAILS: ProjectDetail[] = [
  { label: "Stack", value: "React Native, TypeScript, Three.js, Postgres, Redis" },
  { label: "Year", value: "2026" },
  { label: "Platform", value: "iOS" },
  {
    label: "App Store",
    value: "apps.apple.com/app/id6754204899",
    href: "https://apps.apple.com/app/id6754204899",
  },
];
