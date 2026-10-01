/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF6B00",
        "primary-hover": "#E65D00",
        background: "#F8F9FA",
        foreground: "#0A0A0A",
      },
      fontFamily: {
        heading: ["Montserrat", "sans-serif"],
        body: ["Outfit", "sans-serif"],
      },
    },
  },
  plugins: [],
}
