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
import { ButtonLine } from "@/components/sites/lpas-com-76f4f1fd/shared/buttons";
import { ArrowIcon, LogoIcon, PlusIcon } from "@/components/sites/lpas-com-76f4f1fd/shared/icons";
import { cn } from "@/lib/utils";
import type { OfficeContact } from "@/types/lpas";
import {
  COMPANY_GROUP,
  EXPLORE_GROUP,
  FOOTER_BACK_TO_TOP,
  FOOTER_COPYRIGHT,
  FOOTER_CREDIT,
  FOOTER_IMAGE,
  MARKET_LINKS,
  OFFICES,
  SOCIAL_LINKS,
} from "./content";

// Minimal shape for the Lenis instance the theme installs on `window`. Back
// to top MUST route through it when present — calling `window.scrollTo`
// while Lenis owns the scroll loop causes the native scroll and Lenis's
// rAF-driven scroll to fight over the scroll position mid-animation.
// `window.__lpasLenis` is declared once, ambiently, in shared/SmoothScroll.tsx.

export interface NavigationFooterProps {
  /**
   * `full` (default) is the 1525px footer: the parallax image panel, the big
   * menu, offices, socials and the copyright bar.
   *
   * `compact` is what the source serves on `/contact/`, measured at 94px:
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

      // The image is measured taller than the section it sits in (2016x1260
      // in a 1440x900 section on desktop) precisely so it has room to
      // parallax; the surplus height IS the travel amplitude, and it scales
      // automatically with the responsive image/section sizes instead of
      // being hard-coded to the desktop measurement.
      const amplitude = image.offsetHeight - topSection.offsetHeight;

      const rect = footer.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      // 0 when the footer's top has just entered the bottom of the
      // viewport, 1 once it has scrolled a full footer-height further up.
      const raw = (viewportHeight - rect.top) / (viewportHeight + rect.height);
      const progress = Math.min(1, Math.max(0, raw));

      image.style.transform = `translate3d(-50%, ${(-amplitude * progress).toFixed(2)}px, 0)`;
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
    if (typeof window !== "undefined" && window.__lpasLenis) {
      window.__lpasLenis.scrollTo(0);
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
            <div className="__credits flex items-center gap-[6px] text-white/60">
              <span>{FOOTER_CREDIT.prefix}</span>
              <ButtonLine label={FOOTER_CREDIT.label} href={FOOTER_CREDIT.href} color="white" external />
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer ref={footerRef} className="navigationFooter relative w-full bg-white pt-[120px]">
      <div
        ref={topSectionRef}
        className="navigationFooter__topSection relative z-2 flex h-[600px] w-full flex-col justify-end overflow-hidden bg-[#262626] px-[15px] pb-[40px] text-white md:h-[750px] md:px-[30px] md:pb-[35px] xl:h-[900px] xl:px-[40px] xl:pb-[35px]"
      >
        {/* Oversized on purpose — see the amplitude comment above. Anchored
            centred and translated on scroll, never shrunk to fit. */}
        <div
          ref={imageRef}
          className="navigationFooter__mainImage pointer-events-none absolute left-1/2 top-0 -z-2 h-[840px] w-[1344px] md:h-[1071px] md:w-[1714px] xl:h-[1260px] xl:w-[2016px]"
          // The parallax handler rewrites `transform` wholesale, so the -50%
          // centring has to live in the same property — not in a Tailwind
          // translate utility, which v4 emits as the separate `translate`
          // property and would double up. Seeding it here keeps the image
          // centred before the first scroll and under reduced motion, where
          // the parallax never runs.
          style={{ transform: "translate3d(-50%, 0, 0)" }}
        >
          <Image
            src={FOOTER_IMAGE.src}
            alt={FOOTER_IMAGE.alt}
            fill
            sizes="(min-width: 1280px) 2016px, (min-width: 768px) 1714px, 1344px"
            className="object-cover"
          />
        </div>

        <div className="relative z-1 flex w-full flex-col gap-[24px] xl:gap-[40px]">
          <div className="__line h-px w-full bg-white/25 xl:w-[1340px]" />

          <div className="flex w-full flex-col gap-[40px] md:flex-row md:items-start md:justify-between xl:gap-[60px]">
            <ul className="navigationFooter__mainMenu mt-[50px] flex flex-col gap-[4px] xl:w-[530px]">
              <li className="font-S mb-[10px] font-semibold text-white/70">Our Focus</li>
              {MARKET_LINKS.map((link) => (
                <li key={link.href} className="navigationFooter__menuItemWrapper h-[40px] overflow-hidden xl:h-[55px]">
                  <Link
                    href={link.href}
                    className="font-XL inline-block transition-transform duration-300 ease-out hover:-translate-y-[6px]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="navigationFooter__subMenu mt-[50px] flex flex-col gap-[8px] xl:w-[142px]">
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
          Band 1 mirrors the source exactly: an "Our Focus" toggle followed by
          the sub-menu links on ONE inline row at the left, with the wordmark
          pushed to the right. The markets themselves are NOT repeated here —
          they live in the large menu over the image above.
        */}
        <div className="navigationFooter__bottomSection--1 flex flex-col gap-[24px] py-[24px] md:flex-row md:items-center md:justify-between md:py-[32px]">
          <div className="navigationFooter__bottomMenu flex flex-col gap-[16px] md:flex-row md:items-center md:gap-[30px]">
            <button
              type="button"
              className="navigationFooter__bottomMenuButton group flex items-center gap-[8px] text-white"
              aria-label="Our Focus"
            >
              Our Focus
              <PlusIcon className="h-[19px] w-[19px] transition-transform duration-300 group-hover:rotate-90" />
            </button>
            <ul className="navigationFooter__bottomSubMenu flex flex-wrap items-center gap-x-[26px] gap-y-[10px]">
              {[...EXPLORE_GROUP.items, ...COMPANY_GROUP.items].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[#747474] transition-colors duration-300 hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <Link href="/" aria-label="LPAS home" className="navigationFooter__bottomSectionLogo block h-[31px] w-[75px] shrink-0">
            <LogoIcon className="h-full w-full" />
          </Link>
        </div>

        <div className="navigationFooter__bottomSection--2 flex flex-col gap-[30px] border-t border-white/10 py-[24px] md:flex-row md:items-start md:justify-between md:py-[32px]">
          <div className="navigationFooter__social--sm flex flex-row gap-[24px] md:order-1 md:self-start">
            {SOCIAL_LINKS.map((social) => (
              <ButtonLine key={social.href} label={social.label} href={social.href} color="white" external />
            ))}
          </div>

          <div className="flex flex-col gap-[24px] md:order-0 md:flex-row md:gap-[60px]">
            {OFFICES.map((office, index) => (
              <OfficeBlock
                key={office.label}
                office={office}
                className={index === 0 ? "__contactOne" : "__contactTwo"}
              />
            ))}
          </div>
        </div>

        <div className="navigationFooter__bottomSection--3 font-S flex flex-col items-start gap-[12px] border-t border-white/10 py-[20px] md:flex-row md:items-center md:justify-between">
          <p className="navigationFooter__copyright text-white/60">{FOOTER_COPYRIGHT}</p>
          <button
            type="button"
            onClick={handleBackToTop}
            className="navigationFooter__bottomText group flex items-center gap-[8px]"
          >
            {FOOTER_BACK_TO_TOP}
            {/* ArrowIcon points right by default; rotating -90deg turns it up. */}
            <ArrowIcon className="h-[16px] w-[16px] -rotate-90 transition-transform duration-300 group-hover:-translate-y-[3px]" />
          </button>
          <div className="__credits flex items-center gap-[6px] text-white/60">
            <span>{FOOTER_CREDIT.prefix}</span>
            <ButtonLine label={FOOTER_CREDIT.label} href={FOOTER_CREDIT.href} color="white" external />
          </div>
        </div>
      </div>
    </footer>
  );
}


function OfficeBlock({ office, className }: { office: OfficeContact; className?: string }) {
  return (
    <div className={cn("flex w-[173px] flex-col gap-[10px]", className)}>
      <p className="font-S font-semibold">{office.label}</p>
      <address className="font-S flex flex-col not-italic text-white/70">
        {office.address.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </address>
      <a href={office.phoneHref} className="font-S text-white/70 transition-colors hover:text-white">
        {office.phone}
      </a>
      <ButtonLine label="E-mail" href={`mailto:${office.email}`} color="white" />
    </div>
  );
}
