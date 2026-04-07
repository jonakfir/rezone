import type { Profile } from "@/types/database";

export function isAdminEmail(email: string): boolean {
  const adminEmails = process.env.ADMIN_EMAILS;
  if (!adminEmails) return false;
  const emails = adminEmails.split(",").map((e) => e.trim().toLowerCase());
  return emails.includes(email.toLowerCase());
}

export function getUserPlanWithAdminOverride(profile: Profile): {
  plan: Profile["plan"];
  is_admin: boolean;
} {
  if (isAdminEmail(profile.email)) {
    return { plan: "institutional", is_admin: true };
  }
  return { plan: profile.plan, is_admin: false };
}
