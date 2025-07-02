/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6B5B95',
        secondary: '#88D8B0',
        accent: '#FFCC5C',
        surface: '#FFEAA7',
        background: '#FFF5E4',
        success: '#27AE60',
        warning: '#F39C12',
        error: '#E74C3C',
        info: '#3498DB'
      },
      fontFamily: {
        display: ['Fredoka One', 'cursive'],
        body: ['Plus Jakarta Sans', 'sans-serif']
      },
      animation: {
        bounce: 'bounce 0.15s ease-out',
        wiggle: 'wiggle 1s ease-in-out infinite',
        star: 'star 0.8s ease-out',
        glow: 'glow 2s ease-in-out infinite alternate'
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' }
        },
        star: {
          '0%': { transform: 'scale(0) rotate(0deg)', opacity: '0' },
          '50%': { transform: 'scale(1.2) rotate(180deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(360deg)', opacity: '1' }
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #FFCC5C' },
          '100%': { boxShadow: '0 0 20px #FFCC5C, 0 0 30px #FFCC5C' }
        }
      }
    },
  },
  plugins: [],
}