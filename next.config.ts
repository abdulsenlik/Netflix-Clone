import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  eslint: {
    ignoreDuringBuilds: true, // ✅ Ignore ESLint errors during builds
  },

  typescript: {
    ignoreBuildErrors: true, // ✅ Ignore TypeScript errors during builds
  },
};

export default nextConfig;