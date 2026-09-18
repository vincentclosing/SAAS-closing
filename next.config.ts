import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack's persistent build cache writes raw analysis data (including
  // literal env var values it touches during the build) to disk under
  // .next/cache/turbopack. On Netlify that cache is scanned for secrets and
  // trips false positives. Keep it off for production builds.
  experimental: {
    turbopackFileSystemCacheForBuild: false,
  },
};

export default nextConfig;
