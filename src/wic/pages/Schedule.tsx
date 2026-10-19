import type { DetailMeta } from "../DetailPage";
import { NAV, SCHEDULE, type Localized, type ScheduleMonth, type ScheduleRow } from "../data";
import { pick, type WicLang } from "../lang";

export const meta: Localized<DetailMeta> = {
  en: {
    title: "Schedule",
    lead: "From entries opening in October to the closing ceremony in April. All times are US Eastern Time (ET).",
  },
  ja: {
    title: "日程",
    lead: "10月の募集開始から4月の閉会式まで。日時はすべて米国東部時間（ET）である。",
  },
};

const divisionLabel = (slug: "trader" | "ai-agent") => NAV.find((n) => n.slug === slug)!.label;

function Note({ row, lang }: { row: ScheduleRow; lang: WicLang }) {
  return row.note ? <span className="block text-[0.95rem] text-wic-muted">{row.note[lang]}</span> : null;
}

/** Events for both divisions: date and event side by side. */
function CommonList({ rows, lang }: { rows: ScheduleRow[]; lang: WicLang }) {
  return (
    <ul className="!list-none !p-0 !m-0">
      {rows.map((row) => (
        <li key={row.date.en + row.event.en} className="!m-0 grid grid-cols-[8.5rem_1fr] gap-4 border-b border-wic-line py-[0.7em]">
          <span className="whitespace-nowrap font-semibold">{row.date[lang]}</span>
          <span>{row.event[lang]}<Note row={row} lang={lang} /></span>
        </li>
      ))}
    </ul>
  );
}

/** A division's events within one month: the date sits above the event to fit half the width. */
function DivisionEvents({ rows, lang }: { rows: ScheduleRow[]; lang: WicLang }) {
  return (
    <ul className="!list-none !p-0 !m-0">
      {rows.map((row) => (
        <li key={row.date.en + row.event.en} className="!m-0 border-b border-wic-line py-[0.7em]">
          <span className="block font-semibold">{row.date[lang]}</span>
          <span className="block">{row.event[lang]}</span>
          <Note row={row} lang={lang} />
        </li>
      ))}
    </ul>
  );
}

const divisionHeading = "!mt-0 !mb-0 border-b-2 border-wic-ink pb-1.5";
const monthLabel = "mt-5 text-[0.85rem] font-semibold tracking-[0.02em] text-wic-muted";

/** Wide screens: one band per month across both columns, so the divisions line up in time. */
function MonthGrid({ lang }: { lang: WicLang }) {
  return (
    <div className="hidden sm:block">
      <div className="grid grid-cols-2 gap-6">
        <h3 className={divisionHeading}>{divisionLabel("trader")[lang]}</h3>
        <h3 className={divisionHeading}>{divisionLabel("ai-agent")[lang]}</h3>
      </div>
      {SCHEDULE.months.map((m) => (
        <section key={m.month.en}>
          <p className={`${monthLabel} !mb-0`}>{m.month[lang]}</p>
          <div className="grid grid-cols-2 gap-6">
            <DivisionEvents rows={m.trader} lang={lang} />
            <DivisionEvents rows={m.aiAgent} lang={lang} />
          </div>
        </section>
      ))}
    </div>
  );
}

/** Narrow screens: each division in one column, so it reads top to bottom. */
function DivisionStack({ lang }: { lang: WicLang }) {
  const divisions = [
    { slug: "trader", rows: (m: ScheduleMonth) => m.trader },
    { slug: "ai-agent", rows: (m: ScheduleMonth) => m.aiAgent },
  ] as const;
  return (
    <div className="grid gap-8 sm:hidden">
      {divisions.map((d) => (
        <section key={d.slug}>
          <h3 className={divisionHeading}>{divisionLabel(d.slug)[lang]}</h3>
          {SCHEDULE.months.map((m) => d.rows(m).length > 0 && (
            <div key={m.month.en}>
              <p className={`${monthLabel} !mb-0`}>{m.month[lang]}</p>
              <DivisionEvents rows={d.rows(m)} lang={lang} />
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}

/** Body of the Schedule page; rendered inside <DetailPage>. */
export default function Schedule({ lang }: { lang: WicLang }) {
  return (
    <>
<CommonList rows={SCHEDULE.before} lang={lang} />
<div className="my-8">
  <MonthGrid lang={lang} />
  <DivisionStack lang={lang} />
</div>
<div className="mb-6">
  <CommonList rows={SCHEDULE.after} lang={lang} />
</div>
<p>
  {pick(
    lang,
    "Positions still open at 15:50 ET on Mar 25 are closed by the organizers before results are calculated.",
    "3月25日の米国東部時間（ET）15:50時点で未決済のポジションは、成績集計前に運営側で決済する。",
  )}
</p>
<p>
  {pick(
    lang,
    "Entries and submissions are due by 23:59 ET on the deadline date.",
    "応募および提出物の締切は、該当日付の米国東部時間（ET）23:59である。",
  )}
</p>
<p className="muted">
  {pick(
    lang,
    "Official announcements, including weekly rankings and any schedule changes, are made in the WhatsApp group.",
    "週次ランキングの発表や日程の変更をはじめとする公式アナウンスは、WhatsAppグループで行う。",
  )}
</p>
    </>
  );
}
