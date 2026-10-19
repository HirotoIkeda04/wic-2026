import { NAV, wicHref, type WicSlug } from "./data";
import { pick, type WicLang } from "./lang";

/** Previous / next links between the detail pages, in NAV order. */
export function Pager({ slug, lang }: { slug: WicSlug; lang: WicLang }) {
  const i = NAV.findIndex((n) => n.slug === slug);
  const prev = NAV[i - 1];
  const next = NAV[i + 1];
  return (
    <nav
      className="mt-16 flex justify-between gap-4 border-t border-wic-line pt-6 [&_a]:text-wic-ink [&_a]:no-underline [&_span]:block [&_span]:text-[0.85rem] [&_span]:text-wic-muted"
      aria-label={pick(lang, "Pages", "ページ")}
    >
      {prev && (
        <a href={wicHref(lang, prev.slug)}>
          <span>{pick(lang, "Previous", "前へ")}</span>
          {prev.label[lang]}
        </a>
      )}
      {next ? (
        <a href={wicHref(lang, next.slug)} className="ml-auto text-right">
          <span>{pick(lang, "Next", "次へ")}</span>
          {next.label[lang]}
        </a>
      ) : (
        <a href={wicHref(lang)} className="ml-auto text-right">
          <span>{pick(lang, "Back to", "戻る")}</span>
          {pick(lang, "Top", "トップ")}
        </a>
      )}
    </nav>
  );
}
