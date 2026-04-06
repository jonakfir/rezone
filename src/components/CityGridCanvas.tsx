"use client";

import { useEffect, useRef } from "react";

interface Building {
  x: number;
  y: number;
  w: number;
  h: number;
  height: number;
  color: string;
  glowColor: string;
  glowPhase: number;
  glowSpeed: number;
}

const ZONING_COLORS = {
  residential: { base: "#1a3520", glow: "#00E5CC" },
  commercial: { base: "#2a1f10", glow: "#E07B39" },
  industrial: { base: "#1a1a2e", glow: "#7B68EE" },
  mixed: { base: "#1f2a1a", glow: "#FFD700" },
  opportunity: { base: "#2a1508", glow: "#E07B39" },
};

export default function CityGridCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const scrollRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx!.scale(dpr, dpr);
    }
    resize();
    window.addEventListener("resize", resize);

    // Generate buildings grid
    const buildings: Building[] = [];
    const gridSize = 60;
    const gap = 8;
    const cols = Math.ceil(window.innerWidth / (gridSize + gap)) + 4;
    const rows = Math.ceil(window.innerHeight / (gridSize + gap)) + 4;
    const zoningTypes = Object.keys(ZONING_COLORS) as (keyof typeof ZONING_COLORS)[];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const zType = zoningTypes[Math.floor(Math.random() * zoningTypes.length)];
        const colors = ZONING_COLORS[zType];
        const w = gridSize * (0.6 + Math.random() * 0.4);
        const h = gridSize * (0.6 + Math.random() * 0.4);

        buildings.push({
          x: col * (gridSize + gap) - gridSize,
          y: row * (gridSize + gap) - gridSize,
          w,
          h,
          height: 10 + Math.random() * 30,
          color: colors.base,
          glowColor: colors.glow,
          glowPhase: Math.random() * Math.PI * 2,
          glowSpeed: 0.5 + Math.random() * 1.5,
        });
      }
    }

    // Scroll handler
    function onScroll() {
      scrollRef.current = window.scrollY;
    }
    window.addEventListener("scroll", onScroll, { passive: true });

    let time = 0;

    function draw() {
      if (!ctx || !canvas) return;
      const W = canvas.width / dpr;
      const H = canvas.height / dpr;

      time += 0.016;

      // Zoom based on scroll
      const scrollFactor = Math.min(scrollRef.current / (H * 1.5), 1);
      const zoom = 1 + scrollFactor * 0.8;

      ctx.clearRect(0, 0, W, H);

      // Background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
      bgGrad.addColorStop(0, "#0A1F0F");
      bgGrad.addColorStop(1, "#06140A");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      ctx.save();

      // Apply isometric-like transform
      const cx = W / 2;
      const cy = H / 2;
      ctx.translate(cx, cy);
      ctx.scale(zoom, zoom);
      ctx.translate(-cx, -cy);

      // Slight rotation for SimCity perspective
      ctx.translate(cx, cy);
      ctx.transform(1, 0.15, -0.3, 0.85, 0, 0);
      ctx.translate(-cx, -cy - 100);

      // Draw grid lines
      ctx.strokeStyle = "rgba(26, 53, 32, 0.3)";
      ctx.lineWidth = 0.5;
      for (let row = 0; row <= rows; row++) {
        ctx.beginPath();
        ctx.moveTo(-gridSize, row * (gridSize + gap));
        ctx.lineTo(cols * (gridSize + gap), row * (gridSize + gap));
        ctx.stroke();
      }
      for (let col = 0; col <= cols; col++) {
        ctx.beginPath();
        ctx.moveTo(col * (gridSize + gap), -gridSize);
        ctx.lineTo(col * (gridSize + gap), rows * (gridSize + gap));
        ctx.stroke();
      }

      // Draw buildings
      for (const b of buildings) {
        const glowIntensity = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(time * b.glowSpeed + b.glowPhase));

        // Building base
        ctx.fillStyle = b.color;
        ctx.fillRect(b.x, b.y, b.w, b.h);

        // Building glow border
        ctx.strokeStyle = b.glowColor;
        ctx.globalAlpha = glowIntensity * 0.6;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(b.x, b.y, b.w, b.h);

        // Inner glow
        ctx.globalAlpha = glowIntensity * 0.1;
        ctx.fillStyle = b.glowColor;
        ctx.fillRect(b.x, b.y, b.w, b.h);

        ctx.globalAlpha = 1;
      }

      // Highlight a few "opportunity" parcels with stronger glow
      const opportunityIndices = [12, 25, 38, 51, 67, 83];
      for (const idx of opportunityIndices) {
        if (idx >= buildings.length) continue;
        const b = buildings[idx];
        const pulse = 0.5 + 0.5 * Math.sin(time * 2 + idx);

        ctx.shadowColor = "#E07B39";
        ctx.shadowBlur = 20 * pulse;
        ctx.strokeStyle = "#E07B39";
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.8;
        ctx.strokeRect(b.x - 1, b.y - 1, b.w + 2, b.h + 2);
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }

      ctx.restore();

      // Vignette overlay
      const vigGrad = ctx.createRadialGradient(cx, cy, H * 0.2, cx, cy, H * 0.9);
      vigGrad.addColorStop(0, "rgba(10, 31, 15, 0)");
      vigGrad.addColorStop(1, "rgba(10, 31, 15, 0.7)");
      ctx.fillStyle = vigGrad;
      ctx.fillRect(0, 0, W, H);

      animationRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: "none" }}
    />
  );
}
