import React from "react";

const CAROLYN_ARCHIVE_HTML_REV = "1";

export default function CarolynArchivePage(): React.ReactElement {
  const src =
    process.env.NODE_ENV === "development"
      ? "/case-studies/carolyn/archive/index.html"
      : `/case-studies/carolyn/archive/index.html?v=${CAROLYN_ARCHIVE_HTML_REV}`;
  return (
    <div style={{ width: "100%", height: "100dvh", background: "#fff" }}>
      <iframe
        src={src}
        title="The Carolyn · Case Study (previous version, archive)"
        className="responsive-iframe"
        style={{ width: "100%", height: "100%", border: "none" }}
      />
    </div>
  );
}
