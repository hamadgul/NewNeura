import {
  HEADER,
  INTRO,
  META,
  PROCESS,
  PROJECTS,
  WYSIWYG_DIVERSE_NEEDS,
  WYSIWYG_PROVEN_PARTNERS,
} from "@/components/sites/lpas-com-76f4f1fd/markets-housing-affordable-housing-5d96d8a6/content";
import { MainNavigation } from "@/components/sites/lpas-com-76f4f1fd/root-8a5edab2/MainNavigation";
import { NavigationFooter } from "@/components/sites/lpas-com-76f4f1fd/root-8a5edab2/NavigationFooter";
import { BlockHeaderMarkets } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockHeaderMarkets";
import { BlockIntroDouble } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockIntroDouble";
import { BlockProcessCardSlider } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockProcessCardSlider";
import { BlockProjectsHighlight } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockProjectsHighlight";
import { BlockWysiwyg } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockWysiwyg";

import type { Metadata } from "next";

/**
 * The source serves "Affordable Housing - LPAS Architecture", which *is* the
 * root layout's "%s - LPAS Architecture" template applied to "Affordable
 * Housing" — so this route passes the bare page name and lets the template add
 * the suffix, rather than opting out with an absolute title the way the parent
 * market pages have to (their live titles are em-dashed and unsuffixed).
 *
 * No `description` is declared: the live page ships no `<meta name=
 * "description">` at all (CONTENT.json records `metaDescription: null`), and
 * inventing one would be a content change rather than a clone.
 */
export const metadata: Metadata = {
  title: META.title,
  alternates: { canonical: META.canonical },
  openGraph: {
    // `openGraph.title` does not inherit `title.template`, so the resolved
    // string is spelled out to match the source's `<title>` exactly.
    title: META.fullTitle,
    url: META.sourceUrl,
  },
};

/**
 * `/markets/housing/affordable-housing/` — a child of the Housing market.
 *
 * Six blocks, in the order measured from the live DOM (this page's
 * `CONTENT.json`):
 * `BlockHeaderMarkets` → `BlockIntroDouble` → `BlockProcessCardSlider` →
 * `BlockWysiwyg` → `BlockWysiwyg` → `BlockProjectsHighlight`.
 *
 * Note the **two** rich-text blocks: sibling `/market-rate-housing/` has only
 * one, and the four housing children do not agree on this — the count is
 * measured per page, never assumed.
 *
 * Unlike the parent market pages, the sub-markets pin a process carousel
 * between the intro and the projects.
 */
export default function MarketsHousingAffordableHousingPage() {
  return (
    <>
      <MainNavigation />

      {/*
        `overflow-x: clip` (not hidden/auto) — matches the homepage shell, and
        is load-bearing here: `BlockProcessCardSlider`'s pin is a
        `position: sticky` section, which is silently disabled by any ancestor
        with `overflow` of `hidden` or `auto`. `clip` establishes no scroll
        container, so the pin survives.
      */}
      <main className="mainContent relative w-full overflow-x-clip bg-white">
        <BlockHeaderMarkets {...HEADER} />
        <BlockIntroDouble {...INTRO} />
        <BlockProcessCardSlider {...PROCESS} />
        <BlockWysiwyg {...WYSIWYG_DIVERSE_NEEDS} />
        <BlockWysiwyg {...WYSIWYG_PROVEN_PARTNERS} />
        <BlockProjectsHighlight {...PROJECTS} />
      </main>

      <NavigationFooter />
    </>
  );
}
