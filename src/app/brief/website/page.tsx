import Link from "next/link";
import { BriefForm } from "@/components/site/brief/BriefForm";
import { MAX_SHORT, type Answers } from "@/components/site/brief/questions";
import { Wordmark } from "@/components/site/shared/icons";

import type { Metadata } from "next";

/**
 * `/brief/website/` — the website intake form Hamad sends to a prospective
 * client. Not part of the public site: nothing links here, `sitemap.ts` leaves
 * it out, and it is `noindex`.
 *
 * The noindex is a meta tag, deliberately NOT a robots.txt `Disallow`: a
 * crawler blocked from fetching the page never sees the noindex, and can still
 * index the bare URL from a link it found elsewhere.
 *
 * `openGraph` is set (with its own image, since a route's `openGraph` replaces
 * the layout's rather than merging) because this link is pasted into texts and
 * emails, where the preview card is the first thing the client sees.
 */
export const metadata: Metadata = {
  title: "Website brief",
  description: "Tell us about the website you want. About ten minutes; only four questions are required.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  openGraph: {
    title: "Website brief — NeuraGul",
    description: "Tell us about the website you want. About ten minutes; only four questions are required.",
    url: "https://neuragul.com/brief/website/",
    images: [{ url: "/site/images/hero-poster.jpg", width: 1920, height: 1080, type: "image/jpeg" }],
  },
};

/** The personalised-link params, e.g. `?name=Sarah%20Lee&business=Sarah's%20Bakery`. */
const PREFILL_PARAMS = ["name", "business", "email", "phone"] as const;

export default async function WebsiteBriefPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const prefill: Answers = {};
  for (const key of PREFILL_PARAMS) {
    const value = params[key];
    if (typeof value === "string" && value.trim()) prefill[key] = value.trim().slice(0, MAX_SHORT);
  }

  return (
    <div className="min-h-svh bg-white">
      {/*
        Without JavaScript every panel shows and the wizard controls hide, so
        the brief becomes one long form that still submits.
      */}
      <noscript>
        <style>{`.brief-panel[data-hidden]{display:block!important}.brief-panel+.brief-panel{margin-top:96px}.brief-js{display:none!important}.brief-nojs{display:inline!important}`}</style>
      </noscript>

      <header className="mx-auto flex max-w-[720px] items-center justify-between px-[var(--ng-gutter)] pt-8 pb-12 sm:pt-10 sm:pb-16">
        <Link href="/" aria-label="NeuraGul home" className="text-[var(--ng-body)]">
          <Wordmark className="text-[20px]" />
        </Link>
        <span className="text-[14px] text-[var(--ng-muted)]">Website brief</span>
      </header>

      <main className="mx-auto max-w-[720px] px-[var(--ng-gutter)]">
        <BriefForm prefill={prefill} />
      </main>
    </div>
  );
}
