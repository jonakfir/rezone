"use client";

import { motion } from "framer-motion";
import { X, MapPin, User, Maximize2, Tag, DollarSign, Brain, Clock } from "lucide-react";
import type { Parcel, Profile } from "@/types/database";
import { canAccessFeature } from "@/lib/auth/plan-gates";
import UpgradePrompt from "@/components/UpgradePrompt";

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 85 ? "text-red-400 border-red-400/30 bg-red-400/10" :
    score >= 70 ? "text-yellow-400 border-yellow-400/30 bg-yellow-400/10" :
    "text-green-400 border-green-400/30 bg-green-400/10";

  const label = score >= 85 ? "HIGH" : score >= 70 ? "MEDIUM" : "LOW";

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 border ${color}`}>
      <span className="font-mono text-lg font-bold">{score}</span>
      <span className="text-[10px] tracking-wider font-semibold">{label}</span>
    </div>
  );
}

export default function ParcelCard({
  parcel,
  onClose,
  userPlan = "free",
}: {
  parcel: Parcel;
  onClose: () => void;
  userPlan?: Profile["plan"];
}) {
  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="glass-panel"
    >
      {/* Header */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-start justify-between">
          <ScoreBadge score={parcel.opportunity_score} />
          <button
            onClick={onClose}
            className="text-cream/30 hover:text-cream transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <h3 className="font-editorial text-lg mt-3">{parcel.address}</h3>
        <p className="font-mono text-xs text-cream/40 mt-1">APN {parcel.apn}</p>
      </div>

      {/* Details */}
      <div className="p-4 space-y-3 border-b border-white/5">
        <div className="grid grid-cols-2 gap-3">
          <Detail icon={<Tag size={12} />} label="Zoning" value={parcel.current_zoning} />
          <Detail icon={<Maximize2 size={12} />} label="Size" value={`${parcel.acres} ac`} />
          <Detail icon={<User size={12} />} label="Owner" value={parcel.owner} />
          <Detail
            icon={<DollarSign size={12} />}
            label="Assessed"
            value={`$${parcel.assessed_value.toLocaleString()}`}
          />
        </div>
      </div>

      {/* AI Summary */}
      {parcel.ai_summary && (
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <Brain size={12} className="text-copper" />
            <span className="text-[10px] tracking-wider text-copper font-semibold uppercase">
              AI Analysis
            </span>
          </div>
          {canAccessFeature(userPlan, "ai_summaries") ? (
            <p className="text-sm text-cream/70 leading-relaxed">{parcel.ai_summary}</p>
          ) : (
            <UpgradePrompt feature="AI-powered rezoning opportunity summaries" requiredPlan="pro" />
          )}
        </div>
      )}

      {/* Permit History */}
      {parcel.permit_history && parcel.permit_history.length > 0 && (
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={12} className="text-teal" />
            <span className="text-[10px] tracking-wider text-teal font-semibold uppercase">
              Permit Timeline
            </span>
          </div>
          {!canAccessFeature(userPlan, "permit_timeline") ? (
            <UpgradePrompt feature="Full permit history timeline" requiredPlan="pro" />
          ) : (
          <div className="space-y-3">
            {parcel.permit_history.map((permit, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal/60 mt-1.5" />
                  {i < parcel.permit_history.length - 1 && (
                    <div className="w-px flex-1 bg-white/5 mt-1" />
                  )}
                </div>
                <div className="flex-1 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-cream/40">{permit.date}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 ${
                        permit.status === "Approved"
                          ? "bg-green-500/10 text-green-400"
                          : permit.status === "Pending"
                          ? "bg-yellow-500/10 text-yellow-400"
                          : "bg-teal/10 text-teal"
                      }`}
                    >
                      {permit.status}
                    </span>
                  </div>
                  <p className="text-xs text-cream/60 mt-0.5">
                    <span className="text-cream/80 font-medium">{permit.type}</span> —{" "}
                    {permit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 text-cream/30">
        {icon}
        <span className="text-[10px] tracking-wider uppercase">{label}</span>
      </div>
      <p className="text-sm font-mono text-cream/80 truncate">{value}</p>
    </div>
  );
}
