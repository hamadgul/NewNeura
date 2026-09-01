"use client";

/**
 * BlockImageSlider — the 32-image strip on `/culture/`.
 *
 * INTERACTION MODEL (decided by INTERACTIONS_PROBE.json, not assumed):
 * `culture.sliderOverTime` samples the track four times with no interaction and
 * records `transform: "none", scrollLeft: 0` every time, and `culture.slider`
 * reports `trackTransform: "none"` / `trackAnimation: "none"`. So the strip does
 * NOT autoplay — it is drag/scroll driven. The source markup confirms it:
 * Swiper in `swiper-free-mode` with `data-showblob="Drag"`, a progressbar and
 * prev/next buttons, no autoplay module. This is built as a native horizontal
 * scroller (free scrolling, no snap) with mouse-drag, arrow buttons and a
 * progress thumb.
 *
 * Because the track scrolls rather than transforms, BUILDER_CONVENTIONS trap #2
 * cannot bite here: nothing in this file writes `transform`. The progress thumb
 * is driven with `width` / `left` percentages for the same reason — a JS-written
 * `translate3d` would compose with Tailwind's `translate` property rather than
 * override it.
 *
 * Geometry (measured; GRID_AREAS.json heights reverse-solve the Swiper config
 * exactly, since track height = tallest slide = slideWidth × 4/3 for the 3:4
 * portraits, plus the 45px nav row + its 20px margin wherever the nav shows):
 *
 *   390px : slidesPerView 1.2 → slide 323.25px; 431 + 65 = 496.09 ✓
 *   768px : slidesPerView 1.5 → slide 508.67px; 678 + 65 = 743.20 ✓
 *   1440px: slidesPerView 3   → slide 473.33px; 631.09, nav hidden ✓
 *
 * Swiper's slide size is `(containerWidth − gap × (spv − 1)) / spv`, which is
 * exactly what the `w-[calc(...)]` values below reproduce off the flex
 * container's own width. Below 1280 the first slide is offset to `main-start`
 * (15/30px edge + the grid's 10px gap = 25/40px) via a leading spacer, so the
 * percentage widths keep resolving against the full container box; at 1280+ the
 * strip is edge-to-edge, exactly as the source renders it.
 */
import Image from "next/image";
import { type PointerEvent as ReactPointerEvent, useCallback, useEffect, useRef, useState } from "react";
import { ButtonCircle } from "@/components/sites/lpas-com-76f4f1fd/shared/buttons";
import { ArrowIcon } from "@/components/sites/lpas-com-76f4f1fd/shared/icons";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

/** Column gap between slides, in px — the grid's gap, and Swiper's spaceBetween. */
const SLIDE_GAP = 10;

export interface SliderImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface BlockImageSliderProps {
  images: SliderImage[];
  className?: string;
}

export function BlockImageSlider({ images, className }: BlockImageSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Progress thumb geometry, both 0..1. `thumb` is the fraction of the bar the
  // fill occupies, `offset` how far along the bar it has travelled.
  const [thumb, setThumb] = useState(1);
  const [offset, setOffset] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const max = track.scrollWidth - track.clientWidth;
    // 1px slack: sub-pixel slide widths mean scrollLeft never lands exactly on
    // `max`, which would leave the next button permanently enabled.
    setAtStart(track.scrollLeft <= 1);
    setAtEnd(track.scrollLeft >= max - 1);
    setOffset(max > 0 ? track.scrollLeft / max : 0);

    // Swiper sizes the progressbar fill as one snap step, i.e.
    // 1 / (slides − slidesPerView + 1). At 1440 that is 1/30 for 32 slides at
    // 3 per view — the exact scaleX(0.0333333) the probe captured. Deriving
    // slidesPerView from the live slide width keeps that true at every width.
    const slide = track.querySelector<HTMLElement>("[data-slide]");
    const step = slide ? slide.offsetWidth + SLIDE_GAP : 0;
    const perView = step > 0 ? track.clientWidth / step : 1;
    const steps = Math.max(1, images.length - perView + 1);
    setThumb(Math.min(1, 1 / steps));
  }, [images.length]);

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

  /** Advance by one slide, the way the source's prev/next buttons do. */
  const step = useCallback(
    (direction: -1 | 1) => {
      const track = trackRef.current;
      if (!track) return;
      const slide = track.querySelector<HTMLElement>("[data-slide]");
      const distance = slide ? slide.offsetWidth + SLIDE_GAP : track.clientWidth;
      track.scrollBy({
        left: direction * distance,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    },
    [prefersReducedMotion],
  );

  // Mouse drag-to-scroll — the source's "Drag" cursor blob. Touch is left to
  // the browser's own momentum scrolling, which is why this is gated on
  // pointerType: hijacking touch would replace a good native gesture with a
  // worse one.
  const drag = useRef<{ pointerId: number; startX: number; startScroll: number } | null>(null);

  const onPointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    const track = trackRef.current;
    if (!track) return;
    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScroll: track.scrollLeft,
    };
    track.setPointerCapture(event.pointerId);
  }, []);

  const onPointerMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    const track = trackRef.current;
    if (!state || !track || state.pointerId !== event.pointerId) return;
    event.preventDefault();
    track.scrollLeft = state.startScroll - (event.clientX - state.startX);
  }, []);

  const endDrag = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    const track = trackRef.current;
    if (!state || !track || state.pointerId !== event.pointerId) return;
    drag.current = null;
    if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);
  }, []);

  return (
    <div className={cn("blockImageSlider lpas-grid relative my-[120px] overflow-hidden", className)}>
      {/* Hidden at 1280+ — every navigation element measured 0×0 there, and the
          block's 631.09px height leaves no room for the 45+20px nav row. */}
      <div className="blockImageSlider__navigation col-start-[main-start] col-end-[main-end] row-start-1 mb-[20px] flex h-fit items-center gap-[20px] xl:hidden">
        <div className="swiper-progressbar blockImageSlider__progressbar relative z-10 h-px flex-1 rounded-[2px] bg-[#d6d6d6]">
          <span
            className="swiper-pagination-progressbar-fill absolute top-0 block h-full bg-[#111111]"
            // Percentages, not a transform: see the trap #2 note in the header.
            // `offset` travels the thumb across the leftover track.
            style={{ width: `${thumb * 100}%`, left: `${offset * (100 - thumb * 100)}%` }}
          />
        </div>

        <div className="blockImageSlider__navigation--buttonContainer flex gap-[10px]">
          <NavButton
            label="Previous image"
            direction="prev"
            disabled={atStart}
            onClick={() => step(-1)}
          />
          <NavButton label="Next image" direction="next" disabled={atEnd} onClick={() => step(1)} />
        </div>
      </div>

      {/* The scroll port IS the flex container, so the slides' percentage widths
          resolve against a definite box (a `w-max` wrapper would make them
          cyclic and collapse to auto). `scrollbarWidth` hides the bar without
          touching globals.css. */}
      <div
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="blockImageSlider__slider col-start-[1] col-end-[-1] row-start-2 flex touch-pan-y items-start gap-[10px] overflow-x-auto overscroll-x-contain select-none cursor-grab active:cursor-grabbing"
        style={{ scrollbarWidth: "none" }}
      >
        {/* Swiper's slidesOffsetBefore below 1280: the 15/30px page edge plus the
            grid's 10px gap puts the first slide on `main-start`. A spacer keeps
            it out of the container's padding so the widths below stay exact. */}
        <div aria-hidden="true" className="w-[15px] shrink-0 md:w-[30px] xl:hidden" />

        {images.map((image, index) => (
          <div
            key={`${image.src}-${index}`}
            data-slide=""
            className="blockImageSlider__slide w-[calc((100%-2px)/1.2)] shrink-0 md:w-[calc((100%-5px)/1.5)] xl:w-[calc((100%-20px)/3)]"
          >
            {/* Slides are top-aligned and keep each image's own aspect ratio —
                the tallest (3:4) is what sets the strip's height. */}
            <figure className="blockImageSlider__imageContainer overflow-hidden">
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                draggable={false}
                sizes="(min-width: 1280px) 33vw, (min-width: 768px) 67vw, 83vw"
                className="h-auto w-full object-cover"
              />
            </figure>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * `ButtonCircle` renders a non-interactive span when it has no `href`, so the
 * real `<button>` wraps it (`asStatic` marks the visual chip `aria-hidden`).
 * The source's slate tone — a #d6d6d6 fill that drops away when the button is
 * disabled — isn't one of ButtonCircle's variants, so it comes in by class;
 * the rising #262626 hover disc is ButtonCircle's own `black` fill.
 */
function NavButton({
  label,
  direction,
  disabled,
  onClick,
}: {
  label: string;
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="rounded-full disabled:cursor-default"
    >
      <ButtonCircle
        asStatic
        label={label}
        className={cn(
          "border-[#d6d6d6] text-[#262626]",
          !disabled && "bg-[#d6d6d6]",
          `buttonCircle--blockImageSlider__arrow--${direction}`,
        )}
        icon={
          <ArrowIcon className={cn("h-[19px] w-[19px]", direction === "prev" && "rotate-180")} />
        }
      />
    </button>
  );
}
