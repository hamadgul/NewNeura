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
  PROJECT_IMAGE_MEASURE,
  PROJECT_INTRO,
  PROJECT_LOOKUP,
  PROJECT_MEASURE,
  PROJECT_MEDIA_QUOTE,
  PROJECT_OG_IMAGE,
  PROJECT_OUTCOME,
  PROJECT_RATES,
  PROJECT_SOLVER,
  PROJECT_TITLE,
} from "@/components/site/work/packship/content";

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
 * `/work/packship/`.
 *
 * Eleven blocks:
 *
 *   BlockHeaderProjects (cover: the solve and the rates)
 *   → BlockIntroDouble (the brief / the tech stack)
 *   → BlockWysiwyg (Outcome) → BlockWysiwyg (Finding the box)
 *   → BlockWysiwyg (Three carriers, one list)
 *   → BlockWysiwyg (Getting the dimensions in) → BlockImageFull (form + AR measure)
 *   → BlockWysiwyg (Looking an item up, and keeping it)
 *   → BlockMediaDoubleQuote (library L, lookup S, the lookup screen's own note)
 *   → BlockProjectDetails → GeneralCta
 *
 * The composition is argued from the evidence outward. The frozen cover is
 * two phones: the Optimal Box Size screen (the solver's result, 94.5% fill)
 * and the Shipping Estimate screen (the sorted, cheapest-and-fastest-marked
 * rate list). Those are the two screens the "Finding the box" and "Three
 * carriers" sections are evidence for, so those two sections sit directly
 * under the intro, nearest the cover, and neither screen is repeated in the
 * body (Task 8's duplicate-cover trap). "Outcome" names both screens so the
 * reader knows to look up. The cost is four `BlockWysiwyg`s in a row before
 * the first body image; the alternative — a body copy of either cover
 * screen — is the same picture twice within one scroll.
 *
 * The two body images are then placed beside the sentences they prove: the
 * form + AR frame under "Getting the dimensions in" (the three entry points
 * and the LiDAR measurement), and the library frame + lookup portrait under
 * "Looking an item up, and keeping it". The lookup takes the SMALL slot of
 * `BlockMediaDoubleQuote` because it is a raw portrait phone screenshot and
 * that slot is where the site already puts one (`conversion.png` on the
 * mechanic page); the quote under it is the screen's own on-screen note.
 *
 * Why these are not captures: PackShip is an Expo app with no web build, so
 * nothing could be booted for the runner. Every frame is one of the app's own
 * committed device screenshots on the cover's own ground and card; see
 * `content.ts` and `scripts/shots/packship.config.mjs`.
 *
 * `BlockImageSlider` is not used (struck from the case-study vocabulary).
 * `BlockMediaDouble` is not used either: the page already runs the quote
 * variant, and the two read as near-identical bands.
 *
 * `BlockImageFull` gets `priority`: it is the first image after the header's
 * own. `GeneralCta` closes the page; before this task it ended on the details
 * table.
 *
 * Client-boundary note: every constant above comes from this project's plain
 * `content.ts`. `BlockWysiwyg`, `BlockIntroDouble`, `BlockMediaDoubleQuote` and
 * `GeneralCta` all carry `"use client"`, so a VALUE imported from one of them
 * would reach this server component as a client-reference proxy and spread to
 * undefined props with no type or build error. Only their TYPES cross that
 * boundary, and they do it in `content.ts`.
 */
export default function PackShipPage() {
  return (
    <>
      <MainNavigation />

      {/* `overflow-x: clip` (not hidden) — matches the homepage shell. */}
      <main className="mainContent relative w-full overflow-x-clip bg-white">
        <BlockHeaderProjects {...PROJECT_HEADER} />
        <BlockIntroDouble {...projectIntroTabs(PROJECT_INTRO, PROJECT_DETAILS)} />

        <BlockWysiwyg {...PROJECT_OUTCOME} />
        <BlockWysiwyg {...PROJECT_SOLVER} />
        <BlockWysiwyg {...PROJECT_RATES} />

        <BlockWysiwyg {...PROJECT_MEASURE} />
        <BlockImageFull {...PROJECT_IMAGE_MEASURE} priority />

        <BlockWysiwyg {...PROJECT_LOOKUP} />
        <BlockMediaDoubleQuote {...PROJECT_MEDIA_QUOTE} />

        <BlockProjectDetails details={projectDetailsWithoutStack(PROJECT_DETAILS)} />
        <GeneralCta {...PROJECT_CTA} />
      </main>

      <NavigationFooter />

      <JsonLd schema={SCHEMA} />
    </>
  );
}
