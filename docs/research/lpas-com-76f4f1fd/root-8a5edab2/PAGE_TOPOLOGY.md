# Page Topology — lpas.com homepage

Viewport used for measurement: 1440 × 900. Document height **9363px**, max scroll **8463px**.

## Stacking order (top of the z-stack first)

| Layer | Element | Position | z-index |
|---|---|---|---|
| Preloader | `.preloader` | fixed | 9000 |
| Slide-out template | `template#slideOut-overlay` | fixed | 9900 (inert until used) |
| Main nav | `.navigationMain` | fixed | 1000 |
| Cursor blob | `.blob` | absolute | 20 |
| Hero card strip | `.homeHero__categories` | flex row | 2 |
| Page content | `main#swup .mainContent` | static | — |

## Flow, top to bottom

| # | Section | Scroll range (px) | Height | Interaction model |
|---|---|---|---|---|
| 0 | `.preloader` | overlay at load | 100vh | **time-driven** — plays once, then reveals |
| 1 | `.navigationMain` | fixed, always | 100px | **click-driven** (menu) — no scroll reaction |
| 2 | `.homeHero` (pinned) | 0 → 4320 | 900 (pinned inside a 5220 spacer) | **scroll-driven** — horizontal card strip |
| 3 | `.blockIntroGeneral` | 5420 → 5797 | 377 | static (+ scroll-reveal) |
| 4 | `.blockProjectsHighlight` | 5897 → 7021 | 1124 | static (+ hover, scroll-reveal) |
| 5 | `.globalLatestOverview` | 7140 → 7597 | 457 | **hover-driven** — cursor-following image |
| 6 | `.navigationFooter` | 7718 → 9363 | 1645 | **scroll-driven** — sticky reveal + parallax |

## The hero pin — the page's defining mechanism

`.pin-spacer-homeHero` is a **5220px tall spacer** wrapping a `.homeHero` that is
`position: fixed` at 900px. This is the GSAP ScrollTrigger pin signature (the class
name is emitted by ScrollTrigger itself). Measured behaviour:

- `y = 0 → 4320`: `.homeHero` stays at `top: 0`, `transform: matrix(1,0,0,1,0,0)`.
  Vertical scroll is consumed to drive **horizontal** movement of the card strip.
- `y = 4320 → 5220`: pin releases; `.homeHero` takes `translateY(4320px)` and scrolls
  away normally with the document.

So roughly **half the page's total scroll distance is spent inside the hero**. Any
clone that treats the hero as a normal 100vh block will be ~4300px short and every
subsequent section will land at the wrong scroll offset.

### Hero horizontal layout

`.homeHero` is a grid whose single column is `calc(100vw - 200px)` — that column is
the intro panel. The card strip sits beside it in the same row and overflows:

```
│◀────── .homeHero__main (1240px = 100vw − 200px) ──────▶│◀─ card ─▶│◀─ card ─▶│ … │
   video bg + eyebrows + H1                                 771px      771px
```

- `.homeHero__categories`: `display: flex; flex-flow: row nowrap; width: fit-content;
  height: 100vh; z-index: 2`.
- `.homeHero__card`: `aspect-ratio: 6 / 7` at `height: 100%`. At 900px tall that gives
  **771px** wide — matching the measured 771px exactly. `margin-right: -2px` closes
  the seam, so cards read as one continuous band with no gap.
- `min-width: 500px`, `max-width: min(80vw, 900px)`.
- Card internal rows: `calc(100vh − 285px)` for the image, `285px` for the content block.
- A trailing `.homeHero__cardLast` (771px, white) provides run-off past card 5.

### Measured horizontal travel

Card 1's left edge across the pin: `1124 → 186 → −896 → −2753`. Cards sit 770px apart
(= 771px width − 2px overlap  ≈ adjacent). Total strip travel ≈ 4320px, which is
exactly the pin distance — a 1:1 mapping of vertical scroll to horizontal offset.

### Focal scaling

Each card's `<img>` is larger than its frame and scales as the card passes the focal
point, giving a subtle push-in:

| Scroll | Card 1 image | State |
|---|---|---|
| 0 | 1003 × 800 | at rest, oversized |
| 1100 | 837 × 667 | shrinking as it leaves focus |
| 2300 | 771 × 615 | settled, exactly fills the frame |
| 4300 | 771 × 615 | settled |

Card 3 at y=2300 measures 912 × 727 — mid-growth as it enters focus. So the focused
card's image runs ~1.30× the frame and eases to 1.0 as it moves off-centre.

## Section anatomy

**`.blockIntroGeneral`** — `h2.font-XXL` (665px wide), `h3.font-S` tagline, `p` body
(800px), and a `.buttonArrow` to `/about/`.

**`.blockProjectsHighlight`** — header (`h2.font-L` + "All projects" button + a
`.portfolioFilter` row of 5 market pills with counts), then two mirrored layouts:
- `layoutOne`: large card 665×471 left, two 328×260 cards stacked right.
- `layoutTwo`: two 328×260 cards stacked left, large card 665×471 right.

**`.globalLatestOverview`** — `h2.font-M`, a `ul` of 6 `li.listItem` rows (title /
excerpt / date / arrow), six pre-loaded Instagram images kept at 0×0, one
`.globalLatestOverview__imageContainer` (330 × 210) that is revealed and moved to
follow the cursor, and an "All news" button.

**`.navigationFooter`** — two stacked layers:
- `__topSection` (900px, `#262626`) with a 2016×1260 image at `z-index: −2`
  (1.4× the viewport width — it parallaxes) plus the large market menu.
- `__bottomSection` (625px, `position: sticky`, `z-index: 1`) in three bands:
  logo + menu columns; social + two office blocks; copyright + back-to-top + credit.

The sticky bottom section under a taller top section produces the classic
"footer slides up to reveal" effect.
