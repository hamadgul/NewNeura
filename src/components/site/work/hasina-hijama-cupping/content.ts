/**
 * Content for `/work/hasina-hijama-cupping/`.
 *
 * Provenance for every string here is recorded in
 * `docs/research/case-studies/hasina-hijama-cupping.md` (the dossier): every
 * mechanism sentence traces to a file:line in `~/Projects/Hijama Site` at HEAD
 * `bfec627`, every number to the command that measured it, and every dated
 * count to the source comment or plan that records it. Nothing below was
 * taken from memory.
 *
 * Unlike the other nine, this case study has no entry in the NeuraGul source's
 * `CASE_STUDIES` — it is a NeuraGul project, added on 2026-09-07 at the user's
 * request. The user called it "hasinahijama.com"; that host does not resolve.
 * The live one is `www.hasinahijamacupping.com` and the apex 308s to it
 * (curl, 2026-09-11). The real host is what ships.
 *
 * Image sizing note: `width`/`height` are the assets' true decoded pixels
 * (1200x750 for the cover, 1600x1000 for every screen). `next/image` reserves
 * the aspect ratio from them, and every block takes its height from that ratio.
 *
 * VOICE — "we", like every other page here; no headcount, no "I", no
 * exclamation points, no "X, not Y" constructions, no em dashes in copy
 * strings. HEALTH — this is a case study about a health site. Nothing below
 * asserts, in our voice, that cupping treats or relieves anything; the page
 * describes what the client's site says, including the evidence section it
 * refuses to soften, and what we built. The client's rating, review count,
 * years and client count are the client's (dossier, Unverifiable 3-5).
 *
 * ── What the 2026-09-11 expansion changed ───────────────────────────────────
 * The page had four blocks and two claims the source contradicts
 * (task-14-report.md §0): "no website" — the practice's Google listing pointed
 * at a live one-page deployment on a `.vercel.app` subdomain while its own
 * domain served a parking page (`NYC-SEO-PLAN.md:17-32`, `next.config.ts:134-141`);
 * and a list of "six pages" that named five topics and left out the Queens
 * landing page. Both rewritten. The header lead, the outcome block and the
 * stack row were kept in substance and re-measured. The search volumes the
 * source records in six header comments stay off the page (Task 5 ruling);
 * the one dated rank it records is an outcome and stays off too.
 */
import type { BlockHeaderProjectsProps } from "@/components/site/shared/blocks/BlockHeaderProjects";
import type { BlockImageFullProps } from "@/components/site/shared/blocks/BlockImageFull";
import type { BlockIntroDoubleProps } from "@/components/site/shared/blocks/BlockIntroDouble";
import type { BlockMediaDoubleQuoteProps } from "@/components/site/shared/blocks/BlockMediaDoubleQuote";
import type { BlockWysiwygProps } from "@/components/site/shared/blocks/BlockWysiwyg";
import type { GeneralCtaProps } from "@/components/site/shared/blocks/GeneralCta";
import type { ProjectDetail } from "@/components/site/shared/blocks/BlockProjectDetails";

const IMAGES = "/site/images";

/**
 * The `<title>` stem, suffixed by the root layout's `"%s — NeuraGul"` template.
 *
 * This is NOT the project's display name — `PROJECT_HEADER.title` is, and it
 * still reads "Hasina Hijama Cupping" on the page and in the breadcrumb. A
 * `<title>` is read cold in a result list, so it names the category of work as
 * well as the client. Unchanged from the 2026-09-07 page.
 */
export const PROJECT_TITLE = "Hasina Hijama Cupping: a Local SEO Build";
export const PROJECT_CANONICAL = "/work/hasina-hijama-cupping/";
/**
 * The meta description, ~150 characters, stating what was built and the
 * three mechanisms the page argues from. "one host" is the canonical fix
 * (`lib/site.ts:11-23`); "every page" is `businessSchema` on 10 of 10 routes.
 */
export const PROJECT_DESCRIPTION =
  "A ten-page Next.js site for a Queens cupping practice: six pages that each answer one search, business data on every page, one host every canonical agrees on.";
export const PROJECT_OG_IMAGE = `${IMAGES}/hasinahijama.jpg`;

/**
 * `www`, not the apex. `lib/site.ts:11-23` in the source says why: the apex
 * 308-redirects to `www` at the Vercel edge, and a canonical that redirects is
 * a canonical Google discards. Verified live 2026-09-11.
 */
export const PROJECT_LIVE = {
  url: "https://www.hasinahijamacupping.com",
  label: "Live site",
  display: "hasinahijamacupping.com",
} as const;

/**
 * Header. `lead` is the project's shape as the code shows it, in one line: the
 * route count (`app/sitemap.ts:16-28`), the six search pages (decision 1 in
 * the dossier) and the domain's pre-launch state (`README.md:114-121`).
 * LENGTH IS MEASURED: the header's lead slot at 390 px holds five lines
 * (156 px) before the `<h1>` runs into the cover's top edge, and at 320 px
 * this project's three-word title wraps once more, which leaves FOUR lines
 * (125 px). Candidates were swapped into the live slot with `textContent`
 * (`$SCRATCH/hh-lead.mjs`, task-14-report.md §5): every candidate over 90
 * characters was five lines at 320 and overlapped the cover by 25 px there;
 * the shipped 90 characters is four lines at 320, 360 and 390 (h1 bottom
 * 494 / 448 / 448 against the cover's 500). Do not lengthen it without
 * re-measuring at 320. The cover
 * is the site's home page at HEAD: the single photograph on the ink field
 * with the $10-a-cup offer strip (the 2026-08-29 hero).
 */
export const PROJECT_HEADER: BlockHeaderProjectsProps = {
  title: "Hasina Hijama Cupping",
  lead: "A parked domain, now ten pages for a Queens cupping practice, six of them one search each.",
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
 * Block 2 — `BlockIntroDouble`, the two-label variant.
 *
 * `statement` is the brief. The old one said "no website"; the source records
 * a live one-page deployment on a `.vercel.app` host that the Google listing
 * linked to (`NYC-SEO-PLAN.md:17-27`) and a registrar's parking lander on the
 * domain itself (`README.md:114-121`). The 5.0 is the client's rating as the
 * site records it (`lib/site.ts:36`), stated as theirs. `body` is the stack
 * from `package.json` (Next 16.3.2, React 19.2.8, TypeScript, nothing else
 * at runtime), the fonts from `app/layout.tsx:15-41`, the stylesheet from
 * `README.md:55-64`, the crawl files from `app/robots.ts`, `app/sitemap.ts`,
 * `public/llms.txt`, `public/ai.txt`, and the headers from
 * `next.config.ts:159-181`. `projectIntroTabs` overwrites both labels to
 * "The brief" / "The tech stack".
 */
export const PROJECT_INTRO: BlockIntroDoubleProps = {
  labels: ["The brief", "What we built"],
  activeLabel: 0,
  statement:
    "A two-practitioner hijama practice in Flushing with a 5.0 Google rating and no site of its own. Its listing linked to a one-page deployment on a vercel.app subdomain, and the practice's domain served a registrar's parking page.",
  body: "Next.js 16 and React 19 in TypeScript, with one hand-written stylesheet on a ten-step type scale. Newsreader through next/font, and a Noto Naskh Arabic face subset to the eighteen codepoints of the one verse the site sets. Ten static routes with a sitemap, robots, llms.txt and ai.txt, deployed on Vercel with a content security policy and a permissions policy on every route. No form backend, no analytics dependency, no test suite.",
};

/**
 * Block 3 — `BlockWysiwyg`: six pages, one question each.
 *
 * The ten routes: `app/sitemap.ts:16-28`. Each search page's reason, in its
 * own header comment: `app/cupping-therapy-cost/page.tsx:10-16` (and the H1
 * at 76-80), `cupping-marks-and-bruising/page.tsx:11-16`,
 * `hijama-for-women/page.tsx:11-17`, `massage-cupping-and-red-light/page.tsx:10-15`,
 * `cupping-therapy-queens/page.tsx:11-17`. Out of the header, reached from the
 * footer and breadcrumbs: `lib/site.ts:173-183`. The city page and the 4-vs-92
 * count: `app/hijama-nyc/page.tsx:11-29` and `NYC-SEO-PLAN.md:125-147`
 * (2026-08-27, `6b970ad`); its sections: `TRAVEL` 56-83, `CHOOSING` 85-116,
 * `QUESTIONS` 118-139. Queens in headlines, Flushing in copy: `README.md:102-107`,
 * `app/page.tsx:789-792`. The volumes behind "measured nothing" are in the
 * source and deliberately not here (dossier, Numbers deliberately NOT used).
 */
export const PROJECT_SEARCH: BlockWysiwygProps = {
  tagline: "Search",
  title: "Six pages, one question each.",
  body: [
    {
      type: "paragraph",
      text: "Four pages are the brochure: the home page, services and prices, a guide to what hijama is, and the practitioners. The other six each answer one search the practice's customers type, and each file opens with a comment naming that search and why it earned a route. What cupping therapy costs, where the H1 is the question itself. Cupping marks, the single biggest worry people arrive with. Hijama for women, because a female practitioner in a partitioned room is the strongest reason someone picks this practice over another. Massage cupping and red light, for anyone who cannot or will not have wet cupping. Cupping therapy in Queens, a plain service-in-location page, the shape of the pages that already rank organically under the map pack. And hijama in New York City. The six stay out of the header, which already holds five items, and are reached from the footer, the breadcrumbs and links inside the pages.",
    },
    {
      type: "paragraph",
      text: "We added the city page three days after the rest. Until it existed the site answered the city query with nothing: by the plan's own count on 27 August 2026, the built home page said New York four times against ninety-two for Queens. The page it has to beat holds first place with a single homepage on an exact-match domain, so this one carries what that page lacks: door-to-door travel times from each borough with the subway lines, a five-point guide to choosing any practitioner, written to be useful to someone who books elsewhere, and the five questions that repeat across the results. There are no borough pages, because the borough variants measured nothing. Headlines say Queens throughout; Flushing stays in every description, every body paragraph, the alt text and the address, so the local term still works.",
    },
  ],
};

/**
 * Block 4 — `BlockMediaDoubleQuote`: the city page beside the cost page.
 *
 * At `xl` the blockquote sits directly under the SMALL media, so the quote is
 * that image's own caption: the cost page goes with the cost frame. The large
 * slot carries the city page (paragraph 2 above). Both captured 2026-09-11
 * from the booted copy at HEAD.
 */
export const PROJECT_MEDIA_SEARCH: BlockMediaDoubleQuoteProps = {
  large: {
    type: "image",
    src: `${IMAGES}/hasina-hijama-cupping-nyc.jpg`,
    alt: "The city page: the breadcrumb Home / Hijama in NYC, the headline Hijama in New York City, and a four-cell strip reading $10 per cup, $60 to $150 a session for the rest of the city, 5.0 from 175+ reviews, and women and men seen separately, above a contents list that opens with Getting here from across the city.",
    width: 1600,
    height: 1000,
  },
  small: {
    type: "image",
    src: `${IMAGES}/hasina-hijama-cupping-cost.jpg`,
    alt: "The cost page: the breadcrumb What cupping therapy costs, the headline How much does cupping therapy cost?, a lead setting $60 and $150 against $10 per cup, and a price grid with one dark cell, The only charge, $10, beside three cells marked Included free.",
    width: 1600,
    height: 1000,
  },
  quote: "The cost page. The question every People-Also-Ask block on the local results led with, answered in the headline.",
};

/**
 * Block 5 — `BlockWysiwyg`: one file for the facts.
 *
 * The single source: `lib/site.ts:3-6` (and the whole `site` object, 8-72).
 * `hoursSummary`: `lib/site.ts:84-117`; the hours table: 74-82. The canonical
 * host: `lib/site.ts:11-23` (2026-08-27, `6b970ad`; `NYC-SEO-PLAN.md:111-123`).
 * The Open Graph helper: `lib/site.ts:132-158`, 11 call sites (ten pages +
 * layout); `README.md:76-83`. The business node and `@id`: `lib/schema.ts:16-25,
 * 49-151`; `geo`: 66-71; `knowsLanguage`: 79-84; no `aggregateRating`: 85-93
 * and `README.md:88-91`. The date constants: `lib/schema.ts:255-270, 306-307`;
 * the byline: `app/what-is-hijama/page.tsx:186-195`; the sitemap:
 * `app/sitemap.ts:5-28`. Every count confirmed on the booted copy
 * (`og:image` and `og:type` 10/10; `LocalBusiness` 10/10; `aggregateRating` 0/10).
 */
export const PROJECT_ONE_FILE: BlockWysiwygProps = {
  tagline: "One file",
  title: "The facts live in one place.",
  body: [
    {
      type: "paragraph",
      text: "A phone number, an opening hour or the postal address changes in one file, and every page reads it from there: the masthead, the hero, the Visit table, both footers, the share card and the structured data. The hero's one-line hours, Sun to Tue and Thu, 9 AM to 7 PM, are derived from the same table the Visit section renders. Consecutive open days collapse into a run, and a time is printed only when every open day shares one, so the summary cannot become true-looking and wrong.",
    },
    {
      type: "paragraph",
      text: "On 27 August 2026 we changed one line in that file: the canonical host, from the apex to www. The apex redirects to www at the edge, so every canonical, all ten sitemap entries and every share image had been pointing at a URL that redirected back to the page announcing it, and a canonical that cannot resolve to a 200 is one Google discards. Open Graph goes through one helper for a related reason: Next merges page metadata shallowly, so a page that declared its own block replaced the layout's and silently dropped the image, and WhatsApp, which is how these links get shared, showed a grey blob. All ten pages call the helper, and it supplies the image and the type by default.",
    },
    {
      type: "paragraph",
      text: "The business node ships on every page, because the services, the articles and the practitioners point at it by id, and an id only resolves within the page it is on. It carries coordinates as well as the address, the three languages on the business itself, since the site does not say which practitioner speaks which, and no aggregate rating: the 5.0 lives on the Google profile, and republishing it as the site's own markup about itself is a self-serving review under Google's policy. The guides' visible Last updated line, their Article dateModified and the sitemap's lastmod are one constant each, and the sitemap sets nothing else, since Google ignores priority and change frequency.",
    },
  ],
};

export const PROJECT_IMAGE_GUIDE: BlockImageFullProps = {
  image: {
    src: `${IMAGES}/hasina-hijama-cupping-guide.jpg`,
    alt: "The guide: the headline What is hijama, or wet cupping therapy?, a lead paragraph, the byline Written by Hasina, certified hijama practitioner, Last updated August 23, 2026, and an At a glance panel listing the price, what is free with every session, the practitioners and the address.",
    width: 1600,
    height: 1000,
  },
};

/**
 * Block 7 — `BlockWysiwyg`: what the site refuses to say.
 *
 * The evidence section: `app/what-is-hijama/page.tsx:322-345`; the audit's
 * refusal to soften it: `ACTION-PLAN.md:81`; the same facts in
 * `public/llms.txt:30-41`. The footer disclaimer: `components/SiteFooter.tsx:4`.
 * The certification line: `README.md:108-111`, `app/about/page.tsx:69-74`.
 * The hero claim's dated check and expiry: `app/page.tsx:385-404`,
 * `NYC-SEO-PLAN.md:209-223`. Nothing in this block asserts efficacy in our
 * voice; every clause is what the client's site says or declines to say.
 */
export const PROJECT_HEALTH: BlockWysiwygProps = {
  tagline: "Health copy",
  title: "What the site refuses to say.",
  body: [
    {
      type: "paragraph",
      text: "This is a health site, so its guide carries an evidence section that says the research on cupping is mixed and mostly small, that trials are short and near impossible to blind, and that claims of detoxifying the blood, curing chronic disease or replacing medication run ahead of anything demonstrated. The audit notes list that section as the one thing not to be turned into marketing copy. Every footer says hijama does not replace medical advice. The certification line names no certifying body, because the practice has not named one. The hero's claim to be the city's most-reviewed five-star hijama practice is backed in the source by a dated comparison, with the note that it fails the day another practice passes it. The same facts, evidence summary included, are in llms.txt for any model that reads the site first.",
    },
  ],
};

/**
 * Block 8 — `BlockWysiwyg`: the front door. No body image: the frozen cover at
 * the top of the page IS the hero at HEAD, and repeating it here was Task 8's
 * duplicate-cover trap. The copy points the reader back up.
 *
 * The hero rebuild: `app/page.tsx:250-297, 443-455` (2026-08-29); the gallery's
 * removal: `lib/site.ts:216-224`; no `'use client'` in `app/page.tsx`. Quality
 * 82: `next.config.ts:88-129` (the 63,915-byte render confirmed on the booted
 * copy). The Arabic subset: `app/layout.tsx:23-41` (10,136 bytes on disk).
 * No radius, no shadow: `globals.css:1826-1827`, `components/CuppingCup.tsx:1-18`.
 * The form: `components/EnquiryForm.tsx:33-52, 92-104` (2026-08-27). The
 * bar: `components/MobileCta.tsx:6-40, 53-63`. Headers: `next.config.ts:3-81,
 * 159-181`. Crawlers: `app/robots.ts:4-46`, `public/ai.txt`. The host
 * redirect and the deployment it cannot reach: `next.config.ts:132-157`,
 * `NYC-SEO-PLAN.md:179-184`; still answering 200 on 2026-09-11.
 */
export const PROJECT_FRONT_DOOR: BlockWysiwygProps = {
  tagline: "Front door",
  title: "One photograph, no script.",
  body: [
    {
      type: "paragraph",
      text: "The frame at the top of this page is the hero: one photograph on a full-bleed ink field, which we rebuilt on 29 August 2026 from a three-frame crossfading gallery that had put a client component in front of the largest element on the page. The home page now ships no client-side JavaScript of its own. The photograph is 1,019 pixels wide against a field that stretches it on any desktop, so it is served at quality 82 instead of the default 75. That costs a measured 19 KB on the one image that opts in; 90 would have cost 56, on a site whose visitors are mostly on phones. The one line of Arabic on the site loads from a font subset to its eighteen codepoints, 10 KB in place of 92 on every route. There is no border radius and no box shadow anywhere in the stylesheet, and the cup beside two headings is a stroked SVG at the same weight as the site's other line drawings.",
    },
    {
      type: "paragraph",
      text: "The enquiry form has no backend and needs none. Submitting composes the fields into a text draft addressed to the practice and opens the visitor's own messaging app: WhatsApp above 780 pixels, where an SMS link has no handler, and SMS below it. Nothing claims to have been sent. The mobile booking bar appears on any scroll and leaves 1.5 seconds after scrolling stops, never while a keyboard user is standing on it. Every route carries a content security policy, a permissions policy that denies eighteen features, and a frame denial in both the old header and the new directive. Robots names nineteen AI crawlers and allows every one on purpose, with ai.txt saying the same in prose. Any vercel.app host now redirects to the real domain. The practice's older subdomain deployment predates that rule and still answers; retiring it is a dashboard action.",
    },
  ],
};

/**
 * Block 9 — `BlockProjectDetails`. `Stack` feeds the intro's second tab and
 * is dropped from this block by `projectDetailsWithoutStack`. Every entry is
 * from `package.json`; `Pages` is the route-file count and the booted copy's
 * `/sitemap.xml`; the live row takes the host from `lib/site.ts:23`. No Tests
 * row: the manifest has no test runner. `BlockProjectDetails` auto-places
 * pairs, so the five rendered rows read (Pages | Deployment), (Year | Platform),
 * (Live site | empty).
 */
export const PROJECT_DETAILS: ProjectDetail[] = [
  { label: "Stack", value: "TypeScript, Next.js 16, React 19, one stylesheet, Vercel" },
  { label: "Pages", value: "10 routes · 10 URLs in the sitemap" },
  { label: "Deployment", value: "Vercel · CSP and Permissions-Policy on every route" },
  { label: "Year", value: "2026" },
  { label: "Platform", value: "Web" },
  { label: PROJECT_LIVE.label, value: PROJECT_LIVE.display, href: PROJECT_LIVE.url },
];

/**
 * Block 10 — `GeneralCta`. Points at `/contact/`, never at the live site (the
 * live URL is a details row). The line names this reader's own situation: a
 * Google listing that sends people somewhere it should not.
 */
export const PROJECT_CTA: GeneralCtaProps = {
  text: "Does your Google listing point somewhere it should not?",
  label: "Contact",
  href: "/contact/",
};
