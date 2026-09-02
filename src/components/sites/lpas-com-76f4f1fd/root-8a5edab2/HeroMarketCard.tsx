"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { REVEAL_OBSERVER_INIT, REVEAL_TRIGGER_FRACTION } from "../shared/reveal";
import type { HeroMarketCard as HeroMarketCardData } from "@/types/lpas";
import { ButtonCircle } from "../shared/buttons";
import { ChevronIcon } from "../shared/icons";

interface HeroMarketCardProps {
  card: HeroMarketCardData;
  /**
   * How far this card has travelled across the pin, 0 → 1. Drives the image
   * push-in and the plus button's fade. Ignored on mobile, where the strip does
   * not scroll horizontally.
   */
  progress: number;
  /** Latched once the card has entered — content never re-hides after this. */
  revealed: boolean;
  /** True only at scrollY 0 for the first card, which the source dims. */
  dimmed?: boolean;
  horizontal: boolean;
}

/**
 * One market panel in the hero strip.
 *
 * The card is `aspect-ratio: 6/7` at full height, which is what produces the
 * measured 771px width at a 900px viewport. `margin-right: -2px` closes the
 * seam so the five cards read as one continuous band rather than as tiles.
 */
export function HeroMarketCard({
  card,
  progress,
  revealed,
  dimmed = false,
  horizontal,
}: HeroMarketCardProps) {
  const articleRef = useRef<HTMLElement>(null);
  // Starts REVEALED, and is hidden again from the client before first paint.
  // The source does the same thing: its markup ships visible and GSAP applies
  // the hidden state, so a device that never runs the JS still shows the copy.
  // Seeding this `false` instead put `opacity: 0` into the server HTML, which
  // means a blank card for as long as hydration takes — and a permanently blank
  // one if it never lands.
  const [selfRevealed, setSelfRevealed] = useState(true);
  const reduceMotion = usePrefersReducedMotion();

  /*
    On the pinned strip the parent owns the reveal, because "entered" there
    means horizontal travel, not vertical scroll. In the stacked band each card
    has to watch itself: the whole strip is one flow element, so the parent has
    no per-card signal to give.

    Measured on lpas.com at 390px, each card's title fades in on its own as that
    card climbs the viewport — card 3 runs 0.25 → 1.00 across scrollY 800-1360,
    card 4 across 1040-1600, card 5 across 1280-1760. Passing a hardcoded
    `revealed` here (what this did before) meant the mobile cards were simply
    always on, and the homepage had no reveal at all on a phone.
  */
  // `useLayoutEffect` so the hide lands in the same commit as hydration and is
  // never painted in its visible state — `useEffect` here would flash the copy
  // in, then blink it out before fading it back.
  useIsomorphicLayoutEffect(() => {
    if (horizontal || reduceMotion) return;
    const node = articleRef.current;
    if (!node) return;

    // Only cards that have not reached the trigger line yet get hidden;
    // anything already past it stays as rendered, so nothing above the fold
    // blinks on load.
    const triggerLine = window.innerHeight * REVEAL_TRIGGER_FRACTION;
    if (node.getBoundingClientRect().top <= triggerLine) return;
    setSelfRevealed(false);

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setSelfRevealed(true);
        observer.disconnect(); // one-shot, like every reveal on the source
      }
    }, REVEAL_OBSERVER_INIT);

    observer.observe(node);
    return () => observer.disconnect();
  }, [horizontal, reduceMotion]);

  const contentRevealed = horizontal ? revealed : selfRevealed || reduceMotion;

  // Measured: the image starts 1.30x oversized and eases down to exactly fill
  // its frame. The rate slows as it approaches 1.0, so progress is shaped with
  // a ~1.7 power curve — a linear ramp visibly overshoots mid-travel.
  const imageScale = horizontal ? 1 + 0.3 * Math.pow(1 - progress, 1.7) : 1;

  const marketVars = {
    "--marketMainColor": card.mainColor,
    "--marketContentColor": card.contentColor,
  } as CSSProperties;

  return (
    <article
      ref={articleRef}
      className={cn(
        "homeHero__card relative -mr-[2px] grid overflow-hidden text-(--marketContentColor) transition-[filter] duration-500",
        horizontal
          ? "h-full aspect-[6/7] min-w-[500px] max-w-[min(80vw,900px)] shrink-0 grid-rows-[1fr_285px]"
          // Below 768 the source stops stacking image-over-text and lays the
          // card out as a 275px band: the copy fills the width and the photo
          // is a 28% strip down the right-hand edge, over it. Measured
          // 280.797px / 109.188px at a 390px viewport.
          : "h-[275px] w-full grid-cols-[72%_28%] grid-rows-[275px]",
        dimmed ? "brightness-50" : "brightness-100",
      )}
      style={marketVars}
    >
      <Link
        href={card.href}
        className={cn(
          "homeHero__cardImage relative z-[2] overflow-hidden",
          horizontal ? "col-span-full" : "col-start-2 row-start-1",
        )}
        aria-label={card.title.replace(/\s+/g, " ")}
      >
        <Image
          src={card.image.src}
          alt={card.image.alt}
          width={card.image.width}
          height={card.image.height}
          priority={card.index === 1}
          className="h-full w-full object-cover"
          style={{ transform: `scale(${imageScale})`, transformOrigin: "center" }}
        />
      </Link>

      {/* Spans both columns and shares row 1 with the image strip, which
          carries the higher z-index and so sits on top of it. */}
      <div
        className={cn(
          "homeHero__cardWraper col-span-full bg-(--marketMainColor)",
          !horizontal && "row-start-1",
        )}
      >
        <div
          className={cn(
            "homeHero__cardContent grid h-full grid-cols-[1fr_auto] grid-rows-[1fr_auto_auto] px-[30px] pb-0 pt-[40px]",
            horizontal ? "absolute inset-x-0 bottom-0 h-[285px]" : "px-[25px] py-[20px]",
          )}
        >
          <ButtonCircle
            href={card.href}
            color="market"
            label={`Explore ${card.title.replace(/\s+/g, " ")}`}
            className="z-[3] col-start-2 row-start-1 ml-auto transition-opacity duration-300"
            // Scrubbed rather than latched: the plus fades in gradually with travel.
            style={{ opacity: horizontal ? Math.min(1, progress * 1.35) : 1 }}
          />

          {card.subPages ? (
            <div
              className={cn(
                "homeHero__subPagesWrapper row-start-1 flex flex-wrap justify-between gap-x-[10px]",
                // On the band layout they stack under the title, pinned to the
                // bottom of the row, and stay clear of the image strip.
                horizontal
                  ? "col-span-full self-start"
                  : "col-start-1 mb-[10px] w-[222px] self-end",
              )}
            >
              {card.subPages.map((sub, i) => (
                <Link
                  key={sub.href}
                  href={sub.href}
                  className={cn(
                    "homeHero__subPageLink font-S flex items-center justify-between border-b border-current/40 pb-[8px] transition-opacity duration-500",
                    horizontal ? "w-[calc(50%-5px)]" : "w-full",
                    contentRevealed ? "opacity-100" : "opacity-0",
                  )}
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  {sub.title}
                  <ChevronIcon className="h-[11px] w-[6px]" />
                </Link>
              ))}
            </div>
          ) : null}

          {/*
            Title, count and subtitle share one entry: opacity 0 → 1 with a
            blur(10px) → none and a 10px lift. Measured to latch — once a card
            has entered it never blurs again, even after it leaves to the left.
          */}
          <h2
            className={cn(
              "homeHero__cardTitle font-XXL flex flex-col gap-[13px] transition-all duration-600 ease-out",
              // The band puts the title at the top of the card, not above the
              // count at the bottom the way the pinned strip does.
              horizontal ? "row-start-2" : "col-start-1 row-start-1 self-start",
              contentRevealed ? "opacity-100 blur-none" : "translate-y-[10px] opacity-0 blur-[10px]",
            )}
          >
            {/*
              The source stacks the title as separate flex children with a 13px
              gap — that is why "Higher  Education" carries a double space in
              the copy: it marks the line break. Splitting on it reproduces the
              two-line wrap without hard-coding a width.
            */}
            {card.title.split(/\s{2,}/).map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>

          {/*
            `homeHero__cardSubtitle--none`: the source hides the subtitle below
            768px on the one card that carries sub-page links, and only there —
            measured 0×0 at 390px but 77×43 at 1440px. Without this the band
            has no room left and the title lands on top of the links.
          */}
          <p
            className={cn(
              "homeHero__cardSubtitle font-S row-start-2 transition-all delay-100 duration-600 ease-out",
              horizontal
                ? "col-start-2 max-w-[160px] justify-self-end self-end text-right"
                : "col-start-1 mt-[30px] justify-self-start self-end text-left",
              !horizontal && card.subPages && "hidden",
              contentRevealed ? "opacity-100 blur-none" : "translate-y-[10px] opacity-0 blur-[10px]",
            )}
          >
            {card.subtitle[0]}
            <br />
            {card.subtitle[1]}
          </p>

          {/*
            A 100×68 crop of the same photo, set 53% across the copy column and
            spanning the subtitle and count rows — the source's
            `homeHero__cardImage--small`. It exists only on the band layout,
            and only on the cards that show a subtitle rather than sub-pages.
          */}
          {!horizontal && !card.subPages ? (
            <div
              className={cn(
                "homeHero__cardImage--small relative col-start-1 row-start-2 row-end-4 mt-[30px] ml-[53%] h-[68px] w-[100px] justify-self-start overflow-hidden transition-all delay-100 duration-600 ease-out",
                contentRevealed ? "opacity-100 blur-none" : "translate-y-[10px] opacity-0 blur-[10px]",
              )}
            >
              <Image
                src={card.image.src}
                alt=""
                fill
                sizes="100px"
                className="object-cover"
                aria-hidden="true"
              />
            </div>
          ) : null}

          <span
            className={cn(
              "homeHero__cardCount font-XS col-start-1 row-start-3 self-end transition-all delay-75 duration-600 ease-out",
              horizontal ? "pb-[30px] pt-[10px]" : "pt-[10px]",
              contentRevealed ? "opacity-100 blur-none" : "translate-y-[10px] opacity-0 blur-[10px]",
            )}
          >
            {card.index} / {card.total}
          </span>
        </div>
      </div>
    </article>
  );
}

/**
 * `useLayoutEffect` that does not warn when this client component is rendered
 * on the server, where layout effects never run and there is nothing to hide.
 */
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
