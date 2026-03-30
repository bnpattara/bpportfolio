"use client";

import React, { useEffect } from "react";

const SCROLL_CLAMP_MS = 1800;

function snapWindowScroll(y: number) {
  const html = document.documentElement;
  const prev = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto";
  window.scrollTo(0, y);
  if (document.documentElement) document.documentElement.scrollTop = y;
  if (document.body) document.body.scrollTop = y;
  html.style.scrollBehavior = prev;
}

/** Embedded HTML case study asks us to undo browser scroll (nested iframes + focus). */
function useSnkrsProtoScrollLock() {
  useEffect(() => {
    let scrollClampY: number | null = null;
    let scrollClampUntil = 0;

    function onScrollClamp() {
      if (scrollClampY === null || performance.now() > scrollClampUntil) return;
      if (Math.abs(window.scrollY - scrollClampY) <= 0.5) return;
      snapWindowScroll(scrollClampY);
    }

    window.addEventListener("scroll", onScrollClamp, { capture: true, passive: true });

    function armClamp(y: number) {
      scrollClampY = y;
      scrollClampUntil = performance.now() + SCROLL_CLAMP_MS;
      onScrollClamp();
    }

    function onMsg(e: MessageEvent) {
      if (!e.data || e.data.type !== "snkrs-proto-lock") return;
      const y = e.data.y;
      if (typeof y !== "number" || Number.isNaN(y)) return;
      armClamp(y);
      const run = () => snapWindowScroll(y);
      run();
      requestAnimationFrame(run);
      requestAnimationFrame(() => requestAnimationFrame(run));
      [0, 16, 50, 100, 200, 350, 500, 650, 1000, 1300, 1600].forEach((ms) =>
        setTimeout(run, ms),
      );
    }
    window.addEventListener("message", onMsg);
    return () => {
      window.removeEventListener("scroll", onScrollClamp, { capture: true });
      window.removeEventListener("message", onMsg);
    };
  }, []);
}

export default function NikeCaseStudy(): React.ReactElement {
  useSnkrsProtoScrollLock();

  const caseStudySrc =
    process.env.NODE_ENV === "development"
      ? `/case-studies/nike2/index.html?__dev=${Date.now()}`
      : "/case-studies/nike2/index.html";

  return (
    <div style={{ width: "100%", height: "100dvh", background: "#fff" }}>
      <iframe
        className="responsive-iframe"
        src={caseStudySrc}
        title="Nike SNKRS — Confidence Hub"
        style={{ width: "100%", height: "100%", border: "none" }}
      />
    </div>
  );
}
