import { ContactIcons } from "./ContactIcons";
import { JPSI_URL, NAV, WASEDA_AI_URL, SITE, wicHref } from "./data";
import { pick, type WicLang } from "./lang";

/**
 * Footer shared by the landing and detail pages. Right-aligned and set like
 * the bottom of the menu (WicHeader): page links, then Organizer and Contact
 * under bold labels, then the legal line.
 */
export function WicFooter({ lang, note }: { lang: WicLang; note?: string }) {
  return (
    <footer className="relative z-10 border-t border-wic-line">
      <div className="mx-auto flex max-w-[72rem] flex-col items-end gap-8 px-5 pb-[calc(env(safe-area-inset-bottom,0px)+2.5rem)] pt-12 text-right text-[0.9rem] leading-[1.55] text-wic-ink/70 sm:px-8 [&_b]:mb-[0.35rem] [&_b]:block [&_b]:font-semibold [&_b]:text-wic-ink">
        <p className="m-0 text-[1.6rem] font-black leading-none tracking-[-0.045em] text-wic-ink">WIC</p>
        <nav aria-label={pick(lang, "Pages", "ページ")}>
          <ul className="m-0 list-none space-y-2 p-0">
            {NAV.map((n) => (
              <li key={n.slug}>
                <a href={wicHref(lang, n.slug)} className="text-wic-ink no-underline hover:underline">{n.label[lang]}</a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="m-0">
          <b>{pick(lang, "Organizer", "主催")}</b>
          <a href={JPSI_URL} className="border-b border-wic-ink/35 text-wic-ink/70 no-underline hover:text-wic-ink">
            {SITE.organizer[lang]}
          </a>
          <br />
          {pick(lang, "AI Agent division co-host: ", "AIエージェント部門の共催：")}
          <a href={WASEDA_AI_URL} className="border-b border-wic-ink/35 text-wic-ink/70 no-underline hover:text-wic-ink">
            {SITE.coHost[lang]}
          </a>
        </p>
        <div>
          <b>{pick(lang, "Contact", "お問い合わせ")}</b>
          <ContactIcons className="justify-end" />
        </div>
        <div className="space-y-2 text-[0.8rem] text-wic-ink/45">
          {note && <p className="m-0">{note}</p>}
          <p className="m-0">{SITE.legal[lang]}</p>
        </div>
      </div>
    </footer>
  );
}
