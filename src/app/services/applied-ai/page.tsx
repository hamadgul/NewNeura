import { HEADER, INTRO, META, PROJECTS } from "@/components/site/services/applied-ai/content";
import { MainNavigation } from "@/components/site/home/MainNavigation";
import { NavigationFooter } from "@/components/site/home/NavigationFooter";
import { BlockHeaderServices } from "@/components/site/shared/blocks/BlockHeaderServices";
import { BlockIntroDouble } from "@/components/site/shared/blocks/BlockIntroDouble";
import { BlockProjectsHighlight } from "@/components/site/shared/blocks/BlockProjectsHighlight";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: META.title,
  description: META.description,
  alternates: { canonical: META.canonical },
  openGraph: {
    title: `${META.title} — NeuraGul`,
    description: META.description,
    url: `https://neuragul.com${META.canonical}`,
  },
};

/**
 * `/services/applied-ai/` — the parent Applied AI page.
 *
 * Three blocks: `BlockHeaderServices` → `BlockIntroDouble` →
 * `BlockProjectsHighlight`.
 *
 * Note there is deliberately **no** process-slider block here. The four
 * `/services/applied-ai/<sub>/` pages pin one between the intro and the
 * projects, and so do the four sibling service lines; this parent does not, so
 * the page is a straight three-block stack with nothing pinned and no scroll
 * spacer to account for.
 *
 * All copy lives in `content.ts` so the sibling service routes can reuse this
 * shell verbatim and swap only their content module.
 */
export default function AppliedAiPage() {
  return (
    <>
      <MainNavigation />

      {/* `overflow-x: clip` (not hidden) — matches the homepage shell. */}
      <main className="mainContent relative w-full overflow-x-clip bg-white">
        <BlockHeaderServices {...HEADER} />
        <BlockIntroDouble {...INTRO} />
        <BlockProjectsHighlight {...PROJECTS} />
      </main>

      <NavigationFooter />
    </>
  );
}
