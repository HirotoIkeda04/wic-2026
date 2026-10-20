import { wicHref } from "../data";
import { pick, type WicLang } from "../lang";
import { MoreLink, Section } from "./Section";

export function RulesGlance({ lang }: { lang: WicLang }) {
  const items = [
    {
      big: "Nasdaq",
      head: pick(lang, "What you trade", "取引対象"),
      body: pick(lang, "Stocks, ETFs and options listed on Nasdaq, on an Interactive Brokers demo account. Leverage up to 4x intraday.", "Nasdaq 上場の株式・ETF・オプション。Interactive Brokers のデモ口座で取引する。日中のレバレッジは最大4倍。"),
    },
    {
      big: "70 / 30",
      head: pick(lang, "How you are ranked", "順位の決まり方"),
      body: pick(lang, "Investment performance counts for 70% and your reports for 30%. Returns alone do not win.", "運用成績70%、レポート30%で順位を統合する。リターンだけでは勝てない。"),
    },
    {
      big: "−20%",
      head: pick(lang, "The one hard limit", "唯一の絶対条件"),
      body: pick(lang, "If your team's net assets close a trading day 20% below their peak, the team is out.", "取引日終了時点でチームの純資産が最高値から20%下落すると失格。"),
    },
  ];
  return (
    <Section id="rules" title={pick(lang, "The same rules for both divisions.", "ルールは両部門で共通。")}>
      <div className="grid gap-px overflow-hidden rounded-2xl border border-wic-line bg-wic-line md:grid-cols-3">
        {items.map((it) => (
          <div key={it.head} className="bg-wic-bg p-7 sm:p-8">
            <p className="m-0 text-[clamp(2.2rem,4vw,3rem)] font-semibold leading-none tracking-[-0.03em] tabular-nums">{it.big}</p>
            <h3 className="m-0 mt-5 text-[1.05rem] font-semibold">{it.head}</h3>
            <p className="m-0 mt-2 text-[0.98rem] leading-[1.55] text-wic-muted">{it.body}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-end">
        <MoreLink href={wicHref(lang, "rules")}>{pick(lang, "Full rules", "ルールの全文")}</MoreLink>
      </div>
    </Section>
  );
}
