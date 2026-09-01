/**
 * BlockProjectDetails — the label/value spec table at the foot of a project page.
 *
 * Geometry is 1:1 with `getComputedStyle()` at 1440x900 (see
 * `docs/research/lpas-com-76f4f1fd/shared-blocks/BlockProjectDetails.styles.md`)
 * and cross-checked against the 390/768 entries in `GRID_AREAS.json` plus the
 * 390px capture in `mobile-full.png`. Measured heights, all reproduced here:
 *   1440 → 1px rule + 187.531 content + 100 padding = 289
 *    768 →  47.203 title + 168.625 list   + 100 padding = 316
 *    390 →  47.203 title + 268.438 list   + 100 padding = 416
 *
 * Three distinct layouts, all built from one `grid-cols-subgrid` chain
 * (section → ul → li) so the label and value columns stay locked to the page
 * grid instead of re-deriving widths:
 *   < 768px  heading stacked over a single-column list; the heading carries the
 *            hairline as its own `border-bottom` (the standalone rule is
 *            `display: none` here — 31.2 line + 15 padding + 1 border = 47.203).
 *   ≥ 768px  same stacked heading, list splits into two columns. The label
 *            column widens to two tracks: at one track "LEED Level" wraps and
 *            the list measures 188px, not the measured 168.625px.
 *   ≥ 1280px the full desktop form — a rule across cols 2/-3, the heading in
 *            cols 2/7 and the list in cols 9/-3.
 *
 * List rows are auto-placed: with definite, non-overlapping column spans the
 * even items fill the left half and the odd items the right, which is the
 * measured Client|Bldg Area / Value|LEED Level / Completed arrangement.
 *
 * Static — no transforms, filters or clip-paths appear in the extraction, so
 * this is a server component with no reveal.
 */
import { cn } from "@/lib/utils";

export interface ProjectDetail {
  /** Muted left column, e.g. "Bldg Area". */
  label: string;
  value: string;
}

export interface BlockProjectDetailsProps {
  /** Any number of pairs; a project with fewer or different fields still lays out. */
  details: ProjectDetail[];
  heading?: string;
  className?: string;
}

export function BlockProjectDetails({
  details,
  heading = "Project details",
  className,
}: BlockProjectDetailsProps) {
  if (details.length === 0) return null;

  return (
    <section
      className={cn(
        "blockProjectDetails lpas-grid mt-[100px] pb-[100px] text-[#111111]",
        className,
      )}
    >
      {/* Desktop-only hairline; below 1280px the heading's own border stands in. */}
      <div className="blockProjectDetails__line row-start-1 hidden h-px bg-[#d6d6d6] xl:col-start-2 xl:col-end-[21] xl:block" />

      <h2 className="blockProjectDetails__title font-M col-start-2 col-end-[6] row-start-2 border-b border-[#d6d6d6] pb-[15px] md:col-end-[14] xl:col-start-2 xl:col-end-[7] xl:border-b-0 xl:py-[15px]">
        {heading}
      </h2>

      <ul className="blockProjectDetails__wrapper col-start-1 col-end-7 row-start-3 grid grid-cols-subgrid md:col-end-[15] xl:col-start-[9] xl:col-end-[21] xl:row-start-2">
        {details.map((detail, index) => (
          <li
            key={detail.label}
            className={cn(
              "blockProjectDetails__itemList font-S col-start-2 col-end-6 grid grid-cols-subgrid border-b border-[#d6d6d6] py-[15px]",
              index % 2 === 0
                ? "md:col-start-2 md:col-end-8 xl:col-start-1 xl:col-end-7"
                : "md:col-start-8 md:col-end-[14] xl:col-start-7 xl:col-end-[13]",
            )}
          >
            <span className="blockProjectDetails__itemOne col-start-1 col-end-2 text-[#747474] md:col-end-3 xl:col-end-2">
              {detail.label}
            </span>
            <span className="blockProjectDetails__itemTwo col-start-2 col-end-5 pl-[30px] md:col-start-3 md:col-end-7 xl:col-start-2 xl:col-end-7">
              {detail.value}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
