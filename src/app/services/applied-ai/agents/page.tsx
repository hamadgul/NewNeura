import {
  HEADER,
  INTRO,
  META,
  PROCESS,
  PROJECTS,
  WYSIWYG,
} from "@/components/site/services/applied-ai-agents/content";
import { MainNavigation } from "@/components/site/home/MainNavigation";
import { NavigationFooter } from "@/components/site/home/NavigationFooter";
import { JsonLd } from "@/components/site/shared/JsonLd";
import { BlockHeaderServices, SERVICE_TONE } from "@/components/site/shared/blocks/BlockHeaderServices";
import { BlockIntroDouble } from "@/components/site/shared/blocks/BlockIntroDouble";
import { BlockProcessCardSlider } from "@/components/site/shared/blocks/BlockProcessCardSlider";
import { BlockProjectsHighlight } from "@/components/site/shared/blocks/BlockProjectsHighlight";
import { BlockWysiwyg } from "@/components/site/shared/blocks/BlockWysiwyg";

import { breadcrumbSchema, serviceNameFor, serviceSchema } from "@/lib/seo";

import type { Metadata } from "next";

/**
 * `title` is the plain stem, so the root layout's "%s — NeuraGul" template
 * supplies the suffix; only a page whose title cannot fit that template opts
 * out. `title` and `description` are search-facing and appear nowhere on the
 * page — see the notes in `content.ts`.
 */
export const metadata: Metadata = {
  title: META.title,
  description: META.description,
  alternates: { canonical: META.canonical },
  openGraph: {
    title: `${META.title} — NeuraGul`,
    description: META.description,
    url: `https://neuragul.com${META.canonical}`,
    // Each service page shares to its own header photo. Without this they all
    // inherit the root layout's hero poster, so nine different links preview as
    // the same card.
    images: [{ url: HEADER.image.src, width: HEADER.image.width, height: HEADER.image.height }],
  },
};

/**
 * `Service` + `BreadcrumbList`.
 *
 * The `Service` node binds this page to the organization declared once in the
 * root layout (`provider: { "@id": ORG_ID }`), which is what turns nine
 * unrelated pages into one company that offers nine things. `areaServed` comes
 * from the same shared constant the organization uses, so the geography is
 * stated identically everywhere.
 *
 * The breadcrumb is the only graph here that changes the result's appearance:
 * Google replaces the URL line in the SERP with the trail.
 */
const SCHEMA = [
  serviceSchema({
    name: serviceNameFor(META.canonical, META.title),
    description: META.description,
    href: META.canonical,
    /*
      The deliverables are read off the process slider rather than retyped, so
      the `OfferCatalog` cannot drift from the four cards a visitor actually
      sees. Structured data that outlives the copy it describes is the usual
      way a site earns a manual action.
    */
    deliverables: PROCESS.phases.map((phase) => phase.title),
  }),
  breadcrumbSchema([
    { name: "Applied AI", href: "/services/applied-ai/" },
    { name: "Retrieval & Agents", href: "/services/applied-ai/agents/" },
  ]),
];

/**
 * `/services/applied-ai/agents/` — the third of the four Applied AI children.
 *
 * Five blocks:
 * `BlockHeaderServices` → `BlockIntroDouble` → `BlockProcessCardSlider` →
 * `BlockWysiwyg` → `BlockProjectsHighlight`.
 *
 * Note the **single** rich-text block: the `/strategy/`, `/models/` and
 * `/evaluation/` siblings each carry two. The four children do not agree on
 * this, so the count is per page and never assumed.
 *
 * Unlike the parent `/services/applied-ai/`, every child pins a process
 * carousel between the intro and the rich text.
 */
export default function AppliedAiAgentsPage() {
  return (
    <>
      {/* The wordmark sits on this page's accent ground, so it reads the
          same tone table the header does — a light accent gets dark type. */}
      <MainNavigation tone={SERVICE_TONE[HEADER.service]} />

      {/*
        `overflow-x: clip` (not hidden/auto) — matches the homepage shell, and
        is load-bearing here: `BlockProcessCardSlider`'s pin is a
        `position: sticky` section, which is silently disabled by any ancestor
        with `overflow` of `hidden` or `auto`. `clip` establishes no scroll
        container, so the pin survives.
      */}
      <main className="mainContent relative w-full overflow-x-clip bg-white">
        <BlockHeaderServices {...HEADER} />
        <BlockIntroDouble {...INTRO} />
        <BlockProcessCardSlider {...PROCESS} />
        <BlockWysiwyg {...WYSIWYG} />
        <BlockProjectsHighlight {...PROJECTS} />
      </main>

      <NavigationFooter />

      <JsonLd schema={SCHEMA} />
    </>
  );
}
