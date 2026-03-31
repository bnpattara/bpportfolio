import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vault by Saks — Prose test (draft) — Benn Pattara",
  description:
    "Draft narrative from portfolio-prose.docx with Vault financial model and Saks3 alternate case study embedded.",
  openGraph: {
    title: "Vault by Saks — Prose test (draft) — Benn Pattara",
    url: "/work/saks-test",
    type: "website",
    images: [{ url: "https://bennpattara.com/og/saks.jpg", width: 1200, height: 630 }],
  },
};

export default function SaksTestLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return <>{children}</>;
}
