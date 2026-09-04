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
import { ServicesMenu } from "@/components/site/shared/ServicesMenu";
import { MenuIcon, Wordmark } from "@/components/site/shared/icons";
import { ButtonLine } from "@/components/site/shared/buttons";
import { COMPANY_GROUP, EXPLORE_GROUP, OFFICES, SERVICE_LINKS } from "./content";
import type { ServiceHeaderTone } from "@/components/site/shared/blocks/BlockHeaderServices";
import type { ServiceSlug } from "@/types/site";
import type { NavGroup, OfficeContact } from "@/types/site";

/** ms the overlay's exit transition takes — used to delay unmounting the grid. */
const OVERLAY_TRANSITION_MS = 400;

export interface MainNavigationProps {
  /**
   * Type colour for the wordmark, matching whatever this page paints behind
   * the top bar. `"light"` (the default) is the white wordmark every dark-ground
   * page wants; `"dark"` is #111111, for the pages whose first viewport is a
   * light ground.
   *
   * There are four of those: `/about/` and `/process/`, whose `BlockHeaderGeneral`
   * is a flat `#ececec` at every breakpoint, and the two service lines whose
   * accent is light (`app-development`, `data-intelligence`). Those two do not
   * hardcode it — they pass `SERVICE_TONE[slug]` from `BlockHeaderServices`, so
   * a new light accent is handled without touching this file.
   *
   * The Menu button is deliberately not affected: it carries its own
   * `rgba(14,14,14,0.6)` pill and reads on either ground.
   */
  tone?: ServiceHeaderTone;
  /**
   * Set on a service page to show the "Shift your focus" strip beside the
   * Menu button, with this service open. Omitted everywhere else — the source
   * hides the strip on its home, about and portfolio pages.
   */
  service?: ServiceSlug;
}
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

export function MainNavigation({ tone = "light", service }: MainNavigationProps = {}) {
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
      /*
        TWO frames, not one, and this is load-bearing.

        `setRender(true)` only takes the overlay out of `display: none`; the
        opening state (`opacity-0`, the translate, the rule's `scale-x-0`) has
        to be *painted* before `animateIn` flips, or there is no start value to
        interpolate from and every element snaps straight to its end state.

        A single `requestAnimationFrame` was not enough: `setRender` is called
        from a passive effect, so React has only *scheduled* that render when
        the callback runs, and both flags landed in one commit. The whole
        entrance — overlay fade, the 60ms item stagger, the rule wipe — was
        silently dead, which is invisible unless you actually watch it: the menu
        still opened, just instantly.

        The first frame lets React commit and paint `render`; the second flips
        `animateIn` against a ground truth the compositor already has.
      */
      let second = 0;
      const first = requestAnimationFrame(() => {
        second = requestAnimationFrame(() => setAnimateIn(true));
      });
      return () => {
        cancelAnimationFrame(first);
        cancelAnimationFrame(second);
      };
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
      {/*
        The bar rides the page grid rather than its own calc widths. Its two
        ends must sit on `main-start` / `main-end` — the line every content
        block on the site starts at — which is the gutter PLUS the grid's 10px
        column gap: 25px inset below 768, 40px from 768, 50px from 1280. The
        source does exactly this with a subgrid bar.

        It used to be `w-[calc(100%-30px)] md:-60px lg:-80px`, which is the
        gutter alone (15/30/40) with no gap, and stepped at Tailwind's `lg`
        (1024) where the grid steps at 1280. So the nav sat 10px wide of every
        other element on the page at every width, and a further 10px out
        between 1024 and 1279. Placing it on the named grid lines means it
        cannot drift again if the gutters are ever retuned.
      */}
      <div className="navigationMain__topBar ng-grid relative z-10 my-[25px] h-[50px] w-full items-center py-[10px]">
        <Link
          href="/"
          aria-label="NeuraGul home"
          className={cn(
            "navigationMain__topBarLogo col-start-[main-start] col-end-[main-end] row-start-1 flex h-[30px] items-center justify-self-start transition-colors ease-in-out",
            // The top bar is `z-10` and the overlay is not, so the wordmark
            // paints *over* the open menu's black/80 ground — a dark wordmark
            // would disappear the moment the menu opened. While `open`, it is
            // always white, and the 400ms matches the overlay's own fade so the
            // two changes travel together in both directions.
            open || tone === "light" ? "text-white" : "text-[#111111]",
          )}
          style={{ transitionDuration: `${OVERLAY_TRANSITION_MS}ms` }}
        >
          <Wordmark className="text-[17px]" />
        </Link>

        <div className="navigationMain__topBarItems col-start-[main-start] col-end-[main-end] row-start-1 flex h-[30px] items-center justify-end justify-self-end">
          {/* Sits left of the Menu button, which stays hard against main-end.
              The `w-[89px]` this used to carry was exactly the button; with the
              strip beside it the row has to size to its content instead. */}
          {service ? <ServicesMenu current={service} tone={tone} /> : null}
          <button
            ref={toggleRef}
            type="button"
            onClick={toggle}
            aria-expanded={open}
            aria-controls={overlayId}
            className={cn(
              // The source's own box model, which is what makes the pill
              // tighten as the icon morphs: 3px before the label, 5px between
              // label and icon, and a right pad that runs 7px -> 2px. With the
              // icon's own 30px -> 21px that takes the button from 89px to
              // 75px, right edge fixed (it sits at the end of a 89px flex row
              // that justifies to the end). It used to be pinned at `w-[89px]`,
              // which left no room for any of that to move.
              // 6px, not a stadium: the source's pill is a rounded rect, and it
              // sits on a `blur(5px)` backdrop so it stays legible over the
              // hero video without needing a heavier ground.
              "buttonMenu flex h-[30px] items-center justify-center gap-[5px] rounded-[6px] pl-[3px] backdrop-blur-[5px]",
              "transition-[background-color,color,padding] duration-300 ease-out",
              open ? "pr-[2px]" : "pr-[7px]",
              // Dark pill over the page so it reads on the hero video; inverted
              // to a light pill once the overlay is up, which is what the
              // reference does — on the blurred ground a dark pill disappears.
              open ? "bg-white text-[#111111]" : "bg-[rgba(14,14,14,0.6)] text-white",
            )}
          >
            {/* Both labels sit absolutely in the same 44x24 box so the swap
                happens in place with zero layout shift — the theme toggles
                display flex/none, we cross-fade opacity for the same visual
                result without fighting a non-animatable display change. */}
            {/*
              The label has its own ground and keeps it in both states: a
              #262626 pill, 4px radius, white text, never inverting with the
              button around it. Only the button's own background crosses over,
              which is why the open state reads as a dark chip on white rather
              than as plain black text.
            */}
            <span className="buttonMenu__text font-XS relative flex h-[24px] w-[44px] items-center justify-center rounded-[4px] bg-[#262626] px-[7px] text-white">
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
            {/*
              One icon that morphs, not two that cross-fade. The lines rotate
              into the cross about origins solved from the source's own end
              geometry — see `MenuIcon`. The 30px -> 21px width is the source's
              too, and it runs faster than the rotation, so the pill has
              finished tightening while the cross is still turning.
            */}
            <MenuIcon
              open={open}
              className={cn(
                "h-[30px] shrink-0 transition-[width] duration-300 ease-out",
                open ? "w-[21px]" : "w-[30px]",
              )}
            />
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
          "navigationMain__dropDown fixed inset-0 overflow-y-auto transition-[opacity,transform] duration-[400ms] ease-in-out",
          // The reference does not lay the menu on a flat scrim — the page
          // behind it is blurred out. Ours was `bg-black/80` alone, and at 0.8
          // the homepage hero was still legible straight through: "I build the
          // software that small companies actually run on" ran across the
          // service links and the scroll cue sat under the contact block. The
          // blur is what makes the ground quiet; the 70% black is what keeps
          // white type at contrast over whatever page is behind it.
          "bg-black/70 backdrop-blur-[24px]",
          render ? "block" : "hidden",
          animateIn ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 md:translate-x-0",
        )}
      >
        {/*
          A column, not a three-up grid. The reference puts the service list
          across the left half at `font-XL`, the two link groups at ~64% across,
          and the contact record on the bottom edge — where ours had it in a
          third top-row column, "Web Development", "App Development" and
          "Cloud & Infrastructure" each wrapped onto two lines in a 376px track.
        */}
        <div className="mx-auto flex min-h-full w-full max-w-[1440px] flex-col px-[15px] pb-[40px] pt-[100px] md:px-[30px] lg:px-[40px]">
          {/* The hairline under the top bar. First thing in, so the panel reads
              as opening from the header rather than arriving all at once. */}
          <div
            aria-hidden="true"
            className={cn(
              "navigationMain__rule h-px w-full shrink-0 origin-left bg-white/25 transition-transform duration-[600ms] ease-out",
              animateIn ? "scale-x-100" : "scale-x-0",
            )}
          />

          <div className="mt-[40px] grid flex-1 auto-rows-min gap-x-[40px] gap-y-[48px] md:mt-[56px] lg:grid-cols-[1.5fr_1fr]">
          <ul className="navigationMain__mainMenu flex flex-col gap-[10px]">
            <li className="font-S mb-[8px] font-semibold text-white/50">Services</li>
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

          </div>

          {/* The reference carries its offices on the bottom edge and its
              socials opposite them. There are no socials to render, so the
              single contact record sits alone on the right. */}
          <div className="navigationMain__contactOne mt-[48px] flex w-fit shrink-0 flex-col gap-[6px] lg:mt-0 lg:self-end">
            <OfficeBlock office={OFFICES[0]} />
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
      <p className="font-S font-semibold text-white/50">{group.title}</p>
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
      <p className="font-S font-semibold text-white/50">{office.label}</p>
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
