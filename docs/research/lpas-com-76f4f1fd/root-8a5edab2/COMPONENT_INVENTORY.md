# Component Inventory — lpas.com homepage

| # | Component | File | Client? | Spec |
|---|---|---|---|---|
| 1 | Preloader | `Preloader.tsx` | yes | `components/Preloader.spec.md` |
| 2 | MainNavigation (bar + overlay) | `MainNavigation.tsx` | yes | `components/MainNavigation.spec.md` |
| 3 | HeroIntroPanel | `HeroIntroPanel.tsx` | no | `components/HomeHero.spec.md` |
| 4 | HeroMarketCard | `HeroMarketCard.tsx` | yes | `components/HomeHero.spec.md` |
| 5 | HomeHero (pin wrapper) | `HomeHero.tsx` | yes | `components/HomeHero.spec.md` |
| 6 | BlockIntroGeneral | `BlockIntroGeneral.tsx` | yes | `components/BlockIntroGeneral.spec.md` |
| 7 | ImageCard | `ImageCard.tsx` | yes | `components/BlockProjectsHighlight.spec.md` |
| 8 | BlockProjectsHighlight | `BlockProjectsHighlight.tsx` | no | `components/BlockProjectsHighlight.spec.md` |
| 9 | GlobalLatestOverview | `GlobalLatestOverview.tsx` | yes | `components/GlobalLatestOverview.spec.md` |
| 10 | NavigationFooter | `NavigationFooter.tsx` | yes | `components/NavigationFooter.spec.md` |

Components 1–10 live in `src/components/sites/lpas-com-76f4f1fd/root-8a5edab2/`.

## Shared (same-site, reusable across future lpas.com pages)
`src/components/sites/lpas-com-76f4f1fd/shared/`

| Component | Notes |
|---|---|
| `icons.tsx` | 9 icons lifted verbatim from the `#sprite` symbol set: `ArrowIcon`, `ChevronIcon`, `ArrowOutIcon`, `CloseIcon`, `EyeIcon`, `InstagramIcon`, `LogoIcon`, `MenuIcon`, `PlusIcon` |
| `buttons.tsx` | `ButtonArrow` (chip widens, two arrows relay), `ButtonCircle` (fill wipes up), `ButtonLine` (two-bar underline relay) |
| `SmoothScroll.tsx` | Mounts Lenis; publishes `window.__lpasLenis` |

## Data and types
- `root-8a5edab2/content.ts` — all verbatim copy, links and asset paths
- `src/types/lpas.ts` — `MarketSlug`, `HeroMarketCard`, `ProjectCard`, `PortfolioFilterItem`, `LatestUpdate`, `NavLink`, `NavGroup`, `OfficeContact`

## Variants and states summary

| Component | Variants | States |
|---|---|---|
| `ButtonArrow` | direction left/right, colour default/slate/white, `border`, `asStatic` | rest, hover (chip 27→37px, arrow relay) |
| `ButtonCircle` | colour black/white/market, `asStatic` | rest, hover (fill rises), scrubbed opacity in the hero |
| `ButtonLine` | colour dark/white, `external` | rest, hover (underline redraw) |
| `HeroMarketCard` | with / without sub-pages (Housing only) | at-rest dim, scrubbed image push-in, latched content reveal |
| `ImageCard` | large 665×471, small 328×260 | pre-reveal, revealed, hover |
