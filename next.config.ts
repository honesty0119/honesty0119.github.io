import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // GitHub Pages can serve only pre-built static files.
  output: "export",
  trailingSlash: true,
};

export default nextConfig;