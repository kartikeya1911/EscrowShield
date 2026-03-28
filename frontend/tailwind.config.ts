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
          950: "#0a101c"
        },
        brand: {
          DEFAULT: "#22d3ee",
          foreground: "#041019",
          soft: "#e6fbff"
        },
        accent: {
          DEFAULT: "#c084fc",
          foreground: "#f8edff"
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
