import { MainNavigation } from "@/components/site/home/MainNavigation";
import { NavigationFooter } from "@/components/site/home/NavigationFooter";
import { JsonLd } from "@/components/site/shared/JsonLd";
import { BlockHeaderProjects } from "@/components/site/shared/blocks/BlockHeaderProjects";
import { BlockImageFull } from "@/components/site/shared/blocks/BlockImageFull";
import { BlockIntroDouble } from "@/components/site/shared/blocks/BlockIntroDouble";
import {
  projectDetailsWithoutStack,
  projectIntroTabs,
} from "@/components/site/shared/blocks/projectIntroTabs";
import { BlockMediaDoubleQuote } from "@/components/site/shared/blocks/BlockMediaDoubleQuote";
import { BlockProjectDetails } from "@/components/site/shared/blocks/BlockProjectDetails";
import { BlockWysiwyg } from "@/components/site/shared/blocks/BlockWysiwyg";
import { GeneralCta } from "@/components/site/shared/blocks/GeneralCta";
import {
  PROJECT_CANONICAL,
  PROJECT_CTA,
  PROJECT_DESCRIPTION,
  PROJECT_DETAILS,
  PROJECT_FRONT_DOOR,
  PROJECT_HEADER,
  PROJECT_HEALTH,
  PROJECT_IMAGE_GUIDE,
  PROJECT_INTRO,
  PROJECT_MEDIA_SEARCH,
  PROJECT_OG_IMAGE,
  PROJECT_ONE_FILE,
  PROJECT_SEARCH,
  PROJECT_TITLE,
} from "@/components/site/work/hasina-hijama-cupping/content";

import { breadcrumbSchema, caseStudySchema } from "@/lib/seo";

import type { Metadata } from "next";

/**
 * `title` is the plain stem, so the root layout's "%s — NeuraGul" template
 * supplies the suffix. Both `PROJECT_TITLE` and `PROJECT_DESCRIPTION` are
 * search-facing strings that appear nowhere on the page — the `<h1>` and the
 * brief are separate constants. See their notes in `content.ts`.
 */
export const metadata: Metadata = {
  title: PROJECT_TITLE,
  description: PROJECT_DESCRIPTION,
  alternates: { canonical: PROJECT_CANONICAL },
  openGraph: {
    title: `${PROJECT_TITLE} — NeuraGul`,
    description: PROJECT_DESCRIPTION,
    url: `https://neuragul.com${PROJECT_CANONICAL}`,
    images: [PROJECT_OG_IMAGE],
  },
};

/**
 * `CreativeWork` + `BreadcrumbList`.
 *
 * `about` is split off `PROJECT_HEADER.service` — the same dot-separated
 * service line printed in the page header — so the topics in the data are
 * literally the topics on the page, and adding a service to one adds it to the
 * other.
 *
 * The breadcrumb is what earns this page a `neuragul.com › Work › <project>`
 * trail in place of a raw URL in the result.
 */
const SCHEMA = [
  caseStudySchema({
    name: PROJECT_HEADER.title,
    description: PROJECT_DESCRIPTION,
    href: PROJECT_CANONICAL,
    image: PROJECT_OG_IMAGE,
    about: PROJECT_HEADER.service.split(" · "),
  }),
  breadcrumbSchema([
    { name: "Work", href: "/work/" },
    { name: PROJECT_HEADER.title, href: PROJECT_CANONICAL },
  ]),
];

/**
 * `/work/hasina-hijama-cupping/`.
 *
 * Ten blocks:
 *
 *   BlockHeaderProjects (cover: the single-photograph hero on the ink field)
 *   → BlockIntroDouble (the brief / the tech stack)
 *   → BlockWysiwyg (Six pages, one question each) → BlockMediaDoubleQuote (city L, cost S)
 *   → BlockWysiwyg (The facts live in one place)   → BlockImageFull (the guide's byline)
 *   → BlockWysiwyg (What the site refuses to say)  (no image: it is about what is NOT said)
 *   → BlockWysiwyg (One photograph, no script)     (no image: the cover is the hero)
 *   → BlockProjectDetails → GeneralCta
 *
 * The composition is argued from the evidence outward: each prose block is
 * followed by the one frame that shows its claim. The search section is
 * answered by the city page (the route it describes coming three days late)
 * beside the cost page (whose H1 is the question itself), with the quote as
 * the small frame's caption. The one-file section is answered by the guide,
 * whose byline is the constant the paragraph is about. The health section has
 * no frame: its subject is the evidence section the site refuses to soften,
 * which sits ~5,000 px down a route the runner captures from the top, and a
 * capture of the guide's top is already on the page. The front-door section
 * has no body image on purpose: the frozen cover IS the hero at HEAD
 * (`app/page.tsx:250-297`, 2026-08-29), so repeating it would be Task 8's
 * duplicate-cover trap. The copy says "the frame at the top of this page".
 *
 * `BlockMediaDoubleQuote` appears once and `BlockImageFull` once.
 * `BlockImageSlider` is not used (its geometry is solved for 3:4 portraits and
 * a 1600-wide screenshot lands in it as a thumbnail); `BlockMediaDouble` is
 * not used because the quote variant carries the caption the small frame needs.
 *
 * The 2026-09-07 page had four blocks (header, intro, a one-sentence outcome,
 * details) and one asset; the outcome sentence's information is now the
 * header lead and the brief, and the page carries three captures beside the
 * sentences they prove. `GeneralCta` closes the page and points at `/contact/`.
 *
 * Client-boundary note: every constant above comes from this project's plain
 * `content.ts`. `BlockWysiwyg`, `BlockIntroDouble`, `BlockMediaDoubleQuote` and
 * `GeneralCta` all carry `"use client"`, so a VALUE imported from one of them
 * would reach this server component as a client-reference proxy and spread to
 * undefined props with no type or build error. Only their TYPES cross that
 * boundary, and they do it in `content.ts`.
 */
export default function HasinaHijamaCuppingPage() {
  return (
    <>
      <MainNavigation />

      {/* `overflow-x: clip` (not hidden) — matches the homepage shell. */}
      <main className="mainContent relative w-full overflow-x-clip bg-white">
        <BlockHeaderProjects {...PROJECT_HEADER} />
        <BlockIntroDouble {...projectIntroTabs(PROJECT_INTRO, PROJECT_DETAILS)} />

        <BlockWysiwyg {...PROJECT_SEARCH} />
        <BlockMediaDoubleQuote {...PROJECT_MEDIA_SEARCH} />

        <BlockWysiwyg {...PROJECT_ONE_FILE} />
        <BlockImageFull {...PROJECT_IMAGE_GUIDE} />

        <BlockWysiwyg {...PROJECT_HEALTH} />

        <BlockWysiwyg {...PROJECT_FRONT_DOOR} />

        <BlockProjectDetails details={projectDetailsWithoutStack(PROJECT_DETAILS)} />
        <GeneralCta {...PROJECT_CTA} />
      </main>

      <NavigationFooter />

      <JsonLd schema={SCHEMA} />
    </>
  );
}
