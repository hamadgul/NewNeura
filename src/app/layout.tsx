import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Preloader } from "@/components/site/home/Preloader";
import { PageTransition } from "@/components/site/shared/PageTransition";
import { SmoothScroll } from "@/components/site/shared/SmoothScroll";
import "./globals.css";

/*
  Geist Sans, self-hosted by the `geist` package (SIL OFL 1.1). It is a
  variable face covering 100-900 in ~30kb, which is why the six static cuts the
  layout used to load are gone — the design only ever asked for 300/400/600 and
  a variable axis serves those plus anything added later from one file.

  It has no true italic. Nothing on the site renders one: `BlockWysiwyg`'s
  `quote` node is the only italic code path and no content module declares one.
  If a quote is ever added, check it — the browser will synthesise an oblique
  rather than fail visibly.
*/

const SEO = "/site/seo";
const IMAGES = "/site/images";

/**
 * Site-wide metadata only. Anything page-specific (title, description,
 * canonical URL, OG image) is exported from the individual route.
 * `title.template` suffixes every page but the homepage, which overrides it
 * with an absolute title.
 */
export const metadata: Metadata = {
  metadataBase: new URL("https://neuragul.com"),
  title: {
    default: "NeuraGul",
    template: "%s — NeuraGul",
  },
  openGraph: {
    locale: "en_US",
    type: "website",
    siteName: "NeuraGul",
    images: [{ url: `${IMAGES}/hero-poster.jpg`, width: 1920, height: 1080, type: "image/jpeg" }],
  },
  twitter: { card: "summary_large_image" },
  icons: {
    icon: [{ url: `${SEO}/favicon-32x32.png`, sizes: "32x32" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // `ng-page` scopes the site's page-level rules (white ground, hidden
    // scrollbars, Lenis contract).
    <html lang="en" className={`ng-page ${GeistSans.variable} antialiased`}>
      <body>
        {/*
          Both of these live here rather than in each route on purpose. The
          root layout is not remounted by client-side navigation, so Lenis is
          instantiated once for the session instead of being torn down and
          rebuilt on every link, and the intro overlay plays once per document
          load instead of replaying its full 3.4s over an instant transition.
        */}
        <SmoothScroll />
        <PageTransition />
        <Preloader />
        {children}
      </body>
    </html>
  );
}
