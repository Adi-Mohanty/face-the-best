/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1e1e8a",

        "background-light": "#f6f6f8",
        "background-dark": "#121220",

        "success-bg": "#f0fdf4",
        "success-border": "#22c55e",

        "error-bg": "#fef2f2",
        "error-border": "#ef4444",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    // require("@tailwindcss/container-queries"),
    // require("@tailwindcss/typography"),
  ],
};
