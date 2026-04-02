import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "On Apex · Case Study · Benn Pattara",
  description:
    "On Apex: software to the standard of the shoe (cultural moment, reframe, molecular system, PWA distribution, native thresholds.",
  openGraph: {
    title: "On Apex · Case Study · Benn Pattara",
    description:
      "On Apex: software to the standard of the shoe) cultural moment, reframe, molecular system, PWA distribution, native thresholds.",
    url: "/work/on2",
    type: "website",
    images: [{ url: "https://bennpattara.com/og/on.jpg", width: 1200, height: 630 }],
  },
};

export default function OnApex2CaseStudy(): React.ReactElement {
  const caseStudySrc =
    process.env.NODE_ENV === "development"
      ? `/case-studies/on2/index.html?__dev=${Date.now()}`
      : "/case-studies/on2/index.html";

  return (<div style={{ width: "100%", height: "100dvh", background: "#fff" }}>
      <iframe
        className="responsive-iframe"
        src={caseStudySrc}
        title="On Apex · Case Study"
        style={{ width: "100%", height: "100%", border: "none" }}
      />
    </div>);
}
