# Artifact Manifest — lpas.com homepage clone

- **Source URL:** `https://lpas.com/`
- **Captured:** 2026-08-31
- **site-key:** `lpas-com-76f4f1fd` · **page-key:** `root-8a5edab2`
- **Destination route:** `/` (`src/app/page.tsx`)
- **Extraction tool:** Playwright 1.62.1 driving system Chrome. The Claude Chrome
  extension was not connected in this environment, so browser automation ran through
  the local Playwright install instead.

## Assets downloaded

`scripts/download-assets-lpas-com-76f4f1fd-root-8a5edab2.mjs` → **68 files, 0 failures**,
all under `public/sites/lpas-com-76f4f1fd/root-8a5edab2/`.

| Kind | Count | Size | Notes |
|---|---|---|---|
| `images/` | 55 | 8.2 MB | webp + jpg derivatives, including every `srcset` variant |
| `fonts/` | 6 | 312 KB | Aeonik woff2: light, regular, semibold + italics |
| `seo/` | 5 | 752 KB | favicons 32/180/192/270 + the OG image |
| `videos/` | 2 | 32 MB | the office film + its poster |

**No generated or substitute assets were used.** Every image, font and video is the
original file from the source site. The Atlas Cloud fallback path was not needed and
was not invoked.

### The video is a time-sensitive capture

The hero/preloader film is served by Vimeo from a **signed progressive-redirect URL**
whose signature expires. It was downloaded during extraction while the signature was
still valid. Re-running the download script later will fail on that one URL unless the
manifest is regenerated from a fresh page load — the other 67 assets are served from
`lpas.com` directly and will keep working.

At 32 MB it is also by far the largest asset in the repo. If that matters for the
repository or for deploy size, transcode it down or swap in the poster image; nothing
in the build depends on its exact bytes.

## Research artifacts

| File | What it holds |
|---|---|
| `DESIGN_TOKENS.md` | palette, the solved fluid type scale, layout rhythm, breakpoints |
| `PAGE_TOPOLOGY.md` | stacking order, section flow, the hero pin geometry |
| `BEHAVIORS.md` | every observed behaviour, with triggers and before/after states |
| `INTERACTION_PATTERNS.md` | condensed timing table for all animations |
| `COMPONENT_INVENTORY.md` | every component, its file, and its variants/states |
| `TECH_STACK_ANALYSIS.md` | source stack vs. the choices made here |
| `components/*.spec.md` | 7 per-component specs, one per builder task |

## Screenshots

`docs/design-references/lpas-com-76f4f1fd/root-8a5edab2/`
- `desktop-1440-full.png`, `desktop-1440-viewport-top.png`
- `scroll/y-0000.png` … `y-8400.png` — 20 positions across the full page
- `state-menu-open.png`, `state-news-hover.png`

## Known gaps

1. **Swup page transitions** are not reproduced — they are cross-page behaviour and
   this clone is a single route. All nav links point at paths that do not exist here.
2. **The cursor blob** (`.blob`, `rgba(14,14,14,0.6)`, z-20) is documented but not
   built; it is idle at 0×0 on load and contributes nothing at rest.
3. **Hero pin constants** are derived from measurement (`travel/scroll ≈ 0.928`, pin
   ends with the last card centred) rather than read from the source's GSAP config,
   which is minified. The geometry is reproduced to within ~1%.
4. **Image push-in curve** is fitted (`scale = 1 + 0.30·t^1.7`) against six measured
   sample points rather than taken from source easing.
