import { SITE } from "../data";
import { pick, type WicLang } from "../lang";
import { EntryStatus } from "./EntryStatus";
import { Section } from "./Section";

/**
 * The closing call to enter, after the schedule: under the usual section
 * heading, a centred block with the entry window, "WIC 2026" in the hero
 * title's gold (see Hero), who can enter, and the entry form.
 */
export function EntrySection({ lang }: { lang: WicLang }) {
  return (
    <Section id="entry" title={pick(lang, "Entry", "エントリー")}>
      <div className="flex flex-col items-center py-6 text-center sm:py-10">
        <EntryStatus lang={lang} />
        {/* Same gold, light-from-above fill and faint glow as the hero title */}
        <p className="m-0 mt-5 bg-[linear-gradient(to_bottom,#dcb06a_0%,#e5c48d_45%,#efe2c9_100%)] bg-clip-text text-[clamp(3rem,11vw,6rem)] font-black uppercase leading-[0.92] tracking-[-0.03em] text-transparent [filter:drop-shadow(0_0_6px_rgb(230_186_112/0.35))]">
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
