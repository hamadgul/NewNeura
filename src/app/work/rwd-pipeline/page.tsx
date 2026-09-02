import { MainNavigation } from "@/components/site/home/MainNavigation";
import { NavigationFooter } from "@/components/site/home/NavigationFooter";
import { BlockHeaderProjects } from "@/components/site/shared/blocks/BlockHeaderProjects";
import { BlockIntroDouble } from "@/components/site/shared/blocks/BlockIntroDouble";
import { BlockProjectDetails } from "@/components/site/shared/blocks/BlockProjectDetails";
import { BlockWysiwyg } from "@/components/site/shared/blocks/BlockWysiwyg";
import {
  PROJECT_CANONICAL,
  PROJECT_DESCRIPTION,
  PROJECT_DETAILS,
  PROJECT_HEADER,
  PROJECT_INTRO,
  PROJECT_OG_IMAGE,
  PROJECT_OUTCOME,
  PROJECT_TITLE,
} from "@/components/site/work/rwd-pipeline/content";

import type { Metadata } from "next";

/**
 * The live title is "Real-World Data Pipeline — NeuraGul", which is exactly the
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
 * `/work/rwd-pipeline/`.
 *
 * Four blocks, in the order the source page runs its sections:
 *
 *   BlockHeaderProjects → BlockIntroDouble (the brief / what I built)
 *   → BlockWysiwyg (outcome) → BlockProjectDetails
 *
 * Four, not the eleven this shell was built for: eleven blocks existed to carry
 * eighteen photographs, and this project has one. That image is the header's
 * full-bleed backdrop, so there is no `BlockImageFull` and no media block —
 * every one of them would have to re-render the picture the reader has just
 * scrolled past, which reads as padding because it is. The rest of the evidence
 * for this project lives in the case-study deck the details table points at.
 *
 * Client-boundary note: every constant above comes from this project's plain
 * `content.ts`. `BlockWysiwyg` and `BlockIntroDouble` both carry `"use client"`,
 * so a value imported from one of them would reach this server component as a
 * client-reference proxy and kill the prerender — only their TYPES cross that
 * boundary, and they do it in `content.ts`.
 */
export default function RwdPipelinePage() {
  return (
    <>
      <MainNavigation />

      {/* `overflow-x: clip` (not hidden) — matches the homepage shell. */}
      <main className="mainContent relative w-full overflow-x-clip bg-white">
        <BlockHeaderProjects {...PROJECT_HEADER} />
        <BlockIntroDouble {...PROJECT_INTRO} />
        <BlockWysiwyg {...PROJECT_OUTCOME} />
        <BlockProjectDetails details={PROJECT_DETAILS} />
      </main>

      <NavigationFooter />
    </>
  );
}
