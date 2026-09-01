# Preloader Specification

## Overview
- **Target file:** `src/components/sites/lpas-com-76f4f1fd/root-8a5edab2/Preloader.tsx`
- **Screenshot:** `docs/design-references/lpas-com-76f4f1fd/root-8a5edab2/desktop-1440-viewport-top.png` (the state after it finishes)
- **Interaction model:** time-driven — plays once on load, then fades out permanently.

## DOM Structure
```
div.preloader                       fixed, inset 0, z-index 9000, bg #262626
  div.preloader__wordWrapper        absolute, centred (measured 295×246 at 1440×900)
    div.preloader__section--1         "L isten"  "P lan"
    div.preloader__section--2         "A nalyze" "S hape"
  div.preloader__imageWrapper       relative, z-index 10, 100% × 100%
    video.preloader__image          object-fit cover, autoplay muted loop playsInline
```

## Computed Styles (exact, from getComputedStyle at 1440×900)

### `.preloader`
- position: `fixed`; inset: `0`; width: `1440px`; height: `900px`
- z-index: `9000`
- background-color: `rgb(38, 38, 38)` (`#262626`)
- color: `#ffffff`

### `.preloader__wordWrapper`
- position: `absolute`; width `295px`, height `246px`; centred in the viewport
- Measured top offset 327px within a 900px viewport.

### `.preloader__section--1` / `--2`
- position: `relative`; heights `99px` each; widths `199px` / `236px`
- Section 1 sits at y=339, section 2 at y=462 → **~24px vertical gap** between them.

### The wordmark
Four words, each split into a large capital and a lowercase remainder:
`L`+`isten`, `P`+`lan`, `A`+`nalyze`, `S`+`hape`. The capitals spell **LPAS**.
Sections group them 2-and-2: section 1 holds "L isten / P lan", section 2 holds
"A nalyze / S hape". Use `PRELOADER_WORDS` from `content.ts`.
Set the capital at `font-XXL` scale and the remainder noticeably smaller (`font-M`),
baseline-aligned, with a small gap between the two parts.

## States & Behaviors

### Play-once entry
- **Trigger:** mount.
- **State A:** overlay visible, `opacity: 1`, covering everything at z-9000.
- **State B:** after the intro plays, `opacity: 0`, `pointer-events: none`, and the
  node stops rendering so it can never re-trap the pointer.
- **Transition:** fade out over ~0.8s `cubic-bezier(0.14, 0.83, 0.4, 1)`.
- **Timing:** hold ~2.2s, then fade. Total ≈ 3s.
- Available theme keyframes for the word entry: `fadeIn`, `moveDown`, `moveLeft`,
  `textAnimation`. Stagger the four words in with `fadeIn` + `moveDown`.

### Reduced motion
Under `prefers-reduced-motion: reduce`, skip straight to the hidden state — do not
hold a full-screen overlay for 3s.

## Assets
- Video: `/sites/lpas-com-76f4f1fd/root-8a5edab2/videos/file.mp4-1080p-.mp4`
- Poster: `/sites/lpas-com-76f4f1fd/root-8a5edab2/videos/LPAS-office-thumbnail.jpg`
- Both are exported from `content.ts` as `HERO_VIDEO`.

## Text Content (verbatim)
`L isten`  `P lan`  `A nalyze`  `S hape`

## Responsive Behavior
- **Desktop (1440):** wordmark ~295px wide, centred.
- **Tablet (768) / Mobile (390):** same structure; the wordmark scales with the
  `font-XXL` clamp (44px floor below 992px). Keep it centred and never let it
  exceed the viewport width.
