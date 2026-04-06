"use client";

import { useState } from "react";
import { Search, ChevronDown, SlidersHorizontal } from "lucide-react";

const ZONING_TYPES = [
  "Residential",
  "Commercial",
  "Industrial",
  "Mixed-Use",
  "Agricultural",
  "Institutional",
];

const DEMO_COUNTIES = [
  { id: "06037", name: "Los Angeles, CA" },
  { id: "06073", name: "San Diego, CA" },
  { id: "12086", name: "Miami-Dade, FL" },
  { id: "48201", name: "Harris (Houston), TX" },
  { id: "04013", name: "Maricopa (Phoenix), AZ" },
];

interface MapSidebarProps {
  onFiltersChange?: (filters: {
    county: string;
    zoningTypes: string[];
    minScore: number;
    maxScore: number;
  }) => void;
}

export default function MapSidebar({ onFiltersChange }: MapSidebarProps) {
  const [selectedCounty, setSelectedCounty] = useState(DEMO_COUNTIES[0].id);
  const [activeZoning, setActiveZoning] = useState<string[]>([]);
  const [scoreRange, setScoreRange] = useState([0, 100]);
  const [expanded, setExpanded] = useState(true);

  function toggleZoning(type: string) {
    setActiveZoning((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }

  return (
    <aside className="w-80 h-full border-r border-white/5 bg-forest overflow-y-auto flex-shrink-0">
      {/* County Selector */}
      <div className="p-4 border-b border-white/5">
        <label className="text-[10px] tracking-wider text-cream/30 uppercase block mb-2">
          County
        </label>
        <div className="relative">
          <select
            value={selectedCounty}
            onChange={(e) => setSelectedCounty(e.target.value)}
            className="w-full bg-forest-light border border-white/10 text-cream text-sm px-3 py-2 pr-8 appearance-none focus:border-copper/40 focus:outline-none transition-colors"
          >
            {DEMO_COUNTIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/30 pointer-events-none"
          />
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-white/5">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/30" />
          <input
            type="text"
            placeholder="Search address or APN..."
            className="w-full bg-forest-light border border-white/10 text-cream text-sm pl-9 pr-3 py-2 placeholder:text-cream/20 focus:border-copper/40 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 border-b border-white/5">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-between w-full mb-3"
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={14} className="text-copper" />
            <span className="text-xs tracking-wider text-cream/60 uppercase">Filters</span>
          </div>
          <ChevronDown
            size={14}
            className={`text-cream/30 transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </button>

        {expanded && (
          <div className="space-y-5">
            {/* Zoning Types */}
            <div>
              <label className="text-[10px] tracking-wider text-cream/30 uppercase block mb-2">
                Zoning Type
              </label>
              <div className="flex flex-wrap gap-1.5">
                {ZONING_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => toggleZoning(type)}
                    className={`px-2.5 py-1 text-xs border transition-all ${
                      activeZoning.includes(type)
                        ? "border-copper/40 bg-copper/10 text-copper"
                        : "border-white/5 text-cream/40 hover:border-white/10"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Opportunity Score */}
            <div>
              <label className="text-[10px] tracking-wider text-cream/30 uppercase block mb-2">
                Opportunity Score
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={scoreRange[0]}
                  onChange={(e) =>
                    setScoreRange([parseInt(e.target.value), scoreRange[1]])
                  }
                  className="flex-1 accent-copper h-1"
                />
                <span className="font-mono text-xs text-cream/50 w-8 text-right">
                  {scoreRange[0]}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={scoreRange[1]}
                  onChange={(e) =>
                    setScoreRange([scoreRange[0], parseInt(e.target.value)])
                  }
                  className="flex-1 accent-copper h-1"
                />
                <span className="font-mono text-xs text-cream/50 w-8 text-right">
                  {scoreRange[1]}
                </span>
              </div>
            </div>

            {/* Date Range */}
            <div>
              <label className="text-[10px] tracking-wider text-cream/30 uppercase block mb-2">
                Permit History Since
              </label>
              <input
                type="date"
                className="w-full bg-forest-light border border-white/10 text-cream text-sm px-3 py-2 focus:border-copper/40 focus:outline-none transition-colors"
                defaultValue="2025-01-01"
              />
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="p-4">
        <label className="text-[10px] tracking-wider text-cream/30 uppercase block mb-3">
          Score Legend
        </label>
        <div className="space-y-2">
          {[
            { color: "bg-red-400", label: "High (85+)", desc: "Strong rezoning signal" },
            { color: "bg-yellow-400", label: "Medium (70-84)", desc: "Moderate potential" },
            { color: "bg-green-400", label: "Low (< 70)", desc: "Early indicators" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <div className={`w-3 h-3 ${item.color} flex-shrink-0`} />
              <div>
                <span className="text-xs text-cream/60">{item.label}</span>
                <p className="text-[10px] text-cream/30">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
