import type { MetadataRoute } from "next";
import { profile, siteConfig } from "@/data/profile";

const base = siteConfig.baseUrl;

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${base}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];

  profile.projects.forEach((project) => {
    routes.push({
      url: project.liveUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: "yearly",
      priority: 0.3,
    });
  });

  return routes;
}
