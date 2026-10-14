# WIC 2026 — Next.js への組み込み手順

このリポジトリの `src/wic/` は、jpsi-web（Next.js 16 / React 19 / Tailwind v4）の
`components/wic/` にそのまま置ける React コンポーネント一式です。
Astro はこのミラー（wic.ihiro.page）を配信するための殻で、`src/pages/*.astro` と
`src/layouts/Base.astro` は `<head>` を出すだけの数行です。

## 持ち込むもの

| このリポジトリ | jpsi-web での置き場所 |
|---|---|
| `src/wic/*.tsx`, `src/wic/pages/*.tsx` | `components/wic/`（`pages/` ごと） |
| `src/wic/hero.ts` | `components/wic/hero.ts`（フレームワーク非依存の TS） |
| `src/wic/data.ts` | `components/wic/data.ts`（または `data/wic-2026.ts`） |
| `src/wic/wic.css` | `components/wic/wic.css` |
| `public/images/wic/2026/*` | `public/images/wic/2026/*`（パスは `data.ts` の `WIC_IMAGES`） |

Next 固有の API は使っていません。依存は `react` と Tailwind だけです。

## 手順

1. **CSS を取り込む**
   `app/globals.css`（`@import "tailwindcss"` がある CSS）に 1 行足します。
   ```css
   @import "../components/wic/wic.css";
   ```
   `wic.css` は `@theme` と `@apply` を使うので、Tailwind が処理するファイルから
   `@import` する必要があります（単独で `import` しない）。
   トークンはすべて `wic-` 接頭辞（`text-wic-ink`、`bg-wic-bg` など）で、既存のテーマと衝突しません。

2. **フォント**
   デザインは Inter（可変、ウェイト 300〜900）前提です。`next/font/google` で Inter を読み込み、
   `wic.css` の `--font-wic` の先頭にその CSS 変数を足すか、`.wic` の `font-family` を上書きしてください。
   読み込まない場合は `-apple-system` などのフォールバックで表示されます。

3. **ルート**
   WIC 専用ヘッダー（`WicHeader`）を使うので、サイト共通のヘッダー・フッターを付ける
   `app/(site)/layout.tsx` の外に置きます。例:
   ```
   app/wic/layout.tsx          ← 共通ヘッダーなしの薄いレイアウト（下記）
   app/wic/page.tsx            ← トップ（演出）
   app/wic/divisions/page.tsx
   app/wic/rules/page.tsx
   app/wic/scoring/page.tsx
   app/wic/schedule/page.tsx
   app/wic/past/page.tsx
   ```
   `data.ts` の `NAV[].href` は `/divisions/` のようにルート直下になっています。
   `/wic/` 配下に置くなら `href: '/wic/divisions'` に書き換えてください（ヘッダー・ページ送り・
   「Read more」はすべて `NAV` を参照しているので、変更箇所はここだけです）。
   `WicHeader` のロゴと「Back」は `href="/"` 固定なので、`/wic` に変えてください。

4. **page.tsx の雛形**
   トップ:
   ```tsx
   // app/wic/page.tsx
   import type { Metadata } from "next";
   import { Landing } from "@/components/wic/Landing";
   import { SITE } from "@/components/wic/data";

   export const metadata: Metadata = {
     title: SITE.title,
     description: SITE.description,
     openGraph: { title: "World Investment Competition 2026", description: SITE.description, type: "website", images: ["/images/wic/2026/hero.jpg"] },
     themeColor: "#141414",
   };

   export default function Page() {
     return <Landing />;
   }
   ```
   詳細ページ:
   ```tsx
   // app/wic/rules/page.tsx
   import type { Metadata } from "next";
   import { DetailPage } from "@/components/wic/DetailPage";
   import Rules, { meta } from "@/components/wic/pages/Rules";

   export const metadata: Metadata = {
     title: `${meta.title} — World Investment Competition 2026`,
     description: meta.lead,
   };

   export default function Page() {
     return (
       <DetailPage {...meta}>
         <Rules />
       </DetailPage>
     );
   }
   ```
   `Landing` と `DetailPage` は `"use client"` です。`Rules` などの本文はサーバーコンポーネントのままで
   問題ありません（children として渡しています）。

5. **構造化データ（任意）**
   トップページの JSON-LD は `src/pages/index.astro` にあります。必要なら `page.tsx` で
   `<script type="application/ld+json">` として出してください。

6. **画像**
   いまは素の `<img>`（`width`/`height` 付き）です。既存サイトの方式に合わせて `next/image` に
   替える場合、対象は `Landing.tsx` のヒーロー写真とスポンサーロゴ、`pages/Past.tsx` の写真です。
   WebGL のテクスチャ（丸い写真 5 枚）は `hero.ts` が `WIC_IMAGES.circles` の URL を直接読むので、
   そのまま `public/` に置いてください。

## 動作上の注意

- トップページの演出（`hero.ts`）は、タッチ端末ではポスターが大きい間ページを固定し、
  指の動きで進めます（スマホのブラウザのバーが伸縮して崩れるのを防ぐため）。
  ズームアウトが終わると通常スクロールに引き継ぎます。iOS Safari と Android Chrome で検証済みです。
- `?debug=1` を付けると演出の内部状態（フレーム間隔、scrollY、固定状態）を左上に表示します。
- 詳細ページへ移動するリンクには `?y=<位置>` が付き、戻ったときに同じ位置から再開します。
- `WicHeader` の Entry と Contact のリンクは `#` のプレースホルダーです（`data.ts` の `SITE`）。
