/**
 * Content for `/work/landscape-drainage-proz/`.
 *
 * Provenance for every string here is recorded in
 * `docs/research/case-studies/landscape-drainage-proz.md`. One exception: the
 * source's outcome claim, "tripled the client's online sales," had no
 * supporting evidence anywhere on this machine (there is no local source for
 * this project at all), so it was cut from every slot that visitors read,
 * including the `PROJECT_OUTCOME` block that used to carry it — that block is
 * now deleted, not just rewritten, since it was also a character-identical
 * repeat of `PROJECT_HEADER.lead`. `PROJECT_HEADER.lead` and
 * `PROJECT_DESCRIPTION` never carried the unverified figure; see the notes on
 * each.
 *
 * Image sizing note: `width`/`height` are the file's true decoded pixels
 * (1200x750), because `next/image` reserves the aspect ratio from them and the
 * header sizes its crop from that ratio rather than from a fixed height.
 *
 * Block-count note: this is the shortest of the nine case studies — one image,
 * a one-sentence brief, and a one-sentence build — so the page runs four blocks
 * rather than the eleven the inherited template was built for; that sequence
 * existed to carry eighteen architecture photographs. There is deliberately no
 * media block: every one of them needs either a second asset
 * (`BlockMediaDouble`, `BlockMediaDoubleQuote`) or a picture the header has not
 * already shown (`BlockImageFull`), and re-rendering `landscapedrainage.jpg`
 * through one would be padding rather than evidence. No constant needs
 * numbering, because no block appears twice.
 *
 * VOICE — the source site is written in the first person singular, because it
 * was one person. It is a team, so this site says "we". "What we built" was
 * the label on the second intro section before `projectIntroTabs` shipped;
 * that helper now overwrites both tab labels to "The brief" / "The tech
 * stack", so "What we built" no longer renders anywhere on this page. Every
 * stack entry and live URL below is exactly as the source records it.
 *
 * ── What the SEO pass changed ───────────────────────────────────────────────
 * `PROJECT_TITLE` and `PROJECT_DESCRIPTION` are no longer the source's
 * strings. Both are metadata only — the `<title>` stem and the meta
 * description — and both were rewritten to compete in a result list rather
 * than to open a page; see the notes on each. Some `alt` strings were also
 * lengthened from a bare project name to a description of the screenshot.
 *
 * ── What the unverifiable-claims pass changed ───────────────────────────────
 * `PROJECT_HEADER.lead` and `PROJECT_DESCRIPTION` no longer say the project
 * "tripled the client's online sales" — that figure has no source on this
 * machine and was replaced with a factual description of what was built
 * (Shopify, custom Liquid, plus the CTA design, Google Ads and SEO work
 * around it). `PROJECT_OUTCOME`, which still carried the source's original
 * claim, is now deleted outright rather than rewritten — see the note at the
 * top of this file.
 */
import type { BlockHeaderProjectsProps } from "@/components/site/shared/blocks/BlockHeaderProjects";
import type { BlockIntroDoubleProps } from "@/components/site/shared/blocks/BlockIntroDouble";
import type { ProjectDetail } from "@/components/site/shared/blocks/BlockProjectDetails";

const IMAGES = "/site/images";

/**
 * The `<title>` stem, suffixed by the root layout's `"%s — NeuraGul"` template.
 *
 * This is NOT the project's display name — `PROJECT_HEADER.title` is, and it
 * still reads "Landscape Drainage Proz" on the page and in the breadcrumb. The two diverge on
 * purpose: an `<h1>` sits under a header that has already established what the
 * page is, while a `<title>` is read cold in a result list, so it has to name
 * the category of work as well as the client. `PROJECT_TITLE` is referenced
 * only by `metadata` in the route file, so nothing visible moves with it.
 */
export const PROJECT_TITLE = "Landscape Drainage Proz: a Shopify Build";
export const PROJECT_CANONICAL = "/work/landscape-drainage-proz/";
/**
 * The meta description. It was the project's `brief` verbatim, which reads as
 * the opening of a story rather than as a search result: the brief sets a scene
 * and names no technology, so the snippet said nothing a searcher could match.
 * This states what was built and what it was built with, in ~150 characters.
 * The brief itself is untouched and still opens the page. It no longer claims
 * the storefront "tripled" the client's sales — that figure has no source on
 * this machine (there is no local source for this project at all) and was
 * replaced with a description of what was actually built.
 */
export const PROJECT_DESCRIPTION =
  "A Shopify storefront for a drainage-products retailer, built with custom Liquid, CTA design, Google Ads, and SEO. A NeuraGul e-commerce case study.";
export const PROJECT_OG_IMAGE = `${IMAGES}/landscapedrainage.jpg`;

/**
 * `live_url` / `live_label` from the source entry, kept exact.
 *
 * `BlockProjectDetails` renders its values as plain `<span>`s with no anchor,
 * so the details row prints the readable host and this constant is where the
 * addressable URL survives.
 */
export const PROJECT_LIVE = {
  url: "https://landscapedrainageproz.com",
  label: "Live site",
  display: "landscapedrainageproz.com",
} as const;

/**
 * Header. On every other case study `lead` is the project's OUTCOME, not its
 * brief — the brief is the `BlockIntroDouble` statement two blocks down, and
 * printing it in both slots repeated the same sentence inside two screens.
 * This page is the exception: its only outcome claim, "tripled the client's
 * online sales," has no source on this machine, so `lead` instead states what
 * was built — a summary, not a duplicate of the brief. There is no
 * `PROJECT_OUTCOME` block on this page at all: it used to carry that
 * unverifiable line, and it is deleted rather than rewritten.
 */
export const PROJECT_HEADER: BlockHeaderProjectsProps = {
  title: "Landscape Drainage Proz",
  lead: "A production Shopify storefront for a drainage-products retailer, backed by CTA design, Google Ads, and SEO.",
  location: "2026 · Shopify",
  service: "Web Development · Data Intelligence",
  breadcrumbLabel: "Work",
  breadcrumbHref: "/work/",
  backLabel: "All work",
  image: {
    src: `${IMAGES}/landscapedrainage.jpg`,
    alt: "",
    width: 1200,
    height: 750,
  },
};

/**
 * Block 2 — `BlockIntroDouble`, the two-label variant.
 *
 * The source page runs three headed sections: "The brief", "What I built" and
 * "Outcome". The middle one is rewritten to "What we built" for this site's
 * voice. The first two map onto this block exactly — the active label sits over
 * the `font-L` statement (the brief) and the muted one over the body copy (what
 * was built). The third, "Outcome", is not a separate block on this page: it
 * duplicated the unverifiable claim already cut from `lead`, so it was deleted
 * rather than rendered.
 */
export const PROJECT_INTRO: BlockIntroDoubleProps = {
  labels: ["The brief", "What we built"],
  activeLabel: 0,
  statement: "A drainage-products retailer wanted a storefront that sold things.",
  body: "A Shopify buildout paired with the marketing work around it: CTA design and implementation, Google Ads, and an SEO strategy set up to compound.",
};

/**
 * Block 3 — `BlockProjectDetails`. The real facts only: the `stack` list as the
 * source records it, the year and platform split out of the `meta` string, and
 * the live link. "Shopify" appearing in both the platform and the stack is the
 * source's own duplication and is left alone. The block auto-places pairs, so
 * the four rows read (Stack | Year) then (Platform | live link).
 */
export const PROJECT_DETAILS: ProjectDetail[] = [
  { label: "Stack", value: "Shopify, Custom Liquid, SEO, Google Ads" },
  { label: "Year", value: "2026" },
  { label: "Platform", value: "Shopify" },
  { label: PROJECT_LIVE.label, value: PROJECT_LIVE.display, href: PROJECT_LIVE.url },
];
