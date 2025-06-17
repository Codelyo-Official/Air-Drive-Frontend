/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Enhanced amber palette with darker variants
        amber: {
          50: "#1f1a0a", // Very dark amber for deep backgrounds
          100: "#2d2510", // Dark amber
          200: "#4a3a1a", // Medium dark amber
          300: "#f59e0b", // Bright amber (kept for accents)
          400: "#fbbf24", // Light amber accent
          500: "#f97316", // Main orange
          600: "#ea580c", // Darker orange
          700: "#c2410c", // Deep orange
          800: "#9a3412", // Very deep orange
          900: "#7c2d12", // Darkest orange
          950: "#431407", // Ultra dark orange
        },
        
        // Dark theme semantic colors
        border: "hsl(210 40% 15%)", // Dark gray border
        input: "hsl(210 40% 12%)", // Dark input background
        ring: "hsl(25 95% 53%)", // Orange ring color
        background: "hsl(220 27% 10%)", // Changed from 6% to 10% for a slightly lighter dark background
        foreground: "hsl(210 40% 95%)", // Light text
        
        primary: {
          DEFAULT: "hsl(25 95% 53%)", // Orange as primary
          foreground: "hsl(220 27% 10%)", // Changed to match new background color
        },
        secondary: {
          DEFAULT: "hsl(210 40% 12%)", // Dark secondary
          foreground: "hsl(210 40% 95%)", // Light text on secondary
        },
        destructive: {
          DEFAULT: "hsl(0 84% 45%)", // Dark red for errors
          foreground: "hsl(210 40% 95%)", // Light text on red
        },
        muted: {
          DEFAULT: "hsl(210 40% 10%)", // Very muted dark
          foreground: "hsl(210 40% 65%)", // Muted light text
        },
        accent: {
          DEFAULT: "hsl(210 40% 15%)", // Subtle accent dark
          foreground: "hsl(210 40% 95%)", // Light text on accent
        },
        popover: {
          DEFAULT: "hsl(220 27% 8%)", // Dark popover background
          foreground: "hsl(210 40% 95%)", // Light popover text
        },
        card: {
          DEFAULT: "hsl(220 27% 8%)", // Dark card background
          foreground: "hsl(210 40% 95%)", // Light card text
        },
        
        // Additional dark theme colors
        slate: {
          950: "hsl(220 27% 4%)", // Ultra dark slate
        },
        gray: {
          950: "hsl(210 40% 4%)", // Ultra dark gray
        },
        // --- Added Off-White/Cream Color ---
        cream: '#F8F8F8', // A soft, very light off-white/cream
        // ------------------------------------
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        hover: "0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)",
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.2)",
        // New dark-themed shadows
        glow: "0 0 20px rgba(249, 115, 22, 0.3)", // Orange glow effect
        "dark-lg": "0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 10px 10px -5px rgba(0, 0, 0, 0.4)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-in": "slideIn 0.3s ease-out",
        "bounce-in": "bounceIn 0.6s ease-out",
        // New dark theme animations
        "glow-pulse": "glowPulse 2s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        bounceIn: {
          "0%": { transform: "scale(0.3)", opacity: "0" },
          "50%": { transform: "scale(1.05)" },
          "70%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        // New glow animation for dark theme
        glowPulse: {
          "0%": { boxShadow: "0 0 5px rgba(249, 115, 22, 0.3)" },
          "100%": { boxShadow: "0 0 20px rgba(249, 115, 22, 0.6)" },
        },
      },
      screens: {
        xs: "475px",
        xlg: "1440px"
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};