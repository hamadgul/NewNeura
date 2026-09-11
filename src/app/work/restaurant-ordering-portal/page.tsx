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
  PROJECT_BACK_OFFICE,
  PROJECT_CANONICAL,
  PROJECT_CTA,
  PROJECT_DESCRIPTION,
  PROJECT_DETAILS,
  PROJECT_HEADER,
  PROJECT_IMAGE_CHECKOUT,
  PROJECT_INTRO,
  PROJECT_MEDIA_BACK_OFFICE,
  PROJECT_MEDIA_SETTINGS,
  PROJECT_OG_IMAGE,
  PROJECT_ORDER_PATH,
  PROJECT_OUTCOME,
  PROJECT_SETTINGS,
  PROJECT_TITLE,
} from "@/components/site/work/restaurant-ordering-portal/content";

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
 * `/work/restaurant-ordering-portal/`.
 *
 * Eleven blocks:
 *
 *   BlockHeaderProjects → BlockIntroDouble (the brief / the tech stack)
 *   → BlockWysiwyg (Outcome) → BlockWysiwyg (From the menu to the kitchen)
 *   → BlockImageFull (checkout) → BlockWysiwyg (The back office)
 *   → BlockMediaDoubleQuote (orders, menu visibility)
 *   → BlockWysiwyg (Changes without a developer)
 *   → BlockMediaDoubleQuote (settings, integrations)
 *   → BlockProjectDetails → GeneralCta
 *
 * Argued from the evidence, not from a house rhythm: after the outcome, each
 * prose section is followed by the screen that shows its claim running. The
 * order's path is answered by the checkout; the back office by the Orders
 * feed with its open/closed switch and by Menu Visibility's "1 hidden"; the
 * settings layer by the Settings page's "Last updated by" lines and the
 * Integrations page's masked token.
 *
 * The storefront — the menu itself — is the header's own full-bleed image
 * rather than a block, because it is this project's frozen cover (shared with
 * `/`, `/about/`, `/services/cloud-infrastructure/` and `/process/`). It is
 * not repeated in the body: the duplicate-cover trap Task 8 hit was visible
 * only on the rendered page.
 *
 * `BlockMediaDoubleQuote` appears twice, deliberately. Each of the two admin
 * sections has one primary screen and one secondary screen whose own on-screen
 * sentence is the section's proof, and that block is the one with a quote slot
 * pinned under the small image. `BlockMediaDouble` (no quote) would have made
 * the two bands read as near-identical without the sentence that justifies
 * the second image; `BlockImageSlider` is not used — its geometry is solved for
 * 3:4 portraits at three across, and a 1600x1000 screenshot lands in it as a
 * ~473x296 thumbnail. Two adjacent `BlockWysiwyg`s at the top are the shipped
 * pattern (Task 8 and the service pages): "Outcome" is pinned above all media
 * by the constraint below.
 *
 * Ordering constraint: `PROJECT_OUTCOME` ends on "the screenshots below run
 * against a Square sandbox", so it has to stay above every media block. That
 * sentence is also a promise the capture config keeps — see `content.ts` and
 * `scripts/shots/restaurant-ordering-portal.config.mjs`.
 *
 * `BlockImageFull` gets `priority` on the checkout only: it is the first image
 * after the header's own. The media blocks lazy-load by default.
 *
 * `GeneralCta` closes the page: a case study with no call to action ends on a
 * spec table. Its line is this reader's own situation.
 *
 * Client-boundary note: every constant above comes from this project's plain
 * `content.ts`. `BlockWysiwyg`, `BlockIntroDouble`, `BlockMediaDoubleQuote` and
 * `GeneralCta` all carry `"use client"`, so a VALUE imported from one of them
 * would reach this server component as a client-reference proxy and spread to
 * undefined props — with no type or build error to catch it. Only their TYPES
 * cross that boundary, and they do it in `content.ts`.
 */
export default function RestaurantOrderingPortalPage() {
  return (
    <>
      <MainNavigation />

      {/* `overflow-x: clip` (not hidden) — matches the homepage shell. */}
      <main className="mainContent relative w-full overflow-x-clip bg-white">
        <BlockHeaderProjects {...PROJECT_HEADER} />
        <BlockIntroDouble {...projectIntroTabs(PROJECT_INTRO, PROJECT_DETAILS)} />

        <BlockWysiwyg {...PROJECT_OUTCOME} />

        <BlockWysiwyg {...PROJECT_ORDER_PATH} />
        <BlockImageFull {...PROJECT_IMAGE_CHECKOUT} priority />

        <BlockWysiwyg {...PROJECT_BACK_OFFICE} />
        <BlockMediaDoubleQuote {...PROJECT_MEDIA_BACK_OFFICE} />

        <BlockWysiwyg {...PROJECT_SETTINGS} />
        <BlockMediaDoubleQuote {...PROJECT_MEDIA_SETTINGS} />

        <BlockProjectDetails details={projectDetailsWithoutStack(PROJECT_DETAILS)} />
        <GeneralCta {...PROJECT_CTA} />
      </main>

      <NavigationFooter />

      <JsonLd schema={SCHEMA} />
    </>
  );
}
