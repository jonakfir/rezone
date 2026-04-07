"use client";

import { useEffect, useRef, useState } from "react";
import { DEMO_PARCELS, DEMO_MAP_CENTER, DEMO_MAP_ZOOM } from "@/lib/sample-data";
import type { Parcel } from "@/types/database";
import MapSidebar from "@/components/MapSidebar";
import ParcelCard from "@/components/ParcelCard";
import { useUser } from "@/lib/auth/user-context";

export default function MapPage() {
  const user = useUser();
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    if (!token) {
      setMapReady(true);
      return;
    }

    import("mapbox-gl").then((mapboxgl) => {
      mapboxgl.default.accessToken = token;

      const map = new mapboxgl.default.Map({
        container: mapContainer.current!,
        style: "mapbox://styles/mapbox/dark-v11",
        center: DEMO_MAP_CENTER,
        zoom: DEMO_MAP_ZOOM,
        pitch: 40,
        bearing: -10,
        attributionControl: false,
      });

      map.addControl(new mapboxgl.default.NavigationControl(), "top-right");
      map.addControl(
        new mapboxgl.default.GeolocateControl({
          positionOptions: { enableHighAccuracy: true },
          trackUserLocation: false,
        }),
        "top-right"
      );

      map.on("load", () => {
        setMapReady(true);

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

        // Fill layer
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
            "fill-opacity": [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              0.7,
              0.35,
            ],
          },
        });

        // Outline layer
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
            "line-width": [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              3,
              1.5,
            ],
          },
        });

        // Markers
        DEMO_PARCELS.forEach((parcel) => {
          const coords = parcel.geometry.coordinates[0];
          const centerLng = coords.reduce((sum, c) => sum + c[0], 0) / coords.length;
          const centerLat = coords.reduce((sum, c) => sum + c[1], 0) / coords.length;

          const el = document.createElement("div");
          el.className = "w-3 h-3 rounded-full cursor-pointer transition-transform hover:scale-150";
          el.style.backgroundColor = "#00E5CC";
          el.style.boxShadow = "0 0 12px rgba(0, 229, 204, 0.6)";

          new mapboxgl.default.Marker(el)
            .setLngLat([centerLng, centerLat])
            .addTo(map);

          el.addEventListener("click", () => setSelectedParcel(parcel));
        });

        map.on("click", "parcels-fill", (e) => {
          if (e.features?.[0]) {
            const id = e.features[0].properties?.id;
            const parcel = DEMO_PARCELS.find((p) => p.id === id);
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
    <div className="flex h-full">
      <MapSidebar />

      {/* Map */}
      <div className="flex-1 relative">
        <div ref={mapContainer} className="absolute inset-0" />

        {/* Fallback */}
        {!process.env.NEXT_PUBLIC_MAPBOX_TOKEN && (
          <div className="absolute inset-0 bg-forest-light flex items-center justify-center">
            <div className="text-center space-y-4">
              <p className="font-mono text-cream/40 text-sm">
                Set NEXT_PUBLIC_MAPBOX_TOKEN to enable the interactive map
              </p>
              <div className="grid grid-cols-3 gap-3 mx-auto w-fit">
                {DEMO_PARCELS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedParcel(p)}
                    className="data-card p-3 hover:border-copper/30 transition-colors cursor-pointer text-left"
                  >
                    <div className="font-mono text-xs text-cream/40 mb-1">{p.apn}</div>
                    <div className="text-sm text-cream/80 truncate mb-1">{p.address}</div>
                    <div
                      className={`font-mono text-lg font-bold ${
                        p.opportunity_score >= 85
                          ? "text-red-400"
                          : p.opportunity_score >= 70
                          ? "text-yellow-400"
                          : "text-green-400"
                      }`}
                    >
                      {p.opportunity_score}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {!mapReady && (
          <div className="absolute inset-0 bg-forest flex items-center justify-center">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-teal rounded-full animate-pulse" />
              <span className="text-cream/50 font-mono text-sm">Initializing map...</span>
            </div>
          </div>
        )}

        {/* Selected parcel card */}
        {selectedParcel && (
          <div className="absolute top-4 right-4 w-96 max-h-[calc(100%-2rem)] overflow-y-auto animate-slide-in-right z-10">
            <ParcelCard
              parcel={selectedParcel}
              onClose={() => setSelectedParcel(null)}
              userPlan={user.plan}
            />
          </div>
        )}
      </div>
    </div>
  );
}
