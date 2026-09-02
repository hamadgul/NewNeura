import { MainNavigation } from "@/components/site/home/MainNavigation";
import { NavigationFooter } from "@/components/site/home/NavigationFooter";
import { BlockHeaderProjects } from "@/components/site/shared/blocks/BlockHeaderProjects";
import { BlockImageFull } from "@/components/site/shared/blocks/BlockImageFull";
import { BlockIntroDouble } from "@/components/site/shared/blocks/BlockIntroDouble";
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

import type { Metadata } from "next";

/**
 * The live title is "Delivery routing platform — NeuraGul", which is exactly the
 * root layout's "%s — NeuraGul" template applied to the project name, so the
 * plain (non-absolute) form is correct here. The description is the project's
 * own `brief`.
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
 * `/work/delivery-routing/`.
 *
 * Six blocks, in the order the source page runs its sections:
 *
 *   BlockHeaderProjects → BlockIntroDouble (the brief / what I built)
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
        <BlockIntroDouble {...PROJECT_INTRO} />
        <BlockWysiwyg {...PROJECT_OUTCOME} />
        <BlockImageFull {...PROJECT_IMAGE_FULL} priority />
        <BlockMediaDoubleQuote {...PROJECT_MEDIA_QUOTE} />
        <BlockProjectDetails details={PROJECT_DETAILS} />
      </main>

      <NavigationFooter />
    </>
  );
}
