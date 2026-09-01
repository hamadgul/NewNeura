# MainNavigation Specification

## Overview
- **Target file:** `src/components/sites/lpas-com-76f4f1fd/root-8a5edab2/MainNavigation.tsx`
- **Screenshots:** `desktop-1440-viewport-top.png` (closed), `state-menu-open.png` (open)
- **Interaction model:** click-driven only.

> **Critical:** this nav does **NOT** react to scroll. Verified at 20 scroll
> positions from y=0 to y=8400 — `.navigationMain` never changes class, background,
> height or shadow. Do not build a shrinking or colour-changing header.

## DOM Structure
```
div.navigationMain                     fixed, top 0, z-index 1000, 1440×100, bg transparent
  div.navigationMain__topBar           relative, 1360×50, z-index 10
    a.navigationMain__topBarLogo       60×30  → LogoIcon
    div.navigationMain__topBarItems    89×30, right-aligned
      button.buttonMenu                89×30
        span.buttonMenu__text          .font-XS, 44×24
          span.buttonMenu__textMenu    "Menu"
          span.buttonMenu__textClose   "Close"
        MenuIcon                       30×30
  nav.navigationMain__dropDown         the overlay (see below)
```

## Computed Styles (exact, 1440×900)

### `.navigationMain`
- position: `fixed`; top `0`; left `0`; width `100%`; height `100px`
- z-index: `1000`; background-color: `rgba(0, 0, 0, 0)` — **transparent at all times**

### `.navigationMain__topBar`
- position: `relative`; width `1360px` (i.e. 40px inset each side); height `50px`
- z-index: `10`; laid out as logo left / items right (`justify-content: space-between`)
- Vertical offset: measured top `25px` inside the 100px bar.

### `.navigationMain__topBarLogo`
- 60×30; the `LogoIcon` renders 60×19 inside it (native viewBox 78×26)
- color: `#ffffff`

### `.buttonMenu`
- 89×30; a dark pill: background `#262626`, colour `#ffffff`
- The pill is what makes the top-right read as solid over the hero video.
- Label `.font-XS` (12px/16.8px); `MenuIcon` at 30×30 beside it.
- Measured label box 44×24, icon 30×30, laid out in a row.

### `nav.navigationMain__dropDown`
| Property | Closed | Open |
|---|---|---|
| display | `none` | `grid` |
| size | `0×0` | `1440×900` |
| transform | `none` | `matrix(1,0,0,1,0,0)` |
| background | — | `rgba(0, 0, 0, 0.8)` |

Position `absolute`, filling the viewport below the bar. Content is a grid:
- `ul.navigationMain__mainMenu` — title `Our Focus` (`.font-S--Semibold`, i.e. `.font-S` at weight 600), then 5 items at **`.font-XL`**
- `div.navigationMain__subMenu` — two groups, titles at `.font-S` weight 600, items at **`.font-M`**
  - `Explore our` → Portfolio
  - `Company` → Latest Updates, About, Culture, Careers, Contact
- `div.navigationMain__social` — 3 `ButtonLine`s
- `div.navigationMain__contactOne` / `__contactTwo` — the two `OfficeContact` blocks
- All text is `#ffffff` on the 0.8 scrim.

## States & Behaviors

### Menu toggle
- **Trigger:** click `.buttonMenu`. Clicking again closes.
- **Label swap:** `.buttonMenu__textMenu` `display: flex → none` (opacity 1→0) while
  `.buttonMenu__textClose` goes `display: none → flex` (opacity 0→1). Both occupy the
  same 30×17 box at the same position, so the swap is in place with no layout shift.
- **Icon:** `MenuIcon` has three paths — `menuLineOne` and `menuLineTwo` visible, plus
  `menuLineThree` stacked under line one at `opacity: 0`. Animate the group into a
  close cross when open (rotate the two lines to ±45° and converge them).
- **Item entry:** stagger the menu items in (theme keyframes `menuItemsFadeIn` /
  `menuItemsFadeInReverse`), ~60ms apart, fading up.
- Lock body scroll while open, and close on `Escape`.

### Hover
- Menu items: colour/opacity lift on hover, `transition: 0.3s ease`.
- Social + email links use the shared `ButtonLine`, which handles its own hover.

## Assets
- `LogoIcon`, `MenuIcon`, `CloseIcon` from `../shared/icons`
- `ButtonLine` from `../shared/buttons`

## Text Content (verbatim)
From `content.ts`: `MARKET_LINKS`, `EXPLORE_GROUP`, `COMPANY_GROUP`, `SOCIAL_LINKS`, `OFFICES`.
Group heading over the markets list is **`Our Focus`**. Button labels: `Menu` / `Close`.

## Responsive Behavior
- **Desktop (1440):** bar inset 40px; overlay is a multi-column grid (markets left,
  sub-menus centre, contact right).
- **Tablet (768):** bar inset 30px; overlay collapses toward two columns.
- **Mobile (390):** bar inset 15px; overlay is a single stacked column and slides in
  (theme keyframe `mobileMenuSlideIn`). Markets stay at `.font-XL` (32px floor).
