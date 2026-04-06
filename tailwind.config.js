/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        palette: {
          background: 'var(--palette-background)',
          section: 'var(--palette-section)',
          card: 'var(--palette-card)',
          border: 'var(--palette-border)',
          text: {
            primary: 'var(--palette-text-primary)',
            secondary: 'var(--palette-text-secondary)',
          },
          accent: {
            primary: 'var(--palette-accent-primary)',
            secondary: 'var(--palette-accent-secondary)',
          },
          highlight: 'var(--palette-highlight)',
          success: 'var(--palette-success)',
        },
      },
    },
  },
  plugins: [],
};


