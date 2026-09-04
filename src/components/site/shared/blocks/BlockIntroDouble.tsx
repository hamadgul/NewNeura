"use client";

/**
 * `BlockIntroDouble` — the two-column intro that opens /about/, /process/,
 * every /services/ page and each project detail page.
 *
 * Anatomy (identical in all three captured instances):
 *   section.blockIntroDouble        .ng-grid, margin 60px 0 (50px < 1280px)
 *   └ div.blockIntroDouble__header  main-start/main-end, font-S, 10px 0 pad,
 *   │   └ label row                 25px bottom margin, 1px #d6d6d6 rule
 *   └ div.blockIntroDouble__textWrapper   main-start/main-end, row 2, subgrid
 *       ├ h2.font-L statement       row 1
 *       └ p body copy               row 2, 60px top margin (50px < 1280px)
 *
 * Nothing here has a fixed height — measured section heights are 232px
 * (/about/, statement only), 509px (a service page) and 487px (the project
 * page); every one of those is just content flow, so the block must stay
 * auto-height and fully prop-driven.
 *
 * What the three instances proved is *structural* (identical in all of them):
 * the grid spans, the header rule, the 25px/60px rhythm, the font classes.
 * What varies is only content: the label row (one static caption vs. two
 * tabs), whether body copy exists at all, and how long each string is.
 *
 * Grid maths, from getComputedStyle at 1440px on the 20-column tier
 * (`.ng-grid` ≥1280px; subgrid line 1 == main-start):
 *   - statement `1 / -6`  → lines 1/16 → 15 cols → 15×57.5 + 14×10 = 1002.5px ✔
 *   - body      `7 / -3`  → lines 7/19 → 12 cols → 12×57.5 + 11×10 =  800px  ✔
 * Both are expressed below as positive line numbers per tier so no negative
 * subgrid line has to resolve against a different column count.
 *
 * Responsive (derived from GRID_AREAS.json at 1440/768/390 plus the mobile
 * screenshots — line counts back-solve exactly at every width):
 *   - <1280px both the statement and the body span the full main width and the
 *     body drops to a single column. At 768px the measured 444.7px textWrapper
 *     on a service page only resolves as 3 statement lines + 50px + 14 body
 *     lines at 688px wide; at 390px its 848.6px resolves as 7 + 50px + 27
 *     lines at 340px wide. Two columns at either width lands nowhere near.
 *   - ≥1280px the statement keeps its 1002.5px measure and the body moves to
 *     the indented 800px two-column measure (`columns: 2; column-gap: 20px`,
 *     confirmed visually in the block screenshots — the computed-style dump
 *     records the 20px column-gap but not the count).
 *
 * ── Why the second column is conditional ────────────────────────────────
 * The captured instances all carried long body copy: `columns: 2` cut them
 * near their midpoint and each column came out several lines deep, which is
 * what a two-column measure is for. Ten of our call sites do not — the work
 * pages ship a single 143-287 character paragraph, and /about/ ships 232.
 * At 800px wide that is barely three lines, so `columns: 2` balances it into
 * two three-line stacks and the break lands *mid-sentence*: the reader
 * finishes "...clinical data from dozens of" at the bottom of column one and
 * has to jump back up to find "sources into a single common model". The
 * source never rendered that because the source never fed this slot a short
 * paragraph. `BODY_COLUMN_THRESHOLD` restores one column below the length
 * where a second one starts paying for itself; every service page (910-1355
 * chars) and the two long project bodies (680/692) stay two-column and are
 * pixel-unchanged. The measured gap between the two populations is wide —
 * 287 vs 680 — so the exact threshold is not load-bearing.
 */
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { REVEAL_OBSERVER_INIT } from "../reveal";

export interface BlockIntroDoubleProps {
  /**
   * The header labels, in source order. One label is a static caption
   * ("About us", "Residential Housing" — muted, no underline). Two labels are
   * the tabbed variant that gives the block its name ("Introduction" /
   * "Details" on project pages): the active one is ink with a rule beneath it,
   * the rest stay muted.
   */
  labels?: readonly string[];
  /** Index of the active label. Only meaningful with 2+ labels. */
  activeLabel?: number;
  /**
   * One panel per label, making the tab strip actually do something.
   *
   * Without this the block renders a single `statement`/`body` and the labels
   * are decoration — which is what the project pages shipped: two tabs, a rule
   * under the first, and nothing behind the second. Pass `panels` and the block
   * owns the active index, renders the labels as buttons, and swaps content.
   */
  panels?: readonly { statement: string; body?: string | readonly string[] }[];
  /**
   * Makes the labels real tab `<button>`s (the source renders `<div>`s for the
   * single-caption variant and `<button>`s for the tabbed one). Omit for the
   * static instances.
   */
  onLabelSelect?: (index: number) => void;
  /** The large `.font-L` statement. Present on every instance. */
  statement: string;
  /**
   * Body copy. Pass an array for multi-paragraph copy — the paragraphs flow
   * through the same multi-column measure the source uses for its single `<p>`.
   * Omitted entirely on /about/, which is statement-only.
   */
  body?: string | readonly string[];
  /**
   * Force the ≥1280px body measure to one or two columns instead of letting
   * the length rule decide. Only worth passing when copy sits near the
   * threshold and the automatic choice reads wrong.
   */
  bodyColumns?: 1 | 2;
  /** Extra classes for the section (e.g. per-page margin overrides). */
  className?: string;
}

/**
 * Body length, in characters across every paragraph, at or above which the
 * ≥1280px measure splits into two columns. See the block note above.
 */
const BODY_COLUMN_THRESHOLD = 400;

export function BlockIntroDouble({
  labels,
  activeLabel = 0,
  onLabelSelect,
  panels,
  statement,
  body,
  bodyColumns,
  className,
}: BlockIntroDoubleProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [selected, setSelected] = useState(activeLabel);

  // With `panels`, the strip is self-driving: the block holds the index and
  // reads its copy from the panel. Without it nothing changes and the labels
  // stay the static captions the /about/ and service pages want.
  const activeIndex = panels ? selected : activeLabel;
  const activePanel = panels?.[activeIndex];
  const shownStatement = activePanel?.statement ?? statement;
  const shownBody = activePanel ? activePanel.body : body;

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    // Observe the section itself: it is the only unclipped ancestor here.
    // (The section carries `overflow: clip`, which crops the reveal's 50px
    // rise but never collapses its own box, so its intersection ratio is real.
    // Observing a `.ng-reveal` child would be fine too — none of them are
    // clip-path'd — but one observer for the staggered group is cheaper.)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          // One-shot, like every reveal on the source site.
          observer.disconnect();
        }
      },
      REVEAL_OBSERVER_INIT,
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const revealClass = cn("ng-reveal", isRevealed && "is-revealed");

  const paragraphs =
    shownBody === undefined ? [] : typeof shownBody === "string" ? [shownBody] : [...shownBody];
  // Two or more labels = the tabbed variant; that is the only instance where
  // the source shows the active-tab rule (it renders it at `opacity: 0` on the
  // single-caption pages, which is visually identical to not rendering it).
  const isTabbed = (labels?.length ?? 0) > 1;
  // Measured on the joined copy, not per paragraph: three short paragraphs
  // still fill two columns, one short paragraph does not.
  const isTwoColumnBody =
    bodyColumns !== undefined
      ? bodyColumns === 2
      : paragraphs.join(" ").length >= BODY_COLUMN_THRESHOLD;

  return (
    <section
      ref={sectionRef}
      className={cn(
        "blockIntroDouble ng-grid my-[50px] overflow-clip text-[#111111] xl:my-[60px]",
        className,
      )}
    >
      <div
        className={cn(
          revealClass,
          "blockIntroDouble__header font-S col-start-[main-start] col-end-[main-end] row-start-1 mb-[25px] border-b border-[#d6d6d6] py-[10px]",
        )}
        style={{ transitionDelay: "0ms" }}
      >
        {/* w-fit: the wrapper hugs its labels (57px / 123px / 168px measured),
            it never fills the header row. */}
        <div className="blockIntroDouble__headerButtonWrapper relative flex w-fit items-center gap-[50px]">
          {labels?.map((label, index) => {
            const isActive = isTabbed && index === activeIndex;
            const content = (
              <>
                {label}
                {isActive ? (
                  // The rule is nested inside the active label rather than
                  // being an absolutely-positioned sibling as in the source:
                  // that way its width and left edge track the label's own
                  // glyphs for free (measured 76px under "Introduction", left
                  // aligned with it) with no measuring pass. `top: 100% + 10px`
                  // reproduces the measured 28.9px offset — 18.9px of line box
                  // plus the header's 10px bottom padding — which lands it
                  // exactly on the header's hairline.
                  <span
                    aria-hidden
                    className="blockIntroDouble__headerLine absolute left-0 top-[calc(100%+10px)] h-px w-full bg-[var(--ng-ink)]"
                  />
                ) : null}
              </>
            );

            const itemClass = cn(
              "blockIntroDouble__headerButton relative block transition-colors duration-300",
              // Measured: rgb(0,0,0) on the active tab, rgb(116,116,116)
              // everywhere else — including the single-caption instances.
              isActive
                ? "text-[var(--ng-ink)]"
                : "text-[var(--ng-muted)]",
            );

            const select = panels
              ? () => {
                  setSelected(index);
                  onLabelSelect?.(index);
                }
              : onLabelSelect
                ? () => onLabelSelect(index)
                : undefined;

            return select ? (
              <button
                key={label}
                type="button"
                aria-pressed={isActive}
                className={cn(itemClass, "cursor-pointer text-center")}
                onClick={select}
              >
                {content}
              </button>
            ) : (
              <div key={label} className={itemClass}>
                {content}
              </div>
            );
          })}
        </div>
      </div>

      <div className="blockIntroDouble__textWrapper col-start-[main-start] col-end-[main-end] row-start-2 grid grid-cols-subgrid">
        <h2
          className={cn(
            revealClass,
            "blockIntroDouble__textIntro font-L col-start-1 col-end-[-1] row-start-1 md:col-end-13 xl:col-end-16",
          )}
          style={{ transitionDelay: "80ms" }}
        >
          {shownStatement}
        </h2>

        {paragraphs.length > 0 ? (
          <div
            className={cn(
              revealClass,
              "blockIntroDouble__textMain col-start-1 col-end-[-1] row-start-2 mt-[50px] md:col-end-13 xl:col-start-7 xl:col-end-19 xl:mt-[60px]",
              isTwoColumnBody && "xl:columns-2 xl:gap-x-[20px]",
              // The source ships one <p>; multi-paragraph copy keeps the same
              // measure and separates on the body's own 21.6px line.
              "[&>p+p]:mt-[21.6px]",
            )}
            style={{ transitionDelay: "160ms" }}
          >
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
