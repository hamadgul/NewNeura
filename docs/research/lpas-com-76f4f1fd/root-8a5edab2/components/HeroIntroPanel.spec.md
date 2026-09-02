# HeroIntroPanel — post-preloader intro reveal

Measured 2026-09-02 against live lpas.com in Chrome at 393x852 (iPhone 14 Pro
emulation) by sampling `getComputedStyle` on every animation frame from
`document-start` through 11s. Timings below are relative to **t0 = the frame the
preloader reaches `opacity: 0`** (measured at 7018ms on that run; the absolute
number is load-dependent and irrelevant).

## Overview
- **Target file:** `src/components/sites/lpas-com-76f4f1fd/root-8a5edab2/HeroIntroPanel.tsx`
- **Interaction model:** time-driven, fires once per *document load*, chained to
  the preloader.
- **Defect it fixes:** the clone had no hero intro at all — the video sat at a
  static `brightness(0.5)` and the eyebrows/scroll-cue/headline were at
  `opacity: 1, transform: none` from first paint. On a phone, where the
  preloader is the only thing that moves, the hero therefore "just appeared".

## The timeline (t0 = preloader hidden)

| element | starts | duration | animates |
| --- | --- | --- | --- |
| `.homeHero__mainBackground` (video) | 0ms | 1000ms | `filter: brightness(1) -> brightness(0.5)` |
| `.homeHero__detail--one` | 500ms | 850ms | `opacity 0->1`, `translateY(20px)->0` |
| `.homeHero__detail--two` | 700ms | 850ms | same |
| `.homeHero__detail--three` | 900ms | 850ms | same |
| `.homeHero__title` | 1100ms | 850ms | same **plus** `filter: blur(10px)->0` |

The four text elements are one 200ms stagger. Only the headline carries the
blur; the three details animate opacity + lift only (verified: their computed
`filter` is `none` for the whole run).

### Easing — fitted, not guessed

**Video.** Sampled `brightness` normalised to progress `p = (1 - b) / 0.5`:

| t | 34 | 134 | 434 | 933 |
| --- | --- | --- | --- | --- |
| measured p | 0.063 | 0.248 | 0.679 | 0.995 |
| `1-(1-x)^2` | 0.067 | 0.250 | 0.680 | 0.996 |

That is GSAP `power2.out` over exactly 1000ms. `power2.out` is representable
*exactly* as a cubic Bezier: the quadratic Bezier (0,0),(0.5,1),(1,1) yields
`y = 2x - x^2`, and degree-elevating it gives
**`cubic-bezier(0.33, 0.67, 0.67, 1)`**. Not an approximation.

**Text.** Remaining distance `1 - opacity` for `--one`, sampled every ~100ms
from its start: 0.846, 0.490, 0.265, 0.132, 0.059, 0.022, 0.007, 0.001, 0.
The decay ratio drifts (0.58 -> 0.32), so it is polynomial rather than
exponential; `1-(1-x)^4` over ~850ms fits every sample within ~0.015. That is
`power4.out`, i.e. easeOutQuart -> **`cubic-bezier(0.165, 0.84, 0.44, 1)`**.

The headline's three properties are driven by one progress value: at every
sampled frame `translateY = 20 * (1 - opacity)` and `blur = 10 * (1 - opacity)`.

## Trigger — document load only, never client-side navigation

Verified by loading `/about/`, waiting for it to settle, then clicking a link to
`/`: through the whole Swup transition the hero read
`brightness(0.5)`, `titleOpacity 1`, `transform: none` — it never replays. The
source is a Swup app whose preloader also only plays on a real document load,
and the two are chained.

The clone reproduces the chain with a module-scoped gate
(`shared/introGate.ts`): `Preloader` calls `releaseIntro()` when it finishes,
and the hero subscribes. Because the gate is module state on an already-loaded
document, a client-side navigation to `/` finds it already released and renders
the settled hero on its first paint — no transition, matching the source.

## Reduced motion
The source ignores `prefers-reduced-motion`; this clone honours it everywhere
(standing decision). Under reduce, `Preloader` releases the gate on mount and
the hero renders its settled state with `transition: none`.

## Responsive
Identical at every width — `HeroIntroPanel` is shared by the pinned desktop
strip and the stacked mobile branch, and the source runs the same timeline at
1440px.
