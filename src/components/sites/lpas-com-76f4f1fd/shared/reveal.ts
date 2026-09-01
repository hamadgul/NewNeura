/**
 * Shared trigger geometry for every scroll reveal on the clone.
 *
 * Measured on lpas.com at 390×664 by stepping the page down 60px at a time and
 * recording where each hidden element sat when it started to animate: its top
 * edge was consistently 463–513px down the viewport, i.e. **~73% of the
 * viewport height**. That is GSAP ScrollTrigger's familiar `start: "top 80%"`
 * shape — a position in the viewport, not a fraction of the element.
 *
 * The clone originally used `{ threshold: 0.15 }` on each section, which is a
 * fraction of the *element*, and that fails in two different ways:
 *
 *   1. It fires at the wrong moment. A section reaches 15% visibility as soon
 *      as its top edge is barely in view, so children lower down the section
 *      animated while still below the fold. Measured on the homepage at 390px,
 *      three of them played at 106–107% of the viewport height — entirely
 *      off-screen. By the time you scrolled to them they had already settled,
 *      so the page read as having no reveals at all on a phone.
 *
 *   2. On a tall section it can never fire. The ratio caps at
 *      `viewportHeight / elementHeight`, so any section taller than
 *      `664 / 0.15 ≈ 4.4k` px can never reach 15%. `CollectionTeam` on /about/
 *      is ~5000px tall at 390px, and its header sat at `opacity: 0` for the
 *      whole page — permanently invisible. Sections get taller as the viewport
 *      gets narrower, which is why this only bit on mobile.
 *
 * A negative bottom `rootMargin` fixes both: it pulls the observer's bottom
 * edge up to 75% of the viewport, so an element intersects exactly when its top
 * crosses that line, whatever its height.
 */
export const REVEAL_OBSERVER_INIT: IntersectionObserverInit = {
  threshold: 0,
  rootMargin: "0px 0px -25% 0px",
};
