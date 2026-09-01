# Builder conventions — lpas.com shared block library

Every block builder follows these rules. They exist so ~14 agents can work in
parallel worktrees and merge without conflicts.

## Hard rules

1. **Write only your own file(s)** under
   `src/components/sites/lpas-com-76f4f1fd/shared/blocks/<BlockName>.tsx`.
   Do **not** edit `globals.css`, `src/types/lpas.ts`, `layout.tsx`, any route,
   or another block. If you need a type, export it from your own file.
2. **Do not create the page routes.** Pages are assembled in a later pass.
3. Verify `npx tsc --noEmit` passes before you finish.

## What already exists — reuse, don't rebuild

- **Type scale:** `.font-3XL .font-XXL .font-XL .font-L .font-M .font-S .font-XS`
  are defined in `globals.css` with the source's exact `clamp()` curves. Use the
  class; never hard-code a matching `font-size`.
- **Grid:** `.lpas-grid` reproduces the source's named-line grid
  (`full-start / main-start / main-end / full-end`), 4 cols <768px, 12 cols
  ≥768px, 20 cols ≥1280px, 10px column gap. Most blocks are
  `<section className="lpas-grid">` with children on `col-start-2 col-end-[-2]`
  plus `grid-cols-subgrid`.
- **Reveals:** `.lpas-reveal` (opacity+translateY 50px, 0.9s) and
  `.lpas-image-reveal` (clip-path wipe, 1.2s) — add `.is-revealed` to play.
  Both already honour `prefers-reduced-motion`.
- **Colour tokens:** `--lpas-ink #000`, `--lpas-dark #262626`, `--lpas-body #111`,
  `--lpas-muted #747474`, `--lpas-line #d6d6d6`, and per-market accents
  `--lpas-housing #625653`, `--lpas-interiors #925434`,
  `--lpas-highered #c9d3df`, `--lpas-civic #707569`, `--lpas-commercial #e3c1aa`.
- **Components:** `shared/buttons.tsx` exports `ButtonArrow`, `ButtonCircle`,
  `ButtonLine`. `shared/icons.tsx` exports `ArrowIcon`, `ChevronIcon`,
  `ArrowOutIcon`, `CloseIcon`, `EyeIcon`, `InstagramIcon`, `LogoIcon`,
  `MenuIcon`, `PlusIcon`. `@/lib/utils` exports `cn()`.
  `@/hooks/useMediaQuery` exports `usePrefersReducedMotion`.

## Three traps that produced silent, build-passing breakage in pass 1

1. **Never point an IntersectionObserver at the element carrying the clip-path.**
   `.lpas-image-reveal` starts at `clip-path: inset(100% 0 0)` → zero visible
   area → `intersectionRatio` is 0 forever → the reveal never fires and the image
   stays blank. Observe an *unclipped ancestor* instead. See
   `root-8a5edab2/ImageCard.tsx` for the correct pattern.
2. **Tailwind v4 emits translate utilities as the `translate` property, not
   `transform`.** So `-translate-x-1/2` and a JS-written
   `transform: translate3d(...)` *compose* rather than override, applying the
   offset twice. If JS owns an element's transform, it must own every axis, and
   must seed the base value in JSX so the element is correct before first paint.
3. **Never port the source's `color: inherit` onto a custom class.** Custom
   classes land after Tailwind's utility layer, so a `color` there beats every
   `text-*` utility used alongside it and flattens the palette. Copy the
   source's *metrics*, drop its `color` declarations.

## Style

- TypeScript strict, no `any`. Named exports. 2-space indent.
- Server components by default; add `"use client"` only when the block genuinely
  needs state, refs or effects.
- Tailwind utilities; arbitrary values (`text-[75px]`) are fine and expected,
  since fidelity beats tidiness here.
- Comment the *why* for anything non-obvious — especially animation ordering and
  any place the source does something surprising. Match the density of the
  existing pass-1 components.
- Images: use `next/image` with explicit `width`/`height` from the spec.

## Two more traps, found during pass-2 page assembly

Both of these are silent — the build passes and the page renders — so they only
surface as wrong pixels.

### 4. `CONTENT.json`'s image `w`/`h` are NOT intrinsic dimensions

They were captured with `img.naturalWidth`/`naturalHeight`, which reports
whichever **srcset variant lazysizes had loaded at capture time**, not the size
of the file on disk. Measured on `/about/`: **38 of 39 images disagree** with the
real file — e.g. CONTENT.json records `193x120` for
`HW23_LPAS_web-res_37-1440x900-c-default.webp`, which is genuinely 1440×900.

Feeding those to `next/image` reserves the wrong aspect ratio, which then
distorts every layout whose height is image-driven.

**Use `docs/research/lpas-com-76f4f1fd/IMAGE_DIMENSIONS.json`** — 385 entries
mapping each downloaded image's public path (identical to CONTENT.json's `local`
field) to its true `{width, height}`, read from the decoded files. Take `local`
paths and all text from CONTENT.json; take dimensions only from
IMAGE_DIMENSIONS.json.

### 5. A `"use client"` module cannot export content constants to a server page

Most blocks are `"use client"`. When a **server** component imports a plain
*value* from a client module, the App Router substitutes a client-reference
proxy for the value. A spread like `<BlockWysiwyg {...ABOUT_WYSIWYG} />` then
spreads nothing and the route dies at prerender with
`TypeError: Cannot read properties of undefined (reading 'map')`.
Re-exporting through another module does **not** help — the proxy is minted at
the client-module boundary regardless of who imports it.

So the shared verbatim content lives in a plain module with no `"use client"`:
`src/components/sites/lpas-com-76f4f1fd/shared/blocks/content-presets.ts`
(`LAS_POSITAS_WYSIWYG`, `ABOUT_WYSIWYG`,
`AFFORDABLE_HOUSING_WYSIWYG_DIVERSE_NEEDS`,
`AFFORDABLE_HOUSING_WYSIWYG_PROVEN_PARTNERS`, `CULTURE_GENERAL_CTA`,
`affordableHousingProcess`). It imports only *types* from the block modules, and
type imports are erased at compile time, so it creates no boundary.

Constants consumed as **default parameter values inside** a client component
(`LPAS_TEAM_ITEMS`, `LPAS_JOURNAL_POSTS`, `PORTFOLIO_MARKET_FILTERS`,
`COLLECTION_PROJECTS_PER_PAGE`) are unaffected and stay where they are — they
are never read across the boundary.
