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
 * The source's slate tone — a #d6d6d6 fill that drops away when the button is
 * disabled — isn't one of ButtonCircle's variants, so it comes in by class;
 * the rising #262626 hover disc is ButtonCircle's own `black` fill.
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
      className="rounded-full disabled:cursor-default"
    >
      <ButtonCircle
        asStatic
        label={label}
        className={cn("border-[#d6d6d6] text-[#262626]", !disabled && "bg-[#d6d6d6]", className)}
        icon={
          <ArrowIcon className={cn("h-[19px] w-[19px]", direction === "prev" && "rotate-180")} />
        }
      />
    </button>
  );
}
