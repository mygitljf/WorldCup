import type { Config } from "tailwindcss"

const config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        pitch: "#0d2419",
        turf: "#17633f",
        lime: "#b7ff5a",
        cream: "#f6efe1",
        clay: "#d56f3e",
        ink: "#101512",
      },
      boxShadow: {
        panel: "0 22px 80px rgba(4, 18, 12, 0.22)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config

export default config
