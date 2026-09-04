/**
 * The site's icon set. Every glyph uses a 19×19 viewBox and paints with
 * `currentColor`, so it inherits colour from its container — which is what
 * lets the same icon sit on the white ground of a project page and on the
 * #262626 ground of the footer without a second copy.
 */
import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

type IconProps = SVGProps<SVGSVGElement>;

/** `#icon-Arrow` — arrow pointing right, used by buttonArrow / "All projects". */
export function ArrowIcon(props: IconProps) {
  return (
    <svg fill="none" viewBox="0 0 19 19" aria-hidden="true" {...props}>
      <path
        d="m13.731 10.498-4.23 3.328M13.731 8.506l-4.23-3.328M10.5 9.5h-6"
        stroke="currentColor"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** `#icon-Chevron` — small chevron used by the hero sub-page links. */
export function ChevronIcon(props: IconProps) {
  return (
    <svg fill="none" viewBox="0 0 19 19" aria-hidden="true" {...props}>
      <path d="M11.23 10.498 7 13.826M11.23 8.506 7 5.178" stroke="currentColor" strokeLinecap="round" />
    </svg>
  );
}

/** `#icon-arrowOut` — diagonal "leaves the site" arrow. */
export function ArrowOutIcon(props: IconProps) {
  return (
    <svg fill="none" viewBox="0 0 19 19" aria-hidden="true" {...props}>
      <path
        d="M7.026 5.611h6.364v6.364M5.611 13.39l7.425-7.425"
        stroke="currentColor"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** `#icon-close` — menu close glyph. */
export function CloseIcon(props: IconProps) {
  return (
    <svg fill="none" viewBox="0 0 19 19" aria-hidden="true" {...props}>
      <path
        d="m14.096 4.904-9.192 9.192M14.096 14.096l-2.298-2.298-.884-.884m-6.01-6.01 2.298 2.298.884.884"
        stroke="currentColor"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** `#icon-eye` — "view" glyph. */
export function EyeIcon(props: IconProps) {
  return (
    <svg fill="none" viewBox="0 0 19 19" aria-hidden="true" {...props}>
      <mask id="ng-icon-eye" fill="#fff">
        <path d="M9.423 5c3.248 0 6.17 1.51 8.208 3.917a.901.901 0 0 1 0 1.166C15.593 12.491 12.671 14 9.423 14s-6.17-1.51-8.208-3.917a.901.901 0 0 1 0-1.166C3.253 6.51 6.175 5 9.423 5Z" />
      </mask>
      <path
        d="M9.423 5V4v1Zm0 9v1-1Zm8.208-5.083.763-.647-.763.647Zm0 1.166-.763-.646.763.646ZM9.423 5v1C12.349 6 15 7.358 16.868 9.563l.763-.646.763-.647C16.185 5.661 12.993 4 9.423 4v1Zm8.208 5.083-.763-.646C15.001 11.642 12.348 13 9.423 13v2c3.57 0 6.762-1.661 8.971-4.27l-.763-.647ZM9.423 14v-1c-2.926 0-5.578-1.358-7.445-3.563l-.763.646-.764.647C2.661 13.339 5.853 15 9.423 15v-1ZM1.215 8.917l.763.646C3.845 7.358 6.497 6 9.423 6V4C5.853 4 2.66 5.661.45 8.27l.764.647Zm0 1.166.763-.646c.03.036.03.09 0 .126l-.763-.646L.45 8.27a1.901 1.901 0 0 0 0 2.46l.764-.647ZM17.63 8.917l-.763.646a.099.099 0 0 1 0-.126l.763.646.763.647a1.901 1.901 0 0 0 0-2.46l-.763.647Z"
        fill="currentColor"
        mask="url(#ng-icon-eye)"
      />
      <circle cx="9.501" cy="8" r="2.5" stroke="currentColor" />
    </svg>
  );
}

/** `#icon-insta` — Instagram mark. */
export function InstagramIcon(props: IconProps) {
  return (
    <svg fill="none" viewBox="0 0 19 19" aria-hidden="true" {...props}>
      <path d="M11.776 6.564a.66.66 0 1 1 1.32 0 .66.66 0 0 1-1.32 0Z" fill="currentColor" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.008 9.586a2.578 2.578 0 1 1 5.156 0 2.578 2.578 0 0 1-5.156 0Zm4.25 0a1.66 1.66 0 1 1-3.321 0 1.66 1.66 0 0 1 3.322 0Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.5 4c-1.493 0-1.68.007-2.267.033-.586.027-.986.12-1.335.256-.362.14-.669.328-.975.634a2.7 2.7 0 0 0-.634.974c-.137.35-.23.75-.256 1.335C4.007 7.819 4 8.006 4 9.5c0 1.494.007 1.68.033 2.267.027.586.12.985.256 1.335.14.362.328.669.634.974.306.306.613.495.974.635.35.136.75.229 1.335.256.587.026.774.033 2.268.033 1.494 0 1.68-.007 2.267-.033.586-.027.986-.12 1.336-.256.361-.14.668-.329.973-.635.306-.305.494-.612.635-.974.136-.35.228-.75.256-1.335.026-.586.033-.773.033-2.267 0-1.494-.007-1.681-.033-2.268-.028-.585-.12-.985-.256-1.335a2.698 2.698 0 0 0-.635-.974 2.687 2.687 0 0 0-.974-.634c-.35-.136-.75-.229-1.336-.256C11.18 4.007 10.993 4 9.5 4H9.5Zm-.183.991h.184c1.468 0 1.642.005 2.222.032.536.024.827.114 1.021.19.257.099.44.218.632.41.193.193.312.376.412.633.075.194.165.485.19 1.021.026.58.031.754.031 2.222 0 1.467-.005 1.642-.032 2.221-.024.537-.114.828-.19 1.021a1.7 1.7 0 0 1-.41.632 1.702 1.702 0 0 1-.633.412c-.193.075-.485.165-1.021.19-.58.026-.754.031-2.222.031-1.47 0-1.643-.005-2.223-.032-.536-.025-.827-.114-1.021-.19-.257-.1-.44-.218-.633-.41a1.704 1.704 0 0 1-.411-.633c-.076-.194-.165-.485-.19-1.021-.026-.58-.031-.754-.031-2.223 0-1.468.005-1.642.031-2.221.025-.537.114-.828.19-1.022.1-.256.219-.44.411-.632.193-.193.376-.312.633-.412.194-.075.485-.165 1.021-.19.507-.022.704-.03 1.73-.03v.001h.31Z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * The NeuraGul wordmark.
 *
 * Set in type rather than drawn as an SVG on purpose: it has to sit over the
 * hero video in white and in the footer on #262626, and type inheriting
 * `currentColor` does that with no second asset. `Gul` carries the lighter
 * weight, which is the split the source site's `Neura<span>Gul</span>` brand
 * mark uses.
 *
 * Size it from the outside with a `text-*` class; the tracking and weights
 * below are relative to whatever font-size lands on it.
 */
export function Wordmark({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "select-none font-semibold leading-none tracking-[-0.02em] whitespace-nowrap",
        className,
      )}
      {...props}
    >
      Neura<span className="font-light">Gul</span>
    </span>
  );
}

/*
  The menu mark's morph into the close cross, measured off the source by
  sampling every 16ms across a click:

    .menuLineTwo     rotate 0 -> -45deg   about (8.828, 20)
    .menuLinesGroup  rotate 0 -> +45deg   about (8.828, 9)
    .menuLineThree   opacity 0 -> 1, in lockstep with the rotation

  Both origins were solved from the endpoints the source lands on rather than
  guessed: its two lines finish at (4,22)->(18.85,7.15) and (4,7)->(18.85,21.85),
  one X anchored at x=4 spanning 15 units. `transform-box: view-box` is what
  makes a px transform-origin mean user units inside the 29x29 viewBox.

  500ms on `cubic-bezier(0.44, 0.74, 0.7, 1)`, fitted to nine sampled points of
  the source's rotation (rms 0.006 of the 45deg sweep).
*/
const MENU_LINE_TIMING = "duration-500 ease-[cubic-bezier(0.44,0.74,0.7,1)]";
const MENU_LINE_TRANSITION = `transition-transform ${MENU_LINE_TIMING}`;

/**
 * `#icon-menu` — the hamburger, which morphs into the close cross when `open`.
 * Two visible rules plus a third stacked under the top one at `opacity: 0`.
 */
export function MenuIcon({ open = false, ...props }: IconProps & { open?: boolean }) {
  return (
    <svg viewBox="0 0 29 29" fill="none" aria-hidden="true" {...props}>
      <path
        className={cn("menuLineTwo [transform-box:view-box]", MENU_LINE_TRANSITION)}
        style={{ transformOrigin: "8.828px 20px", transform: open ? "rotate(-45deg)" : "none" }}
        d="M4 18h21"
        stroke="currentColor"
        strokeLinecap="round"
      />
      <g
        className={cn("menuLinesGroup [transform-box:view-box]", MENU_LINE_TRANSITION)}
        style={{ transformOrigin: "8.828px 9px", transform: open ? "rotate(45deg)" : "none" }}
        stroke="currentColor"
        strokeLinecap="round"
      >
        <path className="menuLineOne" d="M4 11h21" />
        {/*
          Identical to menuLineOne and inside the same rotating group, so it
          lands exactly on top of it — it is not a third arm of the cross. The
          source fades it in across the morph anyway; kept so this icon's DOM
          and behaviour stay one-to-one with the source's.
        */}
        <path
          className={cn("menuLineThree transition-opacity", MENU_LINE_TIMING)}
          d="M4 11h21"
          style={{ opacity: open ? 1 : 0 }}
        />
      </g>
    </svg>
  );
}

/** `#icon-plus` — the circular "+" affordance on hero cards and the H1. */
export function PlusIcon(props: IconProps) {
  return (
    <svg fill="none" viewBox="0 0 19 19" aria-hidden="true" {...props}>
      <path d="M16 9.5H3M9.5 16v-4m0-9v4" stroke="currentColor" strokeLinecap="round" />
    </svg>
  );
}
