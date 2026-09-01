import { MainNavigation } from "@/components/sites/lpas-com-76f4f1fd/root-8a5edab2/MainNavigation";
import { NavigationFooter } from "@/components/sites/lpas-com-76f4f1fd/root-8a5edab2/NavigationFooter";
import { BlockHeaderPortfolio } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockHeaderPortfolio";
import { CollectionProjects } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/CollectionProjects";
import {
  PORTFOLIO_HEADER,
  PORTFOLIO_HIGHLIGHTS,
  PORTFOLIO_OG_IMAGE,
  PORTFOLIO_PROJECTS,
  PORTFOLIO_TITLE,
} from "@/components/sites/lpas-com-76f4f1fd/portfolio-81ee5030/content";

import type { Metadata } from "next";

/**
 * Like the homepage, the source serves this page's `<title>` without the
 * "- LPAS Architecture" suffix — it is literally `LPAS — Portfolio`, em dash and
 * all — so it opts out of the root layout's template with an absolute title.
 *
 * The source ships no meta description on this page (CONTENT.json records
 * `metaDescription: null`), so none is invented here.
 */
export const metadata: Metadata = {
  title: { absolute: PORTFOLIO_TITLE },
  alternates: { canonical: "/portfolio/" },
  openGraph: {
    title: PORTFOLIO_TITLE,
    url: "https://lpas.com/portfolio/",
    images: [PORTFOLIO_OG_IMAGE],
  },
};

/**
 * `/portfolio/` — two blocks, matching the source's own block order
 * (`BlockHeaderPortfolio` → `CollectionProjects`; see CONTENT.json, whose other
 * three entries are the Preloader and the two navigations).
 *
 * `CollectionProjects` receives the whole 71-project feed and does the paging
 * itself, 14 per page, exactly as the source's `/wp-json/filter/projects`
 * endpoint does. Its `filters` prop is deliberately left at its default: the
 * block already exports the measured `PORTFOLIO_MARKET_FILTERS`, so this page
 * has nothing to redeclare.
 */
export default function PortfolioPage() {
  return (
    <>
      <MainNavigation />

      {/* `overflow-x: clip` (not hidden) — matches the homepage shell. */}
      <main className="mainContent relative w-full overflow-x-clip bg-white">
        <BlockHeaderPortfolio {...PORTFOLIO_HEADER} />
        <CollectionProjects
          projects={PORTFOLIO_PROJECTS}
          highlights={PORTFOLIO_HIGHLIGHTS}
        />
      </main>

      <NavigationFooter />
    </>
  );
}
