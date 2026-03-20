import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Diesel Iceberg — Benn Pattara",
  description: "10% product. 90% soul. A Harajuku experiential retail concept built around a phone-free floors provocation.",
  openGraph: {
    title: "Diesel Iceberg — Benn Pattara",
    description: "10% product. 90% soul. A Harajuku experiential retail concept built around a phone-free floors provocation.",
    url: "/work/diesel",
    type: "website",
    images: [{ url: "https://bennpattara.com/og/diesel.jpg", width: 1200, height: 630 }],
  },
};

export default function DieselCaseStudy() {
  return (
    <div style={{ width: "100%", height: "100dvh", background: "#fff" }}>
      <iframe
        src="/case-studies/diesel/index.html"
        title="Diesel Tokyo — Gravitational Pull"
        style={{ width: "100%", height: "100%", border: "none" }}
      />
    </div>
  );
}
