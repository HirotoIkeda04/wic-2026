import { Callout } from "../Callout";
import type { DetailMeta } from "../DetailPage";
import { JPSI_URL, wicHref, type Localized } from "../data";

const IBKR_OPERATIONS_MANUAL_PATH = `${JPSI_URL}/documents/ibkr-operations-manual.pdf`;
import type { WicLang } from "../lang";

export const meta: Localized<DetailMeta> = {
  en: {
    title: "Rules",
    lead: "Who can enter, what you can trade, how teams are ranked, and what gets a team disqualified.",
  },
  ja: {
    title: "ルール",
    lead: "参加資格、取引対象銘柄、順位の決定方法、および失格要件を定める。",
  },
};

const MARGIN_LINKS = {
  overview: "https://www.interactivebrokers.com/en/trading/margin-requirements.php",
  stockRates:
    "https://www.interactivebrokers.com/en/trading/margin-stocks.php?hm=us&ex=us&rgt=1&rsk=0&pm=1&rst=101004110808",
  sma: "https://www.interactivebrokers.com/campus/glossary-terms/special-memorandum-account/",
};

/** Body of the Rules page; rendered inside <DetailPage>. */
export default function Rules({ lang }: { lang: WicLang }) {
  return lang === "ja" ? <Ja /> : <En />;
}

function En() {
  return (
    <>
<p className="muted">These rules apply to both divisions. Each division also has its own rules on its page: <a href={wicHref("en", "trader")}>Trader division</a> / <a href={wicHref("en", "ai-agent")}>AI Agent division</a>.</p>

<h2>The two divisions at a glance</h2>
<div className="tbl-wrap"><table>
<thead><tr><th></th><th>Trader</th><th>AI Agent</th></tr></thead>
<tbody>
<tr><th>Who trades</th><td>The team members themselves</td><td>An agent the team builds</td></tr>
<tr><th>Team size</th><td>3</td><td>1–3</td></tr>
<tr><th>Accounts</th><td>One $1M account per member ($3M per team)</td><td>One $1M account per team</td></tr>
<tr><th>Live trading</th><td>Jan 4 – Mar 25, 2027</td><td>Feb 1 – Mar 25, 2027</td></tr>
<tr><th>Submissions</th><td>Final report (required), monthly reports (optional)</td><td>Pre-report, post-report and operation logs</td></tr>
<tr><th>Tools</th><td>Trader Workstation (TWS) on your own PC</td><td>Your own machines or servers</td></tr>
</tbody></table></div>

<h2>Eligibility and entry</h2>
<ul>
<li>Open to undergraduate and graduate students. Entry is free.</li>
<li>One team per club or society per division; one team per person per division. The same person may enter both divisions.</li>
<li>Apply through the entry form, separately for each division. Entries open <b>Oct 15, 2026</b> and close at <b>23:59 ET on Nov 15, 2026</b>.</li>
</ul>
<h3>To be eligible for awards</h3>
<ul>
<li>At least one team member attends the opening ceremony, and at least one attends the closing ceremony (online attendance is fine).</li>
<li>Submit the final report (AI Agent division: post-report and operation logs) by the deadline.</li>
</ul>
<h3>Communication</h3>
<p>All official announcements are made in the WhatsApp group, and rankings are updated weekly. Every member should join and check it regularly.</p>

<h2>Trading rules</h2>
<ul>
<li><b>Accounts</b> — Interactive Brokers demo accounts provided by the organizers, $1M each: one per member in the Trader division, one per team in the AI Agent division. Trader division accounts have real-time market data.</li>
<li><b>Instruments</b> — Nasdaq-listed stocks and ETFs, and options on them. Margin buying and short selling are allowed. There is no restriction based on share price.</li>
<li><b>Leverage</b> — up to 4x intraday, up to 2x overnight, up to 2x for short positions. See <a href="#margin">margin and forced liquidation</a> below.</li>
</ul>

<h2>Disqualification</h2>
<h3>Maximum drawdown of 20%</h3>
<p>At the regular close of each trading day, if a team&apos;s net assets are 20% or more below their highest value so far, the whole team is disqualified. The starting value counts as a peak.</p>
<p>The check is per team. In the Trader division it uses the combined net assets of the three accounts ($3M at the start); in the AI Agent division, the team&apos;s account ($1M at the start). A Trader team is not disqualified when one member&apos;s account falls 20% if the three combined do not.</p>
<Callout>
<p><b>Example: not disqualified</b></p>
<p>The three accounts stand at $1.1M, $1.1M and $0.8M. The total is $3M, no lower than at the start, so the team is not disqualified.</p>
<p><b>Example: disqualified while still above the starting value</b></p>
<p>The team&apos;s total grows from $3M to $3.9M, then falls to $3.12M. It is still above $3M, but it is 20% below the peak, so the team is disqualified.</p>
</Callout>
<h3>Prohibited conduct</h3>
<p>Any of the following, once confirmed by the organizers, means immediate disqualification and loss of all award eligibility:</p>
<ul>
<li><b>Market manipulation</b> — moving prices with real money or with coordinated trades by third parties in order to profit in the demo account.</li>
<li><b>Exploiting the demo environment</b> — profiting from price-feed delays or from fills that would not happen in the real market.</li>
<li>Anything else that undermines the fairness of the competition.</li>
</ul>

<h2 id="ranking">How teams are ranked</h2>
<p>Performance alone does not decide the result. In each division, teams are ranked separately on investment performance and on their reports, and the two rankings are combined with weights of 70% and 30%.</p>
<ol>
<li><b>Performance rank</b> — teams are ordered by final return over the trading period.
<div className="formula">Final return (%) = (team net assets on the last day ÷ team net assets at the start − 1) × 100</div></li>
<li><b>Report rank</b> — teams are ordered by the scores given by the external judges. How reports are judged differs by division; see each division&apos;s page.</li>
<li><b>Overall score</b> — the two ranks are merged with weighted reciprocal rank fusion. Higher score, higher place.
<div className="formula">Score = 0.7 ÷ (k + performance rank) + 0.3 ÷ (k + report rank)</div>
<p className="muted">The constant k will be announced later.</p></li>
</ol>
<p>Prizes are worth $10,000 in total. The awards and prizes of each division are on its page.</p>
<h3>Judges</h3>
<p>The 2026 judges will be announced. See <a href={`${wicHref("en", "past")}#judges`}>the 2025 judges</a> on the Past editions page.</p>

<h2>Publication of results and reports</h2>
<ul>
<li>Results are published on the official site: team rankings with team and university names, and the top 10 individuals in the Trader division with name and university.</li>
<li>Reports are read by the judges, sponsors and organizers. For the AI Agent division&apos;s traces and operation logs, see the <a href={wicHref("en", "ai-agent")}>AI Agent division</a> page.</li>
<li>Winning teams&apos; reports are published only if the team agreed to it on the entry form. Consent is optional and does not affect judging or eligibility.</li>
</ul>

<h2 id="margin">Margin and forced liquidation</h2>
<p>Competition accounts are Reg T margin accounts, so leverage and short selling are possible. If your account falls below the required margin, positions are closed automatically and without warning. There is no margin call by phone or email.</p>
<div className="tbl-wrap"><table>
<thead><tr><th></th><th>Intraday</th><th>Overnight</th></tr></thead>
<tbody>
<tr><th>Long</th><td>25% margin (up to 4x)</td><td>50% margin (up to 2x)</td></tr>
<tr><th>Short</th><td>Capped at 2x</td><td>50% margin (up to 2x)</td></tr>
</tbody></table></div>
<h3>Two ways positions get liquidated</h3>
<ul>
<li><b>Falling below maintenance margin</b> — if equity drops below the requirement, positions can be closed immediately, even during the session.</li>
<li><b>The 15:50 ET check</b> — every trading day at this time, accounts are checked against the overnight requirement and any shortfall is liquidated.</li>
</ul>
<Callout>
<p><b>Example 1.</b> A $1M account buys $3M of stock intraday. That needs $750k (25%), so it is fine during the day, but holding overnight needs $1.5M (50%). Unless you reduce the position by $1M before 15:50 ET, it is liquidated automatically.</p>
<p><b>Example 2.</b> A $1M account buys $2M of stock and the price falls 40%. The position is now worth $1.2M and equity is $0.2M, below the $0.3M (25%) intraday requirement, so it is liquidated.</p>
</Callout>
<h3>Things to know</h3>
<ul>
<li>A negative cash balance is normal when you use leverage; it shows the borrowed amount.</li>
<li>Proceeds from short sales are held as collateral and cannot be used freely.</li>
<li>Shorts approach liquidation faster than longs: when the price rises, both the loss and the margin requirement grow at the same time.</li>
</ul>
<h3>Resources</h3>
<ul>
<li><a href={IBKR_OPERATIONS_MANUAL_PATH}>IBKR Quick Start Guide</a></li>
<li><a href={MARGIN_LINKS.overview}>Margin Overview</a></li>
<li><a href={MARGIN_LINKS.stockRates}>US Stock Margin Rates</a></li>
<li><a href={MARGIN_LINKS.sma}>What is SMA?</a></li>
</ul>
    </>
  );
}

function Ja() {
  return (
    <>
<p className="muted">本ルールは両部門に共通して適用される。各部門固有のルールはそれぞれのページを参照すること：<a href={wicHref("ja", "trader")}>トレーダー部門</a>／<a href={wicHref("ja", "ai-agent")}>AIエージェント部門</a>。</p>

<h2>両部門の概要比較</h2>
<div className="tbl-wrap"><table>
<thead><tr><th></th><th>トレーダー部門</th><th>AIエージェント部門</th></tr></thead>
<tbody>
<tr><th>取引主体</th><td>チームメンバー本人</td><td>チームが開発したエージェント</td></tr>
<tr><th>チーム人数</th><td>3名</td><td>1〜3名</td></tr>
<tr><th>口座</th><td>メンバー1名につき100万ドル口座1つ（チーム合計300万ドル）</td><td>1チームにつき100万ドル口座1つ</td></tr>
<tr><th>本番取引期間</th><td>2027年1月4日〜3月25日</td><td>2027年2月1日〜3月25日</td></tr>
<tr><th>提出物</th><td>最終レポート（必須）、月次レポート（任意）</td><td>事前レポート、事後レポート、運用ログ</td></tr>
<tr><th>利用環境・ツール</th><td>各自のPC上のTrader Workstation（TWS）</td><td>自身が管理するPCやサーバー</td></tr>
</tbody></table></div>

<h2>参加資格とエントリー</h2>
<ul>
<li>大学生および大学院生を対象とする。参加費は無料である。</li>
<li>同一のクラブ・団体からの参加は各部門1チームまで、同一人物のエントリーも各部門1チームまでに限る。同一人物が両部門に重複してエントリーすることは可能である。</li>
<li>エントリーフォームから部門ごとに応募する。募集開始は<b>2026年10月15日</b>、締切は<b>2026年11月15日 米国東部時間（ET）23:59</b>である。</li>
</ul>
<h3>受賞要件</h3>
<ul>
<li>開会式および閉会式の双方に、チームから1名以上が出席すること（オンライン参加も可能）。</li>
<li>期日までに最終レポート（AIエージェント部門は事後レポートおよび運用ログ）を提出すること。</li>
</ul>
<h3>公式連絡</h3>
<p>公式アナウンスはすべてWhatsAppグループで行い、ランキングは毎週更新される。全メンバーがグループに参加し、定期的に確認しなければならない。</p>

<h2>取引ルール</h2>
<ul>
<li><b>口座</b>：運営より提供されるIB証券のデモ口座（1口座あたり100万ドル）。トレーダー部門はメンバー1名につき1口座、AIエージェント部門は1チームにつき1口座とする。トレーダー部門の口座にはリアルタイムの市場データが提供される。</li>
<li><b>取引対象商品</b>：Nasdaq上場株式およびETF、ならびにそれらを対象とするオプション。信用買いおよび空売りが可能である。株価水準による取引制限はない。</li>
<li><b>レバレッジ</b>：日中は最大4倍、オーバーナイト（翌日への持ち越し）は最大2倍、空売りポジションは最大2倍まで。詳細は後述の<a href="#margin">証拠金と強制清算</a>を参照のこと。</li>
</ul>

<h2>失格要件</h2>
<h3>最大ドローダウン20%</h3>
<p>各取引日の通常取引終了時点において、チームの純資産が過去最高値を20%以上下回った場合、チーム全体が失格となる。なお、開始時の資産額も最高値の対象としてカウントする。</p>
<p>判定はチームごとに行う。トレーダー部門では3口座の合算純資産（開始時300万ドル）、AIエージェント部門ではチーム口座の純資産（開始時100万ドル）を基準とする。トレーダー部門において、特定のメンバー1名の口座が20%下落した場合であっても、3口座の合算純資産が20%以上下落していなければ失格とはならない。</p>
<Callout>
<p><b>例：失格とならないケース</b></p>
<p>3口座の残高がそれぞれ110万ドル、110万ドル、80万ドルの場合。合計は300万ドルであり、開始時の元本を下回っていないため失格とはならない。</p>
<p><b>例：開始時の元本を上回っていても失格となるケース</b></p>
<p>チーム合計資産が300万ドルから390万ドルまで増加したのち、312万ドルまで下落した場合。開始時の300万ドルは依然として上回っているものの、最高値から20%下落しているためチームは失格となる。</p>
</Callout>
<h3>禁止行為</h3>
<p>運営が以下のいずれかの行為を確認した場合、ただちに失格となり、すべての受賞資格を喪失する。</p>
<ul>
<li><b>相場操縦</b>：自己のリアル資金による取引や第三者との馴れ合い売買によって実市場の価格を操作し、デモ口座で不当に利益を得る行為。</li>
<li><b>デモ環境の悪用</b>：価格配信の遅延を悪用した取引や、実際の市場では成立しない約定を利用して利益を得る行為。</li>
<li>その他、大会の公平性を損なう行為。</li>
</ul>

<h2 id="ranking">順位の決定方法</h2>
<p>勝敗は運用成績のみでは決定されない。各部門において、運用成績とレポート評価で個別に順位を決定し、両順位を70%と30%の比重で統合する。</p>
<ol>
<li><b>パフォーマンス順位</b>：取引期間を通じた最終収益率の順に決定する。
<div className="formula">最終収益率（%）＝（最終日のチーム純資産 ÷ 開始時のチーム純資産 − 1）× 100</div></li>
<li><b>レポート順位</b>：外部審査員による採点結果の順に決定する。レポートの審査方法は部門ごとに異なるため、各部門のページを参照のこと。</li>
<li><b>総合スコア</b>：2つの順位を重み付きRRF（Weighted Reciprocal Rank Fusion）により統合する。スコアが高いチームほど上位となる。
<div className="formula">スコア ＝ 0.7 ÷（k ＋ パフォーマンス順位）＋ 0.3 ÷（k ＋ レポート順位）</div>
<p className="muted">定数kは後日発表する。</p></li>
</ol>
<p>賞品は総額1万ドル相当。各部門の表彰内容および賞品は各部門のページに掲載している。</p>
<h3>審査員</h3>
<p>2026年の審査員は追って発表する。「過去の大会」ページで<a href={`${wicHref("ja", "past")}#judges`}>2025年の審査員一覧</a>を確認できる。</p>

<h2>結果およびレポートの公開</h2>
<ul>
<li>結果は公式サイト上で公表する。チーム順位はチーム名および大学名とともに掲載し、トレーダー部門では個人成績上位10名の氏名および大学名も公表する。</li>
<li>提出されたレポートは、審査員、協賛企業、運営が読む。AIエージェント部門のトレースおよび運用ログの取り扱いについては、<a href={wicHref("ja", "ai-agent")}>AIエージェント部門</a>のページを参照のこと。</li>
<li>入賞チームのレポートは、エントリーフォームで同意した場合に限り一般公開される。公開への同意は任意であり、審査や受賞資格に影響を与えることはない。</li>
</ul>

<h2 id="margin">証拠金と強制清算</h2>
<p>大会で用いる口座はReg Tマージン口座であり、レバレッジ取引や空売りが可能である。口座資産が必要証拠金を下回った場合、事前の警告なく保有ポジションが自動的に強制清算される。電話やメールによる追証（マージンコール）の通知は行われない。</p>
<div className="tbl-wrap"><table>
<thead><tr><th></th><th>日中</th><th>翌日への持ち越し</th></tr></thead>
<tbody>
<tr><th>買い</th><td>必要証拠金25%（最大4倍）</td><td>必要証拠金50%（最大2倍）</td></tr>
<tr><th>空売り</th><td>最大2倍に制限</td><td>必要証拠金50%（最大2倍）</td></tr>
</tbody></table></div>
<h3>強制清算が執行される2つの契機</h3>
<ul>
<li><b>維持証拠金を下回った場合</b>：純資産額が必要維持証拠金を下回ると、立会時間中であっても直ちにポジションが強制決済される可能性がある。</li>
<li><b>米国東部時間（ET）15:50の判定</b>：毎取引日のこの時刻にオーバーナイト必要証拠金の充足状況がチェックされ、不足しているポジションが強制清算される。</li>
</ul>
<Callout>
<p><b>例1.</b> 100万ドルの口座で日中に300万ドル分の株式を購入した場合。日中の必要証拠金は75万ドル（25%）であるため日中は問題ないが、翌日に持ち越すには150万ドル（50%）が必要となる。米国東部時間（ET）15:50までにポジションを100万ドル分削減しない限り、自動的に強制清算される。</p>
<p><b>例2.</b> 100万ドルの口座で200万ドル分の株式を購入し、株価が40%下落した場合。ポジション評価額は120万ドル、純資産は20万ドルとなり、日中の必要証拠金である30万ドル（25%）を下回るため強制清算される。</p>
</Callout>
<h3>留意事項</h3>
<ul>
<li>レバレッジ取引を行うと現金残高がマイナス表示となるが、これは借入残高を示す正常な状態である。</li>
<li>空売りによって生じた売却代金は担保として拘束され、自由には使えない。</li>
<li>空売りは買いよりも早いペースで強制清算ラインに近づく。株価が上昇すると、損失の拡大と必要証拠金の増加が同時に進行するためである。</li>
</ul>
<h3>資料</h3>
<ul>
<li><a href={IBKR_OPERATIONS_MANUAL_PATH}>IBKR クイックスタートガイド</a></li>
<li><a href={MARGIN_LINKS.overview}>証拠金概要</a></li>
<li><a href={MARGIN_LINKS.stockRates}>米国株式の証拠金率</a></li>
<li><a href={MARGIN_LINKS.sma}>SMA（特別覚書口座）とは</a></li>
</ul>
    </>
  );
}
