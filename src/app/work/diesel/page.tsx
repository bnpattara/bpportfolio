import React from "react";
import type { Metadata } from "next";

/** Bump when `public/case-studies/diesel/index.html` changes so cached iframe HTML refreshes in production. */
const DIESEL_CASE_HTML_REV = "1";

export const metadata: Metadata = {
  title: "Diesel Iceberg · Benn Pattara",
  description:
    "10% product. 90% soul. A Harajuku experiential retail concept built around a phone-free floors provocation.",
  openGraph: {
    title: "Diesel Iceberg · Benn Pattara",
    description:
      "10% product. 90% soul. A Harajuku experiential retail concept built around a phone-free floors provocation.",
    url: "/work/diesel",
    type: "website",
    images: [{ url: "https://bennpattara.com/og/diesel.jpg", width: 1200, height: 630 }],
  },
};

export default function DieselCaseStudy(): React.ReactElement {
  const src =
    process.env.NODE_ENV === "development"
      ? "/case-studies/diesel/index.html"
      : `/case-studies/diesel/index.html?v=${DIESEL_CASE_HTML_REV}`;
  return (
    <div style={{ width: "100%", height: "100dvh", background: "#fff" }}>
      <iframe
        src={src}
        title="Diesel Iceberg · Case Study"
        className="responsive-iframe"
        style={{ width: "100%", height: "100%", border: "none" }}
      />
    </div>
  );
}
