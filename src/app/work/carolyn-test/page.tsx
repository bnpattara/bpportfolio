"use client";

import React, { useState } from "react";

export default function CarolynProseTestPage(): React.ReactElement {
  const [src] = useState(() =>
    process.env.NODE_ENV === "development"
      ? `/case-studies/carolyn-test/index.html?__dev=${Date.now()}`
      : "/case-studies/carolyn-test/index.html",
  );
  return (
    <div style={{ width: "100%", height: "100dvh", background: "#fff" }}>
      <iframe
        className="responsive-iframe"
        src={src}
        title="The Carolyn — Prose test (draft)"
        style={{ width: "100%", height: "100%", border: "none" }}
      />
    </div>
  );
}
