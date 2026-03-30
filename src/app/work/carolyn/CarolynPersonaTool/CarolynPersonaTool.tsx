"use client";

import { useEffect, useRef } from "react";
import "./carolynPersonaTool.css";

export type CarolynPersonaToolProps = {
  initialMarkup: string;
};

export default function CarolynPersonaTool({
  initialMarkup,
}: CarolynPersonaToolProps): React.JSX.Element {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const sections = root.querySelectorAll<HTMLElement>(".section[id]");
    const navLinks = root.querySelectorAll<HTMLAnchorElement>(".sidenav a");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((link) => {
              link.classList.remove("active");
              if (link.getAttribute("href") === `#${entry.target.id}`) {
                link.classList.add("active");
              }
            });
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [initialMarkup]);

  return (
    <div
      ref={rootRef}
      className="carolynPtRoot"
      style={{
        flex: 1,
        minHeight: 0,
        width: "100%",
        overflow: "auto",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {/* eslint-disable-next-line react/no-danger -- static artifact markup from repo HTML */}
      <div dangerouslySetInnerHTML={{ __html: initialMarkup }} />
    </div>
  );
}
