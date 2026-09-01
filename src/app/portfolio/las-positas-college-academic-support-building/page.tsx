import { MainNavigation } from "@/components/sites/lpas-com-76f4f1fd/root-8a5edab2/MainNavigation";
import { NavigationFooter } from "@/components/sites/lpas-com-76f4f1fd/root-8a5edab2/NavigationFooter";
import { BlockHeaderProjects } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockHeaderProjects";
import { BlockImageFull } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockImageFull";
import { BlockIntroDouble } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockIntroDouble";
import { BlockMediaDouble } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockMediaDouble";
import { BlockMediaDoubleQuote } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockMediaDoubleQuote";
import { BlockProjectDetails } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockProjectDetails";
import { BlockWysiwyg } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockWysiwyg";
// Presets live in a plain module, not in the block: `BlockWysiwyg.tsx` is
// `"use client"`, and a server component importing a plain value from a client
// module gets a client-reference proxy rather than the value.
import { LAS_POSITAS_WYSIWYG } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/content-presets";
import {
  PROJECT_CANONICAL,
  PROJECT_DETAILS,
  PROJECT_HEADER,
  PROJECT_IMAGE_FULL_ONE,
  PROJECT_IMAGE_FULL_THREE,
  PROJECT_IMAGE_FULL_TWO,
  PROJECT_INTRO,
  PROJECT_MEDIA_DOUBLE_ONE,
  PROJECT_MEDIA_DOUBLE_TWO,
  PROJECT_MEDIA_QUOTE_ONE,
  PROJECT_MEDIA_QUOTE_TWO,
  PROJECT_OG_IMAGE,
  PROJECT_TITLE,
} from "@/components/sites/lpas-com-76f4f1fd/portfolio-las-positas-college-academic-support-building-e0ff48e8/content";

import type { Metadata } from "next";

/**
 * Unlike `/` and `/portfolio/`, this page's live title —
 * "Las Positas College Academic Support Building - LPAS Architecture" — is
 * exactly the root layout's "%s - LPAS Architecture" template applied to the
 * project name, so the plain (non-absolute) form is correct here.
 *
 * The source serves no meta description on project pages, so none is invented.
 */
export const metadata: Metadata = {
  title: PROJECT_TITLE,
  alternates: { canonical: "/portfolio/las-positas-college-academic-support-building/" },
  openGraph: {
    title: `${PROJECT_TITLE} - LPAS Architecture`,
    url: PROJECT_CANONICAL,
    images: [PROJECT_OG_IMAGE],
  },
};

/**
 * `/portfolio/las-positas-college-academic-support-building/`.
 *
 * Eleven blocks, in the order CONTENT.json records them (its other three
 * entries are the Preloader and the two navigations, which the shell supplies):
 *
 *   BlockHeaderProjects → BlockIntroDouble → BlockMediaDouble → BlockImageFull
 *   → BlockMediaDoubleQuote → BlockImageFull → BlockWysiwyg → BlockMediaDouble
 *   → BlockMediaDoubleQuote → BlockImageFull → BlockProjectDetails
 *
 * Three of those blocks repeat, so each instance takes its own numbered content
 * constant rather than sharing one — see the ordering note in `content.ts`.
 *
 * The first `BlockImageFull` gets `priority`: it is the only one of the three
 * that can be reached in the first viewport or two, and the block defaults the
 * rest to lazy.
 */
export default function LasPositasCollegeAcademicSupportBuildingPage() {
  return (
    <>
      <MainNavigation />

      {/* `overflow-x: clip` (not hidden) — matches the homepage shell. */}
      <main className="mainContent relative w-full overflow-x-clip bg-white">
        <BlockHeaderProjects {...PROJECT_HEADER} />
        <BlockIntroDouble {...PROJECT_INTRO} />
        <BlockMediaDouble {...PROJECT_MEDIA_DOUBLE_ONE} />
        <BlockImageFull {...PROJECT_IMAGE_FULL_ONE} priority />
        <BlockMediaDoubleQuote {...PROJECT_MEDIA_QUOTE_ONE} />
        <BlockImageFull {...PROJECT_IMAGE_FULL_TWO} />
        <BlockWysiwyg {...LAS_POSITAS_WYSIWYG} />
        <BlockMediaDouble {...PROJECT_MEDIA_DOUBLE_TWO} />
        <BlockMediaDoubleQuote {...PROJECT_MEDIA_QUOTE_TWO} />
        <BlockImageFull {...PROJECT_IMAGE_FULL_THREE} />
        <BlockProjectDetails details={PROJECT_DETAILS} />
      </main>

      <NavigationFooter />
    </>
  );
}
