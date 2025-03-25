/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js,ts,jsx,tsx}',
    './index.html',
    './dist/**/*.html'
  ],
  theme: {
    extend: {
      colors: {
        polygon: {
          purple: 'var(--polygon-purple)',
          dark: 'var(--polygon-dark)',
          light: 'var(--polygon-light)',
          ultralight: 'var(--polygon-ultralight)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 15px rgba(130, 71, 229, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 3s infinite',
      },
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      cursor: ['disabled'],
      backgroundColor: ['active', 'disabled'],
      textColor: ['active', 'disabled'],
    },
  },
  plugins: [],
};
