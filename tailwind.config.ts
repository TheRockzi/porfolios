import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'neon-green': '#00ff41',
        'neon-red': '#ff003c',
        'neon-blue': '#0984e3',
        'dark-bg': '#121212',
        'card-bg': 'rgba(16, 16, 16, 0.8)',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      transitionTimingFunction: {
        'custom-bezier': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 800ms infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
};

export default config;