import { profile, type Profile } from "@/data/profile";

export function mergeProfile(value: unknown): Profile {
  if (!value || typeof value !== "object" || Array.isArray(value)) return profile;
  const saved = value as Partial<Profile>;

  return {
    ...profile,
    ...saved,
    stats: Array.isArray(saved.stats) ? saved.stats : profile.stats,
    skills: { ...profile.skills, ...(saved.skills ?? {}) },
    projects: Array.isArray(saved.projects) ? saved.projects : profile.projects,
    experience: Array.isArray(saved.experience) ? saved.experience : profile.experience,
    socials: { ...profile.socials, ...(saved.socials ?? {}) },
    theme: saved.theme === "red" ? "red" : "green",
  };
}
