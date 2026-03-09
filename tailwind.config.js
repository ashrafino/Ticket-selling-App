/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#0B0E14',
          50: '#1A1D28',
          100: '#12151E',
          200: '#1E2130',
          300: '#252838',
        },
        accent: {
          DEFAULT: '#7c5cfc',
          light: '#9b85fd',
          muted: 'rgba(124,92,252,0.15)',
        },
        amber: {
          DEFAULT: '#e0943a',
          light: '#f0a84f',
          muted: 'rgba(224,148,58,0.15)',
        },
        mint: {
          DEFAULT: '#3ecf8e',
          muted: 'rgba(62,207,142,0.15)',
        },
        danger: {
          DEFAULT: '#f75555',
          muted: 'rgba(247,85,85,0.12)',
        },
        muted: '#8B8B9E',
        subtle: '#4A4A5A',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
