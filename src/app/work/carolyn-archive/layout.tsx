import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Carolyn (archive) · Calvin Klein · Benn Pattara",
  description:
    "Earlier Calvin Klein Carolyn case study HTML (archived). The current version lives at /work/carolyn.",
  robots: { index: false, follow: true },
  openGraph: {
    title: "The Carolyn (archive) · Calvin Klein · Benn Pattara",
    description:
      "Earlier Carolyn case study layout. The current version lives at /work/carolyn.",
    url: "/work/carolyn-archive",
    type: "website",
    images: [{ url: "https://bennpattara.com/og/carolyn.jpg", width: 1200, height: 630 }],
  },
};

export default function CarolynArchiveLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return <>{children}</>;
}
