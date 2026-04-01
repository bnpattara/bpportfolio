import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vault by Saks — Benn Pattara",
  description:
    "This URL redirects to the Vault by Saks case study.",
  openGraph: {
    title: "Vault by Saks — Benn Pattara",
    url: "/work/saks",
    type: "website",
    images: [{ url: "https://bennpattara.com/og/saks.jpg", width: 1200, height: 630 }],
  },
};

export default function SaksTestLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return <>{children}</>;
}
