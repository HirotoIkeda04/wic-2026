import { wicHref } from "../data";
import { pick, type WicLang } from "../lang";
import { MoreLink, Section } from "./Section";

type Milestone = { date: string; event: string; who?: string };

export function ScheduleSection({ lang }: { lang: WicLang }) {
  const both = pick(lang, "Both", "両部門");
  const trader = pick(lang, "Trader", "トレーダー");
  const agent = pick(lang, "AI Agent", "AIエージェント");
  const rows: Milestone[] = [
    { date: pick(lang, "Nov 15", "11月15日"), event: pick(lang, "Entries close", "エントリー締切") },
    { date: pick(lang, "Dec 7", "12月7日"), event: pick(lang, "Opening ceremony (online)", "開会式（オンライン）") },
    { date: pick(lang, "Jan 4", "1月4日"), event: pick(lang, "Live trading begins", "本番取引開始"), who: trader },
    { date: pick(lang, "Feb 1", "2月1日"), event: pick(lang, "Live trading begins", "本番取引開始"), who: agent },
    { date: pick(lang, "Mar 25", "3月25日"), event: pick(lang, "Live trading ends", "本番取引終了") },
    { date: pick(lang, "Mar 31", "3月31日"), event: pick(lang, "Final reports due", "最終レポート提出期限") },
    { date: pick(lang, "Apr 22", "4月22日"), event: pick(lang, "Closing and awards ceremony, Tokyo", "閉会式・表彰式（東京）") },
  ];
  return (
    <Section id="schedule" title={pick(lang, "From entry to the awards in Tokyo.", "エントリーから東京での表彰式まで。")}>
      <ol className="m-0 grid list-none gap-0 p-0 md:grid-cols-7">
        {rows.map((r, i) => (
          <li key={i} className="relative border-l border-wic-line pb-7 pl-6 last:border-transparent md:border-l-0 md:border-t md:pb-0 md:pl-0 md:pr-4 md:pt-6 md:last:border-t-wic-line">
            <span aria-hidden="true" className="absolute -left-[0.4rem] top-1 size-3 rounded-full border-2 border-wic-ink bg-wic-bg md:-top-[0.4rem] md:left-0" />
            <p className="m-0 text-[1.15rem] font-semibold tabular-nums">{r.date}</p>
            <p className="m-0 mt-1 text-[0.95rem] leading-[1.4] text-wic-muted">
              {r.event}
              <span className="block text-[0.8rem] text-wic-ink/50">{r.who ?? both}</span>
            </p>
          </li>
        ))}
      </ol>
      <p className="mb-0 mt-8 text-[0.9rem] text-wic-muted">
        {pick(lang, "Entries close at 23:59 ET. Trading runs from December 2026 to March 2027, awards in April 2027.", "締切は米国東部時間 23:59。取引は2026年12月〜2027年3月、表彰は2027年4月。")}
      </p>
      <div className="mt-6">
        <MoreLink href={wicHref(lang, "schedule")}>{pick(lang, "Full schedule", "日程の詳細")}</MoreLink>
      </div>
    </Section>
  );
}
