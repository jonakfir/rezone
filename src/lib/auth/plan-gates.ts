import type { Profile } from "@/types/database";

const PLAN_RANK: Record<Profile["plan"], number> = {
  free: 0,
  pro: 1,
  institutional: 2,
};

export const FEATURE_GATES = {
  ai_summaries: { requiredPlan: "pro" as const, label: "AI Analysis", description: "AI-powered rezoning opportunity summaries for each parcel" },
  permit_timeline: { requiredPlan: "pro" as const, label: "Permit Timeline", description: "Full permit history timeline for each parcel" },
  sales_comps: { requiredPlan: "pro" as const, label: "Sales Comps", description: "Nearby sales comparisons and pricing data" },
  daily_alerts: { requiredPlan: "pro" as const, label: "Daily Alerts", description: "Daily email alerts for new opportunities" },
  multi_county: { requiredPlan: "pro" as const, label: "Multiple Counties", description: "Monitor up to 5 counties simultaneously" },
  realtime_alerts: { requiredPlan: "institutional" as const, label: "Real-time Alerts", description: "Instant notifications for new opportunities" },
  bulk_export: { requiredPlan: "institutional" as const, label: "Bulk Export", description: "Export parcel data in bulk" },
  api_access: { requiredPlan: "institutional" as const, label: "API Access", description: "Programmatic access to parcel data" },
  custom_scoring: { requiredPlan: "institutional" as const, label: "Custom Scoring", description: "Custom scoring models for your criteria" },
  unlimited_counties: { requiredPlan: "institutional" as const, label: "Unlimited Counties", description: "Monitor unlimited counties" },
} as const;

export type Feature = keyof typeof FEATURE_GATES;

export function canAccessFeature(userPlan: Profile["plan"], feature: Feature): boolean {
  const gate = FEATURE_GATES[feature];
  return PLAN_RANK[userPlan] >= PLAN_RANK[gate.requiredPlan];
}

export function getMaxCounties(plan: Profile["plan"]): number {
  switch (plan) {
    case "free": return 1;
    case "pro": return 5;
    case "institutional": return Infinity;
  }
}

export function getMaxAlerts(plan: Profile["plan"]): number {
  switch (plan) {
    case "free": return 1;
    case "pro": return 5;
    case "institutional": return Infinity;
  }
}

export function getAllowedFrequencies(plan: Profile["plan"]): string[] {
  switch (plan) {
    case "free": return ["weekly"];
    case "pro": return ["weekly", "daily"];
    case "institutional": return ["weekly", "daily", "realtime"];
  }
}
