/**
 * Verbatim content from `https://lpas.com/contact/`.
 * site-key `lpas-com-76f4f1fd` · page-key `contact-cfd191cd`
 *
 * Every string here was read from `docs/research/.../contact-cfd191cd/CONTENT.json`,
 * which captured the live DOM — do not paraphrase, retitle or "tidy" any of it.
 * Note the curly apostrophe in "We’re", which is what the source serves.
 *
 * The page is a single block: `BlockContact` is the entire `/contact/` route.
 */
import { OFFICES } from "@/components/sites/lpas-com-76f4f1fd/root-8a5edab2/content";
import type { NavLink, OfficeContact } from "@/types/lpas";

const IMG = "/sites/lpas-com-76f4f1fd/contact-cfd191cd/images";

export const CONTACT_META = {
  /** The root layout supplies the " - LPAS Architecture" half of the template. */
  title: "Contact",
  canonical: "/contact/",
};

export const CONTACT_HEADING = "Contact";

/**
 * The same two records the menu overlay and the footer render, reused rather
 * than re-declared — the source drives all three from one CMS entry.
 *
 * Drift note: CONTENT.json's `mapHref` for each office is the CMS's raw
 * `maps.google.com/?q=<url-encoded &lt;p&gt;…&lt;br /&gt;…&lt;/p&gt;>` string,
 * i.e. the escaped markup leaks into the query. `root-8a5edab2/content.ts`
 * already normalises that to a plain address query, which resolves to the same
 * place without shipping HTML in a URL, so this page inherits that decision
 * instead of forking a second copy of the offices.
 */
export const CONTACT_OFFICES: OfficeContact[] = OFFICES;

export const CONTACT_SOCIAL_LABEL = "Follow us on our socials";

/**
 * Declared here rather than reusing `root-8a5edab2`'s `SOCIAL_LINKS`: that
 * pass-1 constant shortened two of the hrefs
 * (`…/company/lpas-architecture-design`, `…/LPAS-Architecture-Design`). These
 * are the full targets CONTENT.json recorded for this page.
 */
export const CONTACT_SOCIALS: NavLink[] = [
  { label: "Instagram", href: "https://www.instagram.com/lpas.design" },
  { label: "Linkedin", href: "https://www.linkedin.com/company/lpas-architecture-and-design" },
  {
    label: "Facebook",
    href: "https://www.facebook.com/LPAS-Architecture-Design-200127570010089",
  },
];

/**
 * The careers teaser. The source wraps the whole sentence in one `<a>` to
 * `/careers/`; the highlight is the white-on-dark second half.
 *
 * `/careers/` is deliberately out of scope for this clone (see OUTPUT_PLAN.md),
 * so the link is preserved verbatim but has no route behind it — same as the
 * "Careers" entry the footer and menu already ship.
 */
export const CONTACT_CAREERS = {
  lead: "We’re always on the lookout for new talent.",
  highlight: "See our open positions.",
  href: "/careers/",
};

/**
 * The full-width studio photo that closes the block. `alt=""` in the source.
 * Size from `docs/research/.../IMAGE_DIMENSIONS.json` (decoded from the file),
 * never from CONTENT.json's `w`/`h`, which record a srcset variant's rendered
 * box rather than the intrinsic pixels.
 */
export const CONTACT_IMAGE = {
  src: `${IMG}/Contact-LPAS-1440x567-c-default.webp`,
  alt: "",
  width: 1440,
  height: 567,
};
