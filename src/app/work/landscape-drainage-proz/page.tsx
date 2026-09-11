import { MainNavigation } from "@/components/site/home/MainNavigation";
import { NavigationFooter } from "@/components/site/home/NavigationFooter";
import { JsonLd } from "@/components/site/shared/JsonLd";
import { BlockHeaderProjects } from "@/components/site/shared/blocks/BlockHeaderProjects";
import { BlockImageFull } from "@/components/site/shared/blocks/BlockImageFull";
import { BlockIntroDouble } from "@/components/site/shared/blocks/BlockIntroDouble";
import {
  projectDetailsWithoutStack,
  projectIntroTabs,
} from "@/components/site/shared/blocks/projectIntroTabs";
import { BlockMediaDoubleQuote } from "@/components/site/shared/blocks/BlockMediaDoubleQuote";
import { BlockProjectDetails } from "@/components/site/shared/blocks/BlockProjectDetails";
import { BlockWysiwyg } from "@/components/site/shared/blocks/BlockWysiwyg";
import { GeneralCta } from "@/components/site/shared/blocks/GeneralCta";
import {
  PROJECT_CANONICAL,
  PROJECT_CTA,
  PROJECT_DESCRIPTION,
  PROJECT_DETAILS,
  PROJECT_HEADER,
  PROJECT_IMAGE_DRAINAGE,
  PROJECT_INTRO,
  PROJECT_MEASUREMENT,
  PROJECT_MEDIA_QUOTE,
  PROJECT_OG_IMAGE,
  PROJECT_QUOTE,
  PROJECT_SEARCH,
  PROJECT_STOREFRONT,
  PROJECT_TITLE,
} from "@/components/site/work/landscape-drainage-proz/content";

import { breadcrumbSchema, caseStudySchema } from "@/lib/seo";

import type { Metadata } from "next";

/**
 * `title` is the plain stem, so the root layout's "%s — NeuraGul" template
 * supplies the suffix. Both `PROJECT_TITLE` and `PROJECT_DESCRIPTION` are
 * search-facing strings that appear nowhere on the page — the `<h1>` and the
 * brief are separate constants. See their notes in `content.ts`.
 */
export const metadata: Metadata = {
  title: PROJECT_TITLE,
  description: PROJECT_DESCRIPTION,
  alternates: { canonical: PROJECT_CANONICAL },
  openGraph: {
    title: `${PROJECT_TITLE} — NeuraGul`,
    description: PROJECT_DESCRIPTION,
    url: `https://neuragul.com${PROJECT_CANONICAL}`,
    images: [PROJECT_OG_IMAGE],
  },
};

/**
 * `CreativeWork` + `BreadcrumbList`.
 *
 * `about` is split off `PROJECT_HEADER.service` — the same dot-separated
 * service line printed in the page header — so the topics in the data are
 * literally the topics on the page, and adding a service to one adds it to the
 * other.
 *
 * The breadcrumb is what earns this page a `neuragul.com › Work › <project>`
 * trail in place of a raw URL in the result.
 */
const SCHEMA = [
  caseStudySchema({
    name: PROJECT_HEADER.title,
    description: PROJECT_DESCRIPTION,
    href: PROJECT_CANONICAL,
    image: PROJECT_OG_IMAGE,
    about: PROJECT_HEADER.service.split(" · "),
  }),
  breadcrumbSchema([
    { name: "Work", href: "/work/" },
    { name: PROJECT_HEADER.title, href: PROJECT_CANONICAL },
  ]),
];

/**
 * `/work/landscape-drainage-proz/`.
 *
 * Ten blocks:
 *
 *   BlockHeaderProjects (cover: the live home page, blue Custom Liquid strip and all)
 *   → BlockIntroDouble (the brief / the tech stack)
 *   → BlockWysiwyg (Dawn, with two sections written by hand) → BlockImageFull (Drainage Solutions)
 *   → BlockWysiwyg (The buyer who will never use the cart)  → BlockMediaDoubleQuote (municipal L, FAQ S)
 *   → BlockWysiwyg (Seven conversion labels on eleven events)  (no image: a JSON config in a <script>)
 *   → BlockWysiwyg (Structured data on every route)            (no image: JSON-LD does not render)
 *   → BlockProjectDetails → GeneralCta
 *
 * The composition is argued from the evidence outward: each prose block is
 * followed by the one frame that shows its claim. The storefront section is
 * answered by the collection whose `7 products` is half of the "counts add up"
 * sentence. The quote-path section is answered by the municipal page beside
 * the FAQ page, with the quote as the small frame's caption. The measurement
 * and search sections have no frame: their evidence is a web-pixel config and
 * JSON-LD, neither of which paints. The cover is not repeated in the body
 * (Task 8's duplicate-cover trap); the storefront copy says "the frame at the
 * top of this page" for the strip.
 *
 * `BlockMediaDoubleQuote` appears once and `BlockImageFull` once.
 * `BlockImageSlider` is not used (its geometry is solved for 3:4 portraits and
 * a 1600-wide screenshot lands in it as a thumbnail); `BlockMediaDouble` is
 * not used because the quote variant carries the caption the small frame needs.
 *
 * The 2026-09-07 page had three blocks (header, intro, details) and one asset;
 * this project has no local source, so every added sentence is traced to the
 * live store in `content.ts` and the dossier. `GeneralCta` closes the page and
 * points at `/contact/`.
 *
 * Client-boundary note: every constant above comes from this project's plain
 * `content.ts`. `BlockWysiwyg`, `BlockIntroDouble`, `BlockMediaDoubleQuote` and
 * `GeneralCta` all carry `"use client"`, so a VALUE imported from one of them
 * would reach this server component as a client-reference proxy and spread to
 * undefined props with no type or build error. Only their TYPES cross that
 * boundary, and they do it in `content.ts`.
 */
export default function LandscapeDrainageProzPage() {
  return (
    <>
      <MainNavigation />

      {/* `overflow-x: clip` (not hidden) — matches the homepage shell. */}
      <main className="mainContent relative w-full overflow-x-clip bg-white">
        <BlockHeaderProjects {...PROJECT_HEADER} />
        <BlockIntroDouble {...projectIntroTabs(PROJECT_INTRO, PROJECT_DETAILS)} />

        <BlockWysiwyg {...PROJECT_STOREFRONT} />
        <BlockImageFull {...PROJECT_IMAGE_DRAINAGE} />

        <BlockWysiwyg {...PROJECT_QUOTE} />
        <BlockMediaDoubleQuote {...PROJECT_MEDIA_QUOTE} />

        <BlockWysiwyg {...PROJECT_MEASUREMENT} />

        <BlockWysiwyg {...PROJECT_SEARCH} />

        <BlockProjectDetails details={projectDetailsWithoutStack(PROJECT_DETAILS)} />
        <GeneralCta {...PROJECT_CTA} />
      </main>

      <NavigationFooter />

      <JsonLd schema={SCHEMA} />
    </>
  );
}
