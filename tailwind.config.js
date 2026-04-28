/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './*.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        nomad: {
          black:   '#0A0A0A',
          dark:    '#1C1B1A',
          base:    '#FAFAFA',
          cream:   '#F5F5F0',
          white:   '#FFFFFF',
          pink:    '#FF1B8D',
          magenta: '#E91E8C',
          coral:   '#FF6B6B',
          peach:   '#FFB4A2',
          accent:  '#7D7671',
        },
      },
      fontFamily: {
        sans:    ['IBM Plex Sans', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        serif:   ['Newsreader', 'Georgia', 'serif'],
        display: ['IBM Plex Sans', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        mono:    ['JetBrains Mono', 'ui-monospace', 'monospace'],
        tech:    ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      animation: {
        'slow-zoom':     'slowZoom 20s infinite alternate ease-in-out',
        'fade-in-up':    'fadeInUp 1s ease-out forwards',
        'shake':         'shake 0.4s cubic-bezier(.36,.07,.19,.97) both',
        'pulse-soft':    'pulseSoft 2s ease-in-out infinite',
        'float':         'float 6s ease-in-out infinite',
        'gradient-shift':'gradientShift 8s ease infinite',
      },
      keyframes: {
        slowZoom: {
          '0%':   { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1.15)' },
        },
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shake: {
          '0%, 100%':   { transform: 'translateX(0)' },
          '20%, 60%':   { transform: 'translateX(-5px)' },
          '40%, 80%':   { transform: 'translateX(5px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.5' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
};
