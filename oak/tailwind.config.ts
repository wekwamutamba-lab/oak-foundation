import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        oak: {
          navy: "var(--oak-navy)",
          "navy-dark": "var(--oak-navy-dark)",
          "navy-light": "var(--oak-navy-light)",
          blue: "var(--oak-blue-glow)",
          green: "var(--oak-accent-green)",
          red: "var(--oak-accent-red)",
          canvas: "var(--oak-canvas)",
          surface: "var(--oak-surface)",
          field: "var(--oak-field)",
          border: "var(--oak-border)",
          text: "var(--oak-text)",
          muted: "var(--oak-muted)",
        },
      },
      borderRadius: {
        "oak-card": "var(--oak-radius-card)",
        "oak-btn": "var(--oak-radius-button)",
        "oak-input": "var(--oak-radius-input)",
      },
    },
  },
  plugins: [],
};

export default config;