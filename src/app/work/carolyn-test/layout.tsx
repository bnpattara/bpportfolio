import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Carolyn · Calvin Klein · Benn Pattara",
  description:
    "Redirects to the current Carolyn case study. Earlier layout is archived at /work/carolyn-archive.",
  openGraph: {
    title: "The Carolyn · Calvin Klein · Benn Pattara",
    url: "/work/carolyn",
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
