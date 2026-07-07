/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0E0E10",
        volt: "#D4FF3D",
        bone: "#F5F3EF",
        rust: "#FF4D2E",
        slate: "#5A5A5F",
      },
      fontFamily: {
        display: ["Archivo Black", "Arial Black", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
