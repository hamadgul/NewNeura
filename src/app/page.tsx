import { BlockIntroGeneral } from "@/components/site/home/BlockIntroGeneral";
import { BlockProjectsHighlight } from "@/components/site/home/BlockProjectsHighlight";
import { HomeHero } from "@/components/site/home/HomeHero";
import { MainNavigation } from "@/components/site/home/MainNavigation";
import { NavigationFooter } from "@/components/site/home/NavigationFooter";

import type { Metadata } from "next";

const DESCRIPTION =
  "We build custom software, web and mobile apps, AI systems, and data pipelines for small companies, out of New York.";

/**
 * The homepage title is not suffixed, so it opts out of the root layout's
 * "%s — NeuraGul" template with an absolute title.
 */
export const metadata: Metadata = {
  title: { absolute: "NeuraGul — software, web and applied AI, New York" },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: "NeuraGul — software, web and applied AI, New York",
    description: DESCRIPTION,
    url: "https://neuragul.com/",
  },
};

/**
 * The homepage.
 *
 * Section order matters more than usual here: the hero consumes ~4300px of
 * scroll inside its own sticky pin, so everything below it depends on that
 * spacer being present and correctly sized.
 *
 * The layout this is adapted from closed with a social-feed section under the
 * project grid. There is no feed to render, so the page ends on the work and
 * hands off to the footer.
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
      </main>

      <NavigationFooter />
    </>
  );
}
