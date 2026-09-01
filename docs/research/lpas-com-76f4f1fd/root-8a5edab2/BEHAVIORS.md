# Behaviors — lpas.com homepage

The behaviour bible. Every entry was observed directly via browser automation:
scroll sweep at 20 positions, click sweep on the menu, hover sweep on cards, list
rows and buttons, and a responsive sweep at 1440 / 768 / 390.

## Global machinery

| Thing | Evidence | What it means for the clone |
|---|---|---|
| **Lenis smooth scroll** | `lenisSmooth-BjXMsNId.js` loaded; `.lenis` classes present | Native scrolling feels visibly different. Install `lenis` and drive rAF. Non-negotiable — this is the first thing a viewer notices. |
| **GSAP ScrollTrigger** | `.pin-spacer-homeHero` in the DOM (ScrollTrigger emits this class) | The hero pin. Either use GSAP or reproduce the pin manually with a tall spacer + fixed child. |
| **Swup page transitions** | `swup-config-DoT-9FzL.js`; `main#swup`, `footer#swupFooter`, `p#swup-announcer` | Cross-page only. **Out of scope** for a single-page clone. |
| **Preloader** | `preloader-CQAQSTAa.js`; `.preloader` fixed at z-9000 | Plays once on load. |
| WordPress theme | `wp-content/themes/lpas/dist/` | Content is static in our clone. |

`html` has `scroll-behavior: auto` — Lenis owns scrolling, so never also set
`scroll-behavior: smooth` or the two will fight.

## Scroll-driven

### Hero pin — the main event
- **Trigger:** page scroll `y = 0`.
- **Pinned range:** `y = 0 → 4320` (4320px of scroll consumed).
- **State A** (`y ≤ 4320`): `.homeHero` `top: 0`, `transform: matrix(1,0,0,1,0,0)`.
- **State B** (`y > 4320`): `transform: matrix(1,0,0,1,0,4320)` — releases and scrolls away.
- **Driven property:** the card strip's horizontal offset, mapped ~1:1 to scroll
  progress. Card 1's left edge travels `1124 → −2753` across the pin.
- **Implementation:** ScrollTrigger `pin` + `scrub`, or a manual 5220px spacer with a
  `position: fixed` child and `translateX(-progress × distance)`.

### Image scroll-reveal
- **Trigger:** element entering the viewport.
- **State A:** `transform: scale(1.02)`, `clip-path: inset(100% 0 0)`.
- **State B:** `transform: scale(1)`, `clip-path: inset(0% 0 0)`.
- **Transition:** `1.2s cubic-bezier(0.14, 0.83, 0.4, 1)`.
- Applies to `.imageCard__image` and the footer's main image. Use an
  `IntersectionObserver`, not a scroll listener.

### Footer sticky reveal
- `.navigationFooter__topSection` (900px, `z-index: 2`) scrolls over
  `.navigationFooter__bottomSection` (625px, `position: sticky`, `z-index: 1`).
- The bottom section pins in place while the top section clears it.
- The footer image is 2016 × 1260 inside a 1440-wide section — it parallaxes at
  `z-index: −2`.

### What does *not* happen on scroll
Confirmed across all 20 sweep positions: `.navigationMain` never changes class,
background, height or shadow. It is transparent and fixed at every scroll position.
The "Menu" button carries its own dark pill, which is why the nav reads as solid in
screenshots. **Do not build a scroll-shrinking header** — the site has none.

## Click-driven

### Main menu overlay
- **Trigger:** click `.buttonMenu`.
- `.navigationMain__dropDown`: `display: none → grid`, `0×0 → 1440×900`,
  background `rgba(0, 0, 0, 0.8)`.
- Label swap: `.buttonMenu__textMenu` `display: flex → none` (opacity 1 → 0) while
  `.buttonMenu__textClose` goes `none → flex` (opacity 0 → 1).
- The hamburger has three paths: `menuLineOne`, `menuLineTwo`, and `menuLineThree`
  stacked under line one at `opacity: 0`, animated into the close cross.
- Keyframes available: `menuItemsFadeIn` / `menuItemsFadeInReverse` for the items,
  `mobileMenuSlideIn` on small screens.
- Clicking `.buttonMenu` again closes it.

## Hover-driven

### Latest-updates cursor image — the section's signature
- **Trigger:** pointer over any `.listItem__link`.
- `.globalLatestOverview__imageContainer` (330 × 210) gains class `on`,
  `visibility: hidden → visible`, `opacity: 0 → 1`.
- Inline transform becomes `translate(0%, -50%) translate(0px, <cursorY>px)` — it is
  **vertically centred on the pointer and follows it down the list**.
- The `<img>` inside swaps to the hovered row's Instagram image (the six images are
  pre-rendered at 0×0 in `.globalLatestOverview__images` so no request is made on hover).
- Gate this behind `(hover: hover) and (pointer: fine)` — the source does.

### Project cards
- `.imageCard__image`: scale up on hover, `transition: transform 0.3s ease-in-out`.
- Distinct from the 1.2s scroll-reveal above — do not conflate the two.

### Buttons
- `.buttonArrow`: the arrow glyph is doubled in the markup (two `<svg>` side by side,
  one offset out of view). On hover they slide as a pair so one arrow exits right and
  the replacement enters from the left. Requires `overflow: hidden` on the arrow span.
- `.buttonLine`: two-span underline (`--one` / `--two`) that wipes on hover.

### Cursor blob
`.blob` — `position: absolute`, `z-index: 20`, `rgba(14, 14, 14, 0.6)`. A cursor-follower,
idle at 0×0. Low priority; note it and move on.

## Responsive

Breakpoints: **480 · 768 · 992 · 1280 · 1440 · 2150**.

| Viewport | What changes |
|---|---|
| **1440** | Reference. Hero: 1240px intro panel + 771px cards. Projects 2-up mirrored. |
| **768** | Type drops to its floor (`3XL` 46px, `XXL` 44px, `XL` 32px, `L` 28px, `M` 24px). Gutter 30px. Hero cards `min-width: 500px`, `max-width: 80vw`. |
| **390** | Hero stacks: `.homeHero__categories` reverts to `flex-direction: column`, cards go full width, `grid-template-columns: 72% 28%` with a `27.5rem` (275px) row — the horizontal scroll mechanism **does not apply**. `.homeHero__detail--three` shows "Swipe up to explore" instead of "Scroll to explore"; `.homeHero__cardImage--small` appears; `.homeHero__titleButton` is hidden. |

The `#m` / `#d` spans inside `.homeHero__detail--three` are the mobile/desktop copy
swap — `#d` ("Scroll to explore") shows ≥768px, `#m` ("Swipe up to explore") below.

## Accessibility note

`prefers-reduced-motion: reduce` should disable Lenis and the hero scrub. The source
does not handle this; our clone does, in `globals.css`.
