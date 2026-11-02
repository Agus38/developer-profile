import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { getPublicProfile } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const profile = await getPublicProfile();
  return <AdminDashboard initialProfile={profile} />;
}
