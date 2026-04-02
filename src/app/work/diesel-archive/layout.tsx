import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Diesel Iceberg · Interactive spatial (archive) · Benn Pattara",
  description:
    "Archived interactive floor-switcher presentation for the Diesel Iceberg Harajuku flagship concept.",
  robots: { index: false, follow: true },
  openGraph: {
    title: "Diesel Iceberg · Interactive spatial (archive)",
    description:
      "Archived interactive floor-switcher presentation for the Diesel Iceberg Harajuku flagship concept.",
    url: "/work/diesel-archive",
    type: "website",
    images: [{ url: "https://bennpattara.com/og/diesel.jpg", width: 1200, height: 630 }],
  },
};

export default function DieselArchiveLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return <>{children}</>;
}
