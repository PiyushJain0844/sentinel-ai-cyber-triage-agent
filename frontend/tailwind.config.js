/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
<<<<<<< HEAD
        page: {
          bg: "#F7F0EC",
          light: "#FBF6F2",
        },
        surface: {
          DEFAULT: "rgba(255, 250, 246, 0.54)",
          strong: "#F1E5DE",
          border: "rgba(255, 255, 255, 0.82)",
        },
        bronze: {
          DEFAULT: "#95613F",
          deep: "#75482D",
          soft: "#B7835B",
          dark: "#684631",
          gold: "#E29B63",
        },
        peach: {
          DEFAULT: "#F7D8C7",
          light: "#FCE8DC",
          soft: "#FCEEE5",
        },
        ink: {
          DEFAULT: "#202020",
          muted: "#5E5855",
          faint: "#8D8580",
        },
=======
>>>>>>> 0411107271d51a7da0d5920148bf2c96e305b40d
        sentinel: {
          bg: "#080D18",
          secondary: "#0D1422",
          card: "#141E2E",
          cardHover: "#192538",
          elevated: "#192538",
          border: "#1E2B42",
          borderLight: "#24344D",
          accent: "#38BDF8",
          accentHover: "#0EA5E9",
          success: "#22C55E",
          warning: "#F59E0B",
          danger: "#EF4444",
          critical: "#EF4444",
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
