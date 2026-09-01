# Visual QA — lpas.com homepage clone

Method: both the live site and the clone were driven with Playwright at 1440×900 and
390×844, screenshotted at matched scroll positions, and diffed element-by-element on
computed styles (`docs/design-references/.../qa/`).

## Final geometry, desktop 1440

| Section | Live top / height | Clone top / height | Δ |
|---|---|---|---|
| Hero pin spacer | 0 / 5220 | 0 / 5192 | −28 height |
| `blockIntroGeneral` | 5420 / 377 | 5392 / 377 | −28 / **0** |
| `blockProjectsHighlight` | 5897 / 1124 | 5869 / 1125 | −28 / **+1** |
| `globalLatestOverview` | 7140 / 457 | 7114 / 452 | −26 / −5 |
| `navigationFooter` | 7718 / 1645 | 7686 / 1645 | −32 / **0** |
| **Document height** | **9363** | **9331** | **−32 (0.3%)** |

Every section height matches within 5px. The constant ~−30px offset traces entirely to
the hero pin spacer being 28px short, which is inside the tolerance of the fitted
`travel / scroll = 0.928` ratio.

Console errors at both viewports: **0**.

## Defects found and fixed

### 1. Project images were permanently invisible (critical)

`ImageCard` observed the *image wrapper*, which starts at `clip-path: inset(100% 0 0)`.
That collapses the element's visible area to zero, so IntersectionObserver reported
`intersectionRatio: 0` forever and the reveal never fired — a deadlock in which the card
could never make itself visible. Every project tile rendered blank.

**Fix:** observe the card `<a>` instead of the clipped wrapper. Confirmed: the wrapper
now settles to exactly 665×416, matching the source. A clip-path reveal must never be
observed on the clipped element itself.

### 2. `.font-*` classes were flattening the palette

The ported type classes carried `color: inherit`, copied faithfully from the source.
Because they are emitted after Tailwind's utility layer, they beat every `text-*`
utility applied alongside them — the news excerpts rendered `#111111` instead of the
muted `#747474`, and any future colour utility paired with a font class would have
failed the same way.

**Fix:** dropped the `color` declaration. Colour inherits by default, so the source's
intent is preserved without the specificity hazard.

### 3. Footer image centred twice

The parallax handler wrote `transform: translate3d(-50%, …)` while the element also
carried Tailwind's `-translate-x-1/2`. In Tailwind v4 translate utilities compile to the
separate `translate` property, so the two composed and the image sat 1008px off-screen —
only the left half of the footer was covered.

**Fix:** the inline transform now owns both axes, seeded in JSX so the image is centred
before the first scroll and under `prefers-reduced-motion`, where the parallax never runs.

### 4. Body line-height drift

Tailwind's default 1.5 against the source's 1.35 (16px/21.6px) added 2.4px to every
inherited line and compounded down the page.

**Fix:** `line-height: 1.35` on the page body.

### 5. Content truncated during extraction

The intro paragraph and two news excerpts had been captured mid-sentence by a
character-limited `textContent` read. Re-extracted in full. The intro tagline also
carries a double space (`Listen. Plan.  Analyze. Shape.`), the same line-break encoding
used by `Higher  Education` — preserved verbatim.

### 6. Smaller corrections

- Hero missing its 200px bottom margin (`.homeHero { margin-bottom: 20rem }`).
- Hero card titles rendered on one line; the source stacks them as flex children split
  on the double space, so "Higher Education" now wraps correctly.
- Project card titles used `.font-M` (28px) inside a 22px box and clipped their
  descenders — they inherit 16px on the source.
- Portfolio filter pills likewise sit at 16px, not `.font-S`.
- Nav top bar had no 40px inset or 25px vertical margin; the Menu pill is
  `rgba(14,14,14,0.6)`, not solid `#262626`.
- Footer bottom band was restructured: the source puts "Our Focus +" plus an inline row
  of links at the left with the wordmark right, and socials top-right above
  left-aligned office blocks — not two stacked nav columns.
- Restored the source's BEM class names on footer and projects internals so future
  diffs can address the same elements by name.

## Remaining deltas (all ≤ 8px)

| Element | Live | Clone | Note |
|---|---|---|---|
| `.blockProjectsHighlight` height | 1124 | 1125 | sub-pixel rounding |
| `.globalLatestOverview` height | 457 | 452 | 5px in the trailing button row |
| `.listItem__title` / `__excerpt` / `__date` widths | 598 / 463 / 58 | 597 / 461 / 56 | subgrid rounding |
| `.navigationFooter__mainMenu` height | 332 | 324 | 8px across five 55px rows |

`.imageCard__imageWrapper` reads 678×424 in a diff taken without scrolling, because the
card is still at its pre-reveal `scale(1.02)`. Once revealed it measures 665×416 exactly.

## Behaviour checks

| Behaviour | Result |
|---|---|
| Lenis smooth scroll | active, `window.__lpasLenis` published |
| Hero pin: 4320px of scroll → horizontal travel | works; releases at the right offset |
| Hero card content reveal, latching | fires at half-viewport and does not re-hide |
| Hero image push-in (1.30 → 1.00) | scrubbed with position |
| Mobile hero: no pin, vertical stack | correct at 390px |
| Project image clip-path reveal | fires (after fix #1) |
| Intro + latest fade-up reveals | fire |
| Footer sticky reveal + parallax | correct |
| Menu open/close, label swap, scroll lock | works |
| News cursor-following panel | works, gated to fine pointers |
| Console errors | none at 1440 or 390 |
