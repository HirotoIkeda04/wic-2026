import type { ReactNode } from "react";
import { wicHref } from "../data";
import { pick, type WicLang } from "../lang";
import { MoreLink, Section } from "./Section";

export const globeLabel = (lang: WicLang) =>
  pick(lang, "Globe marking the universities that took part in WIC2025", "WIC2025 に参加した大学を示す地球儀");

/** `globe`: the Globe island, given `globeLabel(lang)`. */
export function LastYear({ lang, globe }: { lang: WicLang; globe: ReactNode }) {
  return (
    <Section
      id="last-year"
      title={pick(lang, "Last year, 16 universities from 9 countries took part.", "昨年は9か国から16大学が参加した。")}
      className="overflow-hidden"
    >
      {/* Phones: globe, then the text. Wide screens: text left, globe right. */}
      <div className="grid gap-x-10 lg:grid-cols-[1fr_1.3fr] lg:grid-rows-[1fr_auto_1fr]">
        {/* The square box leaves empty space above and below the sphere; on phones pull it in */}
        <div className="-mt-6 mb-2 lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:my-0 lg:self-center">
          {globe}
        </div>
        <div className="lg:col-start-1 lg:row-start-2">
          <p className="m-0 text-[1.05rem] leading-[1.7]">
            {pick(
              lang,
              "The universities came from Germany, Switzerland, the UK, Canada, the US, India, Australia, Malaysia and Japan. LMU Investment Club from Munich won with a return of +33.3%.",
              "参加国はドイツ、スイス、イギリス、カナダ、アメリカ、インド、オーストラリア、マレーシア、日本。ミュンヘンの LMU Investment Club が +33.3% のリターンで優勝した。",
            )}
          </p>
          <div className="mt-8 flex justify-end">
            <MoreLink href={wicHref(lang, "past")}>{pick(lang, "Past editions", "過去の大会")}</MoreLink>
          </div>
        </div>
      </div>
    </Section>
  );
}
