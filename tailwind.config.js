// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        black: '#000000',
        gray: {
          900: '#121212',
          800: '#1E1E1E',
          700: '#2C2C2C',
          600: '#383838',
          500: '#4A4A4A',
          400: '#5C5C5C',
          300: '#6E6E6E',
          200: '#8A8A8A',
          100: '#A6A6A6',
          50: '#C2C2C2',
        },
        white: '#FFFFFF',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '16px',
        '2xl': '24px',
      },
      spacing: {
        '42p': '42%',
        '45p': '45%',
      },
    },
  },
  plugins: [],
};
