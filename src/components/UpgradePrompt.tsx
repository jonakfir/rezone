"use client";

import { Lock, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function UpgradePrompt({
  feature,
  requiredPlan,
}: {
  feature: string;
  requiredPlan: "pro" | "institutional";
}) {
  return (
    <div className="border border-copper/20 bg-copper/5 p-4">
      <div className="flex items-start gap-3">
        <div className="p-1.5 bg-copper/10 border border-copper/20 mt-0.5">
          <Lock size={12} className="text-copper" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-cream/80">
            <span className="font-editorial text-copper capitalize">{requiredPlan}</span>
            {" "}feature
          </p>
          <p className="text-xs text-cream/40 mt-1">{feature}</p>
          <Link
            href="/#pricing"
            className="inline-flex items-center gap-1 mt-3 text-xs font-mono text-copper hover:text-copper/80 transition-colors"
          >
            Upgrade plan <ArrowUpRight size={11} />
          </Link>
        </div>
      </div>
    </div>
  );
}
