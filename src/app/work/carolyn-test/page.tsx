"use client";

import React, { useState } from "react";

export default function CarolynArchiveCaseStudyPage(): React.ReactElement {
  const [src] = useState(() =>
    process.env.NODE_ENV === "development"
      ? `/case-studies/carolyn/archive/index.html?__dev=${Date.now()}`
      : "/case-studies/carolyn/archive/index.html",);
  return (<div style={{ width: "100%", height: "100dvh", background: "#fff" }}>
      <iframe
        className="responsive-iframe"
        src={src}
        title="The Carolyn · Case Study (previous version, archive)"
        style={{ width: "100%", height: "100%", border: "none" }}
      />
    </div>);
}
