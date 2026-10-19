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

/**
 * Darkens the top of the photo a little for the header, and fades its bottom
 * into the black under it. The stops follow an eased curve rather than a
 * straight line, so the edge of the fade is not visible.
 */
const EASE = [1, 0.738, 0.541, 0.382, 0.278, 0.194, 0.126, 0.075, 0.042, 0.021, 0.008, 0.002, 0];
function fade(from: number, to: number, max = 1) {
  return EASE.map((a, i) => `rgb(12 11 11 / ${(a * max).toFixed(3)}) ${(from + ((to - from) * i) / (EASE.length - 1)).toFixed(1)}%`);
}
const PHOTO_FADE = `linear-gradient(to bottom, ${[...fade(0, 18, 0.6), ...fade(100, 45).reverse()].join(", ")})`;

/** Black into the paper colour of the sponsor strip, eased at both ends (a cosine curve). */
const STRIP_FADE = `linear-gradient(to bottom, ${Array.from({ length: 17 }, (_, i) => {
  const t = i / 16;
  const a = 0.5 + 0.5 * Math.cos(Math.PI * t); // 1 → 0, flat at both ends
  const mix = (dark: number, light: number) => Math.round(light + (dark - light) * a);
  return `rgb(${mix(12, 246)} ${mix(11, 245)} ${mix(11, 242)}) ${(100 * t).toFixed(1)}%`;
}).join(", ")})`;

const stripLabel = "self-stretch flex items-center border-r border-black/20 pr-5 text-[0.62rem] text-black/70 sm:pr-8 sm:text-[0.68rem]";

/** First screen: photo, title, the deadline, and a strip with last year's sponsor logos, the organizer and the co-host. */
export function Hero({ lang }: { lang: WicLang }) {
  return (
    <section className="flex flex-col" aria-label="World Investment Competition 2026">
      <div className="bg-[#0c0b0b]">
        {/* The photo starts at the top, under the header. Phones get a taller
            crop around the stage; wider screens show it at its natural height. */}
        <div className="relative aspect-[1/1.05] overflow-hidden sm:aspect-auto">
          <img
            src={WIC_IMAGES.hero.src}
            width={WIC_IMAGES.hero.width}
            height={WIC_IMAGES.hero.height}
            alt={pick(lang, "WIC awards ceremony: winners, judges and organizers on stage, with teams joining online on screen", "WICの表彰式。壇上に受賞者・審査員・運営、スクリーンにオンライン参加のチーム")}
            loading="eager"
            fetchPriority="high"
            className="block size-full object-cover object-[58%_0%] sm:h-auto"
          />
          <div aria-hidden="true" className="absolute inset-0" style={{ background: PHOTO_FADE }} />
        </div>
        <div className="relative mx-auto w-full max-w-[72rem] px-5 pb-10 text-[#f2f2f2] sm:px-8 sm:pb-14">
          <h1 className="mx-0 -mt-[1.1em] mb-0 text-[clamp(2.6rem,9vw,6.5rem)] font-black uppercase leading-[0.92] tracking-[-0.03em]">
            World
            <br />
            Investment
            <br />
            Competition <span className="font-light">2026</span>
          </h1>
          <p className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.95rem]">
            <span className="rounded-full border border-[#f2f2f2]/40 px-4 py-1.5 font-semibold">
              {pick(lang, "Entries close Nov 15", "応募締切 11月15日")}
            </span>
            <span className="text-[#f2f2f2]/70">{pick(lang, "Free to enter · Undergrad & grad students", "参加費無料・大学生／大学院生")}</span>
          </p>
        </div>
      </div>

      {/* Black to paper, with grain (--wic-noise in wic.css) so the change of tone has no clean edge */}
      <div aria-hidden="true" className="relative z-10 -mb-px h-12 sm:h-16" style={{ background: STRIP_FADE }}>
        {/* The grain is strongest mid-way and fades out at both ends, so it leaves no seam */}
        <div className="absolute inset-0 opacity-50 [background-image:var(--wic-noise)] [background-size:160px] [mask-image:linear-gradient(to_bottom,transparent,black_35%,black_65%,transparent)]" />
      </div>

      {/* 2026 sponsors are not confirmed yet; these are last year's. */}
      <div className="bg-[#f6f5f2] px-5 py-5 text-[#1d1b1b] sm:px-8">
        {/* Two rows, each a label on the left and its content to the right. The
            sponsor logos sit in equal cells: 3 + 2 on phones, one row of 5 from sm up. */}
        <dl className="mx-auto my-0 grid max-w-[72rem] grid-cols-[auto_1fr] items-center gap-x-5 gap-y-4 sm:gap-x-8 sm:text-[1.2rem]">
          <dt className={stripLabel}>{pick(lang, "Sponsors", "協賛")}</dt>
          <dd className="m-0 min-w-0">
            <ul
              className="m-0 grid list-none grid-cols-3 items-center justify-items-center gap-x-4 gap-y-4 p-0 sm:grid-cols-5 sm:gap-x-8"
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
          </dd>
          <dt className={stripLabel}>{pick(lang, "Organizer", "主催")}</dt>
          <dd className="m-0 text-[0.62rem] text-black sm:text-[0.68rem]">JPSI</dd>
          <dt className={stripLabel}>{pick(lang, "Co-host", "共催")}</dt>
          <dd className="m-0 text-[0.62rem] text-black sm:text-[0.68rem]">
            {SITE.coHost[lang]}
            <span className="text-black/55">{pick(lang, " (AI Agent division)", "（AIエージェント部門）")}</span>
          </dd>
        </dl>
      </div>
    </section>
  );
}
