import type { NextConfig } from "next";

// Static export for hosting on Amazon S3 (no Node.js server).
// `npm run build` writes the finished website to the `out` folder.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
