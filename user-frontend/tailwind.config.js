/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sand: '#DAC6AB',
        plum: '#582045',
        navy: '#002147',
        teal: '#255A60',
      },
      fontFamily: {
        sans: [
          'Gotham',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
        heading: ['Reborn', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
