import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep ESLint for local dev, but don't fail production builds.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
