import {
  HEADER,
  INTRO,
  META,
  PROCESS,
  PROJECTS,
  WYSIWYG_EXPERTISE,
  WYSIWYG_WHY_LPAS,
} from "@/components/sites/lpas-com-76f4f1fd/markets-housing-student-housing-72e66e7d/content";
import { MainNavigation } from "@/components/sites/lpas-com-76f4f1fd/root-8a5edab2/MainNavigation";
import { NavigationFooter } from "@/components/sites/lpas-com-76f4f1fd/root-8a5edab2/NavigationFooter";
import { BlockHeaderMarkets } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockHeaderMarkets";
import { BlockIntroDouble } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockIntroDouble";
import { BlockProcessCardSlider } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockProcessCardSlider";
import { BlockProjectsHighlight } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockProjectsHighlight";
import { BlockWysiwyg } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockWysiwyg";

import type { Metadata } from "next";

/**
 * The source serves "Student Housing - LPAS Architecture" — exactly what the root
 * layout's `"%s - LPAS Architecture"` template produces from "Student Housing", so
 * this route feeds the template instead of opting out with an absolute title the
 * way the parent markets have to.
 *
 * No `description` is declared: the live page ships no `<meta name="description">`
 * at all (CONTENT.json records `metaDescription: null`), and inventing one would
 * be a content change rather than a clone.
 */
export const metadata: Metadata = {
  title: META.title,
  alternates: { canonical: META.canonical },
  openGraph: {
    url: META.sourceUrl,
  },
};

/**
 * `/markets/housing/student-housing/` — one of the four Housing child markets.
 *
 * Six blocks, in the order measured from the live DOM (CONTENT.json's block list
 * for this page):
 * `BlockHeaderMarkets` → `BlockIntroDouble` → `BlockProcessCardSlider` →
 * `BlockWysiwyg` → `BlockWysiwyg` → `BlockProjectsHighlight`.
 *
 * Unlike the parent `/markets/housing/`, a child page pins the process slider
 * between the intro and the rich text. That pin is `position: sticky` inside the
 * block's own wrapper, which dies the moment an ancestor establishes a scroll
 * container — so the shell below must keep `overflow-x: clip` and must never be
 * changed to `hidden`/`auto`.
 *
 * All copy lives in `content.ts`, mirroring the parent page's split.
 */
export default function MarketsHousingStudentHousingPage() {
  return (
    <>
      <MainNavigation />

      {/*
        `overflow-x: clip` (not `hidden`): `clip` does not create a scroll
        container, so the pinned process slider's `position: sticky` still works.
      */}
      <main className="mainContent relative w-full overflow-x-clip bg-white">
        <BlockHeaderMarkets {...HEADER} />
        <BlockIntroDouble {...INTRO} />
        <BlockProcessCardSlider {...PROCESS} />
        <BlockWysiwyg {...WYSIWYG_EXPERTISE} />
        <BlockWysiwyg {...WYSIWYG_WHY_LPAS} />
        <BlockProjectsHighlight {...PROJECTS} />
      </main>

      <NavigationFooter />
    </>
  );
}
