/**
 * Content for `/about/` (page-key `about-4f10f17b`).
 *
 * Every string is verbatim from
 * `docs/research/lpas-com-76f4f1fd/about-4f10f17b/CONTENT.json` and every asset
 * path is that capture's own `local` field — nothing here is retyped or
 * paraphrased.
 *
 * `CollectionTeam` needs no page-level content at all and so is absent from
 * this file: it defaults to `LPAS_TEAM_ITEMS` / `LPAS_TEAM_FILTERS` and
 * already defaults its tagline and heading to the measured strings, so the
 * page renders it with zero arguments. Re-declaring that here would fork the
 * source of truth for no gain — and, crucially, those defaults are read
 * *inside* the client component, which is why they work where the wysiwyg
 * constant below could not (see `ABOUT_WYSIWYG_BODY`).
 */
import type { BlockHeaderGeneralProps } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockHeaderGeneral";
import type { BlockWysiwygProps } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockWysiwyg";
import type { BlockIntroDoubleProps } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockIntroDouble";
import type { BlockMediaDoubleQuoteProps } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockMediaDoubleQuote";

const IMAGES = "/sites/lpas-com-76f4f1fd/about-4f10f17b/images";
const VIDEOS = "/sites/lpas-com-76f4f1fd/about-4f10f17b/videos";

/**
 * Exact head strings from CONTENT.json. The live `<title>` is
 * "About - LPAS Architecture", which is precisely what the root layout's
 * `"%s - LPAS Architecture"` template produces from "About" — so the route
 * passes the bare stem and never the suffix.
 *
 * The source ships **no** meta description on this page (`metaDescription` is
 * `null` in the capture and there is no `og:description` either), so none is
 * invented; only the canonical and the OG image are asserted.
 */
export const ABOUT_TITLE = "About";
export const ABOUT_CANONICAL = "/about/";
export const ABOUT_OG_IMAGE = `${IMAGES}/02_LPAS-723-S-Street-Headquarters-1440x2160-c-default.webp`;

/**
 * Header. Both images ship `alt=""` in the source — they are decorative, and
 * the block's own prop docs record that. The recorded `w`/`h` in CONTENT.json
 * are *rendered* box sizes (193x120 for the notched highlight); the intrinsic
 * file sizes are used here so `next/image` reserves the right aspect ratio and
 * the block's `sizes` hints pick the right variant.
 *
 * No `buttonHref`: the source block reports `linkCount: 0`, so the scroll
 * circle is a plain button with no destination, exactly as captured.
 */
export const ABOUT_HEADER: BlockHeaderGeneralProps = {
  title: "About",
  intro:
    "We believe the best designs emerge when diverse voices come together to imagine and build with purpose.",
  highlightImage: {
    src: `${IMAGES}/HW23_LPAS_web-res_37-1440x900-c-default.webp`,
    alt: "",
    width: 1440,
    height: 900,
  },
  highlightCaption: "Creativity, Community, Connection",
  image: {
    src: `${IMAGES}/02_LPAS-723-S-Street-Headquarters-1440x2160-c-default.webp`,
    alt: "",
    width: 1440,
    height: 2160,
  },
};

/**
 * Intro. One static caption, not tabs — hence a single-entry `labels` array,
 * which keeps the block in its muted non-tabbed rendering.
 *
 * `body` is deliberately omitted: the captured section is 232px tall and its
 * innerText is exactly the label plus the `<h2>`, with `paragraphs: []`.
 * `block-BlockIntroDouble.png` confirms it — header rule, then the `.font-L`
 * statement, and nothing after it. The block collapses its second text row
 * when `body` is undefined, which is what reproduces that height.
 */
export const ABOUT_INTRO: BlockIntroDoubleProps = {
  labels: ["About us"],
  statement:
    "LPAS Architecture + Design is an award-winning, multidisciplinary design firm providing architecture, interior design, and planning services across a diverse range of project types.",
};

/**
 * Media pair. This is the one instance across the site whose large slot is a
 * `<video>` rather than an image — `videoCount: 1` on the captured section —
 * so it takes the `type: "video"` arm of the media union. 1920x1080 is the
 * file's real stream size (verified with ffprobe), which is what holds the
 * grid rows stable before metadata loads.
 *
 * The poster is the *other* pages' recorded thumbnail. This page's own capture
 * recorded `poster: "https://lpas.com/about/"` — the page URL, not an image,
 * i.e. a broken poster attribute in the source markup — and its `posterLocal`
 * is correspondingly an empty basename. Every other page that embeds this same
 * Vimeo rendition records `LPAS-office-thumbnail.jpg`, so that file (already
 * downloaded into this page's namespace) is used instead of shipping a poster
 * that would 404.
 *
 * No `quote`: the section's innerText is empty. The block still renders its
 * blockquote element, whose 100px spacer is load-bearing when stacked.
 */
export const ABOUT_MEDIA: BlockMediaDoubleQuoteProps = {
  large: {
    type: "video",
    src: `${VIDEOS}/file.mp4-1080p-.mp4`,
    poster: `${VIDEOS}/LPAS-office-thumbnail.jpg`,
    width: 1920,
    height: 1080,
  },
  small: {
    type: "image",
    src: `${IMAGES}/HW23_LPAS_web-res_41-1600x1068-c-default.webp`,
    alt: "",
    width: 1600,
    height: 1068,
  },
};

/**
 * Rich-text body — the same single paragraph the block ships as its own
 * `ABOUT_WYSIWYG` constant, restated here because that constant is
 * **unreachable from a server component**.
 *
 * `BlockWysiwyg.tsx` is a `"use client"` module. Every *value* export of a
 * client module is replaced by a client-reference proxy when the server graph
 * imports it, so `<BlockWysiwyg {...ABOUT_WYSIWYG} />` spread nothing and the
 * page crashed at prerender with `Cannot read properties of undefined
 * (reading 'map')` on `body.map`. Re-exporting it through this file would not
 * help — the proxy is created at the client-module boundary, whichever
 * server-side module does the importing.
 *
 * The block's other reusable constants (`LPAS_TEAM_ITEMS`,
 * `LPAS_JOURNAL_POSTS`) are unaffected because they are consumed as *default
 * parameter values inside the client component*, never read across the
 * boundary. Only this one had to be passed in from a page.
 *
 * Copy is byte-identical to `ABOUT_WYSIWYG.body[0].text`, which is itself
 * verbatim from CONTENT.json's single `paragraphs` entry.
 */
export const ABOUT_WYSIWYG_BODY: BlockWysiwygProps = {
  body: [
    {
      type: "paragraph",
      text: "With offices in Sacramento and Oakland, LPAS works collaboratively with clients on higher education, civic, mixed-use, housing, commercial, and adaptive-reuse projects that respond to context, community, and purpose. Our philosophy reflects a collaborative process that unites design disciplines and client goals to produce thoughtful, lasting built environments. Our work emphasizes environmental responsibility, sense of place, and design excellence that supports both performance and community value.",
    },
  ],
};
