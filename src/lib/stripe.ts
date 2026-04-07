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
    name: "Starter",
    price: 29,
    trialDays: 3,
    priceId: process.env.STRIPE_STARTER_PRICE_ID,
    counties: 1,
    frequency: "weekly",
    features: [
      "1 county scan",
      "Weekly email digest",
      "Basic opportunity scores",
      "Map view",
      "10 AI summaries/mo",
    ],
  },
  pro: {
    name: "Pro",
    price: 79,
    trialDays: 3,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    counties: 10,
    frequency: "daily",
    features: [
      "10 county scans",
      "Daily email alerts",
      "Unlimited AI summaries",
      "Permit history timeline",
      "Sales comps",
      "CSV export",
      "Priority email support",
    ],
  },
  institutional: {
    name: "Enterprise",
    price: 349,
    trialDays: 3,
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    counties: -1, // unlimited
    frequency: "realtime",
    features: [
      "Unlimited counties",
      "Real-time alerts",
      "Unlimited AI analysis",
      "API access",
      "Custom scoring models",
      "CSV + bulk API export",
      "Dedicated Slack support",
    ],
  },
} as const;
