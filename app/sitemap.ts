import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://elfeel.me",
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
