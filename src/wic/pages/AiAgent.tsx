import { Callout } from "../Callout";
import type { DetailMeta } from "../DetailPage";
import { wicHref, type Localized } from "../data";
import type { WicLang } from "../lang";

export const meta: Localized<DetailMeta> = {
  en: {
    title: "AI Agent division",
    lead: "Build an agent that makes its own investment decisions and places its own orders. New in 2026.",
  },
  ja: {
    title: "AIエージェント部門",
    lead: "投資判断から発注まで人の手を介さず自律的に行うエージェントを開発する。2026年新設。",
  },
};

/** Body of the AI Agent division page; rendered inside <DetailPage>. */
export default function AiAgent({ lang }: { lang: WicLang }) {
  return lang === "ja" ? <Ja /> : <En />;
}

function En() {
  return (
    <>
<p className="muted">This page covers what is specific to the AI Agent division. Read it together with the <a href={wicHref("en", "rules")}>Rules</a>, which apply to both divisions. The AI Agent division is co-hosted with 早稲田AI研究会, a student AI club at Waseda University.</p>

<h2>Team and account</h2>
<p>One to three students per team. Each team gets one $1M Interactive Brokers demo account, provided by the organizers.</p>
<Callout><p><b>Limited to 15 teams.</b> The organizers pay for every team&apos;s LLM usage, so the number of teams is limited. To let as many students take part as possible, teams with more members are given priority if more than 15 teams apply.</p></Callout>

<h2>Dates</h2>
<ul>
<li><b>Dec 7 – 31, 2026</b> — Development.</li>
<li><b>Jan 4 – 31, 2027</b> — Trial run.</li>
<li><b>Feb 1 – Mar 25, 2027</b> — Live trading. All positions must be closed by 15:50 ET on Mar 25.</li>
</ul>

<h2>Where it runs</h2>
<p>On PCs or servers you manage, either continuously or on a schedule. Web search and external data are allowed.</p>

<h2>What counts as an AI agent</h2>
<ul>
<li>An LLM must be part of the system throughout live trading, either deciding each trade or periodically revising the strategy. A rules-based or quantitative model that trades, with an LLM updating its strategy on a schedule, is fine, and so is a mix with quantitative models. Using an LLM only during development, or calling it once at the start, is not.</li>
<li>No human intervention during live trading: people may not make investment decisions or change the strategy.</li>
</ul>

<h2>LLM access</h2>
<ul>
<li><b>The organizers pay for LLM usage; teams pay nothing.</b> All LLM calls go through a team key issued by the organizers. Each key has a spending cap, the same for every team.</li>
<li>The organizers record every call made through the key. This record (the trace) is used to confirm the conditions above.</li>
<li>Any model available through that route may be used, alone or in combination. Declare the models in your pre-report; they are fixed when live trading begins.</li>
<li>Inference outside that route, such as self-hosted models or separately contracted APIs, is not allowed. LLM processing inside a search tool is fine, but declare the tools in advance.</li>
<li>Competition rankings and other teams&apos; results may not be used as inputs.</li>
</ul>

<h2>Human intervention during live trading</h2>
<ul>
<li><b>Allowed:</b> re-authentication, restarting with the same code and settings, and emergency stops. Record the time, the reason and what you did in the operation log.</li>
<li><b>Must be reported to the organizers:</b> any recovery that involves changing code. The organizers check that it involves no investment decision or strategy change.</li>
<li><b>Not allowed:</b> investment decisions and strategy changes.</li>
</ul>
<h2>Changes made by the agent itself</h2>
<p>Changes the agent makes to its own strategy, settings or code must follow the change policy in your pre-report, and each change is recorded in the operation log.</p>

<h2>Submissions</h2>
<ul>
<li><b>Pre-report</b> (submitted before live trading begins on Feb 1, 2027) — your return hypothesis; how decisions are made (information sources, the role of the LLM, orders, risk management, policy for automatic changes); and the reasoning behind the design.</li>
<li><b>Post-report</b> (Mar 26 – 31) — results, how the actual behaviour matched the pre-stated policy, and a record of key decisions from judgement to execution.</li>
<li><b>Operation log</b> (required) — a record your team keeps and submits: LLM usage and cost, trades and net assets, stops and recoveries, summaries of decision reasons, and the change history.</li>
</ul>
<p>All submissions are in English. Submitting your code is optional. Deadlines are 23:59 US Eastern Time (ET) on the due date.</p>
<p>Reports, traces and operation logs are read by the judges, sponsors and organizers. Traces and operation logs are not made public without the team&apos;s consent.</p>

<h2>How reports are judged</h2>
<p>The judges read the pre-report, the post-report and the operation logs. This division is judged on its own criteria, different from the Trader division&apos;s; the criteria for 2026 will be announced separately.</p>
<p>The report rank is combined with the performance rank as described in the <a href={`${wicHref("en", "rules")}#ranking`}>Rules</a>.</p>

<h2>Award and prizes</h2>
<div className="tbl-wrap"><table>
<thead><tr><th>Award</th><th>Given to</th></tr></thead>
<tbody>
<tr><th>AI agent Award</th><td>Teams ranked 1st to 3rd overall</td></tr>
</tbody></table></div>
<ul>
<li><b>1st to 3rd</b> — subscriptions such as ChatGPT Pro or Claude Max, for up to 12 months, for every team member.</li>
</ul>
<p className="muted">The usage cap and the list of available models will be announced later.</p>
    </>
  );
}

function Ja() {
  return (
    <>
<p className="muted">本ページではAIエージェント部門固有の内容を説明する。両部門に共通して適用される<a href={wicHref("ja", "rules")}>ルール</a>とあわせて確認すること。AIエージェント部門は早稲田AI研究会との共催である。</p>

<h2>チームと口座</h2>
<p>学生1〜3名で1チームを構成する。各チームに、運営から100万ドルのIB証券のデモ口座が1つ提供される。</p>
<Callout><p><b>最大15チーム限定。</b>全チームのLLM利用料を運営が負担するため、参加チーム数に上限を設けている。できるだけ多くの学生に参加してもらうため、定員を超える応募があった場合は、メンバー数の多いチームを優先する。</p></Callout>

<h2>日程</h2>
<ul>
<li><b>2026年12月7日〜31日</b>：開発。</li>
<li><b>2027年1月4日〜31日</b>：試運転。</li>
<li><b>2027年2月1日〜3月25日</b>：本番取引。3月25日の米国東部時間（ET）15:50までに全ポジションを決済しなければならない。</li>
</ul>

<h2>実行環境</h2>
<p>エージェントは自身が管理するPCやサーバー上で稼働させ、常時稼働または定期実行とする。Web検索や外部データの利用も認められる。</p>

<h2>AIエージェントの条件</h2>
<ul>
<li>本番取引の全期間を通じて、システム内にLLMが組み込まれている必要がある。毎回の取引判断をLLMが行う形態、または定期的に戦略を見直す形態のいずれかでなければならない。取引を実行するルールベースやクオンツモデルの戦略をLLMが定期的に更新する構成や、クオンツモデルとの併用も認められる。開発時のみにLLMを利用する場合や、運用開始時に1度だけ呼び出すような構成は認められない。</li>
<li>本番取引期間中は人の手を介さず自律的に運用し、人間が介入して投資判断を行ったり戦略を変更したりしてはならない。</li>
</ul>

<h2>LLMの使い方</h2>
<ul>
<li><b>LLMの利用料は運営が負担し、チームの負担はない。</b>すべてのLLM呼び出しは、運営が発行するチーム専用キーを経由して行う。各キーには全チーム一律の上限金額が設定される。</li>
<li>運営はキーを経由したすべての呼び出しを記録する。この記録（トレース）を用いて、上記の条件が満たされていることを確認する。</li>
<li>この経路で提供されるモデルであれば、単独でも組み合わせても利用できる。利用するモデルは事前レポートで申告し、本番取引の開始時点で固定される。</li>
<li>この経路を経由しない推論（セルフホストのモデルや個別に契約したAPIなど）は認められない。検索ツール内部で行われるLLM処理は利用可能であるが、使用するツールを事前に申告する必要がある。</li>
<li>大会のランキングや他チームの運用実績を入力として用いることはできない。</li>
</ul>

<h2>本番取引中の人的介入</h2>
<ul>
<li><b>許可される行為：</b>再認証、同一コードおよび同一設定での再起動、緊急停止。実施した日時、理由、対応内容を運用ログに記録しなければならない。</li>
<li><b>運営への報告が必要な行為：</b>コードの変更を伴う復旧作業。運営側で、投資判断や戦略の変更が含まれていないかを確認する。</li>
<li><b>禁止される行為：</b>人間による投資判断および戦略の変更。</li>
</ul>
<h2>エージェント自身による変更</h2>
<p>エージェント自身が戦略、設定、コードを変更する場合は、事前レポートに記載した変更方針に従う必要があり、すべての変更を運用ログに記録しなければならない。</p>

<h2>提出物</h2>
<ul>
<li><b>事前レポート</b>（2027年2月1日の本番取引開始前に提出）：収益の仮説、意思決定の仕組み（情報源、LLMの役割、発注、リスク管理、自律変更の方針）、および設計意図・根拠を記述する。</li>
<li><b>事後レポート</b>（3月26日〜31日提出）：運用成績、事前方針と実際の挙動との整合性、判断から執行に至る主要な意思決定の記録を記述する。</li>
<li><b>運用ログ</b>（必須）：チームが記録・提出するログ。LLMの使用量と費用、取引履歴と純資産の推移、停止と復旧の記録、判断理由の要約、変更履歴を含む。</li>
</ul>
<p>提出物はすべて英語とする。プログラムコードの提出は任意である。提出期限はいずれも該当日付の米国東部時間（ET）23:59である。</p>
<p>提出されたレポート、トレース、運用ログは、審査員、協賛企業、運営が読む。トレースおよび運用ログは、チームの同意なしに一般公開されることはない。</p>

<h2>レポートの採点</h2>
<p>審査員は事前レポート、事後レポート、運用ログを読む。本部門はトレーダー部門とは異なる独自の基準で審査を行い、2026年の採点基準は別途発表する。</p>
<p>レポート順位は、<a href={`${wicHref("ja", "rules")}#ranking`}>ルール</a>に記載のとおりパフォーマンス順位と統合される。</p>

<h2>賞と賞品</h2>
<div className="tbl-wrap"><table>
<thead><tr><th>賞</th><th>対象</th></tr></thead>
<tbody>
<tr><th>AI agent Award</th><td>総合順位1〜3位のチーム</td></tr>
</tbody></table></div>
<ul>
<li><b>1〜3位</b>：チームメンバー全員に、ChatGPT ProやClaude Maxなどのサブスクリプション（最大12か月分）。</li>
</ul>
<p className="muted">利用金額の上限および利用可能なモデル一覧は後日発表する。</p>
    </>
  );
}
