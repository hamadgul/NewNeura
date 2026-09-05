import { MainNavigation } from "@/components/site/home/MainNavigation";
import { NavigationFooter } from "@/components/site/home/NavigationFooter";
import { JsonLd } from "@/components/site/shared/JsonLd";
import { BlockHeaderGeneral } from "@/components/site/shared/blocks/BlockHeaderGeneral";
import { BlockImageFull } from "@/components/site/shared/blocks/BlockImageFull";
import { BlockImageSlider } from "@/components/site/shared/blocks/BlockImageSlider";
import { BlockIntroDouble } from "@/components/site/shared/blocks/BlockIntroDouble";
import { BlockWysiwyg } from "@/components/site/shared/blocks/BlockWysiwyg";
import { GeneralCta } from "@/components/site/shared/blocks/GeneralCta";
import {
  META,
  PROCESS_FULL_IMAGE,
  PROCESS_GENERAL_CTA,
  PROCESS_HEADER,
  PROCESS_INTRO,
  PROCESS_SLIDER_IMAGES,
  PROCESS_STEPS,
} from "@/components/site/process/content";

import { abs, breadcrumbSchema, ORG_ID, WEBSITE_ID } from "@/lib/seo";

import type { Metadata } from "next";

/**
 * `title` is the bare stem, so the root layout's "%s — NeuraGul" template
 * produces "How we work — NeuraGul". `openGraph.title` does not inherit that
 * template, so the resolved string is spelled out.
 */
export const metadata: Metadata = {
  title: META.title,
  description: META.description,
  alternates: { canonical: META.canonical },
  openGraph: {
    title: `${META.title} — NeuraGul`,
    description: META.description,
    url: `https://neuragul.com${META.canonical}`,
    /*
      Stated explicitly, not inherited. A route's `openGraph` object REPLACES
      the root layout's rather than merging into it, so declaring `title`,
      `description` and `url` here silently dropped the layout's default image
      — this page was sharing with no preview card at all. Every route that
      sets `openGraph` therefore has to set its own image.
    */
    images: [{ url: PROCESS_HEADER.image.src, width: PROCESS_HEADER.image.width, height: PROCESS_HEADER.image.height }],
  },
};

/**
 * `WebPage` + `BreadcrumbList`.
 *
 * Deliberately not `HowTo`. That type describes instructions the *reader*
 * follows, and this page describes what we do; Google also dropped `HowTo` rich
 * results entirely in 2023, so mistyping it would buy nothing and misdescribe
 * the page.
 */
const SCHEMA = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: META.title,
    description: META.description,
    url: abs(META.canonical),
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
  },
  breadcrumbSchema([{ name: "How we work", href: META.canonical }]),
];

/**
 * `/process/` — how we work.
 *
 * Block sequence:
 *   BlockHeaderGeneral → BlockIntroDouble → BlockWysiwyg → BlockImageSlider
 *   → BlockImageFull → GeneralCta
 *
 * The wysiwyg is the one addition to the sequence this route inherited, and it
 * is the page's spine: the four-step engagement, in full, in the block's
 * `<strong>` lead-in shape. See the note in `content.ts` for why the four steps
 * are not fed to `BlockProcessCardSlider` — its card body is clamped to three
 * lines and its per-phase artwork is a required portrait we do not have.
 *
 * No spacing overrides are passed: every block already carries its own vertical
 * rhythm (the header's 100px bottom margin, the intro's 50/60, the wysiwyg's
 * 50/60, the slider's 120, the full image's 100/120 and the CTA's 100/120), so
 * the page stays a pure composition.
 */
export default function ProcessPage() {
  return (
    <>
      {/* `BlockHeaderGeneral` is a flat #ececec at every breakpoint, so the
          wordmark takes the header's own ink rather than white. */}
      <MainNavigation tone="dark" />

      {/* `overflow-x: clip` (not hidden) — matches the homepage shell; the
          slider and the full-bleed image both overflow the main column. */}
      <main className="mainContent relative w-full overflow-x-clip bg-white">
        <BlockHeaderGeneral {...PROCESS_HEADER} />
        <BlockIntroDouble {...PROCESS_INTRO} />
        <BlockWysiwyg {...PROCESS_STEPS} />
        <BlockImageSlider images={PROCESS_SLIDER_IMAGES} />
        <BlockImageFull image={PROCESS_FULL_IMAGE} />
        {/* The CTA preset is declared in this route's own `content.ts`, never in
            `GeneralCta.tsx`: that block is `"use client"`, so its non-component
            exports reach a server component as client-reference proxies and
            spread to undefined. The old `shared/blocks/content-presets.ts` this
            used to come from no longer exists. */}
        <GeneralCta {...PROCESS_GENERAL_CTA} />
      </main>

      <NavigationFooter />

      <JsonLd schema={SCHEMA} />
    </>
  );
}
