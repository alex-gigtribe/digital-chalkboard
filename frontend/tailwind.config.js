// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Colors from Adagin Theme Pack
      colors: {
        background: "#DAE8C8",        // Neutral grey/white – cards, panels
        primary: "#5a7784",           // Adagin Light Blue – buttons, primary elements
        success: "#a4cc4c",           // KPI accent green
        navy: "#284350",              // Text, headers, icons
        danger: "#E63946",            // Alerts / error
        "disabled-bg": "#CCCCCC",     // Disabled backgrounds
        "disabled-text": "#888888",   // Disabled text
      },

      // Typography (Arial Nova family with fallbacks)
      fontFamily: {
        sans: ["'Arial Nova'", "Arial", "Helvetica", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      // Sizes per spec
      fontSize: {
        header: ["24px", { lineHeight: "32px", fontWeight: "700" }], // 24–32px headers
        body:   ["16px", { lineHeight: "24px", fontWeight: "400" }], // 14–16px body → pick 16
        label:  ["14px", { lineHeight: "20px", fontWeight: "500" }], // labels/buttons
        data:   ["16px", { lineHeight: "24px", fontWeight: "600" }], // data/insights
      },

      // Corners & shadows (Apple-like, soft)
      borderRadius: {
        sm: "6px",  // Buttons
        md: "8px",  // Cards/Panels
      },
      boxShadow: {
        subtle: "0 2px 4px rgba(0,0,0,0.06)", // Soft depth
      },

      //  Layout system
      spacing: {
        card: "16px",   // Card padding
        layout: "24px", // Page margin
        gutter: "16px", // Grid gutter
      },
      // Tailwind already has grid-cols-12; this alias keeps it explicit
      gridTemplateColumns: {
        12: "repeat(12, minmax(0, 1fr))",
      },
      maxWidth: {
        container: "1440px",
      },
    },
  },
  plugins: [],
};
