"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Pager } from "./Pager";
import { WicFooter } from "./WicFooter";
import { WicHeader } from "./WicHeader";
import { WicPage } from "./WicPage";
import { wicHref, type WicSlug } from "./data";
import { pick, type WicLang } from "./lang";

export type DetailMeta = { title: string; lead: string };

type TocItem = { id: string; text: string };

/**
 * Light text page: header, back link, title, lead, article body with a
 * table of contents beside it on wide screens, pager, footer.
 * The body is plain HTML styled by `.wic-article` in wic.css.
 */
export function DetailPage({
  slug,
  lang,
  title,
  lead,
  children,
}: DetailMeta & { slug: WicSlug; lang: WicLang; children: ReactNode }) {
  const articleRef = useRef<HTMLDivElement>(null);
  const [toc, setToc] = useState<TocItem[]>([]);

  useEffect(() => {
    // Give every h2 an id so it can be linked to, then list them
    const items: TocItem[] = [];
    articleRef.current!.querySelectorAll("h2").forEach((h, i) => {
      if (!h.id) h.id = `s${i + 1}`;
      items.push({ id: h.id, text: h.textContent ?? "" });
    });
    setToc(items);
  }, []);

  return (
    <WicPage tone="light" lang={lang}>
      <WicHeader lang={lang} current={slug} />
      <div className="wic-grain" aria-hidden="true" />
      <div className="relative z-10 mx-auto grid max-w-[64rem] gap-x-16 px-5 pb-20 pt-[calc(env(safe-area-inset-top,0px)+6.5rem)] lg:grid-cols-[minmax(0,42rem)_1fr]">
        <main className="text-[17px] leading-[1.6]">
          <a
            href={wicHref(lang)}
            className="-ml-[0.2em] inline-flex min-h-11 items-center gap-[0.3em] text-[0.95rem] font-medium text-wic-ink no-underline hover:underline hover:underline-offset-[0.2em]"
          >
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" className="flex-none">
              <path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {pick(lang, "Top", "トップ")}
          </a>
          <h1 className="mb-3 mt-2.5 text-[clamp(2.2rem,8vw,3.2rem)] font-semibold leading-[1.05] tracking-[-0.025em]">{title}</h1>
          <p className="mb-10 text-[1.15rem] leading-[1.55] text-wic-muted">{lead}</p>
          <div className="wic-article" ref={articleRef}>{children}</div>
          <Pager slug={slug} lang={lang} />
        </main>
        {toc.length > 1 && (
          <nav aria-label={pick(lang, "On this page", "このページの内容")} className="hidden lg:block">
            <div className="sticky top-28 border-l border-wic-line pl-5 text-[0.88rem]">
              <p className="mb-3 mt-0 font-semibold">{pick(lang, "On this page", "このページの内容")}</p>
              <ul className="m-0 list-none space-y-2 p-0">
                {toc.map((t) => (
                  <li key={t.id}>
                    <a href={`#${t.id}`} className="text-wic-muted no-underline hover:text-wic-ink">{t.text}</a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        )}
      </div>
      <WicFooter
        lang={lang}
        note={pick(
          lang,
          "This page reflects the competition rules as of October 15, 2026.",
          "このページは2026年10月15日時点の大会ルールにもとづく。",
        )}
      />
    </WicPage>
  );
}
