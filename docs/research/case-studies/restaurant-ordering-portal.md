# Restaurant ordering portal — case-study dossier

Source of record: `~/Projects/PizzeriaSoftware` (private, read-only for this work). Nothing in
this file was taken from memory; every line names the file or command it came from. Line
numbers are as of HEAD `4d3effe` (main, 150 commits, 2026-04-13 → 2026-04-18).

The page it backs: `/work/restaurant-ordering-portal/` —
`src/components/site/work/restaurant-ordering-portal/content.ts` and
`src/app/work/restaurant-ordering-portal/page.tsx`.

**What the repo is.** A template, not a one-off: `README.md:3` — "Clone once per restaurant,
configure five files, deploy to Vercel. Customers order online; Square handles payments; the
kitchen sees orders in Square POS as normal." Each restaurant is "a completely independent
deployment — separate Vercel project, separate database, separate Square account"
(`README.md:509`). The live demo at `pizzeria-software.vercel.app` (200 on 2026-09-11) is one
such deployment running against a Square **sandbox**; its restaurant name and address are
`config_overrides` rows, not code — `restaurant.config.ts:15-16` still says `Joe's Pizza`,
`123 Main St`.

**Credentials.** The repo's gitignored `.env.local` holds a Neon `DATABASE_URL` and a Square
sandbox token. For the captures, `DATABASE_URL` and every `PG*`/`POSTGRES_URL*`/`AUTH_*`/
`NEXTAUTH_*` key were overridden on the command line so the app ran against a scratch
Postgres; the Square sandbox token was allowed to load (user ruling, reads only). No value
from that file appears here. See **Shot list**.

---

## Stack (verified)

Read from `package.json` on 2026-09-11. Carets are the declared ranges; `node_modules/next`
resolves to 16.2.4.

| Package | Declared | What it does here |
| --- | --- | --- |
| `next ^16.2.3`, `react 19.2.4`, `react-dom 19.2.4` | App Router, all routes under `app/` | 6 admin pages, 3 customer pages, 20 `route.ts` API handlers |
| `typescript ^5.9.3` | strict, `@/` alias | — |
| `tailwindcss ^4` + `@tailwindcss/postcss` | styling | dark theme, `--brand` colour from config |
| `square ^44.0.1` | Square Node SDK | catalog (menu), orders, payments, webhooks |
| `next-auth ^5.0.0-beta.30` + `bcryptjs ^3.0.3` | admin login | credentials provider, bcrypt cost 12 (`scripts/create-admin.ts:19`), JWT session |
| `postgres ^3.4.9` | postgres.js client | 5 tables (`scripts/migrate.ts`): `admin_users`, `config_overrides`, `hidden_items`, `delivery_dispatches`, `sms_sent` |
| `twilio ^5.13.1` | customer SMS | confirmation, ready, dispatched, delayed, admin alert |
| `@vercel/blob ^2.3.3` | logo upload | `app/api/admin/upload-logo/route.ts`, 2MB cap |
| `recharts ^3.8.1` | analytics chart | `app/admin/analytics/page.tsx` |

Dev: `jest ^30.3.0`, `jest-environment-jsdom`, Testing Library (`react`, `dom`, `user-event`,
`jest-dom`), `eslint ^9` + `eslint-config-next 16.2.3`, `tsx` for the two CLI scripts.

**Deployment** — `README.md:164-165, 190, 226`: Vercel, Neon Postgres via the Vercel
Marketplace, Vercel Blob for logos. Two GitHub Actions workflows: `.github/workflows/ci.yml`
runs `npm ci && npm test -- --ci` on every push to `main` and every PR; `retry-dispatches.yml`
runs `*/5 * * * *` and POSTs to `/api/cron/retry-dispatches` with `CRON_SECRET`, because Vercel
Hobby limits crons to daily and "isn't fast enough for courier retries" (`README.md:282`).

**External services the app talks to** — Square (catalog, orders, payments, webhook), Twilio
(SMS), Google Geocoding (in-house delivery radius; not needed when delivery is off,
`README.md:135`), Uber Direct (optional courier dispatch), Vercel Blob.

---

## Architecture decisions

Six that cost real work and that a reader can check, each cited.

**1. Square is the only order database.** `README.md:69` — "No separate database for orders —
Square is the source of truth for all orders and payments." The admin Orders feed is a live
`client.orders.search` (`app/api/admin/orders/route.ts:19-26`, limit 200), Analytics is a
second `orders.search` filtered to `COMPLETED` over 7/30/90 days
(`app/api/admin/analytics/route.ts:11-38`), and the customer's order is created with
`client.orders.create` (`app/api/create-order/route.ts`). There is nothing to keep in sync
with the POS because the portal writes to the same place the till does.

**2. Payment amount is never trusted from the browser.** `app/api/pay/route.ts:32-36` —
"Fetch the order server-side — never trust the client-supplied amount": the handler reads the
order's `totalMoney` from Square and charges that. The idempotency key is `pay-${orderId}`
(`:40-44`), "on network retry, Square will return the original payment instead of charging
twice." The card form itself is a Square-hosted iframe (Web Payments SDK), which is why
`next.config.ts` carries a CSP whose `script-src`, `frame-src` and `connect-src` enumerate the
Square hosts and nothing else.

**3. Configuration has three layers and the database wins.** `restaurant.config.ts:6-10` —
"Runtime config lives in the `config_overrides` table and wins over these defaults … Env vars
are used as first-boot fallbacks before any DB override exists." Mechanism:
`lib/config-resolved.ts::getResolvedConfig` deep-copies the static config, then applies every
`config_overrides` row by dotted path (`setPath`, which refuses `__proto__`/`prototype`/
`constructor` segments, `:11-32`); a 2-second cache (`TTL_MS = 2_000`, `:102`) is invalidated
on every admin save. The write side is `app/api/admin/config/route.ts`: 44 `ALLOWED_KEYS`
(`:8-53`), type-validated per key shape (cents/miles/days must be finite non-negative numbers,
hours must be both `HH:MM` or both empty, logo URLs must be same-origin or `https://`), and
five `SECRET_KEYS` — `sms.authToken`, the two Uber secrets, `square.accessToken`,
`square.webhookSignatureKey` — are returned by GET as `••••` + last four characters
(`maskSecret`, `:66-70`), and a POST whose value still starts with `••••` is treated as
"no change" and skipped (`:174-175`), so the placeholder can never overwrite the secret. On
screen this is the difference between the file's `Joe's Pizza` and the running app's
`NeuraGul's Restaurant`.

**4. Hours are computed in the restaurant's timezone, and "closed today" is a dated row.**
`README.md:71` and `lib/config-resolved.ts:58-90`: the open/closed decision formats `now` in
`config.timezone` with `Intl.DateTimeFormat`, never server-local time (Vercel runs UTC). The
Orders page's open/closed toggle writes `hours.<today>` as `{open:'FORCE',close:'FORCE'}` or
`{open:'',close:''}` (`app/api/admin/close-today/route.ts:64-66`), and the general config POST
refuses to write `FORCE` (`config/route.ts:133-141`), so only that toggle can force the store
open. One caution for the copy: the route's comment says the override is "keyed to today's
date so it expires automatically at midnight", but the key is the **weekday**
(`hours.friday`) and nothing in the repo clears it, so the same weekday next week inherits it
until the admin flips the switch or saves that day's hours. The page therefore says the switch
"overrides today's hours and leaves the rest of the week alone", which is what the code does,
and never says it expires.

**5. At-least-once webhooks are answered with send-once ledgers.** Square retries any
non-2xx, so the webhook handler verifies the HMAC-SHA256 signature over `notificationUrl +
body` with `timingSafeEqual` and fails closed when the key is missing
(`app/api/webhooks/square/route.ts:14-30`), then returns 200 on every path after that, even
on internal error (`:220-224`, "Square retries on non-2xx which causes duplicate SMS"). The
"order ready" text is guarded by `lib/sms-dedupe.ts::claimSmsSend` — an `INSERT … ON CONFLICT
DO NOTHING RETURNING` into `sms_sent (order_id, sms_type)` — so the second delivery of the same
`PREPARED` event finds the row and sends nothing. Courier dispatch is guarded the same way one
level up: `lib/delivery/db.ts::claimPendingDispatch` is a single `UPDATE … WHERE status =
'PENDING'` whose row count decides which of two concurrent webhooks owns the dispatch (the
comment names the two races, DI1 and DI4). And when Uber has accepted but the DB write fails,
the code logs loudly and deliberately does **not** retry — a retry "would create a duplicate
courier" (`webhooks/square/route.ts:160-179`).

**6. Delivery is a provider behind an interface, switchable from the admin.**
`lib/delivery/types.ts` — `DeliveryProvider { quote, dispatch, cancel?, getStatus? }`;
`lib/delivery/provider.ts::getProvider` returns `InHouseProvider` (flat fee, radius check via
Google Geocoding from the restaurant's own address) or `UberDirectProvider` (live quote passed
through to the customer, courier dispatched on the kitchen's PREPARED webhook) according to
`delivery.provider` — an admin-editable key, so "switch between in-house drivers and Uber
Direct without a redeploy" (`README.md:23`). A failed dispatch is tried three times in all —
one attempt plus two retries, due no sooner than 30s and then 120s later (`MAX_ATTEMPTS = 3`,
`lib/delivery/retry.ts:1-8`) — and actually re-run by the 5-minute cron, which is the only
retry driver (`webhooks/square/route.ts:141-144`: the in-process timer was removed).

Smaller, also checkable: an in-memory sliding-window rate limiter on five endpoints
(`lib/rate-limit.ts`; pay and create-order 10/min, validate-address 30/min, change-password
5/min, login 10/min); a structured one-JSON-line logger (`lib/log.ts`); no self-signup — admin
users are seeded by `scripts/create-admin.ts` (`docs/features.md`, "Admin security").

---

## Gaps — in the repo, absent from the page

The shipped page's entire technical content is one sentence: "Commission-free online
ordering that plugs straight into a restaurant's existing Square POS. Orders, payments, and
SMS updates all flow through with nobody skimming the check." Everything below is real,
checkable, and unmentioned. Ordered by how much a restaurant owner would care.

1. **There is a back office.** Six admin pages — `/admin/orders`, `/admin/analytics`,
   `/admin/menu`, `/admin/integrations`, `/admin/settings`, `/admin/login`
   (`app/admin/*/page.tsx`) — behind NextAuth credentials (`proxy.ts` redirects every
   `/admin/:path*` without a session). The page said nothing about anyone operating the
   portal after launch.
2. **Every operational setting changes without a redeploy.** Name, address, timezone, logo,
   per-day hours, delivery on/off, fee, radius, minimum order, prep time, days ahead, order
   cutoff, ready-time estimates, all seven SMS templates, and every credential: 44 keys in
   `ALLOWED_KEYS`. This is the config-precedence system (decision 3).
3. **A one-tap open/closed switch** on the Orders page that overrides today's weekday's hours
   in either direction until the admin flips it back or saves that day's hours (decision 4).
4. **Menu visibility from the admin, POS untouched.** `hidden_items` is keyed by Square item
   id; `getMenu()` filters the customer portal only (`lib/menu.ts:119-133`), and the admin
   Menu page lists everything (`app/api/admin/menu-items/route.ts`, "admin sees everything").
5. **The integration surface is editable, and secrets are masked.** `/admin/integrations`
   edits Square, Twilio and Uber credentials plus templates; five secret keys never come back
   to the browser in full (decision 3).
6. **Scheduled orders with a cutoff.** ASAP or a day-and-time picker clamped to real hours
   minus `orderCutoffMinutes`, at most `maxDaysAhead` out (`restaurant.config.ts:74-90`,
   `components/CheckoutForm.tsx`).
7. **Two delivery models behind one interface**, including on-demand Uber Direct couriers
   with retry, tracking link and failure alerts (decision 6).
8. **Duplicate-safe SMS and dispatch** under webhook retries (decision 5).
9. **Analytics straight from Square** — revenue, order count, average order, pickup vs
   delivery, most popular item, a daily revenue bar chart, for 7/30/90 days.
10. **Server-side price verification, idempotent payment, HMAC-verified webhook, CSP,
    rate limits** (decisions 2 and 5).
11. **154 tests and CI on every push** (`__tests__/`, `.github/workflows/ci.yml`).
12. **Logo upload to Vercel Blob** from the settings page, live on the next page load.

Items 1, 2, 3, 5 and 7 are why the page gains a back-office section and a "what changes
without a developer" section; 6, 8, 9 and 10 are named in passing beside the screenshot that
shows them; 11 goes in the details table; 12 and the audio alert on new orders are recorded
here and left off the page as operator detail.

---

## Audience, objection, primary action

Per `.agents/product-marketing.md` §2, this project's reader is segment 1 — **a local
service-business owner**, specifically a restaurant that currently pays marketplace apps a cut
of every order. Not a software buyer; they will not read a stack list first.

**The objection this page has to answer.** Not "can you build a website" — it is *"if I leave
the apps, who runs this? When I change my hours, 86 a dish, or want to close early on a
Tuesday, do I have to call a developer?"* The whole back office is the answer to that, and the
config-precedence mechanism is why the answer is honest: every one of those changes is a row in
a table that beats the code. The page should argue **operability**, not commission maths.

**Secondary objection.** *"Will this break my kitchen?"* — answered by decision 1: the order
lands in Square POS as a normal ticket; there is no second system to reconcile.

**Tertiary**, per `product-marketing.md` §2: *"is this their one good project?"* — answered by
naming the real stack and the real numbers (154 tests, CI, the five tables, the retry ladder).

**The primary action** is `/contact/` via `GeneralCta`, which this task adds. The CTA line
names this reader's own situation (commissions on every order), not `/process/`'s general
"Tell us what's broken."

**What the page must not do:** quote a price or a monthly cost (`docs/features.md` has a
"~$5 infra" line and a 15–30% commission comparison table; neither is in code and neither is
written), quote a timeline, or claim a named restaurant runs it (see Unverifiable).

---

## Verifiable numbers

Each with the command that proves it. Run from `~/Projects/PizzeriaSoftware`.

| Number | Command / location |
| --- | --- |
| **154** tests (153 pass, 1 skipped) | `npx jest --ci --maxWorkers=4 --reporters=default 2>&1 \| tail -5` — the skipped suite is `uber-api-contract.test.ts`, `describe.skip` unless `UBER_SANDBOX_CUSTOMER_ID` is set |
| **23** test files | `npx jest --listTests \| wc -l` |
| **20** API route handlers | `find app/api -name route.ts \| wc -l` |
| **6** admin pages | `ls app/admin/*/page.tsx \| wc -l` |
| **44** admin-editable config keys | `ALLOWED_KEYS`, `app/api/admin/config/route.ts:8-53` |
| **5** masked secret keys | `SECRET_KEYS`, `app/api/admin/config/route.ts:57-63` |
| **5** database tables | `scripts/migrate.ts` — `admin_users`, `config_overrides`, `hidden_items`, `delivery_dispatches`, `sms_sent` |
| **7** SMS templates | `restaurant.config.ts:116-131`, `sms.templates` |
| **3** dispatch attempts, **30s** / **120s** | `lib/delivery/retry.ts:1-7` |
| every **5** minutes | `.github/workflows/retry-dispatches.yml:10`, `cron: '*/5 * * * *'` |
| **2s** config cache, **30s** menu cache | `lib/config-resolved.ts:102`, `lib/menu.ts:100` |
| **5** rate-limited endpoints (10, 10, 30, 5, 10 per minute) | `grep -rn "checkRateLimit(" app/api` |
| **200** orders per feed, **500** per analytics window | `app/api/admin/orders/route.ts:24`, `analytics/route.ts:38` |
| **7 / 30 / 90**-day analytics windows | `ALLOWED_DAYS`, `app/api/admin/analytics/route.ts:11` |
| Orders feed refreshes every **30s** | `app/admin/orders/page.tsx:197` (`README.md:19` says 50 orders / 60s — the code is the record) |
| **2MB** logo cap, PNG/JPEG/WebP/SVG/GIF | `app/api/admin/upload-logo/route.ts:8-14` |
| bcrypt cost **12** | `scripts/create-admin.ts:19` |
| **150** commits, 2026-04-13 → 2026-04-18 | `git rev-list --count HEAD`; `git log --format=%ad --date=short` |
| Live demo **200** | `curl -s -o /dev/null -w "%{http_code}" -L https://pizzeria-software.vercel.app/` |

**Numbers deliberately NOT used on the page:** 20 route files, 23 test files, 150 commits,
the cache TTLs, the feed limits. True, but a reader cannot tell whether 20 routes is good. The
test count, the table count and the retry ladder carry weight; file counts do not.

---

## Unverifiable claims

For the user. **Not written on the page**, and no later task should promote one to a fact.

1. **"A punishing cut."** The brief's opening (`PROJECT_INTRO.statement`, pre-existing) does
   not quote a figure, which is right: the only numbers in the repo are `docs/features.md`'s
   comparison table (15–30%+), which is the author's own summary of third-party pricing, not
   something the code proves. **Answered by the user on 2026-09-13**: the client "used to pay 20%
   now they just pay the payment processing fee that they were already paying". The brief now
   says so, in `PROJECT_INTRO.statement` only; "punishing cut" is gone.
2. **"Keep the full value of every order"** (the pre-existing header `lead`). Square still
   charges its processing fee — `docs/features.md:3` itself says "beyond Square's standard
   transaction fee." **Rewritten** in this task to a claim the repo supports: no commission,
   orders land in the restaurant's own Square account. Flagged so the user sees the change.
3. **Any restaurant running this in production.** The repo is a template; the only deployment
   evidenced is the sandbox demo at `pizzeria-software.vercel.app`. The page keeps the `Live
   demo` row and never names a client. `location: "2026 · Product"` is left as is.
4. **Monthly running cost** (`docs/features.md`, "~$5 infra"). Not in code. Not written.
5. **Setup timeline** (`docs/features.md`, "typical setup timeline"). Per
   `product-marketing.md` open question 1, not written.
6. **Order volume, revenue, or time saved.** The screenshots show Square **sandbox** test
   orders; no real volume exists anywhere in the repo. The page says the screenshots run
   against a sandbox and shows no totals as if they were real.

---

## Shot list

Captures at 1600x1000; the cover (`pizzeria.jpg`, 1200x750) is **not re-captured** — it already
shows the storefront menu under the sandbox catalog, and it is shared with `/`, `/about/`,
`/services/cloud-infrastructure/` and `/process/`, all of whose `alt` strings describe exactly
that ("The restaurant's own online ordering portal"). Grepped before deciding, per the Task 8
rule.

**How the app was run.** Addendum rules 1–3 throughout: inferred-root check, then
`scripts/guarded-dev.sh --limit-mb 4096 --max-secs 3600 -- npx next dev --port 3103`, one
server at a time. A scratch Postgres 14 (`initdb` into `$SCRATCH/pgdata`, port 5433, user
`pgshots`, database `pizzeria_shots`) received the repo's own `scripts/migrate.ts` and
`scripts/create-admin.ts` (an invented admin, `shots@example.test`). The dev server was
booted with `DATABASE_URL`, `PGHOST`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`, `POSTGRES_URL*`,
`AUTH_SECRET`, `AUTH_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL` set on the command line, which
`@next/env` never overrides from `.env.local`, so the Neon database named in that file was
never opened. The Square sandbox token in `.env.local` was allowed to load (user ruling); the
only Square calls made were reads — `catalog.list` (storefront, checkout, admin menu) and
`orders.search` (admin orders, analytics); `orders.get` is called only by the confirmation page,
pay, webhook, cron and the two per-order admin routes, none of which was visited. No order was
created, no payment made, no SMS sent (Twilio keys are empty in that file anyway).

**Proof the scratch DB was the live one.** `restaurant.config.ts` says `Joe's Pizza`, `123
Main St`; every frame says `NeuraGul's Restaurant`, `12378 Main St, New York, NY 10001`, which
are the two `config_overrides` rows this run wrote through `POST /api/admin/config` as the
invented admin. `psql -p 5433 pizzeria_shots -c 'select key, updated_by from
config_overrides'` lists them with `updated_by = shots@example.test`. The open/closed toggle's
`hours.friday = {FORCE,FORCE}` row is the third (the captures ran after midnight, outside
Friday's `11:00–23:00`).

**Reaching `/admin/*` read-only.** `lib/auth.ts` is a NextAuth credentials provider checking
bcrypt against `admin_users`; `proxy.ts` redirects any `/admin/:path*` without a session. No
repo file was changed. A scratch Playwright script in `$SCRATCH` logged in through the real
`/admin/login` form as the invented admin, added two menu items to the cart through the real
storefront UI (the cart lives in `localStorage`, `components/CartProvider.tsx:103-117`), and
saved `context.storageState()` to `$SCRATCH/pizzeria-state.json`. The capture runner gained an
optional per-shot `storageState` (validated in `_schema.mjs`, passed to `browser.newContext`)
to load it; nothing about the runner's behaviour changes for a shot without the key.

**What must be hidden in every frame.** Nothing carries a client identity — the restaurant
name is an invented override and the orders are sandbox test orders. On the Orders shot two
columns are hidden (`visibility: hidden`, rows keep their layout): the customer phone (the
developer's real number on the sandbox test orders) and, by user decision after review, the
customer name (the developer's own name and keyboard-mash test entries). Each row then reads
id · Pickup · ASAP · amount · state.

| `out` | Route | Evidence for |
| --- | --- | --- |
| `restaurant-ordering-portal-checkout.jpg` | `/checkout` (cart from storageState) | "pickup or delivery, now or a scheduled slot inside the restaurant's hours, a tip, and a card field that is a Square-hosted frame" — Pickup/Delivery and ASAP/Schedule pills, the two-line order summary (`1x Margherita Pizza (Medium) · Thin Crust`, `1x Garlic Bread`), the tip row, and the Square card iframe |
| `restaurant-ordering-portal-orders.jpg` | `/admin/orders` | "a live feed of the same Square orders, an open/closed switch that blocks or accepts orders immediately" — the green `Open — accepting orders` band (this run's `hours.friday = FORCE` row), ten sandbox orders in Received / Ready / Completed with their customer-name and phone columns hidden, `Auto-refreshes every 30s · plays a sound on new orders` |
| `restaurant-ordering-portal-menu.jpg` | `/admin/menu` | "Hide a dish from the admin and it leaves the ordering portal at once while staying in the Square catalog" — `1 hidden`, Hawaiian Pizza struck through with its toggle off, and the page's own sentence: "Hidden items and modifiers are removed from the customer ordering portal immediately. They remain in your Square catalog." |
| `restaurant-ordering-portal-settings.jpg` | `/admin/settings` | "each is a row in a table that beats the code" — Restaurant Info showing the overridden name and address with `Last updated by shots@example.test on 9/11/2026` under each, and the per-day Business Hours editor |
| `restaurant-ordering-portal-integrations.jpg` | `/admin/integrations` | "the five secret values are returned to the browser masked" — the Square card with its `DB values override environment variables. Secrets are masked after save` note, Twilio's Auth Token as dots with its own `Last updated by` line. The Square fields are empty placeholders because no Square override exists: the env token is never echoed to the browser. |

`NG_SHOTS_STORAGE_STATE=$SCRATCH/pizzeria-state.json node scripts/capture-case-study-shots.mjs
restaurant-ordering-portal --base http://localhost:3103` → `captured 5/5`.
`node scripts/check-assets.mjs` → `OK — 29 referenced assets verified` (before the page
referenced them; the config's five outputs are checked for existence, bytes and pixels).

**Hidden in every frame.** `nextjs-portal` (Next's dev-mode "N" badge, bottom-left — dev chrome,
not product) on all five. On the Orders shot also the per-row phone span (`main button
div.flex.items-center.gap-4 > span:first-child`, `visibility: hidden` so the row keeps its
layout): the sandbox test orders were placed by the developer with a real phone number. The
customer names on those rows (`Jack M`, `Test Tester`, `kjnknk`, `Hamad Gul`…) were sandbox
test entries; they are hidden too since review round 2 (`main button
div.flex.items-center.gap-3 > span:nth-child(2)`). Nothing else on any screen identifies a person.

**Not captured, and why.** The storefront (`/`) — it is the cover already. `/admin/analytics`
— the sandbox's test orders are all from April, outside the 90-day window, so every tile
reads `$0.00` / `0` and the chart says "No completed orders in this range": an empty product.
`/confirmation/[orderId]` — it would need a sandbox order id and proves only that a
confirmation page exists. `/admin/login` — the brief's "merely the front door" case.

**The two traps from Task 8, checked here.** (a) No existing filename is re-captured, so no
other page's alt can go stale. (b) The cover is the storefront menu; the first in-page image is
the checkout, a different screen, so the page never shows the same picture twice.

---

## Cross-page deltas

*(None required. The site printed no test count for this project before this task, and the
frozen cover was not touched, so nothing outside this slug's owned paths needs to change.)*
