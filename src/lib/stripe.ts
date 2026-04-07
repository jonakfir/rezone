import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return _stripe;
}

/** @deprecated Use getStripe() instead — lazy init to avoid build-time errors */
export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

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
    price: 49,
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
