import type { ReactNode } from "react";
import { pick, type WicLang } from "../lang";
import { Section } from "./Section";

/** `figure`: the SlotNumber island that rolls the prize total. */
export function Prize({ lang, figure }: { lang: WicLang; figure: ReactNode }) {
  const prizes = [
    {
      who: pick(lang, "Trader division, 1st place", "トレーダー部門 1位"),
      what: pick(lang, "Round-trip flights to Japan for all three members", "チーム3名分の日本への往復航空券"),
    },
    {
      who: pick(lang, "Trader division, MVP", "トレーダー部門 MVP"),
      what: pick(lang, "TradingView Premium for one year, for the individual with the highest return", "個人で最も高いリターンを上げた1名に TradingView Premium 1年分"),
    },
    {
      who: pick(lang, "AI Agent division, 1st – 3rd", "AIエージェント部門 1〜3位"),
      what: pick(lang, "Subscriptions such as ChatGPT Pro or Claude Max for up to 12 months, for every member", "メンバー全員に ChatGPT Pro や Claude Max などのサブスクリプションを最大12か月分"),
    },
  ];
  return (
    <Section
      id="prize"
      title={pick(lang, <>{figure} in prizes, and the entry is free.</>, <>賞品総額{figure}相当。参加費は無料。</>)}
    >
      <ul className="m-0 grid list-none gap-x-10 border-y border-wic-line p-0 max-lg:divide-y max-lg:divide-wic-line lg:grid-cols-3">
        {prizes.map((p) => (
          <li key={p.who} className="py-6">
            <p className="m-0 text-[0.85rem] font-semibold text-wic-muted">{p.who}</p>
            <p className="m-0 mt-1 text-[1.1rem] leading-[1.45]">{p.what}</p>
          </li>
        ))}
      </ul>
      <p className="mb-0 mt-6 text-[0.9rem] text-wic-muted">
        {pick(lang, "Total value of the prizes. Details are on each division's page.", "金額は賞品の総額。詳細は各部門のページを参照。")}
      </p>
    </Section>
  );
}
