/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1B2F5E',
        },
        accent: {
          DEFAULT: '#FF6B00',
        },
        success: {
          DEFAULT: '#1A6B3A',
        },
        lightBg: '#F8F9FC',
        darkBg: '#0D1B3E',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}