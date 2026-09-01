/**
 * Shared button primitives, ported 1:1 from the lpas.com theme stylesheet.
 *
 * Source rem values are converted to px at the site's 10px root
 * (`html { font-size: 62.5% }`), e.g. `2.7rem` → `27px`.
 */
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ArrowIcon, PlusIcon } from "./icons";

/* ------------------------------------------------------------------ *
 * ButtonArrow
 *
 * A label with a hairline underline plus a circular arrow chip. On hover the
 * chip widens from a 27px circle to a 37px pill and the two stacked arrows
 * slide as a pair: the first exits right, the second enters from the left on
 * a 0.3s delay, so the glyph appears to be replaced rather than moved.
 * ------------------------------------------------------------------ */

type ArrowColor = "default" | "slate" | "white";

interface ButtonArrowProps {
  title?: string;
  href?: string;
  /** `left` mirrors the layout and flips the chip 180°. */
  direction?: "right" | "left";
  color?: ArrowColor;
  /** Transparent chip with a white glyph — used over imagery. */
  border?: boolean;
  className?: string;
  /** Renders a `<span>` instead of a link/button, for use inside another anchor. */
  asStatic?: boolean;
  onClick?: () => void;
  "aria-label"?: string;
}

const arrowChipColor: Record<ArrowColor, string> = {
  default: "bg-white text-[#111111] border-white",
  slate: "bg-[#d6d6d6] text-[#262626] border-[#d6d6d6]",
  white: "bg-white text-[#262626] border-white",
};

export function ButtonArrow({
  title,
  href,
  direction = "right",
  color = "default",
  border = false,
  className,
  asStatic = false,
  onClick,
  "aria-label": ariaLabel,
}: ButtonArrowProps) {
  const content = (
    <>
      {title ? (
        <span className="button__title -mb-[10px] whitespace-nowrap border-b border-[#d6d6d6] pb-[5px]">
          {title}
        </span>
      ) : null}
      <span
        className={cn(
          // group-hover widens the chip; `overflow-hidden` is what clips the sliding arrows
          "button__arrow relative -mb-[5px] flex h-[27px] max-h-[27px] w-[27px] items-center justify-center overflow-hidden rounded-full border transition-[width,border-radius] duration-300 ease-out",
          "group-hover:w-[37px] group-hover:rounded-[13.5px]",
          border ? "border-white bg-transparent text-white" : arrowChipColor[color],
          direction === "left" && "rotate-180",
        )}
      >
        {/* Arrow 1 starts centred and slides out to the right. */}
        <ArrowIcon className="absolute left-1/2 top-1/2 h-[19px] w-[19px] -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 ease-out group-hover:translate-x-[25%]" />
        {/* Arrow 2 waits off to the left and slides in 0.3s later. */}
        <ArrowIcon className="absolute left-1/2 top-1/2 h-[19px] w-[19px] -translate-x-[225%] -translate-y-1/2 transition-transform delay-300 duration-300 ease-out group-hover:-translate-x-1/2" />
      </span>
    </>
  );

  const classes = cn(
    "buttonArrow group flex h-fit w-fit cursor-pointer flex-row items-center justify-center gap-[7px] bg-transparent",
    border || color === "white" ? "text-white" : "text-[#262626]",
    direction === "left" && "flex-row-reverse",
    className,
  );

  if (asStatic) {
    return (
      <span className={classes} aria-hidden={title ? undefined : true}>
        {content}
      </span>
    );
  }

  if (href) {
    return (
      <Link href={href} className={classes} aria-label={ariaLabel ?? title}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes} aria-label={ariaLabel ?? title}>
      {content}
    </button>
  );
}

/* ------------------------------------------------------------------ *
 * ButtonCircle
 *
 * An outlined circle whose fill wipes up from below on hover: the background
 * layer sits at `top: 100%` and animates to `top: 0` while its radius relaxes
 * from a circle to 25%, so the fill arrives as a rising disc.
 * ------------------------------------------------------------------ */

interface ButtonCircleProps {
  href?: string;
  /** `market` paints from `--marketContentColor`, inherited from the card. */
  color?: "black" | "white" | "market";
  className?: string;
  icon?: ReactNode;
  label: string;
  asStatic?: boolean;
  /** For scrubbed values the hero drives per frame (opacity across the pin). */
  style?: CSSProperties;
}

export function ButtonCircle({
  href,
  color = "black",
  className,
  icon,
  label,
  asStatic = false,
  style,
}: ButtonCircleProps) {
  const tone =
    color === "white"
      ? "text-white border-white hover:text-[#262626]"
      : color === "market"
        ? "text-(--marketContentColor) border-(--marketContentColor) hover:text-(--marketMainColor)"
        : "text-[#262626] border-[#262626] hover:text-white";

  const fill =
    color === "white"
      ? "bg-white"
      : color === "market"
        ? "bg-(--marketContentColor)"
        : "bg-[#262626]";

  const content = (
    <>
      <span
        aria-hidden="true"
        className={cn(
          "buttonCircle__background pointer-events-none absolute inset-x-0 bottom-0 top-full z-[1] rounded-full transition-all duration-300 [transition-timing-function:cubic-bezier(0,0,0.13,0.99)]",
          "group-hover:top-0 group-hover:rounded-[25%]",
          fill,
        )}
      />
      <span className="relative z-[2] flex items-center">
        {icon ?? <PlusIcon className="h-[19px] w-[19px]" />}
      </span>
    </>
  );

  const classes = cn(
    "buttonCircle group relative flex h-fit w-fit items-center overflow-hidden rounded-full border border-solid bg-transparent p-[12px] transition-colors duration-300",
    tone,
    className,
  );

  if (asStatic) {
    return (
      <span className={classes} style={style} aria-hidden="true">
        {content}
      </span>
    );
  }

  if (href) {
    return (
      <Link href={href} className={classes} style={style} aria-label={label}>
        {content}
      </Link>
    );
  }

  return (
    <span className={classes} style={style} aria-label={label}>
      {content}
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * ButtonLine
 *
 * A label over a 1px rule built from two stacked bars. On hover bar one exits
 * right and bar two enters from the left 0.3s later — the same relay as the
 * arrow chip, so the underline reads as redrawn rather than slid.
 * ------------------------------------------------------------------ */

interface ButtonLineProps {
  label: string;
  href?: string;
  color?: "dark" | "white";
  className?: string;
  external?: boolean;
}

export function ButtonLine({ label, href, color = "dark", className, external }: ButtonLineProps) {
  const bar = color === "white" ? "bg-white" : "bg-[#262626]";

  const content = (
    <>
      <span className="font-S">{label}</span>
      <span className="buttonLine__line relative mt-[3px] h-px w-full overflow-hidden">
        <span
          className={cn(
            "buttonLine__line--one absolute h-px w-full transition-all duration-300 group-hover:translate-x-[105%]",
            bar,
          )}
        />
        <span
          className={cn(
            "buttonLine__line--two absolute h-px w-full -translate-x-[105%] transition-all delay-300 duration-300 group-hover:translate-x-0",
            bar,
          )}
        />
      </span>
    </>
  );

  const classes = cn(
    "buttonLine group flex h-fit w-fit flex-col bg-transparent transition-all duration-300 [transition-timing-function:cubic-bezier(0,0,0.13,0.99)]",
    color === "white" ? "text-white" : "text-[#262626]",
    className,
  );

  if (!href) {
    return <span className={classes}>{content}</span>;
  }

  return (
    <Link
      href={href}
      className={classes}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      {content}
    </Link>
  );
}
