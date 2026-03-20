import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "On APEX — Benn Pattara",
  description: "The brand that owns the community owns the repeat purchase cycle for the lifetime of the runner.",
  openGraph: {
    title: "On APEX — Benn Pattara",
    description: "The brand that owns the community owns the repeat purchase cycle for the lifetime of the runner.",
    url: "/work/on",
    type: "website",
    images: [{ url: "https://bennpattara.com/og/on.jpg", width: 1200, height: 630 }],
  },
};

export default function OnApexCaseStudy() {
  return (
    <div style={{ width: "100%", height: "100dvh", background: "#fff" }}>
      <iframe
        src="/case-studies/on/index.html"
        title="On Apex — Community Platform"
        style={{ width: "100%", height: "100%", border: "none" }}
      />
    </div>
  );
}
