"use client";

/**
 * "Latest updates" — the homepage news list.
 *
 * Its signature interaction is a 330x210 image panel that follows the
 * cursor vertically down the list while a row is hovered, showing that
 * row's photo. The panel's horizontal position is fixed (it sits in the
 * column between the excerpt and date fields) — only its Y tracks the
 * pointer. This is desktop-mouse-only behaviour: it's fully gated behind
 * `(hover: hover) and (pointer: fine)` and never mounts on touch devices.
 */
import Image from "next/image";
import type { PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { ButtonArrow } from "@/components/sites/lpas-com-76f4f1fd/shared/buttons";
import { cn } from "@/lib/utils";
import type { LatestUpdate } from "@/types/lpas";
import { LATEST_UPDATES } from "./content";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { REVEAL_OBSERVER_INIT } from "../shared/reveal";

/**
 * How aggressively the panel's Y position chases the cursor each frame.
 * Measured live behaviour is a short glide rather than a snap — 0.12 is
 * the factor that reproduces that "gliding to catch up" feel without
 * lagging so far behind that it looks disconnected from the pointer.
 */
const LERP_FACTOR = 0.12;

export function GlobalLatestOverview() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [revealed, setRevealed] = useState(false);
  const reduceMotion = usePrefersReducedMotion();
  const isRevealed = revealed || reduceMotion;
  const [supportsHover, setSupportsHover] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Raw target Y (where the cursor currently is, relative to the section)
  // and the eased Y actually painted onto the panel. Both live in refs and
  // are written to the DOM directly in the rAF loop below, so a fast mouse
  // move never triggers a React re-render.
  const targetYRef = useRef(0);
  const currentYRef = useRef(0);

  // Scroll reveal: fade the whole section up once, the first time it enters
  // the viewport. Honour reduced-motion by skipping straight to the end state.
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    // Under reduced motion the section renders revealed from the start.
    if (reduceMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      REVEAL_OBSERVER_INIT,
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reduceMotion]);

  // The cursor-following panel is a mouse-and-precision-pointer affordance.
  // On touch it must never appear, so the whole feature is gated on this
  // media query rather than on `matches` being read once — a mouse can be
  // plugged into a touch-capable device mid-session, so we keep listening.
  useEffect(() => {
    const mql = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setSupportsHover(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  // The lerp loop only needs to run while a row is actually active; it
  // tears itself down as soon as the pointer leaves the list.
  useEffect(() => {
    if (!supportsHover || activeIndex === null) return;

    let frame: number;
    const tick = () => {
      currentYRef.current += (targetYRef.current - currentYRef.current) * LERP_FACTOR;
      const node = containerRef.current;
      if (node) {
        node.style.transform = `translate(0%, -50%) translate(0px, ${currentYRef.current}px)`;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [supportsHover, activeIndex]);

  function handleRowEnter(index: number, event: ReactPointerEvent<HTMLAnchorElement>) {
    if (!supportsHover || !sectionRef.current) return;
    const y = event.clientY - sectionRef.current.getBoundingClientRect().top;
    targetYRef.current = y;
    // Snap (don't lerp) the very first time the panel appears, so it doesn't
    // visibly fly in from wherever the pointer last left it — the glide is
    // only meant to be felt while moving *between* rows.
    if (activeIndex === null) {
      currentYRef.current = y;
    }
    setActiveIndex(index);
  }

  function handleRowMove(event: ReactPointerEvent<HTMLAnchorElement>) {
    if (!supportsHover || !sectionRef.current) return;
    targetYRef.current = event.clientY - sectionRef.current.getBoundingClientRect().top;
  }

  function handleListLeave() {
    // `pointerleave` on the `<ul>` itself (not on each row) only fires once
    // the cursor truly leaves the whole list, not on every hand-off between
    // adjacent rows — that hand-off is what lets the panel glide smoothly
    // from one row's Y to the next instead of hiding and re-appearing.
    if (!supportsHover) return;
    setActiveIndex(null);
  }

  return (
    <section
      ref={sectionRef}
      className={cn(
        "globalLatestOverview lpas-grid lpas-reveal relative my-[120px] text-[#111111]",
        isRevealed && "is-revealed",
      )}
    >
      <h2 className="font-M col-start-2 col-end-[-2] text-[#111111] mb-[16px]">Latest updates</h2>

      <ul
        onPointerLeave={handleListLeave}
        className="globalLatestOverview__list col-start-2 col-end-[-2] grid grid-cols-subgrid"
      >
        {LATEST_UPDATES.map((item: LatestUpdate, index: number) => (
          <li
            key={item.href}
            className="listItem col-span-full border-b border-[#d6d6d6] py-[15px] md:grid md:grid-cols-subgrid"
          >
            <a
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className={cn(
                // Mobile: a small local 2-col grid (text / arrow) with the
                // title spanning both, so it sits on its own line above the
                // date+button row. Tablet/desktop: a subgrid chained down
                // from the `<ul>` so title/excerpt/date align to the exact
                // column lines the spec measured.
                // gap-y stays 0: the three mobile rows carry their own
                // measured offsets (title, +4px excerpt, +8px date), and a
                // row gap on top of them overshot the source's 103px row.
                "listItem__link group grid grid-cols-[1fr_auto] items-center gap-x-[12px] gap-y-0",
                "md:col-span-full md:grid-cols-subgrid md:h-[27px]",
              )}
              onPointerEnter={(event) => handleRowEnter(index, event)}
              onPointerMove={handleRowMove}
            >
              <h3
                className={cn(
                  "listItem__title col-span-full row-start-1 text-[16px] leading-[21.6px] text-[#111111]",
                  "md:row-start-auto md:truncate md:[grid-column:1/-5]",
                  "xl:[grid-column:1/10]",
                )}
              >
                {item.title}
              </h3>

              {/* Visible on mobile (measured: a 19px line under the title, 4px
                  clear of it, which is 20px of the source's 103px row height).
                  Dropped at tablet, where the row is title + date only, and
                  back in its own column from xl. */}
              <p
                className={cn(
                  "listItem__excerpt font-S col-span-full row-start-2 mt-[4px] truncate text-[#747474] transition-colors duration-300",
                  "md:hidden",
                  "xl:row-start-auto xl:mt-0 xl:block xl:[grid-column:11/18] xl:group-hover:text-[#111111]",
                )}
              >
                {item.excerpt}
              </p>

              <span
                className={cn(
                  "listItem__date col-start-1 row-start-3 mt-[8px] font-XS font-semibold text-[#111111]",
                  "md:col-start-auto md:row-start-2 md:mt-0 md:text-right md:[grid-column:-4/-3]",
                  "xl:row-start-auto",
                )}
              >
                {item.date}
              </span>

              <div
                className={cn(
                  "listItem__button col-start-2 row-start-3 justify-self-end",
                  "md:col-start-auto md:row-start-2 md:[grid-column:-2/-1]",
                  "xl:row-start-auto",
                )}
              >
                {/* asStatic: the row itself is already the anchor, so this
                    must render a <span>, never a nested <a>. */}
                <ButtonArrow asStatic />
              </div>
            </a>
          </li>
        ))}
      </ul>

      {/* Not rendered at all on touch — the safest way to guarantee the
          panel "never appears" there, rather than relying on CSS alone. */}
      {supportsHover ? (
        <div
          ref={containerRef}
          aria-hidden="true"
          className={cn(
            "globalLatestOverview__imageContainer pointer-events-none absolute top-0 hidden h-[210px] w-[330px] overflow-hidden opacity-0",
            // Fixed horizontal anchor (measured left: 576px of a 1440px
            // viewport ≈ 40%) — deliberately NOT tied to the cursor's X.
            "left-[40%] transition-opacity duration-300 ease-out xl:block",
            activeIndex !== null ? "on visible opacity-100" : "invisible",
          )}
        >
          {LATEST_UPDATES.map((item: LatestUpdate, index: number) => (
            <Image
              key={item.href}
              src={item.image.src}
              alt={item.image.alt}
              width={item.image.width}
              height={item.image.height}
              // All six are mounted (and thus preloaded) up front and only
              // ever have their opacity toggled, so swapping the visible
              // row never triggers a network request on hover.
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-opacity duration-200 ease-out",
                activeIndex === index ? "opacity-100" : "opacity-0",
              )}
            />
          ))}
        </div>
      ) : null}

      <div className="col-start-2 col-end-[-2] mt-[30px] flex justify-end">
        <ButtonArrow title="All news" href="/latest/" className="buttonArrow--last" />
      </div>
    </section>
  );
}
