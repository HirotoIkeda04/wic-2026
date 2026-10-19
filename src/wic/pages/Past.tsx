import type { DetailMeta } from "../DetailPage";
import { JPSI_URL, WIC_IMAGES, type Localized } from "../data";
import { pick, type WicLang } from "../lang";
import { WIC2025_VOICES } from "../voices2025";
import { Wic2025Judges } from "../Wic2025Judges";

export const meta: Localized<DetailMeta> = {
  en: {
    title: "Past editions",
    lead: "WIC began in 2024. The 2025 edition brought together 16 universities from 9 countries.",
  },
  ja: {
    title: "過去の大会",
    lead: "WICは2024年に始まった。2025年の大会には9か国16大学が集まった。",
  },
};

// Prize wording is carried over unchanged from the WIC2025 report page.
const RESULTS_2025: { award: Localized; winner: string; result: Localized; prizes: Localized<string[]> }[] = [
  {
    award: { en: "Overall Performance, 1st", ja: "総合パフォーマンス賞 1位" },
    winner: "LMU Investment Club, Ludwig Maximilian University of Munich",
    result: { en: "+33.3%", ja: "+33.3%" },
    prizes: {
      en: ["Round-trip flights for 3 + TradingView Premium (1 year) + Exclusive dinner with Webull executives"],
      ja: ["日本への往復航空券3名分＋TradingView Premium 1年＋Webull証券役員とのディナー"],
    },
  },
  {
    award: { en: "Overall Performance, 2nd", ja: "総合パフォーマンス賞 2位" },
    winner: "TU Investment Club, Technical University of Munich",
    result: { en: "+14.0%", ja: "+14.0%" },
    prizes: { en: ["TradingView Premium (1 year)"], ja: ["TradingView Premium 1年"] },
  },
  {
    award: { en: "Overall Performance, 3rd", ja: "総合パフォーマンス賞 3位" },
    winner: "IFSA Geneva, University of Geneva",
    result: { en: "+1.2%", ja: "+1.2%" },
    prizes: { en: ["TradingView Premium (6 months)"], ja: ["TradingView Premium 6か月"] },
  },
  {
    award: { en: "Most Valuable Player", ja: "MVP賞（個人）" },
    winner: "Hana Shigeta, University of Sheffield",
    result: { en: "+54.1%", ja: "+54.1%" },
    prizes: {
      en: ["Round-trip flight (1 person)", "Invitation to Waseda Forward Investment Club party"],
      ja: ["日本への往復航空券1名分", "早稲田大学 Forward のパーティーへの招待"],
    },
  },
  {
    award: { en: "Trader's Award (reports)", ja: "トレーダー賞（レポート）" },
    winner: "TU Investment Club",
    result: { en: "93 / 100", ja: "93 / 100点" },
    prizes: {
      en: [
        "Commemorative pure gold coin (24K), provided by Okayasu Shoji",
        "Exclusive dinner with judges Shimura & Yamanaka at a premium restaurant",
      ],
      ja: ["大会記念純金金貨（提供：岡安商事）", "審査員 志村氏・山中氏とのディナー"],
    },
  },
  {
    award: { en: "Options Trading Award", ja: "オプション取引賞" },
    winner: "LMU Investment Club",
    result: { en: "+46.2%", ja: "+46.2%" },
    prizes: { en: ["VIP dinner with Webull executives"], ja: ["Webull証券役員とのVIPディナー"] },
  },
];

const UNIVERSITIES_2025: { name: string; country: Localized }[] = [
  { name: "Ludwig Maximilian University of Munich — LMU Investment Club", country: { en: "Germany", ja: "ドイツ" } },
  { name: "Technical University of Munich — TU Investment Club", country: { en: "Germany", ja: "ドイツ" } },
  { name: "RWTH Aachen University — Aachen Investment Club", country: { en: "Germany", ja: "ドイツ" } },
  { name: "University of Geneva — IFSA Geneva", country: { en: "Switzerland", ja: "スイス" } },
  { name: "University of Sheffield — Investment Society", country: { en: "UK", ja: "イギリス" } },
  { name: "University of Alberta — The Business Finance Association", country: { en: "Canada", ja: "カナダ" } },
  { name: "University of Toronto — Rational Capital Investment Club", country: { en: "Canada", ja: "カナダ" } },
  { name: "University of California, Los Angeles", country: { en: "US", ja: "アメリカ" } },
  { name: "Roger Williams University — MBA Program", country: { en: "US", ja: "アメリカ" } },
  { name: "Indian Institute of Technology Roorkee — Finance Club IITR", country: { en: "India", ja: "インド" } },
  { name: "University of Delhi — Alpha Research & Investment Cell", country: { en: "India", ja: "インド" } },
  { name: "University of New South Wales — Alternative Investment Society", country: { en: "Australia", ja: "オーストラリア" } },
  { name: "Universiti Kebangsaan Malaysia — Bursa Young Investor Club", country: { en: "Malaysia", ja: "マレーシア" } },
  { name: "Waseda University — Forward Investment Club", country: { en: "Japan", ja: "日本" } },
  { name: "Keio University", country: { en: "Japan", ja: "日本" } },
  { name: "Meiji University", country: { en: "Japan", ja: "日本" } },
];

/** Body of the Past editions page; rendered inside <DetailPage>. */
export default function Past({ lang }: { lang: WicLang }) {
  return (
    <>
<figure className="my-6 mb-8">
  <img src={WIC_IMAGES.ceremony2025} width={1400} height={934} alt={pick(lang, "WIC2025 awards ceremony: judges and sponsors on stage, finalist teams joining on screen", "WIC2025の表彰式。壇上に審査員と協賛企業、スクリーンに決勝チーム")} className="block h-auto w-full rounded-[0.6rem]" />
  <figcaption className="mt-2 text-[0.9rem] text-wic-muted">{pick(lang, "WIC2025 awards ceremony, Waseda University, March 2026", "WIC2025 表彰式（早稲田大学、2026年3月）")}</figcaption>
</figure>

<h2>WIC2025</h2>
<p>
  {pick(
    lang,
    "16 universities from 9 countries competed over three months, from December 15, 2025 to March 13, 2026, placing 2,913 trades and submitting 23 reports.",
    "2025年12月15日から2026年3月13日までの3か月間、9か国16大学が競い、2,913回の取引と23本のレポートの提出があった。",
  )}
</p>
<h3>{pick(lang, "Results and prizes", "結果と賞品")}</h3>
<div className="tbl-wrap"><table>
<thead><tr><th>{pick(lang, "Award", "賞")}</th><th>{pick(lang, "Winner", "受賞")}</th><th>{pick(lang, "Result", "成績")}</th><th>{pick(lang, "Prize", "賞品")}</th></tr></thead>
<tbody>
  {RESULTS_2025.map((row) => (
    <tr key={row.award.en}>
      <th>{row.award[lang]}</th>
      <td>{row.winner}</td>
      <td className="whitespace-nowrap">{row.result[lang]}</td>
      <td>{row.prizes[lang].map((prize) => <span key={prize} className="block">{prize}</span>)}</td>
    </tr>
  ))}
</tbody></table></div>
<p><a href={`${JPSI_URL}/live`}>{pick(lang, "Full results and rankings", "最終ランキングと全結果")}</a></p>

<div className="my-6 grid gap-4 sm:grid-cols-2">
  <figure className="m-0">
    <img src="/images/wic/wic2025-champions-lmu.jpg" width={1400} height={1400} alt={pick(lang, "WIC2025 champion team, LMU Investment Club, holding the trophy", "トロフィーを持つ WIC2025 優勝チーム LMU Investment Club")} className="block aspect-square h-auto w-full rounded-[0.6rem] object-cover" />
    <figcaption className="mt-2 text-[0.9rem] text-wic-muted">{pick(lang, "WIC2025 champions, LMU Investment Club", "WIC2025 優勝チーム LMU Investment Club")}</figcaption>
  </figure>
  <figure className="m-0">
    <img src="/images/wic/wic2025-lmu-japan-trip.jpg" alt={pick(lang, "The three members of LMU Investment Club at a sushi counter in Tokyo", "東京の寿司店での LMU Investment Club のメンバー3名")} className="block aspect-square h-auto w-full rounded-[0.6rem] object-cover" />
    <figcaption className="mt-2 text-[0.9rem] text-wic-muted">{pick(lang, "The champions from LMU Investment Club in Tokyo, on the trip to Japan they won.", "賞品の日本旅行で来日した優勝チーム、LMU Investment Club のメンバー（東京にて）。")}</figcaption>
  </figure>
</div>

<h3>{pick(lang, "In their words", "参加者の声")}</h3>
<p className="muted">{pick(lang, "From our interviews with WIC2025 teams, February–March 2026.", "WIC2025 参加チームへのインタビューより（2026年2〜3月収録）。")}</p>
{WIC2025_VOICES.map((voice) => (
  <blockquote key={voice.en} className="my-4 border-l-2 border-wic-line pl-4 italic">{voice[lang]}</blockquote>
))}

<h3 id="judges">{pick(lang, "Judges", "審査員")}</h3>
<p>{pick(lang, "Two seasoned market professionals scored every investment report submitted in WIC2025.", "経験豊富な2名の実務家が、WIC2025 に提出されたすべての投資レポートを採点しました。")}</p>
<Wic2025Judges lang={lang} />

<h3>{pick(lang, "Participating universities", "参加大学")}</h3>
<ul>
  {UNIVERSITIES_2025.map((u) => (
    <li key={u.name}>{u.name} ({u.country[lang]})</li>
  ))}
</ul>

<h2>WIC2024</h2>
<p>
  {pick(
    lang,
    "The first edition ran for two months with 12 universities from 9 countries. TU Investment Club of the Technical University of Munich won with a return of 28.4%, growing its portfolio from $300,000 to $384,000.",
    "第1回は2か月間で、9か国12大学が参加した。ミュンヘン工科大学のTU Investment Clubが収益率28.4%で優勝し、ポートフォリオを30万ドルから38万4千ドルに増やした。",
  )}
</p>
    </>
  );
}
