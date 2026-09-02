"use client";

/**
 * The handoff from the preloader to whatever the preloader was covering.
 *
 * On lpas.com the hero does not reveal itself on mount — it reveals when the
 * intro overlay gets out of the way, and only then. Verified by loading
 * `/about/`, letting it settle, and clicking through to `/`: across the whole
 * Swup transition the hero reads `brightness(0.5)`, `opacity: 1`,
 * `transform: none`. It never replays. The intro is chained to a real document
 * load, not to the page being shown.
 *
 * Module scope is exactly the right lifetime for that, and it is why this is a
 * plain module rather than a React context. A module instance lives as long as
 * the document, so:
 *
 *   - Landing on `/` — the gate is shut, `HomeHero` mounts and waits, the
 *     preloader opens it ~3.4s later and the reveal plays.
 *   - Landing anywhere else and navigating to `/` — the preloader already ran
 *     and opened the gate against nobody. `HomeHero` mounts, reads `true` on
 *     its very first render, and paints the settled hero with no transition.
 *
 * A context provider in the root layout would have the same lifetime but would
 * need a state update to broadcast, which re-renders the whole tree under it;
 * `useSyncExternalStore` re-renders only the components that actually asked.
 */

import { useSyncExternalStore } from "react";

let released = false;
const listeners = new Set<() => void>();

/**
 * Open the gate. Called by `Preloader` when it finishes — or immediately, if
 * reduced motion means it never plays at all.
 */
export function releaseIntro() {
  if (released) return;
  released = true;
  for (const listener of listeners) listener();
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

/**
 * True once the stage is clear. The server snapshot is `false` so the markup
 * always ships in the pre-reveal state; on a client-side navigation the real
 * snapshot is already `true`, so the first client render corrects it before
 * paint and no transition runs.
 */
export function useIntroReleased(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => released,
    () => false,
  );
}
