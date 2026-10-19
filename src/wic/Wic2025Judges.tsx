"use client";

import { useId, useState } from "react";
import { SIC_2026_SPEAKERS } from "./sic-speakers";
import { pick, type WicLang } from "./lang";

// WIC2025 judges, carried over from the 2025 report page. Their titles and
// biographies were approved by the judges themselves: keep them word for word.

// Japanese biographies are the ones maintained for the SIC speaker pages.
const sicBio = (id: string) =>
  SIC_2026_SPEAKERS.find((speaker) => speaker.id === id)?.biography?.split(
    "\n\n"
  ) ?? [];

const judgesData = [
  {
    name: { en: "Nobuhiko Shimura", ja: "志村 暢彦" },
    image: "/images/wic/judge-shimura.jpg",
    titles: {
      en: [
        "CEO, Skye Investment Managers Co., Ltd.",
        "Visiting Fellow, Stanford University",
      ],
      ja: [
        "スカイ インベストメント マネージャーズ株式会社 代表",
        "スタンフォード大学 客員研究員",
      ],
    },
    bio: {
      en: [
        "Based in the United States since 2023, where he has served as a visiting scholar and fellow at Stanford University. Before that he went independent and founded his own firm, working internationally out of Malaysia.",
        "He built his career at Nissay Schroders Asset Management (London), Nissay Asset Management and Shinkin Central Bank. As a fund manager, trader and analyst he managed assets for major pension funds and investment trusts in Japan and abroad, and worked on projects to overhaul market and risk management operations.",
        "Since 2001 he has specialized in the active management of global equities, with hands-on experience ranging from individual stock selection to options-based strategies, for institutional portfolios and in practical trading alike.",
        "He currently serves as Chief Strategist at First Partners Inc., advises business owners, researchers and individual investors on asset management, and is working on new frameworks for long-term wealth building.",
        "He appears regularly in financial media, including TV Tokyo's News Morning Satellite, Nikkei CNBC, BS TV Tokyo's NIKKEI NEWS, Radio NIKKEI and the Wall Street Journal.",
      ],
      ja: sicBio("nobuhiko-shimura"),
    },
    publishedWork: {
      title: {
        en: "Investment Strategies of the World's Wealthy That Individual Investors Can Also Use",
        ja: "個人投資家もマネできる 世界の富裕層がお金を増やしている方法",
      },
      publisher: { en: "Diamond Inc.", ja: "ダイヤモンド社" },
      note: { en: "Bestseller", ja: "ベストセラー" },
    },
  },
  {
    name: { en: "Yasuji Yamanaka", ja: "山中 康司" },
    image: "/images/wic/judge-yamanaka.jpg",
    titles: {
      en: ["Director, Ascendant Inc."],
      ja: ["有限会社アセンダント 取締役"],
    },
    bio: {
      en: [
        "Graduated from Keio University in 1982 and joined Bank of America. He engaged in proprietary trading operations and was promoted to Vice President in 1989.",
        "In 1997, he moved to Nikko Securities, and in 1999 became Deputy General Manager of the Foreign Exchange Division at NikkoCiti Trust & Banking.",
        "In 2002, he founded Ascendant Inc., a financial consulting firm, where he serves as Director. Since 2019, he has been the Head of Japan Market at TradingView.",
      ],
      ja: sicBio("yasuji-yamanaka"),
    },
    publishedWork: {
      title: {
        en: "How to Read and Use Technical Indicators",
        ja: "テクニカル指標の読み方・使い方",
      },
      publisher: {
        en: "Nihon Jitsugyo Publishing (2015)",
        ja: "日本実業出版社（2015年）",
      },
      note: { en: "and other publications", ja: "ほか著書多数" },
    },
  },
];


type Judge = (typeof judgesData)[number];

function JudgeProfile({ judge, lang }: { judge: Judge; lang: WicLang }) {
  // The long biography stays folded away until asked for.
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <article className="border-t border-wic-line pt-5">
      <div className="flex items-center gap-4">
        <img
          src={judge.image}
          alt={judge.name[lang]}
          width={96}
          height={96}
          className="size-20 flex-none rounded-full object-cover"
        />
        <div className="min-w-0">
          <h3 className="!m-0">{judge.name[lang]}</h3>
          {judge.titles[lang].map((title) => (
            <p key={title} className="!m-0 text-[0.95rem] text-wic-muted">
              {title}
            </p>
          ))}
        </div>
      </div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((prev) => !prev)}
        className="mt-3 cursor-pointer border-b border-wic-ink/35 text-[0.95rem] text-wic-ink"
      >
        {open ? pick(lang, "Hide profile", "経歴を閉じる") : pick(lang, "Read profile", "経歴を見る")}
      </button>
      <div id={panelId} hidden={!open} className="mt-4">
        {judge.bio[lang].map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <p className="muted">
          {pick(lang, "Published work: ", "著書：")}
          &quot;{judge.publishedWork.title[lang]}&quot; ({judge.publishedWork.publisher[lang]}) -{" "}
          {judge.publishedWork.note[lang]}
        </p>
      </div>
    </article>
  );
}

export function Wic2025Judges({ lang }: { lang: WicLang }) {
  return (
    <div className="grid gap-6">
      {judgesData.map((judge) => (
        <JudgeProfile key={judge.name.en} judge={judge} lang={lang} />
      ))}
    </div>
  );
}
