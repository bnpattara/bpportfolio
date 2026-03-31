import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Diesel Iceberg — Prose test (draft) — Benn Pattara",
  description:
    "Draft narrative from portfolio-prose.docx with primary Diesel case study embedded as artifact.",
  openGraph: {
    title: "Diesel Iceberg — Prose test (draft) — Benn Pattara",
    url: "/work/diesel-test",
    type: "website",
    images: [{ url: "https://bennpattara.com/og/diesel.jpg", width: 1200, height: 630 }],
  },
};

export default function DieselTestLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return <>{children}</>;
}
