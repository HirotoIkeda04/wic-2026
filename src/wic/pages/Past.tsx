import { SITE, WIC_IMAGES } from "../data";
import type { DetailMeta } from "../DetailPage";

export const meta: DetailMeta = {
  slug: "past",
  title: "Past editions",
  lead: "WIC began in 2024. The 2025 edition brought together 16 universities from 9 countries.",
};

/** Body of the Past editions page; rendered inside <DetailPage {...meta}>. */
export default function Past() {
  return (
    <>
<figure className="my-6 mb-8">
  <img src={WIC_IMAGES.hero} width={1400} height={934} alt="WIC2025 awards ceremony: judges and sponsors on stage, finalist teams joining on screen" className="block h-auto w-full rounded-[0.6rem]" />
  <figcaption className="mt-2 text-[0.9rem] text-wic-muted">WIC2025 awards ceremony, Waseda University, March 2026</figcaption>
</figure>

<h2>WIC2025</h2>
<p>16 universities from 9 countries competed over three months, from December 15, 2025 to March 13, 2026, placing 2,913 trades and submitting 23 reports.</p>
<h3>Results</h3>
<div className="tbl-wrap"><table>
<tbody>
<tr><th>Overall Performance, 1st</th><td>LMU Investment Club, Ludwig Maximilian University of Munich</td><td>+33.3%</td></tr>
<tr><th>Overall Performance, 2nd</th><td>TU Investment Club, Technical University of Munich</td><td>+14.0%</td></tr>
<tr><th>Overall Performance, 3rd</th><td>IFSA Geneva, University of Geneva</td><td>+1.2%</td></tr>
<tr><th>Most Valuable Player</th><td>Hana Shigeta, University of Sheffield</td><td>+54.1%</td></tr>
<tr><th>Trader's Award (reports)</th><td>TU Investment Club</td><td>93 / 100</td></tr>
<tr><th>Options Trading Award</th><td>LMU Investment Club</td><td>+46.2%</td></tr>
</tbody></table></div>
<p><a href={SITE.officialUrl}>Full results and rankings</a></p>
<h3>Participating universities</h3>
<ul>
<li>Ludwig Maximilian University of Munich — LMU Investment Club (Germany)</li>
<li>Technical University of Munich — TU Investment Club (Germany)</li>
<li>RWTH Aachen University — Aachen Investment Club (Germany)</li>
<li>University of Geneva — IFSA Geneva (Switzerland)</li>
<li>University of Sheffield — Investment Society (UK)</li>
<li>University of Alberta — The Business Finance Association (Canada)</li>
<li>University of Toronto — Rational Capital Investment Club (Canada)</li>
<li>University of California, Los Angeles (US)</li>
<li>Roger Williams University — MBA Program (US)</li>
<li>Indian Institute of Technology Roorkee — Finance Club IITR (India)</li>
<li>University of Delhi — Alpha Research &amp; Investment Cell (India)</li>
<li>University of New South Wales — Alternative Investment Society (Australia)</li>
<li>Universiti Kebangsaan Malaysia — Bursa Young Investor Club (Malaysia)</li>
<li>Waseda University — Forward Investment Club (Japan)</li>
<li>Keio University (Japan)</li>
<li>Meiji University (Japan)</li>
</ul>

<h2>WIC2024</h2>
<p>The first edition ran for two months with 12 universities from 9 countries. TU Investment Club of the Technical University of Munich won with a return of 28.4%, growing its portfolio from $300,000 to $384,000.</p>
    </>
  );
}
