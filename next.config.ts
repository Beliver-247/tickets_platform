import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    agentUpgrade: "security"
  },
  images: {
    remotePatterns: []
  }
};

export default nextConfig;
