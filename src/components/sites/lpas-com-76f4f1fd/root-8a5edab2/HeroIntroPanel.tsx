import { cn } from "@/lib/utils";
import { ButtonArrow, ButtonCircle } from "../shared/buttons";
import { HERO_INTRO, HERO_VIDEO } from "./content";

/**
 * The fixed left-hand panel of the hero: office video, two eyebrow labels, a
 * scroll cue, and the headline.
 *
 * It is `calc(100vw - 200px)` wide rather than full-bleed, which is what leaves
 * the first market card peeking in from the right edge at rest — the visual hint
 * that the strip scrolls sideways.
 */
export function HeroIntroPanel() {
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
        "homeHero__main relative isolate grid h-full w-[calc(100vw-200px)] shrink-0 gap-x-[10px] max-lg:w-screen",
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
        brightness(0.5) is what keeps the white type legible over it.
      */}
      <video
        className="homeHero__mainBackground absolute left-0 top-0 -z-[2] h-full w-screen object-cover brightness-50"
        src={HERO_VIDEO.src}
        poster={HERO_VIDEO.poster}
        autoPlay
        muted
        loop
        playsInline
      />
      <div
        aria-hidden="true"
        className="homeHero__mainOverlay pointer-events-none absolute inset-0 z-[5]"
      />

      <span className="homeHero__detail--one font-S relative z-10 row-start-2 self-center text-white [grid-column:1/7] max-md:row-start-3 max-md:self-start max-md:[grid-column:2/-1]">
        {HERO_INTRO.eyebrowLeft}
      </span>

      <span className="homeHero__detail--two font-S relative z-10 row-start-2 self-center text-white [grid-column:7/span_6] max-md:row-start-3 max-md:self-start max-md:[grid-column:4/-1]">
        {HERO_INTRO.eyebrowRight}
      </span>

      <div className="homeHero__detail--three font-S relative z-10 row-start-2 flex items-center justify-end gap-[10px] justify-self-end self-start text-white [grid-column:-5/-1] max-md:row-start-5 max-md:w-fit max-md:justify-start max-md:justify-self-start max-md:self-end max-md:border-b max-md:border-white max-md:pb-[8px] max-md:[grid-column:2/-1]">
        {/* Copy swaps at the 768px breakpoint — the source ships both spans and toggles them. */}
        <span className="max-md:hidden">{HERO_INTRO.scrollCueDesktop}</span>
        <span className="md:hidden">{HERO_INTRO.scrollCueMobile}</span>
        {/* Rotated a quarter turn so the arrow points down the page. */}
        <ButtonArrow asStatic border className="rotate-90 max-md:hidden" />
      </div>

      <header className="homeHero__title relative z-10 row-start-3 max-w-[900px] self-end text-white [grid-column:1/-1] max-md:row-start-4 max-md:[grid-column:2/-2]">
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
