import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [
      // Google Drive thumbs & full
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "drive.google.com" },

      // Google Calendar images (if you render any)
      { protocol: "https", hostname: "calendar.google.com" },
    ],
    // OR simpler (either/or):
    // domains: ["lh3.googleusercontent.com", "drive.google.com", "calendar.google.com"],
  },
};

export default nextConfig;
