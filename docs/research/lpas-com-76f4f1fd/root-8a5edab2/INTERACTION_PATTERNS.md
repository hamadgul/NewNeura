# Interaction Patterns — lpas.com homepage

A condensed reference of every animation on the page, with its measured timing.
See `BEHAVIORS.md` for how each was observed.

## Easing vocabulary

| Curve | Used for |
|---|---|
| `cubic-bezier(0.14, 0.83, 0.4, 1)` | the house curve — image reveals, scroll fade-ups, preloader fade |
| `cubic-bezier(0, 0, 0.13, 0.99)` | button fills and underline wipes |
| `ease-in-out` | card hover scale |
| `ease` / `ease-out` | arrow relays, menu item entry |

## Timings

| Interaction | Property | Duration | Delay | Notes |
|---|---|---|---|---|
| Image scroll-reveal | `clip-path`, `transform` | 1.2s | — | `inset(100% 0 0)` → `inset(0)`, `scale(1.02)` → `scale(1)` |
| Section fade-up | `opacity`, `transform` | 0.9s | staggered 80ms | from `opacity: 0, translateY(50px)` |
| Card hover | `transform` | 0.3s | — | `ease-in-out`; separate element from the reveal |
| ButtonArrow chip | `width`, `border-radius` | 0.3s | — | 27px circle → 37px pill |
| ButtonArrow arrow 1 | `transform` | 0.3s | — | exits right |
| ButtonArrow arrow 2 | `transform` | 0.3s | **0.3s** | enters from left — the delay is what sells the relay |
| ButtonCircle fill | `top`, `border-radius` | 0.3s | — | `top: 100%` → `0`, radius 50% → 25% |
| ButtonLine bar 1 | `transform` | 0.3s | — | exits right |
| ButtonLine bar 2 | `transform` | 0.3s | **0.3s** | enters from left |
| Menu overlay | `opacity` | 0.4s | — | `display: none` → `grid` |
| Menu items | `opacity`, `transform` | 0.4s | staggered 60ms | |
| Hero card content | `opacity`, `filter`, `transform` | ~0.6s | staggered 60ms | `blur(10px)` → none; **latches** |
| Preloader exit | `opacity` | 0.8s | after 2.2s hold | then unmounts |
| News hover panel | `opacity` | 0.3s | — | Y position lerps, does not transition |

## Scrubbed (tied to scroll position, not time)

| Thing | Input | Output |
|---|---|---|
| Hero strip | scroll 0 → 4320px | `translateX(0 → -4009px)` |
| Hero card image | card left-edge x | `scale(1.30 → 1.00)`, eased ~x^1.7 |
| Hero plus button | card travel | `opacity(0 → 1)` |
| Footer image | footer scroll progress | `translateY` at less than 1:1 — parallax |

## Relay pattern

Both `ButtonArrow` and `ButtonLine` use the same trick: **two copies of the element,
one parked off-stage**, with the incoming copy delayed by exactly the outgoing copy's
duration. The result reads as the glyph or rule being *redrawn* rather than slid.
Reproducing this needs `overflow: hidden` on the container and the 0.3s delay — drop
either and it looks like an ordinary slide.

## Latching

Hero card content reveals are one-way. Measured: card 1 is fully revealed at card-left
x = 404 and stays `opacity: 1` at x = −431, −1267 and −2103. Do not tie the reveal to
a symmetric "is in view" test, or cards will blur back out as they exit left.

## Pointer gating

The news hover panel is behind `(hover: hover) and (pointer: fine)`. On touch it must
never appear — there is no cursor for it to follow.
