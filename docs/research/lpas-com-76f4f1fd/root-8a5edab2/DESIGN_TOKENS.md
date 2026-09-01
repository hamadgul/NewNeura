# Design Tokens — lpas.com homepage

Source: `https://lpas.com/` · site-key `lpas-com-76f4f1fd` · page-key `root-8a5edab2`
All values read from `getComputedStyle()` on the live page, or from the theme
stylesheet `wp-content/themes/lpas/dist/assets/main-CnNCC-Q8.css`.

## Unit base — read this first

The source sets `html { font-size: 62.5% }`, so **1rem = 10px** there. Our clone
deliberately keeps the default 16px root (changing it would silently rescale every
Tailwind utility). Every value in these docs is already converted to px at the
source's 10px base, so `2.4rem` on lpas.com appears here as `24px`.

## Colour

### Neutrals

| Token | Value | Where it is used |
|---|---|---|
| `--lpas-ink` | `#000000` | body default text |
| `--lpas-body` | `#111111` | headings on white |
| `--lpas-dark` | `#262626` | preloader ground, footer ground |
| `--lpas-muted` | `#747474` | meta text, locations, excerpts |
| `--lpas-line` | `#d6d6d6` | hairline rules, filter underlines |
| white | `#ffffff` | page ground, all text on dark |
| menu scrim | `rgba(0, 0, 0, 0.8)` | `.navigationMain__dropDown` |
| blob | `rgba(14, 14, 14, 0.6)` | cursor blob overlay |

### Market accents — one per hero card

| Market | Value | Content colour on it |
|---|---|---|
| Housing | `#625653` | white |
| Interiors | `#925434` | white |
| Higher Education | `#c9d3df` | `#111111` (dark — light ground) |
| Civic | `#707569` | white |
| Commercial | `#e3c1aa` | `#111111` (dark — light ground) |

The theme exposes these per-card as `--marketMainColor` / `--marketContentColor`.
Reproduce that contract: set both on the card element and let children inherit.

## Typography

Family: **Aeonik**, self-hosted, `sans-serif` fallback. Weights present: 300, 400, 600
(each with a matching italic). Body copy is 400; only `--Semibold` variants use 600.

Every size below was measured at 14 viewport widths (390 → 2400) and the clamp
solved from the data. Each holds its min to 768px, interpolates to its own max
width, then holds. Verified: each formula reproduces the measured intermediate
values exactly (e.g. `font-XL` at 860px measures 39.3929px, formula gives 39.3929px).

| Class | Min (≤768) | Max | Max reached at | line-height | clamp |
|---|---|---|---|---|---|
| `.font-3XL` | 46px | 75px | 1280px | 100% | `clamp(46px, 2.5px + 5.6640625vw, 75px)` |
| `.font-XXL` | 44px | 56px | 992px | 110% | `clamp(44px, 2.857143px + 5.3571428571vw, 56px)` |
| `.font-XL` | 32px | 50px | 992px | 110% | `clamp(32px, -29.714286px + 8.0357142857vw, 50px)` |
| `.font-L` | 28px | 38px | 992px | 110% | `clamp(28px, -6.285714px + 4.4642857143vw, 38px)` |
| `.font-M` | 24px | 28px | 992px | 130% | `clamp(24px, 10.285714px + 1.7857142857vw, 28px)` |
| `.font-S` | 14px | 14px | — | 135% | `14px` |
| `.font-XS` | 12px | 12px | — | 140% | `12px` |

`letter-spacing: 0` on all of them. `--Semibold` / `--SemiBold` suffixed variants
(the source uses both spellings) are the same size at `font-weight: 600`.

These are already implemented as real classes in `src/app/globals.css` — use
`className="font-XXL"` exactly as the source does rather than re-deriving sizes.

## Layout

- Page gutter: `30px` below 992px, `50px` at and above it. The hero's main panel
  uses `60px 50px 60px 85px` padding at the largest breakpoint.
- Content max width: sections measure `1340px` inside a `1440px` viewport, i.e.
  gutter `50px` each side.
- `--column-gap: 10px`, `--row-gap: 0`, `--xxlSpace: 85px`.
- Breakpoints, in the order the theme declares them:
  **480 · 768 · 992 · 1280 · 1440 · 2150**.
  Plus capability queries: `(pointer: fine)`, `(hover: hover)`, `(hover: none) and (pointer: coarse)`.

## Motion

Named keyframes defined by the theme: `fadeIn`, `moveDown`, `moveLeft`,
`mobileMenuSlideIn`, `menuItemsFadeIn`, `menuItemsFadeInReverse`, `popupFadeIn`,
`textAnimation`, `rotate`, `rotateReverse`.

Measured easings:
- Image scroll-reveal: `1.2s cubic-bezier(0.14, 0.83, 0.4, 1)` on `transform`, paired
  with a `clip-path: inset(N% 0 0)` wipe from ~100% to 0%.
- Card / button hover: `transform 0.3s ease-in-out`.

## Assets

Downloaded to `public/sites/lpas-com-76f4f1fd/root-8a5edab2/` by
`scripts/download-assets-lpas-com-76f4f1fd-root-8a5edab2.mjs`:
`images/` (55), `fonts/` (6 woff2), `seo/` (5), `videos/` (2). 68 files, 0 failures.
