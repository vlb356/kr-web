/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // KR Animations
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.25s ease-in",
      },

      // KR brand colors (puedes ajustarlos cuando quieras)
      colors: {
        krblue: "#1662A6",
        krorange: "#E96F19",
        krdark: "#122944",
      },

      // Sombra profesional
      boxShadow: {
        card: "0 4px 20px rgba(0,0,0,0.06)",
      },

      // Tipografías opcionales (si las usas)
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
