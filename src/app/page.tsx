import { BlockIntroGeneral } from "@/components/site/home/BlockIntroGeneral";
import { BlockProjectsHighlight } from "@/components/site/home/BlockProjectsHighlight";
import { HomeHero } from "@/components/site/home/HomeHero";
import { MainNavigation } from "@/components/site/home/MainNavigation";
import { NavigationFooter } from "@/components/site/home/NavigationFooter";

import type { Metadata } from "next";

/*
  155 characters, which is inside the ~160 Google renders on desktop before it
  truncates. It leads with the entity and the city because a homepage snippet
  is read by people who do not yet know the name, then names the five service
  lines in the words people search for ("web apps", "iOS and Android apps",
  "AI systems", "data pipelines") rather than in the nav's short labels, and
  closes on an action.
*/
const DESCRIPTION =
  "NeuraGul is a New York software development team building custom web apps, iOS and Android apps, AI systems and data pipelines for small companies.";

/**
 * The homepage title is not suffixed, so it opts out of the root layout's
 * "%s — NeuraGul" template with an absolute title.
 *
 * Keyword first, brand last: nobody searches "NeuraGul" yet, and the words
 * before the dash are the ones that have to match a query. 55 characters, so
 * it survives Google's ~600px title cap intact.
 */
export const metadata: Metadata = {
  title: { absolute: "Custom Software & AI Development in New York — NeuraGul" },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: "Custom Software & AI Development in New York — NeuraGul",
    description: DESCRIPTION,
    url: "https://neuragul.com/",
    /*
      Stated explicitly, not inherited. A route's `openGraph` object REPLACES
      the root layout's rather than merging into it, so declaring `title`,
      `description` and `url` here silently dropped the layout's default image
      — this page was sharing with no preview card at all. Every route that
      sets `openGraph` therefore has to set its own image.
    */
    images: [{ url: "/site/images/hero-poster.jpg", width: 1920, height: 1080 }],
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
