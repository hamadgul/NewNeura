# BlockIntroGeneral Specification

## Overview
- **Target file:** `src/components/sites/lpas-com-76f4f1fd/root-8a5edab2/BlockIntroGeneral.tsx`
- **Screenshot:** `docs/design-references/lpas-com-76f4f1fd/root-8a5edab2/scroll/y-5500.png`
- **Interaction model:** static, plus a scroll-triggered fade-up on each child.

## DOM Structure
```
section.blockIntroGeneral          .lpas-grid, margin 60px 0
  h2.blockIntroGeneral__title      .font-XXL
  h3.blockIntroGeneral__tagline    .font-S
  p.blockIntroGeneral__text
  div.blockIntroGeneral__button    → ButtonArrow "More about us"
```

## Computed Styles (exact, 1440×900)

### `section.blockIntroGeneral`
- display: `grid` — use the shared `.lpas-grid` class (20 columns at ≥1280px, `column-gap: 10px`)
- margin-top: `60px`; margin-bottom: `60px`  (both `50px` at ≤768px)
- color: `rgb(17, 17, 17)` (`#111111`)
- Measured grid rows at 1440: `244.78px / 104.78px / 27px`; total height `376.56px`

### `h2.blockIntroGeneral__title` — `.font-XXL`
- width: `665px` at 1440 → spans roughly **columns 2 → 12** of the 20-col grid
- margin-bottom: `60px` (`50px` at ≤768)
- color: `#111111`

### `h3.blockIntroGeneral__tagline` — `.font-S`
- width: `125px` at 1440; margin-bottom: `25px`
- Sits in the **left column of row 2**, beside the body text.

### `p.blockIntroGeneral__text`
- width: `800px` at 1440; margin-bottom: `40px`
- font: **inherited body 16px / 21.6px** — the source applies no font class here.
  (An earlier draft of this spec said `.font-S`; that was wrong and QA caught it.)
- Sits to the **right of the tagline** in row 2.

### `div.blockIntroGeneral__button`
- width: `800px` (aligns to the text column); height `27px`
- Contains one `ButtonArrow` — import from `../shared/buttons`.

## States & Behaviors

### Scroll reveal (all four children)
- **Trigger:** the section entering the viewport (IntersectionObserver, ~15% threshold).
- **State A (measured initial):** `opacity: 0`, `transform: translateY(50px)`
- **State B:** `opacity: 1`, `transform: translateY(0)`
- **Transition:** `0.9s cubic-bezier(0.14, 0.83, 0.4, 1)` on opacity and transform.
- **Implementation:** add `.lpas-reveal` to each child and toggle `.is-revealed` on the
  section — both classes already exist in `globals.css`. Stagger children by ~80ms.

### Hover
Only on the `ButtonArrow`, which already implements it. Nothing else here hovers.

## Assets
None. Icons come from the shared `ButtonArrow`.

## Text Content (verbatim)
Import `INTRO_BLOCK` from `../root-8a5edab2/content.ts`:
- title: `Clear Process. Creative Results. Human Centered. Always Curious.`
- tagline: `Listen. Plan. Analyze. Shape.`
- text: `At LPAS, we design with people at the center and purpose at every turn. We believe great architecture starts by listening.`
- cta: `More about us` → `/about/`

## Responsive Behavior
- **Desktop (1440):** 3 rows — title / (tagline + text side by side) / button. Section height `377px`.
- **Tablet (768):** title spans nearly full width (`688px`); tagline and text still share row 2. Height `322px`. Margins drop to `50px`.
- **Mobile (390):** **4 rows** — title (`340px` wide), then tagline, then text, then
  button, each full width and stacked. Height `573px`. Grid is 4 columns with 15px edges.
- **Breakpoint:** the tagline/text pair stops sharing a row below **768px**.
