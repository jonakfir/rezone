import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    counties: 1,
    frequency: "weekly",
    features: [
      "1 county scan",
      "Weekly email digest",
      "Basic opportunity scores",
      "Map view",
    ],
  },
  pro: {
    name: "Pro",
    price: 99,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    counties: 5,
    frequency: "daily",
    features: [
      "5 county scans",
      "Daily email alerts",
      "AI opportunity summaries",
      "Permit history timeline",
      "Sales comps",
      "Priority support",
    ],
  },
  institutional: {
    name: "Institutional",
    price: 499,
    priceId: process.env.STRIPE_INSTITUTIONAL_PRICE_ID,
    counties: -1, // unlimited
    frequency: "daily",
    features: [
      "Unlimited counties",
      "Real-time alerts",
      "Full AI analysis",
      "API access",
      "Custom scoring models",
      "Dedicated account manager",
      "Bulk export",
    ],
  },
} as const;
