/**
 * Content for `/work/restaurant-ordering-portal/`.
 *
 * Provenance for every string here is recorded in
 * `docs/research/case-studies/restaurant-ordering-portal.md`, which cites the
 * file and line in `~/Projects/PizzeriaSoftware` behind each claim. Nothing
 * below is written from memory, and the dossier's "Unverifiable claims" section
 * lists what was deliberately NOT written (commission percentages, running
 * cost, a named restaurant in production).
 *
 * Image sizing note: `width`/`height` are the assets' true decoded pixels
 * (1200x750 for the cover, 1600x1000 for the five screens), because
 * `next/image` reserves the aspect ratio from them and every block here sizes
 * itself from that ratio rather than from a fixed height.
 *
 * Alt text note: these are informative product screenshots, not decorative
 * photographs, so every `alt` describes what the screen shows and what it is
 * evidence for. `check-assets.mjs` fails the build on an empty one. The cover
 * is the single exception — it is a decorative backdrop behind the header's
 * title, and it is in that script's `FROZEN_COVERS` list. It is also shared
 * with `/`, `/about/`, `/services/cloud-infrastructure/` and `/process/`, and
 * was not re-captured for this page.
 *
 * SANDBOX DATA — every screenshot was captured against a Square sandbox and a
 * throwaway Postgres seeded through the app's own admin screens. The
 * restaurant name and address in every frame are two rows in that database's
 * settings table (the code says "Joe's Pizza"); the orders are Square sandbox
 * test orders. Next's dev-mode badge and the customer phone column are hidden
 * in the captures (see `scripts/shots/restaurant-ordering-portal.config.mjs`).
 *
 * VOICE — the site says "we", never "I", and nothing here claims a headcount.
 * See `.agents/product-marketing.md` for the shared positioning this page was
 * written against: the reader is a restaurant owner paying marketplace apps a
 * cut of every order, and the objection the page answers is "if I leave the
 * apps, who runs this — do I call a developer every time my hours change?"
 *
 * ── What the SEO pass changed ───────────────────────────────────────────────
 * `PROJECT_TITLE` and `PROJECT_DESCRIPTION` are metadata only — the `<title>`
 * stem and the meta description — and were written to compete in a result
 * list rather than to open a page; see the notes on each.
 */
import type { BlockHeaderProjectsProps } from "@/components/site/shared/blocks/BlockHeaderProjects";
import type { BlockImageFullProps } from "@/components/site/shared/blocks/BlockImageFull";
import type { BlockIntroDoubleProps } from "@/components/site/shared/blocks/BlockIntroDouble";
import type { BlockMediaDoubleQuoteProps } from "@/components/site/shared/blocks/BlockMediaDoubleQuote";
import type { BlockWysiwygProps } from "@/components/site/shared/blocks/BlockWysiwyg";
import type { GeneralCtaProps } from "@/components/site/shared/blocks/GeneralCta";
import type { ProjectDetail } from "@/components/site/shared/blocks/BlockProjectDetails";

const IMAGES = "/site/images";

/**
 * The `<title>` stem, suffixed by the root layout's `"%s — NeuraGul"` template.
 *
 * This is NOT the project's display name — `PROJECT_HEADER.title` is, and it
 * still reads "Restaurant ordering portal" on the page and in the breadcrumb.
 * The two diverge on purpose: an `<h1>` sits under a header that has already
 * established what the page is, while a `<title>` is read cold in a result
 * list, so it has to name the category of work as well as the client.
 * `PROJECT_TITLE` is referenced only by `metadata` in the route file, so
 * nothing visible moves with it.
 */
export const PROJECT_TITLE = "Restaurant Online Ordering Without Commission";
export const PROJECT_CANONICAL = "/work/restaurant-ordering-portal/";
/**
 * The meta description. It used to restate the brief; it now states what was
 * built and what it was built with, in ~150 characters, so a searcher has a
 * technology and a capability to match on. The brief itself is untouched and
 * still opens the page.
 */
export const PROJECT_DESCRIPTION =
  "Commission-free online ordering on a restaurant's own Square POS, with a back office for hours, menu, delivery and credentials. Next.js, Square, Twilio, 154 tests.";
export const PROJECT_OG_IMAGE = `${IMAGES}/pizzeria.jpg`;

/**
 * `live_url` / `live_label` from the source entry, kept exact — this one points
 * at a demo deployment rather than a client's storefront, which is why the
 * label reads "demo" and not "site". The demo runs against a Square sandbox.
 *
 * `BlockProjectDetails` renders its values as plain `<span>`s with no anchor,
 * so the details row prints the readable host and this constant is where the
 * addressable URL survives.
 */
export const PROJECT_LIVE = {
  url: "https://pizzeria-software.vercel.app",
  label: "Live demo",
  display: "pizzeria-software.vercel.app",
} as const;

/**
 * Header. `lead` is the project's OUTCOME, not its brief: the brief is the
 * `BlockIntroDouble` statement two blocks down, and printing it in both slots
 * repeated the same sentence inside two screens on every case study.
 *
 * The lead used to read "keep the full value of every order". Square's own
 * processing fee still applies (the repo's `docs/features.md` says so), so
 * "full value" overclaimed; this names what the repo actually removes — the
 * app in the middle — and where the order ends up. Flagged in the dossier's
 * "Unverifiable claims", item 2.
 */
export const PROJECT_HEADER: BlockHeaderProjectsProps = {
  title: "Restaurant ordering portal",
  lead: "Online orders that land straight in the restaurant's Square POS, with no app in the middle taking a cut.",
  location: "2026 · Product",
  service: "Cloud & Infrastructure",
  breadcrumbLabel: "Work",
  breadcrumbHref: "/work/",
  backLabel: "All work",
  image: {
    src: `${IMAGES}/pizzeria.jpg`,
    alt: "",
    width: 1200,
    height: 750,
  },
};

/**
 * Block 2 — `BlockIntroDouble`, run through `projectIntroTabs`, which relabels
 * the tabs to "The brief" / "The tech stack" and fills the second panel from
 * the `Stack` row of `PROJECT_DETAILS`. So only `statement` and `body` below
 * reach the page; `labels` and `activeLabel` are overwritten by that helper.
 *
 * `statement` is the brief and is deliberately unchanged: it is the concrete
 * before-state the whole page argues against.
 *
 * `body` used to be one sentence about Square. It now says what the portal
 * does end to end and that there is a back office, because those are the two
 * things the sections below then show. Each section carries its own detail.
 */
export const PROJECT_INTRO: BlockIntroDoubleProps = {
  labels: ["The brief", "What we built"],
  activeLabel: 0,
  statement:
    "Third-party delivery apps take a punishing cut of every restaurant order. This one removes the middleman.",
  body: "A branded ordering site and a back office to run it. The menu is read live from the Square catalog, the order is created in Square, the card is charged by Square, and the customer gets a text when the kitchen marks the order ready. Hours, menu, delivery and every credential are edited from the admin, so nothing waits on a developer. Next.js on Vercel, Postgres for the settings, 154 tests.",
};

/**
 * Block 3 — `BlockWysiwyg`, the "Outcome" section.
 *
 * It sits BEFORE the media, and has to: the copy ends on "the screenshots
 * below", so the screenshots have to be below it. That last sentence is also a
 * promise the capture config has to keep — see the sandbox-data note at the
 * top of this file.
 *
 * `title` only, no `tagline`: the narrow left column becomes the "Outcome"
 * heading and the wide right column the copy, which is the block's own
 * two-column shape.
 */
export const PROJECT_OUTCOME: BlockWysiwygProps = {
  title: "Outcome",
  body: [
    {
      type: "paragraph",
      text: "A restaurant can take an online order without paying a marketplace a share of it, and whoever is at the counter can open, close, hide a dish or change the hours from a browser. It ships as a template on Vercel: one deployment per restaurant, with its own database and its own Square account, and nothing shared between them. The screenshots below run against a Square sandbox and a throwaway database, and the restaurant name in them is an invented setting.",
    },
  ],
};

/**
 * Block 4 — `BlockWysiwyg`: the order's path.
 *
 * Every sentence is a mechanism cited in the dossier's "Architecture
 * decisions" 1, 2 and 5: the live catalog read, the Square-hosted card frame,
 * the server-side total, the `pay-<orderId>` idempotency key, and the
 * send-once ledger behind the "ready" text.
 */
export const PROJECT_ORDER_PATH: BlockWysiwygProps = {
  title: "From the menu to the kitchen",
  body: [
    {
      type: "paragraph",
      text: "The menu is the Square catalog, read live: items, sizes and toppings are whatever the restaurant already maintains for its till, so there is no second menu to maintain. Checkout is pickup or delivery, now or a scheduled slot inside the restaurant's hours, a tip, and a card field that is a Square-hosted frame, so no card number ever reaches the restaurant's own code.",
    },
    {
      type: "paragraph",
      text: "The order is created in Square before any card is charged, and the amount charged is the order total read back from Square at payment time, so the browser cannot send its own figure. Each payment carries the order's own id as its idempotency key, so a retried request cannot charge twice. The customer gets a text when the order is received and another when the kitchen marks it ready in Square. That second text is sent once per order, because the webhook that triggers it can arrive more than once.",
    },
  ],
};

/**
 * Block 5 — `BlockImageFull`: the checkout.
 *
 * The evidence for the paragraph immediately above it: Pickup / Delivery and
 * ASAP / Schedule, the order summary with its size and crust line, the tip
 * row, and the Square card frame below. It is the first image after the
 * header's own, so the page passes it `priority`; the other blocks stay lazy.
 */
export const PROJECT_IMAGE_CHECKOUT: BlockImageFullProps = {
  image: {
    src: `${IMAGES}/restaurant-ordering-portal-checkout.jpg`,
    alt: "The checkout: pickup or delivery, ASAP or a scheduled slot, contact details, an order summary of a Medium Margherita and garlic bread, a tip row, and the Square card field.",
    width: 1600,
    height: 1000,
  },
};

/**
 * Block 6 — `BlockWysiwyg`: the back office.
 *
 * Answers the reader's real objection — "who runs this once the apps are
 * gone?" Drawn from the dossier's Gaps 1, 3, 4 and 9: the Orders feed, the
 * force-open/force-closed toggle keyed to today's weekday, hidden items filtered from
 * the portal only, and Analytics read from Square.
 */
export const PROJECT_BACK_OFFICE: BlockWysiwygProps = {
  title: "The back office",
  body: [
    {
      type: "paragraph",
      text: "The Orders page is the counter's view of the same Square orders: a live feed, an open/closed switch at the top that blocks or accepts orders immediately, and a sound when a new one lands. Close early on a slow Tuesday or force open for a late rush; the switch overrides today's hours and leaves the rest of the week alone.",
    },
    {
      type: "paragraph",
      text: "Hide a dish from the admin and it leaves the ordering portal at once while staying in the Square catalog, so the till and the receipts are untouched. Analytics reads revenue, order count, average order and pickup against delivery straight from Square for the last 7, 30 or 90 days. There is no second database of orders anywhere in the system.",
    },
  ],
};

/**
 * Block 7 — `BlockMediaDoubleQuote`: Orders and Menu Visibility.
 *
 * At `xl` the blockquote sits directly under the *small* media, so the quote
 * is the small image's own caption. The quote is the Menu Visibility page's
 * own sentence, verbatim — the app describing the mechanism the paragraph
 * above claims. Orders takes the large slot because the switch and the feed
 * are what the section is about.
 */
export const PROJECT_MEDIA_BACK_OFFICE: BlockMediaDoubleQuoteProps = {
  large: {
    type: "image",
    src: `${IMAGES}/restaurant-ordering-portal-orders.jpg`,
    alt: "The admin Orders page: a green 'Open — accepting orders' switch above a feed of Square sandbox orders marked Received, Ready or Completed.",
    width: 1600,
    height: 1000,
  },
  small: {
    type: "image",
    src: `${IMAGES}/restaurant-ordering-portal-menu.jpg`,
    alt: "Menu Visibility in the admin: every catalog item with a toggle, one pizza switched off and struck through, and a '1 hidden' count.",
    width: 1600,
    height: 1000,
  },
  quote:
    "Hidden items and modifiers are removed from the customer ordering portal immediately. They remain in your Square catalog.",
};

/**
 * Block 8 — `BlockWysiwyg`: the settings layer.
 *
 * The config-precedence system (dossier, decision 3) and the integration
 * surface (Gap 5, decision 6): code defaults, env vars for the first boot, and
 * a `config_overrides` row that wins over both; 44 admin-editable keys, five
 * masked secrets, the mask-is-a-no-op rule, the delivery provider switch, and
 * the three-attempt dispatch retry with the alert text.
 */
export const PROJECT_SETTINGS: BlockWysiwygProps = {
  title: "Changes without a developer",
  body: [
    {
      type: "paragraph",
      text: "The code ships with defaults. Environment variables cover the first boot. Anything the admin saves is a row in a settings table, and that row wins over both on the next request, with no redeploy. Name, address, timezone, hours for every day of the week, delivery fee and radius, prep time, how far ahead a customer may schedule, the wording of every text message: 44 keys, each checked for shape before it is written.",
    },
    {
      type: "paragraph",
      text: "Square, Twilio and Uber Direct credentials are edited on the Integrations page the same way, so a rotated key takes effect without a deploy. The five secret values are returned to the browser masked, and a save that sends the mask back changes nothing. Delivery can switch between the restaurant's own drivers and Uber Direct couriers from the same admin; a failed courier dispatch retries three times and texts the restaurant's alert number if it still fails.",
    },
  ],
};

/**
 * Block 9 — `BlockMediaDoubleQuote`: Settings and Integrations.
 *
 * Settings takes the large slot: the "Last updated by … on 9/11/2026" lines
 * under the name and address are the settings row, on screen. Integrations is
 * the small slot and the quote is that page's own note, verbatim — the
 * precedence rule and the masking rule in the app's words.
 */
export const PROJECT_MEDIA_SETTINGS: BlockMediaDoubleQuoteProps = {
  large: {
    type: "image",
    src: `${IMAGES}/restaurant-ordering-portal-settings.jpg`,
    alt: "The admin Settings page: restaurant name, address and timezone fields each marked 'Last updated by' an admin and a date, above a business-hours editor for every day of the week.",
    width: 1600,
    height: 1000,
  },
  small: {
    type: "image",
    src: `${IMAGES}/restaurant-ordering-portal-integrations.jpg`,
    alt: "The admin Integrations page: Square environment, token and location fields, then Twilio's from-number, account SID and a masked auth token.",
    width: 1600,
    height: 1000,
  },
  quote: "DB values override environment variables. Secrets are masked after save.",
};

/**
 * Block 10 — `BlockProjectDetails`. The real facts only.
 *
 * `Stack` is read by `projectIntroTabs` to fill the second intro tab and then
 * dropped from this table by `projectDetailsWithoutStack`, so it is written
 * once and printed once. The rendered table therefore has five rows, which
 * the block auto-places in pairs: (Tests | Deployment), (Year | Platform),
 * (Live demo | —).
 *
 * `Tests` and `Deployment` are new. They carry the production argument in a
 * label/value row instead of another paragraph. 154 is the measured Jest
 * count (153 pass, 1 skipped live-API contract test); the deployment line is
 * `README.md`'s own description of the template.
 */
export const PROJECT_DETAILS: ProjectDetail[] = [
  { label: "Stack", value: "Next.js, TypeScript, Square, Twilio, Postgres, Vercel" },
  { label: "Tests", value: "154 Jest" },
  { label: "Deployment", value: "Vercel — one deployment, database and Square account per restaurant" },
  { label: "Year", value: "2026" },
  { label: "Platform", value: "Product" },
  { label: PROJECT_LIVE.label, value: PROJECT_LIVE.display, href: PROJECT_LIVE.url },
];

/**
 * Block 11 — `GeneralCta`, the site's call-to-action band.
 *
 * Declared here rather than imported from `GeneralCta.tsx`: that block is a
 * `"use client"` module, so a plain value imported from it into a server
 * component arrives as a client-reference proxy and spreads to undefined props
 * — an empty `<p>` and an href-less button, with no type or build error to
 * catch it. This file has no `"use client"`, so the value stays real in the
 * server graph.
 *
 * The line is this reader's own situation rather than `/process/`'s general
 * "Tell us what's broken.", per `.agents/product-marketing.md` §1.
 */
export const PROJECT_CTA: GeneralCtaProps = {
  text: "Still paying an app a cut of your own customers' orders?",
  label: "Contact",
  href: "/contact/",
};
