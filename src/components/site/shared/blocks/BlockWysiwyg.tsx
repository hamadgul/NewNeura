"use client";

/**
 * BlockWysiwyg — the site's rich-text block (17 instances: /about/, the project
 * detail pages, and every /services/… sub-page).
 *
 * Two shapes ship from the same CMS block and the same markup:
 *   1. Bare body only (project detail, /about/) — no tagline, no title. The
 *      block still emits an empty first grid row, measured at `0px`.
 *   2. Tagline + title + body (the service sub-pages) — an eyebrow with a
 *      hairline under it on row 1, then a narrow title column beside a wide
 *      body column on row 2.
 *
 * Grid math (all measured, `getComputedStyle()` + GRID_AREAS.json at
 * 1440 / 768 / 390 — `.ng-grid`'s named lines put `main-start` at numeric
 * line 2 and `main-end` at line -2 in every tier, so the source's own
 * `grid-column` values port across verbatim):
 *
 *              <768 (4 col)      >=768 (12 col)     >=1280 (20 col)
 *   tagline    2 / -2  row 1     2 / -2  row 1      2 / -2  row 1
 *   title      2 / -2  row 2     2 / 6   row 2      2 / 6   row 2      (240px)
 *   content    2 / -2  row 3     6 / -2  row 2      8 / -4  row 2      (800px)
 *
 * Below 768px there is one column per row, so title and content simply take
 * `main-start`/`main-end` and fall into rows 2 and 3 by auto-placement — which
 * is exactly what the source's computed `grid-area: auto / 2 / auto / -2`
 * reports.
 *
 * Vertical rhythm: `margin: 60px 0` at 1440. Measured on the two adjacent
 * instances on a service sub-page at 390px, the collapsed
 * gap between them is exactly 50px, so the block steps 50 → 60 the same way
 * `BlockIntroGeneral` does.
 */

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { REVEAL_OBSERVER_INIT } from "../reveal";

/** A `<h3>` inside the rich text — measured at `font-M` metrics + 20px below. */
export interface WysiwygHeadingNode {
  type: "heading";
  text: string;
}

/**
 * A `<p>` inside the rich text. The service pages use a `<strong>` lead-in, a
 * `<br>`, then the descriptive line — hence `lead` and `text` are separate
 * rather than one HTML string. Nothing here is ever `dangerouslySetInnerHTML`.
 */
export interface WysiwygParagraphNode {
  type: "paragraph";
  /** Bold lead-in, e.g. `"Permanent Supportive Housing:"`. Followed by a `<br>`. */
  lead?: string;
  text?: string;
}

/**
 * A pull-quote testimonial. Measured on a service page's "Client
 * Voices" block: an `<h4>` at 24px/32.4px (i.e. `font-SM`, weight 400) wrapping
 * an `<em>`, with the attribution following as an ordinary 16px paragraph.
 *
 * This exists because rendering these as `heading` was visibly wrong — that
 * path emits `<h3 class="font-M">` at 28px/36.4px and upright, so the quotes
 * came out one type-step too large and lost their italic.
 */
export interface WysiwygQuoteNode {
  type: "quote";
  /** Quote text including the source's own curly quote marks. */
  text: string;
}

export type WysiwygNode = WysiwygHeadingNode | WysiwygParagraphNode | WysiwygQuoteNode;

export interface BlockWysiwygProps {
  /** Eyebrow on row 1, under a hairline rule. Omitted on /about/ and project pages. */
  tagline?: string;
  /** Narrow left-hand heading. Rendered as `<h2 class="font-M">`. */
  title?: string;
  /** The rich-text body: headings and paragraphs, in source order. */
  body: readonly WysiwygNode[];
  className?: string;
}

export function BlockWysiwyg({ tagline, title, body, className }: BlockWysiwygProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    // Observing the <section> itself is safe here: nothing in this block carries
    // a clip-path, so its intersection ratio is never pinned at 0 (trap #1).
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          // One-shot, like every other reveal on the site — never re-hides.
          observer.disconnect();
        }
      },
      REVEAL_OBSERVER_INIT,
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const revealClass = cn("ng-reveal", isRevealed && "is-revealed");

  return (
    <section
      ref={sectionRef}
      className={cn(
        // 16px/21.6px is the block's own computed body type; Tailwind's preflight
        // would otherwise leave line-height at 1.5 (24px).
        "blockWysiwyg ng-grid my-[50px] text-[16px] leading-[21.6px] text-[#111111] xl:my-[60px]",
        className,
      )}
    >
      {tagline ? (
        <div
          className={cn(
            revealClass,
            "blockWysiwyg__tagline font-XS col-start-[main-start] col-end-[main-end] row-start-1 mb-[35px] border-b border-[#d6d6d6] pb-[10px] text-[#747474]",
          )}
          // `.font-XS` is unlayered CSS, so it lands after Tailwind's utility
          // layer and its `font-weight: 400` would beat `font-semibold`. The
          // measured weight is 600, so it has to be set inline to win.
          style={{ fontWeight: 600, transitionDelay: "0ms" }}
        >
          {tagline}
        </div>
      ) : null}

      {title ? (
        <div
          className={cn(
            revealClass,
            // pr-20px from >=768: the cell is 260px at 1440 / 222.7px at 768 but
            // the title's measured content box is 240px / 203px — a flat 20px
            // narrower in both tiers.
            "blockWysiwyg__title col-start-[main-start] col-end-[main-end] mb-[50px] flex flex-col gap-[10px] md:col-end-[6] md:row-start-2 md:pr-[20px]",
          )}
          style={{ transitionDelay: "80ms" }}
        >
          <h2 className="font-M">{title}</h2>
        </div>
      ) : null}

      <div
        className={cn(
          revealClass,
          "blockWysiwyg__content col-start-[main-start] col-end-[main-end] md:col-start-[6] md:row-start-2 xl:col-start-[8] xl:col-end-[-4]",
        )}
        style={{ transitionDelay: "160ms" }}
      >
        <div className="wysiwyg">
          {body.map((node, i) =>
            node.type === "heading" ? (
              <h3 key={i} className="font-M mb-[20px]">
                {node.text}
              </h3>
            ) : node.type === "quote" ? (
              // `font-SM` (24px/32.4px) + italic, matching the source's
              // `<h4><em>`. The `<em>` is kept as a real element rather than an
              // `italic` utility so the emphasis survives in the accessibility
              // tree and in copied text.
              <h4 key={i} className="font-SM mb-[20px]">
                <em>{node.text}</em>
              </h4>
            ) : (
              // The source's rule is `p + p { margin-top: 15px }`; the first
              // paragraph after a heading keeps the heading's 20px instead.
              <p key={i} className={cn(i > 0 && body[i - 1].type === "paragraph" && "mt-[15px]")}>
                {node.lead ? (
                  <>
                    {/* Measured weight is 600, not the browser's default `bolder`. */}
                    <strong className="font-semibold">{node.lead}</strong>
                    {/*
                      The break belongs to the lead+text pattern only. Some pages
                      (student-housing) instead ship a bold-only <p> followed by a
                      separate body <p> and carry no <br> at all; emitting one there
                      added an empty line box worth 21.6px per item.
                    */}
                    {node.text ? <br /> : null}
                  </>
                ) : null}
                {node.text}
              </p>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
