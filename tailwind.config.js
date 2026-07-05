/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'rgb(1,2,8)',
        accent: 'rgb(255,128,74)',
        'text-white': 'rgb(255,255,255)',
        muted: 'rgb(203,203,203)',
        brd: 'rgba(255,255,255,0.08)',
        'card-bg': 'rgba(255,255,255,0.03)',
      },
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
