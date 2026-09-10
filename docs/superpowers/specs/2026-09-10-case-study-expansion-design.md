# Case study expansion — design

**Date:** 2026-09-10
**Status:** revised after three-reviewer audit; approved for planning
**Scope:** the ten `/work/<slug>/` case studies — copy, screenshots, and page composition.

## The ask

> Update each case study to be more expansive, more screenshots, better placement. More to the
> point and more accurate. All of the projects are located in the projects/ directory on my
> laptop so use that to identify gaps, capture better screenshots (and more if needed) and more
> information. For any new writing use the marketing copywriting skill.

"More expansive" and "more to the point" pull against each other. This design resolves them as:
**claim density up, word count incidental.** A length target would be met by padding, and no
check in Phase 5 could catch padding. The rule is instead that every paragraph carries a
checkable noun, and every image is evidence for a specific adjacent sentence.

## What is actually wrong with these pages

Not length. Three concrete defects, all found by audit, none of them fixed by writing more:

**1. The `Outcome` block reprints the header `lead`.** Verbatim on six pages:

| page | printed as both `lead` and `PROJECT_OUTCOME` |
|---|---|
| vintus | "A production storefront running a national wine import catalog." |
| rwd-pipeline | "A 0-to-1 data pipeline taken from concept to production." |
| landscape-drainage-proz | "Tripled the client's online sales." |
| new-york-mobile-mechanic | "A conversion-focused site aimed squarely at same-day repair demand." |
| new-york-fine-foods | "A live brand site that turns browsing into event inquiries." |
| restaurant-ordering-portal | "A working portal that lets a restaurant keep the full value of every order." |

The remaining four are the same sentence re-hinged. On `/work/vintus/` a visitor reads five
sentences, one already read two screens earlier, under a heading promising new information.

**2. The stack string prints twice per page.** `projectIntroTabs.ts:24` overwrites the labels to
`["The brief", "The tech stack"]` and renders `PROJECT_DETAILS`' Stack row as a 40px `font-L`
statement; `BlockProjectDetails` then prints the identical string at the page foot.

That overwrite also means **"What we built" has never rendered**, and the word "we" appears zero
times across all ten case studies. Any instruction to "preserve the voice" is protecting a
string the component discards.

**3. No case study has a call to action.** `GeneralCta` exists in `shared/blocks/` and is
rendered on exactly one route: `/process/`. Ten high-intent pages end on a details table and
drop into the footer.

Seven of ten pages ship with exactly one image, spent on the header.

## Decisions

1. **Copy latitude — rewrite from repo truth**, superseding the "verbatim from `content.py`"
   pledge at the top of all ten `content.ts` files.
2. **Screenshots — local repos + live sites**, booted read-only.
3. **Structure — existing blocks only**, minus `BlockImageSlider` (see Phase 4).
4. **The thin ones stay honest.** No stock, no generated filler.
5. **Execution — parallel agents**, shared workspace, disjoint paths. Not worktrees.
6. **Unverifiable claims are cut**, not softened. See Phase 0.
7. **Deletion precedes addition.** Phase 0 exists and runs first.

**Open, owner: user.** `~/Projects` holds finished work with no case study — `Plumbing-Website-Template`,
`Electrician-Website-Template`, `ChartAnalyzer`, `polymarket-tradingbot`. Whether any becomes an
eleventh case study is the user's call and is out of scope until they make it.

## Source map

Corrected: the original survey scanned only `~/Projects` and missed three sources.

| `/work/<slug>/` | Source | Boot |
|---|---|---|
| `delivery-routing` | `~/Projects/Routing` | synthetic launcher, see below |
| `packship` | `~/Projects/MagicBoxer`, `~/Projects/docs`, `~/Desktop/PackShip Files` | none; `MagicBoxer/demo/*.PNG` exist but are Jan-2025 captures of a stale UI at 1179x2556 |
| `new-york-mobile-mechanic` | `~/Projects/Adam's Mobile Mechanic`, `~/Desktop/NYMM Results` | `next dev` :3101 |
| `new-york-fine-foods` | `~/Projects/newyorkfinefoods` | `next dev` :3102 |
| `restaurant-ordering-portal` | `~/Projects/PizzeriaSoftware` | `next dev` :3103 |
| `hasina-hijama-cupping` | `~/Projects/Hijama Site` | `next dev` :3104 — **scratch copy only**, see below |
| `foodtruckrentals` | **`~/Desktop/foodtruckrentals.com`** + `~/Desktop/truckrentalsmedia` | `next dev` :3106 |
| `rwd-pipeline` | **`~/Projects/NeuraGul/assets/docs/rwd-pipeline-portfolio.pptx`** | none; extract slides |
| `vintus` | live only | production URL |
| `landscape-drainage-proz` | live only (`~/Projects/ShopifySite` is empty) | production URL |

Path traps: `~/Projects/Adam's%20Mobile%20Mechanic` and `~/Projects/MagicBoxer copy` are decoys
sitting beside the real directories. Always use the literal paths above.

## Constraint: read-only boots

No writes inside any source repo. No `npm install`, no migrations, no builds emitting into a
repo. Two cases need more than a rule:

**Routing must not be booted with `run.sh`.** `run.sh:27` hardcodes `--port 8000 --env-file .env`
(loading real Anthropic and Google Maps keys), and `api/deps.py:114` resolves the database as
`getattr(request.app.state, "db_path", str(DEFAULT_DB))` where `DEFAULT_DB` is the live
`dlw-cache.sqlite`. `cli.py:37` honours `DLW_DB`; **the HTTP API does not**. There is no env knob.

Instead: a launcher in **NewNeura's** `scripts/` imports `create_app`, sets
`app.state.db_path` to a scratch SQLite seeded with synthetic data, and serves it. Zero writes to
`~/Projects/Routing`, no `.env`, no live data. This also matches what the site already publishes:
*"the screenshots on this site run on synthetic data because the client is not named here."*
API stays on **:8000** (`web/vite.config.ts:10-13` hardcodes that proxy target), web on **:3105**.
Port 8001 is not achievable and is struck.

**Hijama Site must be booted from a scratch copy.** It runs Next 16.3.2 and ships
`node_modules/next/dist/server/lib/generate-agent-files.js`, which **rewrites `AGENTS.md` and
`CLAUDE.md` when `next dev` detects an agent** — the same mechanism that maintains the block atop
this repo's own `AGENTS.md`. The other three Next projects predate it. All four still get `.next/`
writes, which are gitignored and therefore invisible rather than absent; record
`git -C <repo> status` before and after each boot.

## Constraint: claims are not page-local

Each project's cover and claims are repeated across home, about, process, `sitemap.ts`,
`public/llms.txt`, and up to eight service sub-pages:

`delivery-routing 12 · packship 11 · rwd-pipeline 9 · foodtruckrentals 8 · vintus 8 ·
landscapedrainage 4 · pizzeria 4 · nymm 3 · nyff 2 · hasinahijama 0` files outside `site/work/`.

`1,278 tests` appears **14 times across 6 files in `src/`, plus `public/llms.txt`** — 7 files
total. It is not unverified: `Routing/CLAUDE.md:104` records it as a `pytest -q` count from
2026-08-17 and warns *"Re-measure before quoting either number; this line has gone stale before."*
The same line records **399** vitest tests for `web`. Food Truck Rentals' **119 Vitest tests** is
now verifiable too, since that repo was found.

**Cover filenames are frozen** and do not follow the `<slug>-` pattern, so no per-slug glob
reaches them: `packship.jpg`, `delivery-routing.jpg`, `foodtruckrentals.jpg`, `nyff.jpg`,
`nymm.jpg`, `pizzeria.jpg`, `vintus.jpg`, `hasinahijama.jpg`, `landscapedrainage.jpg`,
`rwd-pipeline.jpg`, plus off-pattern `mechanicseo.png` and `conversion.png`. Recapture overwrites
the exact filename at the exact size; never rename.

## Phase 0 — Deletion, before anything is written

Runs first, as one orchestrator commit, reviewed by the user.

**Cut the unverifiable claims** (user decision, 2026-09-10). Each spans work *and* service pages
*and* `llms.txt`:
- *"Tripled the client's online sales"* — `work/landscape-drainage-proz/content.ts` ×3 (meta
  description, `lead`, `PROJECT_OUTCOME`), `services/web-development/content.ts`, `public/llms.txt`.
  No repo exists that could prove it.
- *"a 12,100/mo search term … a local qualifier worth 320"* —
  `work/foodtruckrentals/content.ts:108`, `services/web-development/content.ts:113`. Third-party
  search-volume figures with no source on disk.

**Cut the structural duplication:**
- All ten `PROJECT_OUTCOME` blocks as currently written. Either the block carries new evidence or
  it goes; printing the header `lead` twice is not an option.
- The intro tab's stack statement or the `BlockProjectDetails` stack row — one of the two.

**Cut the unsourced hedges and the swagger**, e.g. packship's "usually by a wider margin than
people expect" / "around a centimetre", and NYMM's "When your car dies on the BQE you call
whoever ranks" and "The site has exactly one exit and it is the phone." These prove nothing.

**Fix the stale comments.** All ten `content.ts` headers assert the verbatim-source pledge this
design revokes, and several describe a "What we built" label that has not rendered since
`projectIntroTabs` shipped.

## Phase 1 — Research dossiers

`docs/research/case-studies/<slug>.md` per project. Extends beyond engineering truth, because the
copywriting skill requires audience context that a manifest cannot supply.

- **Stack, verified** — from manifests. Note that PackShip's Postgres and Redis live in
  `MagicBoxer/backend/package.json`, not the root; all five claimed entries are real, and
  RevenueCat, Sentry, OpenAI and the Express/Railway backend are real and unclaimed.
- **Architecture and the hard decisions.** `Routing/CLAUDE.md` alone documents WAL-mode backup
  discipline, a single-machine Fly constraint because two machines mean two divergent databases,
  and a rule that no address or patient name reaches a log.
- **Gaps — what the project does that the page never mentions.** This is the user's "identify
  gaps". `PizzeriaSoftware` is the worst offender: `/admin/orders`, `/admin/menu`,
  `/admin/analytics`, `/admin/settings`, `/admin/integrations`, `/checkout`,
  `/confirmation/[orderId]`, a `config_overrides` table with DB-over-env precedence, and 154 tests
  across 33 files — against a page whose entire technical content is one sentence about Square.
- **Audience, objection, primary action** — required by the copywriting skill's page framework.
- **Verifiable numbers**, each with the command or file that proves it.
- **Unverifiable claims**, listed for the user, never written.
- **Shot list** — each entry justified as *evidence for claim X*, naming the sentence it sits
  beside. A shot that is merely "the home page" is rejected.
- **`## Cross-page deltas`** — see the protocol below.

## Phase 2 — Capture pipeline

`scripts/capture-case-study-shots.mjs`, orchestrator-owned, plus per-slug
`scripts/shots/<slug>.config.mjs` so agents never contend for one config. Playwright must be added
to `package.json` and the runner landed **before** the fan-out; it is not currently a dependency.

Sizes: `1200x750` covers, `1600x1000` in-page, `480x750` / `1179x2203` portraits. Note
`delivery-routing-map.jpg` is `1008x630`, an existing exception inside the reference project.
Target 40–250KB — the real band; a naive 100–250KB check fails on day zero against
`packship-stacked.jpg` (39KB) and `mechanicseo.png` (52KB).

Fixed `<shot>` vocabulary, frozen before fan-out, or the naming drifts (`-home` vs `-homepage`)
and the checks lose their key.

## Phase 3 — Copy

`marketing-skills:copywriting` to draft, then **`marketing-skills:copy-editing` over both new and
existing copy** — that is the skill whose remit is "tighten this up," which is half the ask.

Write `.agents/product-marketing.md` first: the copywriting skill's literal first instruction is
to read it, and without it ten agents each invent a different reading of who these pages serve.

Benefits over features. Every paragraph carries a checkable noun. No length target.

## Phase 4 — Recomposition

Existing blocks only, chosen per project from the evidence outward. **No fixed rhythm** — a
template stamped on ten projects specifies cadence, not correspondence.

- **`BlockImageSlider` is struck from the case-study vocabulary.** Its geometry is solved for
  3:4 portraits at `slidesPerView: 3` (473px slides at 1440); a 1600x1000 screenshot renders as a
  473x296 thumbnail. It also guarantees most images are off-screen, away from the claim they support.
- **`BlockMediaDouble`'s asymmetry is a claim/counterclaim device** — a large image with a small
  one sticky at `top: 450px`. Use it for before/after or overview/detail, not two equal marketing shots.
- Note the block actually in use on four work pages is **`BlockMediaDoubleQuote`**, not
  `BlockMediaDouble`; adding the latter beside it gives those pages two near-identical blocks.
- **No block supports a caption.** `BlockImageFullImage`, `BlockMediaDoubleImage` and
  `SliderImage` are all exactly `{src, alt, width, height}`. A shot's label must live in the
  adjacent `BlockWysiwyg`.
- **`alt` must be non-empty** on every new screenshot. The blocks document `alt=""` as
  "decorative", which is true of a stock photo and false of a product screenshot on an SEO-tuned site.
- **Add `GeneralCta` to all ten pages.**

**Client boundary, restated correctly.** The original rule named two blocks; five carry
`"use client"` — `BlockWysiwyg`, `BlockIntroDouble`, `BlockMediaDouble`, `BlockImageSlider`,
`BlockMediaDoubleQuote`. Only `BlockImageFull`, `BlockHeaderProjects` and `BlockProjectDetails`
are server components. The rule is therefore: **`content.ts` imports `type` only, from every
block, always.**

## Phase 5 — Verification

The existing gates cannot fail on the most likely defect. `next/image` does not resolve a literal
string `src` at build time, so an agent that captures nothing still passes lint, `tsc`,
`next build`, the og:image grep, and a size check looping over an empty set.

New `scripts/check-assets.mjs`, wired into `npm run check`:
1. Every `/site/images/…` and `/site/videos/…` literal in `src/` resolves to a file on disk.
2. Every `out` path in every `scripts/shots/*.config.mjs` exists.
3. A per-slug **minimum shot count** — zero output is a hard failure.
4. Declared `width`/`height` literals match actual pixels (`sips`).
5. Non-empty `alt` on every `<slug>-*` image.

Plus `scripts/check-filter-counts.mjs` asserting `WORK_SERVICE_FILTERS` against
`PORTFOLIO_PROJECTS`; those counts are hand-maintained number literals, the filter is client-side,
and a mismatch is not even in the prerendered HTML for a grep to find.

And: `npm run check` once per batch, **orchestrator-only**; a visual pass covering not just the
ten work routes but `/`, `/work/`, `/process/` and the affected service pages, because overwriting
a cover changes all of them; a HEAD against each og:image under `next start`; and
`sitemap.ts`'s `LAST_MODIFIED` bumped, per its own comment.

## File ownership under parallel agents

**Per-project agent owns**
```
src/components/site/work/<slug>/content.ts
src/app/work/<slug>/page.tsx
public/site/images/<slug>-*.jpg          (new shots)
<that project's own cover>               (overwritten in place, never renamed)
docs/research/case-studies/<slug>.md
scripts/shots/<slug>.config.mjs
```

**Orchestrator owns exclusively**
```
src/components/site/work/content.ts
src/components/site/{home,about,process}/content.ts
src/components/site/services/**
src/components/site/shared/**            (blanket: read-only to agents)
src/app/sitemap.ts                       (including LAST_MODIFIED)
public/llms.txt
public/site/videos/**
package.json, package-lock.json
scripts/capture-case-study-shots.mjs, scripts/check-*.mjs
```

`shared/**` is blanket-frozen because Phase 4 is exactly where an agent decides a shared block
needs one more prop. `CollectionProjects.tsx` holds `WORK_SERVICE_FILTERS`, whose own comment
reads *"These are HAND-MAINTAINED and nothing verifies them."*

**Agents never run `git`** — one `git add -A` stages nine agents' half-finished work — and
**never run `npm run check`**: it builds into a shared `.next`, shares one incremental
`.tsbuildinfo`, lints every agent's shot config, and gates on the whole repo. Agents may run
`tsc --noEmit --incremental false`.

### Cross-page delta protocol

Every slug greps into `process/content.ts`; nine into `home/content.ts`. Collisions are the
default case, not the edge case.

- **Addressing** — `{file, anchor: <exact current string>, replacement, reason}`. Free prose lets
  a fuzzy re-edit land in the wrong sentence.
- **Collision detection** — collect all ten dossiers and cross-grep anchors for overlap *before*
  applying anything; applying A then B silently makes B's anchor stale.
- **Ordering** — explicit. The shared-number edits go first.
- **Arbitration** — two agents can verify the same figure by different methods and both be
  internally consistent. The orchestrator decides; the dossier records which method won.
- **Post-apply cardinality assert** — re-grep each changed number and assert the occurrence count
  matches expectation. A replace hitting 8 of 10 sites looks identical to one hitting 10.

## Freeze list — landed before any agent starts

1. `pytest --collect-only -q` in Routing (audited as safe: no module-level DB connections, the
   only conftest sets `app.state.db_path` to `tmp_path`, all migrations are `__main__`-guarded).
   Land the answer in all 7 files at once, plus `web`'s vitest count and FTR's 119.
2. Phase 0 deletions.
3. The taxonomy — `services` / `topServices` and both copies of the filter counts.
4. Block vocabulary and prop contracts.
5. The `<shot>` naming vocabulary.
6. Playwright in `package.json`, the shared runner, `check-assets.mjs`, `check-filter-counts.mjs`.
7. The Routing synthetic launcher and the Hijama scratch copy.

## Sequencing

Delivery Routing first, end to end, as the reference implementation. **Restaurant Ordering Portal
second**, promoted because it has the largest gap between what was built and what the page says.
User reviews both before the remaining eight fan out.

## Out of scope

- New block components; any change to `shared/**`.
- Restructuring `/work/`'s index page.
- New case studies for projects that do not have one (open, user-owned).
- Any write inside a source repo.
