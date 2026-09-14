import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/profile";

const base = siteConfig.baseUrl;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${base}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
