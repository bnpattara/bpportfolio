"use client";

import { useState } from "react";

function withDevCacheBust(htmlPath: string): string {
  if (process.env.NODE_ENV !== "development") return htmlPath;
  const joiner = htmlPath.includes("?") ? "&" : "?";
  return `${htmlPath}${joiner}__dev=${Date.now()}`;
}

/** HTML case studies in `public/`; in dev each navigation gets a fresh `__dev` query so the iframe does not reuse a cached document. */
export default function CaseStudyHtmlIframe({
  htmlPath,
  title,
}: {
  htmlPath: string;
  title: string;
}) {
  const [src] = useState(() => withDevCacheBust(htmlPath));

  return (<iframe
      key={src}
      src={src}
      title={title}
      className="responsive-iframe"
      style={{ width: "100%", height: "100%", border: "none" }}
    />);
}
