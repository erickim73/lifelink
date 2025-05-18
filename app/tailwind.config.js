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
      // Added animation configuration here inside theme.extend
      animation: {
        rotate: 'rotate 3s linear infinite',
      },
      // Added keyframes configuration here inside theme.extend
      keyframes: {
        rotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}