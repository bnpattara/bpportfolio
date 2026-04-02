"use client";

import dynamic from "next/dynamic";
import { OnApexErrorBoundary } from "./OnApexErrorBoundary";

const OnApexApp = dynamic(() => import("./OnApexApp"), { ssr: false });

export default function OnApexAppPage() {
  return (<OnApexErrorBoundary>
      <div style={{ width: "100%", background: "#0C0C0C" }}>
        <OnApexApp />
      </div>
    </OnApexErrorBoundary>);
}
