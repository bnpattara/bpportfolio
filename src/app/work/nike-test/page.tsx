"use client";

import React, { useEffect } from "react";

function restoreWindowScroll(y: number) {
  const html = document.documentElement;
  const prev = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto";
  window.scrollTo(0, y);
  if (document.documentElement) document.documentElement.scrollTop = y;
  if (document.body) document.body.scrollTop = y;
  html.style.scrollBehavior = prev;
}

function useSnkrsProtoScrollLock() {
  useEffect(() => {
    function onMsg(e: MessageEvent) {
      if (!e.data || e.data.type !== "snkrs-proto-lock") return;
      const y = e.data.y;
      if (typeof y !== "number" || Number.isNaN(y)) return;
      const run = () => restoreWindowScroll(y);
      run();
      requestAnimationFrame(run);
      requestAnimationFrame(() => requestAnimationFrame(run));
      [0, 16, 50, 100, 200, 350].forEach((ms) => setTimeout(run, ms));
    }
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);
}

export default function NikeTestCaseStudyPage(): React.ReactElement {
  useSnkrsProtoScrollLock();

  const caseStudySrc =
    process.env.NODE_ENV === "development"
      ? `/case-studies/nike-test/index.html?__dev=${Date.now()}`
      : "/case-studies/nike-test/index.html";

  return (<div style={{ width: "100%", height: "100dvh", background: "#fff" }}>
      <iframe
        className="responsive-iframe"
        src={caseStudySrc}
        title="Nike SNKRS, Alternate narrative (draft)"
        style={{ width: "100%", height: "100%", border: "none" }}
      />
    </div>);
}
