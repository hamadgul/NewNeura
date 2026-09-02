"use client";

import { useEffect, useRef, useState } from "react";
import { useMediaQuery, usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { HERO_CARDS } from "./content";
import { HeroIntroPanel } from "./HeroIntroPanel";
import { HeroMarketCard } from "./HeroMarketCard";

/** Below this width the strip stops scrolling sideways and stacks vertically. */
const HORIZONTAL_MIN_WIDTH = 768;

/**
 * The measured ratio of horizontal travel to vertical scroll across the pin:
 * the strip advanced ~4009px over 4320px of scroll.
 */
const SCROLL_TO_TRAVEL = 0.928;

interface StripMetrics {
  /** Horizontal distance the strip travels from rest to the end of the pin. */
  travel: number;
  /** Vertical scroll consumed while pinned. */
  pinDistance: number;
  introWidth: number;
  cardAdvance: number;
  viewportWidth: number;
}

function measure(): StripMetrics {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Cards are `aspect-ratio: 6/7` at full height, clamped the way the source clamps them.
  const rawCardWidth = (viewportHeight * 6) / 7;
  const cardWidth = Math.min(Math.max(rawCardWidth, 500), Math.min(viewportWidth * 0.8, 900));
  const cardAdvance = cardWidth - 2; // the -2px margin closes the seam between cards

  const introWidth = viewportWidth - 200;

  // The pin ends with the last market card centred in the viewport — that is
  // where the measured run stops, short of fully revealing the trailing panel.
  const lastCardRest = introWidth + (HERO_CARDS.length - 1) * cardAdvance;
  const travel = Math.max(0, lastCardRest - (viewportWidth - cardWidth) / 2);

  return {
    travel,
    pinDistance: travel / SCROLL_TO_TRAVEL,
    introWidth,
    cardAdvance,
    viewportWidth,
  };
}

/**
 * The pinned hero.
 *
 * Vertical scroll is converted into horizontal travel of the market strip. The
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
      // the stacked card watches itself. See HeroMarketCard.
      return (
        <HeroMarketCard
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
      <HeroMarketCard
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
      <section className="homeHero relative mb-[200px] w-full overflow-x-clip">
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
          {/* Trailing white panel giving run-off past the final market card. */}
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
