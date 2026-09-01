# GlobalLatestOverview Specification

## Overview
- **Target file:** `src/components/sites/lpas-com-76f4f1fd/root-8a5edab2/GlobalLatestOverview.tsx`
- **Screenshots:** `scroll/y-7200.png`, `state-news-hover.png`
- **Interaction model:** **hover-driven** — a cursor-following image panel. This is
  the section's whole character; a plain list is not this component.

## DOM Structure
```
section.globalLatestOverview             .lpas-grid, margin 120px 0
  h2.font-M                              "Latest updates"
  ul.globalLatestOverview__list          6 × li.listItem
    li.listItem                          border-bottom 1px #d6d6d6, padding 15px 0
      a.listItem__link                   subgrid, 27px tall
        h3.listItem__title               cols 1→10
        p.font-S.listItem__excerpt       cols 11→18
        span.listItem__date              cols -4→-3, right aligned
        div.listItem__button             ButtonArrow, no title
  div.globalLatestOverview__images       6 preloaded <img>, rendered at 0×0
  div.globalLatestOverview__imageContainer  330×210, absolute, hidden until hover
  a.buttonArrow--last                    "All news" → /latest/
```

## Computed Styles (exact, 1440×900)

### `section.globalLatestOverview`
- `.lpas-grid`; margin-top `120px`; margin-bottom `120px`
- grid rows measured `52.41px / 348px / 57px`; total `457.41px`
- color `rgb(17, 17, 17)`

### `h2` — `.font-M` (28px / 36.4px at desktop)
- width `1340px`, height `52px`

### `ul.globalLatestOverview__list`
- width `1340px`, height `348px` → **6 rows × 58px**

### `li.listItem`
- display `grid`, `grid-template-columns: subgrid`, spans `1 / -1`
- padding-top `15px`; padding-bottom `15px`; inner row height `27px`
- border-bottom: `1px solid rgb(214, 214, 214)`

### `a.listItem__link` children
| Element | Grid column | Size | Colour |
|---|---|---|---|
| `.listItem__title` | `1 / 10` | 598×22 | `#111111` |
| `.listItem__excerpt` (`.font-S`) | `11 / 18` | 463×19 | `rgb(116,116,116)` |
| `.listItem__date` | `-4 / -3` | 58×17, `text-align: right` | `#111111` |
| `.listItem__button` | end | 29×27 | — |

Title and excerpt both have `overflow: hidden` and clamp to a single line —
the excerpts in `content.ts` are long, so **they must truncate, not wrap**.
Date is `.font-XS` at weight 600.

### `div.globalLatestOverview__imageContainer`
- position: `absolute`; width `330px`; height `210px`; `overflow: hidden`
- Horizontally: measured `left: 576px` in a 1440 viewport → sits between the excerpt
  and date columns, i.e. right-of-centre. Keep it anchored to that column, not the cursor's X.
- Idle: `visibility: hidden`, `opacity: 0`
- The `<img>` inside fills it (`object-fit: cover`).

## States & Behaviors

### Cursor-following image reveal — the signature interaction
- **Trigger:** pointer enters any `.listItem__link`.
- **State A:** `visibility: hidden`, `opacity: 0`.
- **State B:** container gains class `on`; `visibility: visible`, `opacity: 1`, and its
  inline transform becomes:
  `transform: translate(0%, -50%) translate(0px, <cursorY>px)`
  — i.e. **vertically centred on the pointer and tracking it down the list**.
  Measured live values: `translate(0%, -50%) translate(0px, 7399px)` in page space.
- **Image swap:** the `<img>` `src` swaps to the hovered row's image. All six images
  are pre-rendered (at 0×0 in `__images`) so no network request happens on hover —
  reproduce that by rendering all six and toggling visibility, or by preloading.
- **Transition:** ~0.3s ease on opacity; the Y translate should follow with a short
  lerp rather than snapping.
- **Gate:** wrap in `@media (hover: hover) and (pointer: fine)` — the source does.
  On touch, the panel must never appear.

### Row hover
Title/excerpt lift slightly in colour; the row's `ButtonArrow` plays its own arrow
relay (already implemented in the shared component).

### Scroll reveal
Section fades up on entry — add `.lpas-reveal` / `.is-revealed`.

## Assets
Six Instagram images, already downloaded, referenced from `LATEST_UPDATES` in
`content.ts` (each entry carries its own `image`).

## Text Content (verbatim)
`h2`: `Latest updates`. Rows: import `LATEST_UPDATES`. Final button: `All news` → `/latest/`.

## Responsive Behavior
- **Desktop (1440):** 3-column row (title / excerpt / date) as tabulated above.
- **Tablet (768):** excerpt column is dropped; row becomes title + date.
- **Mobile (390):** excerpt hidden, title wraps to its own line above the date; rows
  grow taller. The hover panel is disabled entirely (coarse pointer).
