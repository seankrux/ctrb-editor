/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Nebula Dark Theme (Default)
        background: {
          DEFAULT: '#0f172a',
          light: '#f8fafc',
        },
        surface: {
          DEFAULT: '#1e293b',
          light: '#ffffff',
        },
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        // Nebula accent colors
        accent: {
          purple: '#a855f7',
          pink: '#ec4899',
          cyan: '#06b6d4',
          blue: '#3b82f6',
          indigo: '#6366f1',
        },
        // Campaign type colors
        campaign: {
          gsearch: 'rgba(59, 130, 246, 0.2)',
          gmap: 'rgba(16, 185, 129, 0.2)',
          refdvisit: 'rgba(245, 158, 11, 0.2)',
          directvisit: 'rgba(99, 102, 241, 0.2)',
          gsearchref: 'rgba(236, 72, 153, 0.2)',
        },
      },
      backgroundImage: {
        'nebula-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'nebula-radial': 'radial-gradient(ellipse at center, #4c1d95 0%, #0f172a 100%)',
        'cosmic-grid': `
          linear-gradient(rgba(139, 92, 246, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(139, 92, 246, 0.05) 1px, transparent 1px)
        `,
        'stars': `
          radial-gradient(2px 2px at 20px 30px, #ffffff, rgba(0,0,0,0)),
          radial-gradient(2px 2px at 40px 70px, #ffffff, rgba(0,0,0,0)),
          radial-gradient(2px 2px at 50px 160px, #ffffff, rgba(0,0,0,0)),
          radial-gradient(2px 2px at 90px 40px, #ffffff, rgba(0,0,0,0)),
          radial-gradient(2px 2px at 130px 80px, #ffffff, rgba(0,0,0,0))
        `,
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(139, 92, 246, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.8)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      boxShadow: {
        'nebula': '0 0 30px rgba(139, 92, 246, 0.3)',
        'nebula-lg': '0 0 50px rgba(139, 92, 246, 0.4)',
        'glow': '0 0 20px rgba(139, 92, 246, 0.5)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
