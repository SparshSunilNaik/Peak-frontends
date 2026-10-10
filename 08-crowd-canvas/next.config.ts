import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // The CrowdCanvas component starts an image load inside its effect, but its cleanup does not cancel that load, so under React Strict Mode in dev (which mounts effects twice) the first mount's image still fires onload after cleanup and starts a second, never-cleaned-up crowd.
  reactStrictMode: false,
  cacheComponents: true,
  partialPrefetching: true,
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
