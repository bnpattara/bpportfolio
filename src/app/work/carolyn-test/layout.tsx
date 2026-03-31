import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Carolyn — Prose test (draft) — Benn Pattara",
  description:
    "Draft narrative from portfolio-prose.docx with persona tool and Cameron profile artifacts.",
  openGraph: {
    title: "The Carolyn — Prose test (draft) — Benn Pattara",
    url: "/work/carolyn-test",
    type: "website",
    images: [{ url: "https://bennpattara.com/og/carolyn.jpg", width: 1200, height: 630 }],
  },
};

export default function CarolynTestLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return <>{children}</>;
}
