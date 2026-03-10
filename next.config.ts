import type { NextConfig } from "next";
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "drive.google.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  // ... keep any existing config you have
};

// export default nextConfig;
// const nextConfig: NextConfig = {
//   /* config options here */
//   images: {
//     domains: ['drive.google.com'],
//   },
// };

export default nextConfig;
