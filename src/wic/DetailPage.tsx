"use client";

import { useEffect, type ReactNode } from "react";
import { Pager } from "./Pager";
import { WicHeader } from "./WicHeader";
import { WicPage } from "./WicPage";
import { wicHref, type WicSlug } from "./data";
import { pick, type WicLang } from "./lang";

export type DetailMeta = { title: string; lead: string };

/**
 * Light text page: header, back link, title, lead, article body, pager, footer.
 * The body is plain HTML styled by `.wic-article` in wic.css.
 */
export function DetailPage({
  slug,
  lang,
  title,
  lead,
  children,
}: DetailMeta & { slug: WicSlug; lang: WicLang; children: ReactNode }) {
  useEffect(() => {
    // Detail pages open at the top, or at the #fragment they were linked to (no
    // browser scroll restoration). The landing page passes its position as
    // ?y=, which we forward to every internal link so "Back" returns to the
    // same spot in the animation. No scrollTo on `load`: images can arrive
    // after the reader has started scrolling.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    const target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
    const m = /[?&]y=(\d+)/.exec(location.search);
    if (m) {
      document.querySelectorAll<HTMLAnchorElement>('a[href^="/"]').forEach((a) => {
        const url = new URL(a.href);
        url.searchParams.set("y", m[1]);
        a.href = url.pathname + url.search + url.hash;
      });
      try { history.replaceState(null, "", location.pathname + location.hash); } catch {}
    }
  }, []);

  return (
    <WicPage tone="light" lang={lang}>
      <WicHeader lang={lang} current={slug} />
      <div className="wic-grain" aria-hidden="true" />
      <main className="relative z-10 mx-auto max-w-[42rem] px-5 pb-20 pt-[calc(env(safe-area-inset-top,0px)+6.5rem)] text-[17px] leading-[1.6]">
        <a
          href={wicHref(lang)}
          className="-ml-[0.2em] inline-flex min-h-11 items-center gap-[0.3em] text-[0.95rem] font-medium text-wic-ink no-underline hover:underline hover:underline-offset-[0.2em]"
        >
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" className="flex-none">
            <path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {pick(lang, "Back", "戻る")}
        </a>
        <h1 className="mb-3 mt-2.5 text-[clamp(2.2rem,8vw,3.2rem)] font-light leading-[1.05] tracking-[-0.02em]">{title}</h1>
        <p className="mb-10 text-[1.15rem] leading-[1.55] text-wic-muted">{lead}</p>
        <div className="wic-article">{children}</div>
        <Pager slug={slug} lang={lang} />
      </main>
      <footer className="relative z-10 mx-auto max-w-[42rem] px-5 pb-[calc(env(safe-area-inset-bottom,0px)+2.5rem)] text-[0.9rem] text-wic-muted">
        <p>
          {pick(
            lang,
            "This page reflects the competition rules as of October 15, 2026. © JPSI",
            "このページは2026年10月15日時点の大会ルールにもとづく。© JPSI",
          )}
        </p>
      </footer>
    </WicPage>
  );
}
