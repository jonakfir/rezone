export interface County {
  id: string;
  fips: string;
  name: string;
  state: string;
  last_scanned_at: string | null;
}

export interface Parcel {
  id: string;
  county_id: string;
  apn: string;
  address: string;
  owner: string;
  acres: number;
  current_zoning: string;
  zoning_type: string;
  assessed_value: number;
  opportunity_score: number;
  ai_summary: string | null;
  permit_history: PermitEntry[];
  geometry: GeoJSON.Polygon;
  last_updated: string;
}

export interface PermitEntry {
  date: string;
  type: string;
  description: string;
  status: string;
}

export interface UserCounty {
  user_id: string;
  county_id: string;
  alert_frequency: "daily" | "weekly" | "realtime";
  filters: ParcelFilters | null;
}

export interface Profile {
  id: string;
  email: string;
  stripe_customer_id: string | null;
  plan: "free" | "pro" | "institutional";
  created_at: string;
}

export interface ParcelFilters {
  zoning_types?: string[];
  min_score?: number;
  max_score?: number;
  min_acres?: number;
  max_acres?: number;
  date_from?: string;
  date_to?: string;
}

export interface ParcelWithCounty extends Parcel {
  county: County;
}
