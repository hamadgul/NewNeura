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
  PROJECT_CATALOGUE,
  PROJECT_CTA,
  PROJECT_DESCRIPTION,
  PROJECT_DETAILS,
  PROJECT_HEADER,
  PROJECT_IMAGE_DELIVERY,
  PROJECT_IMAGE_DRAINAGE,
  PROJECT_INTRO,
  PROJECT_MEDIA_STEELTEX,
  PROJECT_MIGRATION,
  PROJECT_OG_IMAGE,
  PROJECT_PERFORMANCE,
  PROJECT_POSITIONING,
  PROJECT_SEARCH,
  PROJECT_TITLE,
} from "@/components/site/work/yankocy/content";

import { breadcrumbSchema, caseStudySchema } from "@/lib/seo";

import type { Metadata } from "next";

/**
 * `title` is the plain stem, so the root layout's "%s — NeuraGul" template
 * supplies the suffix. `PROJECT_TITLE` and `PROJECT_DESCRIPTION` are
 * search-facing strings that appear nowhere on the page.
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
 * `CreativeWork` + `BreadcrumbList`. `about` is split off
 * `PROJECT_HEADER.service` ("Web Development · SEO"), so the topics in the
 * data are the topics printed in the header.
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
 * `/work/yankocy/`.
 *
 * Twelve blocks:
 *
 *   BlockHeaderProjects (cover: the new home page, on staging)
 *   → BlockIntroDouble (the brief / the tech stack)
 *   → BlockWysiwyg (One long product page became thirteen) → BlockImageFull (drainage category)
 *   → BlockWysiwyg (Thirty-seven old addresses)             (no image: a redirect does not paint)
 *   → BlockWysiwyg (The Steeltex page, before and after)   → BlockMediaDoubleQuote (new L, old S)
 *   → BlockWysiwyg (Written for dealers and yards)         → BlockImageFull (delivery area)
 *   → BlockWysiwyg (Structured data on all 26 pages)       (no image: JSON-LD does not render)
 *   → BlockProjectDetails → GeneralCta
 *
 * Each prose block is followed by the frame that shows its claim. The
 * before/after pair uses the quote variant because at `xl` the quote sits
 * under the SMALL frame, which is the old GoDaddy page, so the quote is that
 * frame's caption. The cover is not repeated in the body.
 *
 * No live-site link anywhere: the new site is on staging only and the user
 * ruled the staging URL stays unlinked (see `content.ts`).
 *
 * Client-boundary note: every constant comes from this project's plain
 * `content.ts`. `BlockWysiwyg`, `BlockIntroDouble`, `BlockMediaDoubleQuote` and
 * `GeneralCta` carry `"use client"`, so a VALUE imported from one of them
 * would reach this server component as a client-reference proxy and spread to
 * undefined props with no type or build error. Only their TYPES cross that
 * boundary, and they do it in `content.ts`.
 */
export default function YankocyPage() {
  return (
    <>
      <MainNavigation />

      {/* `overflow-x: clip` (not hidden) — matches the homepage shell. */}
      <main className="mainContent relative w-full overflow-x-clip bg-white">
        <BlockHeaderProjects {...PROJECT_HEADER} />
        <BlockIntroDouble {...projectIntroTabs(PROJECT_INTRO, PROJECT_DETAILS)} />

        <BlockWysiwyg {...PROJECT_CATALOGUE} />
        <BlockImageFull {...PROJECT_IMAGE_DRAINAGE} />

        <BlockWysiwyg {...PROJECT_MIGRATION} />

        <BlockWysiwyg {...PROJECT_PERFORMANCE} />
        <BlockMediaDoubleQuote {...PROJECT_MEDIA_STEELTEX} />

        <BlockWysiwyg {...PROJECT_POSITIONING} />
        <BlockImageFull {...PROJECT_IMAGE_DELIVERY} />

        <BlockWysiwyg {...PROJECT_SEARCH} />

        <BlockProjectDetails details={projectDetailsWithoutStack(PROJECT_DETAILS)} />
        <GeneralCta {...PROJECT_CTA} />
      </main>

      <NavigationFooter />

      <JsonLd schema={SCHEMA} />
    </>
  );
}
