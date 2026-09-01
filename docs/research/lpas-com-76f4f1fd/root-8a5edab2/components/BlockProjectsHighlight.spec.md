# BlockProjectsHighlight + ImageCard Specification

## Overview
- **Target files:**
  - `src/components/sites/lpas-com-76f4f1fd/root-8a5edab2/ImageCard.tsx`
  - `src/components/sites/lpas-com-76f4f1fd/root-8a5edab2/BlockProjectsHighlight.tsx`
- **Screenshot:** `docs/design-references/lpas-com-76f4f1fd/root-8a5edab2/scroll/y-6000.png`
- **Interaction model:** static layout; hover on cards; scroll-reveal on images.

## DOM Structure
```
section.blockProjectsHighlight                .lpas-grid
  header.blockProjectsHighlight__header       subgrid, cols 2/-2, border-bottom
    h2.font-L                                 "A selection of our work"   cols 1/-4
    div.highlightedButton                     ButtonArrow "All projects"
    div.portfolioFilter                       row 2, justify-end
      div.portfolioFilter__title              "See our focus cases"
      div.portfolioFilter__itemWrapper        5 × a.portfolioFilter__item, gap 30px
  div.__layout.__layoutOne                    subgrid, cols 2/-2, padding-bottom 50px
    ImageCard (large)                         span 10
    div.__smallImagesWrapper                  span 10, flex row, gap 10px
      ImageCard (small) × 2
  div.__layout.__layoutTwo                    mirrored
    div.__smallImagesWrapper                  ImageCard (small) × 2
    ImageCard (large)
```

## Computed Styles (exact, 1440×900)

### `header.blockProjectsHighlight__header`
- display `grid`, `grid-template-columns: subgrid`, `grid-column: 2 / -2`
- width `1340px`; padding-bottom `17.5px`; margin-bottom `25px`
- border-bottom: `1px solid rgb(214, 214, 214)`
- grid rows: `41.80px` (title row) / `46.59px` (filter row)

### `h2.blockProjectsHighlight__headerTitle` — `.font-L` (38px / 41.8px)
- `grid-column: 1 / -4`; `grid-row: 1`; width `1137.5px`; colour `#111111`
- The `ButtonArrow` "All projects" sits in the remaining right-hand columns of row 1.

### `div.portfolioFilter`
- `grid-column: 1 / -1`; `grid-row: 2`; margin-top `25px`; height `21.59px`
- display `flex`; `justify-content: flex-end`
- `.portfolioFilter__title` = `See our focus cases` (`.font-S`), then the item row.
- `.portfolioFilter__itemWrapper`: display `flex`, `gap: 30px`, padding `0 15px`,
  `overflow-x: auto` (it scrolls horizontally on narrow screens)
- Each item renders **label + count**, e.g. `Housing 27`. Counts: Housing 27,
  Interiors 13, Higher Education 12, Civic 6, Commercial 14.

### `div.blockProjectsHighlight__layout`
- display `grid`, `grid-template-columns: subgrid`, `grid-column: 2 / -2`
- `layoutOne`: width `1340px`, row height `471.02px`, padding-bottom `50px`
- `layoutTwo`: same, no padding-bottom

### `div.blockProjectsHighlight__smallImagesWrapper`
- `grid-column: span 10`; `grid-row: 1`; width `665px`; height `471.02px`
- display `flex`; `flex-direction: row`; `gap: 10px`
- Holds two small cards **side by side**, each `328px` wide.

### `ImageCard`
| Variant | Card | Image wrapper | Text block |
|---|---|---|---|
| `large` | 665 × 471 | 665 × 415.63 | 665 × 40.39 |
| `small` | 328 × 260 | 328 × 205 | 328 × 40.39 |

- `.imageCard__imageWrapper`: `overflow: hidden`; `display: flex`; `justify-content: center`
- `.imageCard__image`: `object-fit: cover`; fills the wrapper
- `.imageCard__textWrap`: `display: flex`; `flex-direction: column`; `gap: 2px`; `margin-top: 15px`
- `.imageCard__title`: 22px tall; colour `#111111`; `overflow: hidden` (single line)
- `.imageCard__location`: `.font-XS` (12px/16.8px); colour `rgb(116, 116, 116)`

Large cards span 10 of the 20 columns; the small-card wrapper spans the other 10.

## States & Behaviors

### Image scroll-reveal (on every card)
- **Trigger:** card entering the viewport (IntersectionObserver).
- **State A:** `clip-path: inset(100% 0 0)`, `transform: scale(1.02)`
- **State B:** `clip-path: inset(0% 0 0)`, `transform: scale(1)`
- **Transition:** `1.2s cubic-bezier(0.14, 0.83, 0.4, 1)`
- Use the ready-made `.lpas-image-reveal` / `.is-revealed` classes from `globals.css`.

### Card hover
- **Trigger:** pointer over the card.
- `.imageCard__image` scales up slightly (~1.04).
- **Transition:** `transform 0.3s ease-in-out` — note this is a *different*
  duration/easing from the 1.2s reveal above. Do not merge them into one transition;
  the reveal must have finished before hover takes over.
- Wrapper keeps `overflow: hidden` so the scale crops rather than overflows.

### Filter pill hover
Underline wipe, matching `.buttonLine` behaviour. Colour `#111111`.

## Assets
`PROJECTS_ROW_ONE` and `PROJECTS_ROW_TWO` in `content.ts` carry all six images
(already downloaded) with correct intrinsic width/height. Use `next/image`.

## Text Content (verbatim)
- Heading: `A selection of our work`
- Buttons: `All projects` → `/portfolio/`
- Filter label: `See our focus cases`; items from `PORTFOLIO_FILTERS`
- Card titles/locations: from `PROJECTS_ROW_ONE` / `PROJECTS_ROW_TWO` — do not retype them.

## Responsive Behavior
- **Desktop (1440):** as tabulated — mirrored 2-row layout, large tile 665px.
- **Tablet (768):** each layout row collapses; the large card goes full width with the
  two small cards side by side beneath it. Gutter 30px.
- **Mobile (390):** everything stacks to a single column, full width; the filter row
  scrolls horizontally (`overflow-x: auto`, which the source already sets).
- **Breakpoint:** the side-by-side large/small split ends below **768px**.
