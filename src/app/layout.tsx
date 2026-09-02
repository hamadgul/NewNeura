import type { Metadata } from "next";
import localFont from "next/font/local";
import { Preloader } from "@/components/site/home/Preloader";
import { PageTransition } from "@/components/site/shared/PageTransition";
import { SmoothScroll } from "@/components/site/shared/SmoothScroll";
import "./globals.css";

// `next/font/local` is resolved statically at build time, so every `path` has
// to be a literal string — a template literal or shared constant fails to
// resolve. Keep these spelled out.
const aeonik = localFont({
  variable: "--font-aeonik",
  display: "fallback",
  src: [
    {
      path: "../../public/site/fonts/aeonik-light-Dpju73oo.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/site/fonts/aeonik-lightitalic-CgVRFIYC.woff2",
      weight: "300",
      style: "italic",
    },
    {
      path: "../../public/site/fonts/aeonik-regular-CDaMS559.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/site/fonts/aeonik-regularitalic-CMWVAbUM.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/site/fonts/aeonik-semibold-Dz4moNn4.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/site/fonts/aeonik-semibolditalic-1Ub6-gfY.woff2",
      weight: "600",
      style: "italic",
    },
  ],
});

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
    <html lang="en" className={`ng-page ${aeonik.variable} antialiased`}>
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
