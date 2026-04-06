import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FAF7F2",
        forest: {
          DEFAULT: "#0A1F0F",
          light: "#132B17",
          dark: "#06140A",
        },
        copper: {
          DEFAULT: "#E07B39",
          light: "#E8945A",
          dark: "#C46628",
        },
        teal: {
          DEFAULT: "#00E5CC",
          light: "#33EDD6",
          dark: "#00B8A3",
        },
        slate: {
          850: "#1A2332",
        },
      },
      fontFamily: {
        editorial: ['"Editorial New"', "Georgia", "serif"],
        mono: ['"IBM Plex Mono"', "monospace"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
      animation: {
        "slide-in-right": "slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-in-left": "slideInLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in": "fadeIn 0.3s ease-out",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
      },
      keyframes: {
        slideInRight: {
          from: { transform: "translateX(100%)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        slideInLeft: {
          from: { transform: "translateX(-100%)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
