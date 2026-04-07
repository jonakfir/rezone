import { redirect } from "next/navigation";
import { getUserPlanWithAdminOverride } from "@/lib/auth/admin";
import AppLayoutClient from "@/components/AppLayoutClient";
import type { Profile } from "@/types/database";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const isConfigured = supabaseUrl && !supabaseUrl.includes("placeholder");

  let enrichedProfile: Profile;

  if (isConfigured) {
    try {
      const { createServerSupabaseClient } = await import("@/lib/supabase/server");
      const supabase = createServerSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        redirect("/auth/login");
      }

      let { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!profile) {
        profile = {
          id: user.id,
          email: user.email || "",
          stripe_customer_id: null,
          plan: "free",
          created_at: new Date().toISOString(),
        } as Profile;
      }

      const { plan, is_admin } = getUserPlanWithAdminOverride(profile as Profile);
      enrichedProfile = { ...profile, plan, is_admin };
    } catch {
      redirect("/auth/login");
    }
  } else {
    // Demo mode — no Supabase configured
    enrichedProfile = {
      id: "demo",
      email: "demo@rezone.app",
      stripe_customer_id: null,
      plan: "institutional",
      is_admin: true,
      created_at: new Date().toISOString(),
    };
  }

  return <AppLayoutClient profile={enrichedProfile}>{children}</AppLayoutClient>;
}
