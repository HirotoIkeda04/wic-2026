/** `/wic` renders in English; `/wic/ja` reuses the same sections in Japanese. */
export type WicLang = "en" | "ja";

export function pick<T>(lang: WicLang, en: T, ja: T): T {
  return lang === "ja" ? ja : en;
}
