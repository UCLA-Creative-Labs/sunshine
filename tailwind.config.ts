import type { Config } from 'tailwindcss'

/**
 * Tailwind v3 config — STRICTLY ADDITIVE.
 *
 * Rule: never define an `extend.*` key that matches a Tailwind default key,
 * because `extend` merges on top of defaults — same key = silent override.
 *
 * Keys we add:
 *   - colors.cl-*, colors.cream, colors.ink, colors.surface, colors.interactive,
 *     colors.text-*, colors.border-*   (all NEW prefixes)
 *   - fontFamily.display, .ui, .body, .accent, .code   (no collisions with default sans/serif/mono)
 *   - transitionDuration.fast, .base, .slow   (defaults are numeric — no collision)
 *
 * Dark mode: class-based via [data-theme="dark"]. No UI toggle ships in v1.
 * See TOKENS.md.
 */
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
        // CL palette families (4: 1 primary + 3 accents per Figma 2026-04-22)
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

        // Cream surfaces — new prefix
        cream: {
          50:  'rgb(var(--color-cream-50)  / <alpha-value>)',
          100: 'rgb(var(--color-cream-100) / <alpha-value>)',
        },

        // Ink neutrals — new prefix (Tailwind default is "gray", "neutral", etc.)
        ink: {
          50:  'rgb(var(--color-ink-50)  / <alpha-value>)',
          100: 'rgb(var(--color-ink-100) / <alpha-value>)',
          200: 'rgb(var(--color-ink-200) / <alpha-value>)',
          300: 'rgb(var(--color-ink-300) / <alpha-value>)',
          400: 'rgb(var(--color-ink-400) / <alpha-value>)',
          600: 'rgb(var(--color-ink-600) / <alpha-value>)',
          900: 'rgb(var(--color-ink-900) / <alpha-value>)',
        },

        // Status — prefixed to avoid collision with native Tailwind color keys
        'cl-success': 'rgb(var(--color-success-500) / <alpha-value>)',
        'cl-warning': 'rgb(var(--color-warning-500) / <alpha-value>)',
        'cl-danger': {
          500: 'rgb(var(--color-danger-500) / <alpha-value>)',
          700: 'rgb(var(--color-danger-700) / <alpha-value>)',
        },
        'cl-info':    'rgb(var(--color-info-500)    / <alpha-value>)',

        // Semantic aliases (preferred in new Phase 2+ components) — blue primary
        surface:              'rgb(var(--color-cream-50)    / <alpha-value>)',
        'surface-card':       'rgb(var(--color-white)       / <alpha-value>)',
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
      },

      // New font-family keys (defaults are sans/serif/mono — no collision with public site).
      // Usage: font-display (DIN Condensed) / font-ui|body (Inter) / font-accent (Texturina Italic) / font-code (DM Mono)
      fontFamily: {
        display: ['var(--font-display)'],
        ui:      ['var(--font-ui)'],
        body:    ['var(--font-body)'],
        accent:  ['var(--font-accent)'],
        code:    ['var(--font-mono)'],
      },

      // New duration keys (Tailwind defaults are 75/100/150/200/300/500/700/1000).
      transitionDuration: {
        fast: 'var(--motion-duration-fast)',
        base: 'var(--motion-duration-base)',
        slow: 'var(--motion-duration-slow)',
      },

      // New boxShadow keys — `card` / `card-hover` only.
      // Default shadow-sm/md/lg keys deliberately NOT extended (preserves Tailwind defaults for public site).
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