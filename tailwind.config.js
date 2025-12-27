/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: { '2xl': '1280px' },
    },
    extend: {
      colors: {
        'page-dark': '#050A1F',
        'page-light': '#F0F4FA',
        'glass-dark': 'rgba(13, 25, 48, 0.6)',
        'glass-light': 'rgba(255, 255, 255, 0.65)',
        'glass-hover-dark': 'rgba(20, 35, 65, 0.7)',
        'glass-hover-light': 'rgba(255, 255, 255, 0.8)',
        'border-glass-dark': 'rgba(255, 255, 255, 0.1)',
        'border-glass-light': 'rgba(255, 255, 255, 0.4)',
        'text-primary-dark': '#F0F4FF',
        'text-primary-light': '#0F172A',
        'text-secondary-dark': '#94A3B8',
        'text-secondary-light': '#475569',
        cyan: { 500: '#06B6D4', 600: '#0891B2' },
        royal: { 500: '#3B82F6', 600: '#2563EB' },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backdropBlur: { glass: '16px', 'glass-lg': '24px' },
      borderRadius: { glass: '16px', 'glass-lg': '24px' },
      animation: {
        'float': 'float 20s ease-in-out infinite',
        'float-delayed': 'float 25s ease-in-out infinite 5s',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
        },
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
