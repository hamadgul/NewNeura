import type { BlockIntroDoubleProps } from "./BlockIntroDouble";
import type { ProjectDetail } from "./BlockProjectDetails";

/**
 * Turns a project's intro block into a working two-tab strip: the brief, and
 * the stack it was built on.
 *
 * The pages shipped with labels reading "The brief" / "What we built" and no
 * behaviour behind them — the second tab was decoration, and pressing it did
 * nothing. The stack was already on every project, as the `Stack` row of
 * `PROJECT_DETAILS`, so the second panel is that row rather than new prose:
 * nothing here is invented, and a project that somehow has no `Stack` row gets
 * one tab instead of an empty one.
 */
export function projectIntroTabs(
  intro: BlockIntroDoubleProps,
  details: readonly ProjectDetail[],
): BlockIntroDoubleProps {
  const stack = details.find((row) => row.label.toLowerCase() === "stack")?.value;
  if (!stack) return intro;

  return {
    ...intro,
    labels: ["The brief", "The tech stack"],
    activeLabel: 0,
    panels: [
      { statement: intro.statement, body: intro.body },
      { statement: stack },
    ],
  };
}

/**
 * Drops the `Stack` row from a project's details before they reach
 * `BlockProjectDetails`.
 *
 * `PROJECT_DETAILS` stays the single source of truth for the stack — this
 * function above (`projectIntroTabs`) still reads the row directly off that
 * array to build the second intro tab, above the fold. Without this helper,
 * `BlockProjectDetails` prints the exact same string again at the page foot.
 * The fix is here, not a `.filter()` copied into ten `page.tsx` files, so the
 * two call sites can never drift apart.
 */
export function projectDetailsWithoutStack(
  details: readonly ProjectDetail[],
): ProjectDetail[] {
  return details.filter((row) => row.label.toLowerCase() !== "stack");
}
