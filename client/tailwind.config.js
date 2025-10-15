/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff1f5',
          100: '#ffe4ec',
          200: '#fecdd8',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
        },
      },
      fontFamily: {
        hand: ['"Segoe Script"', 'cursive'],
      },
    },
  },
  plugins: [],
}
