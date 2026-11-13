# Website Brief — client intake form

**Date:** 2026-11-13
**Status:** Plan, awaiting approval. Nothing built.

## What it is

A form at a private URL that Hamad sends to a prospective client after they reach out. The client says what kind of website they want, and the answers arrive in Hamad's inbox as one readable email he can reply to directly.

It is **not part of the public site**. Nothing links to it, it is left out of the sitemap, and search engines are told not to index it.

## Goals

- Anyone can fill it in: a restaurant owner on a phone as easily as a startup CTO on a laptop.
- Hamad shows up to the first call already knowing the business, the goal, the pages, the content, the timeline and, if they share it, the budget.
- A submission arrives as one email, grouped and readable, and **Reply** goes straight to the client.
- Hamad can send a personalised link (name and business filled in already).

## Non-goals (v1)

- No database or admin dashboard. The email is the record.
- No file uploads. Clients paste links (Google Drive, Dropbox, Instagram) and can reply to their confirmation email with attachments. (Uploads would need Vercel Blob, since Vercel caps a function request at 4.5 MB and Server Actions at 1 MB.)
- No intake for apps, SEO or AI work. The route and data shape leave room for those as later briefs (see "URL").
- No pricing or quote generated on the page.

## Anti-goals: what would make this a failure even if it works

- It reads like a technical questionnaire. Any unexplained jargon ("CMS", "hosting", "DNS", "integrations") counts as a bug.
- It feels long. Someone gives up halfway, and their answers are lost.
- A client can't tell whether it was sent. Any silent failure.
- Submissions fall into spam, or land in Hamad's inbox in a format he can't skim.

## Research findings (from the codebase and DNS)

| Finding | Consequence |
|---|---|
| The site has **no backend at all**: no API routes, no Server Actions, no forms. Every contact path is a `mailto:` (`src/components/site/contact/content.ts:90`). | This is the site's first server code. It needs one env var set in Vercel and in the Docker environment. |
| `neuragul.com` **already has Resend DNS records**: DKIM at `resend._domainkey.neuragul.com` and the return-path subdomain `send.neuragul.com` (MX `feedback-smtp.us-east-1.amazonses.com`, SPF `include:amazonses.com`). Hamad confirmed these are his, from an earlier setup that was never used. | A new Resend account verifies the **apex `neuragul.com`**. Replace the old DKIM value with the new account's. Mail goes out as `briefs@neuragul.com`. |
| `_dmarc.neuragul.com` is **`p=reject`** (relaxed alignment). | Until Resend shows the domain as Verified, every brief email is **rejected** outright, not sent to junk. The live send test must come after verification. |
| Inbound mail is Microsoft 365 (`neuragul-com.mail.protection.outlook.com`). | Hamad receives at `hamad@neuragul.com` as he does now. Nothing changes there. |
| Next 16.3 Server Actions (`node_modules/next/dist/docs/01-app/02-guides/forms.md`, `server-actions.md`): `<form action>` + `useActionState`, built-in Origin/Host CSRF check, 1 MB body cap, encrypted action IDs. | Use a Server Action, not an API route. It also works with JavaScript turned off. Text-only answers sit far below 1 MB. No closures, so `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` isn't needed for the Docker build. |
| Two deploy targets: Vercel (git push) and Docker (`NEXT_OUTPUT=standalone`). | A Server Action runs on both. The Resend call uses plain `fetch` (no SDK dependency). |
| Root layout sets `robots: index, follow` globally; `sitemap.ts` is a hand-maintained list. | The brief route overrides with `robots: { index: false, follow: false }` and is simply left out of `sitemap.ts`. **Not** `Disallow` in robots.txt: blocking the crawl would stop Google from ever seeing the noindex. |
| No zod, no form library, no test runner in the repo; the only UI primitive is `ui/button.tsx`. | Hand-written validator over a typed question schema; new field components built on site tokens. Verify with a Playwright script, as the other site probes do. |
| Site voice is "we" (team voice); buttons already get `cursor: pointer` globally; tokens `--ng-ink`, `--ng-muted`, `--ng-line`, `--ng-dark`, the Geist type. | Copy and styling follow the existing site. |

## URL

`https://www.neuragul.com/brief/website/` (my call). The `/brief/` parent leaves room for `/brief/app/` or `/brief/seo/` later. The link is private only because nobody publishes it; it isn't a secret, and that's fine for an intake form.

**Personalised links:** query params fill in fields that are visible and editable, never hidden ones:
`/brief/website/?name=Sarah%20Lee&business=Sarah's%20Bakery`
The greeting then says "Hi Sarah", which also tells the client the link was meant for them.

## The experience

1. **Intro screen.** "Tell us about the website you want." Says it takes about 10 minutes, that everything except four questions is optional, that "Not sure" is always a fine answer, and that progress is saved on this device. One "Start" button.
2. **Six short steps**, one topic each, with a progress bar ("Step 2 of 6 — Your business") and Back/Next. Next validates only that step's required fields.
3. **Review step.** Every answer, grouped, with "Edit" next to each section. Then "Send to NeuraGul".
4. **Thank-you screen.** "Thanks, Sarah. Hamad will read this himself and reply within one business day." Also says a copy has gone to their email.

Behaviour:
- **Autosave** to `localStorage` on every change, keyed to the route; restored on return with a "Welcome back, we kept your answers" line and a "Start over" link. Cleared after a successful send.
- **Progressive enhancement:** all steps live in a single `<form>`. With JavaScript, only the current step shows. Without JavaScript, every step renders as one long page and submits through the same Server Action.
- **Mobile first:** one column, 44px tap targets, chips that wrap, the right keyboard per field (`type="email"`, `type="tel"`, `inputmode="url"`).
- **Accessible:** every group is a `<fieldset>` with a `<legend>`; help text and errors are linked with `aria-describedby`; focus moves to the step heading when the step changes and to the first invalid field on error; errors are announced in an `aria-live` region.
- **Chrome:** a minimal header (wordmark only, links home) and no MainNavigation, footer or Lenis, so the form is the whole page. (My call.)

## The questions

Plain-language rules apply to every question:
- Every question can be answered without technical knowledge. Any term that needs explaining gets a one-line grey hint under it.
- Every multiple-choice question has a **"Not sure — help me decide"** option.
- Choices come first; free text is optional and comes second ("Anything to add?").
- **Required (4):** name, email, what the business does, what the website should do. Everything else is optional.

### Step 1 — About you
| Question | Type | Notes |
|---|---|---|
| Your name * | text | prefillable |
| Email * | email | used as Reply-To |
| Phone | tel | optional |
| Best way to reach you | single choice: Email / Phone call / Text | |
| Business or project name | text | prefillable |

### Step 2 — Your business
| Question | Type | Hint |
|---|---|---|
| What does your business do? * | short paragraph | "One or two sentences, the way you'd explain it to a new customer." |
| Who are your customers? | short paragraph | "e.g. families in Queens, restaurant owners, other businesses" |
| Where do you serve them? | single choice: One local area / Several areas or cities / Nationwide / Online, anywhere + text | |
| Do you have a website now? | Yes / No / Yes, but I want to start over | If yes: its address, and "What do you dislike about it?" |

### Step 3 — What the website should do
| Question | Type | Hint |
|---|---|---|
| What should the website do for you? * | multi choice: Bring in calls or quote requests · Let customers book appointments · Sell products online · Show off my work · Answer common customer questions · Make my business look established and trustworthy · Get found on Google · Something else (text) · Not sure | |
| If a visitor does just one thing, what should it be? | single choice: Call us · Fill out a form · Book a time · Buy something · Visit the shop · Other | Helps us design the page around one action. |
| Six months after launch, how will you know it worked? | short paragraph | "e.g. 10 more calls a week, fewer phone calls asking our hours" |

### Step 4 — Pages and features
| Question | Type | Hint |
|---|---|---|
| Which pages do you think you need? | multi choice: Home · About · Services · Pricing · Gallery or portfolio · Reviews · FAQ · Blog or news · Contact · Not sure — help me decide | |
| Which of these do you need? | multi choice with a one-line explainer each: Contact form · Online booking · Take payments · Online shop · Customer accounts / login · Show Google reviews · Map and directions · Blog you can update yourself · Site in more than one language · Not sure | |
| Do you already use any tools the site should work with? | text | "e.g. Square, Calendly, QuickBooks, Shopify, Mailchimp, a booking app. List any, or leave blank." |
| Roughly how many products or services will be listed? | single choice: Under 10 / 10–50 / 50+ / Not sure | Shown only if "Online shop" or "Services" is picked. |

### Step 5 — Look and content
| Question | Type | Hint |
|---|---|---|
| Do you have a logo? | Yes / No, I need one / I have one but want a refresh | |
| Brand colours | text | "If you have them. Leave blank if not." |
| What should the site feel like? | chips, pick up to 3: Modern · Warm and friendly · Bold · Clean and simple · Premium · Playful · Professional · Classic · Not sure | |
| Websites you like | up to 3 × (address + "what you like about it") | "Any website, not just ones in your industry." |
| Competitors or sites you don't want to look like | text | |
| Photos | single choice: I have professional photos / I have phone photos / I need photos / Not sure | |
| Who will write the words on the site? | I will / I'd like help writing it / Not sure | |
| Links to any files (logo, photos, menus) | text | "A Google Drive or Dropbox link works. You can also reply to your confirmation email with attachments." |

### Step 6 — Timing, budget and the practical bits
| Question | Type | Hint |
|---|---|---|
| Do you own a web address? | Yes (which one?) / No / Not sure what that means | Hint: "Your web address, like yourbusiness.com." |
| Do you have business email at that address? | Yes / No / Not sure | |
| After launch, who will update the site? | Me or my team / I'd like NeuraGul to / Not sure | |
| When do you need it? | As soon as possible / In 1–2 months / In 3+ months / By a specific date (date + "what's happening then?") / No rush | |
| Do you have a budget in mind? | short paragraph, **optional, open text** (no preset ranges, by Hamad's decision) | Hint: "Optional. A number, a range, or 'not sure yet' are all fine." |
| Who else is involved in the decision? | Just me / Me and a partner or team / Someone else decides | |
| Anything else we should know? | paragraph | |

### Review → Send

## Delivery

**Server Action `submitBrief`** (`src/app/brief/website/actions.ts`):
1. Spam checks, in order: a hidden honeypot field (if filled, pretend success and send nothing), and a minimum time-to-submit (the form renders a signed timestamp; under 8 seconds counts as a bot, so pretend success). These two are enough for an unpublished link. If spam shows up later, the next step is Vercel BotID.
2. Validate against the same question schema the form renders from (required fields, email shape, length caps: 200 chars per short field, 4,000 per paragraph, URLs normalised).
3. Send **two emails** through Resend's REST API (`POST https://api.resend.com/emails`, plain `fetch`):
   - **To Hamad.** From `NeuraGul Briefs <briefs@neuragul.com>`, To `BRIEF_TO_EMAIL`, **Reply-To the client**. Subject: `Website brief — {Business} ({Name})`. The body starts with a summary block (main goal, timeline, budget (if given), contact preference, phone), then each section with its answered questions only. Skipped questions are left out. Sent as HTML and plain text.
   - **To the client.** A short confirmation ("We've got it, and here's a copy of your answers"), Reply-To `hamad@neuragul.com`. This doubles as the channel for attachments. (My call. Easy to drop.)
4. Return `{ ok: true }` or `{ ok: false, message }`. If Hamad's email fails, the client sees: "Something went wrong sending this. Your answers are still saved here. Try again, or email hamad@neuragul.com," with a button that opens a pre-filled `mailto:` holding the plain-text version. Nothing is ever lost silently. A failed client confirmation is logged and doesn't fail the submission.

**Env vars** (Vercel project settings and the Docker runtime env; never committed):
- `RESEND_API_KEY` (required)
- `BRIEF_TO_EMAIL`, default `hamad@neuragul.com`
- `BRIEF_FROM_EMAIL`, default `NeuraGul Briefs <briefs@neuragul.com>`

Missing `RESEND_API_KEY` in dev → the action logs the rendered email to the server console and returns ok, so the form can be tested locally without sending mail.

## Files

```
src/app/brief/website/page.tsx        server page: metadata (noindex, no OG), reads ?name/?business, renders <BriefForm>
src/app/brief/website/actions.ts      'use server' submitBrief
src/components/site/brief/questions.ts  THE single source: steps, questions, options, hints, required flags, conditions
src/components/site/brief/BriefForm.tsx client wizard: steps, autosave, review, thank-you
src/components/site/brief/fields/     TextField, TextArea, ChoiceGroup (radio/checkbox chips), UrlList
src/lib/brief/validate.ts             schema-driven validation, shared by client step-checks and the action
src/lib/brief/renderEmail.ts          answers + questions.ts → { subject, html, text }
src/lib/email/resend.ts               ~30-line fetch wrapper
```

`questions.ts` drives the form, the validator **and** the email, so a reworded question stays consistent everywhere and nothing is copied by hand (see the "claims are not page-local" lesson).

**Not touched:** `sitemap.ts`, `robots.ts`, navigation, footer, `seo.ts`.

## Implementation tasks

1. **Schema.** Write `questions.ts` with the types (`Step`, `Question` as a discriminated union over `text | email | tel | paragraph | single | multi | urlList`, `showIf`) and the full content above.
2. **Validation + email rendering.** Write `validate.ts` and `renderEmail.ts`, both pure. Check them with a small `node --experimental-strip-types` script on a fixture answer set: required-missing, over-length, all-skipped-optional. Eyeball the HTML output in a browser.
3. **Resend wrapper + Server Action**, including honeypot, timing and the dev console fallback.
4. **Field components** on site tokens. Visible focus rings, error and hint wiring.
5. **`BriefForm`**: steps, progress, per-step validation, `useActionState`, autosave/restore, review, thank-you, error + mailto fallback, focus management.
6. **Page route** with noindex metadata, prefill params and the minimal header.
7. **Verification** (Playwright, through `scripts/guarded-dev.sh`):
   - full happy path at 390px and 1440px; check what was sent (dev console fallback) section by section
   - required-field errors appear, are announced, and focus moves
   - reload mid-form: answers restored; send: storage cleared
   - JS disabled: one long form submits successfully
   - prefill params land in fields and the greeting
   - built HTML of `/brief/website/` carries `noindex`; `/sitemap.xml` doesn't list it
   - look at every step on a phone-sized viewport before calling it done ("structural green is not visual green")
   - one real send with a real key to `delivered@resend.dev`, then one to Hamad, to check deliverability and that it lands in the inbox, not junk
8. `npm run check`.

## Resend setup (Hamad, about 15 minutes, can run in parallel with the build)

1. Sign up at resend.com as hamadgul1@gmail.com. That's only the login; it doesn't change any email addresses.
2. **Domains → Add domain → `neuragul.com`**, region us-east-1 (it matches the existing `send` MX).
3. At GoDaddy DNS: **edit** the existing `resend._domainkey` TXT and replace its value with the one Resend shows (each account has its own key). Check that the `send` MX and SPF TXT match what Resend shows; update them if not.
4. Click Verify in Resend and wait for "Verified". Required because of DMARC `p=reject`.
5. **API Keys → Create**, permission "Sending access", restricted to `neuragul.com`.
6. Vercel → Project → Settings → Environment Variables → `RESEND_API_KEY` (Production + Preview). Same in the Docker env if that's still deployed.

The build doesn't wait on this: without a key, the action prints the email to the server console in dev.

## Decisions (settled 2026-11-13)

1. **Budget:** an optional open text field, no preset ranges.
2. **Resend:** a new account (login hamadgul1@gmail.com) verifying `neuragul.com`; the old unused DKIM record gets the new key (see above).
3. **URL:** `/brief/website/`.

## Calls I made (veto any)

- Multi-step wizard rather than one long page; one long page only with JS off.
- Only 4 required questions.
- Confirmation copy goes to the client.
- No file uploads in v1; links + reply-with-attachments instead.
- Honeypot + timing, no CAPTCHA.
- Minimal header, no site nav/footer on the form page.
- Plain `fetch` to Resend instead of adding the `resend` package; no zod.
