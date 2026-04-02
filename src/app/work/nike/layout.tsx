import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Nike SNKRS · Confidence Hub · Benn Pattara",
  description:
    "SNKRS, reframed around confidence: wardrobe intelligence, outfit context, closet gaps, and participation-gated drops that restore repeat purchase.",
  openGraph: {
    title: "Nike SNKRS · Confidence Hub · Benn Pattara",
    description:
      "When access isn’t the barrier, utility is the strategy: styling infrastructure that earns loyalty compounding beyond the lottery.",
    url: "/work/nike",
    type: "website",
    images: [{ url: "https://bennpattara.com/og/nike2.jpg", width: 1200, height: 630 }],
  },
};

export default function NikeWorkLayout({ children }: { children: ReactNode }) {
  return children;
}
