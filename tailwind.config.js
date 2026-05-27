/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'f1-dark': '#0A0E27',
        'f1-red': '#DC0000',
        'f1-gold': '#FFB81C',
        'f1-gray': '#1A1F3A',
      },
      fontFamily: {
        'mono': ['Courier New', 'monospace'],
      }
    },
  },
  plugins: [],
}
