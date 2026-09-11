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
  PROJECT_AREAS,
  PROJECT_BASELINE,
  PROJECT_BOOKING,
  PROJECT_CANONICAL,
  PROJECT_CTA,
  PROJECT_DESCRIPTION,
  PROJECT_DETAILS,
  PROJECT_FRONT_DOOR,
  PROJECT_HEADER,
  PROJECT_HUB,
  PROJECT_IMAGE_BROOKLYN,
  PROJECT_IMAGE_WEDDINGS,
  PROJECT_INTRO,
  PROJECT_MEDIA_BOOKING,
  PROJECT_MEDIA_HERO,
  PROJECT_OG_IMAGE,
  PROJECT_TITLE,
} from "@/components/site/work/new-york-fine-foods/content";

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
 * `/work/new-york-fine-foods/`.
 *
 * Thirteen blocks:
 *
 *   BlockHeaderProjects (cover: the hero, wordmark, seven-item nav, headline)
 *   → BlockIntroDouble (the brief / the tech stack)
 *   → BlockWysiwyg (Twenty-six pages, from a measured six)   (no image)
 *   → BlockWysiwyg (Ten area pages)        → BlockImageFull (the Brooklyn page, priority)
 *   → BlockWysiwyg (The hub)               → BlockImageFull (the weddings spoke)
 *   → BlockWysiwyg (Booking)               → BlockMediaDoubleQuote (corporate L, contact S)
 *   → BlockWysiwyg (Front door)            → BlockMediaDoubleQuote (the hero capture, video, alone)
 *   → BlockProjectDetails → GeneralCta
 *
 * The composition is argued from the evidence, not from a house rhythm: each
 * prose block is followed by the one image that shows its claim. The
 * baseline section has no image on purpose: the plan is a Markdown file in
 * the repo, and a screenshot of a document would prove nothing the dossier's
 * citation does not. The area section is answered by a real area page; the
 * hub section by a real spoke; the booking section by the corporate page
 * beside the form's first step, the two pages the section is about; the
 * front-door section by the capture of the hero playing, which is the one
 * claim on this page a still cannot carry. The cover is the hero and is NOT
 * repeated in the body (Task 8's duplicate-cover trap); the video's poster is
 * the same frame, which is the point of a poster.
 *
 * `BlockImageFull` appears twice and `BlockMediaDoubleQuote` twice; the
 * source's own project pages run three `BlockImageFull` instances, so neither
 * repetition is new. `BlockImageSlider` is not used (its geometry is solved for
 * 3:4 portraits and a 1600-wide screenshot lands in it as a thumbnail);
 * `BlockMediaDouble` is not used because the page already runs the quote
 * variant twice.
 *
 * `priority` on the Brooklyn shot only: it is the first image after the
 * header's own. The rest lazy-load, which the block does by default.
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
export default function NewYorkFineFoodsPage() {
  return (
    <>
      <MainNavigation />

      {/* `overflow-x: clip` (not hidden) — matches the homepage shell. */}
      <main className="mainContent relative w-full overflow-x-clip bg-white">
        <BlockHeaderProjects {...PROJECT_HEADER} />
        <BlockIntroDouble {...projectIntroTabs(PROJECT_INTRO, PROJECT_DETAILS)} />

        <BlockWysiwyg {...PROJECT_BASELINE} />

        <BlockWysiwyg {...PROJECT_AREAS} />
        <BlockImageFull {...PROJECT_IMAGE_BROOKLYN} priority />

        <BlockWysiwyg {...PROJECT_HUB} />
        <BlockImageFull {...PROJECT_IMAGE_WEDDINGS} />

        <BlockWysiwyg {...PROJECT_BOOKING} />
        <BlockMediaDoubleQuote {...PROJECT_MEDIA_BOOKING} />

        <BlockWysiwyg {...PROJECT_FRONT_DOOR} />
        <BlockMediaDoubleQuote {...PROJECT_MEDIA_HERO} />

        <BlockProjectDetails details={projectDetailsWithoutStack(PROJECT_DETAILS)} />
        <GeneralCta {...PROJECT_CTA} />
      </main>

      <NavigationFooter />

      <JsonLd schema={SCHEMA} />
    </>
  );
}
