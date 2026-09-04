import {
  HEADER,
  INTRO,
  META,
  PROCESS,
  PROJECTS,
  WYSIWYG_WHEN_IT_HELPS,
  WYSIWYG_WHO_ITS_FOR,
} from "@/components/site/services/applied-ai-strategy/content";
import { MainNavigation } from "@/components/site/home/MainNavigation";
import { NavigationFooter } from "@/components/site/home/NavigationFooter";
import { BlockHeaderServices, SERVICE_TONE } from "@/components/site/shared/blocks/BlockHeaderServices";
import { BlockIntroDouble } from "@/components/site/shared/blocks/BlockIntroDouble";
import { BlockProcessCardSlider } from "@/components/site/shared/blocks/BlockProcessCardSlider";
import { BlockProjectsHighlight } from "@/components/site/shared/blocks/BlockProjectsHighlight";
import { BlockWysiwyg } from "@/components/site/shared/blocks/BlockWysiwyg";

import type { Metadata } from "next";

/**
 * `title` is the bare page name so the root layout's "%s — NeuraGul" template
 * supplies the suffix. `openGraph.title` does not inherit that template, so the
 * resolved string is spelled out there.
 */
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
 * `/services/applied-ai/strategy/` — the first of the four Applied AI children.
 *
 * Six blocks:
 * `BlockHeaderServices` → `BlockIntroDouble` → `BlockProcessCardSlider` →
 * `BlockWysiwyg` → `BlockWysiwyg` → `BlockProjectsHighlight`.
 *
 * Note the **two** rich-text blocks: the `/agents/` sibling has only one. The
 * four children do not agree on this, so the count is per page and never
 * assumed.
 *
 * Unlike the parent `/services/applied-ai/`, every child pins a process
 * carousel between the intro and the rich text.
 */
export default function AppliedAiStrategyPage() {
  return (
    <>
      {/* The wordmark sits on this page's accent ground, so it reads the
          same tone table the header does — a light accent gets dark type. */}
      <MainNavigation tone={SERVICE_TONE[HEADER.service]} />

      {/*
        `overflow-x: clip` (not hidden/auto) — matches the homepage shell, and
        is load-bearing here: `BlockProcessCardSlider`'s pin is a
        `position: sticky` section, which is silently disabled by any ancestor
        with `overflow` of `hidden` or `auto`. `clip` establishes no scroll
        container, so the pin survives.
      */}
      <main className="mainContent relative w-full overflow-x-clip bg-white">
        <BlockHeaderServices {...HEADER} />
        <BlockIntroDouble {...INTRO} />
        <BlockProcessCardSlider {...PROCESS} />
        <BlockWysiwyg {...WYSIWYG_WHEN_IT_HELPS} />
        <BlockWysiwyg {...WYSIWYG_WHO_ITS_FOR} />
        <BlockProjectsHighlight {...PROJECTS} />
      </main>

      <NavigationFooter />
    </>
  );
}
