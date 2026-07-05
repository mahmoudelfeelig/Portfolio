import type { MetadataRoute } from "next";
import { projects } from "../data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://elfeel.me",
      changeFrequency: "weekly",
      priority: 1,
    },
    ...projects.map((project) => ({
      url: `https://elfeel.me/projects/${project.id}`,
      changeFrequency: "monthly" as const,
      priority: project.featured ? 0.9 : 0.7,
    })),
  ];
}
