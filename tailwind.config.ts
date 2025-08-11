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
        // Colores basados en el logo del Pabellón
        pabellon: {
          gold: {
            50: "#fffbeb",
            100: "#fef3c7",
            200: "#fde68a",
            300: "#fcd34d",
            400: "#fbbf24", // Color principal del logo
            500: "#f59e0b",
            600: "#d97706",
            700: "#b45309",
            800: "#92400e",
            900: "#78350f",
          },
          green: {
            50: "#f0fdf4",
            100: "#dcfce7",
            200: "#bbf7d0",
            300: "#86efac",
            400: "#4ade80",
            500: "#22c55e",
            600: "#16a34a",
            700: "#15803d", // Color verde del escudo
            800: "#166534",
            900: "#14532d",
          },
          brown: {
            50: "#fdf8f6",
            100: "#f2e8e5",
            200: "#eaddd7",
            300: "#e0cfc5",
            400: "#d2bab0",
            500: "#bfa094",
            600: "#a18072",
            700: "#977669", // Color del marco del logo
            800: "#846358",
            900: "#43302b",
          },
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Georgia", "Times New Roman", "serif"],
      },
      boxShadow: {
        pabellon:
          "0 10px 25px -3px rgba(245, 158, 11, 0.2), 0 4px 6px -2px rgba(245, 158, 11, 0.1)",
        "pabellon-lg":
          "0 20px 40px -4px rgba(245, 158, 11, 0.3), 0 8px 16px -4px rgba(245, 158, 11, 0.2)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.6s ease-out",
        "bounce-gentle": "bounceGentle 2s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        bounceGentle: {
          "0%, 20%, 50%, 80%, 100%": {
            transform: "translateY(0)",
          },
          "40%": {
            transform: "translateY(-5px)",
          },
          "60%": {
            transform: "translateY(-3px)",
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
