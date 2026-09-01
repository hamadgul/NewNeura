# HomeHero Specification (intro panel + market card + pin wrapper)

## Overview
- **Target files:**
  - `src/components/sites/lpas-com-76f4f1fd/root-8a5edab2/HeroIntroPanel.tsx`
  - `src/components/sites/lpas-com-76f4f1fd/root-8a5edab2/HeroMarketCard.tsx`
  - `src/components/sites/lpas-com-76f4f1fd/root-8a5edab2/HomeHero.tsx`
- **Screenshots:** `scroll/y-0000.png` … `scroll/y-4300.png`
- **Interaction model:** **scroll-driven, pinned.** Determined by scrolling before
  clicking: the strip advances on its own as you scroll and nothing here responds to
  clicks except the links. This is not a tabbed or carousel-button UI.

## The pin — get this right first

`.pin-spacer-homeHero` is a **5220px tall spacer** wrapping a `.homeHero` that is
`position: fixed`, 900px tall. Measured:

| Scroll y | `.homeHero` top | transform |
|---|---|---|
| 0 → 4320 | `0` (pinned) | `matrix(1,0,0,1,0,0)` |
| 4700 | `-380` | `matrix(1,0,0,1,0,4320)` |
| 5100 | `-780` | released, scrolling normally |

So 4320px of vertical scroll is consumed driving **horizontal** travel, then the hero
releases. Roughly half the page's 8463px of scroll happens inside this section. A hero
built as a normal 100vh block puts every later section ~4300px off.

**Implementation:** an outer spacer `div` of height `100vh + 4320px` containing a
`position: sticky; top: 0; height: 100vh` child. Sticky reproduces the pin without
GSAP and without fighting Lenis. Compute progress `p = clamp(scrollY / 4320, 0, 1)`
and translate the strip by `-p × travel`.

## Layout

`.homeHero` is a grid: `grid-template-columns: 1240px 0px 4616.53px`, i.e.
**intro panel** (`calc(100vw - 200px)`) then the **card strip**, side by side, overflowing right.

```
│◀──── .homeHero__main (1240px) ────▶│◀─ card ─▶│◀─ card ─▶│ … │◀─ last ─▶│
```

### `.homeHero__main` (intro panel)
- `position: absolute`; width `calc(100vw - 200px)` = 1240px at 1440
- `padding: 60px 40px 60px 50px`
- `display: grid`; `grid-template-rows: 379px 22px 379px` (i.e. `1fr auto 1fr`)
- 20 columns of 42.72px, `column-gap: 10px`
- `video.homeHero__mainBackground`: `position: absolute`; `100vw × 100%`;
  `object-fit: cover`; `z-index: -2`; **`filter: brightness(0.5)`**
- `.homeHero__mainOverlay`: absolute, inset 0, `z-index: 5`, `pointer-events: none`

| Element | Grid | Position at 1440 | Type | Colour |
|---|---|---|---|---|
| `.homeHero__detail--one` | `col 1/7, row 2` | x=50, y=439, 306×22 | `.font-S` | #fff |
| `.homeHero__detail--two` | `col 7/span 6, row 2` | x=366, y=439, 306×22 | `.font-S` | #fff |
| `.homeHero__detail--three` | `col -5/-1, row 2` | x=999, y=439, 201×22 | `.font-S` | #fff |
| `.homeHero__title` | `col 1/-1, row 3` | x=50, y=615, 900×225 | — | #fff |
| `h1.font-3XL` | — | 900×225, **75px** at 1440 | `.font-3XL` | #fff |

- `.homeHero__detail--three`: `display: flex`; `justify-content: flex-end`;
  `align-items: center`; `gap: 10px`; `align-self: start`; `justify-self: end`.
  Contains the copy plus a `ButtonArrow` **rotated 90°** (it points down).
  Copy swaps by breakpoint: `Scroll to explore` ≥768px, `Swipe up to explore` below.
- `.homeHero__title`: `align-self: end`; `max-width: 900px`; `position: relative`.
- `.homeHero__titleButton`: `display: inline`; `margin-left: 20px`; holds a
  `ButtonCircle` (plus) positioned `absolute; top: 55%; left: 50%; translateY(-50%)`.
  It trails the last word of the H1 inline. Hidden below 768px.

### `.homeHero__card`
- `aspect-ratio: 6 / 7` at `height: 100%` → **771px wide at 900px tall**
- `min-width: 500px`; `max-width: min(80vw, 900px)`; `margin-right: -2px` (closes the seam
  so cards read as one continuous band — there is **no gap** between cards)
- `display: grid`; `grid-template-rows: 450px 450px` at 1440
- `overflow: hidden`; `position: relative`
- `.homeHero__cardImage`: `grid-column: 1/-1`; `z-index: 2`; `overflow: hidden`; 771×450
- `.homeHero__cardWraper`: `grid-row: 2`; `background: var(--marketMainColor)`;
  `color: var(--marketContentColor)`
- `.homeHero__cardContent`: `position: absolute`; bottom-anchored; 771×285;
  `padding: 40px 30px 0`; `display: grid`;
  `grid-template-columns: 633.72px 77.70px`; `grid-template-rows: 126.61px 61.59px 56.80px`

| Child | Grid | Size | Notes |
|---|---|---|---|
| `ButtonCircle` (plus) | col 2, row 1 | 45×45 | `margin-left: auto`, `z-index: 3`, market colour |
| `.homeHero__subPagesWrapper` | `col 1/-1`, row 1 | 711×71 | `flex`, `justify-content: space-between`, `align-self: start` — **Housing only** |
| `.homeHero__cardTitle` | row 2 | 317×62 | `.font-XXL` (56px), `flex column`, `gap: 13px` |
| `.homeHero__cardCount` | row 3 | 634×57 | `.font-XS` (12px), `padding: 10px 0 30px`, `align-self: end` |
| `.homeHero__cardSubtitle` | col 2, row 2 | 78×43 | `.font-S`, `max-width: 160px`, `align-self: end`, `justify-self: end`, right-aligned |

- `.homeHero__subPageLink`: `display: flex`; `justify-content: space-between`;
  `align-items: center`; `padding: 0 0 8px`; 161×28; `.font-S`; bottom border;
  each carries a `ChevronIcon` at 6×11.
- Count renders as `N / 5` with the parts on separate lines in the source markup;
  render it as a single inline `1 / 5`.
- `.homeHero__cardLast`: a trailing 771px white panel giving run-off past card 5.

## States & Behaviors

### Card content entry — measured, and it **latches**
Each card's content animates in once its left edge crosses roughly **half the
viewport width**, and then stays revealed for the rest of the scroll. Measured
opacity by card-left-x:

| Card left x | title/count/subtitle |
|---|---|
| 975 – 1174 | `opacity: 0`, `filter: blur(10px)`, `translateY(10px)` |
| 205 – 404 | `opacity: 1`, `filter: none`, `translateY(0)` |
| negative | stays `opacity: 1` — **does not re-hide** |

- **State A:** `opacity: 0`; `filter: blur(10px)`; `transform: translateY(10px)`
- **State B:** `opacity: 1`; `filter: none`; `transform: translateY(0)`
- **Trigger:** card left edge `< 0.5 × viewport width`. Latch it — never reverse.
- **Transition:** ~0.6s ease-out; stagger title → count → subtitle by ~60ms.

### ButtonCircle opacity — scrubbed, not latched
Ramps smoothly with position: `0` at rest, ~`0.76–0.80` mid-travel, `1` once the card
is well past centre. Map it to the same progress value rather than snapping.

### Image push-in — scrubbed
The card image is oversized and eases down to exactly fill its frame. Measured widths
against a 771px frame:

| Card left x | image w×h | scale |
|---|---|---|
| ≥1240 (at rest) | 1003×800 | 1.30 |
| 1174 | 991×790 | 1.285 |
| 975 | 941×751 | 1.220 |
| 404 | 835×665 | 1.083 |
| 205 | 810×646 | 1.051 |
| ≤ −450 | 771×615 | 1.00 |

The rate slows as it approaches 1.0 — an ease-out, not linear. Implement as
`scale = 1 + 0.30 × easeOut(positionProgress)`, `object-fit: cover`, clipped by the
card's `overflow: hidden`.

### Initial dim
At `scrollY = 0` **only**, card 1 carries `filter: brightness(0.5)`; it lifts to
`brightness(1)` as soon as the strip starts moving. This keeps attention on the intro
panel at rest. All other cards are `brightness(1)` throughout.

## Assets
`HERO_INTRO`, `HERO_CARDS` and `HERO_VIDEO` in `content.ts`. Each card carries its
`mainColor` / `contentColor` — set them as `--marketMainColor` / `--marketContentColor`
custom properties on the card element so children (including `ButtonCircle
color="market"`) inherit them, exactly as the source does.

## Text Content (verbatim)
Eyebrows `Architecture + Interiors` / `A Market-Focused Approach`; cue
`Scroll to explore` / `Swipe up to explore`; H1
`We’re a process driven architecture and interior design studio`; card titles, the
two-line subtitles and the Housing sub-pages all come from `HERO_CARDS`.

## Responsive Behavior
- **Desktop (1440):** intro panel 1240px + 771px cards, horizontal pin as described.
- **Tablet (768):** intro panel is the full 768px; cards 614px (`80vw`, floor 500px);
  H1 drops to 46px; the pin still applies. `.homeHero__cardContent` grid becomes
  `476.69px 77.70px`.
- **Mobile (390):** **the horizontal mechanism does not apply.**
  `.homeHero__categories` reverts to `flex-direction: column`; cards go full width with
  `grid-template-columns: 72% 28%` and a `275px` row; `.homeHero__cardImage--small`
  appears; `.homeHero__titleButton` is hidden; the cue reads `Swipe up to explore`.
  Render the cards as a normal vertical stack — **no pin, no spacer**.
