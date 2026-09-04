"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { REVEAL_OBSERVER_INIT, REVEAL_TRIGGER_FRACTION } from "../shared/reveal";
import type { HeroServiceCard as HeroServiceCardData } from "@/types/site";
import { ButtonCircle } from "../shared/buttons";
import { ChevronIcon } from "../shared/icons";

/** Progress at which a card's entry animation starts — see `imageScale` below. */
const ENTRY_START = 0.136;
/** Progress at which the colour band has finished collapsing. */
const BAND_END = 0.64;
const BAND_POWER = 1.9;
const IMAGE_POWER = 1.55;
/** The band's resting height, and the height of the content pinned inside it. */
const BAND_REST_PX = 285;

const clamp01 = (n: number) => Math.min(Math.max(n, 0), 1);

interface HeroServiceCardProps {
  card: HeroServiceCardData;
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
 * One service panel in the hero strip.
 *
 * The card is `aspect-ratio: 6/7` at full height, which is what produces the
 * measured 771px width at a 900px viewport. `margin-right: -2px` closes the
 * seam so the five cards read as one continuous band rather than as tiles.
 */
export function HeroServiceCard({
  card,
  progress,
  revealed,
  dimmed = false,
  horizontal,
}: HeroServiceCardProps) {
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

    Measured at 390px, each card's title fades in on its own as that
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

  /*
    Card entry, sampled off the live source at 1440x900 and 1280x700 by
    scrubbing the pin in 40px steps and reading `gridTemplateRows` and the
    image's transform against the card's left edge.

    Nothing moves while the card is merely parked. At rest its left edge sits
    at `introWidth`, which is on-screen — 200px of the first card shows — and
    the source holds `1.3` and a half-height colour band until the card has
    come in about 220px further. In this component's `progress` that threshold
    lands at 0.136 at BOTH viewport sizes, which is what makes it a threshold
    on entry rather than a coincidence of one viewport.

    From there two things run at different rates:

      the colour band  50% of the card → 285px, done by progress ~0.64
      the image        scale 1.3 → 1.0, still easing out at progress 1

    Both are ease-outs. The band's exponent fits 1.9 across both viewports
    (the fitted end point is 0.66 at 1440x900 and 0.61 at 1280x700 — 0.64
    splits them, and the curve is flat enough there that the difference is
    a few pixels of band height). The image's fits 1.55.

    The image exponent was first fitted at 1.35, against a clone whose strip
    still ran at the wrong speed away from 1440x900 — so the sampled source and
    clone frames were not at the same card position and the fit absorbed the
    error. It was refitted here once `HomeHero`'s pin geometry was corrected and
    the two strips lined up to the pixel.
  */
  const entry = horizontal ? clamp01((progress - ENTRY_START) / (1 - ENTRY_START)) : 1;
  const imageScale = horizontal ? 1 + 0.3 * Math.pow(1 - entry, IMAGE_POWER) : 1;

  // 1 = band at its maximum (half the card), 0 = collapsed to its resting
  // 285px. The content inside it is 285px tall and pinned to the bottom, so
  // the extra height reads purely as more colour above the title.
  const bandOpen = horizontal
    ? Math.pow(1 - clamp01((progress - ENTRY_START) / (BAND_END - ENTRY_START)), BAND_POWER)
    : 0;

  const serviceVars = {
    "--serviceMainColor": card.mainColor,
    "--serviceContentColor": card.contentColor,
  } as CSSProperties;

  return (
    <article
      ref={articleRef}
      className={cn(
        "homeHero__card relative -mr-[2px] grid overflow-hidden text-(--serviceContentColor) transition-[filter] duration-500",
        horizontal
          ? "h-full aspect-[6/7] min-w-[500px] max-w-[min(80vw,900px)] shrink-0"
          // Below 768 the source stops stacking image-over-text and lays the
          // card out as a 275px band: the copy fills the width and the photo
          // is a 28% strip down the right-hand edge, over it. Measured
          // 280.797px / 109.188px at a 390px viewport.
          : cn(
              "h-[275px] w-full grid-cols-[72%_28%] grid-rows-[275px]",
              /*
                DELIBERATE DIVERGENCE — a hairline between stacked cards. The
                source has none, and its geometry is what we match exactly
                (275px tall, zero gap). It gets away with it because its image
                strips are photographs of different buildings: measured at the
                card boundary, the source's strip steps 56 -> 83 in luma, a
                delta of 27 that the eye reads as an edge.

                Ours are all bright UI screenshots — 240 -> 237, a delta of 3 —
                so two adjacent strips merge into one white block and the card
                boundary disappears on the 28% of the width where the accent
                colour does not reach. The user: "its hard to identify where the
                section ends. the two section pictures are coliding and hard to
                tell them apart."

                Remove this the day the cards carry tonally varied artwork; it
                is a patch for the imagery, not a correction to the layout.

                              A white hairline was the first attempt and it disappeared:
                against a 240-luma screenshot, white on white. This is the
                card's OWN accent instead, which means it is invisible across
                the 72% where that colour already is, and draws a 2px accent
                edge exactly where the two screenshots meet.
              */
              "border-t-2 border-(--serviceMainColor) first:border-t-0",
            ),
        dimmed ? "brightness-50" : "brightness-100",
      )}
      style={{
        ...serviceVars,
        // A percentage row track resolves against the card's own height, so
        // this needs no viewport measurement and stays right through a resize.
        ...(horizontal
          ? {
              gridTemplateRows: `1fr calc(${BAND_REST_PX}px + (50% - ${BAND_REST_PX}px) * ${bandOpen.toFixed(4)})`,
            }
          : null),
      }}
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
          "homeHero__cardWraper col-span-full bg-(--serviceMainColor)",
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
            color="service"
            label={`Explore ${card.title.replace(/\s+/g, " ")}`}
            className="z-[3] col-start-2 row-start-1 ml-auto transition-opacity duration-300"
            // Scrubbed rather than latched: the plus fades in gradually with travel.
            style={{ opacity: horizontal ? Math.min(1, progress * 1.35) : 1 }}
          />

          {card.subPages ? (
            <div
              className={cn(
                // Row gap measured on the source: the wrapper is 222x142 at a 390px
                // viewport (four 28px rows + three 10px gaps) and 626x71 at
                // desktop (two rows + one 15px gap). Ours had `gap-x` only, so
                // the rows touched — 222x112 and 626x56 — and four underlined
                // links with no air between them read as a dense table rather
                // than a list.
                "homeHero__subPagesWrapper row-start-1 flex flex-wrap justify-between gap-x-[10px] gap-y-[10px] md:gap-y-[15px]",
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
              "homeHero__cardTitle flex flex-col gap-[13px] transition-all duration-600 ease-out",
              horizontal
                ? // The pinned strip has 500-900px of card to work with, so the
                  // title keeps its full 44-56px step there.
                  "font-XXL row-start-2"
                : // The stacked band is 393px wide and its title box overlaps
                  // the image strip by 40px, which is invisible for a short
                  // noun and swallows the tail of a long one. The service names
                  // here run to "Cloud & Infrastructure" (14 characters in the
                  // longest word), which at 44px measures ~300px against the
                  // 258px of clear space before the image. One step down to
                  // `font-XL` (32px) brings the widest word to ~218px, so every
                  // title clears the strip. `w-[258px]` pins that clearance so
                  // it holds if a name grows again.
                  "font-XL col-start-1 row-start-1 w-[258px] self-start",
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
