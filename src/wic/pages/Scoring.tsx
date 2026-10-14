import type { DetailMeta } from "../DetailPage";

export const meta: DetailMeta = {
  slug: "scoring",
  title: "Scoring & Awards",
  lead: "Rankings combine investment performance and the quality of your report. Here is how the two are weighed, and what the winners receive.",
};

/** Body of the Scoring & Awards page; rendered inside <DetailPage {...meta}>. */
export default function Scoring() {
  return (
    <>
<h2>How the overall ranking works</h2>
<p>Performance alone does not decide the result. Teams are ranked separately on investment performance and on their reports, and the two rankings are combined with weights of 70% and 30%.</p>
<ol>
<li><b>Performance rank</b> — teams are ordered by final return over the trading period.
<div className="formula">Final return (%) = (team net assets on the last day ÷ team net assets at the start − 1) × 100</div></li>
<li><b>Report rank</b> — teams are ordered by the scores given by the external judges.</li>
<li><b>Overall score</b> — the two ranks are merged with weighted reciprocal rank fusion. Higher score, higher place.
<div className="formula">Score = 0.7 ÷ (k + performance rank) + 0.3 ÷ (k + report rank)</div>
<p className="muted">The constant k will be announced later.</p></li>
</ol>

<h2>How reports are judged</h2>
<p>Reports are scored by external judges. No investment style, whether short-term, long-term or systematic, is favoured. The criteria for 2026 will be announced separately. For reference, the 2025 final report was scored out of 100:</p>
<div className="tbl-wrap"><table>
<thead><tr><th>Section</th><th>Points</th><th>What the judges looked at</th></tr></thead>
<tbody>
<tr><th>Investment approach</th><td>30</td><td>Effectiveness of the style; feasibility of the analysis and trading; reproducibility and sustainability</td></tr>
<tr><th>Investment decisions</th><td>23</td><td>Precision of trade records; quality of the rationale; consistency between approach and decisions</td></tr>
<tr><th>Performance analysis and learning</th><td>27</td><td>Risk monitoring; analysis of what worked and what did not; objective reporting for investors</td></tr>
<tr><th>Optional monthly reports</th><td>20</td><td>December, January and February reports</td></tr>
</tbody></table></div>

<h2>Awards</h2>
<div className="tbl-wrap"><table>
<thead><tr><th>Award</th><th>Division</th><th>Given to</th></tr></thead>
<tbody>
<tr><th>Overall Performance Award</th><td>Trader</td><td>Teams ranked 1st to 3rd overall</td></tr>
<tr><th>Most Valuable Player Award</th><td>Trader</td><td>The individual with the highest final return</td></tr>
<tr><th>AI agent Award</th><td>AI Agent</td><td>Teams ranked 1st to 3rd overall</td></tr>
</tbody></table></div>
<h3>Prizes</h3>
<p>Prizes are worth $10,000 in total.</p>
<ul>
<li><b>Trader division, 1st overall</b> — round-trip flights to Japan for three.</li>
<li><b>AI Agent division, 1st to 3rd</b> — subscriptions such as Claude Max, for up to 12 months.</li>
<li>Other prizes will be announced later.</li>
</ul>

<h2>Judges</h2>
<p>The 2026 judges will be announced. <span className="wic-tbc">TBC</span></p>
<p className="muted">In 2025 the reports were judged by Nobuhiko Shimura (CEO, Skye Investment Managers; visiting fellow, Stanford University) and Yasuji Yamanaka (Director, Ascendant Inc.; Head of Japan Market, TradingView).</p>
    </>
  );
}
