import { MainNavigation } from "@/components/site/home/MainNavigation";
import { NavigationFooter } from "@/components/site/home/NavigationFooter";
import { JsonLd } from "@/components/site/shared/JsonLd";
import { BlockHeaderProjects } from "@/components/site/shared/blocks/BlockHeaderProjects";
import { BlockImageFull } from "@/components/site/shared/blocks/BlockImageFull";
import { BlockIntroDouble } from "@/components/site/shared/blocks/BlockIntroDouble";
import { projectIntroTabs } from "@/components/site/shared/blocks/projectIntroTabs";
import { BlockMediaDoubleQuote } from "@/components/site/shared/blocks/BlockMediaDoubleQuote";
import { BlockProjectDetails } from "@/components/site/shared/blocks/BlockProjectDetails";
import { BlockWysiwyg } from "@/components/site/shared/blocks/BlockWysiwyg";
import {
  PROJECT_CANONICAL,
  PROJECT_DESCRIPTION,
  PROJECT_DETAILS,
  PROJECT_HEADER,
  PROJECT_IMAGE_FULL,
  PROJECT_INTRO,
  PROJECT_MEDIA_QUOTE,
  PROJECT_OG_IMAGE,
  PROJECT_OUTCOME,
  PROJECT_TITLE,
} from "@/components/site/work/delivery-routing/content";

import { breadcrumbSchema, caseStudySchema } from "@/lib/seo";

import type { Metadata } from "next";

/**
 * `title` is the plain stem, so the root layout's "%s — NeuraGul" template
 * supplies the suffix. Both `PROJECT_TITLE` and `PROJECT_DESCRIPTION` are
 * search-facing strings that appear nowhere on the page — the `<h1>` and the
 * brief are separate constants and are unchanged. See their notes in
 * `content.ts`.
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
 * `/work/delivery-routing/`.
 *
 * Six blocks, in the order the source page runs its sections:
 *
 *   BlockHeaderProjects → BlockIntroDouble (the brief / what we built)
 *   → BlockWysiwyg (outcome) → BlockImageFull → BlockMediaDoubleQuote
 *   → BlockProjectDetails
 *
 * Six, not the eleven this shell was built for: eleven blocks existed to carry
 * eighteen photographs, and this project has four images — the cover plus three
 * screens. Each of those four appears exactly once. The outcome block stays
 * ahead of the media because its last sentence points at "the screenshots
 * below".
 *
 * `BlockImageFull` gets `priority`: it is the only full-bleed image on the page
 * and the first one after the header, and the block defaults to lazy otherwise.
 *
 * Client-boundary note: every constant above comes from this project's plain
 * `content.ts`. `BlockWysiwyg`, `BlockIntroDouble` and `BlockMediaDoubleQuote`
 * all carry `"use client"`, so a value imported from one of them would reach
 * this server component as a client-reference proxy and kill the prerender —
 * only their TYPES cross that boundary, and they do it in `content.ts`.
 */
export default function DeliveryRoutingPage() {
  return (
    <>
      <MainNavigation />

      {/* `overflow-x: clip` (not hidden) — matches the homepage shell. */}
      <main className="mainContent relative w-full overflow-x-clip bg-white">
        <BlockHeaderProjects {...PROJECT_HEADER} />
        <BlockIntroDouble {...projectIntroTabs(PROJECT_INTRO, PROJECT_DETAILS)} />
        <BlockWysiwyg {...PROJECT_OUTCOME} />
        <BlockImageFull {...PROJECT_IMAGE_FULL} priority />
        <BlockMediaDoubleQuote {...PROJECT_MEDIA_QUOTE} />
        <BlockProjectDetails details={PROJECT_DETAILS} />
      </main>

      <NavigationFooter />

      <JsonLd schema={SCHEMA} />
    </>
  );
}
