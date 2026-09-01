import { MainNavigation } from "@/components/sites/lpas-com-76f4f1fd/root-8a5edab2/MainNavigation";
import { NavigationFooter } from "@/components/sites/lpas-com-76f4f1fd/root-8a5edab2/NavigationFooter";
import { BlockContact } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockContact";
import {
  CONTACT_CAREERS,
  CONTACT_HEADING,
  CONTACT_IMAGE,
  CONTACT_OFFICES,
  CONTACT_SOCIAL_LABEL,
  CONTACT_SOCIALS,
} from "@/components/sites/lpas-com-76f4f1fd/contact-cfd191cd/content";

import type { Metadata } from "next";

/**
 * The source serves no `<meta name="description">` on this route (CONTENT.json
 * records `metaDescription: null`), so none is invented here. The title comes
 * through the root layout's "%s - LPAS Architecture" template, which reproduces
 * the served "Contact - LPAS Architecture" exactly.
 */
export const metadata: Metadata = {
  title: "Contact",
  alternates: { canonical: "/contact/" },
  openGraph: {
    title: "Contact - LPAS Architecture",
    url: "https://lpas.com/contact/",
  },
};

/**
 * lpas.com `/contact/` clone.
 *
 * Block sequence (measured from the live page): `BlockContact`, and nothing
 * else — it carries the `<h1>`, both offices, the socials row, the careers
 * teaser and the closing photo on its own dark ground.
 *
 * The `bg-white` on `<main>` is kept identical to the homepage on purpose:
 * `BlockContact` owns the `#262626` ground itself and, being the sole child
 * with no vertical margins, covers `main` edge to edge, so no white ever
 * shows.
 *
 * The footer uses the `compact` variant. Measured on the live page, this route
 * serves a 94px footer (20px pad + a 74px copyright band, dark ground) with
 * `__topSection` and bands 1-2 set to `display: none` and no back-to-top —
 * versus 1525px everywhere else. The source drops the duplicate because this
 * page already carries the offices and socials in `BlockContact` itself.
 * Rendering the full footer here added ~1620px of document height that the
 * source does not have.
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
          socialLabel={CONTACT_SOCIAL_LABEL}
          socials={CONTACT_SOCIALS}
          careers={CONTACT_CAREERS}
          image={CONTACT_IMAGE}
        />
      </main>

      <NavigationFooter variant="compact" />
    </>
  );
}
