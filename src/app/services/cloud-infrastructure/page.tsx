import {
  HEADER,
  INTRO,
  META,
  PROCESS,
  PROJECTS,
  WYSIWYG_CAPABILITIES,
  WYSIWYG_IT_SECURITY,
} from "@/components/site/services/cloud-infrastructure/content";
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
 * template supplies the suffix. `description` is the source `cloud` service's
 * promise line, verbatim.
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
 * `/services/cloud-infrastructure/` — the Cloud & Infrastructure service page,
 * which also carries the source's `it-infrastructure` service (it gets no page
 * of its own in this port).
 *
 * Six blocks: `BlockHeaderServices` → `BlockIntroDouble` →
 * `BlockProcessCardSlider` → `BlockWysiwyg` → `BlockWysiwyg` →
 * `BlockProjectsHighlight`.
 *
 * `overflow-x: clip` on `<main>` is deliberate and load-bearing: `clip`
 * establishes no scroll container, so the process slider's `position: sticky`
 * pin still resolves against the viewport. Switching it to `hidden` (or `auto`)
 * would silently kill the pin and collapse the whole scroll-scrubbed carousel
 * into a static row.
 *
 * All copy lives in `content.ts` so this shell stays identical across the
 * sibling service routes.
 */
export default function CloudInfrastructurePage() {
  return (
    <>
      {/* The wordmark sits on this page's accent ground, so it reads the
          same tone table the header does — a light accent gets dark type. */}
      <MainNavigation tone={SERVICE_TONE[HEADER.service]} />

      {/* `overflow-x: clip` (not hidden) — see the note above; the process
          slider's `position: sticky` pin depends on it. */}
      <main className="mainContent relative w-full overflow-x-clip bg-white">
        <BlockHeaderServices {...HEADER} />
        <BlockIntroDouble {...INTRO} />
        <BlockProcessCardSlider {...PROCESS} />
        <BlockWysiwyg {...WYSIWYG_CAPABILITIES} />
        <BlockWysiwyg {...WYSIWYG_IT_SECURITY} />
        <BlockProjectsHighlight {...PROJECTS} />
      </main>

      <NavigationFooter />
    </>
  );
}
