import type { ReactNode } from "react";

export function Callout({ children }: { children: ReactNode }) {
  return <div className="my-5 mb-6 rounded-[0.6rem] border border-wic-line px-[1.1rem] py-4 [&>p:last-child]:mb-0">{children}</div>;
}
