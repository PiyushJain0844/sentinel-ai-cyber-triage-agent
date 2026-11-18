/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sentinel: {
          bg: "#080D18",
          secondary: "#101827",
          card: "#151F30",
          cardHover: "#1A273D",
          border: "#1E293B",
          accent: "#38BDF8",
          accentHover: "#0EA5E9",
          success: "#22C55E",
          warning: "#F59E0B",
          danger: "#EF4444",
          textPrimary: "#F8FAFC",
          textSecondary: "#94A3B8",
          textMuted: "#64748B"
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace']
      }
    },
  },
  plugins: [],
}
