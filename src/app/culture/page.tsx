import { MainNavigation } from "@/components/sites/lpas-com-76f4f1fd/root-8a5edab2/MainNavigation";
import { NavigationFooter } from "@/components/sites/lpas-com-76f4f1fd/root-8a5edab2/NavigationFooter";
import { BlockHeaderGeneral } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockHeaderGeneral";
import { BlockImageFull } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockImageFull";
import { BlockImageSlider } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockImageSlider";
import { BlockIntroDouble } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockIntroDouble";
import { GeneralCta } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/GeneralCta";
import {
  CULTURE_FULL_IMAGE,
  CULTURE_GENERAL_CTA,
  CULTURE_HEADER_HIGHLIGHT_CAPTION,
  CULTURE_HEADER_HIGHLIGHT_IMAGE,
  CULTURE_HEADER_IMAGE,
  CULTURE_HEADER_TITLE,
  CULTURE_INTRO_BODY,
  CULTURE_INTRO_LABELS,
  CULTURE_INTRO_STATEMENT,
  CULTURE_SLIDER_IMAGES,
} from "@/components/sites/lpas-com-76f4f1fd/culture-76031cc1/content";

import type { Metadata } from "next";

/**
 * The source serves no `<meta name="description">` on this route (CONTENT.json
 * records `metaDescription: null`), so none is invented here. The title comes
 * through the root layout's "%s - LPAS Architecture" template, which reproduces
 * the served "Culture - LPAS Architecture" exactly.
 */
export const metadata: Metadata = {
  title: "Culture",
  alternates: { canonical: "/culture/" },
  openGraph: {
    title: "Culture - LPAS Architecture",
    url: "https://lpas.com/culture/",
  },
};

/**
 * lpas.com `/culture/` clone.
 *
 * Block sequence measured from the live page:
 *   BlockHeaderGeneral → BlockIntroDouble → BlockImageSlider → BlockImageFull
 *   → GeneralCta
 *
 * No spacing overrides are passed: every block already carries the source's own
 * vertical rhythm (the header's 100px bottom margin, the intro's 50/60,
 * the slider's 120, the full image's 100/120 and the CTA's 100/120), so the
 * page stays a pure composition.
 *
 * `BlockHeaderGeneral` gets no `intro` — /culture/ is the instance that ships
 * that wrapper empty, which collapses its grid row to 0px and hands the slack
 * to the highlight row (measured `415px 0px 140px`). And no `buttonHref`: the
 * source's circle is a scroll-to `<button>` with no target, not a link.
 */
export default function CulturePage() {
  return (
    <>
      <MainNavigation />

      {/* `overflow-x: clip` (not hidden) — matches the homepage shell; the
          slider and the full-bleed image both overflow the main column. */}
      <main className="mainContent relative w-full overflow-x-clip bg-white">
        <BlockHeaderGeneral
          title={CULTURE_HEADER_TITLE}
          highlightImage={CULTURE_HEADER_HIGHLIGHT_IMAGE}
          highlightCaption={CULTURE_HEADER_HIGHLIGHT_CAPTION}
          image={CULTURE_HEADER_IMAGE}
        />
        <BlockIntroDouble
          labels={CULTURE_INTRO_LABELS}
          statement={CULTURE_INTRO_STATEMENT}
          body={CULTURE_INTRO_BODY}
        />
        <BlockImageSlider images={CULTURE_SLIDER_IMAGES} />
        <BlockImageFull image={CULTURE_FULL_IMAGE} />
        {/* The preset comes from `shared/blocks/content-presets.ts` (a plain
            module), never from `GeneralCta.tsx` itself — that block is
            `"use client"`, so its non-component exports reach a server
            component as client-reference proxies and spread to undefined.
            See the note in culture-76031cc1/content.ts. */}
        <GeneralCta {...CULTURE_GENERAL_CTA} />
      </main>

      <NavigationFooter />
    </>
  );
}
