import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getUserPlanWithAdminOverride } from "@/lib/auth/admin";
import AppLayoutClient from "@/components/AppLayoutClient";
import type { Profile } from "@/types/database";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Try to fetch profile, create a default if it doesn't exist
  let { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    // Profile doesn't exist yet — create a fallback object
    // (In production, a Supabase trigger would create this on signup)
    profile = {
      id: user.id,
      email: user.email || "",
      stripe_customer_id: null,
      plan: "free",
      created_at: new Date().toISOString(),
    } as Profile;
  }

  const { plan, is_admin } = getUserPlanWithAdminOverride(profile as Profile);

  const enrichedProfile: Profile = {
    ...profile,
    plan,
    is_admin,
  };

  return <AppLayoutClient profile={enrichedProfile}>{children}</AppLayoutClient>;
}
