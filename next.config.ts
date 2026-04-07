import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // basePath is set via PAGES_BASE_PATH env var in CI (e.g. /werkwoordlab for GitHub Pages).
  // Empty string in local dev so routes resolve without a prefix.
  basePath: process.env.PAGES_BASE_PATH ?? "",
  trailingSlash: true,
  images: {
    // Next.js image optimisation is not available in static exports.
    unoptimized: true,
  },
};

export default nextConfig;
