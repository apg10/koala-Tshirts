/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],

  /* ⬇️  mantén tus extensiones */
  theme: {
    container: { center: true, padding: "1rem" },
    extend: {
      fontFamily: { sans: ["Inter", "ui-sans-serif", "system-ui"] },
      colors: { primary: "#2563EB", accent: "#F97316" },
    },
  },

  /* 👉 safelist para la clase de animación */
  safelist: ["animate-fade-in-out"],

  plugins: [],
};
