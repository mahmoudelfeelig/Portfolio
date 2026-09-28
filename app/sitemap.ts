import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://elfeel.me",
      changeFrequency: "weekly",
      priority: 1,
    },
    { url: "https://academy.elfeel.me/" },
    { url: "https://anubis.elfeel.me/" },
    { url: "https://bachelor.elfeel.me/" },
    { url: "https://commit.elfeel.me/" },
    { url: "https://curate.elfeel.me/" },
    { url: "https://doompedia.elfeel.me/" },
    { url: "https://foundroll.elfeel.me/" },
    { url: "https://ocpp.elfeel.me/" },
    { url: "https://planora.elfeel.me/" },
    { url: "https://rps.elfeel.me/" },
    { url: "https://scenechain.elfeel.me/" },
    { url: "https://situationroom.elfeel.me/" },
    { url: "https://systemforge.elfeel.me/" },
    { url: "https://tariffguard.elfeel.me/" },
    { url: "https://typeshift.elfeel.me/" },
  ];
}
