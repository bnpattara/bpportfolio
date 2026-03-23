import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vault by Saks — Benn Pattara",
  description: "Luxury is no longer about access to goods. It's about access to curation. A speculative strategic brief responding to Saks Global's Chapter 11.",
  openGraph: {
    title: "Vault by Saks — Benn Pattara",
    description: "Luxury is no longer about access to goods. It's about access to curation. A speculative strategic brief responding to Saks Global's Chapter 11.",
    url: "/work/saks",
    type: "website",
    images: [{ url: "https://bennpattara.com/og/saks.jpg", width: 1200, height: 630 }],
  },
};

export default function SaksCaseStudy(): React.ReactElement {
  return (
    <div style={{ width: "100%", height: "100dvh", background: "#fff" }}>
      <iframe className="responsive-iframe"
        src="/case-studies/saks/index.html"
        title="Vault by Saks — Case Study"
        style={{ width: "100%", height: "100%", border: "none" }}
      />
    </div>
  );
}
