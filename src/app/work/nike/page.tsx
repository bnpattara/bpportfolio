import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nike SNKRS Museum Mindset — Benn Pattara",
  description: "Fixing the Nike SNKRS Museum Mindset. Recovering LTV through styling confidence and activation.",
  openGraph: {
    title: "Nike SNKRS Museum Mindset — Benn Pattara",
    description: "Fixing the Nike SNKRS Museum Mindset. Recovering LTV through styling confidence and activation.",
    url: "/work/nike",
    type: "website",
    images: [{ url: "https://bennpattara.com/og/nike2.jpg", width: 1200, height: 630 }],
  },
};

export default function NikeCaseStudy(): React.ReactElement {
  // Primary site route: latest SNKRS narrative lives under case-studies/nike2/.
  const caseStudySrc =
    process.env.NODE_ENV === "development"
      ? `/case-studies/nike2/index.html?__dev=${Date.now()}`
      : "/case-studies/nike2/index.html";

  return (
    <div style={{ width: "100%", height: "100dvh", background: "#fff" }}>
      <iframe className="responsive-iframe"
        src={caseStudySrc}
        title="Nike SNKRS — Museum Mindset"
        style={{ width: "100%", height: "100%", border: "none" }}
      />
    </div>
  );
}
