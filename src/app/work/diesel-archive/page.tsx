import React from "react";

const DIESEL_ARCHIVE_HTML_REV = "1";

export default function DieselArchivePage(): React.ReactElement {
  const src =
    process.env.NODE_ENV === "development"
      ? "/case-studies/diesel/archive/interactive-spatial.html"
      : `/case-studies/diesel/archive/interactive-spatial.html?v=${DIESEL_ARCHIVE_HTML_REV}`;
  return (
    <div style={{ width: "100%", height: "100dvh", background: "#fff" }}>
      <iframe
        src={src}
        title="Diesel Iceberg · Interactive spatial (archive)"
        className="responsive-iframe"
        style={{ width: "100%", height: "100%", border: "none" }}
      />
    </div>
  );
}
