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
  PROJECT_HEADER,
  PROJECT_INTRO,
  PROJECT_MEDIA_QUOTE,
  PROJECT_OG_IMAGE,
  PROJECT_OUTCOME,
  PROJECT_TITLE,
} from "@/components/site/work/foodtruckrentals/content";

import type { Metadata } from "next";

/**
 * The live title is "Food Truck Rentals — NeuraGul", which is the root layout's
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
 * `/work/foodtruckrentals/`.
 *
 * Five blocks, in the order the source page runs its sections:
 *
 *   BlockHeaderProjects → BlockIntroDouble (the brief / what I built)
 *   → BlockWysiwyg (outcome) → BlockMediaDoubleQuote → BlockProjectDetails
 *
 * Five, not the eleven this shell was built for. The project has three images —
 * the cover plus two screens — and each appears exactly once: the cover backs
 * the header, and the two screens fill the single `BlockMediaDoubleQuote`,
 * which is also the only block on the page with a text slot next to media and
 * so the only one that can print a caption.
 *
 * Client-boundary note: every constant above comes from this project's plain
 * `content.ts`. `BlockWysiwyg`, `BlockIntroDouble` and `BlockMediaDoubleQuote`
 * all carry `"use client"`, so a value imported from one of them would arrive
 * here as a client-reference proxy and kill the prerender — only their TYPES
 * cross that boundary, and they do it in `content.ts`.
 */
export default function FoodTruckRentalsPage() {
  return (
    <>
      <MainNavigation />

      {/* `overflow-x: clip` (not hidden) — matches the homepage shell. */}
      <main className="mainContent relative w-full overflow-x-clip bg-white">
        <BlockHeaderProjects {...PROJECT_HEADER} />
        <BlockIntroDouble {...PROJECT_INTRO} />
        <BlockWysiwyg {...PROJECT_OUTCOME} />
        <BlockMediaDoubleQuote {...PROJECT_MEDIA_QUOTE} />
        <BlockProjectDetails details={PROJECT_DETAILS} />
      </main>

      <NavigationFooter />
    </>
  );
}
