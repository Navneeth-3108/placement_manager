/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0f172a',
        mist: '#f8fafc',
        coral: '#f97316',
        fern: '#16a34a',
        ocean: '#0ea5e9',
      },
      boxShadow: {
        card: '0 10px 30px -15px rgba(15, 23, 42, 0.35)',
      },
    },
  },
  plugins: [],
};
