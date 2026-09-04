import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*
   * Standalone output is a *self-hosting* feature: it makes `next build` copy
   * the traced server and its production `node_modules` into `.next/standalone`
   * so a container can run `node server.js` with no install step. Our
   * `Dockerfile` does exactly that (`COPY --from=builder /app/.next/standalone`),
   * which is why this is gated rather than deleted.
   *
   * It must NOT be set on Vercel. Vercel's Next.js builder does its own output
   * file tracing and does not emit `.next/next-server.js.nft.json`; the
   * standalone copy step then tries to read that file and the build dies with
   *
   *   Error: ENOENT: no such file or directory, open
   *   '/vercel/path0/.next/next-server.js.nft.json'
   *
   * Local `next build` emits the trace file, so this only ever fails on Vercel.
   *
   * The switch is opt-in from the Docker side (`ENV NEXT_OUTPUT=standalone` in
   * the builder stage) rather than opt-out by sniffing `VERCEL`: the platform
   * that needs the non-default behaviour is the one that has to ask for it, so
   * a build anywhere else — Vercel, CI, a bare `npm run build` — gets the
   * default and works.
   */
  output: process.env.NEXT_OUTPUT === "standalone" ? "standalone" : undefined,
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
