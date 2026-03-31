"use client";

import React, { useState } from "react";

export default function SaksProseTestPage(): React.ReactElement {
  const [src] = useState(() =>
    process.env.NODE_ENV === "development"
      ? `/case-studies/saks-test/index.html?__dev=${Date.now()}`
      : "/case-studies/saks-test/index.html",
  );
  return (
    <div style={{ width: "100%", height: "100dvh", background: "#fff" }}>
      <iframe
        className="responsive-iframe"
        src={src}
        title="Vault by Saks — Prose test (draft)"
        style={{ width: "100%", height: "100%", border: "none" }}
      />
    </div>
  );
}
