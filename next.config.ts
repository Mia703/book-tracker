import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "books.google.com",
        pathname: "/books/content**",
      },
      {
        protocol: "http",
        hostname: "books.google.com",
        pathname: "/books/publisher/content**",
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
        pathname: "/images/I/*",
      },
    ],
  },
};

export default nextConfig;
