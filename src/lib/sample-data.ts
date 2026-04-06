import type { Parcel, County } from "@/types/database";

export const DEMO_COUNTY: County = {
  id: "demo-county-001",
  fips: "06037",
  name: "Los Angeles",
  state: "CA",
  last_scanned_at: "2026-04-05T08:00:00Z",
};

export const DEMO_PARCELS: Parcel[] = [
  {
    id: "demo-parcel-001",
    county_id: "demo-county-001",
    apn: "5147-018-025",
    address: "1247 N Spring St, Los Angeles, CA 90012",
    owner: "Spring Street Holdings LLC",
    acres: 0.34,
    current_zoning: "M1-1",
    zoning_type: "Light Industrial",
    assessed_value: 820000,
    opportunity_score: 92,
    ai_summary:
      "High-potential rezoning candidate. Adjacent parcels recently rezoned to C2 (Commercial). City's Arts District Specific Plan encourages mixed-use development. Current M1-1 zoning significantly undervalues land relative to nearby C2 parcels selling at 3.2x assessed value. Three variance approvals granted within 500ft in last 18 months.",
    permit_history: [
      { date: "2025-11-15", type: "Variance", description: "Height variance approved for adjacent parcel", status: "Approved" },
      { date: "2025-08-22", type: "Zone Change", description: "M1 to C2 conversion — 1300 block", status: "Approved" },
      { date: "2025-03-10", type: "CUP", description: "Conditional use permit for mixed-use — 1260 N Spring", status: "Approved" },
    ],
    geometry: {
      type: "Polygon",
      coordinates: [[[-118.2368, 34.0622], [-118.2362, 34.0622], [-118.2362, 34.0618], [-118.2368, 34.0618], [-118.2368, 34.0622]]],
    },
    last_updated: "2026-04-05T08:00:00Z",
  },
  {
    id: "demo-parcel-002",
    county_id: "demo-county-001",
    apn: "5163-011-008",
    address: "720 E 4th St, Los Angeles, CA 90013",
    owner: "Fourth & Hewitt Partners",
    acres: 0.52,
    current_zoning: "M2-2",
    zoning_type: "Heavy Industrial",
    assessed_value: 1150000,
    opportunity_score: 87,
    ai_summary:
      "Strong rezoning signal. Located in transitioning Arts District corridor. M2-2 zoning is legacy classification — surrounding blocks converting to mixed-use. Owner delinquent on property taxes (2 quarters). Lot size exceeds minimum for planned district density bonus. Assessed value 41% below comparable parcels.",
    permit_history: [
      { date: "2026-01-20", type: "Environmental", description: "Phase I environmental clearance", status: "Completed" },
      { date: "2025-09-05", type: "Zone Change", description: "M2 to CM (Commercial Manufacturing) petition filed", status: "Pending" },
    ],
    geometry: {
      type: "Polygon",
      coordinates: [[[-118.2325, 34.0462], [-118.2317, 34.0462], [-118.2317, 34.0456], [-118.2325, 34.0456], [-118.2325, 34.0462]]],
    },
    last_updated: "2026-04-05T08:00:00Z",
  },
  {
    id: "demo-parcel-003",
    county_id: "demo-county-001",
    apn: "5409-015-033",
    address: "3845 S Western Ave, Los Angeles, CA 90062",
    owner: "Western Avenue Investments Inc",
    acres: 0.28,
    current_zoning: "R3-1",
    zoning_type: "Multi-Family Residential",
    assessed_value: 540000,
    opportunity_score: 78,
    ai_summary:
      "Moderate rezoning opportunity. TOC (Transit-Oriented Communities) Tier 3 eligible — within 750ft of Metro station. Current R3-1 allows 3 stories; TOC bonus would enable 5 stories + density bonus. Recent council motion to upzone Western Ave corridor. Two comparable lots sold at 2.1x assessed within 6 months.",
    permit_history: [
      { date: "2025-12-01", type: "TOC", description: "TOC application filed — adjacent parcel", status: "Under Review" },
      { date: "2025-06-18", type: "Sale", description: "Comparable lot at 3901 S Western sold $1.14M", status: "Closed" },
    ],
    geometry: {
      type: "Polygon",
      coordinates: [[[-118.3093, 33.9872], [-118.3087, 33.9872], [-118.3087, 33.9868], [-118.3093, 33.9868], [-118.3093, 33.9872]]],
    },
    last_updated: "2026-04-05T08:00:00Z",
  },
  {
    id: "demo-parcel-004",
    county_id: "demo-county-001",
    apn: "2021-008-019",
    address: "6200 Sunset Blvd, Los Angeles, CA 90028",
    owner: "Sunset Media Group",
    acres: 0.41,
    current_zoning: "C4-2D",
    zoning_type: "Commercial",
    assessed_value: 2800000,
    opportunity_score: 65,
    ai_summary:
      "Moderate opportunity. D-limitation restricts current height to 45ft. Hollywood Community Plan Update proposes removing D-limitations on Sunset Blvd corridor. If approved, FAR would increase from 3:1 to 6:1, effectively doubling development capacity. Plan update expected Q3 2026.",
    permit_history: [
      { date: "2026-02-10", type: "Plan Update", description: "Hollywood Community Plan Update — public comment period", status: "Active" },
      { date: "2025-10-30", type: "Demo", description: "Demolition permit for existing structure", status: "Approved" },
    ],
    geometry: {
      type: "Polygon",
      coordinates: [[[-118.3245, 34.0983], [-118.3238, 34.0983], [-118.3238, 34.0978], [-118.3245, 34.0978], [-118.3245, 34.0983]]],
    },
    last_updated: "2026-04-05T08:00:00Z",
  },
  {
    id: "demo-parcel-005",
    county_id: "demo-county-001",
    apn: "4380-022-041",
    address: "8910 Washington Blvd, Culver City, CA 90232",
    owner: "Pacific Culver LLC",
    acres: 0.63,
    current_zoning: "IG",
    zoning_type: "Industrial General",
    assessed_value: 1950000,
    opportunity_score: 84,
    ai_summary:
      "Strong signal. Culver City's Comprehensive Zoning Code Update targets IG parcels near Expo Line for mixed-use conversion. This parcel is 400ft from station. Apple and Amazon's nearby expansions have driven commercial land values up 65% in corridor. Owner is estate — potential motivated seller.",
    permit_history: [
      { date: "2026-03-15", type: "Zone Study", description: "City-initiated zoning study for Washington/National corridor", status: "Active" },
      { date: "2025-07-20", type: "Sale", description: "Adjacent parcel sold to developer for $4.2M", status: "Closed" },
    ],
    geometry: {
      type: "Polygon",
      coordinates: [[[-118.3812, 34.0247], [-118.3803, 34.0247], [-118.3803, 34.0241], [-118.3812, 34.0241], [-118.3812, 34.0247]]],
    },
    last_updated: "2026-04-05T08:00:00Z",
  },
];

export const DEMO_MAP_CENTER: [number, number] = [-118.28, 34.05];
export const DEMO_MAP_ZOOM = 11;
