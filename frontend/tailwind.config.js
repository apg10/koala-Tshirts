/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    container: { center: true, padding: "1rem" },
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        body: ["Inter", "system-ui", "sans-serif"]
      },
      colors: {
        primary: "#000000",
        secondary: "#FFFFFF",
        accent: "#C30000",
        neutral: {
          100: "#F5F5F5",
          200: "#E5E5E5",
          300: "#D5D5D5",
          400: "#A5A5A5",
          500: "#555555",
          600: "#444444",
          700: "#333333",
          800: "#222222",
          900: "#111111"
        }
      },
      spacing: {
        4: "1rem",
        8: "2rem",
        12: "3rem",
        16: "4rem",
        20: "5rem"
      }
    }
  },
  safelist: ["animate-fade-in-out"],
  plugins: [],
};
