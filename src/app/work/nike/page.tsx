"use client";

import React from "react";

export default function NikeCaseStudy(): React.ReactElement {
  const caseStudySrc =
    process.env.NODE_ENV === "development"
      ? `/case-studies/nike2/index.html?__dev=${Date.now()}`
      : "/case-studies/nike2/index.html";

  return (<div style={{ width: "100%", height: "100dvh", background: "#fff" }}>
      <iframe
        className="responsive-iframe"
        src={caseStudySrc}
        title="Nike SNKRS · Confidence Hub"
        style={{ width: "100%", height: "100%", border: "none" }}
      />
    </div>);
}
