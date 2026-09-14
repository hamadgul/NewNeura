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
  PROJECT_AI,
  PROJECT_CANONICAL,
  PROJECT_COPY_TEST,
  PROJECT_CTA,
  PROJECT_DESCRIPTION,
  PROJECT_DETAILS,
  PROJECT_HEADER,
  PROJECT_IMAGE_COMBO,
  PROJECT_IMAGE_LIGHTHOUSE,
  PROJECT_IMAGE_TOPIC,
  PROJECT_INTRO,
  PROJECT_LIVE,
  PROJECT_MATRIX,
  PROJECT_MEDIA_AI,
  PROJECT_MEDIA_LIVE,
  PROJECT_OG_IMAGE,
  PROJECT_PERFORMANCE,
  PROJECT_TITLE,
  PROJECT_VOICE,
  PROJECT_TOPICS,
} from "@/components/site/work/new-york-mobile-mechanic/content";

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
 * `/work/new-york-mobile-mechanic/`.
 *
 * Fifteen blocks:
 *
 *   BlockHeaderProjects (cover: the hero, its four dials, both call buttons)
 *   → BlockIntroDouble (the brief / the tech stack)
 *   → BlockWysiwyg (Forty-five pages)      → BlockImageFull (the Queens brake page, priority)
 *   → BlockWysiwyg (Thirty pages)          → BlockImageFull (the alternator page)
 *   → BlockWysiwyg (the copy test)
 *   → BlockWysiwyg (100, four times)       → BlockImageFull (the Lighthouse report)
 *   → BlockWysiwyg (every number is live)  → BlockMediaDoubleQuote (hero loop L, reviews phone S)
 *   → BlockWysiwyg (what ChatGPT said)     → BlockMediaDoubleQuote (ChatGPT NYC L, Queens S)
 *   → BlockProjectDetails → GeneralCta
 *
 * The composition is argued from the evidence, not from a house rhythm: each
 * prose block is followed by the one image that shows its claim. The matrix
 * section is answered by a real cell of the matrix; the topic section by a
 * real topic page with its price chip; the performance section by the report
 * itself at a width where the five scores are legible (the frozen 512x265
 * `mechanicseo.png` used to carry this at 530px and could not); the trust
 * section by the loop of the dials revving beside the phone-sized reviews
 * page with its fixed Call / Text Now bar; the answer-engine section by the
 * two dated ChatGPT screenshots. The copy-test section has no image: a test
 * file is not a screenshot, and faking one would be the thing the section is
 * about.
 *
 * The cover is the hero and is NOT repeated in the body (Task 8's
 * duplicate-cover trap); the loop in the trust block is the same framing but
 * moving, which is the point of that slot — a still cannot show a count-up.
 *
 * `BlockImageFull` appears three times and `BlockMediaDoubleQuote` twice; the
 * source's own project pages run three `BlockImageFull` instances, so neither
 * repetition is new. The Lighthouse image is 1600x841, not 1600x1000: the
 * report is that shape and cropping it would cut the score row or the
 * thumbnail. `BlockImageFull` is `h-auto w-full`, so the ratio is honoured.
 *
 * `BlockImageSlider` is not used (its geometry is solved for 3:4 portraits and
 * a 1600-wide screenshot lands in it as a thumbnail); `BlockMediaDouble` is
 * not used because the page already runs the quote variant twice.
 *
 * `priority` on the combo shot only: it is the first image after the header's
 * own. The rest lazy-load, which the block does by default.
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
export default function NewYorkMobileMechanicPage() {
  return (
    <>
      <MainNavigation />

      {/* `overflow-x: clip` (not hidden) — matches the homepage shell. */}
      <main className="mainContent relative w-full overflow-x-clip bg-white">
        <BlockHeaderProjects {...PROJECT_HEADER} />
        <BlockIntroDouble {...projectIntroTabs(PROJECT_INTRO, PROJECT_DETAILS)} />

        <BlockWysiwyg {...PROJECT_MATRIX} />
        <BlockImageFull {...PROJECT_IMAGE_COMBO} priority />

        <BlockWysiwyg {...PROJECT_TOPICS} />
        <BlockImageFull {...PROJECT_IMAGE_TOPIC} />

        <BlockWysiwyg {...PROJECT_COPY_TEST} />

        <BlockWysiwyg {...PROJECT_PERFORMANCE} />
        <BlockImageFull {...PROJECT_IMAGE_LIGHTHOUSE} />

        <BlockWysiwyg {...PROJECT_LIVE} />
        <BlockMediaDoubleQuote {...PROJECT_MEDIA_LIVE} />

        <BlockWysiwyg {...PROJECT_AI} />
        <BlockMediaDoubleQuote {...PROJECT_MEDIA_AI} />

        <BlockProjectDetails details={projectDetailsWithoutStack(PROJECT_DETAILS)} />
        <BlockWysiwyg {...PROJECT_VOICE} />
        <GeneralCta {...PROJECT_CTA} />
      </main>

      <NavigationFooter />

      <JsonLd schema={SCHEMA} />
    </>
  );
}
