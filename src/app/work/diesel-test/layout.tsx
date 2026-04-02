import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Diesel Iceberg · Benn Pattara",
  description: "Redirects to the primary Diesel Iceberg case study.",
  openGraph: {
    title: "Diesel Iceberg · Benn Pattara",
    url: "/work/diesel",
    type: "website",
    images: [{ url: "https://bennpattara.com/og/diesel.jpg", width: 1200, height: 630 }],
  },
};

export default function DieselTestLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return <>{children}</>;
}
