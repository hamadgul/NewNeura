/**
 * Icons extracted verbatim from the lpas.com SVG sprite (`#sprite`).
 * Every path below is copied from the live document — do not redraw them.
 *
 * All icons except the logo and menu use a 19×19 viewBox and paint with
 * `currentColor`, so they inherit colour from their container.
 */
import type { SVGProps } from "react";

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
      <mask id="lpas-icon-eye" fill="#fff">
        <path d="M9.423 5c3.248 0 6.17 1.51 8.208 3.917a.901.901 0 0 1 0 1.166C15.593 12.491 12.671 14 9.423 14s-6.17-1.51-8.208-3.917a.901.901 0 0 1 0-1.166C3.253 6.51 6.175 5 9.423 5Z" />
      </mask>
      <path
        d="M9.423 5V4v1Zm0 9v1-1Zm8.208-5.083.763-.647-.763.647Zm0 1.166-.763-.646.763.646ZM9.423 5v1C12.349 6 15 7.358 16.868 9.563l.763-.646.763-.647C16.185 5.661 12.993 4 9.423 4v1Zm8.208 5.083-.763-.646C15.001 11.642 12.348 13 9.423 13v2c3.57 0 6.762-1.661 8.971-4.27l-.763-.647ZM9.423 14v-1c-2.926 0-5.578-1.358-7.445-3.563l-.763.646-.764.647C2.661 13.339 5.853 15 9.423 15v-1ZM1.215 8.917l.763.646C3.845 7.358 6.497 6 9.423 6V4C5.853 4 2.66 5.661.45 8.27l.764.647Zm0 1.166.763-.646c.03.036.03.09 0 .126l-.763-.646L.45 8.27a1.901 1.901 0 0 0 0 2.46l.764-.647ZM17.63 8.917l-.763.646a.099.099 0 0 1 0-.126l.763.646.763.647a1.901 1.901 0 0 0 0-2.46l-.763.647Z"
        fill="currentColor"
        mask="url(#lpas-icon-eye)"
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

/** `#icon-logo` — the LPAS wordmark. Native aspect ratio 78 × 26. */
export function LogoIcon(props: IconProps) {
  return (
    <svg fill="none" viewBox="0 0 78 26" role="img" aria-label="LPAS" {...props}>
      <path
        d="M2.516 23.907h14.276V26H0V.035h2.516v23.872ZM68.752 0c1.406 0 2.679.194 3.746.584 1.067.388 1.952.92 2.655 1.595a6.576 6.576 0 0 1 1.583 2.35c.353.89.527 1.84.527 2.845h-2.286c0-.937-.171-1.748-.51-2.436a4.611 4.611 0 0 0-1.39-1.68 6.016 6.016 0 0 0-2.005-.961 8.767 8.767 0 0 0-2.322-.309c-1.22 0-2.246.167-3.078.497-.832.331-1.496.76-1.988 1.287a4.32 4.32 0 0 0-1.02 1.749 4.103 4.103 0 0 0-.106 1.92c.14.8.468 1.439.985 1.92.515.48 1.149.874 1.9 1.183.75.309 1.577.56 2.479.754.902.194 1.823.4 2.762.617.938.218 1.846.475 2.725.77.88.298 1.659.697 2.339 1.2a5.578 5.578 0 0 1 1.636 1.937c.41.79.616 1.778.616 2.966 0 2.286-.809 4.059-2.428 5.316-1.618 1.256-3.894 1.886-6.824 1.886-1.313 0-2.532-.166-3.658-.497-1.126-.33-2.098-.833-2.92-1.508a6.935 6.935 0 0 1-1.915-2.505c-.457-.996-.687-2.165-.687-3.514h2.323l.002.008c.093 1.097.344 2.029.755 2.794a5.51 5.51 0 0 0 1.583 1.868c.645.48 1.39.83 2.233 1.046.843.218 1.746.326 2.709.326 1.126 0 2.098-.138 2.919-.413.82-.274 1.49-.645 2.006-1.114a4.362 4.362 0 0 0 1.142-1.629c.247-.617.37-1.269.37-1.954 0-.962-.224-1.738-.668-2.334a5.105 5.105 0 0 0-1.74-1.458c-.717-.377-1.537-.68-2.464-.909-.927-.229-1.876-.45-2.848-.669a32.416 32.416 0 0 1-2.849-.77 9.01 9.01 0 0 1-2.463-1.201 5.845 5.845 0 0 1-1.741-1.938c-.446-.789-.67-1.789-.67-3 0-.845.182-1.67.546-2.47.364-.8.902-1.508 1.619-2.126.716-.617 1.613-1.108 2.691-1.474C66.102.183 67.346 0 68.752 0ZM29.341.035c1.717 0 3.134.192 4.253.574 1.116.383 2.002.91 2.652 1.58a5.538 5.538 0 0 1 1.362 2.317c.258.874.387 1.789.387 2.746 0 1.436-.301 2.62-.902 3.554a6.614 6.614 0 0 1-2.34 2.209c-.956.537-2.043.914-3.258 1.13a20.885 20.885 0 0 1-3.664.324h-5.67v11.418h-2.507V.035h9.687Zm18.755 0 .798 2.085-5.192 13.57h10.385l.798 2.082h-12.03l-3.13 8.115h-2.578L47.569.035h.528ZM22.16 12.385h5.741c1.18 0 2.234-.07 3.168-.215.933-.144 1.725-.412 2.375-.808a4.051 4.051 0 0 0 1.511-1.615c.356-.682.534-1.575.534-2.675 0-1.628-.546-2.86-1.637-3.697-1.094-.837-2.83-1.257-5.211-1.257h-6.48v10.268Z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * `#icon-menu` — the hamburger. Two visible rules plus a third stacked
 * beneath the top one at `opacity: 0`; the theme animates the group to form
 * the close cross, so the markup keeps all three paths.
 */
export function MenuIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 29 29" fill="none" aria-hidden="true" {...props}>
      <path className="menuLineTwo" d="M4 18h21" stroke="currentColor" strokeLinecap="round" />
      <g className="menuLinesGroup" stroke="currentColor" strokeLinecap="round">
        <path className="menuLineOne" d="M4 11h21" />
        <path className="menuLineThree" d="M4 11h21" style={{ opacity: 0 }} />
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
