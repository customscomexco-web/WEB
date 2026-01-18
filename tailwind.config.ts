import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f2f5',
          100: '#b3d9e3',
          200: '#80c0d1',
          300: '#4da7bf',
          400: '#1a8ead',
          500: '#006d8c', // azul petróleo principal
          600: '#005a73',
          700: '#00475a',
          800: '#003441',
          900: '#002128',
        },
        secondary: {
          50: '#e6f0f5',
          100: '#b3d1e0',
          200: '#80b2cb',
          300: '#4d93b6',
          400: '#1a74a1',
          500: '#00558c', // azul profundo
          600: '#004573',
          700: '#00355a',
          800: '#002541',
          900: '#001528',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config

