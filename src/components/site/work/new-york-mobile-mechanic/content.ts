/**
 * Content for `/work/new-york-mobile-mechanic/`.
 *
 * Provenance for every string here is recorded in
 * `docs/research/case-studies/new-york-mobile-mechanic.md` (Task 11, 2026-09-11):
 * the stack from the manifest, every number with the command that proves it,
 * and the sentence each image is evidence for. Nothing below is from memory.
 *
 * ── What the 2026-09-11 rewrite changed, and why ────────────────────────────
 * Three claims on the previous page were contradicted by the repo and are gone:
 *   "Framer Motion"        — the site declares `gsap`; `framer-motion` is in no
 *                            manifest, lockfile or source file. The dials are
 *                            hand-built SVG on requestAnimationFrame.
 *   the dial list          — "jobs completed, average response time, star
 *                            rating" — the four dials are years in business,
 *                            cars serviced, Google reviews, avg text reply.
 *                            No dial shows a star rating.
 *   "schema on every route" / "exactly one exit and it is the phone" —
 *                            three of fifteen route files emit no JSON-LD, and
 *                            the site has a call link, an SMS link and a form.
 * "Core Web Vitals in the green" was not contradicted but is not evidenced
 * (field CWV is nowhere in the repo); what exists is a Lighthouse report at
 * 100 / 100 / 100 / 100, so the page says that. Echoes of all four on other
 * pages are filed as cross-page deltas in the dossier, never applied here.
 *
 * ── Assets, and why each one sits where it does ─────────────────────────────
 *   nymm.jpg          1200x750  the cover, captured from the LIVE site on
 *                               2026-09-07 (the `158+` dial). Shared by /,
 *                               /work/, /process/ and two slots on
 *                               /services/web-development/. Header only: the
 *                               hero with its four dials and two call buttons
 *                               is the page's opening image, so it is not
 *                               repeated in the body (Task 8's duplicate-cover
 *                               trap).
 *   new-york-mobile-mechanic-combo.jpg   1600x1000  a runner capture of
 *                               /service-areas/queens/brake-jobs from a scratch
 *                               copy of the repo. Full-bleed under the matrix
 *                               section.
 *   new-york-mobile-mechanic-topic.jpg   1600x1000  the same for
 *                               /services/starter-alternator/alternator-replacement.
 *   new-york-mobile-mechanic-lighthouse.jpg  1600x841  the user's own Lighthouse
 *                               screenshot of 2026-07-09, resized whole. This
 *                               is the SAME report as the frozen
 *                               `mechanicseo.png` (512x265), which used to sit
 *                               in the `small` slot of `BlockMediaDoubleQuote`
 *                               at 530px, where the scores were hard to read.
 *                               `mechanicseo.png` stays on disk for
 *                               /services/web-development/ and is no longer
 *                               placed on this page.
 *   new-york-mobile-mechanic-chatgpt-nyc.jpg     1600x1000  and
 *   new-york-mobile-mechanic-chatgpt-queens.jpg  1600x1000  the user's two
 *                               ChatGPT screenshots (2026-07-28, 2026-08-07),
 *                               resized to 1600 wide and cropped 60px off the
 *                               top (the ChatGPT chrome) and the rest off the
 *                               bottom, so the typed prompt, the map card and
 *                               the "1. Adam Mobile Mechanic" line all
 *                               survive. Paired in one
 *                               `BlockMediaDoubleQuote` because they are the
 *                               same kind of artefact ten days apart.
 *   conversion.png    1179x2203 the live /reviews page on a phone (4.9, 147
 *                               reviews, the fixed Call / Text Now bar),
 *                               committed 2026-09-02 in 17b2b8c; its capture
 *                               date is not recorded, so the quote under it
 *                               names no figure. The only portrait asset on
 *                               the site; the `small`
 *                               slot caps it at ~990px tall, whereas
 *                               `BlockImageFull` would render it 2,690px tall
 *                               at 1440. Not re-captured: a local boot has no
 *                               Google credentials and would print `5.0` from
 *                               eight curated reviews.
 *   nymm-hero-loop.mp4  1200x750 a 3s loop of the hero with the dials revving,
 *                               poster `nymm.jpg`. The evidence for the dial
 *                               sentence, which a JPEG cannot carry (it shows
 *                               the number the count ARRIVES at). Also used by
 *                               /, /work/ and /services/web-development/.
 *   nymm-hero.mp4     (no longer referenced here) the 12s pan of the whole
 *                               home page. Dropped: the cover and the loop
 *                               already show the hero, and nothing on this
 *                               page is evidenced by a pan. The file stays in
 *                               public/site/videos; it is outside this task's
 *                               paths and is noted in the report.
 *
 * VOICE — the source site is written for one mechanic and says "Adam". This
 * site says "we". No headcount, no "I", no em dash in any copy string (the
 * client's own copy test bans the em dash, which seemed worth matching).
 * Every metric, stack entry and live URL below is exactly as the repo records it.
 *
 * ── What the SEO pass changed ───────────────────────────────────────────────
 * `PROJECT_TITLE` and `PROJECT_DESCRIPTION` are metadata only — the `<title>`
 * stem and the meta description — and are written to compete in a result
 * list rather than to open a page; see the notes on each.
 */
import type { BlockHeaderProjectsProps } from "@/components/site/shared/blocks/BlockHeaderProjects";
import type { BlockImageFullProps } from "@/components/site/shared/blocks/BlockImageFull";
import type { BlockIntroDoubleProps } from "@/components/site/shared/blocks/BlockIntroDouble";
import type { BlockMediaDoubleQuoteProps } from "@/components/site/shared/blocks/BlockMediaDoubleQuote";
import type { BlockWysiwygProps } from "@/components/site/shared/blocks/BlockWysiwyg";
import type { GeneralCtaProps } from "@/components/site/shared/blocks/GeneralCta";
import type { ProjectDetail } from "@/components/site/shared/blocks/BlockProjectDetails";

const IMAGES = "/site/images";
const VIDEOS = "/site/videos";

/**
 * The `<title>` stem, suffixed by the root layout's `"%s — NeuraGul"` template.
 *
 * This is NOT the project's display name — `PROJECT_HEADER.title` is, and it
 * still reads "New York Mobile Mechanic" on the page and in the breadcrumb.
 * A `<title>` is read cold in a result list, so it names the category of work
 * as well as the client. Referenced only by `metadata` in the route file.
 */
export const PROJECT_TITLE = "New York Mobile Mechanic: Local SEO Build";
export const PROJECT_CANONICAL = "/work/new-york-mobile-mechanic/";
/**
 * The meta description. Says what was built and what it was built with, in
 * under 160 characters. "Core Web Vitals green" is gone from it: nothing in
 * the repo measures field CWV. The Lighthouse score is what exists, but it
 * is a dated report (9 July 2026) and dating it here pushed the string past
 * 160, so the figure lives only in the body, where it carries its date.
 */
export const PROJECT_DESCRIPTION =
  "A Next.js site for a 24/7 NYC mobile mechanic: 117 pages keyed off one config file, a service-by-borough matrix, JSON-LD on every service page.";
export const PROJECT_OG_IMAGE = `${IMAGES}/nymm.jpg`;

/**
 * Header. `lead` is the project's OUTCOME, not its brief: the brief is the
 * `BlockIntroDouble` statement below. 117 is the sitemap's URL count
 * (10 static + 11 services + 30 topics + 17 areas + 4 posts + 45 combos).
 * "Keyed off one config file": `content/site.config.ts` supplies the services,
 * areas and static routes that every URL is built from, and the sitemap and
 * both llms.txt routes read it; the CONTENT of the topic, combo and area pages
 * lives in `lib/service-topics.ts`, `lib/service-area-combos.ts`,
 * `lib/area-content.ts` and four MDX files, which is why the sentence says
 * "keyed off" and not "became". "Call and Text one tap away on every page":
 * the ACTIONS are, not one component. The fixed bottom bar with `Call`
 * (`tel:`) and `Text Now` (`sms:`) is mobile-only, hidden by an
 * `IntersectionObserver` while the hero (which has its own call button) is
 * on screen, and suppressed on `/contact`, where the same two actions are
 * in-page (dossier "Book and Call are one tap away on every page",
 * `components/layout/Nav.tsx:32-44, 438-483`; the `BlockWysiwyg` paragraph
 * below says "on every page but the contact page"). So the claim holds for
 * tel:/sms: on every page; the bar is the mobile mechanism on all but one.
 * A "mobile" qualifier was tried in the lead and does not fit 85 characters
 * without dropping "every page" or "one config file", so the lead keeps the
 * dossier's headline wording and this comment carries the qualification.
 *
 * LENGTH IS MEASURED, NOT CHOSEN. The header's text band is a fixed 500px
 * from `md` up and the lead shares its columns with the service line; the
 * lead's slot is three lines at 1280 (xl: lines 12-19, ~27 chars/line). The
 * previous 145-char lead ran five lines and printed over "Web Development"
 * by 99x6.5px at 1024, passed the meta row by 35.5px at 1280/1440 and sat
 * 2.3px from it at 768. This 83-char lead measures 3 lines at 768/1024/1280/
 * 1440 with the block's own 35px gap intact (lead.bottom - meta.top = -64.7 /
 * -66.3 / -37.3 / -37.3), 3 lines at 390 and 4 at 320. The "search a stranded
 * driver types" clause it used to carry is still on the page, in the
 * `BlockIntroDouble` statement.
 */
export const PROJECT_HEADER: BlockHeaderProjectsProps = {
  title: "New York Mobile Mechanic",
  lead: "117 pages keyed off one config file, with Call and Text one tap away on every page.",
  location: "2026 · Web",
  service: "Web Development",
  breadcrumbLabel: "Work",
  breadcrumbHref: "/work/",
  backLabel: "All work",
  image: {
    src: `${IMAGES}/nymm.jpg`,
    alt: "",
    width: 1200,
    height: 750,
  },
};

/**
 * Block 2 — `BlockIntroDouble`. `projectIntroTabs` turns this into two tabs:
 * the brief (statement + body) and the `Stack` row of `PROJECT_DETAILS`.
 * The statement is the original brief, unchanged. The body is the stack in
 * prose, every item from `package.json` or the source.
 */
export const PROJECT_INTRO: BlockIntroDoubleProps = {
  labels: ["The brief", "What we built"],
  activeLabel: 0,
  statement:
    "A 24/7 mobile mechanic competing for the most urgent searches in the city. Someone is stranded and typing with one thumb.",
  body: "Next.js 16 and React 19 in TypeScript, Tailwind CSS 4, GSAP for the hero reveal and hand-built SVG dials for the numbers, zod on the site config and the contact form, 157 Vitest tests. Deployed on Vercel. Google reviews are pulled on the server through Featurable, with the Places API behind it and eight real reviews in config behind that.",
};

/**
 * Block 3 — `BlockWysiwyg`: the service-by-borough matrix.
 *
 * Numbers: `COMBO_SERVICE_SLUGS` (9) x `COMBO_AREA_SLUGS` (5) in
 * `lib/service-area-combos.ts`; `dynamicParams = false` on the route;
 * `test/combo-page.test.tsx` ("generates exactly the matrix params", "404s for
 * an off-matrix pair"); 17 entries in `serviceAreas.areas`, 17 keyed entries
 * in `lib/area-content.ts`; the doorway note is the file's own header comment.
 */
export const PROJECT_MATRIX: BlockWysiwygProps = {
  tagline: "Local SEO",
  title: "Forty-five pages, none of them thin.",
  body: [
    {
      type: "paragraph",
      text: "Nine services crossed with five boroughs make forty-five pages, each one composed from the service's own angle and a paragraph written for that borough, so the Queens brake page and the Brooklyn brake page share a service and nothing else. The route is closed: a pair that is not in the matrix returns a 404 instead of a templated page, and a test generates the whole matrix and checks that an off-matrix pair fails.",
    },
    {
      type: "paragraph",
      text: "With seventeen area pages, each carrying its own local copy, the site sits past what the file that builds the matrix calls Google's fifty-page doorway line, on purpose. The file says so in its first twenty lines, and names the Search Console report that will decide whether any cell gets pruned.",
    },
  ],
};

export const PROJECT_IMAGE_COMBO: BlockImageFullProps = {
  image: {
    src: `${IMAGES}/new-york-mobile-mechanic-combo.jpg`,
    alt: "The Queens brake-repair page: the headline Mobile Brake Repair in Queens, NY, the service's near-me intro, its description, and two sections written for Queens.",
    width: 1600,
    height: 1000,
  },
};

/**
 * Block 5 — `BlockWysiwyg`: the thirty topic pages.
 *
 * The Search Console figures are a dated record in the source
 * (`lib/service-topics.ts:5-12`, "measured 2026-08-17, GSC sc-domain, 90
 * days"), attributed here to the report and the date; this task could not
 * re-measure them (dossier, Unverifiable 5). 30 = `grep -c 'topic: "'`. The
 * pricing rule is the same header; `Diagnosis from $95` is the alternator
 * page's own `priceLabel`.
 */
export const PROJECT_TOPICS: BlockWysiwygProps = {
  tagline: "Search Console",
  title: "Thirty pages that answer one question each.",
  body: [
    {
      type: "paragraph",
      text: "The four blog posts earned 31 impressions and no clicks in the 90 days to 17 August 2026. The eleven service pages earned 1,918 impressions and 10 clicks from positions in the mid-twenties to the high fifties. Google was showing them on pages three to six and ten people clicked, because a 560-word service page does not answer the question a driver typed.",
    },
    {
      type: "paragraph",
      text: "So thirty pages went under the services, one question each: battery light on, clicking when starting, pedal goes to the floor, starts then dies. Each carries its own price chip and a note saying what that price covers. The alternator page prices the diagnosis and nothing else, because the config prices the starter and nothing else, and a rule in the file forbids inventing a rate.",
    },
  ],
};

export const PROJECT_IMAGE_TOPIC: BlockImageFullProps = {
  image: {
    src: `${IMAGES}/new-york-mobile-mechanic-topic.jpg`,
    alt: "The alternator replacement page: the headline, an answer-first lead, the Diagnosis from $95 chip with a note that the alternator itself is quoted after testing, and the first symptom section.",
    width: 1600,
    height: 1000,
  },
};

/**
 * Block 7 — `BlockWysiwyg`: the copy test. Everything here is
 * `test/copy-tells.test.ts` (eight patterns in `BLACKLIST`, the walk over
 * config, borough copy, topic pages and the raw MDX, and the comment recording
 * the six weeks the posts went unscanned).
 */
export const PROJECT_COPY_TEST: BlockWysiwygProps = {
  tagline: "Copy",
  title: "A test that fails if the writing sounds like a machine.",
  body: [
    {
      type: "paragraph",
      text: "An outside reviewer said the copy read as AI-generated. The rewrite pinned eight patterns in a test, from “peace of mind” and “no surprises” down to the em dash. The test walks every service description, FAQ, process step, borough paragraph, topic section, table cell and the raw text of every blog post. Customer reviews are excluded on purpose, because they are quoted verbatim. When two “no surprises” lines sat live for six weeks in posts the test had not covered, the posts were added to it.",
    },
  ],
};

/**
 * Block 8 — `BlockWysiwyg`: performance. The scores are the 2026-07-09 report
 * (the image below). The mechanisms: `experimental.inlineCss` in
 * `next.config.ts`; `hero-poster.avif` 13,863 B and `hero-loop-1280x700.mp4`
 * 755,140 B (`ls -la public/media`), lazy-loaded on intersection and skipped
 * under reduced motion (`HeroVideo.tsx`); `ReviewsLazy` / `GalleryPreviewLazy`
 * are `next/dynamic` with `ssr: false`.
 */
export const PROJECT_PERFORMANCE: BlockWysiwygProps = {
  tagline: "Performance",
  title: "100, four times.",
  body: [
    {
      type: "paragraph",
      text: "Lighthouse scored the home page 100 for performance, accessibility, best practices and SEO, and 3 of 3 for agentic browsing, on 9 July 2026. The choices behind it: the stylesheet is inlined into the document head, so no render-blocking request ships. The hero poster is a 14 KB AVIF, and the 755 KB video loop loads only once the hero is on screen, never for a visitor who prefers reduced motion. The reviews and gallery sections mount when scrolled to, so their markup stays out of the first response.",
    },
  ],
};

export const PROJECT_IMAGE_LIGHTHOUSE: BlockImageFullProps = {
  image: {
    src: `${IMAGES}/new-york-mobile-mechanic-lighthouse.jpg`,
    alt: "A Lighthouse report from 9 July 2026: 100 for Performance, Accessibility, Best Practices and SEO, 3/3 for Agentic Browsing, beside a thumbnail of the home page as it looked that day.",
    width: 1600,
    height: 841,
  },
};

/**
 * Block 10 — `BlockWysiwyg`: the live numbers and the phone.
 *
 * Dials: `stats` in `site.config.ts`; `REV_KEYS` (9) and `DURATION = 2400` in
 * `GaugeCounter.tsx`. Reviews: `lib/google-reviews.ts`, `lib/rating.ts`,
 * the single-source note in `HeroVideo.tsx:27-33`. The bar: `Nav.tsx:438-483`
 * (hidden while the hero intersects). The form: `app/api/contact/route.ts`
 * (honeypot, zod) and `lib/rate-limit.ts` (5 per 10 minutes).
 */
export const PROJECT_LIVE: BlockWysiwygProps = {
  tagline: "Trust",
  title: "Every number is live, and the fallback is real.",
  body: [
    {
      type: "paragraph",
      text: "The four dials on the hero read years in business, cars serviced, Google reviews and average text reply, and they rev like a tachometer: a nine-keyframe curve over 2.4 seconds, drawn as SVG through requestAnimationFrame, with the settled number shown to anyone who prefers reduced motion.",
    },
    {
      type: "paragraph",
      text: "The review count comes from Google on the server through Featurable, with the Places API behind it, and the same resolved value feeds the hero chip, the dial, the reviews page and the JSON-LD, so three surfaces can never show three numbers. If both feeds fail, the site falls back to the eight real reviews kept in config.",
    },
    {
      type: "paragraph",
      text: "On a phone, a fixed bar with Call and Text Now appears the moment the hero scrolls out of view, on every page but the contact page. The form behind that page checks a honeypot field, validates with zod, and allows five submissions per ten minutes from one address.",
    },
  ],
};

/**
 * Block 11 — `BlockMediaDoubleQuote`: the hero loop (the dials revving) beside
 * the phone-sized reviews page with the fixed bar. The block defaults
 * `autoPlay` / `loop` / `muted` to true and adds `playsInline`. The loop holds
 * the exact framing of the cover; `poster` is `nymm.jpg`, a frame of this same
 * hero, so nothing flashes before the first frame decodes. 314 KB at crf 25.
 */
export const PROJECT_MEDIA_LIVE: BlockMediaDoubleQuoteProps = {
  large: {
    type: "video",
    src: `${VIDEOS}/nymm-hero-loop.mp4`,
    poster: `${IMAGES}/nymm.jpg`,
    width: 1200,
    height: 750,
  },
  small: {
    type: "image",
    src: `${IMAGES}/conversion.png`,
    alt: "The reviews page on a phone: 4.9 stars from 147 Google reviews, two review cards, and the fixed Call and Text Now bar across the bottom.",
    width: 1179,
    height: 2203,
  },
  quote: "The reviews page, and the phone one tap away.",
};

/**
 * Block 12 — `BlockWysiwyg`: the two ChatGPT answers, written as dated
 * observations (controller ruling: never a standing "ranks first" claim, and
 * no causal claim for the site). The 4.9 / 133 are what the screenshot shows;
 * the second answer's Reddit line is visible in it too. The llms.txt sentence
 * is `app/llms.txt/route.ts:33-39`.
 */
export const PROJECT_AI: BlockWysiwygProps = {
  tagline: "Answer engines",
  title: "What ChatGPT said, twice.",
  body: [
    {
      type: "paragraph",
      text: "On 28 July 2026, asked for the top five mobile mechanics in New York City, ChatGPT listed the business first, with its 4.9 rating and 133 reviews. On 7 August, asked for the best mobile mechanic in Queens, it did the same. Those answers draw on the Google Business Profile and, in the second case, Reddit, so we do not claim the site produced them.",
    },
    {
      type: "paragraph",
      text: "What the site contributes is the part an answer engine can read: JSON-LD on every service, area and topic page, and an llms.txt generated from the same config, listing all thirty topic pages with their price chips so a model asked what an alternator costs in NYC can reach the page that answers it.",
    },
  ],
};

export const PROJECT_MEDIA_AI: BlockMediaDoubleQuoteProps = {
  large: {
    type: "image",
    src: `${IMAGES}/new-york-mobile-mechanic-chatgpt-nyc.jpg`,
    alt: "ChatGPT on 28 July 2026, asked for the top 5 mobile mechanics in New York City: a map card for Adam Mobile Mechanic at 4.9, and the business listed first in the numbered answer with 133 reviews.",
    width: 1600,
    height: 1000,
  },
  small: {
    type: "image",
    src: `${IMAGES}/new-york-mobile-mechanic-chatgpt-queens.jpg`,
    alt: "ChatGPT on 7 August 2026, asked for the best mobile mechanic in Queens: the map card at 4.9 and the business listed first in the answer.",
    width: 1600,
    height: 1000,
  },
  quote: "Asked twice, ten days apart, the business came first both times.",
};

/**
 * Block 14 — `BlockProjectDetails`. `Stack` feeds the intro's second tab and is
 * dropped from this block by `projectDetailsWithoutStack`. Every entry is from
 * `package.json`; `Tests` is the measured run; the live row takes the domain
 * from `seo.siteUrl`.
 */
export const PROJECT_DETAILS: ProjectDetail[] = [
  {
    label: "Stack",
    value: "TypeScript, Next.js 16, React 19, Tailwind CSS 4, GSAP, zod, Vitest, Vercel",
  },
  { label: "Tests", value: "157 Vitest" },
  { label: "Deployment", value: "Vercel · Featurable and the Places API for reviews · Formspree for leads" },
  { label: "Year", value: "2026" },
  { label: "Platform", value: "Web" },
  {
    label: "Live site",
    value: "newyorkmobilemechanic.com",
    href: "https://www.newyorkmobilemechanic.com",
  },
];

/**
 * Block 15 — `GeneralCta`. Points at `/contact/`, never at the live site (the
 * live URL is a details row). The line names this reader's own problem: a
 * site that exists and does not bring the calls.
 */
export const PROJECT_CTA: GeneralCtaProps = {
  text: "Is your site bringing the calls?",
  label: "Ask us to look at your site",
  href: "/contact/",
};
