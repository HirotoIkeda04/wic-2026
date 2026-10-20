import type { ReactNode } from "react";
import { wicHref } from "../data";
import { pick, type WicLang } from "../lang";
import { MoreLink, Section } from "./Section";

/** Line icons on a 24px grid, drawn in currentColor. */
const ICONS: Record<string, ReactNode> = {
  // Hourglass: entries close
  deadline: <path d="M7 3h10M7 21h10M8 3c0 5 8 6 8 9s-8 4-8 9M16 3c0 5-8 6-8 9s8 4 8 9" />,
  // Flag: opening ceremony
  opening: <path d="M6 21V4M6 4h11l-2.5 4L17 12H6" />,
  // Candlesticks: the trader division starts trading
  trader: <path d="M8 3v4M8 15v5M6 7h4v8H6zM16 5v3M16 15v4M14 8h4v7h-4z" />,
  // Chip: the AI Agent division starts trading
  agent: <path d="M8 8h8v8H8zM10 4v4M14 4v4M10 16v4M14 16v4M4 10h4M4 14h4M16 10h4M16 14h4" />,
  // Bell: trading ends
  close: <path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0" />,
  // Document: reports due
  report: <path d="M7 3h7l4 4v14H7zM14 3v4h4M10 12h5M10 16h5" />,
  // Trophy: closing and awards ceremony
  awards: <path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M10 17h4M9 20h6" />,
};

type Milestone = { date: string; year: string; event: string; who?: string; icon: keyof typeof ICONS };

/**
 * Key dates as a vertical timeline: the date on the left, an icon on the
 * line, then who it concerns and what happens.
 */
export function ScheduleSection({ lang }: { lang: WicLang }) {
  const both = pick(lang, "Both divisions", "両部門");
  const trader = pick(lang, "Trader division", "トレーダー部門");
  const agent = pick(lang, "AI Agent division", "AIエージェント部門");
  const rows: Milestone[] = [
    { date: pick(lang, "Nov 15", "11月15日"), year: "2026", icon: "deadline", event: pick(lang, "Entries close", "エントリー締切") },
    { date: pick(lang, "Dec 7", "12月7日"), year: "2026", icon: "opening", event: pick(lang, "Opening ceremony (online)", "開会式（オンライン）") },
    { date: pick(lang, "Jan 4", "1月4日"), year: "2027", icon: "trader", event: pick(lang, "Live trading begins", "本番取引開始"), who: trader },
    { date: pick(lang, "Feb 1", "2月1日"), year: "2027", icon: "agent", event: pick(lang, "Live trading begins", "本番取引開始"), who: agent },
    { date: pick(lang, "Mar 25", "3月25日"), year: "2027", icon: "close", event: pick(lang, "Live trading ends", "本番取引終了") },
    { date: pick(lang, "Mar 31", "3月31日"), year: "2027", icon: "report", event: pick(lang, "Final reports due", "最終レポート提出期限") },
    { date: pick(lang, "Apr 22", "4月22日"), year: "2027", icon: "awards", event: pick(lang, "Closing and awards ceremony, Tokyo", "閉会式・表彰式（東京）") },
  ];
  return (
    <Section id="schedule" title={pick(lang, "From entry to the awards in Tokyo.", "エントリーから東京での表彰式まで。")}>
      <ol className="m-0 max-w-[40rem] list-none p-0">
        {rows.map((r, i) => (
          <li key={i} className="grid grid-cols-[4.5rem_3rem_minmax(0,1fr)] gap-x-4 sm:grid-cols-[6rem_3.25rem_minmax(0,1fr)] sm:gap-x-6">
            <p className="m-0 pt-2.5 text-right">
              <span className="block text-[1.05rem] font-semibold leading-tight tabular-nums">{r.date}</span>
              {/* The year only where it changes */}
              {(i === 0 || rows[i - 1].year !== r.year) && <span className="block text-[0.78rem] text-wic-muted tabular-nums">{r.year}</span>}
            </p>
            {/* Icon on the line; the line runs on to the next row */}
            <div className="flex flex-col items-center">
              <span className="grid size-12 flex-none place-items-center rounded-full border border-wic-ink/35 text-wic-ink sm:size-[3.25rem]">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  {ICONS[r.icon]}
                </svg>
              </span>
              {i < rows.length - 1 && <span aria-hidden="true" className="w-px flex-1 bg-wic-ink/25" />}
            </div>
            <div className={`pt-2 ${i < rows.length - 1 ? "pb-9" : ""}`}>
              <p className="m-0 text-[0.82rem] text-wic-muted">{r.who ?? both}</p>
              <p className="m-0 mt-0.5 text-[1.15rem] font-semibold leading-[1.3]">{r.event}</p>
            </div>
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
