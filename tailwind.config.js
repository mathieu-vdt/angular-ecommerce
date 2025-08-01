import PrimeUI from 'tailwindcss-primeui';
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "node_modules/primeng/**/*.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [PrimeUI]
}