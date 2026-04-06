/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        palette: {
          background: '#FFF7FB',
          section: '#FDEEF5',
          card: '#FFFFFF',
          border: '#F3D6E4',
          text: {
            primary: '#3A2A33',
            secondary: '#7A6470',
          },
          accent: {
            primary: '#EC4899',
            secondary: '#F472B6',
          },
          highlight: '#FBCFE8',
          success: '#10B981',
        },
      },
    },
  },
  plugins: [],
};

