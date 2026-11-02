import { Portfolio } from "@/components/Portfolio";
import { getPublicProfile } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function Home() {
  const profile = await getPublicProfile();
  return <Portfolio profile={profile} />;
}
