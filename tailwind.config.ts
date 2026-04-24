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
 *   - fontFamily.display, .ui, .body   (defaults are sans/serif/mono — no collision)
 *   - transitionDuration.fast, .base, .slow   (defaults are numeric — no collision)
 *
 * Keys intentionally NOT extended to preserve public-site rendering:
 *   - fontSize (xs/sm/base/lg/xl/... would override default line-heights)
 *   - borderRadius (sm/md/lg/xl would override default radii — Navbar, etc.)
 *   - boxShadow (sm/md/lg would override default tints)
 *   - transitionTimingFunction (out would collide with ease-out default)
 *   - fontFamily.mono (default mono stack is fine)
 *
 * For Phase 2 portal components, consume token values either via arbitrary
 * value syntax — `rounded-[var(--radius-lg)]`, `text-[length:var(--text-xl)]`,
 * `shadow-[var(--shadow-md)]` — or add NEW prefixed keys (e.g. rounded-card,
 * shadow-card, text-display) when a naming convention emerges.
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
        // CL accent families — all new prefixed keys, no collision
        'cl-pink': {
          100: 'rgb(var(--color-cl-pink-100) / <alpha-value>)',
          500: 'rgb(var(--color-cl-pink-500) / <alpha-value>)',
          700: 'rgb(var(--color-cl-pink-700) / <alpha-value>)',
          800: 'rgb(var(--color-cl-pink-800) / <alpha-value>)',
        },
        'cl-sky': {
          100: 'rgb(var(--color-cl-sky-100) / <alpha-value>)',
          500: 'rgb(var(--color-cl-sky-500) / <alpha-value>)',
          700: 'rgb(var(--color-cl-sky-700) / <alpha-value>)',
          800: 'rgb(var(--color-cl-sky-800) / <alpha-value>)',
        },
        'cl-purple': {
          100: 'rgb(var(--color-cl-purple-100) / <alpha-value>)',
          500: 'rgb(var(--color-cl-purple-500) / <alpha-value>)',
          700: 'rgb(var(--color-cl-purple-700) / <alpha-value>)',
        },
        'cl-mint': {
          100: 'rgb(var(--color-cl-mint-100) / <alpha-value>)',
          500: 'rgb(var(--color-cl-mint-500) / <alpha-value>)',
          700: 'rgb(var(--color-cl-mint-700) / <alpha-value>)',
        },
        'cl-yellow': {
          100: 'rgb(var(--color-cl-yellow-100) / <alpha-value>)',
          500: 'rgb(var(--color-cl-yellow-500) / <alpha-value>)',
          700: 'rgb(var(--color-cl-yellow-700) / <alpha-value>)',
        },
        'cl-coral': {
          100: 'rgb(var(--color-cl-coral-100) / <alpha-value>)',
          500: 'rgb(var(--color-cl-coral-500) / <alpha-value>)',
          700: 'rgb(var(--color-cl-coral-700) / <alpha-value>)',
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
          400: 'rgb(var(--color-ink-400) / <alpha-value>)',
          600: 'rgb(var(--color-ink-600) / <alpha-value>)',
          900: 'rgb(var(--color-ink-900) / <alpha-value>)',
        },

        // Status — prefixed to avoid collision with native Tailwind color keys
        'cl-success': 'rgb(var(--color-success-500) / <alpha-value>)',
        'cl-warning': 'rgb(var(--color-warning-500) / <alpha-value>)',
        'cl-danger':  'rgb(var(--color-danger-500)  / <alpha-value>)',
        'cl-info':    'rgb(var(--color-info-500)    / <alpha-value>)',

        // Semantic aliases (preferred in new Phase 2+ components)
        surface:              'rgb(var(--color-cream-50)    / <alpha-value>)',
        'surface-card':       'rgb(var(--color-white)       / <alpha-value>)',
        'text-primary':       'rgb(var(--color-ink-900)     / <alpha-value>)',
        'text-secondary':     'rgb(var(--color-ink-600)     / <alpha-value>)',
        'text-muted':         'rgb(var(--color-ink-400)     / <alpha-value>)',
        interactive:          'rgb(var(--color-cl-pink-700) / <alpha-value>)',
        'interactive-hover':  'rgb(var(--color-cl-pink-800) / <alpha-value>)',
        'interactive-subtle': 'rgb(var(--color-cl-pink-100) / <alpha-value>)',
        'interactive-alt':    'rgb(var(--color-cl-sky-700)  / <alpha-value>)',
        'border-subtle':      'rgb(var(--color-ink-100)     / <alpha-value>)',
        'border-default':     'rgb(var(--color-ink-200)     / <alpha-value>)',
        'border-strong':      'rgb(var(--color-ink-400)     / <alpha-value>)',
        'border-focus':       'rgb(var(--color-cl-pink-700) / <alpha-value>)',
      },

      // New font-family keys (defaults are sans/serif/mono — no collision).
      // Usage: font-display / font-ui / font-body on Phase 2 components.
      fontFamily: {
        display: ['var(--font-display)'],
        ui:      ['var(--font-ui)'],
        body:    ['var(--font-body)'],
      },

      // New duration keys (Tailwind defaults are 75/100/150/200/300/500/700/1000).
      transitionDuration: {
        fast: 'var(--motion-duration-fast)',
        base: 'var(--motion-duration-base)',
        slow: 'var(--motion-duration-slow)',
      },

      // Preserve existing public-site gradient aliases (unchanged from pre-Phase-1).
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
export default config
