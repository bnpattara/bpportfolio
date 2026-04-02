"use client";

import React, { useState } from "react";

export default function OnProseTestPage(): React.ReactElement {
  const [src] = useState(() =>
    process.env.NODE_ENV === "development"
      ? `/case-studies/on-test/index.html?__dev=${Date.now()}`
      : "/case-studies/on-test/index.html",);
  return (<div style={{ width: "100%", height: "100dvh", background: "#fff" }}>
      <iframe
        className="responsive-iframe"
        src={src}
        title="On APEX · community case study"
        style={{ width: "100%", height: "100%", border: "none" }}
      />
    </div>);
}
