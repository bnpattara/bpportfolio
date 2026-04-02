import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vault by Saks (Saks3) · Benn Pattara",
  description:
    "Alternate Vault narrative: curation authority from the balance sheet up. Flex nodes, membership access architecture, designer intelligence, financial stress test.",
  openGraph: {
    title: "Vault by Saks (Saks3) · Benn Pattara",
    description:
      "Alternate Vault narrative: curation authority from the balance sheet up. Flex nodes, membership access architecture, designer intelligence, financial stress test.",
    url: "/work/saks3",
    type: "website",
    images: [{ url: "https://bennpattara.com/og/saks.jpg", width: 1200, height: 630 }],
  },
};

export default function Saks3CaseStudy(): React.ReactElement {
  const caseStudySrc =
    process.env.NODE_ENV === "development"
      ? `/case-studies/saks3/index.html?__dev=${Date.now()}`
      : "/case-studies/saks3/index.html";

  return (<div style={{ width: "100%", height: "100dvh", background: "#fff" }}>
      <iframe
        className="responsive-iframe"
        src={caseStudySrc}
        title="Vault by Saks, Saks3 alternate narrative"
        style={{ width: "100%", height: "100%", border: "none" }}
      />
    </div>);
}
