import {
  HEADER,
  INTRO,
  META,
  PROCESS,
  PROJECTS,
  WYSIWYG_SERVICES,
  WYSIWYG_WHY_LPAS,
} from "@/components/sites/lpas-com-76f4f1fd/markets-commercial-0495d1e6/content";
import { MainNavigation } from "@/components/sites/lpas-com-76f4f1fd/root-8a5edab2/MainNavigation";
import { NavigationFooter } from "@/components/sites/lpas-com-76f4f1fd/root-8a5edab2/NavigationFooter";
import { BlockHeaderMarkets } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockHeaderMarkets";
import { BlockIntroDouble } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockIntroDouble";
import { BlockProcessCardSlider } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockProcessCardSlider";
import { BlockProjectsHighlight } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockProjectsHighlight";
import { BlockWysiwyg } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockWysiwyg";

import type { Metadata } from "next";

/**
 * The source serves "LPAS — Commercial" (em dash, no suffix), which does not
 * fit the root layout's "%s - LPAS Architecture" template, so this route opts
 * out with an absolute title exactly as `/markets/housing/` does.
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
 * `/markets/commercial/` — the parent Commercial market page.
 *
 * Six blocks, in the order measured from the live DOM
 * (`markets-commercial-0495d1e6/CONTENT.json`, whose block list is the one
 * that records the slider; `blocks/BLOCKS.json` skips it because the GSAP
 * `pin-spacer` wrapper carries no `data-control`):
 * `BlockHeaderMarkets` → `BlockIntroDouble` → `BlockProcessCardSlider` →
 * `BlockWysiwyg` → `BlockWysiwyg` → `BlockProjectsHighlight`.
 *
 * Identical in structure to `/markets/civic/`; the only rendered difference is
 * the header's ground, which flips to the light `--lpas-commercial` (#e3c1aa)
 * and takes `#262626` type. That tone comes from the block's own per-market
 * table, so nothing here overrides it.
 *
 * As on Civic, `overflow-x: clip` on `<main>` is deliberate and load-bearing:
 * `clip` establishes no scroll container, so the process slider's
 * `position: sticky` pin still resolves against the viewport. `hidden` (or
 * `auto`) would silently kill the pin and collapse the scroll-scrubbed
 * carousel into a static row.
 *
 * All copy lives in `content.ts` so this shell stays identical to its eight
 * sibling market routes and only the content module changes.
 */
export default function MarketsCommercialPage() {
  return (
    <>
      <MainNavigation />

      {/* `overflow-x: clip` (not hidden) — see the note above; the process
          slider's `position: sticky` pin depends on it. */}
      <main className="mainContent relative w-full overflow-x-clip bg-white">
        <BlockHeaderMarkets {...HEADER} />
        <BlockIntroDouble {...INTRO} />
        <BlockProcessCardSlider {...PROCESS} />
        <BlockWysiwyg {...WYSIWYG_SERVICES} />
        <BlockWysiwyg {...WYSIWYG_WHY_LPAS} />
        <BlockProjectsHighlight {...PROJECTS} />
      </main>

      <NavigationFooter />
    </>
  );
}
