import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'cl-blue': {
          100: 'rgb(var(--color-cl-blue-100) / <alpha-value>)',
          500: 'rgb(var(--color-cl-blue-500) / <alpha-value>)',
          700: 'rgb(var(--color-cl-blue-700) / <alpha-value>)',
          800: 'rgb(var(--color-cl-blue-800) / <alpha-value>)',
        },
        'cl-pink': {
          100: 'rgb(var(--color-cl-pink-100) / <alpha-value>)',
          500: 'rgb(var(--color-cl-pink-500) / <alpha-value>)',
          700: 'rgb(var(--color-cl-pink-700) / <alpha-value>)',
          800: 'rgb(var(--color-cl-pink-800) / <alpha-value>)',
        },
        'cl-lime': {
          100: 'rgb(var(--color-cl-lime-100) / <alpha-value>)',
          500: 'rgb(var(--color-cl-lime-500) / <alpha-value>)',
          700: 'rgb(var(--color-cl-lime-700) / <alpha-value>)',
        },
        'cl-mint': {
          100: 'rgb(var(--color-cl-mint-100) / <alpha-value>)',
          500: 'rgb(var(--color-cl-mint-500) / <alpha-value>)',
          700: 'rgb(var(--color-cl-mint-700) / <alpha-value>)',
        },

        cream: {
          50:  'rgb(var(--color-cream-50)  / <alpha-value>)',
          100: 'rgb(var(--color-cream-100) / <alpha-value>)',
        },

        ink: {
          50:  'rgb(var(--color-ink-50)  / <alpha-value>)',
          100: 'rgb(var(--color-ink-100) / <alpha-value>)',
          200: 'rgb(var(--color-ink-200) / <alpha-value>)',
          300: 'rgb(var(--color-ink-300) / <alpha-value>)',
          400: 'rgb(var(--color-ink-400) / <alpha-value>)',
          600: 'rgb(var(--color-ink-600) / <alpha-value>)',
          900: 'rgb(var(--color-ink-900) / <alpha-value>)',
        },

        'cl-success': 'rgb(var(--color-success-500) / <alpha-value>)',
        'cl-warning': 'rgb(var(--color-warning-500) / <alpha-value>)',
        'cl-danger': {
          500: 'rgb(var(--color-danger-500) / <alpha-value>)',
          700: 'rgb(var(--color-danger-700) / <alpha-value>)',
        },
        'cl-info':    'rgb(var(--color-info-500)    / <alpha-value>)',

        surface:              'rgb(var(--color-cream-50)    / <alpha-value>)',
        'surface-card':       'rgb(var(--color-cream-card)  / <alpha-value>)',
        'text-primary':       'rgb(var(--color-ink-900)     / <alpha-value>)',
        'text-secondary':     'rgb(var(--color-ink-600)     / <alpha-value>)',
        'text-muted':         'rgb(var(--color-ink-400)     / <alpha-value>)',
        interactive:          'rgb(var(--color-cl-blue-700) / <alpha-value>)',
        'interactive-hover':  'rgb(var(--color-cl-blue-800) / <alpha-value>)',
        'interactive-subtle': 'rgb(var(--color-cl-blue-100) / <alpha-value>)',
        'interactive-alt':    'rgb(var(--color-cl-pink-700) / <alpha-value>)',
        'border-subtle':      'rgb(var(--color-ink-100)     / <alpha-value>)',
        'border-default':     'rgb(var(--color-ink-200)     / <alpha-value>)',
        'border-strong':      'rgb(var(--color-ink-400)     / <alpha-value>)',
        'border-focus':       'rgb(var(--color-cl-blue-700) / <alpha-value>)',

        overlay: {
          hover:    'rgb(var(--_overlay-hover))',
          active:   'rgb(var(--_overlay-active))',
          selected: 'rgb(var(--_overlay-selected))',
        },
      },

      fontFamily: {
        display: ['var(--font-display)'],
        ui:      ['var(--font-ui)'],
        body:    ['var(--font-body)'],
        accent:  ['var(--font-accent)'],
        code:    ['var(--font-mono)'],
      },

      transitionDuration: {
        fast: 'var(--motion-duration-fast)',
        base: 'var(--motion-duration-base)',
        slow: 'var(--motion-duration-slow)',
      },

      boxShadow: {
        card: 'var(--shadow-card)',
        'card-hover': 'var(--shadow-card-hover)',
      },

      keyframes: {
        'bean-bob': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
        'cl-fade-up': {
          'from': { opacity: '0', transform: 'translateY(16px)' },
          'to':   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'bean-bob':   'bean-bob 4.5s ease-in-out infinite',
        'cl-fade-up': 'cl-fade-up 700ms cubic-bezier(0.22, 1, 0.36, 1) 80ms both',
      },
    },
  },
  plugins: [],
}

export default config
