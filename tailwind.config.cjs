const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      mono: ['JetBrainsMono', ...defaultTheme.fontFamily.mono],
    },
    extend: {
      colors: {
        'very-dark-grey': 'hsl(var(--very-dark-grey) / <alpha-value>)',
        'dark-grey': 'hsl(var(--dark-grey) / <alpha-value>)',
        grey: 'hsl(var(--grey) / <alpha-value>)',
        'almost-white': 'hsl(var(--almost-white) / <alpha-value>)',
        'neon-green': 'hsl(var(--neon-green) / <alpha-value>)',
        red: 'hsl(var(--red) / <alpha-value>)',
        orange: 'hsl(var(--orange) / <alpha-value>)',
        yellow: 'hsl(var(--yellow) / <alpha-value>)',
      },
      fontSize: {
        base: ['1.125rem', defaultTheme.spacing[6]],
        md: [defaultTheme.spacing[6], defaultTheme.spacing[8]],
        lg: [defaultTheme.spacing[8], defaultTheme.spacing[11]],
      },
    },
  },
  plugins: [],
};
