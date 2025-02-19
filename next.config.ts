import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      { hostname: "placehold.co" },
      { hostname: "images.unsplash.com" },
      { hostname: "cyan-tropical-guanaco-792.mypinata.cloud" },
    ],
  },
};

export default nextConfig;
