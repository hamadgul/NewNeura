# Tech Stack Analysis — lpas.com

| Concern | lpas.com | Our clone |
|---|---|---|
| CMS / framework | WordPress, custom theme `wp-content/themes/lpas`, built with Vite | Next.js 16 App Router, static content in `content.ts` |
| Rendering | Server-rendered PHP templates | React 19 Server Components + targeted client components |
| CSS | One compiled stylesheet (`main-CnNCC-Q8.css`, 158KB), BEM naming | Tailwind v4 utilities + a small set of ported global classes |
| Type scale | `.font-3XL … .font-XS` utility classes with `clamp()` | Same class names, re-derived clamps, in `globals.css` |
| Root font size | `html { font-size: 62.5% }` → 1rem = 10px | **Left at 16px**; every source rem converted to px at the 10px base |
| Font | Aeonik, self-hosted woff/woff2, 3 weights + italics | Same woff2 files via `next/font/local` |
| Smooth scroll | Lenis (`lenisSmooth-BjXMsNId.js`) | `lenis` npm package via `shared/SmoothScroll.tsx` |
| Scroll animation | GSAP ScrollTrigger (`.pin-spacer-homeHero` is its signature) | `position: sticky` spacer + rAF progress — same result, no dependency, and it does not fight Lenis |
| Page transitions | Swup (`main#swup`, `footer#swupFooter`) | **Out of scope** — single-page clone |
| Icons | One inline `<svg id="sprite">` with 9 `<symbol>`s, referenced via `<use>` | The same 9 paths as React components in `shared/icons.tsx` |
| Images | WordPress `resized/` derivatives, `<picture>` + webp/jpg | Downloaded locally, served through `next/image` |
| Video | Vimeo progressive-redirect MP4 (signed URL) | Downloaded to `public/.../videos/` before the signature expired |
| Analytics | Cloudflare Insights beacon | Not reproduced |

## Notable source details worth keeping in mind

- **`--marketMainColor` / `--marketContentColor`** are set per hero card and inherited
  by children. We reproduce that contract rather than passing colours down as props,
  which is what lets `ButtonCircle color="market"` work without knowing the market.
- **`.homeHero__card { aspect-ratio: 6/7 }`** at `height: 100%` is the whole reason
  cards measure 771px at a 900px viewport. Hard-coding 771px would break at any other
  viewport height.
- The theme ships `swiper-preloader-spin` keyframes and Swiper CSS, but no Swiper
  instance runs on the homepage — it is dead weight from other templates. Ignore it.
- `[data-browser=Safari]` rules swap `.homeHero__main` from `sticky` to `absolute`.
  Our sticky-spacer approach sidesteps the bug those rules work around.
