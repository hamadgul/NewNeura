/**
 * Content for `/contact/`.
 *
 * The page is a single block: `BlockContact` is the entire route.
 *
 * Copy is adapted from the NeuraGul source site's contact section —
 * `contact_lead` and `contact_note` in the HOME dict of `pages/content.py`,
 * which is what the source's `#contact` form renders above its fields.
 *
 * VOICE — the site says "we" everywhere else, because it is a team. This page
 * is the one exception worth making: "every message is read and answered" is a
 * promise a company can make and nobody can check, while the same promise with
 * a name on it is one person's word. So the lead names Hamad Gul, who is the
 * primary point of contact, and the rest of the page stays in the team's voice.
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
  title: "Contact a New York Software Developer",
  canonical: "/contact/",
  /*
    The phone number and the email are in the description on purpose. A contact
    page's snippet is read by someone who has already decided to get in touch,
    and putting the NAP in the snippet lets them act without the click. It also
    repeats the same number the JSON-LD and the footer carry, which is the
    consistency local ranking is built on.
  */
  description:
    "Call (203) 685 9193 or email hamad@neuragul.com. Tell us what's broken. Hamad Gul reads every message himself and answers, usually within a day.",
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
  // Deliberately not a second reading of "Hamad reads every message himself" —
  // the lead line below the rule already says that, and repeating it in the
  // column beside it reads as a template with one record duplicated. What sits
  // here instead is the half of `contact_note` the lead does not carry.
  address: ["Usually within a day", "Including the projects we turn down"],
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
 * arrow chip lands after "Tell us what's broken." rather than after a
 * qualification. Both halves are the source's own copy (`contact_note`, then
 * `contact_lead`), with the promise moved from an unnamed "I" onto the person
 * who actually makes it. The turned-down clause moves to `REPLY_NOTE` above so
 * the two records do not say the same thing twice. The whole sentence is one
 * `<a>`; `mailto:` is the honest target, because the source's own contact route
 * is a form that lands in this inbox.
 */
export const CONTACT_LEAD = {
  text: "Hamad Gul, your primary point of contact, reads every message himself and answers all of them.",
  highlight: "Tell us what's broken.",
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
