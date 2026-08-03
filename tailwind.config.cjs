/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        teal: { 900: '#0E3B36', 700: '#1B5E52', 500: '#2D7A6B' },
        gold: { DEFAULT: '#C8962C', dark: '#9C7320' },
        sand: '#F3ECD9',
        cream: '#FAF6EC',
        ink: { DEFAULT: '#1F2A28', muted: '#6B6358' },
        border: '#E3D9BE',
      },
      fontFamily: {
        arabic: ['Amiri', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
