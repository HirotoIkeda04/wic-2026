import { NAV, SITE, wicHref } from "./data";
import { pick, type WicLang } from "./lang";

/** Footer shared by the landing and detail pages. */
export function WicFooter({ lang, note }: { lang: WicLang; note?: string }) {
  return (
    <footer className="relative z-10 border-t border-wic-line">
      <div className="mx-auto grid max-w-[72rem] gap-10 px-5 pb-[calc(env(safe-area-inset-bottom,0px)+2.5rem)] pt-14 text-[0.9rem] sm:grid-cols-[1.4fr_1fr_1fr] sm:px-8">
        <div>
          <p className="m-0 text-[1.6rem] font-black leading-none tracking-[-0.045em]">WIC</p>
          <p className="mb-0 mt-3 text-wic-muted">
            {pick(lang, "Organizer: ", "主催：")}
            {SITE.organizer[lang]}
            <br />
            {pick(lang, "AI Agent division co-host: ", "AIエージェント部門の共催：")}
            {SITE.coHost[lang]}
          </p>
        </div>
        <nav aria-label={pick(lang, "Pages", "ページ")}>
          <ul className="m-0 list-none space-y-2 p-0">
            {NAV.map((n) => (
              <li key={n.slug}>
                <a href={wicHref(lang, n.slug)} className="text-wic-ink no-underline hover:underline">{n.label[lang]}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="m-0 font-semibold">{pick(lang, "Contact", "お問い合わせ")}</p>
          <ul className="m-0 mt-2 list-none space-y-2 p-0">
            {SITE.contact.map((c) => (
              <li key={c.label}>
                <a href={c.href} className="text-wic-ink no-underline hover:underline">{c.label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-2 text-[0.8rem] text-wic-muted sm:col-span-3">
          {note && <p className="m-0">{note}</p>}
          <p className="m-0">{SITE.legal[lang]}</p>
        </div>
      </div>
    </footer>
  );
}
