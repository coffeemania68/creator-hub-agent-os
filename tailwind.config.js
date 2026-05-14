/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#ffffff',
          base: '#f4fbf8',
          low: '#eef5f2',
          container: '#e8efec',
          high: '#e2eae7',
          highest: '#dde4e1',
        },
        ink: {
          DEFAULT: '#161d1b',
          muted: '#3c4a46',
          soft: '#6b7a76',
        },
        line: '#bacac5',
        primary: {
          DEFAULT: '#006b5f',
          action: '#2dd4bf',
          soft: '#e4fbf7',
        },
        secondary: {
          DEFAULT: '#006c49',
          action: '#10b981',
          soft: '#e7fff4',
        },
        danger: {
          DEFAULT: '#ba1a1a',
          soft: '#ffdad6',
        },
        accent: {
          DEFAULT: '#b8794b',
          soft: '#fff2e7',
          peach: '#f3c7ad',
          sand: '#e8c7a1',
          amber: '#d8a766',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Pretendard', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        ambient: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)',
        lift: '0 10px 15px -3px rgba(45, 212, 191, 0.12), 0 4px 6px -2px rgba(0,0,0,0.05)',
        warm: '0 10px 28px -16px rgba(184, 121, 75, 0.45)',
      },
    },
  },
  plugins: [],
};
