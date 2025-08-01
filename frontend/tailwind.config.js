/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      // الألوان المخصصة للتطبيق
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        }
      },
      
      // الخطوط المخصصة
      fontFamily: {
        'arabic': ['Tahoma', 'Arial', 'Segoe UI', 'sans-serif'],
        'english': ['Inter', 'Segoe UI', 'Arial', 'sans-serif'],
      },
      
      // الأحجام المخصصة
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      
      // الظلال المخصصة
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'flashcard': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      
      // التحريك المخصص
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'flip': 'flip 0.6s ease-out',
      },
      
      // الحركات المخصصة
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        flip: {
          '0%': { transform: 'rotateY(0)' },
          '100%': { transform: 'rotateY(180deg)' },
        }
      },
      
      // التدرجات المخصصة
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'gradient-success': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'gradient-learning': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      },
      
      // الشبكة المخصصة
      gridTemplateColumns: {
        'auto-fit': 'repeat(auto-fit, minmax(300px, 1fr))',
        'auto-fill': 'repeat(auto-fill, minmax(250px, 1fr))',
      },
      
      // نقاط التوقف المخصصة للشاشات
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
    },
  },
  plugins: [
    // إضافة plugins مفيدة لتطبيق تعليم اللغات
    function({ addUtilities, addComponents, theme }) {
      // أدوات مخصصة للنصوص
      addUtilities({
        '.text-gradient': {
          'background': 'linear-gradient(45deg, #667eea, #764ba2)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.flip-card': {
          'transform-style': 'preserve-3d',
          'perspective': '1000px',
        },
        '.flip-card-inner': {
          'position': 'relative',
          'width': '100%',
          'height': '100%',
          'text-align': 'center',
          'transition': 'transform 0.6s',
          'transform-style': 'preserve-3d',
        },
        '.flip-card-front, .flip-card-back': {
          'position': 'absolute',
          'width': '100%',
          'height': '100%',
          '-webkit-backface-visibility': 'hidden',
          'backface-visibility': 'hidden',
        },
        '.flip-card-back': {
          'transform': 'rotateY(180deg)',
        },
        '.arabic-text': {
          'direction': 'rtl',
          'text-align': 'right',
          'font-family': theme('fontFamily.arabic'),
        },
        '.english-text': {
          'direction': 'ltr',
          'text-align': 'left',
          'font-family': theme('fontFamily.english'),
        }
      });

      // مكونات مخصصة
      addComponents({
        '.btn-primary': {
          '@apply bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200': {},
        },
        '.btn-secondary': {
          '@apply bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200': {},
        },
        '.card': {
          '@apply bg-white rounded-lg shadow-card p-6': {},
        },
        '.card-hover': {
          '@apply transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1': {},
        },
        '.input-primary': {
          '@apply w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500': {},
        },
        '.flashcard-container': {
          '@apply relative w-full h-64 perspective-1000': {},
        },
        '.quiz-option': {
          '@apply p-4 border-2 border-gray-200 rounded-lg cursor-pointer transition-all duration-200 hover:border-blue-300 hover:bg-blue-50': {},
        },
        '.quiz-option-selected': {
          '@apply border-blue-500 bg-blue-100 text-blue-800': {},
        },
        '.quiz-option-correct': {
          '@apply border-green-500 bg-green-100 text-green-800': {},
        },
        '.quiz-option-incorrect': {
          '@apply border-red-500 bg-red-100 text-red-800': {},
        }
      });
    }
  ],
  // إعدادات الوضع المظلم (يمكن تفعيلها لاحقاً)
  darkMode: 'class',
}