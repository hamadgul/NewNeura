import type { Metadata } from "next";
import localFont from "next/font/local";
import { Preloader } from "@/components/sites/lpas-com-76f4f1fd/root-8a5edab2/Preloader";
import { PageTransition } from "@/components/sites/lpas-com-76f4f1fd/shared/PageTransition";
import { SmoothScroll } from "@/components/sites/lpas-com-76f4f1fd/shared/SmoothScroll";
import "./globals.css";

// `next/font/local` is resolved statically at build time, so every `path` has
// to be a literal string — a template literal or shared constant fails to
// resolve. Keep these spelled out.
const aeonik = localFont({
  variable: "--font-aeonik",
  display: "fallback",
  src: [
    {
      path: "../../public/sites/lpas-com-76f4f1fd/root-8a5edab2/fonts/aeonik-light-Dpju73oo.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/sites/lpas-com-76f4f1fd/root-8a5edab2/fonts/aeonik-lightitalic-CgVRFIYC.woff2",
      weight: "300",
      style: "italic",
    },
    {
      path: "../../public/sites/lpas-com-76f4f1fd/root-8a5edab2/fonts/aeonik-regular-CDaMS559.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/sites/lpas-com-76f4f1fd/root-8a5edab2/fonts/aeonik-regularitalic-CMWVAbUM.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/sites/lpas-com-76f4f1fd/root-8a5edab2/fonts/aeonik-semibold-Dz4moNn4.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/sites/lpas-com-76f4f1fd/root-8a5edab2/fonts/aeonik-semibolditalic-1Ub6-gfY.woff2",
      weight: "600",
      style: "italic",
    },
  ],
});

const SEO = "/sites/lpas-com-76f4f1fd/root-8a5edab2/seo";

/**
 * Site-wide metadata only. Anything page-specific (title, description, canonical
 * URL, OG image) is exported from the individual route so each cloned page
 * carries the head the source page actually served. `title.template` reproduces
 * the source's "<Page> - LPAS Architecture" pattern; the homepage overrides it
 * with an absolute title because the source does not suffix that one.
 */
export const metadata: Metadata = {
  metadataBase: new URL("https://lpas.com"),
  title: {
    default: "LPAS Architecture",
    template: "%s - LPAS Architecture",
  },
  openGraph: {
    locale: "en_US",
    type: "website",
    siteName: "LPAS Architecture",
    images: [{ url: `${SEO}/Contact-LPAS.jpg`, width: 2500, height: 985, type: "image/jpeg" }],
  },
  twitter: { card: "summary_large_image" },
  icons: {
    icon: [
      { url: `${SEO}/cropped-icon-32x32.png`, sizes: "32x32" },
      { url: `${SEO}/cropped-icon-192x192.png`, sizes: "192x192" },
    ],
    apple: [{ url: `${SEO}/cropped-icon-180x180.png` }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // `lpas-page` scopes the site's page-level rules (white ground, hidden
    // scrollbars, Lenis contract) so they never leak into other routes.
    <html lang="en" className={`lpas-page ${aeonik.variable} antialiased`}>
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
