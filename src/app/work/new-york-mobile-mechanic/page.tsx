import { MainNavigation } from "@/components/site/home/MainNavigation";
import { NavigationFooter } from "@/components/site/home/NavigationFooter";
import { BlockHeaderProjects } from "@/components/site/shared/blocks/BlockHeaderProjects";
import { BlockIntroDouble } from "@/components/site/shared/blocks/BlockIntroDouble";
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

import type { Metadata } from "next";

/**
 * The live title is "New York Mobile Mechanic — NeuraGul", which is the root
 * layout's "%s — NeuraGul" template applied to the project name, so the plain
 * (non-absolute) form is correct. The description is the project's own `brief`.
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
 * `/work/new-york-mobile-mechanic/`.
 *
 * Nine blocks, in the order the source page runs its sections:
 *
 *   BlockHeaderProjects → BlockIntroDouble (the brief / what I built)
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
        <BlockIntroDouble {...PROJECT_INTRO} />
        <BlockWysiwyg {...PROJECT_OUTCOME} />
        <BlockMediaDoubleQuote {...PROJECT_MEDIA_QUOTE_ONE} />
        <BlockWysiwyg {...PROJECT_FEATURE_ONE} />
        <BlockWysiwyg {...PROJECT_FEATURE_TWO} />
        <BlockMediaDoubleQuote {...PROJECT_MEDIA_QUOTE_TWO} />
        <BlockWysiwyg {...PROJECT_FEATURE_THREE} />
        <BlockProjectDetails details={PROJECT_DETAILS} />
      </main>

      <NavigationFooter />
    </>
  );
}
