"use client";

/**
 * GeneralCta — the small call-to-action band that closes /process/.
 *
 * Two grid rows: a narrow `font-L` line on row 1 and a single `ButtonArrow` on
 * row 2, spanning the full main column. Measured 1440×182 (`margin: 120px 0`).
 *
 * Grid math (GRID_AREAS.json at 1440 / 768 / 390 — `.ng-grid`'s `main-start`
 * is numeric line 2 and `main-end` is line -2 in every tier):
 *
 *              <768 (4 col)      >=768 (12 col)     >=1280 (20 col)
 *   text       2 / -3  row 1     2 / 6   row 1      2 / 6   row 1
 *   button     2 / -2  row 2     2 / -2  row 2      2 / -2  row 2
 *
 * Row heights confirm the text's own bottom margin steps with the tier:
 *   390/768 → row 1 = 107.391px = 92.391px of text + 15px
 *   1440    → row 1 = 155.391px = 125.391px of text + 30px
 *
 * Vertical rhythm: 120px at 1440. On the 390px capture the collapsed gap above
 * the block measures ~100px, the same 50/60 → 100/120 step BlockWysiwyg and
 * BlockIntroGeneral use.
 *
 * The only interaction is the link itself: `ButtonArrow` already owns the
 * arrow-chip widen + arrow relay hover, so nothing is re-implemented here.
 */

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ButtonArrow } from "@/components/site/shared/buttons";
import { REVEAL_OBSERVER_INIT } from "../reveal";

export interface GeneralCtaProps {
  /**
   * The `font-L` lead line. Verbatim from the source, including the trailing
   * word that repeats the link label — the CMS renders the CTA title into the
   * paragraph as well, so it wraps to three lines ("Explore our job /
   * opportunities / Careers").
   */
  text: string;
  /** Link label on the arrow button. */
  label: string;
  href: string;
  className?: string;
}

export function GeneralCta({ text, label, href, className }: GeneralCtaProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    // Nothing here is clipped, so the section is a safe observation target.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          // One-shot, matching every other reveal on the site.
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
        "generalCta ng-grid my-[100px] text-[16px] leading-[21.6px] text-[#111111] xl:my-[120px]",
        className,
      )}
    >
      <div
        className={cn(
          revealClass,
          "generalCta__text col-start-[main-start] col-end-[-3] row-start-1 mb-[15px] md:col-end-[6] xl:mb-[30px]",
        )}
        style={{ transitionDelay: "0ms" }}
      >
        <p className="font-L">{text}</p>
      </div>

      <div
        className={cn(
          revealClass,
          "generalCta__button col-start-[main-start] col-end-[main-end] row-start-2 h-[27px]",
        )}
        style={{ transitionDelay: "80ms" }}
      >
        {/* data-color="slate" on the source anchor → the grey chip variant. */}
        <ButtonArrow title={label} href={href} color="slate" />
      </div>
    </section>
  );
}
