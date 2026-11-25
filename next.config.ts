import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
    agentUpgrade: "security",
  },
  cacheComponents: true,
  partialPrefetching: true,
  // no separate Services or FAQ pages: the services live on Moonstone*d, the FAQ on Contact
  async redirects() {
    return [
      { source: "/services", destination: "/moonstoned#services", permanent: false },
      { source: "/faq", destination: "/contact#faq", permanent: false },
    ];
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
