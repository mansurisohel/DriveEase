/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs':  '380px',
      'sm':  '640px',
      'md':  '768px',
      'lg':  '1024px',
      'xl':  '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        primary: {
          50:  '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
          950: '#172554',
          DEFAULT: '#2563EB',
        },
        accent: {
          50:  '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
          DEFAULT: '#F97316',
        },
        dark: {
          DEFAULT: '#0a1628',
          800: '#1E293B',
          700: '#334155',
          600: '#475569',
        },
      },
      fontFamily: {
        display: ['"Outfit"', 'sans-serif'],
        logo:    ['"Exo 2"', 'sans-serif'],
        body:    ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
      },
      animation: {
        'fade-in':       'fadeIn 0.35s ease-out',
        'slide-up':      'slideUp 0.5s ease-out',
        'slide-in-right':'slideInRight 0.3s ease-out',
        'skeleton':      'skeleton 1.8s ease-in-out infinite',
        'float':         'float 4s ease-in-out infinite',
        'pulse-slow':    'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn:       { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp:      { '0%': { opacity: '0', transform: 'translateY(24px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideInRight: { '0%': { opacity: '0', transform: 'translateX(16px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        skeleton:     { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.4' } },
        float:        { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
      },
      boxShadow: {
        'card':      '0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.06)',
        'card-hover':'0 4px 8px rgba(0,0,0,0.05), 0 16px 40px rgba(0,0,0,0.12)',
        'nav':       '0 2px 24px rgba(0,0,0,0.08)',
        'glow':      '0 0 32px rgba(37,99,235,0.25)',
        'inner-sm':  'inset 0 1px 3px rgba(0,0,0,0.06)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
