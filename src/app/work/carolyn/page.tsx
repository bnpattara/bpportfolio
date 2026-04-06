import React from "react";
import type { Metadata } from "next";

/** Bump when `public/case-studies/carolyn/index.html` changes so cached iframe HTML refreshes in production. */
const CAROLYN_CASE_HTML_REV = "1";

export const metadata: Metadata = {
  title: "The Carolyn · Calvin Klein · Benn Pattara",
  description:
    "Hero bag strategy for Calvin Klein: Cameron persona, resale-informed pricing, product narrative, e-commerce presentation, and lifestyle context (from thesis through launch framing.",
  openGraph: {
    title: "The Carolyn · Calvin Klein · Benn Pattara",
    description:
      "Hero bag strategy for Calvin Klein: Cameron persona, resale-informed pricing, product narrative, e-commerce presentation, and lifestyle context) from thesis through launch framing.",
    url: "/work/carolyn",
    type: "website",
    images: [{ url: "https://bennpattara.com/og/carolyn.jpg", width: 1200, height: 630 }],
  },
};

export default function CarolynCaseStudy(): React.ReactElement {
  const src =
    process.env.NODE_ENV === "development"
      ? "/case-studies/carolyn/index.html"
      : `/case-studies/carolyn/index.html?v=${CAROLYN_CASE_HTML_REV}`;
  return (
    <div style={{ width: "100%", height: "100dvh", background: "#fff" }}>
      <iframe
        className="responsive-iframe"
        src={src}
        title="The Carolyn · Case Study"
        style={{ width: "100%", height: "100%", border: "none" }}
      />
    </div>
  );
}
