"use client";

import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { ButtonArrow, ButtonCircle } from "../shared/buttons";
import { useIntroReleased } from "../shared/introGate";
import { HERO_INTRO, HERO_VIDEO } from "./content";

/**
 * The intro reveal, measured at 393x852 by sampling
 * `getComputedStyle` every animation frame from document-start. Times are
 * relative to the frame the preloader reaches `opacity: 0`:
 *
 *   0.00 – 1.00s  the video lifts out of the dark: `brightness(1) → 0.5`.
 *   0.50 – 1.35s  eyebrow one arrives — `opacity 0 → 1`, `translateY(20px) → 0`.
 *   0.70 – 1.55s  eyebrow two, 200ms behind it.
 *   0.90 – 1.75s  the scroll cue, 200ms behind that.
 *   1.10 – 1.95s  the headline, same again, and it alone also unblurs from 10px.
 *
 * Without this the hero simply existed the instant the overlay lifted, which is
 * most obvious on a phone: the preloader is the only thing that moves on the
 * whole first screen, so the hero read as a still photograph dropped in behind
 * it rather than as the room coming up out of the dark.
 */

/** ms each text element takes to arrive. */
const ENTER_MS = 850;
/**
 * GSAP `power4.out`. Fitted, not guessed: the remaining distance `1 - opacity`
 * on the first eyebrow, sampled every ~100ms, runs 0.846, 0.490, 0.265, 0.132,
 * 0.059, 0.022, 0.007 — a decay whose *ratio* keeps shrinking, so polynomial
 * rather than exponential. `1-(1-x)^4` over 850ms matches every sample to
 * within 0.015.
 */
const ENTER_EASE = "cubic-bezier(0.165, 0.84, 0.44, 1)";
/** How far each element is pushed down before it arrives. */
const LIFT_PX = 20;
/** The headline's extra defocus, released on the same progress as its opacity. */
const TITLE_BLUR_PX = 10;
/** The 200ms stagger: two eyebrows, the scroll cue, then the headline. */
const DETAIL_ONE_DELAY_MS = 500;
const DETAIL_TWO_DELAY_MS = 700;
const DETAIL_THREE_DELAY_MS = 900;
const TITLE_DELAY_MS = 1100;
/** ms for the video's brightness lift. */
const BACKDROP_MS = 1000;
/**
 * GSAP `power2.out`, and this one is exact rather than approximated: the
 * quadratic Bezier (0,0),(0.5,1),(1,1) is `y = 2x - x²`, which is `power2.out`,
 * and degree-elevating it to a cubic gives precisely these control points.
 * Measured progress at 34/134/434/933ms was 0.063/0.248/0.679/0.995 against a
 * predicted 0.067/0.250/0.680/0.996.
 */
const BACKDROP_EASE = "cubic-bezier(0.33, 0.67, 0.67, 1)";

/**
 * One element's arrival.
 *
 * Returns `undefined` when the reveal is not playing, so the element falls back
 * to the resting state its classes already describe. That is what keeps the
 * reduced-motion path free of a "transition from hidden to visible" — there is
 * nothing to transition from.
 */
function enter(revealed: boolean, delayMs: number, blurPx = 0): CSSProperties {
  return {
    opacity: revealed ? 1 : 0,
    transform: revealed ? "translateY(0px)" : `translateY(${LIFT_PX}px)`,
    ...(blurPx ? { filter: revealed ? "blur(0px)" : `blur(${blurPx}px)` } : null),
    transitionProperty: blurPx ? "opacity, transform, filter" : "opacity, transform",
    transitionDuration: `${ENTER_MS}ms`,
    transitionTimingFunction: ENTER_EASE,
    transitionDelay: `${delayMs}ms`,
  };
}

/**
 * The fixed left-hand panel of the hero: office video, two eyebrow labels, a
 * scroll cue, and the headline.
 *
 * It is `calc(100vw - 200px)` wide rather than full-bleed, which is what leaves
 * the first service card peeking in from the right edge at rest — the visual hint
 * that the strip scrolls sideways.
 *
 * That 200px inset only applies from **1280px up**; below it the panel is the
 * full viewport and the first card starts off-screen, with no peek. Measured on
 * the source at 1279 (panel 1279) and 1280 (panel 1080). This was `max-lg:`
 * (Tailwind's 1024), which left three hundred pixels of widths showing a peek
 * the source does not have — and, worse, disagreed with `HomeHero`'s own
 * `measure()`, which assumed the inset at every width.
 */
export function HeroIntroPanel() {
  // The source ignores `prefers-reduced-motion`; this clone honours it, in step
  // with every other animation here.
  const animate = !usePrefersReducedMotion();
  // Not "has this mounted" — "has the preloader got out of the way". On a
  // client-side navigation to `/` the gate is already open and this is true on
  // the first render, so the hero paints settled and nothing transitions. That
  // is what the source does too: navigating home from `/about/` shows the hero
  // already at rest, it does not replay. See introGate.ts.
  const revealed = useIntroReleased();

  return (
    <div
      // `isolate` is load-bearing, not decoration. The video below sits at
      // z-index -2, so it paints in the *nearest stacking context's* negative
      // layer — which is below that context root's in-flow content. On desktop
      // the strip's `will-change: transform` supplies that context, but in the
      // mobile branch nothing between here and <html> creates one, so the video
      // escaped to the root layer and `main.mainContent`'s opaque white
      // background painted straight over it: white type on white, a blank hero.
      className={cn(
        "homeHero__main relative isolate grid h-full w-[calc(100vw-200px)] shrink-0 gap-x-[10px] max-xl:w-screen",
        // ≥768: the panel's own 20-column bed, unchanged.
        "grid-cols-[repeat(20,minmax(0,1fr))] grid-rows-[1fr_auto_1fr] px-[40px] py-[60px] pl-[50px]",
        // <768: the site grid from globals.css — 4 columns inside 15px gutters
        // — and the source's five-row band: a 60px cap, flexible space, the
        // eyebrow row, the headline, and a 60px foot for the scroll cue. The
        // track list has to be a class, not the inline style it used to be,
        // or nothing below could override it.
        "max-md:grid-cols-[minmax(15px,1fr)_repeat(4,minmax(0,100px))_minmax(15px,1fr)]",
        "max-md:grid-rows-[60px_1fr_100px_auto_60px] max-md:px-0 max-md:pt-[40px] max-md:pb-[35px]",
      )}
    >
      {/*
        The video is 100vw — wider than this panel — so it reads as one
        continuous backdrop behind the panel and the cards beside it.
        brightness(0.5) is what keeps the white type legible over it, and it is
        also where the intro lands: the reveal rides that same filter down from
        a fully lit `brightness(1)`. The class stays as the resting value the
        inline style overrides while the intro is playing.
      */}
      <video
        className="homeHero__mainBackground absolute left-0 top-0 -z-[2] h-full w-screen object-cover brightness-50"
        src={HERO_VIDEO.src}
        poster={HERO_VIDEO.poster}
        autoPlay
        muted
        loop
        playsInline
        style={
          animate
            ? {
                filter: revealed ? "brightness(0.5)" : "brightness(1)",
                transitionProperty: "filter",
                transitionDuration: `${BACKDROP_MS}ms`,
                transitionTimingFunction: BACKDROP_EASE,
              }
            : undefined
        }
      />
      <div
        aria-hidden="true"
        className="homeHero__mainOverlay pointer-events-none absolute inset-0 z-[5]"
      />

      <span
        className="homeHero__detail--one font-S relative z-10 row-start-2 self-center text-white [grid-column:1/7] max-md:row-start-3 max-md:self-start max-md:[grid-column:2/-1]"
        style={animate ? enter(revealed, DETAIL_ONE_DELAY_MS) : undefined}
      >
        {HERO_INTRO.eyebrowLeft}
      </span>

      <span
        className="homeHero__detail--two font-S relative z-10 row-start-2 self-center text-white [grid-column:7/span_6] max-md:row-start-3 max-md:self-start max-md:[grid-column:4/-1]"
        style={animate ? enter(revealed, DETAIL_TWO_DELAY_MS) : undefined}
      >
        {HERO_INTRO.eyebrowRight}
      </span>

      <div
        className="homeHero__detail--three font-S relative z-10 row-start-2 flex items-center justify-end gap-[10px] justify-self-end self-start text-white [grid-column:-5/-1] max-md:row-start-5 max-md:w-fit max-md:justify-start max-md:justify-self-start max-md:self-end max-md:border-b max-md:border-white max-md:pb-[8px] max-md:[grid-column:2/-1]"
        style={animate ? enter(revealed, DETAIL_THREE_DELAY_MS) : undefined}
      >
        {/* Copy swaps at the 768px breakpoint — the source ships both spans and toggles them. */}
        <span className="max-md:hidden">{HERO_INTRO.scrollCueDesktop}</span>
        <span className="md:hidden">{HERO_INTRO.scrollCueMobile}</span>
        {/* Rotated a quarter turn so the arrow points down the page. */}
        <ButtonArrow asStatic border className="rotate-90 max-md:hidden" />
      </div>

      <header
        className="homeHero__title relative z-10 row-start-3 max-w-[900px] self-end text-white [grid-column:1/-1] max-md:row-start-4 max-md:[grid-column:2/-2]"
        style={animate ? enter(revealed, TITLE_DELAY_MS, TITLE_BLUR_PX) : undefined}
      >
        <h1 className="font-3XL text-white">
          {HERO_INTRO.heading}
          {/*
            The plus trails the final word inline, so it has to sit in the text
            flow rather than in the grid. Hidden below 768px, where the headline
            already fills the panel.
          */}
          <span className="homeHero__titleButton relative ml-[20px] inline max-md:hidden">
            <ButtonCircle
              asStatic
              color="white"
              label="Explore"
              className="absolute left-1/2 top-[55%] -translate-y-1/2"
            />
          </span>
        </h1>
      </header>
    </div>
  );
}
