"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { ButtonCircle } from "../buttons";
import { ArrowIcon } from "../icons";

/* ==================================================================== *
 * BlockProcessCardSlider — the scroll-pinned "Our Process" carousel.
 *
 * Shared by all eight service pages (the four sibling service lines and the
 * four Applied AI sub-services), so every string and
 * every image arrives as a prop.
 *
 * ── The interaction, as measured on the live page (1440×800) ──────────
 *
 * The source wraps the section in a 2445px GSAP `pin-spacer` around a
 * 1140px-tall block: the block's top slides up to −340px, holds there for
 * 1305px of scrolling (2445 − 1140), then releases. −340px is exactly
 * `viewportHeight − blockHeight`, i.e. the block is pinned by its *bottom*
 * edge — which is what `position: sticky; bottom: 0` does natively. So the
 * pin here is CSS: a sticky section plus a 1305px spacer sibling. (The one
 * thing JS has to add is the anchor fallback for viewports shorter than the
 * 1140px section — see `anchorPin` below.) No
 * JS runs before first paint, and nothing about the layout depends on
 * hydration.
 *
 * Note the spacer is a *sibling*, not `padding-bottom` on the wrapper: a
 * sticky box is constrained to its containing block's **content** box, so
 * padding would give it nothing to travel through.
 *
 * Across that 1305px window three things are scrubbed, all measured from
 * the eight scroll samples in
 * `shared-blocks/BlockProcessCardSlider.raw.json` plus the matching
 * `processslider-scroll-{0..7}.png` frames:
 *
 *   1. The card track translates linearly from 0 to −(trackWidth −
 *      navWidth) = −870px at 1440. Verified against two frames: at
 *      progress 0.198 card 01 sits at x=285 (predicted 283) and at 0.466
 *      it sits at x=51 (predicted 50). It is a continuous scrub, not a
 *      slide-by-slide snap.
 *   2. `__listWrapper` fades 1 → 0 early (opacity is already 0 at
 *      progress 0.198) so the cards can slide over the space it occupied.
 *   3. `__headerTitle` ("Our Process") fades 1 → 0 later — still 1 at
 *      progress 0.198, already 0 at 0.466.
 *
 * ── Reduced motion / small screens ───────────────────────────────────
 *
 * The source itself drops the pin below the desktop breakpoint: at 390 and
 * 768 the block is a plain `<section>` (no `pin-spacer`), the phase list
 * collapses to a 0px grid row, the prev/next buttons appear, and the
 * carousel becomes a real (Swiper-initialised) swipeable strip. We
 * reproduce that with a native `overflow-x` scroller plus scroll-snap, and
 * reuse the exact same branch for `prefers-reduced-motion: reduce`, so a
 * reduced-motion desktop visitor gets an unpinned block with a working
 * list and working buttons.
 * ==================================================================== */

/** The block only pins at the width where `.ng-grid` becomes 20 columns. */
const DESKTOP_QUERY = "(min-width: 1280px)";
/** 2445px pin-spacer − 1140px block, measured on the live page. */
const DEFAULT_PIN_DISTANCE = 1305;
/** `gap` between slides, on both the nav and the track. */
const CARD_GAP = 10;
/** Progress at which `__listWrapper` has finished fading out. */
const LIST_FADE_END = 0.15;
/** Progress window over which `__headerTitle` fades out. */
const TITLE_FADE_START = 0.2;
const TITLE_FADE_END = 0.4;

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

export interface ProcessPhase {
  /** Two-digit ordinal, verbatim: "01" … "05". */
  number: string;
  /** Phase name — shown both in the left list and on the card. */
  title: string;
  /** Small caption beside the big number on the card artwork. */
  caption: string;
  /** Body copy in the dark panel. Clamped to three lines by the source. */
  text: string;
  /**
   * Card artwork. Paths live under `/sites/<site>/<page>/images/`.
   *
   * `position` overrides the default `object-position` for this one card. The
   * artwork slot is a 353x399 portrait box and every image here is a landscape
   * screenshot, so `object-cover` keeps the full height and shows well under
   * half the width — 46% of it at 353px, 42% at the phone's 322px. Centring
   * that window is right for a screenshot whose subject is in the middle and
   * wrong for one whose subject is not, and there is no way to tell from the
   * dimensions. Set it when the crop is cutting the thing the card is about.
   */
  image: { src: string; width: number; height: number; alt?: string; position?: string };
  /**
   * `cardItem__headerWrapper--dark` — set when the artwork is *light*, so
   * the number and caption painted over it go dark. The source alternates
   * it across slides 0, 2 and 4; leave it unset to get that pattern.
   *
   * This controls **type tone only**. It used to also drive the artwork's
   * corner bevel, but the two are independent in the source: on
   * on some pages the artwork luminance runs
   * light/light/dark/light/dark while the bevel stays on the odd slides. A
   * page overriding `dark` for legibility was therefore dragging the bevel
   * onto the wrong cards. Use `notch` for the bevel.
   */
  dark?: boolean;
  /**
   * The 40px diagonal cut on the artwork's top-right corner. Positional in
   * the source — odd-indexed slides carry it regardless of artwork tone — so
   * leave it unset unless a page genuinely differs.
   */
  notch?: boolean;
  /** Each slide is an `<a>` on the source. Without one we render a `<div>`. */
  href?: string;
}

export interface BlockProcessCardSliderProps {
  /** `__headerTagline` — "Workflow". */
  tagline: string;
  /** `__headerText` — the one-line description above the phase list. */
  intro: string;
  /** `__headerTitle` — "Our Process". Fades out across the pin. */
  title: string;
  /** `__listLabel`. */
  phasesLabel?: string;
  phases: ProcessPhase[];
  /** Scroll distance the block stays pinned for. Measured at 1305px. */
  pinDistance?: number;
  className?: string;
}

export function BlockProcessCardSlider({
  tagline,
  intro,
  title,
  phasesLabel = "Phases",
  phases,
  pinDistance = DEFAULT_PIN_DISTANCE,
  className,
}: BlockProcessCardSliderProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  const pinRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const [active, setActive] = useState(0);
  // Mirrored in a ref so the rAF loop can skip `setState` on every frame.
  const activeRef = useRef(0);

  const count = phases.length;

  /** Slide pitch — card width plus the 10px gap. Read live so it survives resize. */
  const stepWidth = () => {
    const first = trackRef.current?.firstElementChild;
    return first instanceof HTMLElement ? first.getBoundingClientRect().width + CARD_GAP : 0;
  };

  /**
   * Jump to a slide. In the pinned branch the carousel is a function of page
   * scroll, so the only honest way to "advance" it is to move the page —
   * which also keeps the header title and phase list in sync for free.
   */
  const goTo = useCallback(
    (index: number) => {
      const target = Math.min(Math.max(index, 0), count - 1);
      const nav = navRef.current;
      const pin = pinRef.current;
      const section = sectionRef.current;
      if (!nav || !pin || !section) return;

      if (!prefersReducedMotion && window.matchMedia(DESKTOP_QUERY).matches) {
        // Centre of slide `target`'s slice of the pin window.
        const wanted = (target + 0.5) / count;
        const pinStart = window.innerHeight - section.offsetHeight;
        const current = clamp01((pinStart - pin.getBoundingClientRect().top) / pinDistance);
        window.scrollTo({
          top: window.scrollY + (wanted - current) * pinDistance,
          behavior: "smooth",
        });
        return;
      }

      const step = stepWidth();
      if (step > 0) nav.scrollTo({ left: target * step, behavior: "smooth" });
    },
    [count, pinDistance, prefersReducedMotion],
  );

  useEffect(() => {
    const pin = pinRef.current;
    const section = sectionRef.current;
    const nav = navRef.current;
    const track = trackRef.current;
    if (!pin || !section || !nav || !track) return;

    const desktop = window.matchMedia(DESKTOP_QUERY);
    let frame = 0;

    const setActiveIndex = (next: number) => {
      const clamped = Math.min(Math.max(next, 0), count - 1);
      if (activeRef.current === clamped) return;
      activeRef.current = clamped;
      setActive(clamped);
    };

    /*
      Anchor the pin.

      `position: sticky; bottom: 0` is the whole pin, and it works only while
      the section fits the scrollport. The section is 1140px tall at xl; on any
      viewport shorter than that — a 900px laptop window, which is most of them
      — the constraint is unsatisfiable and the spec leaves an oversized sticky
      box *unoffset*, so it scrolls past like static content and the card track
      never advances. That is silent: nothing errors, the section simply stops
      pinning.

      A negative `top` expresses the same anchor in a form an oversized box can
      satisfy: `top: viewport − section` puts the section's bottom edge exactly
      on the viewport bottom, which is what `bottom: 0` meant. Set inline so it
      beats the utility, and cleared again whenever the section does fit (or
      when the pin is off entirely) so the measured CSS stays in charge.
    */
    const anchorPin = () => {
      if (prefersReducedMotion || !desktop.matches) {
        section.style.top = "";
        section.style.bottom = "";
        return;
      }
      const overhang = section.offsetHeight - window.innerHeight;
      if (overhang > 0) {
        section.style.top = `${-overhang}px`;
        section.style.bottom = "auto";
      } else {
        section.style.top = "";
        section.style.bottom = "";
      }
    };

    const paint = () => {
      frame = 0;
      anchorPin();

      // Unpinned branch: the nav is a native horizontal scroller, so the
      // track must own an identity transform (see trap #2 below) and the
      // scrubbed opacities must be released back to 1.
      if (prefersReducedMotion || !desktop.matches) {
        track.style.transform = "translate3d(0px, 0px, 0px)";
        if (titleRef.current) titleRef.current.style.opacity = "1";
        if (listRef.current) listRef.current.style.opacity = "1";
        const step = stepWidth();
        setActiveIndex(step > 0 ? Math.round(nav.scrollLeft / step) : 0);
        return;
      }

      // Pinned branch. The section sticks by its bottom edge, so the pin
      // engages exactly when the wrapper's top reaches `viewport − section`.
      const pinStart = window.innerHeight - section.offsetHeight;
      const progress = clamp01((pinStart - pin.getBoundingClientRect().top) / pinDistance);

      // Trap #2: Tailwind v4 emits `-translate-x-*` as the `translate`
      // property, which would *compose* with a JS-written `transform`
      // instead of overriding it. This element therefore carries no
      // translate utility at all and JS owns all three axes explicitly;
      // the identity value is seeded inline in the JSX below so the track
      // is already correct before the first scroll event.
      const distance = Math.max(0, track.scrollWidth - nav.clientWidth);
      track.style.transform = `translate3d(${-(progress * distance)}px, 0px, 0px)`;

      if (listRef.current) {
        listRef.current.style.opacity = String(1 - clamp01(progress / LIST_FADE_END));
      }
      if (titleRef.current) {
        titleRef.current.style.opacity = String(
          1 - clamp01((progress - TITLE_FADE_START) / (TITLE_FADE_END - TITLE_FADE_START)),
        );
      }

      setActiveIndex(Math.floor(progress * count));
    };

    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(paint);
    };

    paint();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    nav.addEventListener("scroll", schedule, { passive: true });
    desktop.addEventListener("change", schedule);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      nav.removeEventListener("scroll", schedule);
      desktop.removeEventListener("change", schedule);
    };
  }, [count, pinDistance, prefersReducedMotion]);

  return (
    <div
      ref={pinRef}
      className="relative"
      style={{ "--ng-pin": `${pinDistance}px` } as CSSProperties}
    >
      <section
        ref={sectionRef}
        data-control="BlockProcessCardSlider"
        className={cn(
          "blockProcessCardSlider ng-grid relative overflow-x-clip",
          // Measured section rows. <1280: header / 50 / 0 (the collapsed
          // phase list) / 700 (cards) / 50. ≥1280: header / 550 / 200, the
          // last row being the strip the 700px cards overhang into.
          "grid-rows-[auto_50px_0px_700px_50px] xl:grid-rows-[auto_550px_200px]",
          // The pin itself — CSS only, and off under reduced motion.
          "motion-safe:xl:sticky motion-safe:xl:bottom-0",
          className,
        )}
      >
        {/* ---------------------------------------------------------- *
         * Header. Full-bleed below 1280, starting at `main-start` above
         * it, where it becomes a subgrid so the intro lands on columns
         * 1–7 (355px) and the title on 7 → main-end (935px) without any
         * hard-coded widths. `--notch` is the diagonal corner the source
         * cuts out of the light panel: ~60px at 390, ~70px at 1440.
         * ---------------------------------------------------------- */}
        <div
          className={cn(
            "blockProcessCardSlider__header relative row-start-1 col-start-[full-start] col-end-[full-end] bg-[#f8f8f8]",
            "pt-[100px] pl-[25px] pr-[25px] md:pl-[40px] md:pr-[40px]",
            "xl:col-start-[main-start] xl:grid xl:grid-cols-subgrid xl:pt-[70px] xl:pr-0",
            "[--notch:60px] xl:[--notch:70px]",
            "[clip-path:polygon(0_0,calc(100%_-_var(--notch))_0,100%_var(--notch),100%_100%,0_100%)]",
          )}
        >
          <p className="blockProcessCardSlider__headerTagline font-S mb-[30px] block border-b border-[#595656] pb-[15px] text-[#595656] xl:col-start-1 xl:col-end-21 xl:row-start-1">
            {tagline}
          </p>

          <span className="blockProcessCardSlider__headerText font-M mb-[30px] block max-w-[355px] text-[#111111] xl:col-start-1 xl:col-end-7 xl:row-start-2 xl:max-w-none">
            {intro}
          </span>

          {/*
            Below 1280 the title and the prev/next buttons share one row —
            see `mobile-full.png`. At 1280 the wrapper becomes `contents`
            so both drop straight into the header subgrid at the columns
            the source puts them on.
          */}
          <div className="mt-[50px] flex items-center justify-between gap-[20px] xl:contents">
            <h2
              ref={titleRef}
              style={{ opacity: 1 }}
              className="blockProcessCardSlider__headerTitle font-3XL text-[#747474] xl:col-start-7 xl:col-end-21 xl:row-start-2 xl:mt-[180px]"
            >
              {title}
            </h2>

            {/*
              Measured `display: none` at 1440 — the pin drives the
              carousel there, so the source hides the controls. They stay
              available under reduced motion, where the pin is off.
            */}
            <div className="blockProcessCardSlider__sliderButtons flex shrink-0 justify-end gap-[10px] motion-safe:xl:hidden xl:col-start-19 xl:col-end-21 xl:row-start-3 xl:mt-[50px]">
              <button
                type="button"
                onClick={() => goTo(active - 1)}
                aria-label="Previous phase"
                className="buttonCircle--back cursor-pointer"
              >
                <ButtonCircle
                  asStatic
                  label="Previous phase"
                  icon={<ArrowIcon className="h-[19px] w-[19px] rotate-180" />}
                />
              </button>
              <button
                type="button"
                onClick={() => goTo(active + 1)}
                aria-label="Next phase"
                className="buttonCircle--forward cursor-pointer"
              >
                <ButtonCircle
                  asStatic
                  label="Next phase"
                  icon={<ArrowIcon className="h-[19px] w-[19px]" />}
                />
              </button>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------- *
         * Main — the second light panel. Only carries the phase list;
         * the cards are a sibling so they can slide out over it.
         * ---------------------------------------------------------- */}
        <div className="blockProcessCardSlider__main col-start-[full-start] col-end-[full-end] row-start-2 row-end-6 bg-[#f8f8f8] py-[50px] xl:col-start-[main-start] xl:row-start-2 xl:row-end-3 xl:grid xl:grid-cols-subgrid xl:grid-rows-1">
          <div
            ref={listRef}
            style={{ opacity: 1 }}
            className="blockProcessCardSlider__listWrapper hidden flex-col justify-end gap-[10px] xl:col-start-1 xl:col-end-6 xl:row-start-1 xl:ml-[40px] xl:flex xl:h-[450px]"
          >
            <p className="blockProcessCardSlider__listLabel font-S text-[#595656]">{phasesLabel}</p>
            <ul className="blockProcessCardSlider__list mt-[15px] flex flex-col gap-[10px]">
              {phases.map((phase, index) => (
                <li
                  key={phase.number}
                  data-cardindex={index}
                  className="blockProcessCardSlider__listItem text-[#262626]"
                >
                  <button
                    type="button"
                    onClick={() => goTo(index)}
                    aria-current={index === active ? "step" : undefined}
                    // `min-h`, not `h`. 32.4px is the measured one-line row and
                    // stays the floor, but a two-line title needs the row to
                    // grow — pinned, the second line rendered on top of the next
                    // phase. `items-start` + the number's own line-height keeps
                    // the digit aligned to the title's first line.
                    className="grid min-h-[32.4px] w-full cursor-pointer grid-cols-[35px_1fr] items-start text-left transition-opacity duration-300 hover:opacity-60"
                  >
                    <span
                      className={cn(
                        // `leading-[32.4px]` matches the `font-SM` title's own
                        // line box, so the digit sits on the title's first line
                        // now that the row can grow past one line.
                        "blockProcessCardSlider__listItemNumber font-S leading-[32.4px]",
                        // The scroll samples record an identical colour on
                        // every phase row, so there is no measured active
                        // state; nudging only the number keeps the active
                        // slide legible without contradicting the capture.
                        index === active ? "text-[#262626]" : "text-[#595656]",
                      )}
                    >
                      {phase.number}
                    </span>
                    {/*
                      Two lines, not one. The layout's phase titles were short
                      noun phrases ("Discovery + Feasibility"); ours are
                      sentences, and at `line-clamp-1` in this 288px column they
                      came out as "Read the log, refuse t…", "Apply every rule
                      the…", "Hand it to the van an…" — every one cut mid-word.
                    */}
                    <span className="blockProcessCardSlider__listItemTitle font-SM line-clamp-2">
                      {phase.title}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ---------------------------------------------------------- *
         * The carousel. A native scroller below 1280 (and under reduced
         * motion); at 1280+ `overflow` goes visible so the scrubbed track
         * can spill left over the panel and right to the viewport edge,
         * where the section's `overflow-x: clip` catches it.
         * ---------------------------------------------------------- */}
        <nav
          ref={navRef}
          aria-label={title}
          className={cn(
            "blockProcessCardSlider__contentSection relative col-start-[main-start] col-end-[main-end] row-start-4 row-end-5 flex gap-[10px]",
            "overflow-x-auto [scrollbar-width:none] [scroll-snap-type:x_mandatory] [&::-webkit-scrollbar]:hidden",
            "xl:col-start-8 xl:row-start-2 xl:row-end-4 xl:pt-[50px]",
            "motion-safe:xl:overflow-visible motion-safe:xl:[scroll-snap-type:none]",
          )}
        >
          <div
            ref={trackRef}
            // Seeded identity transform: JS owns every axis of this
            // element's `transform`, and it must already be right before
            // the first scroll event and under reduced motion.
            style={{ transform: "translate3d(0px, 0px, 0px)" }}
            className="blockProcessCardSlider__contentSectionWrapper relative z-[1] flex w-max gap-[10px]"
          >
            {phases.map((phase, index) => (
              <ProcessCard key={phase.number} phase={phase} index={index} />
            ))}
          </div>
        </nav>
      </section>

      {/*
        The pin spacer. A sibling rather than padding on the wrapper,
        because a sticky box is constrained to its containing block's
        content box — padding would give it nothing to travel through.
        1140 + 1305 reproduces the source's 2445px `pin-spacer` exactly.
      */}
      <div aria-hidden="true" className="motion-safe:xl:h-[var(--ng-pin)]" />
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * A single `.cardItem` slide: 353×700, split 399/301 between the
 * artwork and the dark copy panel. Both panels carry a 40px diagonal
 * corner — the copy panel always at bottom-right, the artwork at
 * top-right on the odd-indexed slides. Tone (`dark`) and bevel (`notch`)
 * are independent props because a page can want one without the other.
 * ------------------------------------------------------------------ */
function ProcessCard({ phase, index }: { phase: ProcessPhase; index: number }) {
  // Tone and bevel are deliberately independent — see `ProcessPhase.dark`.
  const dark = phase.dark ?? index % 2 === 0;
  const notch = phase.notch ?? index % 2 === 1;

  const body: ReactNode = (
    <>
      <div
        className={cn(
          "cardItem__headerWrapper relative col-start-1 row-start-1 grid grid-cols-1 grid-rows-[399px_0px] overflow-hidden bg-[#c9d3df]",
          dark ? "text-[#262626]" : "text-[#ececec]",
          notch && "[clip-path:polygon(0_0,calc(100%_-_40px)_0,100%_40px,100%_100%,0_100%)]",
        )}
      >
        <Image
          src={phase.image.src}
          alt={phase.image.alt ?? ""}
          width={phase.image.width}
          height={phase.image.height}
          sizes="(min-width: 443px) 353px, calc(100vw - 90px)"
          className="absolute inset-0 z-[1] h-full w-full object-cover object-top"
          style={phase.image.position ? { objectPosition: phase.image.position } : undefined}
        />

        {/*
          Scrim under the number and caption.

          The header band has no ground of its own — the number and caption sit
          straight on the artwork and rely on the card's tone class alone. That
          works over the even, quiet photography the layout was drawn for. Every
          image here is a screenshot, so the band lands on whatever the client's
          own page happens to put at the top: "01" went white-on-white over a
          Lighthouse panel, and the captions were unreadable on most cards.

          A gradient rather than a flat panel, so it fades out before the
          artwork proper and does not read as a bar across the image. Its colour
          follows the tone: a light wash under dark type, a dark one under
          light. 130px covers the 95px band plus the fade.
        */}
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 z-[1] h-[130px]",
            // Held near full strength across the 95px band, then released over
            // the remaining 35px. A plain two-stop gradient was already fading
            // where the caption sits — measured 1.9:1 on a card whose artwork
            // is a white table — so the stops are placed against the band, not
            // spread evenly down the box.
            dark
              ? "bg-[linear-gradient(to_bottom,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0.9)_73%,rgba(255,255,255,0)_100%)]"
              : "bg-[linear-gradient(to_bottom,rgba(0,0,0,0.85)_0%,rgba(0,0,0,0.78)_73%,rgba(0,0,0,0)_100%)]",
          )}
        />

        <div className="cardItem__header relative z-[2] col-start-1 row-start-1 flex h-[95px] items-center gap-[15px] pr-[35px] pl-[25px]">
          <span className="font-3XL shrink-0">{phase.number}</span>
          <span className="text-[16px] leading-[21.6px]">{phase.caption}</span>
        </div>
      </div>

      <div className="cardItem__content relative z-[2] col-start-1 row-start-2 grid grid-cols-[1fr_45px] grid-rows-[70%_30%] bg-[#262626] p-[25px] [clip-path:polygon(0_0,100%_0,100%_calc(100%_-_40px),calc(100%_-_40px)_100%,0_100%)]">
        <span className="cardItem__contentTitle font-L col-start-1 row-start-1 self-start overflow-hidden pr-[7px] text-white">
          {phase.title}
        </span>
        <div className="col-start-2 row-start-1 self-start">
          <ButtonCircle asStatic color="white" label={phase.title} />
        </div>
        <p className="cardItem__contentText col-start-1 col-end-3 row-start-2 mb-[5px] self-end text-[16px] leading-[21.6px] text-[#d6d6d6] line-clamp-3">
          {phase.text}
        </p>
      </div>
    </>
  );

  // `group` so the card's own hover drives `ButtonCircle`'s fill, which is
  // what the source's `data-btnhover="white"` does.
  const classes = cn(
    "cardItem group relative grid h-[700px] w-[calc(100vw-90px)] max-w-[353px] shrink-0 grid-cols-1 grid-rows-[399px_301px] text-white",
    "[scroll-snap-align:start] xl:w-[353px]",
  );

  if (phase.href) {
    return (
      <Link href={phase.href} className={classes} data-btnhover="white">
        {body}
      </Link>
    );
  }

  return (
    <div className={classes} data-btnhover="white">
      {body}
    </div>
  );
}
