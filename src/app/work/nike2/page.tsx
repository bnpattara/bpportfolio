import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nike SNKRS · Confidence Hub · Benn Pattara",
  description:
    "SNKRS, reframed around confidence: wardrobe intelligence, outfit context, closet gaps, and participation-gated drops that restore repeat purchase.",
  openGraph: {
    title: "Nike SNKRS · Confidence Hub · Benn Pattara",
    description:
      "When access isn’t the barrier, utility is the strategy: styling infrastructure that earns loyalty compounding beyond the lottery.",
    url: "/work/nike2",
    type: "website",
    images: [{ url: "https://bennpattara.com/og/nike.jpg", width: 1200, height: 630 }],
  },
};

export default function Nike2CaseStudy(): React.ReactElement {
  // Earlier SNKRS narrative (archived route); static files remain under case-studies/nike/.
  const caseStudySrc =
    process.env.NODE_ENV === "development"
      ? `/case-studies/nike/index.html?__dev=${Date.now()}`
      : "/case-studies/nike/index.html";

  return (<div style={{ width: "100%", height: "100dvh", background: "#fff" }}>
      <iframe className="responsive-iframe"
        src={caseStudySrc}
        title="Nike SNKRS · Confidence Hub"
        style={{ width: "100%", height: "100%", border: "none" }}
      />
    </div>);
}
