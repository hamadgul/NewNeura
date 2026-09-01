import {
  LATEST_CANONICAL,
  LATEST_HEADER,
  LATEST_OG_IMAGE,
  LATEST_TITLE,
} from "@/components/sites/lpas-com-76f4f1fd/latest-f798beeb/content";
import { MainNavigation } from "@/components/sites/lpas-com-76f4f1fd/root-8a5edab2/MainNavigation";
import { NavigationFooter } from "@/components/sites/lpas-com-76f4f1fd/root-8a5edab2/NavigationFooter";
import { BlockHeaderPortfolio } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockHeaderPortfolio";
import { CollectionPost } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/CollectionPost";

import type { Metadata } from "next";

/**
 * Live title is "Latest Updates - LPAS Architecture", produced by the root
 * layout's `"%s - LPAS Architecture"` template from the bare stem.
 *
 * No `description`: the source serves none on this page (see content.ts).
 */
export const metadata: Metadata = {
  title: LATEST_TITLE,
  alternates: { canonical: LATEST_CANONICAL },
  openGraph: {
    title: "Latest Updates - LPAS Architecture",
    url: "https://lpas.com/latest/",
    images: [LATEST_OG_IMAGE],
  },
};

/**
 * lpas.com `/latest/` — the shortest page on the site: a portfolio-style
 * header over the journal grid.
 *
 * `CollectionPost` runs on its defaults. Its `perPage` default of 18 puts all
 * 18 posts on one page, which is what `block-CollectionPost.png` shows: every
 * card from "21 May 2026" down to the three "06 Jan 2025" posts is rendered,
 * with the pagination control below drawing a 2-page range that has nothing on
 * its second page. That is a source-side quirk (the control is sized from a
 * total the feed does not honour), so the default is kept and the block's own
 * pager reproduces the visible single page.
 */
export default function LatestPage() {
  return (
    <>
      <MainNavigation />

      {/* `overflow-x: clip`, matching the homepage shell. */}
      <main className="mainContent relative w-full overflow-x-clip bg-white">
        <BlockHeaderPortfolio {...LATEST_HEADER} />
        <CollectionPost />
      </main>

      <NavigationFooter />
    </>
  );
}
