/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)'],
        poppins: ['var(--font-poppins)'],
        playfair: ['var(--font-playfairDisplay)'],
      },
    },
  },
  plugins: [],
}
