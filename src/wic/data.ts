import type { WicLang } from "./lang";

// This mirror (wic.ihiro.page) serves the WIC pages at the root; the official
// copy lives under /wic on the JPSI site, which also hosts the pages linked below.
export const JPSI_URL = "https://jpsi-association.com";
export const WASEDA_AI_URL = "https://wasedaaiclub.com/";
const CONTACT_EMAIL = "jpsi.waseda.univ@outlook.com";

/** Copy that exists in both languages. `/wic/ja` is a dev-only review copy of `/wic`. */
export type Localized<T = string> = Record<WicLang, T>;

export const SITE = {
  shortName: "WIC 2026",
  description: {
    en: "University teams from around the world compete in U.S. stock demo trading, ranked on both returns and investment reports. Free to enter, $10,000 in prizes. Trader and AI Agent divisions. Hosted by JPSI.",
    ja: "世界各国の大学チームが米国株のデモ取引で競い合い、運用成績と投資レポートの双方で順位を競う。参加費は無料、賞品は総額1万ドル相当。トレーダー部門とAIエージェント部門。主催はJPSI。",
  },
  organizer: {
    en: "Japan Students Investment Union (JPSI)",
    ja: "一般社団法人 全日本学生投資連盟（JPSI）",
  },
  coHost: { en: "Waseda AI Society", ja: "早稲田AI研究会" },
  /** First sentence of the description; shown on the poster */
  lead: {
    en: "University teams from around the world compete in U.S. stock demo trading, ranked on both returns and investment reports.",
    ja: "世界各国の大学チームが米国株のデモ取引で競い合い、運用成績と投資レポートの双方で順位を競う。",
  },
  legal: {
    en: "JPSI's activities are for student investment education and do not recommend buying or selling any financial product. © JPSI",
    ja: "JPSIの活動は学生の投資教育を目的とするものであり、特定の金融商品の売買を推奨するものではない。© JPSI",
  },
  /** Respondent link of the entry form (WIC2026 rules page, section C). The
   *  form requires a Google sign-in because it takes file uploads. */
  entryUrl:
    "https://docs.google.com/forms/d/e/1FAIpQLSecXOTRNftrbkZUggERSysnvpwWJrp6R4aNpSqPGSKb9oM2-g/viewform",
  contact: [
    { label: "Email", href: `mailto:${CONTACT_EMAIL}` },
    { label: "X", href: "https://x.com/official33541" },
    { label: "Instagram", href: "https://www.instagram.com/jpsi_official/" },
  ],
};

export type WicSlug = "trader" | "ai-agent" | "rules" | "schedule" | "past";
export type NavItem = { slug: WicSlug; label: Localized };

export const NAV: NavItem[] = [
  { slug: "trader", label: { en: "Trader division", ja: "トレーダー部門" } },
  { slug: "ai-agent", label: { en: "AI Agent division", ja: "AIエージェント部門" } },
  { slug: "rules", label: { en: "Rules", ja: "ルール" } },
  { slug: "schedule", label: { en: "Schedule", ja: "日程" } },
  { slug: "past", label: { en: "Past editions", ja: "過去の大会" } },
];

/** Path of the landing page (no slug) or a detail page, in the given language. */
export function wicHref(lang: WicLang, slug?: WicSlug): string {
  const base = lang === "ja" ? "/ja" : "";
  return slug ? `${base}/${slug}` : base || "/";
}

export type ScheduleRow = { date: Localized; event: Localized; note?: Localized };

export type ScheduleMonth = { month: Localized; trader: ScheduleRow[]; aiAgent: ScheduleRow[] };

/**
 * Dates for the Schedule page. Events for both divisions sit before and after
 * the division months, where the two divisions run side by side as in the sales deck.
 */
export const SCHEDULE: { before: ScheduleRow[]; months: ScheduleMonth[]; after: ScheduleRow[] } = {
  before: [
    {
      date: { en: "Oct 15, 2026", ja: "2026年10月15日" },
      event: { en: "Entries open", ja: "エントリー受付開始" },
      note: { en: "Apply separately for each division.", ja: "部門ごとに応募する。" },
    },
    {
      date: { en: "Nov 15", ja: "11月15日" },
      event: { en: "Entries close", ja: "エントリー締切" },
      note: { en: "23:59 ET.", ja: "米国東部時間（ET）23:59。" },
    },
    {
      date: { en: "Dec 7", ja: "12月7日" },
      event: { en: "Opening ceremony", ja: "開会式" },
      note: { en: "Online. At least one member of each team must attend to be eligible for awards.", ja: "オンライン開催。受賞対象となるには、各チームから1名以上が出席しなければならない。" },
    },
  ],
  months: [
    {
      month: { en: "December 2026", ja: "2026年12月" },
      trader: [
        {
          date: { en: "Dec 7 – 20", ja: "12月7日〜20日" },
          event: { en: "Test trading", ja: "テスト取引" },
          note: { en: "Set up your account and get used to TWS.", ja: "口座を設定し、Trader Workstation（TWS）の操作に慣れる。" },
        },
        { date: { en: "Dec 31", ja: "12月31日" }, event: { en: "Monthly report for January due (optional)", ja: "1月分の月次レポート提出（任意）" } },
      ],
      aiAgent: [{ date: { en: "Dec 7 – 31", ja: "12月7日〜31日" }, event: { en: "Development", ja: "開発" } }],
    },
    {
      month: { en: "January 2027", ja: "2027年1月" },
      trader: [
        { date: { en: "Jan 4", ja: "1月4日" }, event: { en: "Live trading begins", ja: "本番取引開始" } },
        { date: { en: "Jan 31", ja: "1月31日" }, event: { en: "Monthly report for February due (optional)", ja: "2月分の月次レポート提出（任意）" } },
      ],
      aiAgent: [
        { date: { en: "Jan 4 – 31", ja: "1月4日〜31日" }, event: { en: "Trial run", ja: "試運転" } },
        { date: { en: "Jan 31", ja: "1月31日" }, event: { en: "Pre-report due", ja: "事前レポート提出" } },
      ],
    },
    {
      month: { en: "February 2027", ja: "2027年2月" },
      trader: [{ date: { en: "Feb 28", ja: "2月28日" }, event: { en: "Monthly report for March due (optional)", ja: "3月分の月次レポート提出（任意）" } }],
      aiAgent: [
        { date: { en: "Feb 1", ja: "2月1日" }, event: { en: "Live trading begins", ja: "本番取引開始" } },
      ],
    },
    {
      month: { en: "March 2027", ja: "2027年3月" },
      trader: [
        {
          date: { en: "Mar 25", ja: "3月25日" },
          event: { en: "Live trading ends", ja: "本番取引終了" },
          note: { en: "Close all positions by 15:50 ET.", ja: "米国東部時間（ET）15:50までに全ポジションを決済する。" },
        },
        { date: { en: "Mar 26 – 31", ja: "3月26日〜31日" }, event: { en: "Final report due", ja: "最終レポート提出" } },
      ],
      aiAgent: [
        {
          date: { en: "Mar 25", ja: "3月25日" },
          event: { en: "Live trading ends", ja: "本番取引終了" },
          note: { en: "Close all positions by 15:50 ET.", ja: "米国東部時間（ET）15:50までに全ポジションを決済する。" },
        },
        { date: { en: "Mar 26 – 31", ja: "3月26日〜31日" }, event: { en: "Post-report and operation logs due", ja: "事後レポート・運用ログ提出" } },
      ],
    },
  ],
  after: [
    {
      date: { en: "Apr 22", ja: "4月22日" },
      event: { en: "Closing and awards ceremony", ja: "閉会式・表彰式" },
      note: { en: "In person, with online participation available. At least one member of each team must attend to be eligible for awards.", ja: "対面開催（オンライン参加も可能）。受賞対象となるには、各チームから1名以上が出席しなければならない。" },
    },
  ],
};

/** Image paths under public/. */
const IMG = "/images/wic/2026";
export const WIC_IMAGES = {
  /** Poster photo; the same one the WIC2025 page used as its hero. */
  hero: { src: "/images/hero-background.jpg", width: 2560, height: 1702 },
  /** WIC2025 awards ceremony, shown on the Past editions page. */
  ceremony2025: `${IMG}/hero.jpg`,
  logos: {
    ibkr: `${IMG}/logo-ibkr.png`,
    tradingview: `${IMG}/logo-tradingview.png`,
    webull: `${IMG}/logo-webull.png`,
    okayasu: `${IMG}/logo-okayasu.png`,
    nsj: `${IMG}/logo-nsj.png`,
  },
};
