import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0A1220",
        panel: "#111B2E",
        border: "#1F2C45",
        primary: "#4DA3FF",
        accent2: "#6EE7F0",
        whatsapp: "#25D366",
        text: "#FFFFFF",
        soft: "rgba(255,255,255,0.72)",
        softer: "rgba(255,255,255,0.50)",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "Segoe UI", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
