import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nike SNKRS · Alternate narrative draft · Benn Pattara",
  description:
    "Draft case study page: SNKRS narrative structured as executive summary through business benefits, with segmentation, personas, persona lab, PRD, and prototype, for comparison with the primary Confidence Hub story.",
  openGraph: {
    title: "Nike SNKRS, Alternate narrative (draft) · Benn Pattara",
    description:
      "Draft SNKRS case study narrative: Gen Z ask, Museum Mindset, Confidence Hub concept, shared prototype and persona lab.",
    url: "/work/nike-test",
    type: "website",
    images: [{ url: "https://bennpattara.com/og/nike2.jpg", width: 1200, height: 630 }],
  },
};

export default function NikeTestLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return <>{children}</>;
}
