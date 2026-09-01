# Output Plan — lpas.com, pass 2 (remaining pages)

**app-root:** `.` (repo root — single origin, single Next.js app)
**site-key:** `lpas-com-76f4f1fd`
**Origin:** `https://lpas.com`

Pass 1 built the homepage (`root-8a5edab2`). This pass adds the remaining
nav-reachable pages. The pass-1 foundation (fonts, `globals.css` tokens/grid/
type-scale/reveals, `MainNavigation`, `NavigationFooter`, `Preloader`,
`SmoothScroll`, `shared/icons`, `shared/buttons`) is **reused unchanged**.

## Scope decisions (confirmed with the user)

- **Careers pages: excluded.** `/careers/` is skipped entirely.
- **Portfolio: 2 pages only** — the main listing plus one in-depth project,
  `Las Positas College Academic Support Building` (chosen because the cloned
  homepage already links to it as the lead featured project).
- **Team bios excluded.** The ~40 `/team/<person>/` pages are not in the main
  nav and are not cloned.

## Targets

| # | Source URL | Route | page-key |
|---|---|---|---|
| — | `/` | `src/app/page.tsx` | `root-8a5edab2` *(built in pass 1, untouched)* |
| 1 | `/about/` | `src/app/about/page.tsx` | `about-4f10f17b` |
| 2 | `/culture/` | `src/app/culture/page.tsx` | `culture-76031cc1` |
| 3 | `/contact/` | `src/app/contact/page.tsx` | `contact-cfd191cd` |
| 4 | `/latest/` | `src/app/latest/page.tsx` | `latest-f798beeb` |
| 5 | `/portfolio/` | `src/app/portfolio/page.tsx` | `portfolio-81ee5030` |
| 6 | `/portfolio/las-positas-college-academic-support-building/` | `src/app/portfolio/las-positas-college-academic-support-building/page.tsx` | `portfolio-las-positas-college-academic-support-building-e0ff48e8` |
| 7 | `/markets/housing/` | `src/app/markets/housing/page.tsx` | `markets-housing-588433c5` |
| 8 | `/markets/housing/affordable-housing/` | `src/app/markets/housing/affordable-housing/page.tsx` | `markets-housing-affordable-housing-5d96d8a6` |
| 9 | `/markets/housing/market-rate-housing/` | `src/app/markets/housing/market-rate-housing/page.tsx` | `markets-housing-market-rate-housing-264d70ed` |
| 10 | `/markets/housing/student-housing/` | `src/app/markets/housing/student-housing/page.tsx` | `markets-housing-student-housing-72e66e7d` |
| 11 | `/markets/housing/senior-housing/` | `src/app/markets/housing/senior-housing/page.tsx` | `markets-housing-senior-housing-c6469d9f` |
| 12 | `/markets/civic/` | `src/app/markets/civic/page.tsx` | `markets-civic-382e5b77` |
| 13 | `/markets/commercial/` | `src/app/markets/commercial/page.tsx` | `markets-commercial-0495d1e6` |
| 14 | `/markets/interiors/` | `src/app/markets/interiors/page.tsx` | `markets-interiors-6cba84fd` |
| 15 | `/markets/higher-education/` | `src/app/markets/higher-education/page.tsx` | `markets-higher-education-95395586` |

Every source pathname is preserved verbatim as its App Router route. No segment
needs escaping (no leading `_`/`@`, no parens/brackets).

## Roots per target

- Artifacts: `docs/research/lpas-com-76f4f1fd/<page-key>/`
- Screenshots: `docs/design-references/lpas-com-76f4f1fd/<page-key>/`
- Components: `src/components/sites/lpas-com-76f4f1fd/<page-key>/`
- Assets: `public/sites/lpas-com-76f4f1fd/<page-key>/`
- Same-site shared: `.../lpas-com-76f4f1fd/shared/`

## Collision check

- No planned route already exists. The only existing route is `src/app/page.tsx`
  (the homepage), which this pass **does not touch** except to move its
  page-specific `<title>`/description out of the root layout and into the route,
  so that per-page metadata is possible at all.
- All 15 page-keys are distinct, and none collides with `root-8a5edab2`.
- Asset downloads go through one page-key-aware script,
  `scripts/download-assets-lpas-com-76f4f1fd.mjs <page-key> <manifest>`, which
  writes only inside the given page's namespace. This replaces the pass-1
  pattern of one script per page (15 near-identical files would have been pure
  duplication); the collision guarantee is preserved because the page-key is a
  required argument and scopes the output directory.

## Key architectural finding

The source is a **named block system**: every top-level section carries
`data-control="<BlockName>"`. The same block appears across many pages with
different content. So this pass builds a **shared block library** at
`src/components/sites/lpas-com-76f4f1fd/shared/blocks/`, and each page is a thin
composition of blocks plus a per-page `content.ts`. This mirrors the source's own
architecture and is why 15 pages do not require 15x the work.

Block inventory: see `BLOCK_INVENTORY.md`.
