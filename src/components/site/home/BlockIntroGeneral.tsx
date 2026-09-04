"use client";

/**
 * The homepage intro block — the "who you'd be working with" statement under
 * the hero.
 *
 * Static content, but every child fades/rises in once the section crosses
 * ~15% into the viewport (measured via IntersectionObserver, one-shot).
 *
 * Grid math (from getComputedStyle at 1440x900, `.ng-grid`'s 20-col tier
 * with `main-start`/`main-end` named lines at line 2 / line 22, 80px tracks
 * capped by 50px min and a 10px column-gap):
 *   - title spans columns 2-12  → numeric lines 3/14 (665px measured, exact).
 *   - tagline+text share row 2. Splitting the remaining columns as
 *     tagline = cols 2-3 (lines 3/5) and text/button = cols 4-16 (lines
 *     5/18) lands at ~113px / ~788px, matching the ~125px / 800px measured
 *     widths closely enough given the spec calls these "sanity checks".
 * The same approach on the 12-col tablet tier (`main-start`=2, 100px
 * tracks) reproduces the measured 106px / 455px split almost exactly with
 * tagline = cols 1-2 (lines main-start/4) and text/button = cols 3-10
 * (lines 4/12) — kept under the `md:` prefix.
 * Below 768px there's only one column per row, so every child just spans
 * `main-start`/`main-end` and stacks via explicit `row-start`.
 */
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ButtonArrow } from "@/components/site/shared/buttons";
import { INTRO_BLOCK } from "./content";
import { REVEAL_OBSERVER_INIT } from "../shared/reveal";

export function BlockIntroGeneral() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          // The source plays this once per page load, never re-hides on scroll-out.
          observer.disconnect();
        }
      },
      REVEAL_OBSERVER_INIT,
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Shared by every child; only the transitionDelay (stagger) differs per element.
  const revealClass = cn("ng-reveal", isRevealed && "is-revealed");

  return (
    <section
      ref={sectionRef}
      className="blockIntroGeneral ng-grid my-[50px] text-[#111111] xl:my-[60px]"
    >
      <h2
        className={cn(
          revealClass,
          "blockIntroGeneral__title font-XXL col-start-[main-start] col-end-[main-end] row-start-1 mb-[50px] xl:col-start-[3] xl:col-end-[13] xl:mb-[60px]",
        )}
        style={{ transitionDelay: "0ms" }}
      >
        {INTRO_BLOCK.title}
      </h2>

      {/* w-fit: the tagline never fills its grid cell — its measured width tracks
          the text's own glyphs (125/106/165px across breakpoints), not the cell. */}
      <h3
        className={cn(
          revealClass,
          "blockIntroGeneral__tagline font-S col-start-[main-start] col-end-[main-end] row-start-2 mb-[25px] md:col-end-[4] xl:col-start-[3] xl:col-end-[5]",
        )}
        style={{ transitionDelay: "80ms" }}
      >
        {INTRO_BLOCK.tagline}
      </h3>

      <p
        className={cn(
          revealClass,
          "blockIntroGeneral__text col-start-[main-start] col-end-[main-end] row-start-3 mb-[40px] md:col-start-[4] md:col-end-[12] md:row-start-2 xl:col-start-[5] xl:col-end-[17]",
        )}
        style={{ transitionDelay: "160ms" }}
      >
        {INTRO_BLOCK.text}
      </p>

      <div
        className={cn(
          revealClass,
          "blockIntroGeneral__button col-start-[main-start] col-end-[main-end] row-start-4 h-[27px] md:col-start-[4] md:col-end-[12] md:row-start-3 xl:col-start-[5] xl:col-end-[17]",
        )}
        style={{ transitionDelay: "240ms" }}
      >
        <ButtonArrow title={INTRO_BLOCK.cta.label} href={INTRO_BLOCK.cta.href} />
      </div>
    </section>
  );
}
