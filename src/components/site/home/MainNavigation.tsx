"use client";

/**
 * Fixed top navigation — a dark pill toggle over the hero video that opens a
 * full-screen, click-driven overlay menu.
 *
 * IMPORTANT: `.navigationMain` never changes class, background, height or
 * shadow on scroll. It stays fixed and fully transparent at every scroll
 * position. Do NOT add scroll listeners or shrink/recolor behavior here.
 */
import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { CloseIcon, MenuIcon, Wordmark } from "@/components/site/shared/icons";
import { ButtonLine } from "@/components/site/shared/buttons";
import { COMPANY_GROUP, EXPLORE_GROUP, OFFICES, SERVICE_LINKS } from "./content";
import type { NavGroup, OfficeContact } from "@/types/site";

/** ms the overlay's exit transition takes — used to delay unmounting the grid. */
const OVERLAY_TRANSITION_MS = 400;
/** ms between each menu item's fade-up entrance. */
const ITEM_STAGGER_MS = 60;

/** Shared entrance transition for a staggered menu item — fades up into place. */
function staggerProps(index: number, animateIn: boolean) {
  return {
    className: cn(
      "transition-[opacity,transform] duration-[400ms] ease-out",
      animateIn ? "translate-y-0 opacity-100" : "translate-y-[20px] opacity-0",
    ),
    style: { transitionDelay: `${index * ITEM_STAGGER_MS}ms` },
  };
}

export function MainNavigation() {
  const overlayId = useId();

  // `open` is the logical state (drives aria + the scroll lock + escape key).
  // `render`/`animateIn` split mount from transition so the overlay can fade
  // and slide in on mount and fade/slide out again before it leaves the DOM,
  // instead of an abrupt display:none <-> display:grid jump.
  const [open, setOpen] = useState(false);
  const [render, setRender] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  const overlayRef = useRef<HTMLElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  // Only move focus after a real user interaction, so the initial mount
  // (open=false) never yanks focus onto the toggle button on page load.
  const didInteract = useRef(false);

  const toggle = useCallback(() => {
    didInteract.current = true;
    setOpen((prev) => !prev);
  }, []);

  const close = useCallback(() => {
    didInteract.current = true;
    setOpen(false);
  }, []);

  useEffect(() => {
    if (open) {
      setRender(true);
      const raf = requestAnimationFrame(() => setAnimateIn(true));
      return () => cancelAnimationFrame(raf);
    }
    setAnimateIn(false);
    const timer = window.setTimeout(() => setRender(false), OVERLAY_TRANSITION_MS);
    return () => window.clearTimeout(timer);
  }, [open]);

  // Lock body scroll while the overlay is open; always restore the previous
  // value rather than assuming "" so we don't clobber another lock.
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  useEffect(() => {
    if (!didInteract.current) return;
    if (open) {
      overlayRef.current?.focus();
    } else {
      toggleRef.current?.focus();
    }
  }, [open]);

  let itemIndex = 0;

  return (
    <div className="navigationMain fixed inset-x-0 top-0 z-[1000] flex h-[100px] w-full items-center bg-transparent">
      <div className="navigationMain__topBar relative z-10 mx-auto my-[25px] flex h-[50px] w-[calc(100%-30px)] items-center justify-between py-[10px] md:w-[calc(100%-60px)] lg:w-[calc(100%-80px)]">
        <Link
          href="/"
          aria-label="NeuraGul home"
          className="navigationMain__topBarLogo flex h-[30px] items-center text-white"
        >
          <Wordmark className="text-[17px]" />
        </Link>

        <div className="navigationMain__topBarItems flex h-[30px] w-[89px] items-center justify-end">
          <button
            ref={toggleRef}
            type="button"
            onClick={toggle}
            aria-expanded={open}
            aria-controls={overlayId}
            className="buttonMenu flex h-[30px] w-[89px] items-center justify-center gap-[4px] rounded-full bg-[rgba(14,14,14,0.6)] px-[8px] text-white"
          >
            {/* Both labels sit absolutely in the same 44x24 box so the swap
                happens in place with zero layout shift — the theme toggles
                display flex/none, we cross-fade opacity for the same visual
                result without fighting a non-animatable display change. */}
            <span className="buttonMenu__text font-XS relative h-[24px] w-[44px]">
              <span
                className={cn(
                  "buttonMenu__textMenu absolute inset-0 flex items-center justify-center transition-opacity duration-300 ease-out",
                  open ? "opacity-0" : "opacity-100",
                )}
                aria-hidden={open}
              >
                Menu
              </span>
              <span
                className={cn(
                  "buttonMenu__textClose absolute inset-0 flex items-center justify-center transition-opacity duration-300 ease-out",
                  open ? "opacity-100" : "opacity-0",
                )}
                aria-hidden={!open}
              >
                Close
              </span>
            </span>
            {/* MenuIcon's three paths (menuLineOne/Two/Three) aren't exposed
                for per-line control from outside icons.tsx, so we cross-fade
                MenuIcon -> CloseIcon with opacity+rotate instead of morphing
                the hamburger lines into a cross, per spec's fallback. */}
            <span className="relative flex h-[30px] w-[30px] shrink-0 items-center justify-center">
              <MenuIcon
                className={cn(
                  "absolute h-[30px] w-[30px] transition-[opacity,transform] duration-300 ease-out",
                  open ? "rotate-45 opacity-0" : "rotate-0 opacity-100",
                )}
              />
              <CloseIcon
                className={cn(
                  "absolute h-[30px] w-[30px] transition-[opacity,transform] duration-300 ease-out",
                  open ? "rotate-0 opacity-100" : "-rotate-45 opacity-0",
                )}
              />
            </span>
          </button>
        </div>
      </div>

      <nav
        ref={overlayRef}
        id={overlayId}
        tabIndex={-1}
        aria-label="Main menu"
        aria-hidden={!render}
        className={cn(
          "navigationMain__dropDown fixed inset-0 content-start overflow-y-auto bg-black/80 transition-[opacity,transform] duration-[400ms] ease-in-out",
          render ? "grid" : "hidden",
          animateIn ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 md:translate-x-0",
        )}
      >
        <div className="mx-auto grid w-full max-w-[1440px] auto-rows-min gap-x-[40px] gap-y-[48px] px-[15px] pb-[60px] pt-[130px] md:grid-cols-2 md:px-[30px] md:pt-[150px] lg:grid-cols-[1fr_1.4fr_1fr] lg:px-[40px] lg:pt-[170px]">
          <ul className="navigationMain__mainMenu flex flex-col gap-[10px]">
            <li className="font-S mb-[8px] font-semibold text-white">Services</li>
            {SERVICE_LINKS.map((link) => {
              const props = staggerProps(itemIndex++, animateIn);
              return (
                <li key={link.href} className={props.className} style={props.style}>
                  <Link
                    href={link.href}
                    onClick={close}
                    className="font-XL block text-white transition-opacity duration-300 ease-out hover:opacity-60"
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="navigationMain__subMenu flex flex-col gap-[40px] md:flex-row lg:flex-col lg:gap-[48px]">
            <NavGroupColumn
              group={EXPLORE_GROUP}
              startIndex={itemIndex}
              animateIn={animateIn}
              onNavigate={close}
            />
            <NavGroupColumn
              group={COMPANY_GROUP}
              startIndex={(itemIndex += EXPLORE_GROUP.items.length)}
              animateIn={animateIn}
              onNavigate={close}
            />
          </div>

          {/* The layout was built for two offices and a socials row. NeuraGul
              has one location and no social accounts, so this column carries a
              single contact record — see OFFICES in content.ts. */}
          <div className="flex flex-col gap-[40px]">
            <div className="navigationMain__contactOne flex flex-col gap-[6px]">
              <OfficeBlock office={OFFICES[0]} />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

interface NavGroupColumnProps {
  group: NavGroup;
  startIndex: number;
  animateIn: boolean;
  onNavigate: () => void;
}

function NavGroupColumn({ group, startIndex, animateIn, onNavigate }: NavGroupColumnProps) {
  return (
    <div className="flex flex-col gap-[10px]">
      <p className="font-S font-semibold text-white">{group.title}</p>
      <ul className="flex flex-col gap-[8px]">
        {group.items.map((item, i) => {
          const props = staggerProps(startIndex + i, animateIn);
          return (
            <li key={item.href} className={props.className} style={props.style}>
              <Link
                href={item.href}
                onClick={onNavigate}
                className="font-M block text-white transition-opacity duration-300 ease-out hover:opacity-60"
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function OfficeBlock({ office }: { office: OfficeContact }) {
  return (
    <>
      <p className="font-S font-semibold text-white">{office.label}</p>
      {office.address.map((line) => (
        <p key={line} className="font-M text-white/80">
          {line}
        </p>
      ))}
      {office.phone && office.phoneHref ? (
        <a
          href={office.phoneHref}
          className="font-M w-fit text-white transition-opacity duration-300 ease-out hover:opacity-60"
        >
          {office.phone}
        </a>
      ) : null}
      {office.email ? (
        <ButtonLine label="E-mail" href={`mailto:${office.email}`} color="white" className="mt-[4px]" />
      ) : null}
    </>
  );
}
