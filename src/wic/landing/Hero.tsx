import type { CSSProperties } from "react";
import { SITE, WIC_IMAGES } from "../data";
import { pick, type WicLang } from "../lang";

const sponsors = [
  { src: WIC_IMAGES.logos.ibkr, alt: "Interactive Brokers", w: 6.2, y: "-0.16em" },
  { src: WIC_IMAGES.logos.tradingview, alt: "TradingView", w: 5.3, y: "0.055em" },
  { src: WIC_IMAGES.logos.webull, alt: "Webull Securities", w: 3.74 },
  { src: WIC_IMAGES.logos.okayasu, alt: "Okayasu Shoji Co., Ltd.", w: 5.0 },
  { src: WIC_IMAGES.logos.nsj, alt: "Nihon Securities Journal", w: 4.2 },
];

/** Rule with a centred caption, as on the printed poster. */
function StripLabel({ children }: { children: string }) {
  return (
    <p className="m-0 flex items-center gap-3 whitespace-nowrap text-[0.7rem] font-semibold text-black sm:text-[0.75rem] before:h-px before:flex-1 before:bg-black/25 before:content-[''] after:h-px after:flex-1 after:bg-black/25 after:content-['']">
      {children}
    </p>
  );
}

/** First screen: photo, title, one line of copy, the deadline, and the sponsor strip. */
export function Hero({ lang }: { lang: WicLang }) {
  return (
    <section className="flex min-h-[100svh] flex-col" aria-label="World Investment Competition 2026">
      <div className="relative flex flex-1 flex-col justify-end overflow-hidden bg-[#111] px-5 pb-10 pt-28 sm:px-8 sm:pb-14">
        <img
          src={WIC_IMAGES.hero.src}
          width={WIC_IMAGES.hero.width}
          height={WIC_IMAGES.hero.height}
          alt={pick(lang, "WIC awards ceremony: winners, judges and organizers on stage, with teams joining online on screen", "WICの表彰式。壇上に受賞者・審査員・運営、スクリーンにオンライン参加のチーム")}
          loading="eager"
          fetchPriority="high"
          className="absolute inset-0 size-full object-cover object-[50%_30%]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(0_0_0/0.65)_0%,rgb(0_0_0/0.15)_35%,rgb(0_0_0/0.35)_60%,#141414_100%)]"
        />
        <div className="relative mx-auto w-full max-w-[72rem] text-[#f2f2f2]">
          <h1 className="m-0 text-[clamp(2.6rem,9vw,6.5rem)] font-black uppercase leading-[0.92] tracking-[-0.03em]">
            World
            <br />
            Investment
            <br />
            Competition <span className="font-light">2026</span>
          </h1>
          <p className="mt-6 max-w-[34em] text-[1.05rem] leading-[1.5] text-[#f2f2f2]/85 [text-wrap:pretty] sm:text-[1.2rem]">{SITE.lead[lang]}</p>
          <p className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.95rem]">
            <span className="rounded-full border border-[#f2f2f2]/40 px-4 py-1.5 font-semibold">
              {pick(lang, "Entries close Nov 15", "応募締切 11月15日")}
            </span>
            <span className="text-[#f2f2f2]/70">{pick(lang, "Free to enter · Undergrad & grad students", "参加費無料・大学生／大学院生")}</span>
          </p>
        </div>
      </div>

      {/* 2026 sponsors are not confirmed yet; these are last year's. */}
      <div className="bg-[#f6f5f2] px-5 pb-[calc(env(safe-area-inset-bottom,0px)+1rem)] pt-4 text-[#1d1b1b] sm:px-8">
        <div className="mx-auto max-w-[720px] sm:text-[1.2rem]">
          <StripLabel>{pick(lang, "WIC2025 Sponsors", "WIC2025 協賛企業")}</StripLabel>
          <ul
            className="m-0 mt-3 grid list-none grid-cols-6 items-center justify-items-center gap-x-4 gap-y-3 p-0 sm:flex sm:justify-between sm:gap-8 [&>li:nth-child(-n+3)]:col-span-2 [&>li:nth-child(n+4)]:col-span-3"
            aria-label={pick(lang, "WIC2025 Sponsors", "WIC2025 協賛企業")}
          >
            {sponsors.map((s) => (
              <li key={s.alt} className="min-w-0">
                <img
                  src={s.src}
                  alt={s.alt}
                  className="block h-auto w-[calc(var(--w)*0.92em)] max-w-full translate-y-(--y)"
                  style={{ "--w": s.w, "--y": s.y ?? "0" } as CSSProperties}
                />
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <StripLabel>{pick(lang, "Organizer", "主催")}</StripLabel>
          </div>
          <p className="mb-0 mt-1.5 text-center text-[0.72rem] text-black">{SITE.organizer[lang]}</p>
        </div>
      </div>
    </section>
  );
}
