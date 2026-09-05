import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/seo";

/**
 * `/robots.txt`.
 *
 * Everything is crawlable — there is no admin surface, no search-results page
 * and no faceted URL space to fence off. The one thing worth stating
 * explicitly is `/_next/static/`: those are the CSS and JS bundles, and a
 * crawler blocked from them renders the page unstyled and scores its Core Web
 * Vitals against markup nobody sees. It is allowed by default, so this is a
 * guard against a future edit rather than a fix.
 *
 * AI crawlers are not blocked. The site is optimised to be quoted by answer
 * engines, so disallowing GPTBot, ClaudeBot or PerplexityBot would cut off the
 * traffic the copy is written to earn.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/_next/static/", "/site/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    /*
      No `host` directive. It is a Yandex-only extension that Google and Bing
      ignore, and Next serialises the value verbatim — so `SITE_URL` emitted
      `Host: https://neuragul.com` where the directive is specified as a bare
      hostname. A malformed line is worse than an absent one.
    */
  };
}
