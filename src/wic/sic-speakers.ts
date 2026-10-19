export type SicSpeaker = {
  id: string;
  image: string;
  name: string;
  titles: readonly string[];
  biography?: string;
  published?: boolean;
};

export const SIC_2026_PANEL_THEME =
  "テーマ：『高校生から考える「お金と意思決定」―第一線の金融マンは何を見て、どう選ぶのか』";

export const SIC_2026_SPEAKERS: readonly SicSpeaker[] = [
  {
    id: "yoshitaka-araya",
    image: "/images/sic/speakers/yoshitaka-araya.jpg",
    name: "荒谷 義孝 / Yoshitaka Araya",
    titles: ["マネックス証券", "フィナンシャル・インテリジェンス部"],
    biography:
      "中央大学法学部卒。2023年マネックス証券入社。2026年4月より現所属のフィナンシャル・インテリジェンス部へ異動。現在は市況概況を執筆しつつ、今後の本格的な執筆に向け勉強中。",
  },
  {
    id: "kei-okazaki",
    image: "/images/sic/speakers/kei-okazaki.png",
    name: "岡崎 啓 / Kei Okazaki",
    titles: [
      "東京証券取引所株式部兼ETF推進部",
      "Head of ETF Secondary Trading",
    ],
    biography:
      "2013年からETF市場に関わっていて、現在はETF市場全体の戦略の責任者。\nこれまでにマーケットメイク制度やアクティブETFの上場制度など、様々な市場整備をしてきた。\n機関投資家向けの取引プラットフォームの開発などもしていて、毎週金曜日はラボで開発チームと一緒に働いている。",
  },
  {
    id: "masanori-ono",
    image: "/images/sic/speakers/masanori-ono-optimized.jpg",
    name: "小野 正法 / Masanori Ono",
    titles: [
      "ブラックロック・ジャパン株式会社",
      "ブラックロック・グローバル・マーケッツ本部 ETFキャピタル・マーケッツ部 ディレクター",
    ],
    biography:
      "2023年9月にブラックロック・ジャパンへ入社し、ETFキャピタル・マーケッツ部に所属。ETFの流動性向上や取引環境の構築・改善に向け、市場関係者や投資家に対して商品構造や取引に関する専門的な情報提供を行う。市場関係者には証券会社やマーケットメーカーのディーラーなども含まれ、トレーディングおよび販売・ディストリビューションに関する情報交換にも従事。また、ETF市場全体の活性化やエコシステムの発展、さらにはiシェアーズの普及に向け、ETFのプロダクト組成や市場の構造的課題の解決に向けた取り組みを支援している。\nブラックロック入社以前は、FinTech企業であるSimplex Inc.、クレディ・スイス証券、野村證券、Instinet Pacific Ltd.にて、トレーディング業務からテクノロジー、コンサルティング、プロジェクト・マネジメントまで幅広い業務に従事。それ以前はJ.P.モルガン証券株式会社にて、テクノロジー・サポート、株式電子取引セールス・トレーダー、デルタワン・ディーラーなどの業務を担当。",
  },
  {
    id: "nobuhiko-shimura",
    image: "/images/sic/speakers/nobuhiko-shimura.png",
    name: "志村 暢彦 / Shimura Nobuhiko",
    titles: ["スカイ インベストメント マネージャーズ株式会社", "代表"],
    biography:
      "2023年に米国へ拠点を移し、スタンフォード大学で客員研究員・フェローを務める。それ以前には独立・起業し、マレーシアを拠点に国際的な活動を展開。\n\nニッセイ・シュローダーズ・アセットマネジメント（ロンドン）、ニッセイアセットマネジメント、信金中央金庫においてキャリアを形成。ファンドマネージャー、トレーダー、アナリストとして、国内外の大手年金基金・投資信託の運用に従事するほか、市場・リスク管理に関する業務刷新プロジェクトにも携わる。\n\n2001年以降、グローバル株式のアクティブ運用を専門とし、個別株の選別からオプションを活用した運用まで幅広い実務経験を持つ。機関投資家向けのグローバル株式運用と、個別株・デリバティブを用いた実践的な運用の双方に精通する。\n\n現在は、株式会社ファーストパートナーズのチーフ・ストラテジストを務めるほか、企業経営者、研究者、個人投資家に対する資産運用支援や、長期的な資産形成の新たな枠組みづくりに取り組んでいる。\n\nテレビ東京系列「Newsモーニングサテライト」、日経CNBC「朝エクスプレス」「昼エクスプレス」、BSテレ東「NIKKEI NEWS」、ラジオNIKKEI「おはようマーケット」、Wall Street Journalなど、経済・金融メディアへの出演・掲載多数。\n\n著書に『個人投資家もマネできる 世界の富裕層がお金を増やしている方法』（ダイヤモンド社）。現在、新たな資産形成理論をテーマとした新刊を執筆中。\n\nこうした国内外での運用実務と研究活動をもとに、日本の資産形成を支えるインフラと金融リテラシーを世界水準へ引き上げることを目指すとともに、金融とサイエンスの進化を社会に取り込み、資産形成を起点として新たなイノベーションが生まれる基盤づくりに取り組んでいる。",
    published: false,
  },
  {
    id: "hideki-mitsuzuka",
    image: "/images/sic/speakers/hideki-mitsuzuka.png",
    name: "三塚 英毅 / Hideki Mitsuzuka",
    titles: ["Webull証券株式会社", "取締役 兼 執行役員 COO"],
    biography:
      "三塚様は、大学卒業後、Bank of America証券株式会社（旧メリルリンチ日本証券）を経て、BNPパリバ証券株式会社にて複数の役職を歴任され、COOに就任されました。Web3企業であるAnimocaBrands株式会社には創業時よりCOOとして参画され、その後、2024年3月より現職に就かれています。その他、講談社アドバイザー、渋谷区アドバイザー、音楽制作会社Music For MusicのCROなども兼務されています。",
  },
  {
    id: "keita-yamaguchi",
    image: "/images/sic/speakers/keita-yamaguchi.jpg",
    name: "山口 慧太 / Keita Yamaguchi",
    titles: [
      "マネックス証券",
      "フィナンシャル・インテリジェンス部",
    ],
    biography:
      "慶応義塾大学経済学部卒。2019年にマネックス証券に入社。2024年からアナリスト業務を担当。現在は日本の経済指標や国内市況の執筆、各種ウェブコンテンツ作成に従事。日本証券アナリスト協会検定会員。",
  },
  {
    id: "yasuji-yamanaka",
    image: "/images/sic/speakers/yasuji-yamanaka.png",
    name: "山中 康司 / Yamanaka Yasuji",
    titles: ["有限会社アセンダント", "取締役"],
    biography:
      "1982年に慶應義塾大学を卒業後、バンク・オブ・アメリカに入行。自己勘定取引業務に従事し、1989年にバイス・プレジデントへ昇進。\n\n1997年に日興證券株式会社へ移籍し、1999年には日興信託銀行株式会社（後の日興シティ信託銀行株式会社）の外国為替部次長に就任。\n\n2002年、金融コンサルティング会社である有限会社アセンダントを設立し、取締役に就任。2019年には、TradingViewの日本市場責任者に就任した。",
    published: false,
  },
  {
    id: "rogerpapa",
    image: "/images/sic/speakers/rogerpapa.jpg",
    name: "ロジャーパパ",
    titles: ["米国株投資家、経営者、投資家YouTuber"],
    biography:
      "アメリカ企業3社で管理職として20年勤務した後、2021年にサイドFIRE生活を開始。\n米国株投資歴13年。米国債や米国不動産、FXや非上場企業への直接投資など多岐にわたる運用を継続中。登録者15万人のYouTubeでは投資実績に加えて、米国ETF銘柄や相場サイクルなどを解説。\nNYウォール街で活躍するファンドマネージャーやアナリスト、ブローカーとの独占取材動画も配信中。会社経営6期目。米国大学院にてジャーナリズム修士号取得。アメリカ大陸一周1.6万kmドライブ達成。9歳と7歳の二児のパパ。趣味はテニスとハワイ歴史研究。\n\n書籍\n・100年変わらないお金持ちの真実 (KADOKAWA2026年)\n・米国株投資で達成する！FIRE最強の教科書 (SBクリエイティブ出版2022年)\n\nYouTube https://www.youtube.com/@rogerpapa\nX https://x.com/Rogerpapadesu",
  },
];
