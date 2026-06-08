import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  async redirects() {
    return [
      // Redirect old FIRB article slug to new canonical slug
      {
        source: "/news/2024-fees-and-policy",
        destination: "/news/firb-fees-foreign-investment",
        permanent: true,
      },
      // Permanent redirect from old rate article URL to canonical URL
      {
        source: "/news/interest-rate-update",
        destination: "/news/australia-mortgage-rates",
        permanent: true,
      },
      // Redirect bare /:slug to /news/:slug, excluding known top-level routes
      {
        source:
          "/:slug((?!news|about|admin|api|calculators|contact|privacy|terms)[^/.]+)",
        destination: "/news/:slug",
        permanent: true,
      },
    ];
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
