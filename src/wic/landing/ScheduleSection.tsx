import type { ReactNode } from "react";
import { wicHref } from "../data";
import { pick, type WicLang } from "../lang";
import { MoreLink, Section } from "./Section";

/** Line icons on a 24px grid, drawn in currentColor. */
const ICONS = {
  // Hourglass: the entry window
  entry: <path d="M7 3h10M7 21h10M8 3c0 5 8 6 8 9s-8 4-8 9M16 3c0 5-8 6-8 9s8 4 8 9" />,
  // Flag: opening ceremony
  opening: <path d="M6 21V4M6 4h11l-2.5 4L17 12H6" />,
  // Target: test trading
  test: <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 11.5v1" />,
  // Code brackets: building the agent
  build: <path d="M9 7l-5 5 5 5M15 7l5 5-5 5" />,
  // Play: the agent's trial run
  trial: <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM10 8.5v7l6-3.5z" />,
  // Candlesticks: live trading by people
  trade: <path d="M8 3v4M8 15v5M6 7h4v8H6zM16 5v3M16 15v4M14 8h4v7h-4z" />,
  // Chip: live trading by agents
  agent: <path d="M8 8h8v8H8zM10 4v4M14 4v4M10 16v4M14 16v4M4 10h4M4 14h4M16 10h4M16 14h4" />,
  // Document: reports
  report: <path d="M7 3h7l4 4v14H7zM14 3v4h4M10 12h5M10 16h5" />,
  // Trophy: closing and awards ceremony
  awards: <path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M10 17h4M9 20h6" />,
} satisfies Record<string, ReactNode>;

type Who = "both" | "trader" | "agent";

/** Division colours: red for traders, purple for agents, grey for both. */
const TONE: Record<Who, { fill: string; text: string }> = {
  trader: { fill: "bg-[#c4484f]", text: "text-[#e2878b]" },
  agent: { fill: "bg-[#7656c2]", text: "text-[#ac95e4]" },
  both: { fill: "bg-[#5a5a5a]", text: "text-[#b4b4b4]" },
};

/** A day at noon UTC, for counting days between dates. */
const day = (iso: string) => Date.parse(`${iso}T12:00:00Z`);

type Item = {
  who: Who;
  icon: keyof typeof ICONS;
  title: string;
  /** ISO dates; `end` makes it a period, drawn as a capsule rather than a dot */
  start: string;
  end?: string;
  /** Grid rows it occupies (1-based, after the lane headers) and its minimum height */
  row: number;
  span?: number;
  minH?: string;
};

/**
 * Key dates in two lanes, one per division, so their overlapping periods sit
 * side by side; items for both divisions span both lanes. Time runs down in
 * phases (one grid row each), with each phase's start date on the left.
 * Events are dots, periods are capsules; colours mark the division.
 */
export function ScheduleSection({ lang }: { lang: WicLang }) {
  const items: Item[] = [
    { who: "both", icon: "entry", start: "2026-10-15", end: "2026-11-15", row: 1, minH: "min-h-[6.5rem]", title: pick(lang, "Entries open", "エントリー受付") },
    { who: "both", icon: "opening", start: "2026-12-07", row: 2, title: pick(lang, "Opening ceremony (online)", "開会式（オンライン）") },
    { who: "trader", icon: "test", start: "2026-12-07", end: "2026-12-20", row: 3, minH: "min-h-[7rem]", title: pick(lang, "Test trading", "テスト取引") },
    { who: "agent", icon: "build", start: "2026-12-07", end: "2026-12-31", row: 3, minH: "min-h-[7rem]", title: pick(lang, "Build your agent", "エージェント開発") },
    { who: "trader", icon: "trade", start: "2027-01-04", end: "2027-03-25", row: 4, span: 2, title: pick(lang, "Live trading", "本番取引") },
    { who: "agent", icon: "trial", start: "2027-01-04", end: "2027-01-31", row: 4, minH: "min-h-[7rem]", title: pick(lang, "Trial run", "試運転") },
    { who: "agent", icon: "agent", start: "2027-02-01", end: "2027-03-25", row: 5, minH: "min-h-[10rem]", title: pick(lang, "Live trading", "本番取引") },
    { who: "both", icon: "report", start: "2027-03-26", end: "2027-03-31", row: 6, minH: "min-h-[4.5rem]", title: pick(lang, "Final reports", "最終レポート提出") },
    { who: "both", icon: "awards", start: "2027-04-22", row: 7, title: pick(lang, "Closing and awards ceremony, Tokyo", "閉会式・表彰式（東京）") },
  ];
  /** The date each phase (grid row) starts, shown on the left; none where it repeats the row above */
  const phases: Record<number, string> = { 1: "2026-10-15", 2: "2026-12-07", 4: "2027-01-04", 5: "2027-02-01", 6: "2027-03-26", 7: "2027-04-22" };

  const whoLabel: Record<Who, string> = {
    both: pick(lang, "Both divisions", "両部門"),
    trader: pick(lang, "Trader division", "トレーダー部門"),
    agent: pick(lang, "AI Agent division", "AIエージェント部門"),
  };
  const md = (iso: string) => {
    const d = new Date(day(iso));
    return { m: d.getUTCMonth() + 1, d: d.getUTCDate(), mon: d.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" }) };
  };
  const fmt = (iso: string) => {
    const a = md(iso);
    return lang === "ja" ? `${a.m}月${a.d}日` : `${a.mon} ${a.d}`;
  };
  /** "Dec 7 – 20" within a month, "Jan 4 – Mar 25" across months */
  const range = (s: string, e: string) => {
    const a = md(s), b = md(e);
    if (a.m === b.m) return lang === "ja" ? `${a.m}月${a.d}日〜${b.d}日` : `${a.mon} ${a.d} – ${b.d}`;
    return lang === "ja" ? `${a.m}月${a.d}日〜${b.m}月${b.d}日` : `${a.mon} ${a.d} – ${b.mon} ${b.d}`;
  };

  // Dates shown down the middle, in order; the year only where it changes
  const shownDates = [...new Set([...items.filter((it) => it.who === "both").map((it) => it.start), ...Object.values(phases)])].sort();
  const yearShown = new Set(shownDates.filter((iso, i) => i === 0 || shownDates[i - 1].slice(0, 4) !== iso.slice(0, 4)));
  const DateMark = ({ iso }: { iso: string }) => (
    <p className="m-0 pt-1.5 text-center">
      <span className="block whitespace-nowrap text-[0.9rem] font-semibold leading-tight tabular-nums sm:text-[1.05rem]">{fmt(iso)}</span>
      {yearShown.has(iso) && <span className="block text-[0.75rem] text-wic-muted tabular-nums">{iso.slice(0, 4)}</span>}
    </p>
  );
  const Capsule = ({ it }: { it: Item }) => (
    <span
      className={`flex w-8 flex-none items-center justify-center rounded-full text-[#f2f2f2] sm:w-11 ${TONE[it.who].fill} ${
        it.end ? "self-stretch" : "h-8 sm:h-11"
      }`}
    >
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="sm:size-5">
        {ICONS[it.icon]}
      </svg>
    </span>
  );
  const when = (it: Item) => (it.end ? range(it.start, it.end) : fmt(it.start));
  const titleCls = "m-0 text-[0.92rem] font-semibold leading-[1.3] sm:text-[1.1rem]";
  const subCls = "m-0 mt-0.5 text-[0.72rem] text-wic-muted tabular-nums sm:text-[0.85rem]";

  return (
    <Section id="schedule" title={pick(lang, "From entry to the awards in Tokyo.", "エントリーから東京での表彰式まで。")}>
      {/* Trader lane | dates | AI Agent lane. Capsules sit against the middle column. */}
      <div className="mx-auto grid max-w-[48rem] grid-cols-[minmax(0,1fr)_4rem_minmax(0,1fr)] gap-x-2 gap-y-2.5 sm:grid-cols-[minmax(0,1fr)_6rem_minmax(0,1fr)] sm:gap-x-4">
        <p className="m-0 flex items-center justify-end gap-2 pb-2 text-[0.78rem] font-medium text-wic-muted sm:text-[0.88rem]" style={{ gridColumn: 1, gridRow: 1 }}>
          {whoLabel.trader}
          <span aria-hidden="true" className={`size-2.5 flex-none rounded-full ${TONE.trader.fill}`} />
        </p>
        <p className="m-0 flex items-center gap-2 pb-2 text-[0.78rem] font-medium text-wic-muted sm:text-[0.88rem]" style={{ gridColumn: 3, gridRow: 1 }}>
          <span aria-hidden="true" className={`size-2.5 flex-none rounded-full ${TONE.agent.fill}`} />
          {whoLabel.agent}
        </p>

        {/* Start dates of the phases where the lanes run separately */}
        {Object.entries(phases)
          .filter(([row]) => !items.some((it) => it.who === "both" && it.row === Number(row)))
          .map(([row, iso]) => (
            <div key={row} style={{ gridColumn: 2, gridRow: Number(row) + 1 }}>
              <DateMark iso={iso} />
            </div>
          ))}

        {items.map((it, i) => {
          const area = { gridRow: `${it.row + 1} / span ${it.span ?? 1}` };
          if (it.who === "both") {
            // Across the whole width: title on the trader side, date in the middle,
            // "both divisions" and the dates on the agent side
            return (
              <div key={i} className={`col-span-3 grid grid-cols-subgrid ${it.minH ?? ""}`} style={{ gridColumn: "1 / 4", ...area }}>
                <div className="flex min-w-0 flex-row-reverse gap-2 sm:gap-3.5">
                  <Capsule it={it} />
                  <div className="min-w-0 pt-1 text-right"><p className={titleCls}>{it.title}</p></div>
                </div>
                <DateMark iso={it.start} />
                <div className="flex min-w-0 gap-2 sm:gap-3.5">
                  <Capsule it={it} />
                  <div className="min-w-0 pt-1">
                    <p className={`m-0 text-[0.72rem] font-medium sm:text-[0.82rem] ${TONE.both.text}`}>{whoLabel.both}</p>
                    <p className={subCls}>{when(it)}</p>
                  </div>
                </div>
              </div>
            );
          }
          const trader = it.who === "trader";
          return (
            <div
              key={i}
              className={`flex min-w-0 gap-2 sm:gap-3.5 ${trader ? "flex-row-reverse" : ""} ${it.minH ?? ""}`}
              style={{ gridColumn: trader ? 1 : 3, ...area }}
            >
              <Capsule it={it} />
              <div className={`min-w-0 pt-1 ${trader ? "text-right" : ""}`}>
                <p className={titleCls}>{it.title}</p>
                <p className={subCls}>{when(it)}</p>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mb-0 mt-8 text-[0.9rem] text-wic-muted">
        {pick(lang, "Entries close at 23:59 ET on Nov 15. Live trading ends at 15:50 ET on Mar 25.", "エントリー締切は11月15日の米国東部時間 23:59。本番取引は3月25日の米国東部時間 15:50 までに全ポジションを決済する。")}
      </p>
      <div className="mt-6">
        <MoreLink href={wicHref(lang, "schedule")}>{pick(lang, "Full schedule", "日程の詳細")}</MoreLink>
      </div>
    </Section>
  );
}
