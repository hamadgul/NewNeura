"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { SERVICE_TONE } from "./blocks/BlockHeaderServices";
import type { ServiceHeaderTone } from "./blocks/BlockHeaderServices";
import type { ServiceSlug } from "@/types/site";

/**
 * "Shift your focus" — the accent strip beside the Menu button on a service
 * page. The current service reads as a named pill; the other four are 20px
 * swatches of their own accent. Hovering (or tabbing to) a swatch opens it and
 * closes whichever was open, so the strip's overall width never changes.
 *
 * Measured off the source's `.marketsMenu` at 1440x900:
 *
 *   label       14px, colour follows the PAGE tone, like the wordmark
 *   nav         10px of padding either side of the strip
 *   strip       29px tall, 4px padding, radius 6px, rgba(14,14,14,0.6)
 *   item        21px tall; 20px closed; first/last carry a 4px outer radius
 *   title       centred, colour follows THAT accent's tone, not the page's
 *   open/close  ~470ms, fitted to an ease-out quad (exponent 2.05 over eight
 *               sampled frames)
 *   title fade  `opacity 0.3s ease-in-out 0.3s` — the delay is what stops the
 *               text appearing before its box has opened
 *
 * Below 768 the source hides it outright (measured: `display: none` at 767,
 * `flex` at 768). There is no room for it beside the Menu button and no
 * collapsed form of it — so this is `hidden md:flex`, not a reflow.
 */

/** The order the accents are declared in, which is also the filter row's. */
const SERVICES: Array<{ slug: ServiceSlug; label: string; ground: string }> = [
  { slug: "applied-ai", label: "Applied AI", ground: "bg-ng-applied-ai" },
  { slug: "web-development", label: "Web Development", ground: "bg-ng-web-development" },
  { slug: "app-development", label: "App Development", ground: "bg-ng-app-development" },
  {
    slug: "cloud-infrastructure",
    label: "Cloud & Infrastructure",
    ground: "bg-ng-cloud-infrastructure",
  },
  { slug: "data-intelligence", label: "Data Intelligence", ground: "bg-ng-data-intelligence" },
];

/**
 * Width of the open pill.
 *
 * The source's is 130px, sized to hold "Higher  Education" (107.1px at 14px) —
 * 11.5px of air either side. Ours has to hold "Cloud & Infrastructure", which
 * measures 140.8px, so 130 would have clipped it silently, the way every other
 * measured slot on this site has when it met these longer names. 164px is that
 * label plus the source's own 11.5px either side.
 *
 * Fixed rather than `fit-content` on purpose: the strip's total width has to
 * stay constant as the open pill moves between items, or the label beside it
 * would jump on every hover. **Re-measure if a service is ever renamed.**
 */
const OPEN_WIDTH = 164;
const SWATCH_WIDTH = 20;

/** Fitted to the source: ~470ms, ease-out with an exponent of ~2.05. */
const WIDTH_TRANSITION = "transition-[width] duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]";

export function ServicesMenu({ current, tone }: { current: ServiceSlug; tone: ServiceHeaderTone }) {
  // `null` means "nothing is being pointed at", which is when the current
  // service is the open one. Held in state rather than done with `:hover` and
  // `:has()` so that keyboard focus opens a swatch too — a CSS-only version
  // reaches the same look but leaves the strip unreadable to anyone tabbing.
  const [active, setActive] = useState<ServiceSlug | null>(null);
  const open = active ?? current;

  return (
    <div className="servicesMenu hidden h-[30px] items-center md:flex">
      <span
        className={cn(
          "servicesMenu__text font-S whitespace-nowrap",
          tone === "dark" ? "text-[#262626]" : "text-white",
        )}
      >
        Shift your focus
      </span>

      <nav aria-label="Other services" className="px-[10px]">
        <ul className="servicesMenu__wrapper flex h-[29px] items-center rounded-[6px] bg-[rgba(14,14,14,0.6)] p-[4px] backdrop-blur-[5px]">
          {SERVICES.map(({ slug, label, ground }) => {
            const isOpen = slug === open;
            return (
              <li
                key={slug}
                className={cn(
                  "servicesMenu__item h-[21px] shrink-0 overflow-hidden first:rounded-l-[4px] last:rounded-r-[4px]",
                  ground,
                  WIDTH_TRANSITION,
                )}
                style={{ width: isOpen ? OPEN_WIDTH : SWATCH_WIDTH }}
              >
                <Link
                  href={`/services/${slug}/`}
                  className="flex h-full w-full items-center justify-center"
                  // The swatches carry no visible text, so each link needs its
                  // own name — the title span is not a substitute while it is
                  // clipped and transparent.
                  aria-label={label}
                  aria-current={slug === current ? "page" : undefined}
                  onMouseEnter={() => setActive(slug)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(slug)}
                  onBlur={() => setActive(null)}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "servicesMenu__itemTitle font-S whitespace-nowrap transition-opacity delay-300 duration-300 ease-in-out",
                      // Each accent's own contrast call, not the page's: a
                      // swatch keeps its type colour whichever page it is seen
                      // from.
                      SERVICE_TONE[slug] === "dark" ? "text-[#262626]" : "text-white",
                      isOpen ? "opacity-100" : "opacity-0",
                    )}
                  >
                    {label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
