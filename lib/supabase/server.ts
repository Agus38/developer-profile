import "server-only";
import { createClient } from "@supabase/supabase-js";
import { supabaseAnonKey, supabaseUrl, isSupabaseConfigured } from "@/lib/supabase/config";
import { profile, type Profile } from "@/data/profile";
import { mergeProfile } from "@/lib/profile";

export async function getPublicProfile(): Promise<Profile> {
  if (!isSupabaseConfigured) return profile;

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }) },
    });
    const { data, error } = await supabase.from("site_profile").select("content").eq("id", 1).maybeSingle();
    if (error || !data?.content) return profile;
    return mergeProfile(data.content);
  } catch {
    // Keep the public portfolio available if Supabase is temporarily unreachable.
    return profile;
  }
}
