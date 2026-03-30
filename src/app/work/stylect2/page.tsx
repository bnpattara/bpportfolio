import React from "react";
import type { Metadata } from "next";
import CaseStudyHtmlIframe from "@/components/CaseStudyHtmlIframe";

export const metadata: Metadata = {
  title: "Stylect (earlier version) — Benn Pattara",
  description:
    "The value isn't in the inventory. It's in the rejection of everything wrong. A personal styling platform with a molecular design system.",
  openGraph: {
    title: "Stylect (earlier version) — Benn Pattara",
    description:
      "The value isn't in the inventory. It's in the rejection of everything wrong. A personal styling platform with a molecular design system.",
    url: "/work/stylect2",
    type: "website",
    images: [{ url: "https://bennpattara.com/og/stylect.jpg", width: 1200, height: 630 }],
  },
};

export default function Stylect2CaseStudy() {
  return (
    <div style={{ width: "100%", height: "100dvh", background: "#fff" }}>
      <CaseStudyHtmlIframe
        htmlPath="/case-studies/stylect2/index.html"
        title="Stylect — Product &amp; UX Design Case Study (Narrative)"
      />
    </div>
  );
}
