import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stylect — Prose test (draft) — Benn Pattara",
  description:
    "Draft narrative from portfolio-prose.docx with design system and app prototype embeds.",
  openGraph: {
    title: "Stylect — Prose test (draft) — Benn Pattara",
    url: "/work/stylect-test",
    type: "website",
    images: [{ url: "https://bennpattara.com/og/stylect.jpg", width: 1200, height: 630 }],
  },
};

export default function StylectTestLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return <>{children}</>;
}
