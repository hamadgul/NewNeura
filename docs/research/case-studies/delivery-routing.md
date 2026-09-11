# Delivery routing platform — case-study dossier

Source of record: `~/Projects/Routing` (private, read-only for this work). Nothing in this
file was taken from memory; every line names the file or command it came from.

The page it backs: `/work/delivery-routing/` —
`src/components/site/work/delivery-routing/content.ts` and
`src/app/work/delivery-routing/page.tsx`.

**Confidentiality.** The client is not named on the page and is not named here. The
screenshots run on a synthetic roster, synthetic patients and invented street addresses; see
**Shot list** for how that is produced and what has to be hidden in every frame.

---

## Stack (verified)

Read from `pyproject.toml` and `web/package.json` on 2026-09-10. Versions are the declared
floors, not the resolved lockfile pins.

**Backend** — `pyproject.toml`, `[project].dependencies`, Python `>=3.10`:

| Package | Declared | What it does here |
| --- | --- | --- |
| `ortools>=9.10` | Google OR-Tools | the vehicle-routing solve |
| `fastapi>=0.115` + `uvicorn[standard]>=0.30` | the HTTP API | 27 routes across `src/dlw_routing/api/` |
| `pydantic>=2.6` | every model and the whole config schema |
| `pdfplumber>=0.11` | reads a PDF delivery sheet |
| `pandas>=2.0`, `openpyxl>=3.1` | CSV/XLSX ingest, and the Excel export |
| `requests>=2.31` | Google Geocoding and Distance Matrix calls |
| `anthropic>=0.40` | the LLM **fallback** extractor only (see below) |
| `pyyaml>=6.0`, `python-multipart>=0.0.9` | seed config, file upload |

Dev group: `pytest>=8.0`, `httpx>=0.27`, `ruff>=0.6`.

**Frontend** — `web/package.json`, Node `>=20`:

React 19.2, TypeScript ~6.0, Vite 8.1, Tailwind 3.4, React Router 6.30,
TanStack Query 5.101, TanStack Table 8.21, Leaflet 1.9 + react-leaflet 4.2.
Tests: Vitest 2.1, Testing Library, MSW 2.15, Playwright 1.61.
Types are generated from the API's own OpenAPI document (`npm run gen:types` →
`openapi-typescript openapi.json -o src/api/schema.d.ts`), so the client cannot drift from
the server's schema silently.

**Deployment** — `fly.toml`, and `CLAUDE.md:87-91`: live on Fly.io since 2026-08-14, one
machine, app `dlw-routing`, region `ewr`, a single mounted volume (`[[mounts]] source =
"dlw_data" destination = "/data"`). SQLite on that volume, WAL mode. `fly deploy` builds
`web/dist` as its own Docker stage.

**Where the LLM is, and is not.** `CLAUDE.md:168` — "`extract` is a fallback. Recognized DLW
exports are parsed deterministically by `ingest` and never reach Anthropic." The paste path
is stronger still: `api/runs.py:135` `create_run_from_paste` takes no extractor dependency at
all, and `ingest.ingest_text` raises rather than falling through, "so this endpoint can never
reach Anthropic."

---

## Architecture decisions

Four that cost real work, taken from `~/Projects/Routing/CLAUDE.md`. These are the ones worth
writing about, because each is a decision a reader can check rather than an adjective.

**1. Backing up a WAL database is not `cp`.** (`CLAUDE.md:11-15`.) SQLite runs in WAL mode, so
recent commits can still be sitting in the `-wal` sidecar rather than the main file — a raw
file copy can silently miss exactly the data a pre-migration backup exists to protect. The
repo's answer is `scripts/_backup.py::backup_database`, which opens the source read-only
(`file:...?mode=ro`), calls SQLite's own `.backup()` (which reads through the WAL), and
**refuses to overwrite an existing destination**. All eight `scripts/migrate_*.py` call it.

**2. `fly scale count > 1` is forbidden.** (`CLAUDE.md:33-35`.) Each Fly machine gets its own
volume — `fly.toml`'s `[[mounts]]` — so a second machine means a second, separate database.
There is no error and no warning; whichever machine served the last write is the one holding
it. The horizontal-scaling reflex is the failure mode, and the constraint is written down
where someone reaching for it will read it first. The same file records that the laptop's
`dlw-cache.sqlite` and the volume's copy have been two separate databases since the deploy,
and that nothing syncs them.

**3. No address and no patient name reaches a log — and the reason that hardened.**
(`CLAUDE.md:21-26`.) Today it holds: the only two `logging` calls in `src/` are `matrix.py:103`
and `runs.py:211`, both about matrix/prune failures, and uvicorn's access log carries only
opaque paths like `/runs/{hex}/solve`. What changed is the blast radius. While the app ran on
one dispatcher's laptop, a stray `logging.info(f"...{stop.normalized_address}")` wrote to a
terminal. Since the move to Fly, `fly logs` is a cloud log aggregator — so the same line is now
a different class of mistake, and the rule is recorded as a Never rather than left to taste.
The same discipline shows up in the API surface: the paste endpoint's 422 returns
`str(exc)` and nothing else, because `ingest_text`'s messages describe the *shape* of the
problem and never quote a cell, "where the input is a list of patients and their home
addresses" (`api/runs.py:148-154`).

**4. A time window whose lower bound sits at or past the deadline files a whole group home as
a conflict.** (`CLAUDE.md:36-39`, `rules/dates.py:90-106`.) `dc_window` must never return an
inverted window: `stop_time_window` reads one as an empty intersection, and `routing.py` then
reports the *entire address* — every resident of a group home — as a time-window conflict, so
the deliveries are lost together. The `lo >= deadline` branch exists for this, and
`test_every_produced_window_is_satisfiable` is the test that holds it. This is the shape of
most of the invariants in that file: a plausible-looking simplification that silently drops
real deliveries, pinned by a named test.

**Supporting decisions worth knowing** (same file):

- **Business rules are config, not literals** (`CLAUDE.md:134-136`). Item codes, drivers,
  vehicles, towns, caps, bans and delivery windows all live in `Config`. `config/dlw-config.yaml`
  is **seed-only** — it populates an empty database and nothing more; once a version is
  published the active row in `config_versions` wins and editing the YAML changes nothing at
  runtime (`CLAUDE.md:130-132`).
- **A per-solve travel-matrix element budget** makes a runaway Google bill structurally
  impossible, and it counts *distinct coordinate-key pairs*, not index pairs — `_coord_key`
  rounds, so two visits to one address share a key, and counting index pairs would degrade a
  whole solve to a haversine grid silently (`CLAUDE.md:43-46`).
- **Geocoding fails closed, with one named exception.** Every location failure reports itself
  rather than guessing — except `GEOMETRIC_CENTER`, which "fails confidently": it is the centre
  of a matched result, which at a nursing complex can be the wrong building, and `put_cached`
  keeps it for 365 days. The two ways out are the Routes screen's "approximate pin" marker
  (`POST /runs/{id}/stops/forget-geocode`, which deletes the cached row so the next solve
  re-asks) and `scripts/forget_address.py`. The app never accepts a hand-typed coordinate
  (`CLAUDE.md:48-66`).
- **Stop identity is `Stop.match_key`, not the normalized address** — `normalize_address` drops
  the city and two served towns share street names; using the address alone once lost a
  delivery silently (`CLAUDE.md:143-146`).
- **Both linters are gated by the test suite** (`tests/test_lint_is_clean.py`), and eslint runs
  at `--max-warnings 0` (`CLAUDE.md:114-119`).

---

## Gaps — in the repo, absent from the page

Real, checkable capability that the shipped page says nothing about. Ordered by how much a
prospect would care.

1. **Unseen item codes are learned on sight.** `rules/classify.py` mints an unknown code into
   `learned_items`, `api/learned_items.Vocabulary.apply` overlays it onto the glossary and the
   four attribute sets, "so the delivery routes the same day." Config Admin's "Learned items"
   card is where a dispatcher names one, sets what it needs, or merges a typo away
   (`CLAUDE.md:184-191`).
2. **A dispatcher can move a stop between drivers and the app re-solves and validates it.**
   `POST /runs/{id}/reassign` (`api/reassign.py`) — the "Move to…" menu on every route row.
3. **Config is versioned, diffed, published and rollback-able.** `GET /admin/config/draft`,
   `/diff`, `/versions`, `POST /publish`, `POST /versions/{vid}/rollback`
   (`api/config_admin.py`). Nothing published is edited in place.
4. **Per-day overrides without publishing a config version.** The Day Setup screen's roster,
   vans and per-driver/per-category limits apply to one run only (`api/runs.py` `put_setup`,
   `overrides.apply_overrides`).
5. **Same-day discharges go first, against a configurable deadline.** `dc_first_enabled`,
   `dc_deadline: "11:00"`, and `dc_earliness_weight`, which spreads discharges across drivers
   rather than stacking them on one.
6. **Two visits to one address are distinguishable.** One address can be visited twice in a day
   when a same-day discharge shares it with a delivery that cannot be served by the deadline;
   `split_key` is the third discriminant that keeps those halves apart (`CLAUDE.md:146-152`).
7. **A mobile guard runs in CI-shaped form.** `web/e2e/mobile.spec.ts` fails if any control
   becomes unreachable or the body scrolls sideways at 320/390px (`CLAUDE.md:120-124`).
8. **Housekeeping has no scheduler.** Run pruning rides along with the upload path; runs older
   than 30 days are removed, except the 20 most recent, which are always kept
   (`api/runs.py` `store.prune`, and the Recent-runs screen states the policy on-screen).
9. **The deployed app is password-gated.** `create_prod_app` refuses to boot without
   `DLW_APP_PASSWORD`; every route but `/health` is behind HTTP Basic (`CLAUDE.md:80-85`).

Items 1, 2, 3 and 5 are the strongest and are the reason the page gained a "rules are config"
section. Items 6–9 are recorded here and deliberately left off the page: they are true and
checkable but they are operator detail, and putting them on the page would cost claim density
rather than add it.

---

## Audience, objection, primary action

Per `.agents/product-marketing.md` §2, this project's reader is segment 2 —
**operationally-stretched small companies with a real production problem**, not a software
buyer. Concretely: someone who currently runs a manual, error-prone daily process and can
already describe it.

**The objection this page has to answer.** Not "can you code" — the objection is *"software
will get my day wrong in a way my dispatcher never would, and I won't find out until a van is
already out."* Everything distinctive about this system is an answer to that: fail-closed
geocoding, a flagged row instead of a guessed one, `items_text` kept verbatim so "3 ROLLATOR"
never prints as "ROLLATOR", a category clamp that serves a group home whole and reports the
breach on the route rather than dropping the address, and 1,278 tests over the rules. The page
should argue refusal-to-guess, not speed.

**Secondary objection**, per `product-marketing.md` §2: *"is this their one good project?"* —
answered by naming the real stack and the real numbers, which this page already does.

**The primary action** is `/contact/` via `GeneralCta`, which this task adds. Per
`product-marketing.md` §1, a case study is not the close; it is the proof that de-risks it.
The CTA line should name this reader's own problem rather than reuse `/process/`'s generic
"Tell us what's broken."

**What the page must not do:** quote a price, quote a timeline, or name the client
(`product-marketing.md` §2 and Open questions 1–4).

---

## Verifiable numbers

Each with the command that proves it. Run from `~/Projects/Routing`.

| Number | Command |
| --- | --- |
| **1,278** Python tests | `.venv/bin/python -m pytest -q` — documented at `CLAUDE.md:104`; re-measured 2026-09-10 and confirmed. |
| **399** web tests | `cd web && npx vitest run` — `CLAUDE.md:108`. Quoted nowhere on the site before this task. |
| **27** API endpoints | `grep -rhoE '@router\.(get\|post\|put\|patch\|delete)' src/dlw_routing/api/*.py \| wc -l` |
| **49** Python modules | `find src/dlw_routing -name '*.py' \| wc -l` |
| **139** Python test files | `find tests -name 'test_*.py' \| wc -l` |
| **48** web test files | `find web/src -name '*.test.ts*' \| wc -l` |
| **71** service-area towns | `CT_TOWNS` in `src/dlw_routing/normalize.py:53-67` |
| **22** seeded item codes | `item_glossary` in `config/dlw-config.yaml` |
| **9** "Never" invariants | the `## Never` list in `CLAUDE.md:6-46` |
| **8** migration scripts, all using `backup_database` | `ls scripts/migrate_*.py \| wc -l`; `CLAUDE.md:15` |
| **365**-day geocode TTL | `db.get_cached(..., max_age_days: int = 365)`; `CLAUDE.md:51` |
| **30** days / **20** runs retention | `api/runs.py` prune; stated on the Recent-runs screen |
| Live on Fly since **2026-08-14** | `CLAUDE.md:87-91` |
| `matrix_element_budget` default **3000** uncached elements per solve | `config.py:193` |

**Numbers deliberately NOT used on the page:** 49 modules, 139/48 test *files*, 27 endpoints.
They are true and they measure the wrong thing — a reader cannot tell whether 49 modules is
good. Test *counts* and the OR-Tools/Fly facts carry weight; file counts do not.

---

## Unverifiable claims

For the user. **Not written on the page**, and no later task should promote one to a fact.

1. **"In minutes."** The page's own `lead` says "Upload to printed routes in minutes."
   Nothing in the repo times a dispatcher's morning, before or after. The solve itself is
   bounded (`solver_budget_seconds: 30`, `solver_time_limit_seconds: 5`), so "minutes" is
   plausible for the whole flow, but it is not measured. **Left in place** because it is the
   client's own framing and predates this work — flagged so the user can confirm or replace it.
2. **"In daily production use."** The repo evidences *deployed and in use*: live on Fly since
   2026-08-14, 33 runs and 383 item codes on the volume at deploy time (`CLAUDE.md:89`).
   It does not evidence *daily*. **Left in place**, flagged.
3. **Time or money saved.** No before/after exists anywhere in the repo. Not written.
4. **Number of deliveries per day in real use.** The 47-ticket sheet in the screenshots is
   synthetic and was chosen by us, not sampled. Never presented as the client's volume.
5. **Google API spend avoided by the element budget.** The mechanism is real and checkable;
   the saving is not recorded. Write the mechanism, never a dollar figure.
6. **"Six vans."** Consistent with `config/dlw-config.yaml` — 7 vehicles, one
   (`mitsubishi-1`) `available_by_default: false` — but that is the seed config, not a
   statement about the client's actual fleet. It reads as scene-setting in the brief and is
   left alone.

---

## Shot list

Five captures. Every one names the sentence it is evidence for; the sentences are the ones in
`content.ts` after this task's rewrite.

**How the data is produced.** `/tmp/ng-shots/make_sheet.py` seeds a scratch database
(`DLW_DB=/tmp/ng-shots/synthetic.sqlite`) with an invented roster and invented depot, writes
47 invented delivery rows, and pre-populates the geocode cache with invented coordinates in
real Connecticut towns. The API boots with `DLW_DB` set and **without** `--env-file`, so no
real key enters the process, and the seeded config sets `use_haversine_only: true`, so the
solve can never reach the paid Distance Matrix API — the Routes screen's own
`estimated (haversine)` badge is the on-screen proof. The live `dlw-cache.sqlite` is never
opened.

**What must be hidden in every frame.** Two things carry the client's identity:

- `header a img` — the top bar's `<img src="/logo.png" alt="DME Living Well">`
  (`web/src/components/TopBar.tsx:15-16`). Present on all five SPA screens.
- `.org` — the cut sheet's `DLW HME · Delivery cut sheet` line
  (`src/dlw_routing/export/printable.py:311`). Printable screen only.

Both go in `hideSelectors`. This is the single highest-risk detail in the whole capture: the
page promises the client is not named, and the logo renders in the corner of every screen.

| `out` | Route | Evidence for |
| --- | --- | --- |
| `cover:delivery-routing.jpg` (1200x750) | `/runs/:id/routes` | "Google OR-Tools solves for the shortest total drive time, inside the delivery windows, per-driver caps, town bans and vehicle eligibility…" — five colour-matched routes, each van's load against its own cap, ETAs, and the `estimated (haversine)` badge. `BlockHeaderProjects` renders the cover full-bleed under the page title, so this doubles as the page's opening image and as the project's card on `/`, `/work/` and `/process/`. |
| `delivery-routing-review.jpg` | `/runs/:id/review` | "It refuses to invent anything it cannot read with confidence. A row it cannot read becomes a flagged task for a human." — `47 tickets → 46 will deliver · 1 need review`, and the flagged row showing the app's own words, `unknown code: RTS`. Also proves `PROJECT_OUTCOME`'s delivery accounting. |
| `delivery-routing-setup.jpg` | `/runs/:id/setup` | "who is driving today, which van they take, and a heavier cap for this one morning are choices on the run itself" — `Drivers 6/7`, `Vans 6/7`, and the per-driver van assignment |
| `delivery-routing-cutsheet.jpg` | `/runs/:id/printable` | "a cut sheet, one page per driver, built for a clipboard and a pen" — a DONE checkbox and a hand-written TIME DELIVERED box at every stop, and a discharge printing with its deadline on the row |
| `delivery-routing-export.jpg` | `/runs/:id/export` | "Four sheets of Excel for the office, a CSV delivery log, and a per-driver summary of stops, driving time and the hour each van gets back" |

**Two assets this slug must not write.**

- `delivery-routing-map.jpg` (1008x630) is the about page's, and is not captured here.
- `delivery-routing-routes.jpg` (1600x1000) is **`/process/`'s** full-bleed image
  (`src/components/site/process/content.ts`, `PROCESS_FULL_IMAGE`), captured from an earlier
  synthetic run whose solve used six drivers — which its `alt` states. This task's run solves
  with five, so re-capturing that filename silently replaces another page's image with one its
  own alt text contradicts. It happened once during this task and was caught by looking at
  `/process/`, not by any check: `check-assets.mjs` verifies that an asset exists and that its
  declared pixels match, never that its CONTENT still matches the sentence beside it. The file
  was restored from git and is not in the shot config. Later tasks: before putting a filename
  in a shot config, grep `src/` for it.

**The duplicate-cover trap.** An earlier draft of this page ran the Routes screen twice — once
as the header's cover and again as a 1600x1000 `BlockImageFull` one screen below. Both frames
are the same screen on the same data, so the page showed the same picture twice within one
scroll. Nothing failed; `npm run check` was green. It was visible only on the rendered page.
Every case study's cover is a screenshot of something, so tasks 9–17 should check what their
cover depicts before choosing the first in-page image.

**Not captured, and why.** The Upload screen (`/`) is the app's front door and proves only
that a file input exists — the brief's "a shot that is merely the home page does not belong."
The Recent-runs screen holds one row on synthetic data and would show an empty product.
Config Admin's rule editors are the best evidence for gap item 3, but the screen's first
viewport is the depot address and the driving day; the roster and the bans sit well below the
fold and the runner captures from the top of the page, so Day Setup carries that claim instead.

---

## Cross-page deltas

*(Empty. Tasks 9–17 record here anything they had to do differently from this page, so the
pattern's exceptions are collected in one place rather than rediscovered nine times.)*
