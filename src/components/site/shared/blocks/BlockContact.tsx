/**
 * BlockContact — the whole of `/contact/`.
 *
 * One dark section (`rgb(38,38,38)` = `--ng-dark`) that carries the page's
 * `<h1>`, the contact record, a lead line with an arrow chip, and one
 * full-width image. No other block renders on that route.
 *
 * The layout this is adapted from carried two office blocks and a socials row
 * between the rule and the lead. NeuraGul has one location and no social
 * accounts, so both are gone: the second contact column now holds the
 * response-time record, and the row the socials occupied is not rendered.
 *
 * Grid math — every child is placed on `.ng-grid`'s numeric lines, measured
 * from GRID_AREAS.json at 1440 / 768 / 390. `.ng-grid` puts `main-start` on
 * line 2 and `main-end` on line -2 at every tier, so only the inner splits
 * change per breakpoint:
 *
 *   ≥1280 (20 cols, 57.5px tracks + 10px gap):
 *     title   2 / 8    → 395px      contactOne  12 / 15
 *     line    2 / -2   → 1340px     contactTwo  17 / 20  (192.5px)
 *     textField 12 / 18 → 395px     image       2 / -2   → 1340px
 *     Rows: [title+contacts 158.9] [line 91] [textField 139.8] [image 296.3]
 *
 *   768 (12 cols): title/line/textField/image all span main; the two records
 *     split 2 / -6 (455px) and -6 / -3 (165px). Rows stack 1-5.
 *
 *   390 (4 cols): same, records split 2 / 4 and 4 / -2 (165px each) and the
 *     image goes full-bleed on 1 / -1. Rows stack 1-5.
 *
 * The section is a server component: every interaction here is a CSS hover on
 * `ButtonLine` / `ButtonArrow`, so there is nothing to hydrate.
 *
 * Colour: the source's font classes declare `color: inherit`; ours deliberately
 * don't (see BUILDER_CONVENTIONS trap #3 — a custom class lands after the
 * utility layer and would beat every `text-*` here), so the muted greys below
 * are set with utilities: `text-[#a3a3a3]` = the measured rgb(163,163,163).
 */
import Image from "next/image";
import { ButtonArrow, ButtonLine } from "@/components/site/shared/buttons";
import { cn } from "@/lib/utils";
import type { OfficeContact } from "@/types/site";

export interface BlockContactProps {
  /** `<h1>` text. The source renders "Contact". */
  heading?: string;
  /**
   * Small label above the heading. The source ships the element but leaves it
   * empty (measured 395×0), so it is only rendered when a string is supplied.
   */
  tagline?: string;
  /**
   * Contact records, rendered left to right. One or two; the second column
   * collapses when only one is supplied.
   */
  offices: OfficeContact[];
  /**
   * The lead line under the rule: muted opening, white highlight, and the
   * target the whole sentence links to (a `mailto:` here).
   */
  lead: { text: string; highlight: string; href: string };
  image: { src: string; alt: string; width: number; height: number };
  className?: string;
}

export function BlockContact({
  heading = "Contact",
  tagline,
  offices,
  lead,
  image,
  className,
}: BlockContactProps) {
  const [officeOne, officeTwo] = offices;

  return (
    <section
      className={cn(
        "blockContact ng-grid min-h-fit bg-[#262626] pt-[120px] text-left text-white",
        className,
      )}
    >
      <div className="blockContact__title col-start-[main-start] col-end-[main-end] row-start-1 flex flex-col gap-[10px] xl:col-end-[8]">
        {tagline ? <span className="blockContact__tagline font-S block">{tagline}</span> : null}
        <h1 className="font-3XL">{heading}</h1>
      </div>

      {officeOne ? (
        <ContactInfo
          office={officeOne}
          className="blockContact__contactOne col-start-[main-start] col-end-[4] row-start-2 md:col-end-[-6] xl:col-start-[12] xl:col-end-[15] xl:row-start-1"
        />
      ) : null}

      {officeTwo ? (
        <ContactInfo
          office={officeTwo}
          className="blockContact__contactTwo col-start-[4] col-end-[main-end] row-start-2 xs:col-start-[5] xs:col-end-[7] md:col-start-[-6] md:col-end-[-3] xl:col-start-[17] xl:col-end-[20] xl:row-start-1"
        />
      ) : null}

      {/* Measured 60/60 margins below 1280 (row = 121px) and 30/60 at 1280+
          (row = 91px); the rule itself is always exactly 1px. */}
      <div
        className="blockContact__line col-start-[main-start] col-end-[main-end] row-start-3 my-[60px] h-px bg-[#a3a3a3] xl:row-start-2 xl:mt-[30px]"
        aria-hidden="true"
      />

      {/* The lead takes the row the socials used to sit in, so it keeps the
          60px stack the rule below the title was spaced against. */}
      <div className="blockContact__textField col-start-[main-start] col-end-[main-end] row-start-4 mb-[60px] text-[#a3a3a3] xl:col-start-[12] xl:col-end-[18] xl:row-start-3 xl:mb-[75px]">
        {/* The whole sentence is one inline `<a>` so the arrow chip sits in the
            text flow. The chip is therefore `asStatic` — a nested <a> would be
            invalid — and gets its own inline-block box (50×20) with the chip
            absolutely positioned inside it. */}
        <a href={lead.href} className="blockContact__textWrapper group inline cursor-pointer">
          <span className="font-SM">{lead.text}</span>{" "}
          <span className="blockContact__textFieldHighlight font-SM text-white">
            {lead.highlight}
          </span>
          <span className="blockContact__textFieldButton font-SM relative inline-block h-[20px] w-[50px] align-baseline">
            <span className="absolute -top-[2px] -bottom-[5px] left-[5px] right-[16px] z-10 flex items-center justify-center">
              <ButtonArrow asStatic border />
            </span>
          </span>
        </a>
      </div>

      {/* Full-bleed below 1280, inset to `main` at 1280+. Heights are measured,
          not derived from the image: it is always cropped with object-cover. */}
      <div className="blockContact__imageWrapper relative z-1 col-start-[1] col-end-[-1] row-start-5 h-[162.5px] overflow-hidden md:h-[320px] xl:col-start-[main-start] xl:col-end-[main-end] xl:row-start-4 xl:h-[296.28px] xl:min-h-[250px]">
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes="(min-width: 1280px) 1340px, 100vw"
          className="blockContact__image h-full w-full object-cover"
        />
      </div>
    </section>
  );
}

/**
 * One office block. Field names and `ButtonLine` usage match the copies in
 * `home/NavigationFooter.tsx` and `home/MainNavigation.tsx`, which render the
 * same `OfficeContact` records.
 *
 * The 25px top padding is the source's, and it is what makes this column line
 * up with the 158.9px title row rather than with the `<h1>` baseline. The
 * e-mail button's -5px top margin absorbs the 10px column gap so its label sits
 * 5px under the phone number.
 */
function ContactInfo({ office, className }: { office: OfficeContact; className?: string }) {
  return (
    <div className={className}>
      <div className="contactInfo flex flex-col gap-[10px] pt-[25px]">
        <h2 className="contactInfo__Label font-S mb-[5px] font-semibold">{office.label}</h2>
        {/* One block span per line reproduces the source's `<p>` + `<br>` box
            (37.8px for two 18.9px lines) without the break element. There is no
            map link: the lines are a locality and a service area, not an
            address to route to. */}
        <address className="font-S not-italic">
          {office.address.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </address>
        {office.phone && office.phoneHref ? (
          <a href={office.phoneHref} className="font-S cursor-pointer">
            {office.phone}
          </a>
        ) : null}
        {office.email ? (
          <ButtonLine
            label="E-mail"
            href={`mailto:${office.email}`}
            color="white"
            className="-mt-[5px]"
          />
        ) : null}
      </div>
    </div>
  );
}
