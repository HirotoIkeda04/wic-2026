import { wicHref } from "../data";
import { pick, type WicLang } from "../lang";
import { Globe } from "./Globe";
import { MoreLink, Section } from "./Section";

export function LastYear({ lang }: { lang: WicLang }) {
  return (
    <Section
      id="last-year"
      title={pick(lang, "Last year, students from 9 countries traded against each other.", "昨年は9か国の学生が競い合った。")}
      className="overflow-hidden"
    >
      {/* Phones: globe, then the text. Wide screens: text left, globe right. */}
      <div className="grid gap-x-10 lg:grid-cols-[1fr_1.3fr] lg:grid-rows-[1fr_auto_1fr]">
        <div className="mb-8 lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:mb-0 lg:self-center">
          <Globe label={pick(lang, "Globe marking the universities that took part in WIC2025", "WIC2025 に参加した大学を示す地球儀")} />
        </div>
        <div className="lg:col-start-1 lg:row-start-2">
          <p className="m-0 text-[1.05rem] leading-[1.7]">
            {pick(
              lang,
              "16 universities took part, from Germany, Switzerland, the UK, Canada, the US, India, Australia, Malaysia and Japan. LMU Investment Club from Munich won with a return of +33.3% and came to Tokyo for the awards.",
              "ドイツ、スイス、イギリス、カナダ、アメリカ、インド、オーストラリア、マレーシア、日本の16大学が参加した。優勝した LMU Investment Club（ミュンヘン）は +33.3% のリターンを上げ、表彰式のため東京を訪れた。",
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
