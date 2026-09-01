/**
 * Content for `/portfolio/las-positas-college-academic-support-building/`
 * (page-key `portfolio-las-positas-college-academic-support-building-e0ff48e8`).
 *
 * Every string and every image path below is lifted verbatim from
 * `docs/research/lpas-com-76f4f1fd/portfolio-las-positas-college-academic-support-building-e0ff48e8/CONTENT.json`,
 * block by block, in document order. Nothing is paraphrased or re-wrapped.
 *
 * Image sizing note: take `local` paths and all text from CONTENT.json, but
 * NEVER its `w`/`h`. Those record whichever srcset variant lazysizes happened
 * to have loaded at capture time (e.g. 985x656 for the first wide figure), not
 * the file's intrinsic size — and `next/image` needs the intrinsic size to
 * reserve the right aspect ratio, which matters most on the full-bleed images
 * here. Every `width`/`height` below therefore comes from
 * `docs/research/lpas-com-76f4f1fd/IMAGE_DIMENSIONS.json`, the decoded-file
 * measurements; each one also matches the size encoded in its filename
 * (`…-1600x1067-c-default.webp`).
 *
 * Ordering note: `BlockImageFull` appears three times and `BlockMediaDouble` /
 * `BlockMediaDoubleQuote` twice each, so the exported constants are numbered by
 * their position on the page. The numbering matches both CONTENT.json's block
 * array (indices 5 / 7 / 11 and 4 / 9 and 6 / 10) and
 * `docs/design-references/…/desktop-full.png`.
 */
import type { BlockHeaderProjectsProps } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockHeaderProjects";
import type { BlockImageFullProps } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockImageFull";
import type { BlockIntroDoubleProps } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockIntroDouble";
import type { BlockMediaDoubleProps } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockMediaDouble";
import type { BlockMediaDoubleQuoteProps } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockMediaDoubleQuote";
import type { ProjectDetail } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockProjectDetails";

const IMAGES =
  "/sites/lpas-com-76f4f1fd/portfolio-las-positas-college-academic-support-building-e0ff48e8/images";

/**
 * Head strings from CONTENT.json. The live `<title>` is
 * "Las Positas College Academic Support Building - LPAS Architecture", which is
 * exactly the root layout's `"%s - LPAS Architecture"` template applied to the
 * project name — so the route sets the bare name and lets the template suffix
 * it. The source ships no meta description (`metaDescription: null`).
 */
export const PROJECT_TITLE = "Las Positas College Academic Support Building";
export const PROJECT_CANONICAL =
  "https://lpas.com/portfolio/las-positas-college-academic-support-building/";
/** The source's og:image is the un-resized original of the hero. */
export const PROJECT_OG_IMAGE = `${IMAGES}/05_LAS-POSITAS-COLLEGE-ACADEMIC-SUPPORT-1440x960-c-default.webp`;

/** Block 1 — `BlockHeaderProjects`. */
export const PROJECT_HEADER: BlockHeaderProjectsProps = {
  title: "Las Positas College Academic Support Building",
  lead: "A light-filled academic support hub for learning, collaboration, and campus life.",
  location: "Livermore, CA",
  market: "Higher Education",
  // The breadcrumb ("Portfolio") and the back link ("View all projects") both
  // point at /portfolio/ on the source; those are the block's own defaults, so
  // they are stated here only because this page is where they were measured.
  breadcrumbLabel: "Portfolio",
  breadcrumbHref: "/portfolio/",
  backLabel: "View all projects",
  image: {
    src: `${IMAGES}/05_LAS-POSITAS-COLLEGE-ACADEMIC-SUPPORT-1440x960-c-default.webp`,
    alt: "",
    width: 1440,
    height: 960,
  },
};

/**
 * Block 2 — `BlockIntroDouble`, the tabbed variant. "Introduction" is active
 * and carries the rule; "Details" is the second, muted tab.
 */
export const PROJECT_INTRO: BlockIntroDoubleProps = {
  labels: ["Introduction", "Details"],
  activeLabel: 0,
  statement:
    "This new Academic Support, Faculty Office and Learning Resource Center serves as a resource for the entire campus as it consolidates tutoring, math, computer, proctoring and English services to all students.",
  body: "Faculty offices for over 80 staff are seamlessly integrated into the space, and the adjacent library was renovated, expanded, and connected to the new building as a part of the project. In order to create synergy amongst the disparate program elements and to make this a destination throughout the day and evenings, a two-story atrium was designed at the heart of the project which connects all sections of the building. This collaborative, interactive space will serve as the social and cultural center of the campus, and a hub for activities. The open floor area allows abundant natural light to filter through with views out to the campus, as well as into the activities within. Fixed and lounge seating provide flexibility for a variety of interactions. A continuous work surface equipped with power and data overlooks the space from the second floor and provides a dynamic study and collaboration opportunity.",
};

/** Block 3 — `BlockMediaDouble` (first instance). */
export const PROJECT_MEDIA_DOUBLE_ONE: BlockMediaDoubleProps = {
  large: {
    src: `${IMAGES}/06_LAS-POSITAS-COLLEGE-ACADEMIC-SUPPORT-1600x1067-c-default.webp`,
    alt: "",
    width: 1600,
    height: 1067,
  },
  small: {
    src: `${IMAGES}/07_LAS-POSITAS-COLLEGE-ACADEMIC-SUPPORT-1600x1945-c-default.webp`,
    alt: "",
    width: 1600,
    height: 1945,
  },
};

/** Block 4 — `BlockImageFull` (first instance): the aerial of the campus. */
export const PROJECT_IMAGE_FULL_ONE: BlockImageFullProps = {
  image: {
    src: `${IMAGES}/01_LAS-POSITAS-COLLEGE-ACADEMIC-SUPPORT-1600x899-c-default.webp`,
    alt: "",
    width: 1600,
    height: 899,
  },
};

/** Block 5 — `BlockMediaDoubleQuote` (first instance). No quote on this one. */
export const PROJECT_MEDIA_QUOTE_ONE: BlockMediaDoubleQuoteProps = {
  large: {
    type: "image",
    src: `${IMAGES}/11_LAS-POSITAS-COLLEGE-ACADEMIC-SUPPORT-1600x2400-c-default.webp`,
    alt: "",
    width: 1600,
    height: 2400,
  },
  small: {
    type: "image",
    src: `${IMAGES}/18_LAS-POSITAS-COLLEGE-ACADEMIC-SUPPORT-1600x1270-c-default.webp`,
    alt: "",
    width: 1600,
    height: 1270,
  },
};

/** Block 6 — `BlockImageFull` (second instance): the atrium ceiling. */
export const PROJECT_IMAGE_FULL_TWO: BlockImageFullProps = {
  image: {
    src: `${IMAGES}/10_LAS-POSITAS-COLLEGE-ACADEMIC-SUPPORT-1600x1114-c-default.webp`,
    alt: "",
    width: 1600,
    height: 1114,
  },
};

/*
 * Block 7 — `BlockWysiwyg`. Nothing to declare here: the verbatim copy lives in
 * `shared/blocks/content-presets.ts` as `LAS_POSITAS_WYSIWYG`, and the page
 * imports it straight from there.
 *
 * It has to come from that plain module rather than from `BlockWysiwyg.tsx`:
 * the block carries `"use client"`, so every one of its exports reaches a
 * server component as a client-reference proxy instead of as data — spreading
 * one yields `body === undefined` and kills the prerender.
 */

/** Block 8 — `BlockMediaDouble` (second instance). */
export const PROJECT_MEDIA_DOUBLE_TWO: BlockMediaDoubleProps = {
  large: {
    src: `${IMAGES}/13_LAS-POSITAS-COLLEGE-ACADEMIC-SUPPORT-1600x1067-c-default.webp`,
    alt: "",
    width: 1600,
    height: 1067,
  },
  small: {
    src: `${IMAGES}/17_LAS-POSITAS-COLLEGE-ACADEMIC-SUPPORT-1600x1423-c-default.webp`,
    alt: "",
    width: 1600,
    height: 1423,
  },
};

/**
 * Block 9 — `BlockMediaDoubleQuote` (second instance): the one that carries the
 * pull-quote. The string is verbatim from the block's `innerText`, straight
 * double quotes included — they are the source's own glyphs, not markup.
 */
export const PROJECT_MEDIA_QUOTE_TWO: BlockMediaDoubleQuoteProps = {
  large: {
    type: "image",
    src: `${IMAGES}/08_LAS-POSITAS-COLLEGE-ACADEMIC-SUPPORT-1600x1371-c-default.webp`,
    alt: "",
    width: 1600,
    height: 1371,
  },
  small: {
    type: "image",
    src: `${IMAGES}/09_LAS-POSITAS-COLLEGE-ACADEMIC-SUPPORT-1600x1067-c-default.webp`,
    alt: "",
    width: 1600,
    height: 1067,
  },
  quote:
    '"The open floor area allows abundant natural light to filter through with views out to the campus, as well as into the activities within"',
};

/** Block 10 — `BlockImageFull` (third instance): the entrance at dusk. */
export const PROJECT_IMAGE_FULL_THREE: BlockImageFullProps = {
  image: {
    src: `${IMAGES}/04_LAS-POSITAS-COLLEGE-ACADEMIC-SUPPORT-1600x1067-c-default.webp`,
    alt: "",
    width: 1600,
    height: 1067,
  },
};

/**
 * Block 11 — `BlockProjectDetails`. Five pairs, in source order; the block
 * auto-places them Client|Bldg Area / Value|LEED Level / Completed, which is
 * the measured desktop arrangement.
 */
export const PROJECT_DETAILS: ProjectDetail[] = [
  { label: "Client", value: "Chabot-Las Positas Community College District" },
  { label: "Bldg Area", value: "90,000 sq ft" },
  { label: "Value", value: "$60 million" },
  { label: "LEED Level", value: "LEED Gold" },
  { label: "Completed", value: "2023" },
];
