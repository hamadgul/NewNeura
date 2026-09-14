import { ButtonCircle } from "@/components/site/shared/buttons";
import { ArrowIcon } from "@/components/site/shared/icons";
import { cn } from "@/lib/utils";

/**
 * The prev/next arrow chip every slider on the site shares. It began life as
 * `BlockImageSlider`'s private `NavButton` and moved here when
 * `BlockQuoteSlider` needed the same control.
 *
 * `ButtonCircle` renders a non-interactive span when it has no `href`, so the
 * real `<button>` wraps it (`asStatic` marks the visual chip `aria-hidden`).
 * The rising #262626 hover disc is ButtonCircle's own `black` fill.
 *
 * States, changed 2026-09-14. The source's convention was a #d6d6d6 fill on
 * the ENABLED chip that dropped to a bare outline when disabled, and the user
 * read it backwards on the phone ("the forward button is grayed out while the
 * back one is white even though this should be the opposite") — a filled
 * grey disc reads as "greyed out" to almost anyone. So now: enabled is the
 * outline chip with a dark arrow, the same chip every other `ButtonCircle`
 * on the site is; disabled fades the whole chip to 35% and drops the hover
 * disc (`pointer-events-none` on the button, so the `group-hover` never
 * fires). This is the shared control, so `/process/`'s image strip changed
 * with it.
 */
export function SliderNavButton({
  label,
  direction,
  disabled,
  onClick,
  className,
}: {
  label: string;
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
  /** The owning block's own hook class, e.g. `buttonCircle--blockImageSlider__arrow--prev`. */
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="rounded-full transition-opacity duration-300 disabled:pointer-events-none disabled:cursor-default disabled:opacity-35"
    >
      <ButtonCircle
        asStatic
        label={label}
        className={cn("border-[#d6d6d6] text-[#262626]", className)}
        icon={
          <ArrowIcon className={cn("h-[19px] w-[19px]", direction === "prev" && "rotate-180")} />
        }
      />
    </button>
  );
}
