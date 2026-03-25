import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Carolyn — Calvin Klein — Benn Pattara",
  description: "Hero bag strategy for Calvin Klein: discreet excellence, constitutive muse, PRD constraints, GTM discipline, and sensitivity framework — from market thesis through launch KPIs.",
  openGraph: {
    title: "The Carolyn — Calvin Klein — Benn Pattara",
    description: "Hero bag strategy for Calvin Klein: discreet excellence, constitutive muse, PRD constraints, GTM discipline, and sensitivity framework — from market thesis through launch KPIs.",
    url: "/work/carolyn",
    type: "website",
    images: [{ url: "https://bennpattara.com/og/carolyn.jpg", width: 1200, height: 630 }],
  },
};

export default function CarolynCaseStudy(): React.ReactElement {
  return (
    <div style={{ width: "100%", height: "100dvh", background: "#fff" }}>
      <iframe className="responsive-iframe"
        src="/case-studies/carolyn/index.html"
        title="The Carolyn — Case Study"
        style={{ width: "100%", height: "100%", border: "none" }}
      />
    </div>
  );
}
