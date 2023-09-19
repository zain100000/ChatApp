/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#9400FF',
        secondary: '#f57c00',
        light: '#fff',
        dark: '#000',
      },
    },
  },
  plugins: [],
};
