"use client";

import { motion } from "framer-motion";
import { Scan, Zap, Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const features = [
  {
    icon: Scan,
    title: "Parcel Intelligence",
    description:
      "Deep data on every parcel — ownership, assessments, zoning classifications, and lot characteristics pulled from county records.",
    stat: "2.4M+",
    statLabel: "parcels indexed",
  },
  {
    icon: Zap,
    title: "Zoning Signals",
    description:
      "Our scoring engine detects parcels where nearby variance approvals, zone changes, and permit activity signal upcoming rezoning potential.",
    stat: "47",
    statLabel: "signal types tracked",
  },
  {
    icon: Bell,
    title: "Weekly Alerts",
    description:
      "Get notified when new high-score parcels appear in your target counties. Daily alerts for Pro. Real-time for Institutional.",
    stat: "< 24hr",
    statLabel: "alert latency",
  },
];

export default function FeatureStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.05, rootMargin: "100px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" className="py-24 px-6 border-y border-white/5" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 flex items-center justify-center border border-copper/20 bg-copper/5 group-hover:border-copper/40 transition-colors">
                  <feature.icon size={18} className="text-copper" />
                </div>
                <h3 className="font-editorial text-lg">{feature.title}</h3>
              </div>
              <p className="text-cream/60 text-sm leading-relaxed mb-4">
                {feature.description}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-2xl text-teal font-bold">
                  {feature.stat}
                </span>
                <span className="text-xs text-cream/50 uppercase tracking-wider">
                  {feature.statLabel}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
