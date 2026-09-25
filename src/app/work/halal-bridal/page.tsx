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
  PROJECT_COLLECTIONS,
  PROJECT_CTA,
  PROJECT_DESCRIPTION,
  PROJECT_DETAILS,
  PROJECT_HEADER,
  PROJECT_IMAGE_COLLECTION,
  PROJECT_INTRO,
  PROJECT_MEASURE,
  PROJECT_MEDIA_PAGES,
  PROJECT_OG_IMAGE,
  PROJECT_PAGES,
  PROJECT_SCHEMA,
  PROJECT_TITLE,
  PROJECT_TITLES,
} from "@/components/site/work/halal-bridal/content";

import { breadcrumbSchema, caseStudySchema } from "@/lib/seo";

import type { Metadata } from "next";

/**
 * `title` is the plain stem, so the root layout's "%s — NeuraGul" template
 * supplies the suffix. Both `PROJECT_TITLE` and `PROJECT_DESCRIPTION` are
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
 * `PROJECT_HEADER.service` ("SEO"), so the topics in the data are the topics
 * printed in the header.
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
 * `/work/halal-bridal/`.
 *
 * Eleven blocks:
 *
 *   BlockHeaderProjects (cover: the live home page and the hero H1 we rewrote)
 *   → BlockIntroDouble (the brief / the tech stack)
 *   → BlockWysiwyg (Titles)            (no frame: the cover already shows it)
 *   → BlockWysiwyg (Collections)       → BlockImageFull (Muslim collection)
 *   → BlockWysiwyg (New pages)         → BlockMediaDoubleQuote (custom page L, journal S)
 *   → BlockWysiwyg (Structured data)   (no frame: JSON-LD does not render)
 *   → BlockWysiwyg (Measuring)         (one lab run; no outcome claimed)
 *   → BlockProjectDetails → GeneralCta
 *
 * Only what the dossier verified live on 2026-09-25 is claimed (see the
 * ruling in `content.ts`). Two captures were left out on purpose: the Rana
 * product page shows the client's review widget reading "No reviews", and
 * the walima post's byline names the founder.
 *
 * Client-boundary note: every constant comes from this project's plain
 * `content.ts`. The blocks carry `"use client"`, so a VALUE imported from one
 * of them would reach this server component as a client-reference proxy.
 */
export default function HalalBridalPage() {
  return (
    <>
      <MainNavigation />

      {/* `overflow-x: clip` (not hidden) — matches the homepage shell. */}
      <main className="mainContent relative w-full overflow-x-clip bg-white">
        <BlockHeaderProjects {...PROJECT_HEADER} />
        <BlockIntroDouble {...projectIntroTabs(PROJECT_INTRO, PROJECT_DETAILS)} />

        <BlockWysiwyg {...PROJECT_TITLES} />

        <BlockWysiwyg {...PROJECT_COLLECTIONS} />
        <BlockImageFull {...PROJECT_IMAGE_COLLECTION} />

        <BlockWysiwyg {...PROJECT_PAGES} />
        <BlockMediaDoubleQuote {...PROJECT_MEDIA_PAGES} />

        <BlockWysiwyg {...PROJECT_SCHEMA} />

        <BlockWysiwyg {...PROJECT_MEASURE} />

        <BlockProjectDetails details={projectDetailsWithoutStack(PROJECT_DETAILS)} />
        <GeneralCta {...PROJECT_CTA} />
      </main>

      <NavigationFooter />

      <JsonLd schema={SCHEMA} />
    </>
  );
}
