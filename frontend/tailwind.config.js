/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
                primary: {
          50: '#f6f6f6',
          100: '#e7e7e7',
          200: '#d1d1d1',
          300: '#b0b0b0',
          400: '#888888',
          500: '#6d6d6d',
          600: '#5d5d5d',
          700: '#4f4f4f',
          800: '#454545',
          900: '#3d3d3d',
          950: '#1a1a1a', // custom brand dark
        },
        accent: {
          50: '#fdf3f3',
          100: '#fbe5e5',
          200: '#f7cfcf',
          300: '#f2adad',
          400: '#e67d7d',
          500: '#d65151',
          600: '#c13939',
          700: '#a22d2d',
          800: '#862727',
          900: '#702525',
          950: '#3d0f0f',
        },
        brandRed: '#901c1d',
        brandDarkRed: '#580202',
        brandDark: '#121212',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
