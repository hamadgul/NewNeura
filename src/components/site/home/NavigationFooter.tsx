"use client";

/**
 * The footer's defining trick is a sticky reveal: `__topSection` (900px tall,
 * `z-index: 2`) sits ABOVE `__bottomSection` (625px tall, `position: sticky`,
 * `z-index: 1`). As the page scrolls into the footer, the sticky section pins
 * to the bottom of the viewport while the top section keeps scrolling and
 * clears it — the bottom section appears to be "uncovered" rather than
 * slid into view. No JS is needed for the pin itself; the z-order plus
 * `position: sticky` does the whole thing. JS is only needed for the
 * parallax image (which drives off scroll progress) and the back-to-top
 * button (which has to hand off to Lenis when it's present).
 */
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import { ButtonLine } from "@/components/site/shared/buttons";
import { ArrowIcon, PlusIcon, Wordmark } from "@/components/site/shared/icons";
import { cn } from "@/lib/utils";
import type { OfficeContact } from "@/types/site";
import {
  COMPANY_GROUP,
  EXPLORE_GROUP,
  FOOTER_BACK_TO_TOP,
  FOOTER_COPYRIGHT,
  FOOTER_IMAGE,
  OFFICES,
  SERVICE_LINKS,
} from "./content";

// Minimal shape for the Lenis instance the theme installs on `window`. Back
// to top MUST route through it when present — calling `window.scrollTo`
// while Lenis owns the scroll loop causes the native scroll and Lenis's
// rAF-driven scroll to fight over the scroll position mid-animation.
// `window.__ngLenis` is declared once, ambiently, in shared/SmoothScroll.tsx.

/**
 * The parallax image is the section itself, scaled about its centre. Measured
 * `matrix(1.4, ...)` on the live footer at every viewport width tested.
 */
const IMAGE_SCALE = 1.4;

export interface NavigationFooterProps {
  /**
   * `full` (default) is the 1525px footer: the parallax image panel, the big
   * menu, offices, socials and the copyright bar.
   *
   * `compact` is what `/contact/` uses, measured at 94px:
   * `__topSection` and bands 1-2 are `display: none`, leaving only the
   * copyright band (74px) under a 20px pad, on the dark ground. The contact
   * page already carries the offices and socials in its own block, so the
   * source drops the duplicate rather than repeating them.
   */
  variant?: "full" | "compact";
}

export function NavigationFooter({ variant = "full" }: NavigationFooterProps = {}) {
  const footerRef = useRef<HTMLElement>(null);
  const topSectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let rafId: number | null = null;

    const update = () => {
      rafId = null;
      const footer = footerRef.current;
      const topSection = topSectionRef.current;
      const image = imageRef.current;
      if (!footer || !topSection || !image) return;

      // The image is the section scaled by IMAGE_SCALE about its centre, so
      // the surplus height (0.4H) hangs half above and half below — only half
      // of it is available as travel. Measured on the live site at 1440x900:
      // ty moves 0.0742px per scrolled px over a 900 + 1525 = 2425px window,
      // i.e. 180px total, which is exactly 0.2 x the 900px section.
      const amplitude = topSection.offsetHeight * ((IMAGE_SCALE - 1) / 2);

      const rect = footer.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      // 0 when the footer's top has just entered the bottom of the
      // viewport, 1 once it has scrolled a full footer-height further up.
      const raw = (viewportHeight - rect.top) / (viewportHeight + rect.height);
      const progress = Math.min(1, Math.max(0, raw));

      image.style.transform = `translate3d(0, ${(-amplitude * progress).toFixed(2)}px, 0) scale(${IMAGE_SCALE})`;
    };

    const onScroll = () => {
      if (rafId === null) rafId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  const handleBackToTop = useCallback(() => {
    if (typeof window !== "undefined" && window.__ngLenis) {
      window.__ngLenis.scrollTo(0);
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Measured on the live /contact/: footer 94px = 20px pad + a 74px copyright
  // band, dark ground, no back-to-top. Returned as its own tree rather than
  // threading three `display: none` conditionals through the full markup —
  // every hook above still runs unconditionally, and the parallax effect
  // already no-ops because `topSectionRef` stays null here.
  if (variant === "compact") {
    return (
      <footer ref={footerRef} className="navigationFooter relative w-full bg-[#262626] pt-[20px]">
        <div className="navigationFooter__bottomSection sticky bottom-0 z-1 flex w-full flex-col justify-center bg-[#262626] px-[15px] text-white md:px-[30px] xl:px-[40px]">
          <div className="navigationFooter__bottomSection--3 font-S flex flex-col items-start gap-[12px] py-[20px] md:flex-row md:items-center md:justify-between">
            <p className="navigationFooter__copyright text-white/60">{FOOTER_COPYRIGHT}</p>
            <a
              href={`mailto:${OFFICES[0].email}`}
              className="font-S text-white/60 transition-colors hover:text-white"
            >
              {OFFICES[0].email}
            </a>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer ref={footerRef} className="navigationFooter relative w-full bg-white pt-[120px]">
      <div
        ref={topSectionRef}
        // Measured live at five viewport sizes (600/852/1000 tall at 393 wide,
        // 700/900 at 1440): `__topSection` is always exactly the viewport
        // height. It used to be a px ladder that happened to be right at the
        // two sizes it was first measured at and wrong everywhere else.
        className="navigationFooter__topSection relative z-2 flex h-screen w-full flex-col justify-between overflow-hidden bg-[#262626] px-[25px] pb-[80px] text-white md:px-[30px] md:pb-[35px] xl:px-[40px] xl:pb-[35px]"
      >
        {/*
          `justify-between`, not `justify-end`. The source lays this panel out
          as a two-row grid — measured `grid-template-rows: 381.6px 483.4px` on
          a 900px panel — with the rule and the menu in the top row and the
          contact block down in the second. Its rule sits at the panel's very
          top edge, offset 0.

          Ours bottom-aligned the lot: the rule landed 445px down, at the
          panel's midpoint, and everything below it ran to the bottom edge.
          Against a full-height photograph that reads as an empty top half and a
          crowded foot — "Its too bottom heavy."
        */}
        {/* The source fills the section and scales it 1.4 — measured
            `matrix(1.4, 0, 0, 1.4, 0, ty)` at every width, giving a rect of
            140% x 140% of the section. Oversizing it with px dimensions
            instead (the old 1344px wide box in a 393px section) put a
            completely different crop on screen at phone widths. */}
        <div
          ref={imageRef}
          className="navigationFooter__mainImage pointer-events-none absolute inset-0 -z-2 h-full w-full"
          // The parallax handler rewrites `transform` wholesale, so the scale
          // has to live in the same property rather than in a Tailwind
          // utility (v4 emits `scale` separately and the two would fight).
          // translate3d comes first so the matrix' vertical offset stays in
          // the section's own pixels, matching the source's measured `ty`.
          style={{ transform: "translate3d(0, 0, 0) scale(1.4)" }}
        >
          <Image
            src={FOOTER_IMAGE.src}
            alt={FOOTER_IMAGE.alt}
            fill
            sizes="140vw"
            className="object-cover"
          />
        </div>

        {/*
          Scrim over the parallax panel.

          The layout was drawn around a dark architectural photograph, so the
          white menu sitting on it needed nothing behind it. This scrim was
          added when our panel was a BRIGHT loft interior — brick and daylight —
          against which the five service links measured 1.3-2.1:1 and "Applied
          AI" was effectively gone.

          The photograph is now a dark one, so 55% was over-correcting it into
          a near-black rectangle: the picture the page is showing had almost
          nothing left to see. Measured on the new image, white text against the
          photo's 90th-percentile brightness: 13.2:1 at 55%, 9.0:1 at 30%,
          5.6:1 with no scrim at all. 30% keeps twice the contrast the AA
          threshold asks for and gives the room back its floor, lamps and
          plants.

          It sits between the image and the menu (the image is `-z-2`, the menu
          `z-1`) and darkens the panel without touching the parallax transform,
          which stays on the image wrapper above.
        */}
        <div
          aria-hidden="true"
          className="navigationFooter__mainImageScrim pointer-events-none absolute inset-0 -z-1 bg-black/30"
        />

        <div className="relative z-1 flex w-full flex-col gap-[24px] xl:gap-[40px]">
          <div className="__line h-px w-full bg-white/25 xl:w-[1340px]" />

          <div className="flex w-full flex-col gap-[40px] md:flex-row md:items-start md:justify-between xl:gap-[60px]">
            <ul className="navigationFooter__mainMenu mt-[40px] flex flex-col gap-[7px] xl:w-[530px]">
              <li className="font-S mb-[10px] font-semibold text-white/70">Services</li>
              {SERVICE_LINKS.map((link) => (
                <li key={link.href} className="navigationFooter__menuItemWrapper h-[35px] overflow-hidden xl:h-[55px]">
                  <Link
                    href={link.href}
                    className="font-XL inline-block transition-transform duration-300 ease-out hover:-translate-y-[6px]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="navigationFooter__subMenu mt-[40px] flex flex-col gap-[7px] xl:w-[142px]">
              <span className="font-S font-semibold text-white/70">{EXPLORE_GROUP.title}</span>
              <ul>
                {EXPLORE_GROUP.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="font-L">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* `position: sticky` + `bottom: 0` is the entire reveal mechanism —
          combined with `__topSection`'s higher z-index above, it pins here
          while the top section scrolls up and off. */}
      <div className="navigationFooter__bottomSection sticky bottom-0 z-1 flex w-full flex-col justify-center bg-[#262626] px-[15px] text-white md:px-[30px] xl:min-h-[625px] xl:px-[40px]">
        {/*
          Band 1: the wordmark plus a `__bottomMenuWrapper` holding TWO lists
          side by side — a "Services" toggle followed by the five service
          lines, and the explore/studio links. A single wrapped list here
          measured 91px tall on a phone against the reference's 447px, which is
          why the two lists stay separate.
        */}
        <div className="navigationFooter__bottomSection--1 flex flex-col py-[25px] md:flex-row md:items-start md:justify-between md:py-[32px]">
          <div className="navigationFooter__bottomMenu order-2 mt-[65px] flex flex-col md:order-1 md:mt-0 md:flex-row md:gap-[30px]">
            <div className="navigationFooter__bottomMenuWrapper mt-[65px] flex flex-row gap-[30px] md:mt-0">
              <ul className="navigationFooter__bottomMenuList flex w-[167px] flex-col gap-[10px] md:w-auto md:flex-row md:items-center md:gap-[20px]">
                <li className="navigationFooter__bottomMenuButton">
                  <button
                    type="button"
                    className="group flex items-center gap-[8px] text-white"
                    aria-label="Services"
                  >
                    Services
                    <PlusIcon className="h-[19px] w-[19px] transition-transform duration-300 group-hover:rotate-90" />
                  </button>
                </li>
                {SERVICE_LINKS.map((link) => (
                  <li key={link.href} className="navigationFooter__bottomMenuItem">
                    <ButtonLine label={link.label} href={link.href} color="white" />
                  </li>
                ))}
              </ul>
              <ul className="navigationFooter__bottomSubMenu flex w-[167px] flex-col gap-[10px] md:w-auto md:flex-row md:items-center md:gap-[20px]">
                {[...EXPLORE_GROUP.items, ...COMPANY_GROUP.items].map((item) => (
                  <li key={item.href}>
                    <ButtonLine label={item.label} href={item.href} color="white" />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Link
            href="/"
            aria-label="NeuraGul home"
            className="navigationFooter__bottomSectionLogo order-1 mt-[20px] flex h-[31px] shrink-0 items-center md:order-2 md:mt-0"
          >
            <Wordmark className="text-[22px]" />
          </Link>
        </div>

        {/*
          Band 2: the two offices sit side by side at every width (measured
          167px + 158px at 393). Socials appear here only from md; back to top
          appears here only below it — the source swaps which band owns each.
          The 160px of bottom padding is the source's, and is most of why this
          band measures 372px on desktop.
        */}
        <div className="navigationFooter__bottomSection--2 flex flex-col border-t border-white/10 pt-[24px] md:flex-row md:items-start md:justify-between md:pt-[32px] md:pb-[160px]">
          {/* The layout was built for a socials row plus two offices. There
              are no social accounts to link and one location, so this band
              carries the single contact record and nothing else. */}
          <div className="order-1 flex flex-row gap-[10px] md:gap-[60px]">
            {OFFICES.map((office) => (
              <OfficeBlock key={office.label} office={office} className="navigationFooter__contactOne" />
            ))}
          </div>

          <button
            type="button"
            onClick={handleBackToTop}
            className="navigationFooter__bottomText group order-3 mt-[60px] mb-[15px] flex items-center gap-[5px] md:hidden"
          >
            {FOOTER_BACK_TO_TOP}
            <ArrowIcon className="h-[16px] w-[16px] -rotate-90 transition-transform duration-300 group-hover:-translate-y-[3px]" />
          </button>
        </div>

        {/* Band 3 is a 25px-padded rule: copyright, back to top (md and up
            only — below that it lives in band 2), and the studio credit. */}
        <div className="navigationFooter__bottomSection--3 font-S flex flex-row items-center justify-between gap-[12px] border-t border-white/10 py-[25px]">
          <p className="navigationFooter__copyright text-white/60">{FOOTER_COPYRIGHT}</p>
          <button
            type="button"
            onClick={handleBackToTop}
            className="navigationFooter__bottomText group hidden items-center gap-[5px] md:flex"
          >
            {FOOTER_BACK_TO_TOP}
            {/* ArrowIcon points right by default; rotating -90deg turns it up. */}
            <ArrowIcon className="h-[16px] w-[16px] -rotate-90 transition-transform duration-300 group-hover:-translate-y-[3px]" />
          </button>
          <a
            href={`mailto:${OFFICES[0].email}`}
            className="navigationFooter__credits font-S text-white/60 transition-colors hover:text-white"
          >
            {OFFICES[0].email}
          </a>
        </div>
      </div>
    </footer>
  );
}


function OfficeBlock({ office, className }: { office: OfficeContact; className?: string }) {
  return (
    <div className={cn("flex flex-1 flex-col gap-[10px] pt-[25px] md:w-[173px] md:flex-none", className)}>
      <p className="font-S font-semibold">{office.label}</p>
      <address className="font-S flex flex-col not-italic text-white/70">
        {office.address.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </address>
      {office.phone && office.phoneHref ? (
        <a href={office.phoneHref} className="font-S text-white/70 transition-colors hover:text-white">
          {office.phone}
        </a>
      ) : null}
      {office.email ? <ButtonLine label="E-mail" href={`mailto:${office.email}`} color="white" /> : null}
    </div>
  );
}
