import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/seo";

/**
 * `/sitemap.xml`.
 *
 * `lastModified` is a fixed date, not `new Date()`. A sitemap whose every entry
 * carries the build timestamp tells Google that all 23 pages changed on every
 * deploy, which is false, and Google's response to a site that cries wolf is to
 * stop reading the field at all. Bump this constant when the copy actually
 * changes.
 */
const LAST_MODIFIED = new Date("2026-09-04");

/**
 * Routes are grouped by priority tier rather than listed flat, because the
 * tiers are the editorial judgement and the paths are just data. `priority` is
 * a weak signal at best — it says nothing about ranking, only about relative
 * crawl importance within this one site — so the tiers are coarse on purpose.
 *
 * `changeFrequency` is honest: this is a studio site, not a publication.
 * Nothing here changes weekly and claiming otherwise buys nothing.
 */
const TIERS: Array<{
  paths: string[];
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}> = [
  { paths: ["/"], priority: 1, changeFrequency: "monthly" },
  {
    // The five service lines and the contact page: the routes a commercial
    // search should land on.
    paths: [
      "/services/applied-ai/",
      "/services/web-development/",
      "/services/app-development/",
      "/services/cloud-infrastructure/",
      "/services/data-intelligence/",
      "/contact/",
    ],
    priority: 0.9,
    changeFrequency: "monthly",
  },
  {
    paths: [
      "/services/applied-ai/strategy/",
      "/services/applied-ai/models/",
      "/services/applied-ai/agents/",
      "/services/applied-ai/evaluation/",
      "/work/",
    ],
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    // The nine case studies. These are the pages that carry the evidence, so
    // they sit above the two studio pages.
    paths: [
      "/work/delivery-routing/",
      "/work/packship/",
      "/work/foodtruckrentals/",
      "/work/vintus/",
      "/work/landscape-drainage-proz/",
      "/work/new-york-mobile-mechanic/",
      "/work/new-york-fine-foods/",
      "/work/restaurant-ordering-portal/",
      "/work/rwd-pipeline/",
    ],
    priority: 0.7,
    changeFrequency: "yearly",
  },
  { paths: ["/about/", "/process/"], priority: 0.6, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return TIERS.flatMap(({ paths, priority, changeFrequency }) =>
    paths.map((path) => ({
      // Trailing slashes are kept: `next.config.ts` sets `trailingSlash: true`,
      // so `/about` 308-redirects to `/about/`. A sitemap full of redirecting
      // URLs wastes crawl budget and muddies which form is canonical.
      url: `${SITE_URL}${path}`,
      lastModified: LAST_MODIFIED,
      changeFrequency,
      priority,
    })),
  );
}
