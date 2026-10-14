import { SCHEDULE } from "../data";
import type { DetailMeta } from "../DetailPage";

export const meta: DetailMeta = {
  slug: "schedule",
  title: "Schedule",
  lead: "From entries opening in October to the closing ceremony in April. Dates are in Japan time unless noted.",
};

/** Body of the Schedule page; rendered inside <DetailPage {...meta}>. */
export default function Schedule() {
  return (
    <>
<ul className="!list-none !p-0 mb-6">
  {SCHEDULE.map((row) => (
    <li key={row.date + row.event} className="!m-0 grid grid-cols-[7.5rem_1fr] gap-4 border-b border-wic-line py-[0.7em]">
      <span className="whitespace-nowrap font-semibold">{row.date}{row.tbc && <> <span className="wic-tbc">TBC</span></>}</span>
      <span>{row.event}{row.note && <span className="block text-[0.95rem] text-wic-muted">{row.note}</span>}</span>
    </li>
  ))}
</ul>
<p className="muted">Official announcements, including weekly rankings and any schedule changes, are made in the WhatsApp group.</p>
    </>
  );
}
