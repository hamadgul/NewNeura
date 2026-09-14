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

/*
  The stacked card's image strip slides in from the right as the card crosses
  the viewport — the animation the mobile view was missing entirely; ours held
  the strip at `transform: none` the whole way down.

  Measured on the source at 360 / 390 / 430 / 600px: the resting offset is
  121 / 131 / 144.5 / 201.6px against strip widths of 101 / 109 / 120 / 168 —
  a constant **1.20x the strip's own width**, so it is a percentage translate
  and needs no measurement at runtime.

  The run, fitted against the card's OWN top rather than against scrollY — that
  is what made the per-card timing comparable, since every card repeats the same
  curve as it crosses. The strip is home while the card's top is above 25% of
  the viewport height and fully offset once it passes 87.5%, on a ~2.5 power:

    card top (of 800px vh)   200   300   400   500   600   700
    source translate          0     2    14    33    84   131
    fitted                    0     2    13    37    75   131
*/
const STRIP_SLIDE_PERCENT = 120;
/** Fractions of the viewport height where the slide starts and completes. */
const STRIP_SLIDE_FROM = 0.25;
const STRIP_SLIDE_TO = 0.875;
const STRIP_SLIDE_POWER = 2.5;

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
/**
 * `sizes` for the strip image, computed per card because this slot CROPS.
 *
 * Without any `sizes`, `next/image` emits a DPR-descriptor `srcset` off the
 * declared file width, so the browser asked for `w=3840` — and because
 * `card.index === 1` is `priority`, that URL also went into a
 * `<link rel="preload">` at the highest priority the browser has, in front of
 * the hero video's own poster.
 *
 * Asking for 3840 was the wrong REQUEST, not (mostly) wasted bytes: the
 * optimiser never upscales, so `w=1200`, `w=1920` and `w=3840` all return the
 * same 99,283 bytes of a 1200x750 source. Measured, because the first attempt
 * here was `29vw` — the strip's measured box width — which cut those four
 * images to `w=384`, a 232 KiB "saving" that was really a 3.9x upscale.
 *
 * The slot is 110x275 on a phone and the stills are 1200x750, so
 * `object-cover` scales the source until its HEIGHT fills 275px and then
 * crops the width: the visible sliver is 110px wide but the image is being
 * rendered 440px wide, and `sizes` has to describe that, not the box. A
 * `sizes` derived from the box is exactly how a cropped slot goes soft while
 * every automated check stays green.
 *
 *   needed = max(boxWidth, boxHeight x imageRatio)
 *
 * Box geometry measured off the built page at fourteen widths (the RECT, so
 * the `scale(imageScale)` below is already in it):
 *
 *     320   393   480   767 | 768   960  1023 | 1024+
 *      90   110   134   215 | 799   998  ~1064|  1003   width  (28vw, 104vw, capped)
 *     275   275   275   275 | 585   585   585 |   585   height (fixed per band)
 *
 * At ratio 1.6 the crop term wins below 768 (440px against a 215px box) and
 * the box wins above it. A portrait still such as `packship-stacked` (480x750,
 * ratio 0.64) barely crops and lands on the box term instead, which is the
 * whole reason this is a function of the image rather than one string.
 */
function stripSizes(image: { width: number; height: number }) {
  const ratio = image.width / image.height;
  const px = (n: number) => `${Math.ceil(n)}px`;
  return [
    `(min-width: 1024px) ${px(Math.max(1003, 585 * ratio))}`,
    `(min-width: 768px) ${px(Math.max(1064, 585 * ratio))}`,
    px(Math.max(215, 275 * ratio)),
  ].join(", ");
}

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
    Written straight to the node rather than held in state: this runs on every
    scroll frame across five cards, and a `setState` each would be five React
    renders a frame for a value nothing else reads.
  */
  const stripRef = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    if (horizontal) return;
    const card = articleRef.current;
    const strip = stripRef.current;
    if (!card || !strip) return;

    if (reduceMotion) {
      strip.style.transform = "";
      return;
    }

    const sync = () => {
      const vh = window.innerHeight;
      const from = vh * STRIP_SLIDE_FROM;
      const span = vh * (STRIP_SLIDE_TO - STRIP_SLIDE_FROM);
      const v = clamp01((card.getBoundingClientRect().top - from) / span);
      const offset = STRIP_SLIDE_PERCENT * v ** STRIP_SLIDE_POWER;
      strip.style.transform = offset < 0.05 ? "" : `translateX(${offset.toFixed(2)}%)`;
    };

    sync();
    // Lenis dispatches `scroll` once per frame, so a passive listener is already
    // frame-rate — no rAF loop of our own, and none left running per card.
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
      strip.style.transform = "";
    };
  }, [horizontal, reduceMotion]);

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

  /** The pinned strip is wide enough for the full shot; the stacked one is not. */
  const stripImage = (!horizontal && card.imageStacked) || card.image;

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
        ref={stripRef}
        href={card.href}
        className={cn(
          "homeHero__cardImage relative z-[2] overflow-hidden",
          horizontal ? "col-span-full" : "col-start-2 row-start-1",
        )}
        aria-label={card.title.replace(/\s+/g, " ")}
      >
        {/*
          `imageStacked` when the band is stacked and the card carries one. The
          strip is 275px tall and 101-215px wide down here, so a wide shot is
          centre-cropped to about a hundred pixels of its middle; a card whose
          subject is off-centre (PackShip's two devices) needs its own crop.
          Falls back to `image`, which is what every other card uses at both
          widths. See the note in `content.ts`.
        */}
        <Image
          src={stripImage.src}
          alt={stripImage.alt}
          width={stripImage.width}
          height={stripImage.height}
          sizes={stripSizes(stripImage)}
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
            className={cn(
              "z-[3] col-start-2 row-start-1 ml-auto transition-opacity duration-300",
              /*
                On the stacked band the second column IS the image strip, so
                the plus sits over the photograph, not the band — and it is
                painted in `contentColor`, which was picked to contrast with
                the band. Three of five cards lost it: white on the dispatch
                UI (Applied AI), `#111` on the dark PackShip and pipeline shots
                (App Development, Data Intelligence). The other two read only
                because their screenshots happen to be dark.

                A disc of the card's own accent behind the ring gives it a
                ground the photo cannot change; `mainColor` / `contentColor`
                are already a contrast pair. The hover fill still rises in
                `contentColor` over it, so the flip is unchanged.
              */
              !horizontal && "bg-(--serviceMainColor)",
            )}
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
          ) : card.blurb ? (
            // The plain-language line that takes the links' slot on the one
            // card that has it. Same row, same reveal, same `font-S`; on the
            // strip it stops short of the plus in column 2, on the band it
            // takes the links' 222px column under the title.
            <p
              className={cn(
                "homeHero__cardBlurb font-S row-start-1 transition-opacity duration-500",
                horizontal
                  ? "col-start-1 max-w-[420px] self-start"
                  : "col-start-1 mb-[10px] w-[222px] self-end",
                contentRevealed ? "opacity-100" : "opacity-0",
              )}
            >
              {card.blurb}
            </p>
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
            has no room left and the title lands on top of the links. The
            `blurb` card takes the same slot, so it hides the subtitle too.
          */}
          <p
            className={cn(
              "homeHero__cardSubtitle font-S row-start-2 transition-all delay-100 duration-600 ease-out",
              horizontal
                ? "col-start-2 max-w-[160px] justify-self-end self-end text-right"
                : "col-start-1 mt-[30px] justify-self-start self-end text-left",
              !horizontal && (card.subPages || card.blurb) && "hidden",
              contentRevealed ? "opacity-100 blur-none" : "translate-y-[10px] opacity-0 blur-[10px]",
            )}
          >
            {card.subtitle[0]}
            <br />
            {card.subtitle[1]}
          </p>

          {/*
            The source puts a second, 100x68 crop of the same photo here on the
            band layout (`homeHero__cardImage--small`, 53% across the copy
            column, spanning the subtitle and count rows). Removed at the user's
            request: "get rid of the small screenshots next to the big ones on
            mobile view (the small full picture in the corner of each section
            but not the bigger one)".

            It reads differently here than it does on the source. LPAS's photos
            are architectural interiors, which survive a 100px crop; every image
            on this site is a product screenshot, so the thumbnail was a
            postage-stamp of UI sitting beside the full-height strip showing the
            same shot — a duplicate rather than a detail. See
            [[neuragul-port-visual-fixes]] on portrait slots cropping landscape
            screenshots.

            Nothing else moves when it goes: the subtitle (row 2) and the count
            (row 3) both carry explicit `col-start-1 row-start-*`, so neither
            was relying on this element to hold a track open.
          */}

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
