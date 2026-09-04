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
import { usePathname } from "next/navigation";
import { ServicesMenu } from "@/components/site/shared/ServicesMenu";
import { MenuIcon, Wordmark } from "@/components/site/shared/icons";
import { ButtonLine } from "@/components/site/shared/buttons";
import {
  COMPANY_GROUP,
  EXPLORE_GROUP,
  OFFICES,
  SERVICE_LINKS,
} from "./content";
import type { ServiceHeaderTone } from "@/components/site/shared/blocks/BlockHeaderServices";
import type { ServiceSlug } from "@/types/site";
import type { NavGroup, OfficeContact } from "@/types/site";

/** ms the overlay's exit transition takes — used to delay unmounting the grid. */
/**
 * The overlay's timeline, taken off the source by clicking `.buttonMenu` from
 * inside the page (so t=0 is the click itself, not Playwright's input latency)
 * and sampling every 16ms. Two runs agreed to within a frame.
 *
 *   OPEN    panel `display` flips at 20ms — it does NOT fade or slide
 *           rule    starts  700ms, runs 600ms, to opacity 0.30
 *           items   start  1000ms, run  400ms each, 100ms apart
 *   CLOSE   items   start immediately, run 300ms each, 65ms apart, IN REVERSE
 *           rule    starts  480ms, runs 400ms
 *           panel   `display: none` at ~1350ms
 *
 * The panel itself never animates, and that is the whole reason the source
 * feels smooth: it carries `backdrop-filter: blur(35px)` over the full
 * viewport, and cross-fading or sliding *that* makes the compositor re-run the
 * blur every frame. Only small text nodes move. Ours used to fade the panel's
 * opacity and translate it in from the right on mobile, which is the most
 * expensive pair of properties you can put on a blurred full-screen box.
 */
/*
  THE PANEL SLIDES. It starts a full viewport below and rides up into place —
  `top: 100vh -> 0`, nothing else. I missed this twice by sampling `display`,
  `opacity` and `transform`: the transform is the identity matrix the whole way
  and the opacity never leaves 1, so all three said "no animation" while `top`
  was the thing moving. Measured by logging `getBoundingClientRect().top`:

    open   holds at 900, starts ~150ms, reaches 0 at ~1350ms  (1200ms of travel)
    close  starts ~435ms, back to 900 by ~1250ms              (816ms)
    easing cubic-bezier(0.71, 0, 0.28, 0.99), fitted to twelve samples,
           rms 0.017 — a symmetric ease-in-out, p = 0.5 at u = 0.51

  Everything else rides up with it, which is why the source can afford to start
  its items at 1000ms: by then the panel is 90% of the way home and the words
  arrive just as it settles.

  TIMELINE_SCALE is the one knob. At 1 this is lpas.com's own tempo, which is
  what "1:1" asks for; the user has previously found that tempo slow ("the words
  show up after quite some time") — dropping this to ~0.6 keeps every proportion
  and takes roughly a third out of the wait.
*/
const TIMELINE_SCALE = 1;
const ms = (n: number) => Math.round(n * TIMELINE_SCALE);

/*
  110, not the measured 150: the transition cannot start until `animateIn`
  flips, which is two rAFs plus a React commit after the click — ~40ms of gate
  that the source (writing styles directly) does not pay. Subtracting it puts
  our first movement on the same frame as the source's.
*/
const OPEN_SLIDE_DELAY_MS = ms(110);
const OPEN_SLIDE_MS = ms(1200);
const CLOSE_SLIDE_DELAY_MS = ms(435);
const CLOSE_SLIDE_MS = ms(816);
/*
  The two directions are not the same curve — fitted separately, twelve samples
  opening and eight closing. Closing is slightly steeper through the middle,
  which is what made a single shared easing read as a sluggish exit.
*/
const OPEN_SLIDE_EASE = "cubic-bezier(0.71, 0, 0.28, 0.99)";
const CLOSE_SLIDE_EASE = "cubic-bezier(0.63, 0, 0.28, 0.99)";

const OPEN_RULE_DELAY_MS = ms(700);
const OPEN_RULE_MS = ms(600);
const OPEN_ITEM_DELAY_MS = ms(1000);
const OPEN_ITEM_MS = ms(400);
/** Measured per column: the service list steps 100ms, the link column 50ms. */
const OPEN_ITEM_STAGGER_MS = ms(100);
const OPEN_LINK_STAGGER_MS = ms(50);
/** The offices arrive last, 630ms after the columns begin. */
const OPEN_CONTACT_OFFSET_MS = ms(630);

const CLOSE_ITEM_MS = ms(300);
const CLOSE_ITEM_STAGGER_MS = ms(65);
const CLOSE_RULE_DELAY_MS = ms(480);
const CLOSE_RULE_MS = ms(400);

/**
 * The dot marking the section you are on, measured off the source's open menu:
 * a **5x5px** white circle with `margin: 0 10px 0 -15px`. The negative left
 * margin is the whole trick — it hangs the dot outside the text rather than
 * indenting it, so the labels stay on `main-start` whether or not one of them
 * is current. (-15 + 5 + 10 = 0.)
 *
 * The source draws it as an `::before` on the current anchor; this is a real
 * element instead, so the marker can be hidden from assistive tech separately
 * while `aria-current` carries the meaning.
 */
function CurrentDot() {
  return (
    <span
      aria-hidden="true"
      className="-ml-[15px] mr-[10px] inline-block h-[5px] w-[5px] shrink-0 rounded-full bg-white"
    />
  );
}

/**
 * Whether a nav link points at the page being viewed. Compares on the path's
 * own segments so `/services/applied-ai/` matches its sub-pages too — standing
 * on `/services/applied-ai/agents/`, the section you are in is still Applied AI,
 * which is what the dot is there to say.
 */
function isCurrentSection(pathname: string | null, href: string) {
  if (!pathname) return false;
  const trim = (v: string) => v.replace(/\/+$/, "") || "/";
  const here = trim(pathname);
  const target = trim(href.split(/[?#]/)[0]);
  if (target === "/") return here === "/";
  return here === target || here.startsWith(`${target}/`);
}

/**
 * How many items take part in the stagger. Needed because closing runs the
 * stagger backwards, so an item's delay depends on how many come after it.
 */
/** Each column's own length, headings included — they animate too. */
const SERVICE_COLUMN_COUNT = SERVICE_LINKS.length + 1;
const LINK_COLUMN_COUNT =
  EXPLORE_GROUP.items.length + COMPANY_GROUP.items.length + 2;

/**
 * When the panel may leave the DOM: after the last thing inside it has gone.
 *
 * The panel is the last thing to leave — it only starts sliding down at 435ms
 * and takes 816ms — so this is that slide plus a frame, not the item exits.
 * The items are long gone by then (625ms for a six-row column), which is what
 * the source's own dead half-second at the end turns out to be: the sheet
 * riding back down with nothing on it.
 */
const CLOSE_UNMOUNT_MS = CLOSE_SLIDE_DELAY_MS + CLOSE_SLIDE_MS + ms(50);

/**
 * The wordmark's colour change, which is not part of the overlay's own
 * timeline — it tracks the button's invert (~330ms measured) and has to stay
 * short, or the wordmark would still be turning white a second after the menu
 * had finished opening.
 */
const WORDMARK_TONE_MS = 400;

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
/**
 * Entrance/exit for one staggered menu item.
 *
 * Opening, items run forwards from a 1s delay; closing, they run backwards
 * from no delay, which is why this needs to know how many there are. The lift
 * is 10px, not 20 — measured: the source's `translateY` tracks its opacity
 * exactly, 10px at 0 and 0 at 1.
 *
 * `index` is per COLUMN, not global. The source starts every column together
 * at 1000ms and gives each its own cadence — the service list steps 100ms, the
 * link column 50ms, and both headings move with their own list rather than
 * standing still. One global counter (what this had) played the columns one
 * after another, so the right-hand links only began once the left column had
 * finished: the panel filled in two sweeps instead of one.
 *
 * `linear`, deliberately. The source's curve is linear inside sampling noise
 * (f = 0.46 at u = 0.44, 0.68 at 0.63, 0.84 at 0.81); an `ease-out` would be
 * at 0.62 by u = 0.44 and would read as visibly quicker off the mark.
 */
function staggerProps(
  index: number,
  animateIn: boolean,
  count: number,
  step: number,
) {
  const delay = animateIn
    ? OPEN_ITEM_DELAY_MS + index * step
    : (count - 1 - index) * CLOSE_ITEM_STAGGER_MS;
  return {
    className: cn(
      "transition-[opacity,transform] ease-linear",
      animateIn ? "translate-y-0 opacity-100" : "translate-y-[10px] opacity-0",
    ),
    style: {
      transitionDuration: `${animateIn ? OPEN_ITEM_MS : CLOSE_ITEM_MS}ms`,
      transitionDelay: `${delay}ms`,
    },
  };
}

export function MainNavigation({
  tone = "light",
  service,
}: MainNavigationProps = {}) {
  const overlayId = useId();
  const pathname = usePathname();

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
    const timer = window.setTimeout(() => setRender(false), CLOSE_UNMOUNT_MS);
    return () => window.clearTimeout(timer);
  }, [open]);

  /*
    Lock the page while the overlay is open, and hold the layout still while it
    is locked.

    `overflow: hidden` takes the scrollbar away, and on any platform that draws
    a classic one rather than an overlay the page then widens by its width —
    everything jumps sideways as the menu arrives. The user: "it dissapears when
    the nav meu is opened but that causes things to shift and makes it look
    bad."

    So the gutter is measured at lock time and handed back: as padding on the
    body for everything in flow, and as a custom property the fixed nav reads,
    since a fixed element is laid out against the viewport and padding on the
    body cannot reach it. Both are zero on overlay-scrollbar platforms, so this
    costs nothing there.

    `scrollbar-gutter: stable` on `html` would also work and is less code — but
    it reserves that strip permanently, which measured 15px off the page width
    even when nothing is locked, moving `main-end` from 1390 to 1375 and undoing
    the nav's alignment with the source.
  */
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const gutter = window.innerWidth - root.clientWidth;
    const originalOverflow = document.body.style.overflow;
    const originalPadding = document.body.style.paddingRight;

    document.body.style.overflow = "hidden";
    if (gutter > 0) {
      document.body.style.paddingRight = `${gutter}px`;
      root.style.setProperty("--ng-lock-gutter", `${gutter}px`);
    }
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPadding;
      root.style.removeProperty("--ng-lock-gutter");
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

  // Per-column counters — see `staggerProps`. The service list and the link
  // column run side by side, each from its own 0.
  let serviceIndex = 0;

  return (
    <div className="navigationMain fixed inset-x-0 top-0 z-[1000] flex h-[100px] w-full items-center bg-transparent pr-[var(--ng-lock-gutter,0px)]">
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
          style={{ transitionDuration: `${WORDMARK_TONE_MS}ms` }}
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
              open
                ? "bg-white text-[#111111]"
                : "bg-[rgba(14,14,14,0.6)] text-white",
            )}
          >
            {/*
              Both labels sit absolutely in the same 44x24 box so the swap
              happens in place with zero layout shift.

              It is a DISPLAY swap, like the source's, not a cross-fade. The
              cross-fade this used to do put both words on screen together for
              150ms of its 300ms — "Menu" and "Close" overlapping into garble
              at exactly the moment the eye is on the button. The source flips
              `display` and the word is simply the other word on the next
              frame; nothing about the swap is meant to be seen.
            */}
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
                  "buttonMenu__textMenu absolute inset-0 items-center justify-center",
                  open ? "hidden" : "flex",
                )}
                aria-hidden={open}
              >
                Menu
              </span>
              <span
                className={cn(
                  "buttonMenu__textClose absolute inset-0 items-center justify-center",
                  open ? "flex" : "hidden",
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
          // `h-screen` with an animated `top`, not `inset-0`: the panel keeps
          // its full height and MOVES, exactly as the source's does. Pinning
          // both top and bottom would make `top` resize it instead.
          "navigationMain__dropDown fixed inset-x-0 h-screen overflow-y-auto",
          // The reference does not lay the menu on a flat scrim — the page
          // behind it is blurred out. Ours was `bg-black/80` alone, and at 0.8
          // the homepage hero was still legible straight through: "I build the
          // software that small companies actually run on" ran across the
          // service links and the scroll cue sat under the contact block. The
          // blur is what makes the ground quiet; the 70% black is what keeps
          // white type at contrast over whatever page is behind it.
          // The source's own ground, and it is stronger than what we had:
          // `rgba(0,0,0,0.8)` over `blur(35px)`, against our 0.7 over 24px.
          "bg-black/80 backdrop-blur-[35px]",
          render ? "block" : "hidden",
        )}
        style={{
          top: animateIn ? 0 : "100vh",
          transitionProperty: "top",
          transitionTimingFunction: animateIn
            ? OPEN_SLIDE_EASE
            : CLOSE_SLIDE_EASE,
          transitionDuration: `${animateIn ? OPEN_SLIDE_MS : CLOSE_SLIDE_MS}ms`,
          transitionDelay: `${animateIn ? OPEN_SLIDE_DELAY_MS : CLOSE_SLIDE_DELAY_MS}ms`,
        }}
      >
        {/*
          A column, not a three-up grid. The reference puts the service list
          across the left half at `font-XL`, the two link groups at ~64% across,
          and the contact record on the bottom edge — where ours had it in a
          third top-row column, "Web Development", "App Development" and
          "Cloud & Infrastructure" each wrapped onto two lines in a 376px track.
        */}
        {/*
          On the page grid, like the top bar. This carried its own paddings
          (15 / 30 / 40) inside a `max-w-[1440px]` box, which put the menu's
          content at x=40 where every other element on the site — the wordmark,
          the Menu button, every content block — sits on `main-start` at 50.
          Reading the grid instead of restating an inset means it cannot drift
          from them, and it tracks the 480px tier for free.
        */}
        <div className="ng-grid min-h-full w-full pb-[40px] pt-[100px]">
          <div className="col-start-[main-start] col-end-[main-end] flex min-h-full flex-col">
            {/* The hairline under the top bar. First thing in, so the panel reads
              as opening from the header rather than arriving all at once. */}
            <div
              aria-hidden="true"
              className={cn(
                // The source fades this to opacity 0.30; it does not wipe it.
                // A `scaleX` on a full-width child of a backdrop-blurred panel
                // is another thing the compositor has to re-blur per frame.
                "navigationMain__rule h-px w-full shrink-0 bg-white transition-opacity ease-linear",
                animateIn ? "opacity-30" : "opacity-0",
              )}
              style={{
                transitionDuration: `${animateIn ? OPEN_RULE_MS : CLOSE_RULE_MS}ms`,
                transitionDelay: `${animateIn ? OPEN_RULE_DELAY_MS : CLOSE_RULE_DELAY_MS}ms`,
              }}
            />

            <div className="mt-[40px] grid flex-1 auto-rows-min gap-x-[40px] gap-y-[48px] md:mt-[56px] lg:grid-cols-[1.5fr_1fr]">
              <ul
                className={cn(
                  "navigationMain__mainMenu flex flex-col gap-[10px]",
                  /*
                Hover one service and the others go soft. Measured on the
                source: the un-hovered links take `filter: blur(2px)` over 0.3s
                while the hovered one stays at `none`, and opacity does not move
                at all on any of them.

                Scoped to this list on purpose — hovering a service leaves the
                Explore/Company columns sharp, and hovering those blurs nothing.
                Verified both directions on the source.

                `:has()` is what lets the parent react to which child is
                hovered; the `_a:not(:hover)` half is "every link that is not the
                one under the cursor".
              */
                  "[&:has(a:hover)_a:not(:hover)]:blur-[2px]",
                )}
              >
                {/* The heading animates with its list — index 0 of this column. */}
                {(() => {
                  const props = staggerProps(
                    serviceIndex++,
                    animateIn,
                    SERVICE_COLUMN_COUNT,
                    OPEN_ITEM_STAGGER_MS,
                  );
                  return (
                    <li
                      className={cn(
                        "font-S mb-[8px] font-semibold text-white/50",
                        props.className,
                      )}
                      style={props.style}
                    >
                      Services
                    </li>
                  );
                })()}
                {SERVICE_LINKS.map((link) => {
                  const props = staggerProps(
                    serviceIndex++,
                    animateIn,
                    SERVICE_COLUMN_COUNT,
                    OPEN_ITEM_STAGGER_MS,
                  );
                  return (
                    <li
                      key={link.href}
                      className={props.className}
                      style={props.style}
                    >
                      <Link
                        href={link.href}
                        onClick={close}
                        aria-current={
                          isCurrentSection(pathname, link.href)
                            ? "page"
                            : undefined
                        }
                        className="font-XL flex items-center text-white transition-[filter] duration-300 ease-out"
                      >
                        {isCurrentSection(pathname, link.href) ? (
                          <CurrentDot />
                        ) : null}
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="navigationMain__subMenu flex flex-col gap-[40px] md:flex-row lg:flex-col lg:gap-[48px]">
                {/* One sequence across both groups, headings included — that is
                how the source orders this column. */}
                <NavGroupColumn
                  group={EXPLORE_GROUP}
                  startIndex={0}
                  animateIn={animateIn}
                  onNavigate={close}
                  pathname={pathname}
                />
                <NavGroupColumn
                  group={COMPANY_GROUP}
                  startIndex={EXPLORE_GROUP.items.length + 1}
                  animateIn={animateIn}
                  onNavigate={close}
                  pathname={pathname}
                />
              </div>
            </div>

            {/* The reference carries its offices on the bottom edge and its
              socials opposite them. There are no socials to render, so the
              single contact record sits alone on the right. */}
            {/* The source fades its offices in last, ~630ms after the columns
              start — it is the one element that arrives after the links have
              finished. */}
            <div
              className={cn(
                "navigationMain__contactOne mt-[48px] flex w-fit shrink-0 flex-col gap-[6px] transition-[opacity,transform] ease-linear lg:mt-0 lg:self-end",
                animateIn
                  ? "translate-y-0 opacity-100"
                  : "translate-y-[10px] opacity-0",
              )}
              style={{
                transitionDuration: `${animateIn ? OPEN_ITEM_MS : CLOSE_ITEM_MS}ms`,
                transitionDelay: `${animateIn ? OPEN_ITEM_DELAY_MS + OPEN_CONTACT_OFFSET_MS : 0}ms`,
              }}
            >
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
  pathname: string | null;
}

function NavGroupColumn({
  group,
  startIndex,
  animateIn,
  onNavigate,
  pathname,
}: NavGroupColumnProps) {
  const headingProps = staggerProps(
    startIndex,
    animateIn,
    LINK_COLUMN_COUNT,
    OPEN_LINK_STAGGER_MS,
  );
  return (
    <div className="flex flex-col gap-[10px]">
      <p
        className={cn(
          "font-S font-semibold text-white/50",
          headingProps.className,
        )}
        style={headingProps.style}
      >
        {group.title}
      </p>
      <ul className="flex flex-col gap-[8px]">
        {group.items.map((item, i) => {
          const props = staggerProps(
            startIndex + 1 + i,
            animateIn,
            LINK_COLUMN_COUNT,
            OPEN_LINK_STAGGER_MS,
          );
          return (
            <li key={item.href} className={props.className} style={props.style}>
              <Link
                href={item.href}
                onClick={onNavigate}
                aria-current={
                  isCurrentSection(pathname, item.href) ? "page" : undefined
                }
                className="font-M flex items-center text-white transition-opacity duration-300 ease-out hover:opacity-60"
              >
                {isCurrentSection(pathname, item.href) ? <CurrentDot /> : null}
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
        <ButtonLine
          label="E-mail"
          href={`mailto:${office.email}`}
          color="white"
          className="mt-[4px]"
        />
      ) : null}
    </>
  );
}
