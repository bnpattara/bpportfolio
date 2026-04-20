import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

// Avoid Turbopack picking a parent folder when multiple lockfiles exist (e.g. ~/package-lock.json).
const turbopackRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: turbopackRoot,
  },
};

export default nextConfig;
