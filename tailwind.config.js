/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Премиальная пастельно-глубокая палитра
        ink: {
          50:  '#F8F9FA',
          100: '#EEF0F3',
          200: '#DDE2E8',
          300: '#B9C0CA',
          500: '#5B6473',
          700: '#2E3540',
          900: '#0F1419',
        },
        // Глубокий благородный синий — Байкал / небо
        baikal: {
          50:  '#EEF4FB',
          100: '#D7E5F4',
          300: '#7FA6D1',
          500: '#3A6FA8',
          700: '#1F4A7A',
          900: '#0F2A48',
        },
        // Мягкое золото / песок
        sand: {
          50:  '#FBF6EC',
          100: '#F4E9D1',
          300: '#E2C788',
          500: '#C9A24E',
          700: '#8E6A28',
        },
        // Приглушённый бирюзовый
        teal: {
          50:  '#EBF6F5',
          300: '#7FBDB8',
          500: '#3F8E89',
          700: '#1F605C',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['"Manrope"', '"Inter"', 'system-ui', 'sans-serif'],
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
      },
      borderRadius: {
        xl: '14px',
        '2xl': '18px',
        '3xl': '24px',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(15,20,25,0.04), 0 8px 24px rgba(15,20,25,0.06)',
        lift: '0 4px 12px rgba(15,20,25,0.08), 0 24px 48px rgba(15,20,25,0.10)',
        ring: '0 0 0 1px rgba(31,74,122,0.12)',
      },
      backdropBlur: {
        xs: '2px',
      },
      transitionTimingFunction: {
        'out-soft': 'cubic-bezier(0.22, 0.61, 0.36, 1)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'pop': {
          '0%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.25)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s cubic-bezier(0.22, 0.61, 0.36, 1) both',
        'pop': 'pop 0.4s ease-out',
      },
    },
  },
  plugins: [],
};
