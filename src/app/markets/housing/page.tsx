import { HEADER, INTRO, META, PROJECTS } from "@/components/sites/lpas-com-76f4f1fd/markets-housing-588433c5/content";
import { MainNavigation } from "@/components/sites/lpas-com-76f4f1fd/root-8a5edab2/MainNavigation";
import { NavigationFooter } from "@/components/sites/lpas-com-76f4f1fd/root-8a5edab2/NavigationFooter";
import { BlockHeaderMarkets } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockHeaderMarkets";
import { BlockIntroDouble } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockIntroDouble";
import { BlockProjectsHighlight } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockProjectsHighlight";

import type { Metadata } from "next";

/**
 * The source serves "LPAS — Housing" (em dash, no suffix), which does not fit
 * the root layout's "%s - LPAS Architecture" template, so this route opts out
 * with an absolute title exactly as the homepage does.
 *
 * No `description` is declared: the live page ships no `<meta name=
 * "description">` at all (CONTENT.json records `metaDescription: null`), and
 * inventing one would be a content change rather than a clone.
 */
export const metadata: Metadata = {
  title: { absolute: META.title },
  alternates: { canonical: META.canonical },
  openGraph: {
    title: META.title,
    url: META.sourceUrl,
  },
};

/**
 * `/markets/housing/` — the parent Housing market page.
 *
 * Three blocks, in the order measured from the live DOM
 * (`markets-housing-588433c5/blocks/BLOCKS.json`):
 * `BlockHeaderMarkets` → `BlockIntroDouble` → `BlockProjectsHighlight`.
 *
 * Note there is deliberately **no** process-slider block here. The four
 * `/markets/housing/<sub>/` pages pin one between the intro and the projects;
 * the parent markets do not, so this page is a straight three-block stack with
 * nothing pinned and no scroll spacer to account for.
 *
 * All copy lives in `content.ts` so the eight sibling market routes can reuse
 * this shell verbatim and swap only their content module.
 */
export default function MarketsHousingPage() {
  return (
    <>
      <MainNavigation />

      {/* `overflow-x: clip` (not hidden) — matches the homepage shell. */}
      <main className="mainContent relative w-full overflow-x-clip bg-white">
        <BlockHeaderMarkets {...HEADER} />
        <BlockIntroDouble {...INTRO} />
        <BlockProjectsHighlight {...PROJECTS} />
      </main>

      <NavigationFooter />
    </>
  );
}
