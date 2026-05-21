/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0B1020',
        surface: '#121826',
        surfaceStrong: '#161D2D',
        glow: '#6D5BFF',
      },
      borderRadius: {
        xl: '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
      boxShadow: {
        soft: '0 25px 80px rgba(9, 12, 20, 0.45)',
        glow: '0 0 30px rgba(109, 91, 255, 0.35)',
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(circle at 20% 20%, rgba(109, 91, 255, 0.35), transparent 55%), radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.35), transparent 50%)',
      },
    },
  },
  plugins: [],
};
