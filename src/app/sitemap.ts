import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://finc.net.au";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL,                               lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${SITE_URL}/about`,                    lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/contact`,                  lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/calculators`,              lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/calculators/stamp-duty`,   lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/calculators/repayment`,    lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/news`,                     lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
  ];

  const posts = getAllPosts();
  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/news/${post.slug}`,
    lastModified: post.lastModified || post.date
      ? new Date(post.lastModified || post.date)
      : new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...postRoutes];
}
