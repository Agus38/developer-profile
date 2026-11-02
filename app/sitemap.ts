import type { MetadataRoute } from "next";
import { getPublicProfile } from "@/lib/supabase/server";

export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const profile = await getPublicProfile();
  const base = "https://example.com"; // TODO: ganti dengan domain Anda
  return [
    { url: base, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    ...profile.projects.map(({ slug }) => ({ url: `${base}/projects/${slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
