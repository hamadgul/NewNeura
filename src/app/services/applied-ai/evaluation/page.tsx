import {
  HEADER,
  INTRO,
  META,
  PROCESS,
  PROJECTS,
  WYSIWYG_AFTER_LAUNCH,
  WYSIWYG_GUARDRAILS,
} from "@/components/site/services/applied-ai-evaluation/content";
import { MainNavigation } from "@/components/site/home/MainNavigation";
import { NavigationFooter } from "@/components/site/home/NavigationFooter";
import { BlockHeaderServices } from "@/components/site/shared/blocks/BlockHeaderServices";
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
 * `/services/applied-ai/evaluation/` — the last of the four Applied AI
 * children.
 *
 * Six blocks:
 * `BlockHeaderServices` → `BlockIntroDouble` → `BlockProcessCardSlider` →
 * `BlockWysiwyg` → `BlockWysiwyg` → `BlockProjectsHighlight`.
 *
 * Unlike the parent `/services/applied-ai/`, a child pins the process slider
 * between the intro and the rich text. That pin is `position: sticky` inside
 * the block's own wrapper, which dies the moment an ancestor establishes a
 * scroll container — so the shell below must keep `overflow-x: clip` and must
 * never be changed to `hidden`/`auto`.
 *
 * All copy lives in `content.ts`, mirroring the parent page's split.
 */
export default function AppliedAiEvaluationPage() {
  return (
    <>
      <MainNavigation />

      {/*
        `overflow-x: clip` (not `hidden`): `clip` does not create a scroll
        container, so the pinned process slider's `position: sticky` still works.
      */}
      <main className="mainContent relative w-full overflow-x-clip bg-white">
        <BlockHeaderServices {...HEADER} />
        <BlockIntroDouble {...INTRO} />
        <BlockProcessCardSlider {...PROCESS} />
        <BlockWysiwyg {...WYSIWYG_GUARDRAILS} />
        <BlockWysiwyg {...WYSIWYG_AFTER_LAUNCH} />
        <BlockProjectsHighlight {...PROJECTS} />
      </main>

      <NavigationFooter />
    </>
  );
}
