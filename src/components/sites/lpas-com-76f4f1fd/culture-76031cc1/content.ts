/**
 * Verbatim content from `https://lpas.com/culture/`.
 * site-key `lpas-com-76f4f1fd` · page-key `culture-76031cc1`
 *
 * Every string here was read from `docs/research/.../culture-76031cc1/CONTENT.json`,
 * which captured the live DOM — do not paraphrase, retitle or "tidy" any of it.
 *
 * Block order on the source page:
 *   BlockHeaderGeneral → BlockIntroDouble → BlockImageSlider → BlockImageFull
 *   → GeneralCta
 */
import type { BlockHeaderGeneralImage } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockHeaderGeneral";
import type { BlockImageFullImage } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockImageFull";
import type { SliderImage } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockImageSlider";

const IMG = "/sites/lpas-com-76f4f1fd/culture-76031cc1/images";

export const CULTURE_META = {
  /** The root layout supplies the " - LPAS Architecture" half of the template. */
  title: "Culture",
  canonical: "/culture/",
};

/* ── BlockHeaderGeneral ────────────────────────────────────────────────── */

export const CULTURE_HEADER_TITLE = "Culture";

/**
 * The small notched image at the top of the left column, with its `.font-S`
 * caption beneath. Both source instances of this block ship `alt=""`.
 *
 * Intrinsic size is 1440×900, from `docs/research/.../IMAGE_DIMENSIONS.json`
 * (decoded from the downloaded file). CONTENT.json recorded 193×120 here — a
 * srcset variant's rendered box, not the real pixels — which is why image
 * dimensions on this page never come from CONTENT.json.
 */
export const CULTURE_HEADER_HIGHLIGHT_IMAGE: BlockHeaderGeneralImage = {
  src: `${IMG}/DSC9347-1440x900-c-default.webp`,
  alt: "",
  width: 1440,
  height: 900,
};

export const CULTURE_HEADER_HIGHLIGHT_CAPTION = "Great people, great projects.";

/** The full-bleed portrait filling the header's right column. */
export const CULTURE_HEADER_IMAGE: BlockHeaderGeneralImage = {
  src: `${IMG}/HW23_LPAS_web-res_34-1440x2188-c-default.webp`,
  alt: "",
  width: 1440,
  height: 2188,
};

/* ── BlockIntroDouble ──────────────────────────────────────────────────── */

/**
 * One static caption, not the tabbed variant — /culture/ ships a single label
 * above the header rule.
 */
export const CULTURE_INTRO_LABELS = ["Designing Boldly. Growing People."] as const;

export const CULTURE_INTRO_STATEMENT =
  "At LPAS, we are powered by curious minds and genuinely kind people. We believe the best ideas happen when hierarchy fades, curiosity leads, and every voice has a seat at the table.";

/**
 * The source renders this as ONE `<p>`. Its markup carries blank lines between
 * the sentences, so `textContent` reports `\n\n` breaks, but HTML collapses
 * them — the live page (and `innerText`) shows a single continuous flow across
 * the two-column measure, which is what the reference screenshot confirms.
 * Hence one string here rather than an array of paragraphs.
 *
 * The final two sentences repeat the pair before them verbatim. That is the
 * source's own CMS content, not a copy error here, so it is kept.
 */
export const CULTURE_INTRO_BODY =
  "From our open studio in the heart of downtown Sacramento, creativity flows freely, fueled by collaboration, mentorship, and a shared commitment to design that shapes communities. Questions are encouraged. Collaboration is expected. Innovation is part of our identity. Our culture blends rigorous design thinking with authentic connection. You might find us sketching bold new concepts over coffee, hosting a lunch-and-learn to explore emerging technologies, or celebrating the week together at a Thirsty Thursday or karaoke night. We work hard, stay curious, and make space for fun along the way. Learning never stops here. With expertise across architecture and interior design, mentorship happens organically across disciplines, markets, generations, and project teams. Growth is built through shared knowledge, thoughtful feedback, and meaningful responsibility from day one. We foster an environment where people feel supported, inspired, and connected. Collaboration is embedded in how we work. Design excellence and genuine care for one another go hand in hand. Designing spaces people love starts with creating a workplace people love too. We foster an environment where people feel supported, inspired, and connected. Collaboration is embedded in how we work. Design excellence and genuine care for one another go hand in hand. Designing spaces people love starts with creating a workplace people love too.";

/* ── BlockImageSlider ──────────────────────────────────────────────────── */

/**
 * All 32 slides, in source order. Every one ships `alt=""` on the source —
 * they are a decorative studio-life strip, and the block is keyboard/scroll
 * reachable as a group rather than image by image.
 *
 * Widths/heights come from `docs/research/.../IMAGE_DIMENSIONS.json`, decoded
 * from the downloaded files (they also match the `-WxH-` suffix the CMS bakes
 * into each filename). CONTENT.json recorded rendered srcset boxes for the
 * first five, and each slide's ratio is what sets the track height, so a wrong
 * pair here would visibly skew the strip.
 */
export const CULTURE_SLIDER_IMAGES: SliderImage[] = [
  { src: `${IMG}/20231116_172026-1440x1920-c-default.webp`, alt: "", width: 1440, height: 1920 },
  { src: `${IMG}/20240725_130220-1440x1440-c-default.webp`, alt: "", width: 1440, height: 1440 },
  { src: `${IMG}/20240725_162707-1440x1440-c-default.webp`, alt: "", width: 1440, height: 1440 },
  { src: `${IMG}/20240725_163242-1440x1440-c-default.webp`, alt: "", width: 1440, height: 1440 },
  { src: `${IMG}/20240920_093221-1440x1440-c-default.webp`, alt: "", width: 1440, height: 1440 },
  { src: `${IMG}/Brock-Pic-1440x1920-c-default.webp`, alt: "", width: 1440, height: 1920 },
  { src: `${IMG}/Craps-1-1440x1080-c-default.webp`, alt: "", width: 1440, height: 1080 },
  { src: `${IMG}/Document1-1440x1864-c-default.webp`, alt: "", width: 1440, height: 1864 },
  { src: `${IMG}/HABITAT_2-1440x1080-c-default.webp`, alt: "", width: 1440, height: 1080 },
  { src: `${IMG}/IMG_2381-1440x1440-c-default.webp`, alt: "", width: 1440, height: 1440 },
  { src: `${IMG}/IMG_2966-1440x1080-c-default.webp`, alt: "", width: 1440, height: 1080 },
  { src: `${IMG}/IMG_4102-1440x1080-c-default.webp`, alt: "", width: 1440, height: 1080 },
  { src: `${IMG}/IMG_4115-1440x1080-c-default.webp`, alt: "", width: 1440, height: 1080 },
  { src: `${IMG}/IMG_4118-1440x1920-c-default.webp`, alt: "", width: 1440, height: 1920 },
  { src: `${IMG}/IMG_4134-1440x1080-c-default.webp`, alt: "", width: 1440, height: 1080 },
  { src: `${IMG}/IMG_6101-1440x1920-c-default.webp`, alt: "", width: 1440, height: 1920 },
  { src: `${IMG}/IMG_6104-1440x1920-c-default.webp`, alt: "", width: 1440, height: 1920 },
  { src: `${IMG}/lunch-pic-1440x672-c-default.webp`, alt: "", width: 1440, height: 672 },
  {
    src: `${IMG}/PXL_20241214_051409559-1440x1084-c-default.webp`,
    alt: "",
    width: 1440,
    height: 1084,
  },
  {
    src: `${IMG}/PXL_20250809_013545380-1440x1084-c-default.webp`,
    alt: "",
    width: 1440,
    height: 1084,
  },
  {
    src: `${IMG}/PXL_20250809_023225272-1440x1913-c-default.webp`,
    alt: "",
    width: 1440,
    height: 1913,
  },
  {
    src: `${IMG}/Team-3-Photo-3-RETRO-TOWER-THEATRE-1440x1920-c-default.webp`,
    alt: "",
    width: 1440,
    height: 1920,
  },
  {
    src: `${IMG}/Team-3-Photo-5-TOMATO-ALLEY-1440x1920-c-default.webp`,
    alt: "",
    width: 1440,
    height: 1920,
  },
  { src: `${IMG}/DSC8867-1440x960-c-default.webp`, alt: "", width: 1440, height: 960 },
  { src: `${IMG}/DSC8967-1440x960-c-default.webp`, alt: "", width: 1440, height: 960 },
  { src: `${IMG}/DSC9264-1440x960-c-default.webp`, alt: "", width: 1440, height: 960 },
  { src: `${IMG}/DSC9347-1440x960-c-default.webp`, alt: "", width: 1440, height: 960 },
  { src: `${IMG}/3-1440x945-c-default.webp`, alt: "", width: 1440, height: 945 },
  { src: `${IMG}/6-1440x1860-c-default.webp`, alt: "", width: 1440, height: 1860 },
  { src: `${IMG}/11-1440x1080-c-default.webp`, alt: "", width: 1440, height: 1080 },
  { src: `${IMG}/17-1440x1080-c-default.webp`, alt: "", width: 1440, height: 1080 },
  { src: `${IMG}/2024-Kareoke-2024-1440x1920-c-default.webp`, alt: "", width: 1440, height: 1920 },
];

/* ── BlockImageFull ────────────────────────────────────────────────────── */

/**
 * The 1600×748 field-day photo (size per IMAGE_DIMENSIONS.json). That ratio
 * (0.4675) is exactly what drives the block's measured 673.188px height at
 * 1440 — see BlockImageFull's header. CONTENT.json said 1440×673, the rendered
 * box, which would have been self-consistent here but is still the wrong pair.
 */
export const CULTURE_FULL_IMAGE: BlockImageFullImage = {
  src: `${IMG}/20221007_145237-1600x748-c-default.webp`,
  alt: "",
  width: 1600,
  height: 748,
};

/* ── GeneralCta ────────────────────────────────────────────────────────── */

/**
 * The closing CTA copy is verbatim and shipped ready-made, so it is re-exported
 * rather than retyped.
 *
 * It comes from `shared/blocks/content-presets.ts`, NOT from `GeneralCta.tsx`.
 * `GeneralCta` is a `"use client"` module, and a server module importing a
 * plain value from a client module receives a client-reference proxy instead of
 * the value — spreading that into the block silently yields undefined props
 * (an empty `<p class="font-L">` and an href-less arrow button) with no type or
 * build error. `content-presets.ts` has no `"use client"`, so the constant
 * stays a real value in the server graph, and re-exporting it through this
 * module is safe for the same reason.
 */
export { CULTURE_GENERAL_CTA } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/content-presets";
