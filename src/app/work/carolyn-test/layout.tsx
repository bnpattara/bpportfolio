import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Carolyn (archive) — Calvin Klein — Benn Pattara",
  description:
    "Earlier Calvin Klein Carolyn case study layout (archived). The current version lives at /work/carolyn.",
  openGraph: {
    title: "The Carolyn (archive) — Calvin Klein — Benn Pattara",
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
