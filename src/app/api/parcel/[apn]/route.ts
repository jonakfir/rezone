import { NextRequest, NextResponse } from "next/server";
import { DEMO_PARCELS, DEMO_COUNTY } from "@/lib/sample-data";

export async function GET(
  request: NextRequest,
  { params }: { params: { apn: string } }
) {
  const { apn } = params;

  // In production, this would query Supabase
  // For now, search demo data
  const parcel = DEMO_PARCELS.find((p) => p.apn === apn);

  if (!parcel) {
    return NextResponse.json(
      { error: "Parcel not found", apn },
      { status: 404 }
    );
  }

  return NextResponse.json({
    ...parcel,
    county: DEMO_COUNTY,
    nearby_sales: [
      {
        address: "1260 N Spring St",
        date: "2025-09-15",
        price: 1250000,
        price_per_sqft: 285,
        zoning: "C2-1",
      },
      {
        address: "1300 N Spring St",
        date: "2025-06-22",
        price: 980000,
        price_per_sqft: 242,
        zoning: "M1-1",
      },
    ],
    zoning_history: [
      { date: "2018-01-01", from: null, to: "M1-1", reason: "Original classification" },
    ],
  });
}
