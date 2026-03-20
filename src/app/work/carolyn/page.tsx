import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Carolyn — Calvin Klein — Benn Pattara",
  description: "Thirty years of cultural capital and no named object to carry it. A hero bag product strategy for Calvin Klein.",
  openGraph: {
    title: "The Carolyn — Calvin Klein — Benn Pattara",
    description: "Thirty years of cultural capital and no named object to carry it. A hero bag product strategy for Calvin Klein.",
    url: "/work/carolyn",
    type: "website",
    images: [{ url: "https://bennpattara.com/og/carolyn.jpg", width: 1200, height: 630 }],
  },
};

export default function CarolynCaseStudy() {
  return (
    <div style={{ width: "100%", height: "100dvh", background: "#fff" }}>
      <iframe
        src="/case-studies/carolyn/index.html"
        title="The Carolyn — Case Study"
        style={{ width: "100%", height: "100%", border: "none" }}
      />
    </div>
  );
}
