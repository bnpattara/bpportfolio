import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stylect — Benn Pattara",
  description: "The value isn't in the inventory. It's in the rejection of everything wrong. A personal styling platform with a molecular design system.",
  openGraph: {
    title: "Stylect — Benn Pattara",
    description: "The value isn't in the inventory. It's in the rejection of everything wrong. A personal styling platform with a molecular design system.",
    url: "/work/stylect",
    type: "website",
    images: [{ url: "https://bennpattara.com/og/stylect.jpg", width: 1200, height: 630 }],
  },
};

export default function StylectCaseStudy() {
  return (
    <div style={{ width: "100%", height: "100dvh", background: "#fff" }}>
      <iframe
        src="/case-studies/stylect/index.html"
        title="Stylect: Designing the Bridge Between Discovery and the Fitting Room"
        style={{ width: "100%", height: "100%", border: "none" }}
      />
    </div>
  );
}
