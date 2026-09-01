import { BlockIntroGeneral } from "@/components/sites/lpas-com-76f4f1fd/root-8a5edab2/BlockIntroGeneral";
import { BlockProjectsHighlight } from "@/components/sites/lpas-com-76f4f1fd/root-8a5edab2/BlockProjectsHighlight";
import { GlobalLatestOverview } from "@/components/sites/lpas-com-76f4f1fd/root-8a5edab2/GlobalLatestOverview";
import { HomeHero } from "@/components/sites/lpas-com-76f4f1fd/root-8a5edab2/HomeHero";
import { MainNavigation } from "@/components/sites/lpas-com-76f4f1fd/root-8a5edab2/MainNavigation";
import { NavigationFooter } from "@/components/sites/lpas-com-76f4f1fd/root-8a5edab2/NavigationFooter";

import type { Metadata } from "next";

const DESCRIPTION =
  "Clear Process. Creative Results. Human-centered. Always Curious. At LPAS, we design with people at the center and purpose at every turn.";

/**
 * The source serves this page's title unsuffixed, so it opts out of the root
 * layout's "%s - LPAS Architecture" template with an absolute title.
 */
export const metadata: Metadata = {
  title: { absolute: "LPAS - Architecture and Interiors" },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: "LPAS - Architecture and Interiors",
    description: DESCRIPTION,
    url: "https://lpas.com/",
  },
};

/**
 * lpas.com homepage clone.
 *
 * Section order and stacking follow docs/research/lpas-com-76f4f1fd/root-8a5edab2/
 * PAGE_TOPOLOGY.md. The order matters more than usual here: the hero consumes
 * ~4300px of scroll inside its own pin, so everything below it depends on that
 * spacer being present and correctly sized.
 */
export default function Home() {
  return (
    <>
      <MainNavigation />

      {/* `overflow-x: clip` (not hidden) — hidden here would break the sticky pin. */}
      <main className="mainContent relative w-full overflow-x-clip bg-white">
        <HomeHero />
        <BlockIntroGeneral />
        <BlockProjectsHighlight />
        <GlobalLatestOverview />
      </main>

      <NavigationFooter />
    </>
  );
}
