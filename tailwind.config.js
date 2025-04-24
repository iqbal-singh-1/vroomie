/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'tire-rotate': 'tire 2s linear infinite',
      },
      keyframes: {
        tire: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      },
      boxShadow: {
        'neon-light': '0 0 5px theme(colors.blue.400), 0 0 20px theme(colors.blue.500)',
        'neon-dark': '0 0 5px theme(colors.purple.400), 0 0 20px theme(colors.purple.500)',
        '3d': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [],
};