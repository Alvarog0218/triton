/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./main.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        // Keeping custom colors if we need to extend the palette beyond default Tailwind
      }
    },
  },
  plugins: [],
}
