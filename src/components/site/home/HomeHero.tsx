"use client";

import { useEffect, useRef, useState } from "react";
import { useMediaQuery, usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { HERO_CARDS } from "./content";
import { HeroIntroPanel } from "./HeroIntroPanel";
import { HeroServiceCard } from "./HeroServiceCard";

/** Below this width the strip stops scrolling sideways and stacks vertically. */
const HORIZONTAL_MIN_WIDTH = 768;

/**
 * The pin's three geometric laws, each read off the live source at ten
 * viewport sizes (see the note on `measure`).
 *
 * `PIN_DISTANCE_PER_VW`: the pin consumes exactly 3x the viewport WIDTH of
 * scroll, at every size, and does not depend on the viewport height at all.
 *
 * `TRAVEL_PER_CARD`: the strip advances exactly 5.2 card widths, which — since
 * the card is sized off the viewport height — makes travel a function of height
 * alone. Those two facts together are why the ratio of travel to scroll is not
 * a constant: it runs from 0.74 at 1440x700 to 1.43 at 900x800.
 *
 * `INTRO_INSET_MIN_WIDTH` / `INTRO_INSET`: the intro panel is `100vw - 200px`
 * from 1280 up (which is what leaves the first card peeking in at rest) and the
 * full viewport below it. Keep in step with `max-xl:w-screen` in
 * `HeroIntroPanel`.
 */
const PIN_DISTANCE_PER_VW = 3;
const TRAVEL_PER_CARD = 5.2;
const INTRO_INSET_MIN_WIDTH = 1280;
const INTRO_INSET = 200;

interface StripMetrics {
  /** Horizontal distance the strip travels from rest to the end of the pin. */
  travel: number;
  /** Vertical scroll consumed while pinned. */
  pinDistance: number;
  introWidth: number;
  cardAdvance: number;
  viewportWidth: number;
}

/**
 * Read off the live source by scrubbing the pin at ten viewport sizes and
 * measuring the first card's resting x, its x at the end of the pin, and the
 * pin-spacer's height. The three laws hold exactly at every one of them,
 * including the size where the 80vw clamp binds (800x1000, card 640px).
 *
 * What this replaced was fitted at 1440x900 alone — a single measurement that a
 * second viewport size would have falsified immediately. It tied the pin length
 * to the travel through one constant ratio, so away from that one size the
 * strip ran at the wrong speed: at 1280x700 the clone's card was 170px further
 * left than the source's by the same scroll position.
 */
function measure(): StripMetrics {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Cards are `aspect-ratio: 6/7` at full height, clamped the way the source clamps them.
  const rawCardWidth = (viewportHeight * 6) / 7;
  const cardWidth = Math.min(Math.max(rawCardWidth, 500), Math.min(viewportWidth * 0.8, 900));
  const cardAdvance = cardWidth - 2; // the -2px margin closes the seam between cards

  const introWidth =
    viewportWidth >= INTRO_INSET_MIN_WIDTH ? viewportWidth - INTRO_INSET : viewportWidth;

  return {
    // Not "stop with the last card centred", which is what this used to
    // compute: the source's end position is not a fixed place in the viewport
    // (the last card lands at x=306 at 1440x900 but x=146 at 1280x900). It is a
    // fixed distance, and the distance is 5.2 card widths.
    travel: TRAVEL_PER_CARD * cardWidth,
    pinDistance: PIN_DISTANCE_PER_VW * viewportWidth,
    introWidth,
    cardAdvance,
    viewportWidth,
  };
}

/**
 * The pinned hero.
 *
 * Vertical scroll is converted into horizontal travel of the service strip. The
 * pin is a tall spacer with a `position: sticky` child rather than GSAP
 * ScrollTrigger — sticky gets the same result, adds no dependency, and does not
 * fight Lenis over scroll position the way a transform-based pin would.
 *
 * Below 768px there is no pin at all: the source reverts the strip to a plain
 * vertical stack, so we render it as ordinary flow content.
 */
export function HomeHero() {
  const spacerRef = useRef<HTMLDivElement>(null);
  const [metrics, setMetrics] = useState<StripMetrics | null>(null);
  const [progress, setProgress] = useState(0);
  // Card reveals latch: once a card has entered it never blurs back out.
  const [revealedCount, setRevealedCount] = useState(0);

  // Both of these are external state, so they are read through a subscription
  // rather than seeded by a setState inside an effect.
  const reduced = usePrefersReducedMotion();
  const wideEnough = useMediaQuery(`(min-width: ${HORIZONTAL_MIN_WIDTH}px)`);
  const horizontal = wideEnough && !reduced;

  // Geometry depends on the live viewport, so it can only be measured after
  // mount — but it is written from a resize handler and a rAF tick, never
  // synchronously in the effect body.
  useEffect(() => {
    // No early setMetrics(null) here: render already gates on `horizontal`,
    // so leaving stale metrics in place is invisible and avoids a synchronous
    // state write during the effect.
    if (!horizontal) return;

    const sync = () => setMetrics(measure());
    const frame = requestAnimationFrame(sync);
    window.addEventListener("resize", sync);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", sync);
    };
  }, [horizontal]);

  useEffect(() => {
    if (!horizontal || !metrics) return;

    let frame = 0;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      const spacer = spacerRef.current;
      if (!spacer) return;

      // How far into the spacer we are, clamped to the pinned range.
      const travelled = Math.min(Math.max(-spacer.getBoundingClientRect().top, 0), metrics.pinDistance);
      const p = metrics.pinDistance > 0 ? travelled / metrics.pinDistance : 0;
      setProgress(p);

      // A card's content enters once its left edge passes half the viewport.
      const offset = metrics.travel * p;
      let entered = 0;
      for (let i = 0; i < HERO_CARDS.length; i += 1) {
        const left = metrics.introWidth + i * metrics.cardAdvance - offset;
        if (left < metrics.viewportWidth * 0.5) entered = i + 1;
      }
      setRevealedCount((prev) => Math.max(prev, entered));
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [horizontal, metrics]);

  const cards = HERO_CARDS.map((card, i) => {
    if (!horizontal || !metrics) {
      // `revealed` is the pin's own signal and means nothing off the strip —
      // the stacked card watches itself. See HeroServiceCard.
      return (
        <HeroServiceCard
          key={card.slug}
          card={card}
          progress={1}
          revealed={false}
          horizontal={false}
        />
      );
    }
    const left = metrics.introWidth + i * metrics.cardAdvance - metrics.travel * progress;
    // Push-in progress: 0 while the card is still parked off to the right,
    // 1 once it has travelled half a card-width past the left edge.
    const span = metrics.introWidth + metrics.cardAdvance * 0.5;
    const cardProgress = Math.min(Math.max((left + metrics.cardAdvance * 0.5) / span, 0), 1);

    return (
      <HeroServiceCard
        key={card.slug}
        card={card}
        progress={1 - cardProgress}
        revealed={i < revealedCount}
        // Only the first card is dimmed, and only while the strip is at rest.
        dimmed={i === 0 && progress === 0}
        horizontal
      />
    );
  });

  if (!horizontal || !metrics) {
    return (
      // No `mb-200` here. That 200px is GSAP's pin-spacer on the source, and
      // the pin-spacer only exists on the pinned branch — measured on the live
      // source, the stacked hero's own margin-bottom is 0 at 767 and below.
      // Carrying it here stacked 200px on top of the 200px `cardLast` run-off
      // and the intro block's 50px, putting 450px of white under the last card
      // where the source has 300px.
      <section className="homeHero relative w-full overflow-x-clip">
        <div className="h-screen">
          <HeroIntroPanel />
        </div>
        <div className="homeHero__categories flex w-full flex-col">
          {cards}
          {/* The source keeps the trailing white panel at both widths — 200px
              tall under the last stacked card, a full card-width of run-off on
              the strip. It used to live only in the horizontal branch. */}
          <div className="homeHero__cardLast h-[200px] w-full shrink-0 bg-white" aria-hidden="true" />
        </div>
      </section>
    );
  }

  return (
    <div
      ref={spacerRef}
      // 200px trailing gap — the source's `.homeHero { margin-bottom: 20rem }`.
      className="pin-spacer-homeHero relative mb-[200px] w-full overflow-x-clip"
      style={{ height: `calc(100vh + ${metrics.pinDistance}px)` }}
    >
      <section className="homeHero sticky top-0 h-screen w-full overflow-hidden">
        <div
          className="homeHero__categories flex h-full w-fit flex-row flex-nowrap will-change-transform"
          style={{ transform: `translate3d(${-metrics.travel * progress}px, 0, 0)` }}
        >
          <HeroIntroPanel />
          {cards}
          {/* Trailing white panel giving run-off past the final service card. */}
          <div
            className="homeHero__cardLast h-full shrink-0 bg-white"
            style={{ width: metrics.cardAdvance }}
            aria-hidden="true"
          />
        </div>
      </section>
    </div>
  );
}
