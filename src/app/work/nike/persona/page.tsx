import React from "react";
import type { Metadata } from "next";
import NikePersonaTool from "../PersonaTool/NikePersonaTool";

export const metadata: Metadata = {
  title: "Nike SNKRS, Persona research lab · Benn Pattara",
  description:
    "Interactive scripted personas for SNKRS Confidence Hub research: probe archetypes individually or compare in focus mode.",
};

export default function NikePersonaLabPage(): React.ReactElement {
  return (<div
      style={{
        minHeight: "100dvh",
        height: "100dvh",
        background: "#0a0a0a",
        padding: 0,
        margin: 0,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
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
        <NikePersonaTool />
      </div>
    </div>);
}
