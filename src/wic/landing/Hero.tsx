import type { CSSProperties, ReactNode } from "react";
import { WIC_IMAGES } from "../data";
import { pick, type WicLang } from "../lang";
import type { HeroSlide } from "./HeroSlides";

/** The hero's photos, for the HeroSlides island: where each is held on phones
 *  and from lg up, and how much the oval behind the words darkens it. */
export function heroSlides(lang: WicLang): HeroSlide[] {
  return [
    {
      src: WIC_IMAGES.hero.src,
      srcSet: WIC_IMAGES.posterSrcSet,
      alt: pick(lang, "WIC awards ceremony: winners, judges and organizers on stage", "WICの表彰式。壇上に受賞者・審査員・運営"),
      pos: "58% 62%",
      posLg: "50% 64%",
      veil: 0.15,
    },
    {
      ...WIC_IMAGES.champions2025,
      alt: pick(lang, "The 2025 champions with the trophy", "2025年の優勝チームとトロフィー"),
      pos: "50% 60%",
      posLg: "50% 10%",
      veil: 0,
    },
    {
      ...WIC_IMAGES.closing2025,
      alt: pick(lang, "WIC2025 closing ceremony, with teams joining online on the screen behind", "WIC2025の閉会式。後ろのスクリーンにオンライン参加のチーム"),
      pos: "50% 70%",
      posLg: "50% 62%",
      veil: 0.5,
    },
  ];
}

/** `w`: display width in px at --k 1; `dy`: how far the file's wordmark sits off
 *  its own middle (measured), so the wordmarks share one centre line. */
const sponsors: { src: string; width: number; height: number; alt: string; w: number; dy: number }[] = [
  { ...WIC_IMAGES.logos.ibkr, alt: "Interactive Brokers", w: 120, dy: -3.75 },
  { ...WIC_IMAGES.logos.tradingview, alt: "TradingView", w: 100, dy: 1.25 },
];

/** An eased ramp (half a cosine) between two alphas of the page's black, as gradient stops between two positions in %. */
function ramp(from: number, to: number, a0: number, a1: number, n = 10) {
  return Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n;
    const e = 0.5 - 0.5 * Math.cos(Math.PI * t);
    return `rgb(12 11 11 / ${(a0 + (a1 - a0) * e).toFixed(3)}) ${(from + (to - from) * t).toFixed(1)}%`;
  }).join(", ");
}

/** Black at the top behind the header and the words, clear by two thirds down, then into black at the foot under the sponsors. */
const SHADE = [
  `linear-gradient(to bottom, ${ramp(0, 67, 1, 0)}, rgb(12 11 11 / 0) 100%)`,
  `linear-gradient(to bottom, rgb(12 11 11 / 0) 0%, ${ramp(72, 100, 0, 1)})`,
].join(", ");

/**
 * First screen: the photos taking turns, the name set flush left near the top,
 * and the sponsors along the foot. `slides`: the HeroSlides island, given heroSlides(lang).
 */
export function Hero({ lang, slides }: { lang: WicLang; slides: ReactNode }) {
  return (
    // --k scales the sponsor logos and their cells: a step up from lg
    <section
      className="relative isolate h-svh min-h-[620px] overflow-hidden bg-[#0c0b0b] [--k:1] lg:[--k:1.25]"
      aria-label="World Investment Competition 2026"
      aria-roledescription="carousel"
    >
      {slides}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: SHADE }} />
      {/* Film grain (--wic-noise in wic.css) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-10 [background-image:var(--wic-noise)] [background-size:180px]" />

      {/* The words, under the header's left edge. Their middle sits 96px above 35% of
          the screen's height, but never closer than 16px under the header (--top):
          the box runs from --top to twice that middle, and `safe center` falls back
          to the top when the words are taller than the box. */}
      <div className="absolute inset-x-0 top-(--top) z-10 grid h-[max(0px,calc(70%-192px-2*var(--top)))] content-center-safe justify-items-start px-[1.1rem] [--top:calc(env(safe-area-inset-top,0px)+1.8rem+36px+16px)] [text-shadow:0_1px_24px_rgb(0_0_0/0.7)] lg:px-8">
        {/* The organiser and the year. The rule is drawn, not typed, so the text reads
            "JPSI 2026": the space is whitespace inside a flex box and takes no room. */}
        <p className="m-0 mb-3.5 inline-flex items-center gap-[0.6em] text-[0.82rem] leading-none text-[#f2f2f2]">
          <b className="text-[1.5em] font-bold tracking-[-0.03em]">JPSI</b>
          <i aria-hidden="true" className="h-[1.3em] w-px bg-[#f2f2f2]/55" />{" "}
          <span className="text-[1.2em] font-light tracking-[0.02em]">2026</span>
        </p>
        {/* The header watches this title: once it has gone under the header, the hero is behind */}
        <h1
          id="wic-hero-title"
          className="m-0 max-w-[9.5em] text-[clamp(2.3rem,8.6vw,4.4rem)] font-semibold leading-[1.04] tracking-[-0.028em] text-white [text-wrap:balance]"
        >
          World Investment Competition
        </h1>
        <p className="m-0 mt-1 text-[clamp(0.9rem,2.3vw,1rem)] leading-[1.35] text-[#f2f2f2]/92">
          {pick(lang, "For undergrad & grad students", "大学生・大学院生が対象")}
        </p>
      </div>

      {/* The sponsors confirmed for 2026 so far; more may join, none will drop out.
          The label at the gutter, each sponsor in a cell of its own; from 560px the
          cells sit on the page's centre line, under the progress marks. Logos are
          shown in white, the colour Interactive Brokers' guidelines allow on dark. */}
      <div className="absolute inset-x-0 bottom-[calc(env(safe-area-inset-bottom,0px)+18px)] z-10 grid grid-cols-[auto_1fr] items-center gap-x-3 px-[1.1rem] text-[0.72rem] tracking-[0.01em] text-[#f2f2f2]/60 min-[560px]:grid-cols-[1fr_auto_1fr] lg:px-8">
        <span className="justify-self-start">{pick(lang, "Sponsors", "協賛")}</span>
        <ul className="m-0 grid list-none auto-cols-[minmax(0,calc(160px*var(--k)))] grid-flow-col justify-center p-0" aria-label={pick(lang, "Sponsors", "協賛企業")}>
          {sponsors.map((s) => (
            <li key={s.alt} className="flex h-[calc(32px*var(--k))] min-w-0 items-center justify-center">
              <img
                src={s.src}
                width={s.width}
                height={s.height}
                alt={s.alt}
                className="block h-auto w-[calc(var(--w)*var(--k))] max-w-full translate-y-[calc(var(--dy)*var(--k))] opacity-90 [filter:brightness(0)_invert(0.95)]"
                style={{ "--w": `${s.w}px`, "--dy": `${s.dy}px` } as CSSProperties}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
