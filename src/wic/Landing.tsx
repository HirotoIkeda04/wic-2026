import { WicFooter } from "./WicFooter";
import { WicHeader } from "./WicHeader";
import { WicPage } from "./WicPage";
import type { WicLang } from "./lang";
import { Divisions } from "./landing/Divisions";
import { EntrySection } from "./landing/EntrySection";
import { Hero } from "./landing/Hero";
import { LastYear } from "./landing/LastYear";
import { Prize } from "./landing/Prize";
import { RulesGlance } from "./landing/RulesGlance";
import { ScheduleSection } from "./landing/ScheduleSection";
import { Statement } from "./landing/Statement";

/** Landing page: a plain scrolling page, one section per topic. */
export function Landing({ lang }: { lang: WicLang }) {
  return (
    <WicPage tone="dark" lang={lang}>
      <WicHeader lang={lang} />
      <main>
        <Hero lang={lang} />
        <Statement lang={lang} />
        <Prize lang={lang} />
        <LastYear lang={lang} />
        <Divisions lang={lang} />
        <RulesGlance lang={lang} />
        <ScheduleSection lang={lang} />
        <EntrySection lang={lang} />
      </main>
      <WicFooter lang={lang} />
    </WicPage>
  );
}
