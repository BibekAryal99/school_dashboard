import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // next.config.ts
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fakestoreapi.com",
        pathname: "/**",
      },
    ],
  },
};
export default nextConfig;
