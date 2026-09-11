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
  PROJECT_FRONT_DOOR,
  PROJECT_GUARDS,
  PROJECT_HEADER,
  PROJECT_IMAGE_NYC,
  PROJECT_IMAGE_RENTAL,
  PROJECT_INTRO,
  PROJECT_MEDIA_GUARDS,
  PROJECT_OG_IMAGE,
  PROJECT_OWNER,
  PROJECT_PRICING,
  PROJECT_TITLE,
} from "@/components/site/work/foodtruckrentals/content";

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
 * literally the topics on the page.
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
 * `/work/foodtruckrentals/`.
 *
 * Eleven blocks:
 *
 *   BlockHeaderProjects (cover: the three-photograph hero collage)
 *   → BlockIntroDouble (the brief / the tech stack)
 *   → BlockWysiwyg (One query, one owner)   → BlockImageFull (the NYC owner page, priority)
 *   → BlockWysiwyg (Every price, one file)  → BlockImageFull (the rental page)
 *   → BlockWysiwyg (Guards)                 → BlockMediaDoubleQuote (contact L, work S)
 *   → BlockWysiwyg (Three trucks at once)   (no image: the cover is the hero)
 *   → BlockProjectDetails → GeneralCta
 *
 * The composition is argued from the evidence outward: each prose block is
 * followed by the one frame that shows its claim. The owner section is
 * answered by the owner page itself (its breadcrumb and H1 are the thing the
 * test protects); the pricing section by the rental page, whose lead and
 * service-area row are rendered from the module; the guards section by the
 * contact page (the 48-hour promise, no telephone in the frame) beside the
 * work index (seven case studies from one template), with the quote as the
 * small frame's caption. The front-door section has no body image on
 * purpose: the frozen cover IS the hero at HEAD, and the 2026-09-04 home
 * capture is the same frame, so repeating it would be Task 8's
 * duplicate-cover trap. The copy says "the frame at the top of this page".
 *
 * `BlockImageFull` appears twice and `BlockMediaDoubleQuote` once.
 * `BlockImageSlider` is not used (its geometry is solved for 3:4 portraits and
 * a 1600-wide screenshot lands in it as a thumbnail); `BlockMediaDouble` is
 * not used because the quote variant carries the caption the small frame needs.
 *
 * `priority` on the NYC shot only: it is the first image after the header's
 * own. The rest lazy-load, which the blocks do by default.
 *
 * `GeneralCta` closes the page and points at `/contact/`.
 *
 * Client-boundary note: every constant above comes from this project's plain
 * `content.ts`. `BlockWysiwyg`, `BlockIntroDouble`, `BlockMediaDoubleQuote` and
 * `GeneralCta` all carry `"use client"`, so a VALUE imported from one of them
 * would reach this server component as a client-reference proxy and spread to
 * undefined props with no type or build error. Only their TYPES cross that
 * boundary, and they do it in `content.ts`.
 */
export default function FoodTruckRentalsPage() {
  return (
    <>
      <MainNavigation />

      {/* `overflow-x: clip` (not hidden) — matches the homepage shell. */}
      <main className="mainContent relative w-full overflow-x-clip bg-white">
        <BlockHeaderProjects {...PROJECT_HEADER} />
        <BlockIntroDouble {...projectIntroTabs(PROJECT_INTRO, PROJECT_DETAILS)} />

        <BlockWysiwyg {...PROJECT_OWNER} />
        <BlockImageFull {...PROJECT_IMAGE_NYC} priority />

        <BlockWysiwyg {...PROJECT_PRICING} />
        <BlockImageFull {...PROJECT_IMAGE_RENTAL} />

        <BlockWysiwyg {...PROJECT_GUARDS} />
        <BlockMediaDoubleQuote {...PROJECT_MEDIA_GUARDS} />

        <BlockWysiwyg {...PROJECT_FRONT_DOOR} />

        <BlockProjectDetails details={projectDetailsWithoutStack(PROJECT_DETAILS)} />
        <GeneralCta {...PROJECT_CTA} />
      </main>

      <NavigationFooter />

      <JsonLd schema={SCHEMA} />
    </>
  );
}
