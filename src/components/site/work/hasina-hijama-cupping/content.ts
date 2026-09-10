/**
 * Content for `/work/hasina-hijama-cupping/`.
 *
 * Unlike the other nine, this case study has no entry in the NeuraGul source's
 * `CASE_STUDIES` — it is a NeuraGul project, added on 2026-09-07 at the user's
 * request ("Add my project ... to the project list"). So every fact below was
 * read out of the project itself at `~/Projects/Hijama Site` and verified
 * against the live site, rather than copied from `pages/content.py`:
 *
 *   README.md            the stack, the page inventory, the font subsetting,
 *                        and the pre-launch state (the domain was serving a
 *                        GoDaddy parking lander)
 *   lib/site.ts          the practice's details and the canonical-host note
 *   app/                 the ten routes counted below
 *   git log              first commit 2026-08-24, last 2026-08-29 -> "2026"
 *   curl                 www.hasinahijamacupping.com returns 200 with the
 *                        site's own <title>; the apex 308s to www
 *
 * NOTHING here is a metric that was not measured. The practice's 5.0 from 175+
 * Google reviews is real but it is the CLIENT's rating, earned in a treatment
 * room, not an outcome this build produced — so it is not the outcome, and it
 * is not marked up as schema on their site either, deliberately. The outcome
 * below is the one thing the build itself can be credited with: the pages
 * exist, they are indexable, and the domain now serves them.
 *
 * The user called the project "hasinahijama.com". That host does not resolve;
 * the live one is `www.hasinahijamacupping.com` and the apex redirects to it.
 * The real host is what ships.
 *
 * VOICE — "we", like every other page here. See the note in
 * `work/landscape-drainage-proz/content.ts`.
 */
import type { BlockHeaderProjectsProps } from "@/components/site/shared/blocks/BlockHeaderProjects";
import type { BlockIntroDoubleProps } from "@/components/site/shared/blocks/BlockIntroDouble";
import type { BlockWysiwygProps } from "@/components/site/shared/blocks/BlockWysiwyg";
import type { ProjectDetail } from "@/components/site/shared/blocks/BlockProjectDetails";

const IMAGES = "/site/images";

/**
 * The `<title>` stem, suffixed by the root layout's `"%s — NeuraGul"` template.
 * Names the client and the category of work, because a title is read cold in a
 * result list — the same rule the other case studies follow.
 */
export const PROJECT_TITLE = "Hasina Hijama Cupping: a Local SEO Build";
export const PROJECT_CANONICAL = "/work/hasina-hijama-cupping/";
export const PROJECT_DESCRIPTION =
  "A ten-page Next.js site for a Queens hijama practice, built around the searches its patients actually make. A NeuraGul web development case study.";
export const PROJECT_OG_IMAGE = `${IMAGES}/hasinahijama.jpg`;

/**
 * `www`, not the apex. The apex 308-redirects to it at the Vercel edge, and a
 * link that redirects is a link that spends a hop — the project's own
 * `lib/site.ts` carries a note about exactly this.
 */
export const PROJECT_LIVE = {
  url: "https://www.hasinahijamacupping.com",
  label: "Live site",
  display: "hasinahijamacupping.com",
} as const;

/**
 * Header. `lead` is the outcome, matching every other case study; the brief is
 * the `BlockIntroDouble` statement below.
 */
export const PROJECT_HEADER: BlockHeaderProjectsProps = {
  title: "Hasina Hijama Cupping",
  lead: "Ten pages live, on a domain that was a parking page.",
  location: "2026 · Next.js",
  service: "Web Development",
  breadcrumbLabel: "Work",
  breadcrumbHref: "/work/",
  backLabel: "All work",
  image: {
    src: `${IMAGES}/hasinahijama.jpg`,
    alt: "",
    width: 1200,
    height: 750,
  },
};

/**
 * Block 2 — the brief and what we built, in the two-label variant every case
 * study here uses. `labels` below is the raw pair; on the page,
 * `projectIntroTabs` overwrites it to "The brief" / "The tech stack" and moves
 * this section's `statement`/`body` into the first tab, so "What we built"
 * itself never renders.
 *
 * The build detail is specific because it is the interesting part: six of the
 * ten pages exist to answer one question each ("what does it cost", "do the
 * marks bruise", "is there a woman practitioner"), which is a search-shaped
 * site rather than a brochure with a services page.
 */
export const PROJECT_INTRO: BlockIntroDoubleProps = {
  labels: ["The brief", "What we built"],
  activeLabel: 0,
  statement:
    "A hijama practice in Flushing with a five-star reputation and no website — its domain served a parking page.",
  body: "Ten pages in Next.js: the practice, its services and prices, a guide to what hijama is, and six pages each answering a single question people actually type — cost, the marks, women practitioners, cupping in NYC, red light therapy. LocalBusiness structured data on every page, a sitemap and robots, and llms.txt and ai.txt so an AI crawler gets the same answers a reader does.",
};

/**
 * Block 3 — outcome.
 *
 * Deliberately unglamorous and deliberately checkable. There is no traffic
 * number here because the site launched in August 2026 and no ranking data has
 * been collected; inventing one would be the easiest thing on this page to get
 * caught doing.
 */
export const PROJECT_OUTCOME: BlockWysiwygProps = {
  title: "Outcome",
  body: [
    {
      type: "paragraph",
      text: "Ten pages live, every one of them indexable, on a domain that had been serving a registrar's parking page.",
    },
  ],
};

/**
 * Block 4 — the details row.
 *
 * `Stack` stays in this array — `projectIntroTabs` (in `page.tsx`) still reads
 * it to build the second intro tab — but `projectDetailsWithoutStack` filters
 * it out before this array reaches `BlockProjectDetails`, so the rendered
 * table only ever sees the other three rows. `BlockProjectDetails` auto-places
 * pairs, so those three rows read (Year | Platform) then (Live site | —, its
 * column empty, since there is no fourth row to pair with it).
 */
export const PROJECT_DETAILS: ProjectDetail[] = [
  { label: "Stack", value: "Next.js 16, React 19, TypeScript, Vercel" },
  { label: "Year", value: "2026" },
  { label: "Platform", value: "Web" },
  { label: PROJECT_LIVE.label, value: PROJECT_LIVE.display, href: PROJECT_LIVE.url },
];
