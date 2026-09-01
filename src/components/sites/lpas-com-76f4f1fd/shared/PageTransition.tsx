"use client";

/**
 * The source's page transition.
 *
 * lpas.com is not a set of hard page loads: it ships Swup (`swup-config-*.js`)
 * and `html.swup-enabled`, so an in-site click swaps the document over AJAX.
 * Sampling `.mainContent`'s opacity through a click from `/` to `/about/` gives
 * the whole thing:
 *
 *   0.00 – 0.30s   `html` gains `is-changing is-animating is-leaving`,
 *                  `.mainContent` fades 1 → 0
 *   0.30 – 0.75s   `is-rendering`; the new markup is swapped in behind the
 *                  transparent shell
 *   0.75 – 1.10s   `.mainContent` fades 0 → 1, the classes are dropped
 *
 * The preloader takes no part in this — it stays `opacity: 0; visibility:
 * hidden` for the entire navigation and only ever plays on a real document
 * load, which is why it is mounted from the root layout rather than per route.
 *
 * Reproducing the leave half needs the click, not just the pathname: by the
 * time `usePathname()` changes, App Router has already rendered the new tree
 * and there is nothing left to fade out. So this intercepts internal
 * navigations in the capture phase, plays the fade, then hands off to the
 * router.
 *
 * State is flags on `<html>`, and the fade itself lives in globals.css next to
 * the other page-level rules — the same shape as the source, and it keeps the
 * component out of the DOM. Wrapping `{children}` in a styled element instead
 * would put a new containing block around the fixed navigation and a new
 * stacking context around the pinned hero and the footer's sticky reveal.
 */
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

/** ms for the outgoing fade. Mirrored by `.is-leaving` in globals.css. */
const LEAVE_MS = 300;
/** ms the swapped-in page is held transparent before it fades up. */
const HOLD_MS = 450;

export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const navigating = useRef(false);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      // Anything the browser would not treat as a plain in-page navigation is
      // left completely alone: new tabs, downloads, modified clicks.
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || anchor.hasAttribute("download") || anchor.target === "_blank") return;

      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) return;
      // A bare hash is a scroll, not a navigation — Lenis owns that.
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;

      event.preventDefault();
      navigating.current = true;
      const root = document.documentElement;
      root.classList.add("is-changing", "is-leaving");

      window.setTimeout(() => {
        root.classList.remove("is-leaving");
        root.classList.add("is-rendering");
        router.push(url.pathname + url.search + url.hash);
        // The source lands every navigation at the top. Lenis has to be told
        // explicitly: it owns the scroll position, and left alone it would
        // animate back up through the whole outgoing page after the swap.
        window.__lpasLenis?.scrollTo(0, { immediate: true });
        window.scrollTo(0, 0);
      }, LEAVE_MS);
    };

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [router]);

  // Arrival. Held one beat past the swap, then the classes come off and the
  // CSS transition carries the new page back up to full opacity.
  useEffect(() => {
    const root = document.documentElement;
    if (!navigating.current) {
      // A back/forward, or the first render — nothing was faded out, so make
      // sure no stale flag is left holding the page transparent.
      root.classList.remove("is-changing", "is-leaving", "is-rendering");
      return;
    }
    navigating.current = false;
    const id = window.setTimeout(
      () => root.classList.remove("is-changing", "is-leaving", "is-rendering"),
      HOLD_MS - LEAVE_MS,
    );
    return () => window.clearTimeout(id);
  }, [pathname]);

  return null;
}
