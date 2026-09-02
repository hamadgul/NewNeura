"use client";

/**
 * The intro overlay: a dark ground on which "LPAS" unfolds into
 * "Listen / Plan / Analyze / Shape".
 *
 * Measured off lpas.com (mobile, 390px) by sampling the GSAP-written inline
 * styles every 120ms across a page load. The three beats, with times relative
 * to the start of the theme's timeline:
 *
 *   0.00 – 0.86s  the four capitals fade up one at a time — `opacity 0 → 1`,
 *                 `filter: blur(10px) → none`, `translateY(10px) → 0`,
 *                 ~500ms each, ~287ms apart.
 *   1.23 – 2.28s  each word's remainder unfurls to the right while the block
 *                 re-centres, so "L P A S" becomes the four words. The source
 *                 does this by translating the tail spans and counter-moving
 *                 the sections; we get the same motion — and the same
 *                 re-centring — from a `0fr → 1fr` grid column, with no
 *                 measured widths to keep in sync.
 *   2.48 – 3.13s  the words fade out, then the overlay fades out behind them.
 *
 * The four words carry NO gaps: the source's wrapper is 193px tall at 390px,
 * which is exactly 4 × the 48.4px `font-XXL` line box. An earlier version of
 * this file played a full-bleed copy of the hero video here — the source has
 * no media in the preloader at all, only the wordmark.
 *
 * Mounted from the root layout, not from each page. In the source every
 * navigation is a document load, so the overlay covers real load time; here
 * navigation is client-side, and mounting this per route replayed the whole
 * 3.4s intro on top of an already-instant transition. Living in the layout
 * means it plays once per document load — on first arrival and on reloads,
 * which is where the source plays it too.
 */
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { releaseIntro } from "../shared/introGate";
import { PRELOADER_WORDS } from "./content";

/** ms before the first capital starts to arrive. */
const LETTERS_START_MS = 250;
/** ms between each capital's entrance. */
const LETTER_STAGGER_MS = 287;
/** ms for one capital's fade/blur/lift. */
const LETTER_MS = 500;
/** ms at which the words unfurl (measured 1.23s after the first capital). */
const EXPAND_START_MS = LETTERS_START_MS + 1230;
/** ms for the unfurl. */
const EXPAND_MS = 1050;
/** ms at which the words start to fade. */
const WORDS_OUT_MS = EXPAND_START_MS + EXPAND_MS + 200;
/** ms for the words' fade. */
const WORDS_OUT_DURATION_MS = 350;
/** ms for the overlay's own fade, which follows the words. */
const FADE_MS = 300;

type Phase = "letters" | "expanded" | "wordsOut" | "leaving" | "done";

export function Preloader() {
  const [phase, setPhase] = useState<Phase>("letters");
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    // Under reduced motion the component returns null below without ever
    // scheduling these, so the page is simply there on arrival — and the hero
    // behind it must not sit waiting for a curtain that never rises.
    if (reduceMotion) {
      releaseIntro();
      return;
    }

    const timers = [
      window.setTimeout(() => setPhase("expanded"), EXPAND_START_MS),
      window.setTimeout(() => setPhase("wordsOut"), WORDS_OUT_MS),
      window.setTimeout(() => setPhase("leaving"), WORDS_OUT_MS + WORDS_OUT_DURATION_MS),
      window.setTimeout(() => {
        setPhase("done");
        // The hero's own reveal is chained to this moment, not to its mount —
        // see introGate.ts.
        releaseIntro();
      }, WORDS_OUT_MS + WORDS_OUT_DURATION_MS + FADE_MS),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, [reduceMotion]);

  // Unmounts rather than hiding: a `pointer-events-none` overlay left in the
  // DOM at z-9000 is one stacking mistake away from eating the first click.
  if (phase === "done" || reduceMotion) return null;

  const expanded = phase !== "letters";
  const wordsVisible = phase === "letters" || phase === "expanded";

  return (
    <div
      className={cn(
        "preloader fixed inset-0 z-[9000] flex h-[100dvh] w-screen items-center justify-center bg-[#262626] text-white transition-opacity ease-[cubic-bezier(0.14,0.83,0.4,1)]",
        phase === "leaving" ? "pointer-events-none opacity-0" : "opacity-100",
      )}
      style={{ transitionDuration: `${FADE_MS}ms` }}
      aria-hidden="true"
    >
      {/*
        `w-fit` is what makes the unfurl read as an expansion rather than a
        slide: the block is only as wide as its widest word, so as the tails
        open the whole wordmark re-centres itself, exactly as the source's
        counter-translated sections do.
      */}
      <div className="preloader__wordWrapper w-fit">
        {[0, 2].map((offset) => (
          <div
            key={offset}
            className={cn(
              "preloader__section flex flex-col transition-opacity ease-out",
              wordsVisible ? "opacity-100" : "opacity-0",
            )}
            style={{ transitionDuration: `${WORDS_OUT_DURATION_MS}ms` }}
          >
            {PRELOADER_WORDS.slice(offset, offset + 2).map(([capital, rest], i) => (
              <Word
                key={capital}
                capital={capital}
                rest={rest}
                index={offset + i}
                expanded={expanded}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

interface WordProps {
  capital: string;
  rest: string;
  /** Position among all four words — sets the capital's stagger delay. */
  index: number;
  expanded: boolean;
}

function Word({ capital, rest, index, expanded }: WordProps) {
  // The capital is mounted already hidden and transitions to its resting
  // state, so the delay alone sequences the four of them.
  const [arrived, setArrived] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setArrived(true), LETTERS_START_MS);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className="preloader__word font-XXL flex whitespace-nowrap">
      <span
        className={cn(
          "preloader__wordFl transition-[opacity,filter,transform] ease-out",
          arrived ? "translate-y-0 opacity-100 blur-none" : "translate-y-[10px] opacity-0 blur-[10px]",
        )}
        style={{
          transitionDuration: `${LETTER_MS}ms`,
          transitionDelay: `${index * LETTER_STAGGER_MS}ms`,
        }}
      >
        {capital}
      </span>
      {/*
        A `0fr → 1fr` grid column is an animatable width with no measurement:
        the tail keeps its natural size inside the track and the track itself
        interpolates, so the word grows from just its capital to its full
        length. The inner span needs `overflow: hidden` or it would spill out
        of the collapsed track instead of being clipped by it.
      */}
      <span
        className="preloader__wordRl grid ease-[cubic-bezier(0.14,0.83,0.4,1)] transition-[grid-template-columns]"
        style={{
          gridTemplateColumns: expanded ? "1fr" : "0fr",
          transitionDuration: `${EXPAND_MS}ms`,
        }}
      >
        <span className="overflow-hidden">{rest}</span>
      </span>
    </div>
  );
}
