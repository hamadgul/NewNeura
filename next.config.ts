import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /*
   * lpas.com serves every URL with a trailing slash (`/about/`,
   * `/markets/civic/`, `/portfolio/the-frederic/`) — the WordPress convention.
   *
   * Next's default (`false`) strips it, which produced two visible defects:
   *   1. Every route 308-redirected: a request for the source's own
   *      `/markets/civic/` bounced to `/markets/civic`.
   *   2. The emitted markup disagreed with itself. `next/link` normalised its
   *      hrefs while pass-1's `ImageCard` renders a plain `<a>` and preserved
   *      them, so one page shipped both `/portfolio/316-vernon-street` and
   *      `/portfolio/california-highway-patrol-headquarters/`.
   *
   * Setting this true makes every emitted href and every served URL match the
   * source exactly, and removes the redirect hop.
   */
  trailingSlash: true,
};

export default nextConfig;
