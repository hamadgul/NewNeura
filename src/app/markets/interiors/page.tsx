import {
  HEADER,
  INTRO,
  META,
  PROCESS,
  PROJECTS,
  WYSIWYG_ADVANTAGE,
  WYSIWYG_EXPERTISE,
} from "@/components/sites/lpas-com-76f4f1fd/markets-interiors-6cba84fd/content";
import { MainNavigation } from "@/components/sites/lpas-com-76f4f1fd/root-8a5edab2/MainNavigation";
import { NavigationFooter } from "@/components/sites/lpas-com-76f4f1fd/root-8a5edab2/NavigationFooter";
import { BlockHeaderMarkets } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockHeaderMarkets";
import { BlockIntroDouble } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockIntroDouble";
import { BlockProcessCardSlider } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockProcessCardSlider";
import { BlockProjectsHighlight } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockProjectsHighlight";
import { BlockWysiwyg } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockWysiwyg";

import type { Metadata } from "next";

/**
 * The source serves "LPAS — Interiors" (em dash, no suffix), which does not fit
 * the root layout's "%s - LPAS Architecture" template, so this route opts out
 * with an absolute title exactly as `/markets/housing/` does.
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
 * `/markets/interiors/` — the parent Interiors market page.
 *
 * Six blocks, in the order measured from the live DOM
 * (`markets-interiors-6cba84fd/RECON.json`, whose section list is the authority
 * here — BLOCKS.json misses the slider because GSAP wraps it in a `pin-spacer`
 * that hides the `data-control` attribute one level down):
 * `BlockHeaderMarkets` → `BlockIntroDouble` → `BlockProcessCardSlider` →
 * `BlockWysiwyg` → `BlockWysiwyg` → `BlockProjectsHighlight`.
 *
 * Unlike `/markets/housing/`, this page *does* pin the process slider. That pin
 * is `position: sticky`, which is killed by any ancestor with `overflow:
 * hidden` or `auto` — so `<main>` keeps `overflow-x: clip`, which creates no
 * scroll container and leaves the sticky positioning intact.
 *
 * All copy lives in `content.ts` so this shell stays identical across the
 * sibling market routes.
 */
export default function MarketsInteriorsPage() {
  return (
    <>
      <MainNavigation />

      {/* `overflow-x: clip` (not hidden) — matches the homepage shell, and is
          what lets the process slider's sticky pin survive. */}
      <main className="mainContent relative w-full overflow-x-clip bg-white">
        <BlockHeaderMarkets {...HEADER} />
        <BlockIntroDouble {...INTRO} />
        <BlockProcessCardSlider {...PROCESS} />
        <BlockWysiwyg {...WYSIWYG_EXPERTISE} />
        <BlockWysiwyg {...WYSIWYG_ADVANTAGE} />
        <BlockProjectsHighlight {...PROJECTS} />
      </main>

      <NavigationFooter />
    </>
  );
}
