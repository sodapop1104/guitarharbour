import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com", pathname: "/d/**" },
      { protocol: "https", hostname: "drive.google.com", pathname: "/uc" }
    ],
    dangerouslyAllowSVG: true
  }
};

export default nextConfig;