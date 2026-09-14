"use client";

/**
 * BlockQuoteSlider — client reviews, one at a time, in `BlockWysiwyg`'s
 * two-column shape: the narrow heading on the left, the pull-quote on the
 * right, and under it a "1 / 3" counter with the site's prev/next chips.
 *
 * Built for the homepage on 2026-09-14, when the user asked for the single
 * `quote` node to become "a carousel with the other reviews as well so more
 * than 1 review is here on the home page". It is NOT a copy of
 * `BlockImageSlider`: that strip free-scrolls a row of portraits with a
 * progress thumb and a drag cursor; this one shows exactly one quote per view
 * and snaps, because a half-visible sentence is not a preview, it is noise.
 *
 * Mechanics: a native horizontal scroller with `scroll-snap-type: x
 * mandatory` and full-width slides. Touch swipes are the browser's own; the
 * buttons `scrollTo` the next slide; the active index is derived from
 * `scrollLeft` on every scroll event, so the counter and the disabled state
 * are always what the reader sees, whichever way they moved. Nothing here
 * writes `transform`, so the trap `BlockImageSlider` documents (a JS
 * `translate3d` composing with Tailwind's `translate`) cannot bite.
 *
 * Height: a flex row is as tall as its tallest item, so the block never
 * changes height between slides — the shorter reviews simply leave air below
 * the attribution, which is what the two-column grid does everywhere else.
 *
 * Type: `<h4><em>` at `font-SM`, the same pull-quote shape `BlockWysiwyg`
 * renders for its `quote` node, so a single review on a case-study page and
 * this carousel on the homepage read as one thing.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { SliderNavButton } from "@/components/site/shared/blocks/SliderNavButton";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { REVEAL_OBSERVER_INIT } from "../reveal";

export interface QuoteSlide {
  /** Quote text including its own curly quote marks. */
  quote: string;
  /** e.g. `"Ahad Mumtaz, Google review, August 2026"`. */
  attribution: string;
}

export interface BlockQuoteSliderProps {
  /** Narrow left-hand heading. Rendered as `<h2 class="font-M">`. */
  title: string;
  quotes: readonly QuoteSlide[];
  className?: string;
}

export function BlockQuoteSlider({ title, quotes, className }: BlockQuoteSliderProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isRevealed, setIsRevealed] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    // Nothing here is clipped, so the section is a safe observation target.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          // One-shot, matching every other reveal on the site.
          observer.disconnect();
        }
      },
      REVEAL_OBSERVER_INIT,
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // The active slide is whatever the scroll position says it is. Rounding
  // (not flooring) means a swipe that lands a few sub-pixels short of the
  // snap point still counts as arrived.
  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track || track.clientWidth === 0) return;
    setActive(Math.round(track.scrollLeft / track.clientWidth));
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    measure();
    track.addEventListener("scroll", measure, { passive: true });
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => {
      track.removeEventListener("scroll", measure);
      observer.disconnect();
    };
  }, [measure]);

  const goTo = useCallback(
    (index: number) => {
      const track = trackRef.current;
      if (!track) return;
      const clamped = Math.max(0, Math.min(quotes.length - 1, index));
      track.scrollTo({
        left: clamped * track.clientWidth,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    },
    [prefersReducedMotion, quotes.length],
  );

  const revealClass = cn("ng-reveal", isRevealed && "is-revealed");

  return (
    <section
      ref={sectionRef}
      className={cn(
        // Same rhythm and body type as `BlockWysiwyg`, whose slot this takes.
        "blockQuoteSlider ng-grid my-[50px] text-[16px] leading-[21.6px] text-[#111111] xl:my-[60px]",
        className,
      )}
    >
      <div
        className={cn(
          revealClass,
          "blockQuoteSlider__title col-start-[main-start] col-end-[main-end] mb-[50px] md:col-end-[6] md:row-start-1 md:pr-[20px]",
        )}
        style={{ transitionDelay: "80ms" }}
      >
        <h2 className="font-M">{title}</h2>
      </div>

      <div
        className={cn(
          revealClass,
          // The same measure cap as every body column on the site — see the
          // note on `blockWysiwyg__content`.
          "blockQuoteSlider__content col-start-[main-start] col-end-[main-end] md:col-start-[6] md:row-start-1 xl:col-start-[8] xl:col-end-[-4] xl:max-w-[560px]",
        )}
        style={{ transitionDelay: "160ms" }}
      >
        {/* The scroll port IS the flex container, so `w-full` on each slide
            resolves against a definite box. `scrollbarWidth` hides the bar
            without touching globals.css.

            No `touch-pan-y`. It was here (copied from the image strip) and it
            is exactly the wrong declaration for a horizontal scroller:
            `touch-action: pan-y` tells the browser that touch may only pan
            this element vertically, so a finger swipe across the reviews did
            nothing — a synthesized touch swipe of 220px moved `scrollLeft` 0
            on the phone while the same page scrolled vertically fine. With the
            default `auto` the browser decides per gesture: a sideways swipe
            scrolls the track, a downward one scrolls the page. */}
        <div
          ref={trackRef}
          role="region"
          aria-roledescription="carousel"
          aria-label={title}
          className="blockQuoteSlider__track flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
          style={{ scrollbarWidth: "none" }}
        >
          {quotes.map((slide, index) => (
            <figure
              key={slide.attribution}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${quotes.length}`}
              className="w-full shrink-0 snap-start"
            >
              <blockquote>
                <h4 className="font-SM mb-[20px]">
                  <em>{slide.quote}</em>
                </h4>
              </blockquote>
              <figcaption>{slide.attribution}</figcaption>
            </figure>
          ))}
        </div>

        <div className="blockQuoteSlider__navigation mt-[30px] flex items-center justify-between">
          {/* `aria-live` so a screen reader hears "2 / 3" after a button press
              without the buttons having to describe it themselves. */}
          <span className="font-S text-[#747474]" aria-live="polite">
            {active + 1} / {quotes.length}
          </span>
          <div className="flex gap-[10px]">
            <SliderNavButton
              label="Previous review"
              direction="prev"
              disabled={active === 0}
              onClick={() => goTo(active - 1)}
            />
            <SliderNavButton
              label="Next review"
              direction="next"
              disabled={active === quotes.length - 1}
              onClick={() => goTo(active + 1)}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
