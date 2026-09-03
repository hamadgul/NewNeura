import { MainNavigation } from "@/components/site/home/MainNavigation";
import { NavigationFooter } from "@/components/site/home/NavigationFooter";
import { BlockHeaderPortfolio } from "@/components/site/shared/blocks/BlockHeaderPortfolio";
import { CollectionProjects } from "@/components/site/shared/blocks/CollectionProjects";
import {
  PORTFOLIO_CANONICAL,
  PORTFOLIO_DESCRIPTION,
  PORTFOLIO_HEADER,
  PORTFOLIO_OG_IMAGE,
  PORTFOLIO_PROJECTS,
  PORTFOLIO_TITLE,
} from "@/components/site/work/content";

import type { Metadata } from "next";

/**
 * The source serves this page as `Work — NeuraGul`, which the root layout's
 * `"%s — NeuraGul"` template produces from the bare word — so the title stays
 * plain rather than opting out with `{ absolute }`.
 *
 * The description is the source page's own `<meta name="description">`, carried
 * in `content.ts` and bylined to the practice rather than to one person.
 */
export const metadata: Metadata = {
  title: PORTFOLIO_TITLE,
  description: PORTFOLIO_DESCRIPTION,
  alternates: { canonical: PORTFOLIO_CANONICAL },
  openGraph: {
    title: `${PORTFOLIO_TITLE} — NeuraGul`,
    description: PORTFOLIO_DESCRIPTION,
    url: `https://neuragul.com${PORTFOLIO_CANONICAL}`,
    images: [PORTFOLIO_OG_IMAGE],
  },
};

/**
 * `/work/` — two blocks: `BlockHeaderPortfolio` → `CollectionProjects`.
 *
 * `CollectionProjects` receives the whole nine-project feed and pages it
 * client-side, 14 at a time, so in practice there is one page and the
 * pagination row stays collapsed. Its `filters` prop is deliberately left at
 * its default: the block already exports the measured `WORK_SERVICE_FILTERS`,
 * so this page has nothing to redeclare.
 *
 * `highlights` is deliberately not passed either. The block excludes a
 * highlighted project from the results and only paints a banner when a later
 * target container still holds cards; with nine projects the cards stop at
 * target two, so a second banner could never render and any banner at all
 * would cost the index a project. See the note on `PORTFOLIO_HIGHLIGHTS`.
 */
export default function WorkPage() {
  return (
    <>
      <MainNavigation />

      {/* `overflow-x: clip` (not hidden) — matches the homepage shell. */}
      <main className="mainContent relative w-full overflow-x-clip bg-white">
        <BlockHeaderPortfolio {...PORTFOLIO_HEADER} />
        <CollectionProjects projects={PORTFOLIO_PROJECTS} />
      </main>

      <NavigationFooter />
    </>
  );
}
