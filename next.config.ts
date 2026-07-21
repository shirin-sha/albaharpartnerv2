import type { NextConfig } from "next";

const isWindows = process.platform === "win32";
const isVercel = !!process.env.VERCEL;

const nextConfig: NextConfig = {
  // Workaround for Windows EPERM lock on `.next/trace`:
  // Use a separate dist dir locally on Windows only.
  // Keep Vercel/default builds using `.next` (required by Vercel build outputs).
  ...(isWindows && !isVercel ? { distDir: ".next-build" } : {}),
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;
