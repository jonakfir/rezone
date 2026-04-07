import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getUserPlanWithAdminOverride } from "@/lib/auth/admin";
import { getMaxCounties } from "@/lib/auth/plan-gates";
import type { Profile } from "@/types/database";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface RealieParcel {
  apn: string;
  address: string;
  owner: string;
  acres: number;
  zoning: string;
  zoning_type: string;
  assessed_value: number;
  geometry: GeoJSON.Polygon;
  permits: Array<{
    date: string;
    type: string;
    description: string;
    status: string;
  }>;
}

function scoreParcel(parcel: RealieParcel, nearbyParcels: RealieParcel[]): number {
  let score = 0;

  // Proximity to commercial zones
  const nearbyCommercial = nearbyParcels.filter(
    (p) => p.zoning_type === "Commercial" || p.zoning_type === "Mixed-Use"
  );
  if (nearbyCommercial.length > 0) score += Math.min(nearbyCommercial.length * 5, 20);

  // Nearby variance approvals
  const nearbyVariances = nearbyParcels.reduce(
    (count, p) =>
      count + p.permits.filter((permit) => permit.type === "Variance" && permit.status === "Approved").length,
    0
  );
  score += Math.min(nearbyVariances * 8, 24);

  // Under-assessed value vs neighbors
  const avgAssessed =
    nearbyParcels.reduce((sum, p) => sum + p.assessed_value, 0) / Math.max(nearbyParcels.length, 1);
  if (parcel.assessed_value < avgAssessed * 0.7) score += 15;
  else if (parcel.assessed_value < avgAssessed * 0.85) score += 8;

  // Recent zone changes nearby
  const recentZoneChanges = nearbyParcels.reduce(
    (count, p) =>
      count +
      p.permits.filter(
        (permit) =>
          permit.type === "Zone Change" &&
          new Date(permit.date) > new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
      ).length,
    0
  );
  score += Math.min(recentZoneChanges * 10, 20);

  // Lot size vs zoning density (larger lots in low-density zones)
  if (parcel.acres > 0.25 && (parcel.zoning_type === "Residential" || parcel.zoning_type === "Industrial")) {
    score += 10;
  }

  // Active permits on this parcel
  const activePermits = parcel.permits.filter(
    (p) => p.status === "Pending" || p.status === "Under Review"
  );
  score += Math.min(activePermits.length * 5, 11);

  return Math.min(Math.max(score, 0), 100);
}

async function generateAISummary(parcel: RealieParcel, score: number): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return "AI summary unavailable — set ANTHROPIC_API_KEY to enable.";
  }

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 300,
    messages: [
      {
        role: "user",
        content: `You are a real estate rezoning analyst. Provide a concise 2-3 sentence analysis of this parcel's rezoning potential.

Parcel: ${parcel.address}
APN: ${parcel.apn}
Current Zoning: ${parcel.zoning} (${parcel.zoning_type})
Assessed Value: $${parcel.assessed_value.toLocaleString()}
Size: ${parcel.acres} acres
Opportunity Score: ${score}/100
Recent Permits: ${JSON.stringify(parcel.permits.slice(0, 5))}

Focus on: why this parcel scores high, what signals indicate rezoning potential, and what an investor should investigate next.`,
      },
    ],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  return textBlock?.text || "Unable to generate summary.";
}

export async function POST(request: NextRequest) {
  try {
    // Auth & plan check
    let supabase;
    let user;
    try {
      supabase = createServerSupabaseClient();
      const { data } = await supabase.auth.getUser();
      user = data.user;
    } catch {
      return NextResponse.json({ error: "Auth service unavailable" }, { status: 503 });
    }

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    const fallbackProfile: Profile = {
      id: user.id,
      email: user.email || "",
      stripe_customer_id: null,
      plan: "free",
      created_at: new Date().toISOString(),
    };

    const { plan } = getUserPlanWithAdminOverride(profile || fallbackProfile);
    const maxCounties = getMaxCounties(plan);

    // Check county usage
    const { count } = await supabase
      .from("user_counties")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if ((count || 0) >= maxCounties) {
      return NextResponse.json(
        { error: `Your ${plan} plan allows ${maxCounties} county scan${maxCounties === 1 ? "" : "s"}. Upgrade for more.` },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { county_fips } = body;

    if (!county_fips) {
      return NextResponse.json(
        { error: "county_fips is required" },
        { status: 400 }
      );
    }

    // In production, this would call the Realie.ai API
    // For now, return a structured response showing the pipeline
    const pipeline = {
      status: "success",
      county_fips,
      steps: [
        { step: 1, name: "Pull parcel data from Realie.ai API", status: "would_execute" },
        { step: 2, name: "Pull zoning classifications", status: "would_execute" },
        { step: 3, name: "Pull permit history from county records", status: "would_execute" },
        { step: 4, name: "Score each parcel", status: "would_execute" },
        { step: 5, name: "Generate AI summaries for top parcels", status: "would_execute" },
        { step: 6, name: "Store in Supabase with PostGIS geometry", status: "would_execute" },
        { step: 7, name: "Trigger email digest if scheduled", status: "would_execute" },
      ],
      message:
        "Scan pipeline configured. Set REALIE_API_KEY and SUPABASE_SERVICE_ROLE_KEY to execute. The scoring algorithm evaluates: proximity to commercial zones, nearby variance approvals, under-assessed value vs neighbors, recent zone changes, lot size vs density allowances, and active permit activity.",
    };

    return NextResponse.json(pipeline);
  } catch (error) {
    console.error("Scan error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

