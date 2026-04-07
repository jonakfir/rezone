"use client";

import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Starter",
    price: "$29",
    period: "/month",
    description: "For solo investors getting started",
    trial: "3-day free trial",
    features: [
      "1 county scan",
      "Weekly email digest",
      "Basic opportunity scores",
      "Map view",
      "10 AI summaries/mo",
    ],
    cta: "Start Free Trial",
    href: "/auth/signup?plan=starter",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$79",
    period: "/month",
    description: "For active investors and dev shops",
    trial: "3-day free trial",
    features: [
      "10 county scans",
      "Daily email alerts",
      "Unlimited AI summaries",
      "Permit history timeline",
      "Sales comps",
      "CSV export",
      "Priority email support",
    ],
    cta: "Start Free Trial",
    href: "/auth/signup?plan=pro",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "$349",
    period: "/month",
    description: "For firms and fund managers",
    trial: "3-day free trial",
    features: [
      "Unlimited counties",
      "Real-time alerts",
      "Unlimited AI analysis",
      "API access",
      "Custom scoring models",
      "CSV + bulk API export",
      "Dedicated Slack support",
    ],
    cta: "Start Free Trial",
    href: "/auth/signup?plan=enterprise",
    highlight: false,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-editorial text-4xl md:text-5xl mb-4">
            Precision tools,{" "}
            <span className="text-copper">clear pricing</span>
          </h2>
          <p className="text-cream/60 max-w-lg mx-auto">
            3-day free trial on every plan. No credit card required. Cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-6 border ${
                plan.highlight
                  ? "border-copper/40 bg-copper/5"
                  : "border-white/10 bg-forest-light/50"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-6 px-3 py-0.5 bg-copper text-white text-[10px] tracking-wider font-bold uppercase">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-editorial text-xl mb-1">{plan.name}</h3>
                <p className="text-cream/60 text-sm">{plan.description}</p>
              </div>

              <div className="mb-2">
                <span className="font-editorial text-4xl">{plan.price}</span>
                <span className="text-cream/60 text-sm">{plan.period}</span>
              </div>

              <p className="text-xs font-mono text-teal mb-6">{plan.trial}</p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-cream/80">
                    <Check size={14} className="text-teal flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`flex items-center justify-center gap-2 w-full py-3 font-semibold text-sm tracking-wide transition-all ${
                  plan.highlight
                    ? "bg-copper text-white hover:bg-copper-dark"
                    : "border border-white/20 text-cream/80 hover:border-copper/40 hover:text-copper"
                }`}
              >
                {plan.cta}
                <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
