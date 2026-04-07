"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  MapPin,
  Clock,
  Trash2,
  Pencil,
  Plus,
  Lock,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { useUser } from "@/lib/auth/user-context";
import { getMaxAlerts, getAllowedFrequencies } from "@/lib/auth/plan-gates";
import UpgradePrompt from "@/components/UpgradePrompt";

interface Alert {
  id: string;
  county: string;
  state: string;
  frequency: "daily" | "weekly" | "realtime";
  filters: string;
  lastTriggered: string;
  enabled: boolean;
  matchCount: number;
}

const DEMO_ALERTS: Alert[] = [
  {
    id: "1",
    county: "Los Angeles",
    state: "CA",
    frequency: "daily",
    filters: "Score > 80, Industrial + Commercial",
    lastTriggered: "2026-04-05T14:30:00Z",
    enabled: true,
    matchCount: 7,
  },
  {
    id: "2",
    county: "San Diego",
    state: "CA",
    frequency: "weekly",
    filters: "Score > 70, All zoning types",
    lastTriggered: "2026-04-01T09:00:00Z",
    enabled: true,
    matchCount: 12,
  },
  {
    id: "3",
    county: "Miami-Dade",
    state: "FL",
    frequency: "daily",
    filters: "Score > 85, Residential + Mixed-Use",
    lastTriggered: "2026-04-04T09:00:00Z",
    enabled: false,
    matchCount: 3,
  },
];

export default function AlertsPage() {
  const user = useUser();
  const maxAlerts = getMaxAlerts(user.plan);
  const allowedFreqs = getAllowedFrequencies(user.plan);
  const [alerts, setAlerts] = useState(DEMO_ALERTS);
  const atLimit = alerts.length >= maxAlerts;

  function toggleAlert(id: string) {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
  }

  function deleteAlert(id: string) {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto py-8 px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-editorial text-3xl">Alert Subscriptions</h1>
            <p className="text-cream/40 text-sm mt-1">
              Get notified when new rezoning opportunities match your criteria.
            </p>
          </div>
          <button
            className={`btn-primary flex items-center gap-2 text-sm ${atLimit ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={atLimit}
            title={atLimit ? `${user.plan === "free" ? "Free" : "Pro"} plan limited to ${maxAlerts} alert${maxAlerts === 1 ? "" : "s"}` : undefined}
          >
            {atLimit ? <Lock size={14} /> : <Plus size={14} />}
            {atLimit ? "Alert limit reached" : "New Alert"}
          </button>
        </div>

        {/* Alert list */}
        <div className="space-y-4">
          {alerts.map((alert, i) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`border p-5 transition-colors ${
                alert.enabled
                  ? "border-white/5 bg-forest-light/50"
                  : "border-white/5 bg-forest-light/20 opacity-60"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <MapPin size={14} className="text-teal" />
                    <h3 className="font-editorial text-lg">
                      {alert.county}, {alert.state}
                    </h3>
                    <span
                      className={`text-[10px] px-2 py-0.5 tracking-wider font-mono uppercase inline-flex items-center gap-1 ${
                        alert.frequency === "realtime"
                          ? "bg-copper/10 text-copper border border-copper/20"
                          : alert.frequency === "daily"
                          ? "bg-teal/10 text-teal border border-teal/20"
                          : "bg-white/5 text-cream/50 border border-white/10"
                      }`}
                    >
                      {!allowedFreqs.includes(alert.frequency) && <Lock size={9} />}
                      {alert.frequency}
                    </span>
                  </div>

                  <p className="text-sm text-cream/50 font-mono mb-3">{alert.filters}</p>

                  <div className="flex items-center gap-4 text-xs text-cream/30">
                    <div className="flex items-center gap-1.5">
                      <Clock size={11} />
                      <span>
                        Last triggered:{" "}
                        {new Date(alert.lastTriggered).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Bell size={11} />
                      <span>{alert.matchCount} matches last run</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => toggleAlert(alert.id)}
                    className="text-cream/40 hover:text-cream transition-colors"
                    title={alert.enabled ? "Disable" : "Enable"}
                  >
                    {alert.enabled ? (
                      <ToggleRight size={24} className="text-teal" />
                    ) : (
                      <ToggleLeft size={24} />
                    )}
                  </button>
                  <button className="p-2 text-cream/30 hover:text-cream transition-colors">
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => deleteAlert(alert.id)}
                    className="p-2 text-cream/30 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {atLimit && user.plan !== "institutional" && (
            <UpgradePrompt
              feature={`Upgrade to monitor more counties with ${user.plan === "free" ? "daily and " : ""}real-time alerts`}
              requiredPlan={user.plan === "free" ? "pro" : "institutional"}
            />
          )}

          {alerts.length === 0 && (
            <div className="text-center py-16">
              <Bell size={32} className="text-cream/10 mx-auto mb-4" />
              <p className="text-cream/40">No alerts configured yet.</p>
              <p className="text-cream/20 text-sm mt-1">
                Create an alert to get notified about new rezoning opportunities.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
