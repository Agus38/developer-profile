import type { MetadataRoute } from "next";
import { profile } from "@/data/profile";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://example.com"; // TODO: ganti dengan domain Anda
  return [
    { url: base, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    ...profile.projects.map(({ slug }) => ({ url: `${base}/projects/${slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
