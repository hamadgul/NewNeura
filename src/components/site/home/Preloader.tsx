"use client";

/**
 * The intro overlay: a dark ground on which the five capitals of NEURA unfold
 * into what the name stands for — Next-Generation Engineering, Unified
 * Research & AI — and then resolve into the NeuraGul wordmark.
 *
 * Measured off the reference intro (mobile, 390px) by sampling the GSAP-written inline
 * styles every 120ms across a page load. The three beats, with times relative
 * to the start of the theme's timeline:
 *
 *   0.00 – 1.15s  the capitals fade up one at a time — `opacity 0 → 1`,
 *                 `filter: blur(10px) → none`, `translateY(10px) → 0`,
 *                 ~500ms each, ~287ms apart.
 *   1.23 – 2.28s  each word's remainder unfurls to the right while the block
 *                 re-centres, so "N E U R A" becomes the five words. The source
 *                 does this by translating the tail spans and counter-moving
 *                 the sections; we get the same motion — and the same
 *                 re-centring — from a `0fr → 1fr` grid column, with no
 *                 measured widths to keep in sync.
 *   2.53 – 4.33s  the five words hold, open and still, long enough to read
 *                 (`WORDS_HOLD_MS`).
 *   4.33 – 4.68s  the words fade out.
 *   4.43 – 4.83s  the wordmark arrives in their place, overlapping their exit
 *                 so the block reads as resolving rather than as being
 *                 replaced. It holds, then the overlay fades out behind it.
 *
 * That last beat is the answer to "add Gul to the loading animation". The first
 * attempt appended G, U and L to `PRELOADER_WORDS` as letters standing for
 * nothing, which left three bare capitals dangling under "AI" — *"this looks
 * kind of ugly, find a better way to incorporate the Gul part of it"*. The
 * surname is not an acronym entry, so it does not go in the acronym; the intro
 * spells out what NEURA means and then lands on the whole name, which is also
 * how the nav and the footer set it (`Wordmark`, "Neura" semibold + "Gul"
 * light). It costs 500ms, and most of that was previously an empty dark screen
 * between the words leaving and the overlay following them.
 *
 * The words carry NO gaps: the wrapper is an exact multiple of the 48.4px
 * `font-XXL` line box (193px at four words, 242px at NEURA's five). There is
 * deliberately no media behind them — the overlay is type on a flat ground.
 *
 * Mounted from the root layout, not from each page. Navigation here is
 * client-side, and mounting this per route replayed the whole 3.4s intro on
 * top of an already-instant transition. Living in the layout means it plays
 * once per document load — on first arrival and on reloads.
 */
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { releaseIntro } from "../shared/introGate";
import { Wordmark } from "../shared/icons";
import { PRELOADER_WORDS } from "./content";

/** ms before the first capital starts to arrive. */
const LETTERS_START_MS = 250;
/**
 * ms between each capital's entrance.
 *
 * The measured value is 287ms, but it was measured on four letters, where it
 * started the last capital 369ms before the unfurl. Held at 287 across NEURA's
 * five, the "A" would begin 82ms *after* the unfurl had started and the
 * acronym would never be legible whole — which is the one thing this intro now
 * exists to show. So what is preserved is the span, not the interval: 861ms
 * (the measured 3 × 287) divided across however many letters there are, which
 * puts the last capital at the same point in the timeline as before.
 */
const LETTERS_SPREAD_MS = 861;
const LETTER_STAGGER_MS =
  LETTERS_SPREAD_MS / Math.max(PRELOADER_WORDS.length - 1, 1);
/** ms for one capital's fade/blur/lift. */
const LETTER_MS = 500;
/** ms at which the words unfurl (measured 1.23s after the first capital). */
const EXPAND_START_MS = LETTERS_START_MS + 1230;
/** ms for the unfurl. */
const EXPAND_MS = 1050;
/**
 * How long the five expanded words HOLD, fully open and still, before they
 * start to fade.
 *
 * This was 200ms — the words finished unfurling and left again almost in the
 * same breath, which is long enough to notice the motion and nowhere near long
 * enough to read five phrases. Requested 2026-09-10: "let it stay there for a
 * few so that the user can actually have time to read it the full abbreviation
 * meaning".
 *
 * 1800ms is a reading budget, not a round number: the five lines are 46
 * characters of text, and ~25 characters/second is the slow end of adult silent
 * reading, so ~1.8s covers a first-time reader who is not expecting words to
 * appear at all. It puts the whole intro at ~5.5s, which is long for a
 * preloader — that is the trade this asks for, and it is paid once per document
 * load, not per navigation (see the note on mounting, above).
 */
const WORDS_HOLD_MS = 1800;
/** ms at which the words start to fade. */
const WORDS_OUT_MS = EXPAND_START_MS + EXPAND_MS + WORDS_HOLD_MS;
/** ms for the words' fade. */
const WORDS_OUT_DURATION_MS = 350;
/**
 * The wordmark's arrival, overlapping the words' exit by 250ms of its 350ms —
 * the two are a cross-fade, not a sequence. Starting it after the words had
 * fully gone put a blank ground between them and made the mark read as a
 * second, unrelated screen.
 */
const MARK_IN_DELAY_MS = 100;
const MARK_MS = 400;
/** ms the wordmark holds at rest before the overlay goes. */
const MARK_HOLD_MS = 350;
/** ms for the overlay's own fade, which follows the wordmark. */
const FADE_MS = 300;
/** When the overlay starts to leave: the mark in, then its hold. */
const LEAVE_MS = MARK_IN_DELAY_MS + MARK_MS + MARK_HOLD_MS;

/**
 * The words are laid out two to a section, mirroring the source's two
 * counter-translated groups. Derived rather than written out, so NEURA's five
 * words split 2/2/1 without the last one being dropped — the old `[0, 2]`
 * rendered exactly four and would have silently swallowed the "AI".
 */
const SECTION_OFFSETS = Array.from(
  { length: Math.ceil(PRELOADER_WORDS.length / 2) },
  (_, i) => i * 2,
);

/**
 * `wordsOut` is the cross-fade: the words are leaving AND the mark is arriving.
 * The mark stays up through `leaving`, fading out with the overlay rather than
 * before it.
 */
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
      window.setTimeout(() => setPhase("leaving"), WORDS_OUT_MS + LEAVE_MS),
      window.setTimeout(
        () => {
          setPhase("done");
          // The hero's own reveal is chained to this moment, not to its mount —
          // see introGate.ts.
          releaseIntro();
        },
        WORDS_OUT_MS + LEAVE_MS + FADE_MS,
      ),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, [reduceMotion]);

  // Unmounts rather than hiding: a `pointer-events-none` overlay left in the
  // DOM at z-9000 is one stacking mistake away from eating the first click.
  if (phase === "done" || reduceMotion) return null;

  const expanded = phase !== "letters";
  const wordsVisible = phase === "letters" || phase === "expanded";
  const markVisible = phase === "wordsOut" || phase === "leaving";

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
        {SECTION_OFFSETS.map((offset) => (
          <div
            key={offset}
            className={cn(
              "preloader__section flex flex-col transition-opacity ease-out",
              wordsVisible ? "opacity-100" : "opacity-0",
            )}
            style={{ transitionDuration: `${WORDS_OUT_DURATION_MS}ms` }}
          >
            {PRELOADER_WORDS.slice(offset, offset + 2).map(
              ([capital, rest], i) => (
                <Word
                  // By index, not by capital: NEURAGUL has two "U"s, and a
                  // duplicate key drops one of them.
                  key={offset + i}
                  capital={capital}
                  rest={rest}
                  index={offset + i}
                  expanded={expanded}
                />
              ),
            )}
          </div>
        ))}
      </div>

      {/*
        The payoff, and where "Gul" lives.

        Absolutely positioned rather than added to the stack above: the words'
        wrapper is `w-fit`, and that width is what makes the unfurl re-centre
        itself. A sixth in-flow child would join that measurement and drag the
        centring around for the whole 1050ms expansion — for an element that is
        not even visible yet. Out of flow, the mark simply lands in the middle
        of an overlay that is already `items-center justify-center`, over the
        block it is replacing.

        `pointer-events-none` because the overlay is still on screen and this
        sits above everything in it; it is decoration, not a target.
      */}
      <Wordmark
        className={cn(
          "preloader__mark font-XXL pointer-events-none absolute transition-[opacity,transform,filter] ease-[cubic-bezier(0.14,0.83,0.4,1)]",
          markVisible
            ? "translate-y-0 opacity-100 blur-none"
            : "translate-y-[10px] opacity-0 blur-[8px]",
        )}
        style={{
          transitionDuration: `${MARK_MS}ms`,
          transitionDelay: markVisible ? `${MARK_IN_DELAY_MS}ms` : "0ms",
        }}
      />
    </div>
  );
}

interface WordProps {
  capital: string;
  rest: string;
  /** Position among the words — sets the capital's stagger delay. */
  index: number;
  expanded: boolean;
}

function Word({ capital, rest, index, expanded }: WordProps) {
  // The capital is mounted already hidden and transitions to its resting
  // state, so the delay alone sequences them.
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
          arrived
            ? "translate-y-0 opacity-100 blur-none"
            : "translate-y-[10px] opacity-0 blur-[10px]",
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

        Omitted entirely for a letter that stands for nothing — G, U and L of
        the surname. An empty tail would still mount a track and run a 1050ms
        transition on it, and `w-fit` on the wrapper measures every child, so a
        zero-width animating column is a thing that can go wrong for no gain.
      */}
      {rest ? (
        <span
          className="preloader__wordRl grid ease-[cubic-bezier(0.14,0.83,0.4,1)] transition-[grid-template-columns]"
          style={{
            gridTemplateColumns: expanded ? "1fr" : "0fr",
            transitionDuration: `${EXPAND_MS}ms`,
          }}
        >
          <span className="overflow-hidden">{rest}</span>
        </span>
      ) : null}
    </div>
  );
}
