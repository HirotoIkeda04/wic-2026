"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { WicHeader } from "./WicHeader";
import { WicPage } from "./WicPage";
import { NAV, SITE, WIC_IMAGES, wicHref, type WicSlug } from "./data";
import { SCROLL_VH, startHero } from "./hero";
import { pick, type WicLang } from "./lang";

const sponsors = [
  { src: WIC_IMAGES.logos.ibkr, alt: "Interactive Brokers", w: 6.2, y: "-0.16em" },
  { src: WIC_IMAGES.logos.tradingview, alt: "TradingView", w: 5.3, y: "0.055em" },
  { src: WIC_IMAGES.logos.webull, alt: "Webull Securities", w: 3.74 },
  { src: WIC_IMAGES.logos.okayasu, alt: "Okayasu Shoji Co., Ltd.", w: 5.0 },
  { src: WIC_IMAGES.logos.nsj, alt: "Nihon Securities Journal", w: 4.2 },
];

/* Illustrations for the five small circles, in NAV order */
const photos = NAV.map((n) => WIC_IMAGES.circles[n.slug]);

const blurb = "m-0 text-[0.86rem] leading-[1.5] text-wic-muted [text-wrap:pretty] [&+p]:mt-[0.55em] [&_b]:text-wic-ink";
const scheduleList =
  "m-0 grid grid-cols-[max-content_1fr] gap-x-[0.9em] gap-y-[0.3em] text-[0.86rem] leading-[1.4] [&_dd]:m-0 [&_dd]:text-wic-muted [&_dt]:font-semibold [&_dt]:text-wic-ink [&_dt]:tabular-nums";
// No pointer-events here: the link inherits it from .note, which hero.ts turns
// off while the blurb is faded out.
const more =
  "mt-[0.9em] inline-flex items-center gap-2 rounded-full border border-wic-paper/55 px-4 py-2 text-[0.82rem] text-wic-ink no-underline hover:border-wic-ink";

const blurbs: Record<WicLang, Record<WicSlug, React.ReactNode>> = {
  en: {
    trader: (
      <>
        <p className={blurb}>Teams of three, each member trading their own <b>$1M</b> account in TWS.</p>
        <p className={blurb}>The 1st-place team wins <b>flights to Japan</b>.</p>
      </>
    ),
    "ai-agent": (
      <>
        <p className={blurb}>Teams of one to three build an agent that <b>trades by itself</b>, with an LLM in the loop.</p>
        <p className={blurb}>New in 2026. Up to <b>15 teams</b>. The organizers pay for LLM usage.</p>
      </>
    ),
    rules: (
      <>
        <p className={blurb}>Both divisions: Nasdaq stocks, ETFs and options on a demo account. Returns count for <b>70%</b>, reports for <b>30%</b>.</p>
        <p className={blurb}>If your team&apos;s net assets end a trading day <b>20% below their peak</b>, the team is out.</p>
      </>
    ),
    schedule: (
      <dl className={scheduleList}>
        <dt>Nov 15</dt><dd>Entries close</dd>
        <dt>Dec 7</dt><dd>Opening ceremony</dd>
        <dt>Jan 4</dt><dd>Trading begins</dd>
        <dt>Feb 1</dt><dd>AI Agent trading begins</dd>
        <dt>Mar 25</dt><dd>Trading ends</dd>
        <dt>Mar 31</dt><dd>Reports due</dd>
      </dl>
    ),
    past: (
      <>
        <p className={blurb}>Last year, <b>16 universities from 9 countries</b> took part.</p>
        <p className={blurb}>See the full results and the winning teams of WIC2025 and WIC2024.</p>
      </>
    ),
  },
  ja: {
    trader: (
      <>
        <p className={blurb}>3名1チーム。各メンバーが自身の<b>100万ドル</b>の口座をTrader Workstation（TWS）で取引する。</p>
        <p className={blurb}>1位のチームには<b>日本への航空券</b>が贈られる。</p>
      </>
    ),
    "ai-agent": (
      <>
        <p className={blurb}>1〜3名1チーム。LLMを組み込み、<b>人の手を介さず自律的に取引する</b>エージェントを開発する。</p>
        <p className={blurb}>2026年新設。最大<b>15チーム</b>。LLMの利用料は運営が負担する。</p>
      </>
    ),
    rules: (
      <>
        <p className={blurb}>両部門共通：デモ口座でNasdaqの株式・ETF・オプションを取引する。配点は運用成績が<b>70%</b>、レポートが<b>30%</b>。</p>
        <p className={blurb}>取引日終了時点でチームの純資産が<b>最高値から20%以上下落</b>した場合、そのチームは失格となる。</p>
      </>
    ),
    schedule: (
      <dl className={scheduleList}>
        <dt>11月15日</dt><dd>エントリー締切</dd>
        <dt>12月7日</dt><dd>開会式</dd>
        <dt>1月4日</dt><dd>取引開始</dd>
        <dt>2月1日</dt><dd>AIエージェント部門の取引開始</dd>
        <dt>3月25日</dt><dd>取引終了</dd>
        <dt>3月31日</dt><dd>レポート提出期限</dd>
      </dl>
    ),
    past: (
      <>
        <p className={blurb}>昨年は<b>9か国16大学</b>が参加した。</p>
        <p className={blurb}>WIC2025およびWIC2024の全結果と優勝チームを確認できる。</p>
      </>
    ),
  },
};

/** Keep a trailing 部門 on one line, so a long Japanese label breaks before it. */
function headingLabel(label: string) {
  const m = /^(.+)(部門)$/.exec(label);
  return m ? <>{m[1]}<span className="whitespace-nowrap">{m[2]}</span></> : label;
}

/**
 * Landing page: a WebGL metaball scene (hero.ts) with the poster rendered as
 * HTML and clipped to the big circle, plus one heading and blurb per small
 * circle that the animation positions every frame.
 */
export function Landing({ lang }: { lang: WicLang }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const hero = startHero(canvasRef.current!, photos);
    const brand = document.querySelector<HTMLAnchorElement>("[data-brand]");
    const toTop = (e: Event) => { e.preventDefault(); hero?.toTop(); };
    brand?.addEventListener("click", toTop);
    return () => {
      brand?.removeEventListener("click", toTop);
      hero?.stop();
    };
  }, []);

  return (
    <WicPage tone="dark" lang={lang}>
      <WicHeader lang={lang} />
      <canvas ref={canvasRef} id="gl" className="fixed inset-0 block h-full w-full" />

      {/* Poster: HTML content clipped to the big circle by the animation */}
      <section className="wic-poster" id="poster" aria-label="World Investment Competition 2026">
        <div className="p-in" id="pIn">
          <div className="p-stage">
            <img
              src={WIC_IMAGES.hero.src}
              width={WIC_IMAGES.hero.width}
              height={WIC_IMAGES.hero.height}
              alt={pick(lang, "WIC awards ceremony: winners, judges and organizers on stage, with teams joining online on screen", "WICの表彰式。壇上に受賞者・審査員・運営、スクリーンにオンライン参加のチーム")}
              loading="eager"
              fetchPriority="high"
            />
            <div className="p-titles">
              <h1 className="p-title" id="pTitle"><span>World</span><span>Investment</span><span>Competition</span></h1>
            </div>
          </div>
          <div className="p-dim" id="pDim" aria-hidden="true" />
          <div className="p-panel">
            <div className="p-facts">
              <p className="p-lead">{SITE.lead[lang]}</p>
              <div className="p-stats">
                <div className="p-stat"><span className="n">{pick(lang, "Free", "無料")}</span><span className="l">{pick(lang, "to enter", "参加費")}</span><span className="s">{pick(lang, "Undergrad & grad students", "大学生・大学院生")}</span></div>
                <div className="p-stat"><span className="n">$10,000</span><span className="l">{pick(lang, "in prizes", "相当の賞品")}</span><span className="s">{pick(lang, "incl. flights to Japan", "日本への航空券を含む")}</span></div>
                <div className="p-stat"><span className="n">{pick(lang, "Jan–Mar", "1〜3月")}</span><span className="l">{pick(lang, "2027 trading period", "2027年の取引期間")}</span><span className="s">{pick(lang, "Entries close Nov 15", "応募締切 11月15日")}</span></div>
              </div>
              <div className="p-divs">
                <div className="p-dv"><span className="n">{pick(lang, "Trader division", "トレーダー部門")}</span><span className="l">{pick(lang, "You trade.", "自身で取引する。")}</span><span className="s">{pick(lang, "Teams of 3", "3名1チーム")}</span></div>
                <div className="p-dv"><span className="n">{pick(lang, "AI Agent division", "AIエージェント部門")}</span><span className="l">{pick(lang, "Your agent trades.", "エージェントが自律的に取引する。")}</span><span className="s">{pick(lang, "Teams of 1–3", "1〜3名1チーム")}</span></div>
              </div>
            </div>
            <div className="p-strip">
              {/* 2026 sponsors are not confirmed yet; these are last year's. */}
              <p className="p-sk">{pick(lang, "WIC2025 Sponsors", "WIC2025 協賛企業")}</p>
              <ul className="p-spons" aria-label={pick(lang, "WIC2025 Sponsors", "WIC2025 協賛企業")}>
                {sponsors.map((s) => (
                  <li key={s.alt}>
                    <img src={s.src} alt={s.alt} style={{ "--w": s.w, "--y": s.y } as CSSProperties} />
                  </li>
                ))}
              </ul>
              <p className="p-sk p-sk2">{pick(lang, "Organizer", "主催")}</p>
              <p className="p-by">{SITE.organizer[lang]}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Only exists to give the page scroll height for the animation */}
      <div className="track" style={{ height: `${SCROLL_VH + 100}vh` }} />

      {/* Heading beside the big circle after zoom-out */}
      <div
        className="pointer-events-none fixed left-0 top-0 z-20 text-wic-paper opacity-0 will-change-[transform,opacity] [text-shadow:0_0_0.5em_rgb(0_0_0/0.6)]"
        id="heroLabel"
      >
        <h2 className="m-0 whitespace-nowrap font-semibold leading-[1.05] tracking-[-0.02em]">World Investment<br />Competition 2026</h2>
        <p className="mt-[0.55em] text-base text-wic-paper/75">{pick(lang, "The Investment Olympics.", "投資のオリンピック。")}</p>
      </div>

      {/* One heading + blurb per small circle; hero.ts positions them every frame */}
      <div id="sections">
        {NAV.map((item) => (
          <section className="sec" data-slug={item.slug} key={item.slug}>
            <div className="title pointer-events-none fixed left-0 top-0 z-20 origin-top-left text-wic-paper opacity-0 will-change-[transform,opacity] [text-shadow:0_0_0.4em_rgb(0_0_0/0.35)]">
              <h2 className="m-0 text-[1em] font-semibold leading-[1.02] tracking-[-0.02em]">{headingLabel(item.label[lang])}</h2>
            </div>
            <div className="note pointer-events-none fixed left-0 top-0 z-20 opacity-0 will-change-[transform,opacity]">
              {blurbs[lang][item.slug]}
              <a className={more} href={wicHref(lang, item.slug)}>{pick(lang, "Read more", "詳しく見る")} <span aria-hidden="true">→</span></a>
            </div>
          </section>
        ))}
      </div>

      <p className="fixed inset-0 hidden place-items-center p-8 text-center" id="error">
        {pick(lang, "This browser does not support WebGL, so the animation cannot be shown.", "このブラウザはWebGLに対応していないため、アニメーションを表示できない。")}
      </p>
    </WicPage>
  );
}
