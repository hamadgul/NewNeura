/**
 * Content for `/work/packship/`.
 *
 * Provenance for every string here is recorded in
 * `docs/research/case-studies/packship.md`, which cites the file and line in
 * `~/Projects/MagicBoxer` behind each claim. Nothing below is written from
 * memory, and the dossier's "Unverifiable claims" section lists what was
 * deliberately NOT written — including the sentence this page used to open
 * its features with ("A model running on the phone estimates an item's
 * dimensions from a single photograph. No LiDAR needed. Typical error lands
 * around a centimetre."), which the code contradicts: measuring is ARKit with
 * the LiDAR scanner and is gated on it, the lookup is a server call, and no
 * accuracy figure exists anywhere in the repo.
 *
 * Image sizing note: `width`/`height` are the assets' true decoded pixels
 * (1200x750 for the cover, 1600x1000 for the two landscape frames, 1179x2203
 * for the portrait), because `next/image` reserves the aspect ratio from them
 * and every block here sizes itself from that ratio.
 *
 * Image provenance: PackShip is an Expo app with no web build, so nothing was
 * captured by the runner. Every screen is one of the app's own committed
 * device screenshots (`src/assets/GettingStarted/*.jpg` in the source repo,
 * iPhone 16 Pro, 2026-05-13) or the developer's screenshot inside the App
 * Store composite, placed on the same dark ground and card the frozen cover
 * uses. Nothing inside a screenshot is edited. See the dossier's Shot list
 * and `scripts/shots/packship.config.mjs`.
 *
 * Alt text note: these are informative product screenshots, so every `alt`
 * describes what the screen shows and what it is evidence for; the cover is
 * the one decorative exception and is in `check-assets.mjs`'s
 * `FROZEN_COVERS` list.
 *
 * VOICE — the site says "we", never "I", and nothing here claims a headcount.
 * See `.agents/product-marketing.md`: the reader is segment 3, someone who
 * wants an App Store-shippable product evidenced by working code, and the
 * objection the page answers is "an app-store app is a demo with an icon —
 * is there a real system under it, and does it hold up when the outside
 * world misbehaves?"
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
 * still reads "PackShip" on the page and in the breadcrumb. The two diverge on
 * purpose: an `<h1>` sits under a header that has already established what the
 * page is, while a `<title>` is read cold in a result list, so it has to name
 * the category of work as well as the client. `PROJECT_TITLE` is referenced
 * only by `metadata` in the route file, so nothing visible moves with it.
 */
export const PROJECT_TITLE = "PackShip: an iOS App That Prices a Parcel";
export const PROJECT_CANONICAL = "/work/packship/";
/**
 * The meta description. Rewritten with the page: the old one said "using a
 * model that runs on the device", which is the cut claim. This states what
 * the app does and what it was built with, in ~160 characters.
 */
export const PROJECT_DESCRIPTION =
  "An iOS app that measures an item with LiDAR or a photo, fits it into the smallest carrier box in 3D, and compares live UPS, USPS and FedEx rates.";
export const PROJECT_OG_IMAGE = `${IMAGES}/packship.jpg`;

/**
 * Header. `lead` is the project's OUTCOME, not its brief: the brief is the
 * `BlockIntroDouble` statement two blocks down.
 *
 * The old lead ended "where a multi-step chore became one photo and a tap";
 * the photo is one of three ways in (typed, looked up, scanned), so the lead
 * now names the outcome the reader gets rather than one entry point.
 */
export const PROJECT_HEADER: BlockHeaderProjectsProps = {
  title: "PackShip",
  lead: "Live on the App Store as a consumer product: measure the item, get the smallest box that fits, see three carriers' rates on one screen.",
  location: "2026 · iOS",
  service: "Applied AI · App Development",
  breadcrumbLabel: "Work",
  breadcrumbHref: "/work/",
  backLabel: "All work",
  image: {
    src: `${IMAGES}/packship.jpg`,
    alt: "",
    width: 1200,
    height: 750,
  },
};

/**
 * Block 2 — `BlockIntroDouble`, run through `projectIntroTabs`, which relabels
 * the tabs to "The brief" / "The tech stack" and fills the second panel from
 * the `Stack` row of `PROJECT_DETAILS`. Only `statement` and `body` reach the
 * page; `labels` and `activeLabel` are overwritten by that helper.
 *
 * `statement` is the brief. Its last clause used to read "answers all three
 * from one photo"; the final review (2026-09-11) changed it to name the three
 * ways in that the body describes — the LiDAR scan, a photo, or a typed
 * product name — so the intro no longer promotes one path over the others.
 * The photo path is real: a photo goes to `POST /identify-image` to name the
 * product, the name goes to the dimension lookup, and the box and rates
 * follow (dossier, "Where the models are"). No claim is added: each of the
 * three appears in the sections below.
 *
 * `body` used to promise rate lookups "fast enough to feel instant"; nothing
 * measures that. It now names the stack and the numbers.
 */
export const PROJECT_INTRO: BlockIntroDoubleProps = {
  labels: ["The brief", "What we built"],
  activeLabel: 0,
  statement:
    "Shipping a parcel means guessing three things at once: which box, what it will cost, which carrier. PackShip answers all three from a LiDAR scan, a photo or a product name.",
  body: "A React Native app with the packing solver and the 3D view running on the phone, and an Express backend on Railway with Postgres and Redis that proxies UPS, FedEx and USPS rates and the dimension lookup. Measuring is ARKit with the LiDAR scanner. 349 Jest tests cover the app and 22 the backend. Version 1.2.0 is on the App Store.",
};

/**
 * Block 3 — `BlockWysiwyg`, the Outcome.
 *
 * Sits first, and ends by naming the two screens in the header image, so the
 * two sections after it (the solver, the rates) can lean on the cover as
 * their evidence instead of repeating it in the body — Task 8's
 * duplicate-cover trap. "20 by 14 by 10 inch" is printed on both phones of
 * the cover: the chosen box on the left, and on every rate row on the right.
 */
export const PROJECT_OUTCOME: BlockWysiwygProps = {
  title: "Outcome",
  body: [
    {
      type: "paragraph",
      text: "PackShip: Shipping Calculator is on the App Store at version 1.2.0, with a free tier and two subscriptions through RevenueCat. Every screen on this page is the app's own, captured on a Pro iPhone. The two at the top are the same package seen twice: the 20 by 14 by 10 inch box the solver chose, filled to 94.5 percent, and the rates quoted for it, cheapest first.",
    },
  ],
};

/**
 * Block 4 — `BlockWysiwyg`: the solver.
 *
 * Every mechanism here is cited in the dossier's Architecture decisions 1–4:
 * the catalogue, the three filters, the envelopes-first order, six orderings
 * by six rotations, first fit wins, the failure analysis that names the
 * blocking item, the five-package split, and the stability re-pack with its
 * three-percent fill tolerance.
 */
export const PROJECT_SOLVER: BlockWysiwygProps = {
  title: "Finding the box",
  body: [
    {
      type: "paragraph",
      text: "The solver runs on the phone. It starts from 149 boxes, envelopes and mailers across USPS, FedEx, UPS and the sizes a store sells, plus any custom box the user adds. It drops every one that is too small, too short for the longest item or rated under the items' weight, then tries the rest smallest first, with envelopes and mailers ahead of boxes because they ship cheaper. Each box gets six item orderings and each item six rotations. The first box that takes every item is the answer, drawn in 3D with the used volume against the box volume.",
    },
    {
      type: "paragraph",
      text: "When nothing fits, the app names the item that blocked the pack and the box that came closest, and offers to split the order across up to five packages. A second pass re-packs the chosen box for stability, so six thin items do not end up in one tall column that collapses in transit, and keeps that result only if stability improves and the fill rate drops by less than three percent. The app carries 349 Jest tests, 18 of the 31 files on the solver.",
    },
  ],
};

/**
 * Block 5 — `BlockWysiwyg`: the rate backend.
 *
 * Dossier decisions 5 and 6. The cover's right phone is the evidence for the
 * first paragraph (the sorted list, the Cheapest and Fastest marks); the
 * second paragraph is server behaviour with no screen, so it is carried by
 * the numbers.
 */
export const PROJECT_RATES: BlockWysiwygProps = {
  title: "Three carriers, one list",
  body: [
    {
      type: "paragraph",
      text: "Rates come from the carriers' own APIs through the backend, one call per carrier in parallel, so one carrier failing never blanks the other two. Each quote is cached in Redis for 15 minutes, keyed on the exact box, both zip codes, the weight and whether the address is residential, and the list comes back sorted cheapest first with the cheapest and the fastest marked. A user who links their own UPS, FedEx or USPS account gets their negotiated rates instead, and the account number is stored encrypted with AES-256-GCM.",
    },
    {
      type: "paragraph",
      text: "Each carrier sits behind a circuit breaker: three failures open it for two minutes, and the app is told at once that the carrier is unavailable. An expired OAuth token is refreshed and the call retried once before it can count as a failure. Rate lookups are metered per user, per month, in Postgres, 15 per carrier on the free tier, and the counter is a single atomic upsert, because two concurrent requests once collided on the same row.",
    },
  ],
};

/**
 * Block 6 — `BlockWysiwyg`: the three ways an item's dimensions get in.
 *
 * The replacement for the cut "on-device model" feature. Every noun is in the
 * code: the `AI` chip and scan icons on the form, `supportsFrameSemantics(
 * .sceneDepth)`, the 5-of-15-frame median sampling, `ARAnchor`s, and the two
 * named placement failures (`tracking_limited`, `no_surface`).
 */
export const PROJECT_MEASURE: BlockWysiwygProps = {
  title: "Getting the dimensions in",
  body: [
    {
      type: "paragraph",
      text: "Type the dimensions, tap the AI chip beside the name field to look them up, or tap the scan icon beside a field and measure it with the phone's LiDAR. The scan is ARKit with scene depth, so it needs a Pro iPhone. Each point is sampled across up to fifteen frames and placed at the median, then anchored in the room so it stays put while the phone moves. If tracking is limited or there is no surface under the crosshair, the app says so and places nothing.",
    },
  ],
};

/**
 * Block 7 — `BlockImageFull`: the form and the AR measure screen, side by
 * side. The evidence for the paragraph immediately above it. `priority`: it
 * is the first image after the header's own.
 */
export const PROJECT_IMAGE_MEASURE: BlockImageFullProps = {
  image: {
    src: `${IMAGES}/packship-measure.jpg`,
    alt: "Two PackShip screens: the Create Package form with an AI chip on the item name field and a scan icon beside each dimension, and the AR Measure Width screen showing a 6.5 inch width measured across a keyboard with a Use 6.5 inch button.",
    width: 1600,
    height: 1000,
  },
};

/**
 * Block 8 — `BlockWysiwyg`: the lookup and what it feeds.
 *
 * Dossier "Where the models are" and the supporting decision on the lookup:
 * `gpt-4o-mini` by name, `gpt-4o` to identify a photo, the confidence field
 * and the two rejected values, the 7-day Redis entry and the Postgres row.
 * Second paragraph: the account layer (Apple / Google / email sign-in, the
 * three saved-data tables, CSV import and export, `expo-print`).
 */
export const PROJECT_LOOKUP: BlockWysiwygProps = {
  title: "Looking an item up, and keeping it",
  body: [
    {
      type: "paragraph",
      text: "The lookup is a server call. The name, brand and model go to OpenAI, or a photo goes first to identify the product, and the answer comes back as dimensions in inches with a confidence level. The lookup refuses a low-confidence answer rather than guessing: anything below medium is rejected and the user is asked for a brand or model. A hit is cached for seven days in Redis and kept in Postgres, so the next request for the same product is served from the cache.",
    },
    {
      type: "paragraph",
      text: "What comes back is saved to the account, so the second time is a tap. Items and packages live in Postgres behind Apple, Google or email sign-in, import and export as CSV, and a rate list exports as a PDF.",
    },
  ],
};

/**
 * Block 9 — `BlockMediaDoubleQuote`: the library screens large, the lookup
 * result small with its own on-screen note as the quote.
 *
 * At `xl` the blockquote sits directly under the SMALL media, so the quote is
 * the lookup screen's own caption: "Dimensions retrieved from available
 * online resources." is printed on that screen under the weight row. The
 * lookup takes the small, portrait slot because it is a raw phone screenshot
 * (the site's 1179x2203 phone size, as `conversion.png` on the mechanic page);
 * the two library screens take the large slot as one landscape frame.
 *
 * The lookup image is evidence for "the answer comes back as dimensions in
 * inches with a confidence level" in the paragraph above: a high-confidence
 * success with the `AI Verified` badge. It does not show the refusal path;
 * that sentence rests on the code citation in the dossier.
 */
export const PROJECT_MEDIA_QUOTE: BlockMediaDoubleQuoteProps = {
  large: {
    type: "image",
    src: `${IMAGES}/packship-library.jpg`,
    alt: "Two PackShip screens: Saved Items listing an Xbox Series X, a wireless mouse, an iPhone 16 Pro and an AirTag with their dimensions, three of them tagged AI, and Saved Packages listing Office Supplies, Electronics and Books with item counts.",
    width: 1600,
    height: 1000,
  },
  small: {
    type: "image",
    src: `${IMAGES}/packship-lookup.jpg`,
    alt: "The AI Item Search result: Product Found, Microsoft Xbox Series X (1TB), an AI Verified badge, length 15.10, width 11.90, height 11.80 inches, weight 12 pounds, and a Save Item button.",
    width: 1179,
    height: 2203,
  },
  quote: "Dimensions retrieved from available online resources.",
};

/**
 * Block 10 — `BlockProjectDetails`.
 *
 * `Stack` is read by `projectIntroTabs` to fill the second intro tab and then
 * dropped from this table by `projectDetailsWithoutStack`, so it is written
 * once and printed once. It was "React Native, TypeScript, Three.js, Postgres,
 * Redis"; it now names the rest of what the manifests declare.
 *
 * `Tests` and `Deployment` are new, on the Task 8/9 pattern. The App Store row
 * keeps the source's own label and the address as it would be read aloud.
 */
export const PROJECT_DETAILS: ProjectDetail[] = [
  {
    label: "Stack",
    value: "React Native, Expo, TypeScript, Three.js, ARKit, Express, Postgres, Redis, OpenAI, RevenueCat, Railway",
  },
  { label: "Tests", value: "349 Jest on the app · 22 on the backend" },
  { label: "Deployment", value: "App Store 1.2.0 · Express backend on Railway" },
  { label: "Year", value: "2026" },
  { label: "Platform", value: "iOS" },
  {
    label: "App Store",
    value: "apps.apple.com/app/id6754204899",
    href: "https://apps.apple.com/app/id6754204899",
  },
];

/**
 * Block 11 — `GeneralCta`, the site's call-to-action band.
 *
 * Declared here rather than imported from `GeneralCta.tsx`: that block is a
 * `"use client"` module, so a plain value imported from it into a server
 * component arrives as a client-reference proxy and spreads to undefined
 * props. This file has no `"use client"`, so the value stays real.
 *
 * The line is this reader's own situation (`.agents/product-marketing.md` §1,
 * segment 3), and the action is `/contact/`, never the App Store link, which
 * stays in the table above as proof.
 */
export const PROJECT_CTA: GeneralCtaProps = {
  text: "Have an app that needs to reach the App Store?",
  label: "Contact",
  href: "/contact/",
};
