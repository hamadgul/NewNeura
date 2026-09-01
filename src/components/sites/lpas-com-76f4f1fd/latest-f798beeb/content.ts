/**
 * Content for `/latest/` (page-key `latest-f798beeb`).
 *
 * Verbatim from `docs/research/lpas-com-76f4f1fd/latest-f798beeb/CONTENT.json`;
 * the header asset path is that capture's own `local` field.
 *
 * The journal feed itself is **not** re-declared here. `CollectionPost` exports
 * `LPAS_JOURNAL_POSTS` — all 18 rows of the site's own
 * `/wp-json/filter/latest` payload (`POSTS_DATASET.json`) — as its `posts`
 * default, and defaults its tagline and heading to the measured "Journal" /
 * "Stay up to date with everything that happens at LPAS." So the page renders
 * that block with zero arguments; duplicating the dataset here would fork the
 * source of truth.
 */
import type { BlockHeaderPortfolioProps } from "@/components/sites/lpas-com-76f4f1fd/shared/blocks/BlockHeaderPortfolio";

const IMAGES = "/sites/lpas-com-76f4f1fd/latest-f798beeb/images";

/**
 * Head strings from CONTENT.json. The live `<title>` is
 * "Latest Updates - LPAS Architecture" — exactly what the root layout's
 * `"%s - LPAS Architecture"` template yields from "Latest Updates" — so the
 * route passes only the stem.
 *
 * As on /about/, the source ships **no** meta description here
 * (`metaDescription: null`, and no `og:description`), so none is invented.
 */
export const LATEST_TITLE = "Latest Updates";
export const LATEST_CANONICAL = "/latest/";
export const LATEST_OG_IMAGE = `${IMAGES}/lpas-latest-1440x366-c-default.webp`;

/**
 * Header. The `<h1>` reads "Latest Updates" but the source hard-breaks it with
 * a `<br>` — the capture's innerText is "Latest\nUpdates" — so it is passed as
 * one string per rendered line rather than left to wrap.
 *
 * The eyebrow is authored "Stay in the know"; the label is authored lowercase
 * ("inspiration and knowledge") and the block re-capitalises the first letter
 * in CSS, which is why the capture renders "Inspiration and knowledge".
 *
 * 1440x366 is the downloaded variant's real size, and this image is the page's
 * LCP element (the block defaults `priority` to true).
 */
export const LATEST_HEADER: BlockHeaderPortfolioProps = {
  eyebrow: "Stay in the know",
  label: "inspiration and knowledge",
  title: ["Latest", "Updates"],
  image: {
    src: `${IMAGES}/lpas-latest-1440x366-c-default.webp`,
    alt: "",
    width: 1440,
    height: 366,
  },
};
