import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "On APEX — Prose test (draft) — Benn Pattara",
  description:
    "Draft narrative from portfolio-prose.docx with PRD + design system and On APEX prototype embeds.",
  openGraph: {
    title: "On APEX — Prose test (draft) — Benn Pattara",
    url: "/work/on-test",
    type: "website",
    images: [{ url: "https://bennpattara.com/og/on.jpg", width: 1200, height: 630 }],
  },
};

export default function OnTestLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return <>{children}</>;
}
