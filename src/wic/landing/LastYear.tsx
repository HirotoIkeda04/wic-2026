import { wicHref } from "../data";
import { pick, type WicLang } from "../lang";
import { Globe } from "./Globe";
import { MoreLink, Section } from "./Section";

export function LastYear({ lang }: { lang: WicLang }) {
  const stats = [
    { n: "9", l: pick(lang, "countries", "か国") },
    { n: "16", l: pick(lang, "universities", "大学") },
    { n: "+33.3%", l: pick(lang, "winning return", "優勝チームのリターン") },
  ];
  return (
    <Section
      id="last-year"
      title={pick(lang, "Last year, students from 9 countries traded against each other.", "昨年は9か国の学生が競い合った。")}
      className="overflow-hidden"
    >
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <dl className="m-0 grid grid-cols-3 gap-4 border-y border-wic-line py-6">
            {stats.map((s) => (
              <div key={s.l}>
                <dt className="sr-only">{s.l}</dt>
                <dd className="m-0">
                  <span className="block text-[clamp(1.8rem,4vw,2.6rem)] font-semibold leading-none tracking-[-0.03em] tabular-nums">{s.n}</span>
                  <span className="mt-2 block text-[0.85rem] text-wic-muted">{s.l}</span>
                </dd>
              </div>
            ))}
          </dl>
          <p className="mb-0 mt-6 text-[1.05rem] leading-[1.55]">
            {pick(
              lang,
              "Germany, Switzerland, the UK, Canada, the US, India, Australia, Malaysia and Japan. LMU Investment Club from Munich won and came to Tokyo for the awards.",
              "ドイツ、スイス、イギリス、カナダ、アメリカ、インド、オーストラリア、マレーシア、日本。優勝した LMU Investment Club（ミュンヘン）は表彰式のため東京を訪れた。",
            )}
          </p>
          <div className="mt-8">
            <MoreLink href={wicHref(lang, "past")}>{pick(lang, "Past editions", "過去の大会")}</MoreLink>
          </div>
        </div>
        <Globe label={pick(lang, "Globe marking the universities that took part in WIC2025", "WIC2025 に参加した大学を示す地球儀")} />
      </div>
    </Section>
  );
}
