import {
  ABOUT_CANONICAL,
  ABOUT_HEADER,
  ABOUT_INTRO,
  ABOUT_MEDIA,
  ABOUT_OG_IMAGE,
  ABOUT_TITLE,
  ABOUT_WYSIWYG_BODY,
} from "@/components/sites/lpas-com-76f4f1fd/about-4f10f17b/content";
import { MainNavigation } from "@/components/sites/lpas-com-76f4f1fd/root-8a5edab2/MainNavigation";
import { NavigationFooter } from "@/components/sites/lpas-com-76f4f1fd/root-8a5edab2/NavigationFooter";
import { BlockHeaderGeneral } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockHeaderGeneral";
import { BlockIntroDouble } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockIntroDouble";
import { BlockMediaDoubleQuote } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockMediaDoubleQuote";
import { BlockWysiwyg } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockWysiwyg";
import { CollectionTeam } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/CollectionTeam";

import type { Metadata } from "next";

/**
 * The live title is "About - LPAS Architecture", which the root layout's
 * `"%s - LPAS Architecture"` template builds from the bare stem — so, unlike
 * the homepage, this route does *not* need an absolute title.
 *
 * No `description`: the source serves none on this page (see content.ts).
 */
export const metadata: Metadata = {
  title: ABOUT_TITLE,
  alternates: { canonical: ABOUT_CANONICAL },
  openGraph: {
    title: "About - LPAS Architecture",
    url: "https://lpas.com/about/",
    images: [ABOUT_OG_IMAGE],
  },
};

/**
 * lpas.com `/about/`.
 *
 * Block order is the capture's own section order (RECON.json, `sectionCount: 6`
 * counting the two navigation blocks):
 *   BlockHeaderGeneral → BlockIntroDouble → BlockMediaDoubleQuote →
 *   BlockWysiwyg → CollectionTeam
 *
 * `CollectionTeam` carries its own verbatim content as prop defaults
 * (`LPAS_TEAM_ITEMS`, `LPAS_TEAM_FILTERS`, plus the measured tagline and
 * heading), so it is rendered with no arguments.
 *
 * `BlockWysiwyg` ships an `ABOUT_WYSIWYG` constant with the same intent, but it
 * cannot be used from here: the block is a `"use client"` module, so that
 * export arrives on the server as a client-reference proxy and spreading it
 * yields `body === undefined`. `ABOUT_WYSIWYG_BODY` in this page's content.ts
 * restates the identical copy on the server side — see the note there.
 *
 * The team cards link to `/team/<slug>/`. Those 38 bio pages are out of scope
 * for this clone (OUTPUT_PLAN.md, "Team bios excluded") and will 404; the
 * hrefs stay because dropping them would change the markup and the hover
 * affordance the source ships.
 */
export default function AboutPage() {
  return (
    <>
      <MainNavigation />

      {/* `overflow-x: clip`, matching the homepage shell. */}
      <main className="mainContent relative w-full overflow-x-clip bg-white">
        <BlockHeaderGeneral {...ABOUT_HEADER} />
        <BlockIntroDouble {...ABOUT_INTRO} />
        <BlockMediaDoubleQuote {...ABOUT_MEDIA} />
        <BlockWysiwyg {...ABOUT_WYSIWYG_BODY} />
        <CollectionTeam />
      </main>

      <NavigationFooter />
    </>
  );
}
