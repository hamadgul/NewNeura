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
  PROJECT_CUTSHEET,
  PROJECT_DESCRIPTION,
  PROJECT_DETAILS,
  PROJECT_HEADER,
  PROJECT_IMAGE_REVIEW,
  PROJECT_IMAGE_SETUP,
  PROJECT_INTRO,
  PROJECT_MEDIA_QUOTE,
  PROJECT_OG_IMAGE,
  PROJECT_OUTCOME,
  PROJECT_PARSE,
  PROJECT_RULES,
  PROJECT_TITLE,
  PROJECT_VOICE,
} from "@/components/site/work/delivery-routing/content";

import { breadcrumbSchema, caseStudySchema } from "@/lib/seo";

import type { Metadata } from "next";

/**
 * `title` is the plain stem, so the root layout's "%s — NeuraGul" template
 * supplies the suffix. Both `PROJECT_TITLE` and `PROJECT_DESCRIPTION` are
 * search-facing strings that appear nowhere on the page — the `<h1>` and the
 * brief are separate constants and are unchanged. See their notes in
 * `content.ts`.
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
 * `/work/delivery-routing/`.
 *
 * Eleven blocks:
 *
 *   BlockHeaderProjects → BlockIntroDouble (the brief / the tech stack)
 *   → BlockWysiwyg (Outcome) → BlockWysiwyg (Reading the sheet)
 *   → BlockImageFull (review) → BlockWysiwyg (The rules are configuration)
 *   → BlockImageFull (Day Setup) → BlockWysiwyg (What goes out with the vans)
 *   → BlockMediaDoubleQuote (cut sheet, export)
 *   → BlockProjectDetails → GeneralCta
 *
 * The composition is argued from the evidence, not from a house rhythm: each
 * prose block is immediately followed by the one image that shows its claim
 * running. The parse discipline is answered by the review screen's
 * "47 tickets → 46 will deliver · 1 need review"; the rules layer by Day Setup's
 * 6-of-7 roster; the printed artefact by the cut sheet.
 *
 * The Routes screen — the solve itself — is the header's own full-bleed image
 * rather than a block, because it is also this project's frozen cover. An
 * earlier draft ran it in BOTH places, and the page then showed the same
 * picture twice inside one scroll. Only visible by looking at the rendered
 * page; no check catches it.
 *
 * `BlockWysiwyg` appears four times and `BlockImageFull` twice; both repeat on
 * the source's own project pages (its component note records three
 * `BlockImageFull` instances at 809 / 1003 / 960px, and two adjacent
 * `BlockWysiwyg`s on the service pages), so neither repetition is new. The two
 * adjacent wysiwygs at the top are deliberate: "Outcome" is pinned above all
 * media by the constraint below, and "Reading the sheet" has to stay next to
 * the review screenshot that proves it.
 *
 * `BlockMediaDouble` is deliberately NOT used: it and `BlockMediaDoubleQuote`
 * read as near-identical two-image bands, and the page already runs the quote
 * variant. `BlockImageSlider` is not used either — its geometry is solved for
 * 3:4 portraits at three slides across, and a 1600x1000 screenshot lands in it
 * as a ~473x296 thumbnail.
 *
 * Ordering constraint: `PROJECT_OUTCOME` ends on "the screenshots below run on
 * synthetic data", so it has to stay above every media block. That sentence is
 * also a promise the capture config keeps — see `content.ts` and
 * `scripts/shots/delivery-routing.config.mjs`.
 *
 * `BlockImageFull` gets `priority` on the review shot only: it is the first
 * image after the header's own and the only one reachable in the first viewport
 * or two. The block defaults to lazy, which is right for Day Setup.
 *
 * `GeneralCta` closes the page. It rendered on exactly one route before this
 * (`/process/`), and a case study with no call to action ends on a spec table.
 *
 * Client-boundary note: every constant above comes from this project's plain
 * `content.ts`. `BlockWysiwyg`, `BlockIntroDouble`, `BlockMediaDoubleQuote` and
 * `GeneralCta` all carry `"use client"`, so a VALUE imported from one of them
 * would reach this server component as a client-reference proxy and spread to
 * undefined props — with no type or build error to catch it. Only their TYPES
 * cross that boundary, and they do it in `content.ts`.
 */
export default function DeliveryRoutingPage() {
  return (
    <>
      <MainNavigation />

      {/* `overflow-x: clip` (not hidden) — matches the homepage shell. */}
      <main className="mainContent relative w-full overflow-x-clip bg-white">
        <BlockHeaderProjects {...PROJECT_HEADER} />
        <BlockIntroDouble {...projectIntroTabs(PROJECT_INTRO, PROJECT_DETAILS)} />

        <BlockWysiwyg {...PROJECT_OUTCOME} />

        <BlockWysiwyg {...PROJECT_PARSE} />
        <BlockImageFull {...PROJECT_IMAGE_REVIEW} priority />

        <BlockWysiwyg {...PROJECT_RULES} />
        <BlockImageFull {...PROJECT_IMAGE_SETUP} />

        <BlockWysiwyg {...PROJECT_CUTSHEET} />
        <BlockMediaDoubleQuote {...PROJECT_MEDIA_QUOTE} />

        <BlockProjectDetails details={projectDetailsWithoutStack(PROJECT_DETAILS)} />
        <BlockWysiwyg {...PROJECT_VOICE} />
        <GeneralCta {...PROJECT_CTA} />
      </main>

      <NavigationFooter />

      <JsonLd schema={SCHEMA} />
    </>
  );
}
