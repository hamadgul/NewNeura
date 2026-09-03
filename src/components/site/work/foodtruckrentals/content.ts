/**
 * Content for `/work/foodtruckrentals/`.
 *
 * Every string is verbatim from the `foodtruckrentals` entry of `CASE_STUDIES`
 * in the NeuraGul source's `pages/content.py`, cross-checked against the built
 * `work/foodtruckrentals/index.html`. Nothing is paraphrased and nothing is
 * invented.
 *
 * Image sizing note: `width`/`height` are the assets' true decoded pixels
 * (1200x750 for the cover, 1600x1000 for the two screens). `next/image`
 * reserves the aspect ratio from them, and every block here takes its height
 * from that ratio rather than from a fixed number.
 *
 * Alt text note: the source's two `media` captions become the screenshots' own
 * `alt` strings. The architecture layout this shell came from shipped `alt=""`
 * because its media were decorative photographs; these are informative
 * screenshots, so the caption is the description.
 */
import type { BlockHeaderProjectsProps } from "@/components/site/shared/blocks/BlockHeaderProjects";
import type { BlockIntroDoubleProps } from "@/components/site/shared/blocks/BlockIntroDouble";
import type { BlockMediaDoubleQuoteProps } from "@/components/site/shared/blocks/BlockMediaDoubleQuote";
import type { BlockWysiwygProps } from "@/components/site/shared/blocks/BlockWysiwyg";
import type { ProjectDetail } from "@/components/site/shared/blocks/BlockProjectDetails";

const IMAGES = "/site/images";

/**
 * The live source title is "Food Truck Rentals — NeuraGul", i.e. the root
 * layout's `"%s — NeuraGul"` template applied to the project name.
 */
export const PROJECT_TITLE = "Food Truck Rentals";
export const PROJECT_CANONICAL = "/work/foodtruckrentals/";
/** The `brief`, which is what the source serves as this page's description. */
export const PROJECT_DESCRIPTION =
  "A New York brand-activation company wraps, staffs, and permits food trucks for fashion houses, department stores, and restaurants. They were selling all of it without a website of their own.";
export const PROJECT_OG_IMAGE = `${IMAGES}/foodtruckrentals.jpg`;

/**
 * Header. `lead` is the project's OUTCOME, not its brief: the brief is the
 * `BlockIntroDouble` statement two blocks down, and printing it in both slots
 * repeated the same sentence inside two screens on every case study.
 */
export const PROJECT_HEADER: BlockHeaderProjectsProps = {
  title: "Food Truck Rentals",
  lead: "A live national site, indexed and structured to compete well past its first city.",
  location: "2026 · Web",
  service: "Web Development · Data Intelligence",
  breadcrumbLabel: "Work",
  breadcrumbHref: "/work/",
  backLabel: "All work",
  image: {
    src: `${IMAGES}/foodtruckrentals.jpg`,
    alt: "",
    width: 1200,
    height: 750,
  },
};

/**
 * Block 2 — `BlockIntroDouble`, the two-label variant.
 *
 * The source's first two headed sections map onto the block's own two halves:
 * the active label sits over the `font-L` statement (the brief), the muted one
 * over the body copy (what I built). This project's `built` is the longest of
 * the nine, and the block's two-column measure at `xl` is what it is for.
 */
export const PROJECT_INTRO: BlockIntroDoubleProps = {
  labels: ["The brief", "What I built"],
  activeLabel: 0,
  statement:
    "A New York brand-activation company wraps, staffs, and permits food trucks for fashion houses, department stores, and restaurants. They were selling all of it without a website of their own.",
  body: "Twenty-four pages of Next.js 16 built around the work itself: a full-bleed activation hero, a truck roster that animates along a variable-width axis, and a dedicated page for every way a truck gets rented. Weddings. Product launches. Film production, corporate events, ice cream, coffee carts, and the tri-state markets. Every commercial page carries JSON-LD Service, FAQ, and LocalBusiness data generated from a single pricing module, so a published price can never drift away from the page it sits on. Keyword research shapes the URL structure, and 119 Vitest tests guard it, including one that fails the build outright if two pages start competing for the same keyword cluster.",
};

/** Block 3 — `BlockWysiwyg`: the source's "Outcome" section, in its own place. */
export const PROJECT_OUTCOME: BlockWysiwygProps = {
  title: "Outcome",
  body: [
    {
      type: "paragraph",
      text: "A live national site, indexed and structured to compete well past its first city. The flagship URL now targets a 12,100/mo search term. It launched on a local qualifier worth 320.",
    },
  ],
};

/**
 * Block 4 — `BlockMediaDoubleQuote`, carrying both of this project's screens.
 *
 * At `xl` the blockquote sits directly under the *small* media, so the quote is
 * that image's own caption rather than a pull-quote borrowed from elsewhere:
 * the work-index caption goes with the work-index screenshot. The home page's
 * caption rides in the large image's `alt`, because the block gives the large
 * slot no text of its own.
 */
export const PROJECT_MEDIA_QUOTE: BlockMediaDoubleQuoteProps = {
  large: {
    type: "image",
    src: `${IMAGES}/foodtruckrentals-home.jpg`,
    alt: "Home page. The activation hero, with the roster of wrapped trucks alongside it.",
    width: 1600,
    height: 1000,
  },
  small: {
    type: "image",
    src: `${IMAGES}/foodtruckrentals-work.jpg`,
    alt: "The work index. Every activation, with the client, the borough, and the year.",
    width: 1600,
    height: 1000,
  },
  quote: "The work index. Every activation, with the client, the borough, and the year.",
};

/**
 * Block 5 — `BlockProjectDetails`. The live row takes the source's own
 * `live_label` as its label; the block renders values as text, so the address is
 * written the way it would be read rather than as an unclickable full URL.
 */
export const PROJECT_DETAILS: ProjectDetail[] = [
  { label: "Stack", value: "TypeScript, Next.js 16, React 19, Tailwind CSS, Technical SEO" },
  { label: "Year", value: "2026" },
  { label: "Platform", value: "Web" },
  {
    label: "Live site",
    value: "foodtruckrentals.com",
    href: "https://www.foodtruckrentals.com",
  },
];
