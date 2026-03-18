import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "a.nooncdn.com" },
      { protocol: "https", hostname: "cdn.britannica.com" },
    ],
  },
};

export default nextConfig;
