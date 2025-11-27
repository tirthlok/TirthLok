module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        // Semantic Colors (New Schema)
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
          light: 'var(--color-primary-light)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          hover: 'var(--color-secondary-hover)',
          light: 'var(--color-secondary-light)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          hover: 'var(--color-accent-hover)',
        },
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        muted: 'var(--color-surface-muted)',
        logo: 'var(--color-logo)',
        
        // Legacy Color Names (Mapped to Schema)
        'cream': 'var(--color-background)',
        'sage': 'var(--color-secondary)',
        'saffron': 'var(--color-primary)',
        'charcoal': 'var(--color-text-main)',
        'light-gray': 'var(--color-text-muted)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui'],
        serif: ['var(--font-serif)', 'ui-serif', 'Georgia'],
        display: ['var(--font-display)', 'var(--font-serif)'],
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
      },
      spacing: {
        'safe': 'max(1rem, env(safe-area-inset-bottom))',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
