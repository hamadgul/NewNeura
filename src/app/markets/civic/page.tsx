import {
  HEADER,
  INTRO,
  META,
  PROCESS,
  PROJECTS,
  WYSIWYG_EXPERTISE,
  WYSIWYG_PARTNER,
} from "@/components/sites/lpas-com-76f4f1fd/markets-civic-382e5b77/content";
import { MainNavigation } from "@/components/sites/lpas-com-76f4f1fd/root-8a5edab2/MainNavigation";
import { NavigationFooter } from "@/components/sites/lpas-com-76f4f1fd/root-8a5edab2/NavigationFooter";
import { BlockHeaderMarkets } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockHeaderMarkets";
import { BlockIntroDouble } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockIntroDouble";
import { BlockProcessCardSlider } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockProcessCardSlider";
import { BlockProjectsHighlight } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockProjectsHighlight";
import { BlockWysiwyg } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockWysiwyg";

import type { Metadata } from "next";

/**
 * The source serves "LPAS — Civic" (em dash, no suffix), which does not fit the
 * root layout's "%s - LPAS Architecture" template, so this route opts out with
 * an absolute title exactly as `/markets/housing/` does.
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
 * `/markets/civic/` — the parent Civic market page.
 *
 * Six blocks, in the order measured from the live DOM
 * (`markets-civic-382e5b77/CONTENT.json`, whose block list is the one that
 * records the slider; `blocks/BLOCKS.json` skips it because the GSAP
 * `pin-spacer` wrapper carries no `data-control`):
 * `BlockHeaderMarkets` → `BlockIntroDouble` → `BlockProcessCardSlider` →
 * `BlockWysiwyg` → `BlockWysiwyg` → `BlockProjectsHighlight`.
 *
 * Unlike `/markets/housing/`, the two child-less parent markets (Civic and
 * Commercial) **do** carry the pinned process block, so this shell has to keep
 * the slider's sticky pin alive: `overflow-x: clip` on `<main>` is deliberate
 * and load-bearing. `clip` establishes no scroll container, so a descendant
 * `position: sticky` still resolves against the viewport; switching it to
 * `hidden` (or `auto`) would silently kill the pin and collapse the whole
 * scroll-scrubbed carousel into a static row.
 *
 * All copy lives in `content.ts` so this shell stays identical to its eight
 * sibling market routes and only the content module changes.
 */
export default function MarketsCivicPage() {
  return (
    <>
      <MainNavigation />

      {/* `overflow-x: clip` (not hidden) — see the note above; the process
          slider's `position: sticky` pin depends on it. */}
      <main className="mainContent relative w-full overflow-x-clip bg-white">
        <BlockHeaderMarkets {...HEADER} />
        <BlockIntroDouble {...INTRO} />
        <BlockProcessCardSlider {...PROCESS} />
        <BlockWysiwyg {...WYSIWYG_EXPERTISE} />
        <BlockWysiwyg {...WYSIWYG_PARTNER} />
        <BlockProjectsHighlight {...PROJECTS} />
      </main>

      <NavigationFooter />
    </>
  );
}
