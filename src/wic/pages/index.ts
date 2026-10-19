import type { ComponentType } from "react";
import type { DetailMeta } from "../DetailPage";
import type { Localized, WicSlug } from "../data";
import type { WicLang } from "../lang";
import AiAgent, { meta as aiAgent } from "./AiAgent";
import Past, { meta as past } from "./Past";
import Rules, { meta as rules } from "./Rules";
import Schedule, { meta as schedule } from "./Schedule";
import Trader, { meta as trader } from "./Trader";

export const DETAIL_PAGES: Record<WicSlug, { meta: Localized<DetailMeta>; Body: ComponentType<{ lang: WicLang }> }> = {
  trader: { meta: trader, Body: Trader },
  "ai-agent": { meta: aiAgent, Body: AiAgent },
  rules: { meta: rules, Body: Rules },
  schedule: { meta: schedule, Body: Schedule },
  past: { meta: past, Body: Past },
};
