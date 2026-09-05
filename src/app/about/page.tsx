import {
  ABOUT_HEADER,
  ABOUT_INTRO,
  ABOUT_MEDIA,
  ABOUT_WYSIWYG,
  META,
} from "@/components/site/about/content";
import { MainNavigation } from "@/components/site/home/MainNavigation";
import { NavigationFooter } from "@/components/site/home/NavigationFooter";
import { JsonLd } from "@/components/site/shared/JsonLd";
import { BlockHeaderGeneral } from "@/components/site/shared/blocks/BlockHeaderGeneral";
import { BlockIntroDouble } from "@/components/site/shared/blocks/BlockIntroDouble";
import { BlockMediaDoubleQuote } from "@/components/site/shared/blocks/BlockMediaDoubleQuote";
import { BlockWysiwyg } from "@/components/site/shared/blocks/BlockWysiwyg";

import { abs, breadcrumbSchema, ORG_ID, WEBSITE_ID } from "@/lib/seo";

import type { Metadata } from "next";

/**
 * `title` is the bare stem, so the root layout's "%s — NeuraGul" template
 * produces "About — NeuraGul". `openGraph.title` does not inherit that template,
 * so the resolved string is spelled out.
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
    images: [{ url: ABOUT_HEADER.image.src, width: ABOUT_HEADER.image.width, height: ABOUT_HEADER.image.height }],
  },
};

/**
 * `AboutPage` + `BreadcrumbList`.
 *
 * `mainEntity` points at the organization declared in the root layout rather
 * than describing it again. That is the specific signal an about page exists to
 * send: this URL is the authoritative page *about* that entity, which is what
 * Google looks for when deciding which page to attach to a knowledge panel.
 */
const SCHEMA = [
  {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: META.title,
    description: META.description,
    url: abs(META.canonical),
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: { "@id": ORG_ID },
  },
  breadcrumbSchema([{ name: "About", href: META.canonical }]),
];

/**
 * `/about/` — who you'd be working with.
 *
 * Four blocks:
 *   BlockHeaderGeneral → BlockIntroDouble → BlockMediaDoubleQuote → BlockWysiwyg
 *
 * The layout this route is adapted from closed with a `CollectionTeam` grid of
 * 38 faces. That block is deleted: there are no photographs of the people here,
 * and a grid padded out to fill the row would be furniture rather than content.
 * Nothing replaces it — the compensation is that `BlockWysiwyg` carries three
 * paragraphs instead of the single one the original instance shipped, so the
 * page still ends on substance.
 *
 * All copy lives in `content.ts`. That matters beyond tidiness here:
 * `BlockWysiwyg` is a `"use client"` module, so a *value* imported from it into
 * this server component would arrive as a client-reference proxy and spread to
 * `undefined` (the page would die at prerender on `body.map`). `content.ts` has
 * no `"use client"`, so its exports stay real values in the server graph.
 */
export default function AboutPage() {
  return (
    <>
      {/* `BlockHeaderGeneral` is a flat #ececec at every breakpoint, so the
          wordmark takes the header's own ink rather than white. */}
      <MainNavigation tone="dark" />

      {/* `overflow-x: clip` (not hidden) — matches the homepage shell. */}
      <main className="mainContent relative w-full overflow-x-clip bg-white">
        <BlockHeaderGeneral {...ABOUT_HEADER} />
        <BlockIntroDouble {...ABOUT_INTRO} />
        <BlockMediaDoubleQuote {...ABOUT_MEDIA} />
        <BlockWysiwyg {...ABOUT_WYSIWYG} />
      </main>

      <NavigationFooter />

      <JsonLd schema={SCHEMA} />
    </>
  );
}
