import {
  HEADER,
  INTRO,
  META,
  PROCESS,
  PROJECTS,
  WYSIWYG_CAPABILITIES,
  WYSIWYG_HOW,
} from "@/components/site/services/app-development/content";
import { MainNavigation } from "@/components/site/home/MainNavigation";
import { NavigationFooter } from "@/components/site/home/NavigationFooter";
import { BlockHeaderServices, SERVICE_TONE } from "@/components/site/shared/blocks/BlockHeaderServices";
import { BlockIntroDouble } from "@/components/site/shared/blocks/BlockIntroDouble";
import { BlockProcessCardSlider } from "@/components/site/shared/blocks/BlockProcessCardSlider";
import { BlockProjectsHighlight } from "@/components/site/shared/blocks/BlockProjectsHighlight";
import { BlockWysiwyg } from "@/components/site/shared/blocks/BlockWysiwyg";

import type { Metadata } from "next";

/**
 * `title` is plain rather than absolute, so the root layout's "%s — NeuraGul"
 * template supplies the suffix. `description` is the mobile half of the
 * source's `web-mobile` promise line.
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
 * `/services/app-development/` — the App Development service page.
 *
 * Six blocks: `BlockHeaderServices` → `BlockIntroDouble` →
 * `BlockProcessCardSlider` → `BlockWysiwyg` → `BlockWysiwyg` →
 * `BlockProjectsHighlight`.
 *
 * Unlike `/services/applied-ai/`, this page *does* pin the process slider. That
 * pin is `position: sticky`, which is killed by any ancestor with `overflow:
 * hidden` or `auto` — so `<main>` keeps `overflow-x: clip`, which creates no
 * scroll container and leaves the sticky positioning intact.
 *
 * All copy lives in `content.ts` so this shell stays identical across the
 * sibling service routes.
 */
export default function AppDevelopmentPage() {
  return (
    <>
      {/* The wordmark sits on this page's accent ground, so it reads the
          same tone table the header does — a light accent gets dark type. */}
      <MainNavigation tone={SERVICE_TONE[HEADER.service]} service={HEADER.service} />

      {/* `overflow-x: clip` (not hidden) — matches the homepage shell, and is
          what lets the process slider's sticky pin survive. */}
      <main className="mainContent relative w-full overflow-x-clip bg-white">
        <BlockHeaderServices {...HEADER} />
        <BlockIntroDouble {...INTRO} />
        <BlockProcessCardSlider {...PROCESS} />
        <BlockWysiwyg {...WYSIWYG_CAPABILITIES} />
        <BlockWysiwyg {...WYSIWYG_HOW} />
        <BlockProjectsHighlight {...PROJECTS} />
      </main>

      <NavigationFooter />
    </>
  );
}
