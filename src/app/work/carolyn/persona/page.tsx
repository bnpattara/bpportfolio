import fs from "node:fs";
import path from "node:path";
import React from "react";
import type { Metadata } from "next";
import CarolynPersonaTool from "../CarolynPersonaTool/CarolynPersonaTool";

export const metadata: Metadata = {
  title: "Cameron — Persona profile — The Carolyn — Benn Pattara",
  description:
    "Primary consumer persona for The Carolyn: Cameron, the deliberate investor — identity, psychographics, tensions, competitive set, construction standards, pricing psychology, and strategic implications.",
  openGraph: {
    title: "Cameron — Persona profile — The Carolyn — Benn Pattara",
    description:
      "Primary consumer persona for The Carolyn: identity through strategic implications for product, price, channel, and communication.",
    url: "/work/carolyn/persona",
    type: "website",
  },
};

function extractPageWrap(html: string): string {
  const token = '<div class="page-wrap">';
  const start = html.indexOf(token);
  if (start === -1) {
    throw new Error("Carolyn persona HTML: page-wrap not found");
  }
  let pos = start + token.length;
  let depth = 1;
  while (depth > 0 && pos < html.length) {
    const divOpen = html.indexOf("<div", pos);
    const divClose = html.indexOf("</div>", pos);
    if (divClose === -1) {
      throw new Error("Carolyn persona HTML: unclosed div");
    }
    if (divOpen !== -1 && divOpen < divClose) {
      depth += 1;
      pos = divOpen + 4;
    } else {
      depth -= 1;
      pos = divClose + 6;
    }
  }
  return html.slice(start, pos);
}

export default function CarolynPersonaPage(): React.ReactElement {
  const fullPath = path.join(
    process.cwd(),
    "public/case-studies/carolyn/cameron-persona.html",
  );
  const html = fs.readFileSync(fullPath, "utf-8");
  const markup = extractPageWrap(html);

  return (
    <div
      style={{
        width: "100%",
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "#fff",
      }}
    >
      <div
        style={{
          flex: 1,
          minHeight: 0,
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CarolynPersonaTool initialMarkup={markup} />
      </div>
    </div>
  );
}
