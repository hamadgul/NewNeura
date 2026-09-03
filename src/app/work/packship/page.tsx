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
  PROJECT_FEATURE_ONE,
  PROJECT_FEATURE_THREE,
  PROJECT_FEATURE_TWO,
  PROJECT_HEADER,
  PROJECT_INTRO,
  PROJECT_OG_IMAGE,
  PROJECT_OUTCOME,
  PROJECT_TITLE,
} from "@/components/site/work/packship/content";

import type { Metadata } from "next";

/**
 * The live title is "PackShip — NeuraGul", which is the root layout's
 * "%s — NeuraGul" template applied to the project name, so the plain
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
 * `/work/packship/`.
 *
 * Seven blocks, in the order the source page runs its sections:
 *
 *   BlockHeaderProjects → BlockIntroDouble (the brief / what we built)
 *   → BlockWysiwyg (outcome) → BlockWysiwyg ×3 (the three features)
 *   → BlockProjectDetails
 *
 * There is deliberately **no** media block. PackShip ships one image,
 * `packship.jpg`, and the header spends it; a `BlockImageFull` or
 * `BlockMediaDouble` here could only repeat the shot already at the top of the
 * page. The three written features carry the middle of the page instead, one
 * `BlockWysiwyg` each — which is the same block, and the same tagline / title /
 * body shape, the service sub-pages use.
 *
 * Client-boundary note: every constant above comes from this project's plain
 * `content.ts`. `BlockWysiwyg` and `BlockIntroDouble` both carry `"use
 * client"`, so a value imported from either would arrive here as a
 * client-reference proxy and kill the prerender — only their TYPES cross that
 * boundary, and they do it in `content.ts`.
 */
export default function PackShipPage() {
  return (
    <>
      <MainNavigation />

      {/* `overflow-x: clip` (not hidden) — matches the homepage shell. */}
      <main className="mainContent relative w-full overflow-x-clip bg-white">
        <BlockHeaderProjects {...PROJECT_HEADER} />
        <BlockIntroDouble {...PROJECT_INTRO} />
        <BlockWysiwyg {...PROJECT_OUTCOME} />
        <BlockWysiwyg {...PROJECT_FEATURE_ONE} />
        <BlockWysiwyg {...PROJECT_FEATURE_TWO} />
        <BlockWysiwyg {...PROJECT_FEATURE_THREE} />
        <BlockProjectDetails details={PROJECT_DETAILS} />
      </main>

      <NavigationFooter />
    </>
  );
}
