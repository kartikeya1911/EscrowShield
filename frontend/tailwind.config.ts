import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        slate: {
          950: "#0b0d0c"
        },
        brand: {
          DEFAULT: "#16a34a",
          foreground: "#f0fdf4"
        },
        accent: {
          DEFAULT: "#f97316",
          foreground: "#fff7ed"
        }
      },
      fontFamily: {
        heading: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-manrope)", "sans-serif"]
      },
      boxShadow: {
        card: "0 6px 24px rgba(0, 0, 0, 0.08)",
        cardDark: "0 10px 28px rgba(0, 0, 0, 0.35)"
      }
    }
  },
  plugins: []
};

export default config;
