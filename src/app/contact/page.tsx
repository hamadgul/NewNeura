import { MainNavigation } from "@/components/site/home/MainNavigation";
import { NavigationFooter } from "@/components/site/home/NavigationFooter";
import { BlockContact } from "@/components/site/shared/blocks/BlockContact";
import {
  CONTACT_HEADING,
  CONTACT_IMAGE,
  CONTACT_LEAD,
  CONTACT_OFFICES,
  META,
} from "@/components/site/contact/content";

import type { Metadata } from "next";

/**
 * `title` is the bare stem, so the root layout's "%s — NeuraGul" template
 * produces "Contact — NeuraGul". `openGraph.title` does not inherit that
 * template, so the resolved string is spelled out.
 */
export const metadata: Metadata = {
  title: META.title,
  description: META.description,
  alternates: { canonical: META.canonical },
  openGraph: {
    title: `${META.title} — NeuraGul`,
    description: META.description,
    url: `https://neuragul.com${META.canonical}`,
  },
};

/**
 * `/contact/` — one block, and nothing else.
 *
 * `BlockContact` carries the `<h1>`, both contact records, the lead line with
 * its arrow chip and the closing photo on its own `#262626` ground. There is no
 * socials row (NeuraGul has no social accounts, and the block no longer takes
 * one) and no careers teaser; the lead line occupies the row the teaser used to.
 *
 * The `bg-white` on `<main>` is kept identical to the homepage on purpose:
 * `BlockContact` owns the dark ground itself and, being the sole child with no
 * vertical margins, covers `main` edge to edge, so no white ever shows.
 *
 * The footer uses the `compact` variant — a 20px pad plus a 74px copyright band,
 * versus 1525px everywhere else. The full footer would repeat the phone number,
 * the e-mail and the "NYC based" line this block already carries, and add
 * ~1620px of document height to a page that is one screen of content.
 */
export default function ContactPage() {
  return (
    <>
      <MainNavigation />

      {/* `overflow-x: clip` (not hidden) — matches the homepage shell so the
          footer's sticky reveal keeps working. */}
      <main className="mainContent relative w-full overflow-x-clip bg-white">
        <BlockContact
          heading={CONTACT_HEADING}
          offices={CONTACT_OFFICES}
          lead={CONTACT_LEAD}
          image={CONTACT_IMAGE}
        />
      </main>

      <NavigationFooter variant="compact" />
    </>
  );
}
