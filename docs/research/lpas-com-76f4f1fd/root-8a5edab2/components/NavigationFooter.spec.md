# NavigationFooter Specification

## Overview
- **Target file:** `src/components/sites/lpas-com-76f4f1fd/root-8a5edab2/NavigationFooter.tsx`
- **Screenshot:** `docs/design-references/lpas-com-76f4f1fd/root-8a5edab2/scroll/y-8400.png`
- **Interaction model:** scroll-driven — a sticky reveal with a parallax image.

## DOM Structure
```
footer.navigationFooter                     1440×1645, bg #ffffff
  div.navigationFooter__topSection          1440×900, relative, z-index 2, bg #262626
    div.navigationFooter__mainImage         2016×1260, absolute, z-index -2   ← parallax
    div.navigationFooter__line              1340×41
    ul.navigationFooter__mainMenu           530×332
      li "Our Focus"                        .font-S weight 600
      li × 5                                .font-XL   → market links
    div.navigationFooter__subMenu           142×70
      span "Explore our"                    .font-S weight 600
      li "Portfolio"                        .font-L
  div.navigationFooter__bottomSection       1440×625, position sticky, z-index 1, bg #262626
    div.__bottomSection--1                  1440×131
      a.__bottomSectionLogo                 75×31 → LogoIcon
      div.__bottomMenu                      1205×131 — menu columns
    div.__bottomSection--2                  1440×372
      div.__social--sm                      251×26 — 3 × ButtonLine
      div.__contactOne                      173×159 — Sacramento
      div.__contactTwo                      173×159 — Oakland
    div.__bottomSection--3   .font-S        1340×73
      div.__copyright                       "© 2026. All rights reserved."
      button.__bottomText                   "Back to top" + ArrowIcon
      a.__credits                           "Website by" + ButtonLine "Naam"
```

## Computed Styles (exact, 1440×900)

### `footer.navigationFooter`
- width `1440px`; total height `1645px`; background `#ffffff`

### `.navigationFooter__topSection`
- height `900px`; `position: relative`; `z-index: 2`; background `rgb(38, 38, 38)`
- All text `#ffffff`

### `.navigationFooter__mainImage`
- `position: absolute`; `z-index: -2`; **2016 × 1260** in a 1440-wide section
- That is 1.4× the section width — it is oversized *because it parallaxes*. Anchor it
  centred and translate it on scroll; do not shrink it to fit.

### `.navigationFooter__mainMenu`
- width `530px`; height `332px`
- Heading `Our Focus` at `.font-S` weight 600; the 5 market items at **`.font-XL`**
  (50px desktop), each item row `55px` tall.

### `.navigationFooter__subMenu`
- width `142px`; height `70px`; heading `Explore our`; item `Portfolio` at `.font-L`.

### `.navigationFooter__bottomSection`
- **`position: sticky`**; `z-index: 1`; height `625px`; background `#262626`
- Three bands: `--1` 131px, `--2` 372px, `--3` 73px.
- `--3` is `.font-S` and spans `1340px`.

### Contact blocks
Each `173 × 159`: city label (`.font-S` weight 600), address over two lines, phone,
then an `E-mail` `ButtonLine`. Use `OFFICES` from `content.ts`.

## States & Behaviors

### Sticky reveal — the footer's defining behaviour
- `__topSection` (900px, `z-index: 2`) scrolls **over** `__bottomSection`
  (625px, `position: sticky`, `z-index: 1`).
- As the page reaches the footer, the bottom section pins while the top section
  travels up and clears it — the bottom section appears to be uncovered.
- **Implementation:** `position: sticky; bottom: 0` on the bottom section, with the
  top section opaque and above it. No JS needed; the z-order does the work.

### Image parallax
- `.navigationFooter__mainImage` translates vertically at a slower rate than scroll
  while the footer is in view. Amplitude ≈ the 360px of surplus height
  (1260 − 900). Drive it from scroll progress over the footer, clamped.

### Back to top
- **Trigger:** click `button.navigationFooter__bottomText`.
- Scrolls to y=0. If Lenis is mounted it must go through `lenis.scrollTo(0)`, not
  `window.scrollTo`, or the two will fight.
- The `ArrowIcon` is rotated to point up.

### Hover
- Market links (`.font-XL`) lift on hover, `0.3s ease`.
- All social / email / credit links use the shared `ButtonLine`.

## Assets
- `FOOTER_IMAGE` from `content.ts` (already downloaded, 1600×1091 source).
- `LogoIcon`, `ArrowIcon` from `../shared/icons`; `ButtonLine` from `../shared/buttons`.

## Text Content (verbatim)
From `content.ts`: `MARKET_LINKS`, `EXPLORE_GROUP`, `COMPANY_GROUP`, `SOCIAL_LINKS`,
`OFFICES`, `FOOTER_COPYRIGHT` (`© 2026. All rights reserved.`),
`FOOTER_BACK_TO_TOP` (`Back to top`), `FOOTER_CREDIT` (`Website by` / `Naam` →
`https://studionaam.com`). Heading over the markets list is `Our Focus`.

## Responsive Behavior
- **Desktop (1440):** as measured; menu left, contact blocks right, 50px gutter.
- **Tablet (768):** market menu stays `.font-XL` (32px floor); contact blocks move
  below the social row; gutter 30px.
- **Mobile (390):** single column throughout; the two office blocks stack; band `--3`
  wraps copyright / back-to-top / credit onto separate lines. Gutter 15px.
