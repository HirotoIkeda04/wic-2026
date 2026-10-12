export const SITE = {
  name: 'World Investment Competition',
  shortName: 'WIC 2026',
  title: 'World Investment Competition 2026 | JPSI',
  description:
    'University teams from around the world compete in U.S. stock demo trading, ranked on both returns and investment reports. Free to enter, $10,000 in prizes. Trader and AI Agent divisions. Hosted by JPSI.',
  organizer: 'Japan Students Investment Union (JPSI)',
  organizerUrl: 'https://jpsi-association.com/',
  coHost: 'Waseda AI Society',
  officialUrl: 'https://jpsi-association.com/wic',
  guideDate: 'October 5, 2026',
  legal:
    "JPSI's activities are for student investment education and do not recommend buying or selling any financial product. © JPSI",
  /* Placeholders until the official channels are published */
  entryUrl: '#',
  contact: [
    { label: 'Email', href: '#' },
    { label: 'X', href: '#' },
    { label: 'Instagram', href: '#' },
  ],
};

export type NavItem = { slug: string; href: string; label: string };
export const NAV: NavItem[] = [
  { slug: 'divisions', href: '/divisions/', label: 'Divisions' },
  { slug: 'rules', href: '/rules/', label: 'Rules' },
  { slug: 'scoring', href: '/scoring/', label: 'Scoring & Awards' },
  { slug: 'schedule', href: '/schedule/', label: 'Schedule' },
  { slug: 'past', href: '/past/', label: 'Past editions' },
];

export const SCHEDULE: { date: string; tbc?: boolean; event: string; note?: string }[] = [
  { date: 'Oct 15, 2026', event: 'Entries open', note: 'Apply separately for each division.' },
  { date: 'Dec 7', event: 'Opening ceremony', note: 'Online. At least one member of each team must attend.' },
  { date: 'Dec 7 – 20', event: 'Trader: test trading', note: 'Set up your account and get used to TWS.' },
  { date: 'Dec 7 – 31', event: 'AI Agent: development' },
  { date: 'Dec 31', event: 'Trader: optional monthly report for January' },
  { date: 'Jan 4, 2027', event: 'Trader: live trading begins' },
  { date: 'Jan 4 – 31', event: 'AI Agent: trial run' },
  { date: 'Jan 31', event: 'Trader: optional monthly report for February' },
  { date: 'Feb 1', event: 'AI Agent: live trading begins' },
  { date: 'Feb 28', event: 'Trader: optional monthly report for March' },
  { date: 'Mar 25', event: 'Live trading ends', note: 'All positions must be closed by 15:50 US Eastern Time. Anything still open is closed by the organizers before results are calculated.' },
  { date: 'Mar 26 – 31', event: 'Reports due', note: 'Trader: final report. AI Agent: post-report and logs.' },
  { date: 'Apr 22', tbc: true, event: 'Closing and awards ceremony', note: 'In person in Tokyo, with online participation available.' },
];
