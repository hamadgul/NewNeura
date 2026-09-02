/**
 * Content for `/contact/`.
 *
 * The page is a single block: `BlockContact` is the entire route.
 *
 * Copy is lifted from the NeuraGul source site's contact section — `contact_lead`
 * and `contact_note` in the HOME dict of `pages/content.py`, which is what the
 * source's `#contact` form renders above its fields.
 *
 * ── What the block no longer takes ──────────────────────────────────────────
 * `socials`, `socialLabel` and `careers` are gone from `BlockContactProps`.
 * NeuraGul has no social accounts and there is no careers page, so the socials
 * row is not rendered at all and the careers teaser has been replaced by `lead`:
 * a muted opening, a white highlight, and one href the whole sentence links to.
 */
import { OFFICES } from "@/components/site/home/content";
import type { OfficeContact } from "@/types/site";

const VIDEO = "/site/videos";

export const META = {
  /** Plain stem: the root layout's "%s — NeuraGul" template adds the suffix. */
  title: "Contact",
  canonical: "/contact/",
  description:
    "Tell me what's broken. I read every message myself and answer all of them, usually within a day.",
} as const;

export const CONTACT_HEADING = "Contact";

/**
 * The second contact column is a plain note, not a place.
 *
 * The layout reserves two records side by side, one per office. NeuraGul has
 * one location, so rather than leave the right-hand column empty or invent a
 * second city, it carries the response-time promise the source actually makes in
 * `contact_note`. `phone` / `phoneHref` / `email` are all optional on
 * `OfficeContact` precisely for this record — there is nothing here to dial or
 * mail, and the first column already carries both.
 *
 * Two address lines, which is the 37.8px two-line box the block's `ContactInfo`
 * was measured against.
 */
export const REPLY_NOTE: OfficeContact = {
  label: "Reply",
  // Deliberately not "I read every message myself" — the lead line below the
  // rule already says exactly that, and repeating it in the column beside it
  // reads as a template with one record duplicated.
  address: ["Usually within a day", "Including the projects I turn down"],
};

/**
 * Rendered left to right. The New York record is imported rather than
 * re-declared: the menu overlay, the footer and this page all read the same
 * `OFFICES` entry, so there is one source of truth for the phone number and the
 * address.
 */
export const CONTACT_OFFICES: OfficeContact[] = [...OFFICES, REPLY_NOTE];

/**
 * The lead line under the rule, which is the slot the careers teaser used to
 * occupy.
 *
 * `text` is the muted opening and `highlight` the white call to action, so the
 * arrow chip lands after "Tell me what's broken." rather than after a
 * qualification. Both halves are verbatim source copy (`contact_note`, then
 * `contact_lead`). The whole sentence is one `<a>`; `mailto:` is the honest
 * target, because the source's own contact route is a form that lands in the
 * same inbox.
 */
export const CONTACT_LEAD = {
  text: "I read every message myself and I answer all of them, including the ones I turn down.",
  highlight: "Tell me what's broken.",
  href: "mailto:hamad@neuragul.com",
};

/**
 * The full-width image that closes the block.
 *
 * It is always cropped with `object-cover` into a 296px band at 1280+ (a ~4.5:1
 * sliver), which is why this is the generic office still rather than a product
 * screenshot: a UI cropped to a sliver reads as nothing. 1920×1080 is the file's
 * real pixel size.
 */
export const CONTACT_IMAGE = {
  src: `${VIDEO}/office-poster.jpg`,
  alt: "",
  width: 1920,
  height: 1080,
};
