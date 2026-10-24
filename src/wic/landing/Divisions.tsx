import type { ReactNode } from "react";
import { wicHref, type WicSlug } from "../data";
import { pick, type WicLang } from "../lang";
import { MoreLink, Section } from "./Section";

/** `market`: how the card's band draws the shared price series (see MarketBackdrop). */
type Card = { slug: WicSlug; market: "chart" | "ascii"; name: string; facts: [string, string][]; note?: string };

/** The division colours of the schedule (red for traders, purple for agents) fill the chart band,
 *  in the schedule's lighter fills; the pill's small type keeps the deeper originals. */
const TONE: Record<Card["market"], { band: string; pill: string }> = {
  chart: { band: "bg-[#cf5e62]", pill: "bg-[#f2f2f2] text-[#c4484f]" },
  ascii: { band: "bg-[#8369cb]", pill: "bg-[#f2f2f2] text-[#7656c2]" },
};

/** `chart` and `ascii`: the MarketBackdrop islands of the two cards. */
export function Divisions({ lang, chart, ascii }: { lang: WicLang; chart: ReactNode; ascii: ReactNode }) {
  const backdrop = { chart, ascii };
  const cards: Card[] = [
    {
      slug: "trader",
      market: "chart",
      name: pick(lang, "Trader division", "トレーダー部門"),
      facts: [
        [pick(lang, "Team", "チーム"), pick(lang, "3 students", "3名")],
        [pick(lang, "Account", "口座"), pick(lang, "$1M demo account per member", "メンバーごとに100万ドルのデモ口座")],
        [pick(lang, "Platform", "取引環境"), pick(lang, "Trader Workstation (TWS) with real-time data", "Trader Workstation（TWS）、リアルタイムデータ")],
        [pick(lang, "Live trading", "本番取引"), pick(lang, "Jan 4 – Mar 25, 2027", "2027年1月4日〜3月25日")],
      ],
    },
    {
      slug: "ai-agent",
      market: "ascii",
      name: pick(lang, "AI Agent division", "AIエージェント部門"),
      facts: [
        [pick(lang, "Team", "チーム"), pick(lang, "1 – 3 students", "1〜3名")],
        [pick(lang, "Account", "口座"), pick(lang, "One $1M demo account per team", "チームで100万ドルのデモ口座1つ")],
        [pick(lang, "Agent", "エージェント"), pick(lang, "An LLM in the loop, no human trades. LLM usage paid by the organizers.", "LLMを組み込み、人は取引しない。LLMの利用料は運営が負担。")],
        [pick(lang, "Live trading", "本番取引"), pick(lang, "Feb 1 – Mar 25, 2027", "2027年2月1日〜3月25日")],
      ],
      note: pick(lang, "New in 2026. Up to 15 teams.", "2026年新設。最大15チーム。"),
    },
  ];
  return (
    <Section
      id="divisions"
      title={pick(lang, "Divisions", "部門")}
      lead={pick(lang, "Trade yourself, or build an agent that trades.", "自分で取引するか、取引するエージェントをつくるか。")}
    >
      <div className="grid gap-5 md:grid-cols-2">
        {cards.map((c) => (
          <article key={c.slug} className="flex flex-col overflow-hidden rounded-2xl border border-wic-line bg-wic-ink/[0.03]">
            {/* The division name over the same market, read as a chart (trader) or as characters (agent) */}
            {/* Darker at the card's top edge, fading out by the middle of the band */}
            <div className={`flex flex-col bg-[linear-gradient(to_bottom,rgb(0_0_0/0.1),rgb(0_0_0/0)_55%)] ${TONE[c.market].band}`}>
              <div className="flex items-center justify-between gap-4 pl-5 pr-7 pt-6 sm:pl-7 sm:pr-9 sm:pt-8">
                <h3 className="m-0 text-[1.6rem] font-semibold tracking-[-0.02em] text-[#f2f2f2]">{c.name}</h3>
                {c.note && <span className={`whitespace-nowrap rounded-full px-3 py-1 text-[0.75rem] font-semibold ${TONE[c.market].pill}`}>{pick(lang, "New", "新設")}</span>}
              </div>
              <div className="relative h-40 sm:h-48">
                {backdrop[c.market]}
              </div>
            </div>
            <div className="flex flex-1 flex-col px-7 pb-7 pt-3 sm:px-9 sm:pb-9 sm:pt-4">
              <dl className="m-0 flex-1 divide-y divide-wic-line">
                {c.facts.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[7rem_1fr] gap-4 py-3.5">
                    <dt className="text-[0.88rem] text-wic-muted">{k}</dt>
                    <dd className="m-0 text-[0.98rem] leading-[1.45]">{v}</dd>
                  </div>
                ))}
              </dl>
              {c.note && <p className="mb-0 mt-5 text-[0.9rem] text-wic-muted">{c.note}</p>}
              <div className="mt-7 flex justify-end">
                <MoreLink href={wicHref(lang, c.slug)}>{pick(lang, "Read more", "詳しく見る")}</MoreLink>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
