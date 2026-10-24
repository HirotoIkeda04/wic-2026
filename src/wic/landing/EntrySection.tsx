import type { ReactNode } from "react";
import { SITE } from "../data";
import { pick, type WicLang } from "../lang";
import { Section } from "./Section";

/**
 * The closing call to enter, after the schedule: under the usual section
 * heading, a centred block with the entry window, "WIC 2026", who can enter,
 * and the entry form.
 */
/** `status`: the EntryStatus island, which works out the entry phase in the browser. */
export function EntrySection({ lang, status }: { lang: WicLang; status: ReactNode }) {
  return (
    <Section id="entry" title={pick(lang, "Entry", "エントリー")}>
      <div className="flex flex-col items-center py-6 text-center sm:py-10">
        {status}
        <p className="m-0 mt-5 text-[clamp(3rem,11vw,6rem)] font-black uppercase leading-[0.92] tracking-[-0.03em]">
          WIC 2026
        </p>
        <p className="m-0 mt-4 max-w-[22em] text-[1rem] leading-[1.6] text-wic-muted">
          {pick(
            lang,
            "Open to undergraduate and graduate students only. Free to enter. One form per division, by 23:59 ET on Nov 15.",
            "参加できるのは大学生・大学院生のみ。参加費は無料。部門ごとに1回、11月15日の米国東部時間 23:59 までに送る。",
          )}
        </p>
        <a
          href={SITE.entryUrl}
          className="mt-7 inline-flex items-center gap-3 rounded-full bg-wic-ink px-8 py-4 text-[1.1rem] font-semibold text-wic-bg no-underline transition-opacity hover:opacity-85"
        >
          {pick(lang, "Open the entry form", "エントリーフォームを開く")} <span aria-hidden="true">→</span>
        </a>
      </div>
    </Section>
  );
}
