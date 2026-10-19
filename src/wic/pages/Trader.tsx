import type { DetailMeta } from "../DetailPage";
import { wicHref, type Localized } from "../data";
import type { WicLang } from "../lang";

export const meta: Localized<DetailMeta> = {
  en: {
    title: "Trader division",
    lead: "Three students, three $1M demo accounts, and every trading decision made by you.",
  },
  ja: {
    title: "トレーダー部門",
    lead: "3名の学生、3つの100万ドルデモ口座。取引の意思決定はすべて自身の手で行う。",
  },
};

/** Body of the Trader division page; rendered inside <DetailPage>. */
export default function Trader({ lang }: { lang: WicLang }) {
  return lang === "ja" ? <Ja /> : <En />;
}

function En() {
  return (
    <>
<p className="muted">This page covers what is specific to the Trader division. Read it together with the <a href={wicHref("en", "rules")}>Rules</a>, which apply to both divisions.</p>

<h2>Team and accounts</h2>
<p>Three students form a team. Each member receives a $1M virtual portfolio, and the team&apos;s result is the combined net assets of the three accounts. Trading is done in Trader Workstation (TWS) on your own PC, with real-time market data.</p>

<h2>Dates</h2>
<ul>
<li><b>Dec 7 – 20, 2026</b> — Test trading: set up your account and get used to TWS.</li>
<li><b>Jan 4 – Mar 25, 2027</b> — Live trading. All positions must be closed by 15:50 ET on Mar 25.</li>
</ul>

<h2>Reports</h2>
<p>Reports are PDFs (A4) in English, with no length limit.</p>
<ul>
<li><b>Final report</b> (required) — a review of the three months in three parts: your investment strategy, your key decisions, and an analysis of your results and what you learned. Due <b>Mar 26 – 31</b>.</li>
<li><b>Monthly reports</b> (optional, up to three) — mainly your strategy for the coming month, plus a look back at the month just finished. Each one earns extra points. Due <b>Dec 31</b> (for January), <b>Jan 31</b> (February) and <b>Feb 28</b> (March).</li>
</ul>
<p className="muted">Deadlines are 23:59 US Eastern Time (ET) on the due date.</p>

<h2>How reports are judged</h2>
<p>External judges score the reports. No investment style, whether short-term, long-term or systematic, is favoured. The criteria for 2026 will be announced separately. For reference, the 2025 final report was scored out of 100:</p>
<div className="tbl-wrap"><table>
<thead><tr><th>Section</th><th>Points</th><th>What the judges looked at</th></tr></thead>
<tbody>
<tr><th>Investment approach</th><td>30</td><td>Effectiveness of the style; feasibility of the analysis and trading; reproducibility and sustainability</td></tr>
<tr><th>Investment decisions</th><td>23</td><td>Precision of trade records; quality of the rationale; consistency between approach and decisions</td></tr>
<tr><th>Performance analysis and learning</th><td>27</td><td>Risk monitoring; analysis of what worked and what did not; objective reporting for investors</td></tr>
<tr><th>Optional monthly reports</th><td>20</td><td>December, January and February reports</td></tr>
</tbody></table></div>
<p>The report rank is combined with the performance rank as described in the <a href={`${wicHref("en", "rules")}#ranking`}>Rules</a>.</p>

<h2>Awards and prizes</h2>
<div className="tbl-wrap"><table>
<thead><tr><th>Award</th><th>Given to</th></tr></thead>
<tbody>
<tr><th>Overall Performance Award</th><td>Teams ranked 1st to 3rd overall</td></tr>
<tr><th>Most Valuable Player Award</th><td>The individual with the highest final return</td></tr>
</tbody></table></div>
<ul>
<li><b>1st overall</b> — round-trip flights to Japan for the team&apos;s three members.</li>
<li><b>Most Valuable Player</b> — a one-year TradingView Premium subscription for one person.</li>
</ul>
    </>
  );
}

function Ja() {
  return (
    <>
<p className="muted">本ページではトレーダー部門固有の内容を説明する。両部門に共通して適用される<a href={wicHref("ja", "rules")}>ルール</a>とあわせて確認すること。</p>

<h2>チームと口座</h2>
<p>学生3名で1チームを組む。各メンバーに100万ドルの仮想ポートフォリオが付与され、チームの成績は3つの口座の合算純資産で判定される。取引は各自のPC上のTrader Workstation（TWS）で行い、リアルタイムの市場データが提供される。</p>

<h2>日程</h2>
<ul>
<li><b>2026年12月7日〜20日</b>：テスト取引。口座を設定し、Trader Workstation（TWS）の操作に慣れる。</li>
<li><b>2027年1月4日〜3月25日</b>：本番取引。3月25日の米国東部時間（ET）15:50までに全ポジションを決済しなければならない。</li>
</ul>

<h2>レポート</h2>
<p>レポートは英語で作成したA4判のPDFとし、ページ数の制限は設けない。</p>
<ul>
<li><b>最終レポート</b>（必須）：3か月間の総括として、投資戦略、主要な投資判断、運用成績の分析と学びの3部構成で記述する。提出期間は<b>3月26日〜31日</b>である。</li>
<li><b>月次レポート</b>（任意、最大3回）：翌月の投資戦略を中心に、終了した月の振り返りも記載する。1回提出するごとに追加点を獲得できる。提出期限は<b>12月31日</b>（1月分）、<b>1月31日</b>（2月分）、<b>2月28日</b>（3月分）である。</li>
</ul>
<p className="muted">提出期限はいずれも該当日付の米国東部時間（ET）23:59である。</p>

<h2>レポートの採点</h2>
<p>外部の審査員がレポートを採点する。短期トレード、長期投資、システム運用など、特定の投資スタイルが優遇されることはない。2026年の採点基準は別途発表する。参考として、2025年の最終レポートは100点満点で次のように採点された。</p>
<div className="tbl-wrap"><table>
<thead><tr><th>項目</th><th>配点</th><th>審査の着眼点</th></tr></thead>
<tbody>
<tr><th>投資手法</th><td>30</td><td>スタイルの有効性、分析および取引の実現可能性、再現性と持続可能性</td></tr>
<tr><th>投資判断</th><td>23</td><td>取引記録の正確性、根拠の質、手法と判断の一貫性</td></tr>
<tr><th>成績の分析と学び</th><td>27</td><td>リスクの監視、成功要因・失敗要因の分析、投資家に向けた客観的な報告</td></tr>
<tr><th>月次レポート（任意）</th><td>20</td><td>12月分、1月分、2月分のレポート</td></tr>
</tbody></table></div>
<p>レポート順位は、<a href={`${wicHref("ja", "rules")}#ranking`}>ルール</a>に記載のとおりパフォーマンス順位と統合される。</p>

<h2>賞と賞品</h2>
<div className="tbl-wrap"><table>
<thead><tr><th>賞</th><th>対象</th></tr></thead>
<tbody>
<tr><th>Overall Performance Award</th><td>総合順位1〜3位のチーム</td></tr>
<tr><th>Most Valuable Player Award</th><td>最終収益率が最も高い個人</td></tr>
</tbody></table></div>
<ul>
<li><b>総合1位</b>：チームメンバー3名分の日本往復航空券。</li>
<li><b>最優秀選手賞</b>：TradingView Premium 年間契約1名分。</li>
</ul>
    </>
  );
}
