/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    /* centre every page and give side-padding */
    container: { center: true, padding: "1rem" },

    extend: {
      /* global font family */
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
      /* brand colours */
      colors: {
        primary: "#2563EB",  // Koala blue
        accent:  "#F97316",  // accent orange
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
