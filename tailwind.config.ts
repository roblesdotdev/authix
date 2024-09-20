import { type Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: {
        '2xl': '1520px',
      },
    },
    extend: {
      spacing: {
        inherit: 'inherit',
      },
      screens: {
        xs: '475px',
      },
      colors: {
        /*
        canvas: 'hsl(var(--canvas))',
        panel: 'hsl(var(--panel))',
        fg: {
          DEFAULT: 'hsl(var(--fg-default))',
          muted: 'hsl(var(--fg-muted))',
          error: 'hsl(var(--fg-error))',
        },
        primary: 'hsl(var(--primary))',
        'on-primary': 'hsl(var(--on-primary))',
        border: 'hsl(var(--border))',
        */
      },
    },
  },
  plugins: [],
} satisfies Config
