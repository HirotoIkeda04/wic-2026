import type { ReactNode } from "react";

/**
 * Mirror-only. The landing sections and the Past page take their islands as
 * props (`status`, `globe`, ...), which the Astro pages fill with named slots
 * (`<EntryStatus slot="status" client:load />`). Astro's React renderer sets
 * those props from the slots at render time, after the props written in the
 * template, but `astro check` cannot see that; passing this empty value for
 * each such prop keeps the pages type-correct.
 */
export const slot: ReactNode = undefined;
