import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "On APEX · Community Platform · Benn Pattara",
  description:
    "Community PWA case study for On Running: pods, retention, design system, and interactive prototype.",
  openGraph: {
    title: "On APEX · Community Platform · Benn Pattara",
    description:
      "Community PWA case study for On Running: pods, retention, design system, and interactive prototype.",
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
