import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nike SNKRS Confidence Hub — Benn Pattara",
  description: "From lottery machine to styling platform. Rebuilding trust in a drop system designed to create desire but creating abandonment instead.",
  openGraph: {
    title: "Nike SNKRS Confidence Hub — Benn Pattara",
    description: "From lottery machine to styling platform. Rebuilding trust in a drop system designed to create desire but creating abandonment instead.",
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

  return (
    <div style={{ width: "100%", height: "100dvh", background: "#fff" }}>
      <iframe className="responsive-iframe"
        src={caseStudySrc}
        title="Nike SNKRS — Confidence Hub"
        style={{ width: "100%", height: "100%", border: "none" }}
      />
    </div>
  );
}
