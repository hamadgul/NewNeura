import {
  HEADER,
  INTRO,
  META,
  PROCESS,
  PROJECTS,
  WYSIWYG_CAPABILITIES,
  WYSIWYG_WHY,
} from "@/components/site/services/data-intelligence/content";
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
 * template supplies the suffix. `description` is the source
 * `data-intelligence` service's promise line, verbatim.
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
 * `/services/data-intelligence/` — the Data Intelligence service page.
 *
 * Six blocks: `BlockHeaderServices` → `BlockIntroDouble` →
 * `BlockProcessCardSlider` → `BlockWysiwyg` → `BlockWysiwyg` →
 * `BlockProjectsHighlight`.
 *
 * Structurally identical to `/services/cloud-infrastructure/`; the only
 * rendered difference is the header's ground, which flips to the light
 * `--ng-data-intelligence` (#e3c1aa) and takes #262626 type. That tone comes
 * from the block's own per-service table, so nothing here overrides it.
 *
 * `overflow-x: clip` on `<main>` is deliberate and load-bearing: `clip`
 * establishes no scroll container, so the process slider's `position: sticky`
 * pin still resolves against the viewport. `hidden` (or `auto`) would silently
 * kill the pin and collapse the scroll-scrubbed carousel into a static row.
 *
 * All copy lives in `content.ts` so this shell stays identical across the
 * sibling service routes.
 */
export default function DataIntelligencePage() {
  return (
    <>
      {/* The wordmark sits on this page's accent ground, so it reads the
          same tone table the header does — a light accent gets dark type. */}
      <MainNavigation tone={SERVICE_TONE[HEADER.service]} service={HEADER.service} />

      {/* `overflow-x: clip` (not hidden) — see the note above; the process
          slider's `position: sticky` pin depends on it. */}
      <main className="mainContent relative w-full overflow-x-clip bg-white">
        <BlockHeaderServices {...HEADER} />
        <BlockIntroDouble {...INTRO} />
        <BlockProcessCardSlider {...PROCESS} />
        <BlockWysiwyg {...WYSIWYG_CAPABILITIES} />
        <BlockWysiwyg {...WYSIWYG_WHY} />
        <BlockProjectsHighlight {...PROJECTS} />
      </main>

      <NavigationFooter />
    </>
  );
}
