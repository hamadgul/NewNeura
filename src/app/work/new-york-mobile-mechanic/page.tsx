import { MainNavigation } from "@/components/site/home/MainNavigation";
import { NavigationFooter } from "@/components/site/home/NavigationFooter";
import { JsonLd } from "@/components/site/shared/JsonLd";
import { BlockHeaderProjects } from "@/components/site/shared/blocks/BlockHeaderProjects";
import { BlockIntroDouble } from "@/components/site/shared/blocks/BlockIntroDouble";
import { projectIntroTabs } from "@/components/site/shared/blocks/projectIntroTabs";
import { BlockMediaDoubleQuote } from "@/components/site/shared/blocks/BlockMediaDoubleQuote";
import { BlockProjectDetails } from "@/components/site/shared/blocks/BlockProjectDetails";
import { BlockWysiwyg } from "@/components/site/shared/blocks/BlockWysiwyg";
import {
  PROJECT_CANONICAL,
  PROJECT_DESCRIPTION,
  PROJECT_DETAILS,
  PROJECT_FEATURE_ONE,
  PROJECT_FEATURE_THREE,
  PROJECT_FEATURE_TWO,
  PROJECT_HEADER,
  PROJECT_INTRO,
  PROJECT_MEDIA_QUOTE_ONE,
  PROJECT_MEDIA_QUOTE_TWO,
  PROJECT_OG_IMAGE,
  PROJECT_OUTCOME,
  PROJECT_TITLE,
} from "@/components/site/work/new-york-mobile-mechanic/content";

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
 * `/work/new-york-mobile-mechanic/`.
 *
 * Nine blocks, in the order the source page runs its sections:
 *
 *   BlockHeaderProjects → BlockIntroDouble (the brief / what we built)
 *   → BlockWysiwyg (outcome) → BlockMediaDoubleQuote → BlockWysiwyg ×2
 *   → BlockMediaDoubleQuote → BlockWysiwyg → BlockProjectDetails
 *
 * The two media blocks are placed where the source places its two feature
 * images: each one sits immediately above the feature it illustrates, and
 * carries that feature's caption as the block's quote. Features one and two
 * share the first block's image because only one of the two ships a picture.
 *
 * There is deliberately no `BlockImageFull` on this page. Of the three stills
 * available, one is small (mechanicseo.png, 512x265) and one is portrait
 * (conversion.png, 1179x2203); the full-bleed block renders at `h-auto w-full`,
 * which would upscale the first 2.8x and make the second 2,690px tall at 1440.
 * `BlockMediaDoubleQuote`'s slots cap both. See the asset table in `content.ts`.
 *
 * Client-boundary note: every constant above comes from this project's plain
 * `content.ts`. `BlockWysiwyg`, `BlockIntroDouble` and `BlockMediaDoubleQuote`
 * all carry `"use client"`, so a value imported from one of them would arrive
 * here as a client-reference proxy and kill the prerender — only their TYPES
 * cross that boundary, and they do it in `content.ts`.
 */
export default function NewYorkMobileMechanicPage() {
  return (
    <>
      <MainNavigation />

      {/* `overflow-x: clip` (not hidden) — matches the homepage shell. */}
      <main className="mainContent relative w-full overflow-x-clip bg-white">
        <BlockHeaderProjects {...PROJECT_HEADER} />
        <BlockIntroDouble {...projectIntroTabs(PROJECT_INTRO, PROJECT_DETAILS)} />
        <BlockWysiwyg {...PROJECT_OUTCOME} />
        <BlockMediaDoubleQuote {...PROJECT_MEDIA_QUOTE_ONE} />
        <BlockWysiwyg {...PROJECT_FEATURE_ONE} />
        <BlockWysiwyg {...PROJECT_FEATURE_TWO} />
        <BlockMediaDoubleQuote {...PROJECT_MEDIA_QUOTE_TWO} />
        <BlockWysiwyg {...PROJECT_FEATURE_THREE} />
        <BlockProjectDetails details={PROJECT_DETAILS} />
      </main>

      <NavigationFooter />

      <JsonLd schema={SCHEMA} />
    </>
  );
}
