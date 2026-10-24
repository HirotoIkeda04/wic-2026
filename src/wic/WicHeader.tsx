import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ContactIcons } from "./ContactIcons";
import { JPSI_URL, NAV, WASEDA_AI_URL, SITE, wicHref, type WicSlug } from "./data";
import { pick, type WicLang } from "./lang";
import { phaseAt } from "./landing/EntryStatus";

/**
 * Fixed header + full-screen menu overlay. Colors come from the tone tokens in
 * wic.css, so the same component sits on the dark landing page and the light
 * detail pages. `current` is the slug of the page being shown, if any.
 *
 * `hero`: on the landing page. Until the hero's title (#wic-hero-title) has gone
 * under the header, the brand steps back, the header's fade is off, and Entry
 * is an outlined button that carries the date; after it, the filled Entry.
 */
export function WicHeader({ lang, current, hero = false }: { lang: WicLang; current?: WicSlug; hero?: boolean }) {
  const [open, setOpen] = useState(false);
  const [inHero, setInHero] = useState(hero);
  const [phase] = useState(() => phaseAt(Date.now()));
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const title = document.getElementById("wic-hero-title");
    const header = ref.current;
    if (!hero || !title || !header) return;
    const check = () => setInHero(title.getBoundingClientRect().bottom >= header.offsetHeight);
    check();
    addEventListener("scroll", check, { passive: true });
    addEventListener("resize", check);
    return () => {
      removeEventListener("scroll", check);
      removeEventListener("resize", check);
    };
  }, [hero]);

  // Entry changes width between the two looks through several properties at once
  // (padding, type size, the date), which do not move in step: on their own the
  // button would jump one way and then ease back the other. So its width is
  // animated from where it is to where it will settle, measured on a copy
  // without transitions, and only ever grows or only ever shrinks.
  const entryRef = useRef<HTMLAnchorElement>(null);
  const settled = useRef(false);
  useLayoutEffect(() => {
    const el = entryRef.current;
    if (!el || !settled.current) {
      settled.current = true;
      return;
    }
    const from = el.getBoundingClientRect().width;
    const copy = el.cloneNode(true) as HTMLElement;
    copy.style.cssText = "position:absolute;visibility:hidden;transition:none";
    copy.querySelectorAll<HTMLElement>("*").forEach((n) => (n.style.transition = "none"));
    el.insertAdjacentElement("afterend", copy);
    const to = copy.getBoundingClientRect().width;
    copy.remove();
    el.animate([{ width: `${from}px` }, { width: `${to}px` }], { duration: 350, easing: "cubic-bezier(0.4, 0, 0.2, 1)" });
  }, [inHero]);

  const when = { before: pick(lang, "opens Oct 15", "10/15開始"), open: pick(lang, "by Nov 15", "11/15まで"), closed: null }[phase];

  return (
    <>
      {/* A grid, not flex with space-between: the brand's column can shrink, so the
          buttons always keep the right edge at their own width */}
      <header
        ref={ref}
        data-in-hero={inHero ? "" : undefined}
        className="wic-header pointer-events-none fixed inset-x-0 top-0 z-50 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 px-[1.1rem] pb-[0.9rem] pt-[calc(env(safe-area-inset-top,0px)+0.9rem)] *:pointer-events-auto max-[559px]:gap-x-1.5 lg:px-8"
      >
        <a
          href={wicHref(lang)}
          className={`inline-flex min-w-0 items-center gap-[0.45rem] overflow-hidden leading-none text-wic-ink no-underline transition-opacity duration-350 ${inHero ? "opacity-80 hover:opacity-100 focus-visible:opacity-100" : ""}`}
          data-brand
        >
          <span className="text-[2.05rem] font-black leading-[0.8] tracking-[-0.045em]">WIC</span>{" "}
          {/* The spaces keep the words apart in the link's text ("WIC World Investment Competition 2026"):
              one between flex items, one at the start of a line, neither takes room */}
          <span className="whitespace-nowrap text-[0.68rem] font-bold uppercase leading-[1.1]">
            World Investment
            <br /> Competition 2026
          </span>
        </a>
        <div className="flex items-center gap-[0.6rem] max-[559px]:gap-[0.45rem]">
          {/* The date opens from nothing (a grid column from 0fr to 1fr) rather than popping
              in; the button's own width is animated in the effect above */}
          <a
            ref={entryRef}
            href={SITE.entryUrl}
            className={`inline-flex h-9 items-center overflow-hidden whitespace-nowrap rounded-full border text-[0.95rem] font-semibold no-underline transition-[background-color,color,border-color,padding,font-size] duration-350 ${
              inHero
                ? "border-wic-ink/45 bg-wic-bg/35 px-[18px] text-wic-ink backdrop-blur-[6px] max-[559px]:px-3 max-[559px]:text-[0.84rem]"
                : "border-wic-ink bg-wic-ink px-6 text-wic-bg"
            }`}
          >
            {pick(lang, "Entry", "応募")}
            {/* Below 387px the brand and the dated button no longer fit side by side: the date gives way */}
            {hero && when && (
              <span
                aria-hidden={inHero ? undefined : true}
                className={`grid transition-[grid-template-columns,opacity] duration-350 max-[386px]:hidden ${inHero ? "grid-cols-[1fr] opacity-100" : "grid-cols-[0fr] opacity-0"}`}
              >
                <span className="min-w-0 overflow-hidden pl-[0.35em] text-[0.76rem] font-light tracking-[0.01em] text-wic-ink/80 max-[559px]:pl-[0.3em] max-[559px]:text-[0.66rem]">
                  {" "}
                  {when}
                </span>
              </span>
            )}
          </a>
          <button
            type="button"
            className="group grid size-9 cursor-pointer place-items-center rounded-full border border-wic-ink/45 bg-wic-bg/50 text-wic-ink backdrop-blur-[6px]"
            aria-label={open ? pick(lang, "Close menu", "メニューを閉じる") : pick(lang, "Menu", "メニュー")}
            aria-expanded={open}
            aria-controls="wic-nav"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="relative block h-px w-4 bg-current transition-[background,transform] duration-250 group-aria-expanded:bg-transparent before:absolute before:left-0 before:-top-[5px] before:block before:h-px before:w-4 before:bg-current before:transition-transform before:duration-250 before:content-[''] after:absolute after:left-0 after:top-[5px] after:block after:h-px after:w-4 after:bg-current after:transition-transform after:duration-250 after:content-[''] group-aria-expanded:before:translate-y-[5px] group-aria-expanded:before:rotate-45 group-aria-expanded:after:-translate-y-[5px] group-aria-expanded:after:-rotate-45" />
          </button>
        </div>
      </header>

      <nav
        id="wic-nav"
        aria-label={pick(lang, "Menu", "メニュー")}
        className={`fixed inset-0 z-40 flex-col overflow-y-auto bg-wic-bg/95 pt-[calc(env(safe-area-inset-top,0px)+4.6rem)] text-right backdrop-blur-[10px] ${open ? "flex" : "hidden"}`}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a")) setOpen(false);
        }}
      >
        <div className="flex-none px-6 pb-[1.4rem]">
          {NAV.map((item) => (
            <a
              key={item.slug}
              href={wicHref(lang, item.slug)}
              aria-current={item.slug === current ? "page" : undefined}
              className="block border-b border-wic-line py-[0.45em] text-[1.25rem] text-wic-ink no-underline last:border-b-0 aria-[current=page]:font-semibold"
            >
              {item.label[lang]}
            </a>
          ))}
        </div>
        <div className="mt-auto flex-none border-t border-wic-line px-6 pb-[calc(env(safe-area-inset-bottom,0px)+1.2rem)] pt-[1.3rem] text-[0.84rem] leading-[1.55] text-wic-ink/70 [&_b]:mb-[0.35rem] [&_b]:block [&_b]:text-wic-ink">
          <p className="mb-[0.9rem]">
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
          <div className="mb-[0.9rem]">
            <b>{pick(lang, "Contact", "お問い合わせ")}</b>
            <ContactIcons className="justify-end" />
          </div>
          <p className="text-[0.74rem] text-wic-ink/45">{SITE.legal[lang]}</p>
        </div>
      </nav>
    </>
  );
}
