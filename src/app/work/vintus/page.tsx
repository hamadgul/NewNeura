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
import { BlockProjectDetails } from "@/components/site/shared/blocks/BlockProjectDetails";
import { BlockWysiwyg } from "@/components/site/shared/blocks/BlockWysiwyg";
import { GeneralCta } from "@/components/site/shared/blocks/GeneralCta";
import {
  PROJECT_CANONICAL,
  PROJECT_CATALOGUE,
  PROJECT_CTA,
  PROJECT_DESCRIPTION,
  PROJECT_DETAILS,
  PROJECT_HEADER,
  PROJECT_IMAGE_NEWS,
  PROJECT_IMAGE_PRODUCERS,
  PROJECT_IMAGE_SELL_SHEET,
  PROJECT_INTRO,
  PROJECT_LOGIN,
  PROJECT_OG_IMAGE,
  PROJECT_RELATIONS,
  PROJECT_TITLE,
  PROJECT_TOOLS,
} from "@/components/site/work/vintus/content";

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
 * `/work/vintus/`.
 *
 * Eleven blocks:
 *
 *   BlockHeaderProjects (cover: the live home page)
 *   → BlockIntroDouble (the brief / the tech stack)
 *   → BlockWysiwyg (One page per vintage, 1,600 of them)      → BlockImageFull (the producers page)
 *   → BlockWysiwyg (Every post is keyed to a producer and a wine) → BlockImageFull (the news page)
 *   → BlockWysiwyg (A sell sheet is a search, a title and a name) → BlockImageFull (the sell-sheet generator)
 *   → BlockWysiwyg (A dashboard, orders and notes behind one sign-in)  (no image: a sign-in prompt)
 *   → BlockProjectDetails → GeneralCta
 *
 * The composition is argued from the evidence outward: each prose block is
 * followed by the one frame that shows its claim, directly beneath it. The
 * catalogue section is answered by the producers page, the top level of the
 * hierarchy the section describes (the wine and producer pages themselves
 * cannot be captured — see the config — so the hierarchy below that level is
 * described from the saved HTML). The relations section is answered by the
 * news page, whose filter panel is the producer-and-wine join. The tools
 * section is answered by the sell-sheet generator. The login section has no
 * frame: two of its three pages print one sentence to a visitor. The cover is
 * not repeated in the body (Task 8's duplicate-cover trap).
 *
 * `BlockImageFull` appears three times and `BlockMediaDoubleQuote` not at
 * all: the quote variant would put one of the three frames two blocks away
 * from its sentence and shrink it to the 165 px small slot on phones, and all
 * three frames are 1600-wide pages of type that need the full width to read.
 * `BlockImageSlider` is not used (its geometry is solved for 3:4 portraits
 * and a 1600-wide screenshot lands in it as a thumbnail).
 *
 * The 2026-09-07 page had three blocks (header, intro, details) and one
 * asset; this project has no local source, so every added sentence is traced
 * to the live site in `content.ts` and the dossier. `GeneralCta` closes the
 * page and points at `/contact/`.
 *
 * Client-boundary note: every constant above comes from this project's plain
 * `content.ts`. `BlockWysiwyg`, `BlockIntroDouble` and `GeneralCta` carry
 * `"use client"`, so a VALUE imported from one of them would reach this server
 * component as a client-reference proxy and spread to undefined props with no
 * type or build error. Only their TYPES cross that boundary, and they do it in
 * `content.ts`.
 */
export default function VintusPage() {
  return (
    <>
      <MainNavigation />

      {/* `overflow-x: clip` (not hidden) — matches the homepage shell. */}
      <main className="mainContent relative w-full overflow-x-clip bg-white">
        <BlockHeaderProjects {...PROJECT_HEADER} />
        <BlockIntroDouble {...projectIntroTabs(PROJECT_INTRO, PROJECT_DETAILS)} />

        <BlockWysiwyg {...PROJECT_CATALOGUE} />
        <BlockImageFull {...PROJECT_IMAGE_PRODUCERS} />

        <BlockWysiwyg {...PROJECT_RELATIONS} />
        <BlockImageFull {...PROJECT_IMAGE_NEWS} />

        <BlockWysiwyg {...PROJECT_TOOLS} />
        <BlockImageFull {...PROJECT_IMAGE_SELL_SHEET} />

        <BlockWysiwyg {...PROJECT_LOGIN} />

        <BlockProjectDetails details={projectDetailsWithoutStack(PROJECT_DETAILS)} />
        <GeneralCta {...PROJECT_CTA} />
      </main>

      <NavigationFooter />

      <JsonLd schema={SCHEMA} />
    </>
  );
}
