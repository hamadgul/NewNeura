# Block Inventory — lpas.com

The source composes every page from named blocks. Each top-level section carries
`data-control="<BlockName>"`; the same block recurs across pages with different
content. Enumerate a page's blocks in the console with:

```js
[...document.querySelectorAll('[data-control]')].map(e => e.dataset.control)
```

(Use the unscoped selector, **not** `main > [data-control]` — the market
sub-pages nest a block inside a GSAP `.pin-spacer` wrapper, so a child-only
selector silently misses it.)

## Reuse table

| Block | Uses | Pages | Build target |
|---|---:|---|---|
| `BlockWysiwyg` | 9 | about, 4× market sub-pages (2 each on some), project detail | shared |
| `BlockIntroDouble` | 8 | about, culture, all 5 markets, project detail | shared |
| `BlockHeaderMarkets` | 5 | all 5 market pages | shared |
| `BlockProjectsHighlight` | 5 | all 5 market pages (+ homepage, pass 1) | **promote from pass 1** |
| `BlockImageFull` | 4 | culture, project detail (×3) | shared |
| `BlockMediaDoubleQuote` | 3 | about, project detail (×2) | shared |
| `BlockHeaderGeneral` | 2 | about, culture | shared |
| `BlockHeaderPortfolio` | 2 | portfolio, latest | shared |
| `BlockMediaDouble` | 2 | project detail (×2) | shared |
| `BlockHeaderProjects` | 1 | project detail | shared |
| `BlockProjectDetails` | 1 | project detail | shared |
| `BlockContact` | 1 | contact (the entire page) | shared |
| `BlockImageSlider` | 1 | culture | shared |
| `GeneralCta` | 1 | culture | shared |
| `CollectionTeam` | 1 | about | shared |
| `CollectionPost` | 1 | latest | shared |
| `CollectionProjects` | 1 | portfolio | shared |
| *process/phases block* | 4 | market sub-pages | shared — **pinned, see below** |

17 named blocks + the pinned process block cover all 15 pages.

## Page compositions

- **/about/** — `BlockHeaderGeneral` → `BlockIntroDouble` → `BlockMediaDoubleQuote` → `BlockWysiwyg` → `CollectionTeam`
- **/culture/** — `BlockHeaderGeneral` → `BlockIntroDouble` → `BlockImageSlider` → `BlockImageFull` → `GeneralCta`
- **/contact/** — `BlockContact` (single block, dark `#262626` ground, full page)
- **/latest/** — `BlockHeaderPortfolio` → `CollectionPost`
- **/portfolio/** — `BlockHeaderPortfolio` → `CollectionProjects`
- **/portfolio/las-positas…/** — `BlockHeaderProjects` → `BlockIntroDouble` → `BlockMediaDouble` → `BlockImageFull` → `BlockMediaDoubleQuote` → `BlockImageFull` → `BlockWysiwyg` → `BlockMediaDouble` → `BlockMediaDoubleQuote` → `BlockImageFull` → `BlockProjectDetails`
- **/markets/housing/** — `BlockHeaderMarkets` → `BlockIntroDouble` → `BlockProjectsHighlight`
- **/markets/housing/<sub>/** — `BlockHeaderMarkets` → `BlockIntroDouble` → *pinned process block* → `BlockWysiwyg` ×2 → `BlockProjectsHighlight`
- **/markets/{civic,commercial,interiors,higher-education}/** — follow the `markets/housing` shape

## Interaction models (do not guess these)

- ***Process/phases block* (market sub-pages) — SCROLL-DRIVEN, GSAP-pinned.**
  Wrapped in a `.pin-spacer`, so the source pins the section with GSAP
  ScrollTrigger while a numbered phase list (01–05) advances as the user
  scrolls. It is **not** a click-driven accordion; building it as one is a
  rewrite, not a CSS fix.
- **`CollectionProjects` (portfolio)** — market filter row (All / Housing /
  Interiors / Higher Education / Civic / Commercial with counts) over a project
  grid. 71 projects exist in the sitemap but only 16 render initially; see
  `INTERACTIONS_PROBE.json` for whether the remainder arrive by infinite scroll,
  a load-more control, or are simply capped.
- **`BlockImageSlider` (culture)** — 32 images; see `INTERACTIONS_PROBE.json` for
  whether it autoplays and how the track is transformed.
- **`BlockHeaderMarkets`** — ground colour is the per-market accent, which
  `globals.css` already tokenises: `--lpas-housing: #625653`,
  `--lpas-interiors: #925434`, `--lpas-highered: #c9d3df`,
  `--lpas-civic: #707569`, `--lpas-commercial: #e3c1aa`.

## Source stack

`swup` (page transitions) · `lenis` (smooth scroll) · GSAP + ScrollTrigger
(pinning) · single stylesheet `main-*.css` · Aeonik only, already installed by
the pass-1 foundation.
