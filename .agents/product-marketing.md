# Product marketing context — NeuraGul case studies

Read by `marketing-skills:copywriting` before drafting any of the ten case
studies at `/work/<slug>/`. This file exists so ten separate copy passes land
on one shared answer instead of ten invented ones. It follows the shape the
copywriting skill asks for (Page Purpose, Audience, Product/Offer, Context),
plus Voice, which the skill treats as a separate pre-writing decision.

Every claim below is either (a) traced to a specific file in this repo, cited
inline, or (b) labelled **Editorial decision**. Anything neither of those is
listed under **Open questions** at the bottom instead of being guessed at. Do
not upgrade an open question to a fact while drafting a case study — if a
page needs the answer, write around the gap or flag it back to the user in
that task's report, the same way this file does.

## 1. Page purpose

**Page type:** case study (`/work/<slug>/`), one per shipped project. Eleven
exist: `src/components/site/work/{delivery-routing, packship,
foodtruckrentals, new-york-fine-foods, new-york-mobile-mechanic,
restaurant-ordering-portal, yankocy, halal-bridal, landscape-drainage-proz, rwd-pipeline,
hasina-hijama-cupping}`.

**The one primary action:** get the reader to `/contact/`. Concretely, the
`GeneralCta` block (`src/components/site/shared/blocks/GeneralCta.tsx`),
which closes every case study, every linked service page, `/`, `/about/`,
`/work/` and `/process/` (2026-09-13). Each band is a pair: the line names
the reader's own problem as a question ("Still planning the day by hand?"),
and the button label names the next step in plain words ("Tell us how your
morning runs", "Start with a half-hour call"). The label is never the bare
noun "Contact": a question answered with a page name converts worse than one
answered with an action, and every label has to stay true to what
`/contact/` actually is — an email address and a phone number, read by
Hamad, so "Send us last month's bill" is honest and "Book a call" (there is
no scheduler) is not. A case study is not the close —
it is the proof that de-risks the close. Its job is to get a reader who does
not yet trust this studio to click through to `/contact/`, not to sell them
on the page itself.

**Editorial decision:** every case study's CTA should point to `/contact/`,
not to a project's own live URL or App Store listing. Those links belong
inside the page (and already exist, e.g. `PROJECT_DETAILS` App Store row in
`src/components/site/work/packship/content.ts:150-159`) as supporting proof,
but the page's one asked-for action is still contact, because that is the
only conversion event this business currently has.

**Language for the CTA line itself:** follow `/process/`'s existing pattern
— a short, second-person or imperative line naming the reader's problem, not
a generic "Ready to get started?" Reuse "Tell us what's broken." where nothing
more specific fits, but prefer a line specific to that project's own domain
(e.g., something a reader running a similarly messy dispatch process, or a
similarly manual quoting workflow, would recognize) when the case study
supports one.

## 2. Audience

NeuraGul's shipped work spans three real audience segments, confirmed by
`src/components/site/work/content.ts` (the `PORTFOLIO_PROJECTS` list) and the
service pages under `src/components/site/services/`:

1. **Local service-business owners** — restaurants, mechanics, a landscaping
   company, a building-materials wholesaler, a bridal store, a cupping practice. Not software people. They
   want a site or a small system that works, ranks, and does not need them to
   think about it again. Represented by New York Fine Foods, New York Mobile
   Mechanic, the restaurant ordering portal, Yankocy, Halal Bridal, Landscape Drainage Proz,
   Hasina Hijama Cupping.
2. **Operationally-stretched small companies with a real production
   problem** — a business running a manual, error-prone process (a
   dispatcher planning routes by hand) that is willing to pay for software
   that removes the manual step and can be measured. Represented by the
   delivery routing platform (`src/components/site/work/delivery-routing/
   content.ts`) and the real-world-data pipeline.
3. **Consumer-product builders** — someone who wants a polished, App
   Store-shippable product, evidenced by working code rather than a deck.
   Represented by PackShip.

**Editorial decision:** do not collapse these into one persona. A case study
should write to the segment its own project belongs to — the routing
platform's reader is not shopping for the same thing New York Fine Foods'
reader is — but every case study still has to be legible to a stranger from
any of the three segments, because `/work/` puts all ten in one feed and a
reader browses across segments before picking a project to read in full.

**The problem they're trying to solve:** something specific and currently
costing them time or money that they can already describe — a manual
process, a slow or outdated site, a guess they have to make repeatedly (what
box, what carrier, what it will cost). Not "we need digital transformation."
Every existing case study opens on a concrete brief stated as a problem, not
a category (see `PROJECT_INTRO.statement` in `delivery-routing/content.ts`
and `packship/content.ts`) — new case studies should match that shape.

**Objections a prospect brings to a case study specifically** (as opposed to
the homepage or About):
- *"Is this a solo freelancer who'll disappear?"* — answered by the site's
  established, checkable claims: "you always know who is on your project,
  and the same people are still reachable six months after launch"
  (`src/components/site/home/content.ts:210`), and the `/process/` step 04
  promise that Hamad holds the pager after launch
  (`src/components/site/process/content.ts:173-175`). Never answered by a
  headcount claim (see Voice, below).
- *"Can they actually do this kind of work, or is this their one good
  project?"* — answered by naming the real stack and real numbers already in
  each project's own content (1,278 tests, 141 Vitest tests, Fly.io
  production deployment, a live App Store listing) rather than by adjectives.
- *"Will they understand a business like mine, not just a tech company?"*
  — answered by the range itself: the same studio shipped a Shopify
  storefront for a drainage-products dealer and a Python/OR-Tools solver for
  a dispatcher.
  A case study should not hide this range or apologize for it; state the
  specific project's specific domain confidently.
- *"What does this cost, and how long does it take?"* — the honest, already
  established answer is process, not a number: a call, then "a written
  scope, a fixed price, and a date" (`src/components/site/process/
  content.ts:163-165`), decided before any code is written. A case study
  should not quote a price or a duration for its own project (none is
  recorded anywhere in the repo) — if a reader needs that, `/process/` and
  `/contact/` are where they get it. A case study's job is to make the
  reader curious enough to have that half-hour call, not to pre-empt it with
  invented numbers.
- *"Is this confidential / will they talk about my business the way they
  talk about this one?"* — the delivery routing platform's own copy already
  handles this by example: "The client is not named here, and the
  screenshots below run on synthetic data"
  (`src/components/site/work/delivery-routing/content.ts:166`). Preserve
  that pattern anywhere else client confidentiality applies; do not invent a
  client name to make a case study feel more concrete.

**Customer language:** mirror the plain, non-jargon phrasing already in the
shipped copy — "a messy export of the day's tickets," "guessing three things
at once," "skip delivery-app commissions" — over category words like
"streamline," "optimize," "digital transformation," "leverage."

## 3. Product / offer

**What's being sold:** custom software development across five real service
lines, all live routes: **Applied AI** (with four children: AI Strategy,
Custom Models, Retrieval & Agents, Evaluation & Guardrails), **Web
Development**, **App Development**, **Cloud & Infrastructure**, **Data
Intelligence** (`src/components/site/home/content.ts:91-197`,
`HERO_CARDS`; the same five lines again as `SERVICE_LINKS` at `:330-336`). A case study is evidence for one or more of these lines —
check `services`/`topServices` on that project's entry in
`src/components/site/work/content.ts` before writing, since that is the
service claim the page has to support.

**Differentiation, as the site already states it (not invented for this
file):** the person who scopes a project is also one of the people who
builds it, and the same people stay reachable after launch
(`src/components/site/home/content.ts:210`,
`src/components/site/about/content.ts:130-137`). Engagements get a written
scope, a fixed price, and a date before work starts
(`src/components/site/process/content.ts:163-165`). Work is delivered
incrementally and visibly rather than disappearing for months
(`src/components/site/process/content.ts:166-169`). None of this is a claim
about size or speed — it is a claim about who is accountable and when you
find out if something was misunderstood.

**The transformation each case study should land on:** a specific before →
after that a reader can picture, phrased as the reader's own outcome, not a
feature list — e.g., "one dispatcher planning six vans by hand" →
"upload to printed routes in minutes, with every ticket accounted for"
(`PROJECT_HEADER.lead`, `delivery-routing/content.ts:76`). Every existing
case study already does this in its header `lead`; match that pattern.

**Proof points available (verifiable, use these, do not invent others):**
- Delivery routing platform: 1,278 tests, Google OR-Tools, live traffic
  routing, fail-closed geocoding, a per-solve travel-matrix budget, in daily
  production use on Fly.io.
- PackShip: live on the App Store (`apps.apple.com/app/id6754204899`), LiDAR
  measuring on Pro iPhones, an on-device packing solver (18 of the app's 31 Jest
  test files cover it; 349 tests across the app) with a live 3D view, a
  name-or-photo dimension lookup with a confidence gate, three-carrier live rate
  comparison.
- Food Truck Rentals: 141 Vitest tests, a price module that generates the
  machine-readable price sheet and the JSON-LD offers on seven pages (with a
  test that fails on any superseded price in page copy), one owner page per
  search query, a Next.js 16 build.
- The other seven projects (New York Fine Foods, New York Mobile Mechanic,
  the restaurant ordering portal, Yankocy, Halal Bridal, Landscape Drainage Proz, the
  real-world-data pipeline, Hasina Hijama Cupping): read that project's own
  `content.ts` and, once it exists, its dossier under
  `docs/research/case-studies/` for its specific verifiable numbers — do not
  reuse routing's or PackShip's numbers on a different project.

**What is not proof, and must not be dressed up as it:** adjectives with no
number behind them ("cutting-edge," "seamless," "robust"). If a case study
has no number worth citing for a given claim, state the mechanism instead
(what the code actually does, per the Voice rule below on checkable nouns)
rather than reaching for an adjective.

## 4. Context

**Where traffic to a case study likely comes from:** organic search (each
page has its own `PROJECT_TITLE`/`PROJECT_DESCRIPTION` meta pair aimed at a
category + client query, e.g. "Delivery Routing Software for a Van Fleet"),
the `/work/` index, and the homepage's six-project grid
(`PROJECTS_ROW_ONE`/`PROJECTS_ROW_TWO`,
`src/components/site/home/content.ts:241-328`). A reader arriving at a case
study has typically already seen the homepage's positioning ("We build the
software that small companies run on") or a search snippet naming the
category of work — they are not cold to the studio's existence the way a
paid-ad landing page visitor might be.

**What they already know before arriving:** little to nothing about
NeuraGul specifically beyond what a search snippet or the `/work/` grid told
them. They do not know Hamad Gul's name, the "Talk. Scope. Build. Stay."
process, or the no-headcount-claim stance unless the case study or an
adjacent page tells them. Do not assume prior context from `/about/` or
`/process/` — a case study should be able to stand alone, and should link to
`/process/` or `/contact/` rather than re-explain the whole engagement
model inline.

## Voice — non-negotiable, verbatim rules

These two are established site-wide and must not be relaxed for a case
study:

1. **The site says "we," never "I."** Source: comments in
   `src/components/site/home/content.ts:9`, `about/content.ts:8-9`,
   `work/delivery-routing/content.ts:23`, `work/packship/content.ts:21`, and
   restated in the memory note `neuragul-team-voice.md`.
2. **Nothing claims a headcount, a capacity, or a team size.** Source:
   `src/components/site/home/content.ts:15-16`, `about/content.ts:13-14`.
   The About page deleted two capacity claims outright rather than inverting
   them into a boast about being bigger (`about/content.ts:190-194`) — do
   the same in a case study: if a sentence would only make sense with a
   headcount behind it, cut the sentence, don't add the number.

**Supporting rules already established for this site's copy** (apply these
too, they're just not marked verbatim in the brief):
- Hamad Gul is named only at a small number of deliberate human moments —
  the contact promise, About's "who you'd be working with," and the
  `/process/` "we stay on after launch" step. He is "your primary point of
  contact and one of the developers on your project." **A case study is not
  automatically one of those moments** — most case studies should stay in
  "we" throughout. Only name him if a specific project has its own
  Hamad-specific human beat (there is no evidence any of the ten currently
  needs one); when in doubt, don't.
- No "X, not Y" antithesis constructions.
- At most three em dashes per content block.
- Prefer a checkable number over an adjective wherever one exists (this is
  the discipline behind every proof point in section 3 above).
- Confident, direct, specific — per the copywriting skill's own style rules:
  simple words over jargon, active voice, no exclamation points, no
  "streamline/optimize/leverage"-class buzzwords.
- Formality: professional but plain-spoken, not corporate and not
  performatively casual. The existing case studies read like an engineer
  describing what they built to another competent person — technical
  vocabulary is fine (OR-Tools, Redis, JSON-LD) when it's accurate, but
  never decorative.

## Open questions for the user

These matter to a prospect and are not answered anywhere in this repo. Do
not invent answers to them while drafting a case study — write around the
gap (as the existing pages already do, by never quoting a price or a
duration) and, if a specific case study genuinely needs one of these to make
its argument, flag it in that task's report rather than filling it in.

1. **Typical engagement length / timeline.** `/process/` promises "working
   software lands in the first couple of weeks, then every week after
   that," but there is no stated typical total project length for any
   segment (a marketing site vs. a production routing system are surely
   different). Should case studies ever state a specific project's own
   actual timeline, if the user can supply one per project?
2. **Pricing model and range.** The site commits to "a written scope, a
   fixed price, and a date" but no number or range appears anywhere,
   for any segment. Fine to leave case studies silent on this — but confirm
   that's intended rather than an oversight.
3. **Cost of the initial call.** `/process/` step 01 does not say whether
   the half-hour scoping call is free. Case study CTAs should probably not
   imply a specific answer either way; confirm.
4. **Whether case studies should ever name a client.** Only the delivery
   routing platform explicitly withholds a client name; the other nine name
   the business (New York Fine Foods, Yankocy, etc.) but none states whether
   that's the actual legal/trade name and disclosed with permission, or an
   internal project label. Worth a one-line confirmation before ten pages
   go live citing named businesses.
5. **How long "we stay on after launch" actually lasts.** The home page
   says "the same people are still reachable six months after launch"; the
   process page says Hamad "hands over once your team wants it." These are
   two different framings (a fixed window vs. indefinite until the client
   asks to stop) — worth reconciling so a case study doesn't accidentally
   pick the wrong one.
