"use client";

import { useEffect, useRef, useState } from "react";
import { DEMO_PARCELS, DEMO_MAP_CENTER, DEMO_MAP_ZOOM } from "@/lib/sample-data";
import type { Parcel } from "@/types/database";
import ParcelCard from "./ParcelCard";

export default function DemoMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      // Show static fallback if no token
      setMapLoaded(true);
      return;
    }

    import("mapbox-gl").then((mapboxgl) => {
      mapboxgl.default.accessToken = token;

      const map = new mapboxgl.default.Map({
        container: mapContainer.current!,
        style: "mapbox://styles/mapbox/dark-v11",
        center: DEMO_MAP_CENTER,
        zoom: DEMO_MAP_ZOOM,
        pitch: 30,
        interactive: true,
        attributionControl: false,
      });

      map.addControl(new mapboxgl.default.NavigationControl(), "top-right");

      map.on("load", () => {
        setMapLoaded(true);

        // Add parcel source
        const features = DEMO_PARCELS.map((p) => ({
          type: "Feature" as const,
          geometry: p.geometry,
          properties: {
            id: p.id,
            apn: p.apn,
            score: p.opportunity_score,
            address: p.address,
            zoning: p.current_zoning,
          },
        }));

        map.addSource("parcels", {
          type: "geojson",
          data: { type: "FeatureCollection", features },
        });

        map.addLayer({
          id: "parcels-fill",
          type: "fill",
          source: "parcels",
          paint: {
            "fill-color": [
              "interpolate",
              ["linear"],
              ["get", "score"],
              50, "#22c55e",
              70, "#eab308",
              85, "#E07B39",
              95, "#ef4444",
            ],
            "fill-opacity": 0.4,
          },
        });

        map.addLayer({
          id: "parcels-outline",
          type: "line",
          source: "parcels",
          paint: {
            "line-color": [
              "interpolate",
              ["linear"],
              ["get", "score"],
              50, "#22c55e",
              70, "#eab308",
              85, "#E07B39",
              95, "#ef4444",
            ],
            "line-width": 2,
          },
        });

        // Add markers for each parcel
        DEMO_PARCELS.forEach((parcel) => {
          const coords = parcel.geometry.coordinates[0];
          const centerLng = coords.reduce((sum, c) => sum + c[0], 0) / coords.length;
          const centerLat = coords.reduce((sum, c) => sum + c[1], 0) / coords.length;

          const el = document.createElement("div");
          el.className = "w-3 h-3 rounded-full cursor-pointer";
          el.style.backgroundColor = "#00E5CC";
          el.style.boxShadow = "0 0 12px rgba(0, 229, 204, 0.6)";

          const marker = new mapboxgl.default.Marker(el)
            .setLngLat([centerLng, centerLat])
            .addTo(map);

          el.addEventListener("click", () => {
            setSelectedParcel(parcel);
          });
        });

        // Click on fill layer
        map.on("click", "parcels-fill", (e) => {
          if (e.features && e.features[0]) {
            const clickedId = e.features[0].properties?.id;
            const parcel = DEMO_PARCELS.find((p) => p.id === clickedId);
            if (parcel) setSelectedParcel(parcel);
          }
        });

        map.on("mouseenter", "parcels-fill", () => {
          map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", "parcels-fill", () => {
          map.getCanvas().style.cursor = "";
        });
      });

      mapRef.current = map;
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="relative w-full h-[600px] border border-white/5">
      <div ref={mapContainer} className="absolute inset-0" />

      {/* Static fallback when no Mapbox token */}
      {!process.env.NEXT_PUBLIC_MAPBOX_TOKEN && (
        <div className="absolute inset-0 bg-forest-light flex items-center justify-center">
          <div className="text-center space-y-4 p-8">
            <div className="grid grid-cols-5 gap-2 mx-auto w-fit mb-6">
              {DEMO_PARCELS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedParcel(p)}
                  className="w-16 h-16 border-2 transition-all hover:scale-105"
                  style={{
                    borderColor:
                      p.opportunity_score > 85
                        ? "#E07B39"
                        : p.opportunity_score > 70
                        ? "#eab308"
                        : "#22c55e",
                    backgroundColor:
                      p.opportunity_score > 85
                        ? "rgba(224,123,57,0.15)"
                        : p.opportunity_score > 70
                        ? "rgba(234,179,8,0.15)"
                        : "rgba(34,197,94,0.15)",
                  }}
                >
                  <span className="text-xs font-mono text-cream/60">{p.opportunity_score}</span>
                </button>
              ))}
            </div>
            <p className="text-cream/40 text-sm font-mono">
              Add NEXT_PUBLIC_MAPBOX_TOKEN for interactive map
            </p>
          </div>
        </div>
      )}

      {/* Loading state */}
      {!mapLoaded && (
        <div className="absolute inset-0 bg-forest-light flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-teal rounded-full animate-pulse" />
            <span className="text-cream/50 font-mono text-sm">Loading map tiles...</span>
          </div>
        </div>
      )}

      {/* Parcel detail card */}
      {selectedParcel && (
        <div className="absolute top-4 right-4 w-96 max-h-[560px] overflow-y-auto animate-slide-in-right">
          <ParcelCard parcel={selectedParcel} onClose={() => setSelectedParcel(null)} />
        </div>
      )}

      {/* Demo badge */}
      <div className="absolute top-4 left-4 glass-panel px-3 py-1.5">
        <span className="text-xs font-mono text-copper">DEMO</span>
        <span className="text-xs text-cream/40 ml-2">Los Angeles County — 5 sample parcels</span>
      </div>
    </div>
  );
}
