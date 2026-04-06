"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/forever",
    description: "Get started with one county",
    features: [
      "1 county scan",
      "Weekly email digest",
      "Basic opportunity scores",
      "Map view",
    ],
    cta: "Start Free",
    href: "/auth/signup",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$99",
    period: "/month",
    description: "For active investors and developers",
    features: [
      "5 county scans",
      "Daily email alerts",
      "AI opportunity summaries",
      "Permit history timeline",
      "Sales comps",
      "Priority support",
    ],
    cta: "Start Pro Trial",
    href: "/auth/signup?plan=pro",
    highlight: true,
  },
  {
    name: "Institutional",
    price: "$499",
    period: "/month",
    description: "For firms and fund managers",
    features: [
      "Unlimited counties",
      "Real-time alerts",
      "Full AI analysis",
      "API access",
      "Custom scoring models",
      "Dedicated account manager",
      "Bulk export",
    ],
    cta: "Contact Sales",
    href: "/auth/signup?plan=institutional",
    highlight: false,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-editorial text-4xl md:text-5xl mb-4">
            Precision tools,{" "}
            <span className="text-copper">clear pricing</span>
          </h2>
          <p className="text-cream/50 max-w-lg mx-auto">
            No hidden fees. Cancel anytime. Start with a free county scan.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative p-6 border ${
                plan.highlight
                  ? "border-copper/40 bg-copper/5"
                  : "border-white/5 bg-forest-light/50"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-6 px-3 py-0.5 bg-copper text-white text-[10px] tracking-wider font-bold uppercase">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-editorial text-xl mb-1">{plan.name}</h3>
                <p className="text-cream/40 text-sm">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="font-editorial text-4xl">{plan.price}</span>
                <span className="text-cream/40 text-sm">{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-cream/70">
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
                    : "border border-white/10 text-cream/80 hover:border-copper/40 hover:text-copper"
                }`}
              >
                {plan.cta}
                <ArrowRight size={14} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
