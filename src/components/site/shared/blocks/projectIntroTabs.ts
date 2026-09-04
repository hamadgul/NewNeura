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
