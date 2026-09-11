import { defineShots } from "./_schema.mjs";

/**
 * `/work/restaurant-ordering-portal/` — the Square-backed ordering template in
 * ~/Projects/PizzeriaSoftware.
 *
 * Every shot below names the sentence in
 * `src/components/site/work/restaurant-ordering-portal/content.ts` it is evidence for.
 * The cover (`pizzeria.jpg`, the storefront menu) is NOT re-captured: it is shared with
 * `/`, `/about/`, `/services/cloud-infrastructure/` and `/process/`, whose alt strings
 * describe exactly what it shows. See `docs/research/case-studies/restaurant-ordering-portal.md`
 * → Shot list for the two screens considered and cut (the storefront, which the cover
 * already is, and Analytics, which is empty on sandbox data).
 *
 * ── Reproducing these captures ──────────────────────────────────────────────
 *
 *   1. A scratch Postgres (NOT the Neon database named in the repo's .env.local):
 *        initdb -D $SCRATCH/pgdata -U pgshots --auth=trust
 *        pg_ctl -D $SCRATCH/pgdata -o "-p 5433 -c unix_socket_directories='' -c listen_addresses=127.0.0.1" start
 *        createdb -h 127.0.0.1 -p 5433 -U pgshots pizzeria_shots
 *        DATABASE_URL=postgres://pgshots@127.0.0.1:5433/pizzeria_shots npx tsx scripts/migrate.ts
 *        DATABASE_URL=… npx tsx scripts/create-admin.ts shots@example.test '<dev-only password>'
 *   2. Boot through the watchdog (see task-9-boot-addendum.md — never bare `next dev`),
 *      with DATABASE_URL, PGHOST/PGUSER/PGPASSWORD/PGDATABASE, POSTGRES_URL*, AUTH_* and
 *      NEXTAUTH_* set on the command line. @next/env never overrides a key that is
 *      already in the environment, so the Neon URL in .env.local is never read. The
 *      Square SANDBOX token in that file is allowed to load (user ruling): the menu is a
 *      live `catalog.list` with no local fallback, and every call this run makes is a
 *      read (`catalog.list` and `orders.search`; nothing that calls `orders.get` was visited).
 *   3. A scratch Playwright script (in $SCRATCH, never committed) logs in through the real
 *      /admin/login form, seeds the scratch DB through the app's own admin APIs
 *      (`restaurantName`, `address`, a dummy `sms.authToken` so the masking shows,
 *      the force-open toggle, one hidden menu item), puts two items in the cart through
 *      the real storefront, and saves `context.storageState()` — cookies AND the
 *      localStorage cart — to the file named by NG_SHOTS_STORAGE_STATE.
 *   4. NG_SHOTS_STORAGE_STATE=/abs/path/state.json \
 *        node scripts/capture-case-study-shots.mjs restaurant-ordering-portal --base http://localhost:3103
 *
 * The `storageState` key is only attached when NG_SHOTS_STORAGE_STATE is set, so
 * `check-assets.mjs` (which imports this file in CI, where no such file exists) sees a
 * plain config. Without it every admin shot would capture the login page instead —
 * `proxy.ts` redirects any /admin/:path* without a session.
 *
 * ── What is hidden, and why ─────────────────────────────────────────────────
 *
 *   nextjs-portal   Next's dev-mode indicator (the "N" badge, bottom-left). Dev-only chrome,
 *                   not part of the product.
 *   the phone span  The Orders feed prints each sandbox order's customer phone. The sandbox
 *                   test orders were placed by the developer with a real number, so the
 *                   column is hidden (visibility: hidden — the row keeps its layout).
 *                   The names on those rows are sandbox test entries and stay.
 *
 * ── Capture notes ──────────────────────────────────────────────────────────
 *
 * Every admin page is a client component that paints its shell first and fetches its
 * data second, so `waitFor` on each shot gates a piece of fetched data — an order row,
 * the seeded restaurant name in an input, the masked token's "Last updated" line, a
 * catalog item — never the shell.
 */
const STATE = process.env.NG_SHOTS_STORAGE_STATE;
const authed = STATE ? { storageState: STATE } : {};

export default defineShots("restaurant-ordering-portal", [
  {
    // Evidence for: "Checkout is pickup or delivery, now or a scheduled slot inside the
    // restaurant's hours, a tip, and a card field that is a Square-hosted frame, so no card
    // number ever reaches the restaurant's own code." The order summary shows the two
    // items the storageState cart carries: a Medium Margherita (thin crust) and Garlic Bread.
    route: "/checkout",
    viewport: { width: 1600, height: 1000 },
    out: "restaurant-ordering-portal-checkout.jpg",
    minBytes: 40000,
    waitFor: "iframe",
    hideSelectors: ["nextjs-portal"],
    ...authed,
  },
  {
    // Evidence for: "The Orders page is the kitchen's view of the same Square orders: a
    // live feed, an open/closed switch at the top that blocks or accepts orders
    // immediately, and a sound when a new one lands." The green
    // "Open — accepting orders" band is the force-open row this run wrote; the rows are
    // Square sandbox test orders in Received / Ready / Completed states.
    route: "/admin/orders",
    viewport: { width: 1600, height: 1000 },
    out: "restaurant-ordering-portal-orders.jpg",
    minBytes: 40000,
    waitFor: "main button span.font-mono",
    hideSelectors: ["nextjs-portal", "main button div.flex.items-center.gap-4 > span:first-child"],
    ...authed,
  },
  {
    // Evidence for: "Hide a dish from the admin and it leaves the ordering portal at once
    // while staying in the Square catalog." The Hawaiian Pizza toggle is off — the
    // hidden_items row this run wrote — and the page's own sentence says the rest.
    route: "/admin/menu",
    viewport: { width: 1600, height: 1000 },
    out: "restaurant-ordering-portal-menu.jpg",
    minBytes: 40000,
    waitFor: "text=Hawaiian Pizza",
    hideSelectors: ["nextjs-portal"],
    ...authed,
  },
  {
    // Evidence for: "Name, address, timezone, hours for every day of the week, delivery
    // fee and radius, prep time, how far ahead a customer may schedule: each is a row in a
    // table that beats the code, saved from this page and live on the next request."
    // "Last updated by shots@example.test on 9/11/2026" under the name and address is the
    // config_overrides row talking.
    route: "/admin/settings",
    viewport: { width: 1600, height: 1000 },
    out: "restaurant-ordering-portal-settings.jpg",
    minBytes: 40000,
    waitFor: "input[value=\"NeuraGul's Restaurant\"]",
    hideSelectors: ["nextjs-portal"],
    ...authed,
  },
  {
    // Evidence for: "Square, Twilio and Uber credentials are edited on the Integrations
    // page and take effect on the next request; the five secret values are returned to
    // the browser masked, and a save that sends the mask back changes nothing." The
    // Twilio auth token field shows the mask and its own "Last updated by" line; the
    // page's own copy reads "DB values override environment variables."
    route: "/admin/integrations",
    viewport: { width: 1600, height: 1000 },
    out: "restaurant-ordering-portal-integrations.jpg",
    minBytes: 40000,
    waitFor: "text=Last updated by",
    hideSelectors: ["nextjs-portal"],
    ...authed,
  },
]);
