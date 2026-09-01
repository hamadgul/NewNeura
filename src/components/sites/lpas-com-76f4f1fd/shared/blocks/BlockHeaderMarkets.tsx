/**
 * `BlockHeaderMarkets` — the hero header shared by all nine market pages.
 *
 * Two content variants, both measured from `getComputedStyle()` at 1440px and
 * re-checked against the 390px screenshots:
 *
 *  - **Parent market** (`/markets/housing/`): an "Our focus on" eyebrow, a
 *    right-aligned descriptor, a `font-3XL` title and — for Housing only — a
 *    grid of child links. The other four markets have no children at all, so
 *    the sub-nav must disappear entirely rather than reserve space.
 *  - **Child page** (`/markets/housing/affordable-housing/`): the eyebrow is
 *    replaced by a "Back to <parent>" link, the descriptor becomes the page
 *    tagline, the title steps down to `font-XXL`, and the same sibling list is
 *    rendered with the current page flagged by a leading dot.
 *
 * Everything else — geometry, the 50% image scrim, the scroll cue — is
 * identical across all nine pages, which is why only content arrives as props.
 *
 * The source also runs a GSAP entrance (each element carries an identity
 * `transform`, the title an identity `filter: blur()`) and a page-transition
 * curtain (`__imageTransition`, parked at `translateY(-100%)` and therefore
 * never visible at rest). Neither is reproduced: this block is above the fold,
 * so it renders in its settled state and stays a server component.
 */
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { MarketSlug } from "@/types/lpas";
import { ButtonCircle } from "../buttons";
import { ArrowIcon, ChevronIcon } from "../icons";

/** Text/icon tone painted on the market ground. */
export type MarketHeaderTone = "light" | "dark";

export interface MarketHeaderImage {
  /** Local path, e.g. `/sites/lpas-com-76f4f1fd/<page-key>/images/foo.webp`. */
  src: string;
  /** Natural dimensions — CSS sizes the element, these only set the ratio. */
  width: number;
  height: number;
  /** The source ships this decorative, so it defaults to empty. */
  alt?: string;
}

export interface MarketSubPageLink {
  title: string;
  href: string;
  /** The page currently being viewed — gets the leading dot marker. */
  current?: boolean;
}

export interface BlockHeaderMarketsProps {
  /**
   * Which accent paints the ground. Child pages pass their *parent's* market,
   * which is why this is a market slug rather than the page's own slug.
   */
  market: MarketSlug;
  /**
   * Foreground treatment. `--lpas-highered` and `--lpas-commercial` are light
   * grounds and take dark type; the other three take white. Defaults per
   * market, so callers only pass this to override.
   */
  tone?: MarketHeaderTone;
  title: string;
  /**
   * Title type scale. The source steps parent markets down from 75px to 56px
   * on child pages, so this defaults to `XXL` whenever `backLink` is present.
   */
  titleSize?: "3XL" | "XXL";
  /** Parent markets only: the "Our focus on" eyebrow. Superseded by `backLink`. */
  eyebrow?: string;
  /** Right-aligned descriptor — the market subtitle, or the child page tagline. */
  subtitle?: string;
  /** Child pages only: replaces the eyebrow with a link up to the parent market. */
  backLink?: { label: string; href: string };
  /** Children (on a parent) or siblings (on a child). Empty for four of five markets. */
  subPages?: MarketSubPageLink[];
  image: MarketHeaderImage;
  /**
   * `id` of the section below. When given, the scroll cue becomes a real
   * in-page anchor; otherwise it renders as the source's decorative circle.
   */
  scrollTargetId?: string;
  className?: string;
}

/**
 * Accent grounds. Written out rather than interpolated so Tailwind's scanner
 * can see every class, and because `higher-education` maps to the shorter
 * `--lpas-highered` token name declared in `globals.css`.
 */
const MARKET_GROUND: Record<MarketSlug, string> = {
  housing: "bg-lpas-housing",
  interiors: "bg-lpas-interiors",
  "higher-education": "bg-lpas-highered",
  civic: "bg-lpas-civic",
  commercial: "bg-lpas-commercial",
};

/** Measured per page: white on the three dark grounds, #262626 on the two light ones. */
const MARKET_TONE: Record<MarketSlug, MarketHeaderTone> = {
  housing: "light",
  interiors: "light",
  civic: "light",
  "higher-education": "dark",
  commercial: "dark",
};

/** The source's shared easing for hover transitions. */
const EASE = "[transition-timing-function:cubic-bezier(0,0,0.13,0.99)]";

export function BlockHeaderMarkets({
  market,
  tone,
  title,
  titleSize,
  eyebrow,
  subtitle,
  backLink,
  subPages = [],
  image,
  scrollTargetId,
  className,
}: BlockHeaderMarketsProps) {
  const resolvedTone = tone ?? MARKET_TONE[market];
  const isDark = resolvedTone === "dark";
  const resolvedTitleSize = titleSize ?? (backLink ? "XXL" : "3XL");

  return (
    <header
      data-control="BlockHeaderMarkets"
      className={cn(
        "blockHeaderMarkets lpas-grid",
        /*
          Measured 500px + 630px at a 1440x900 viewport and 500px + 591px at
          390x844 — i.e. a fixed content band over an image band that is
          exactly 70% of the viewport height at both sizes.
        */
        "grid-rows-[500px_70vh]",
        MARKET_GROUND[market],
        isDark ? "text-[#262626]" : "text-white",
        className,
      )}
    >
      <div
        className={cn(
          "blockHeaderMarkets__content col-start-1 col-end-[-1] row-start-1 grid grid-cols-subgrid py-[35px]",
          /*
            Desktop rows: 202.094 / 25.797 / 202.094 inside the 430px content
            box. The middle row is fixed at 6% (25.8px) rather than auto — a
            two-line descriptor such as "Architecture for academic community"
            spills out of it instead of pushing the eyebrow up, which is what
            keeps the eyebrow at the same y on every market page.

            Mobile stacks the sub-nav under the label row, so it takes a fourth
            row; 109px is the measured distance from the content box top to the
            top of the label row at 390px.
          */
          "grid-rows-[109px_6%_auto_1fr] md:grid-rows-[1fr_6%_1fr]",
        )}
      >
        {backLink ? (
          /*
            The back link is pulled 5px left so the chevron's optical edge, not
            its 19px box, lands on the column line. Hovering opens the gap
            between glyph and label — the source transitions `gap` alone.
          */
          <Link
            href={backLink.href}
            className={cn(
              "blockHeaderMarkets__contentLabel blockHeaderMarkets__contentLabel--back font-S",
              "col-start-2 col-end-5 row-start-2 -ml-[5px] flex items-center gap-[5px]",
              "transition-[gap] duration-300 hover:gap-[10px]",
              EASE,
            )}
          >
            <ChevronIcon className="h-[19px] w-[19px] shrink-0 rotate-180" />
            {backLink.label}
          </Link>
        ) : eyebrow ? (
          <span className="blockHeaderMarkets__contentLabel font-S col-start-2 col-end-5 row-start-2">
            {eyebrow}
          </span>
        ) : null}

        {subtitle ? (
          <span className="blockHeaderMarkets__contentSubtitle font-S col-start-[-5] col-end-[-2] row-start-2 text-right">
            {subtitle}
          </span>
        ) : null}

        {subPages.length > 0 ? (
          <div
            className={cn(
              "blockHeaderMarkets__subpagesWrapper col-start-2 col-end-5 row-start-3 flex justify-between",
              // 23px clears the label row's second line on mobile; on desktop
              // the list is bottom-aligned with the title in the same row.
              "mt-[23px] md:col-start-8 md:col-end-[14] md:mt-0 md:self-end md:justify-self-start",
            )}
          >
            <nav className="w-full md:w-auto">
              <ul
                className={cn(
                  "blockHeaderMarkets__subpagesList grid grid-cols-1 gap-y-[10px]",
                  "md:grid-cols-[136px_136px] md:gap-x-[40px] md:gap-y-[15px]",
                )}
              >
                {subPages.map((page) => (
                  <SubPageItem key={page.href} page={page} />
                ))}
              </ul>
            </nav>
          </div>
        ) : null}

        <div
          className={cn(
            "blockHeaderMarkets__title col-start-2 col-end-5 row-start-4 flex items-end",
            "md:col-end-7 md:row-start-3",
          )}
        >
          <h1 className={resolvedTitleSize === "XXL" ? "font-XXL" : "font-3XL"}>{title}</h1>
        </div>

        <div
          className={cn(
            "blockHeaderMarkets__button col-start-2 col-end-[-2] row-start-4 flex self-end justify-self-end",
            "md:col-start-[-3] md:row-start-3",
          )}
        >
          <ButtonCircle
            href={scrollTargetId ? `#${scrollTargetId}` : undefined}
            color={isDark ? "black" : "white"}
            label="Scroll to content"
            // The source rotates the shared arrow 90° rather than shipping a
            // separate down glyph.
            icon={<ArrowIcon className="h-[19px] w-[19px] rotate-90" />}
          />
        </div>
      </div>

      <div className="blockHeaderMarkets__imageWrapper relative col-start-1 col-end-[-1] row-start-2 overflow-hidden">
        {/*
          Verified by sampling: every rendered pixel is exactly half the source
          image's value, so the scrim is a flat rgba(0,0,0,.5) above the photo.
        */}
        <div
          aria-hidden="true"
          className="blockHeaderMarkets__imageOverlay absolute inset-0 z-[1] bg-black/50"
        />
        {/*
          The image is 115% of the band's height and anchored to its top, so a
          centred `object-fit: cover` crop is then itself cropped from below.
          Reproducing both steps is what puts the horizon where the source has
          it; a plain `h-full` frames the photo ~47px lower.
        */}
        <Image
          src={image.src}
          alt={image.alt ?? ""}
          width={image.width}
          height={image.height}
          priority
          sizes="100vw"
          className="image blockHeaderMarkets__image absolute inset-x-0 top-0 h-[115%] w-full object-cover"
        />
      </div>
    </header>
  );
}

/**
 * One link in the sub-market list: label, right-hand chevron, and a hairline
 * that redraws on hover.
 *
 * The rule is `ButtonLine`'s two-bar relay (bar one exits right, bar two
 * enters from the left 0.3s later) rather than the component itself, because
 * this variant sits 8px under the label instead of 3px — reusing `ButtonLine`
 * would shorten each row to 22.9px and lift the whole 71px block off the
 * title's baseline. The bars paint with `bg-current` so they follow the
 * header's tone without re-declaring the palette.
 */
function SubPageItem({ page }: { page: MarketSubPageLink }) {
  return (
    <li className="blockHeaderMarkets__subpageItem relative w-full md:w-[146px]">
      <Link
        href={page.href}
        className="buttonLine group flex flex-col"
        aria-current={page.current ? "page" : undefined}
      >
        {/*
          The chevron is taken out of flow so the row keeps the 18.9px font-S
          line box; in flow its 19px height would set the row instead. The item
          is 146px wide against a 136px column for exactly this reason — the
          longest label, "Market Rate Housing", runs to within a few px of the
          chevron and must not wrap.
        */}
        <span className="font-S relative block whitespace-nowrap">
          {page.current ? (
            <span
              aria-hidden="true"
              className="absolute -left-[10px] top-1/2 h-[5px] w-[5px] -translate-y-1/2 rounded-full bg-current"
            />
          ) : null}
          {page.title}
          <ChevronIcon className="absolute right-0 top-1/2 h-[19px] w-[19px] -translate-y-1/2" />
        </span>
        <span className="buttonLine__line relative mt-[8px] h-px w-full overflow-hidden">
          <span className="buttonLine__line--one absolute h-px w-full bg-current transition-all duration-300 group-hover:translate-x-[105%]" />
          <span className="buttonLine__line--two absolute h-px w-full -translate-x-[105%] bg-current transition-all delay-300 duration-300 group-hover:translate-x-0" />
        </span>
      </Link>
    </li>
  );
}
