import type { Config } from "tailwindcss";

/**
 * Tailwind configuration.
 *
 * Colors come from CSS custom properties declared in `src/styles/colors.css`.
 * This keeps a single source of truth for the palette and lets us swap themes
 * without touching components.
 */
const config: Config = {
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          DEFAULT: "var(--color-brand-500)",
          50: "var(--color-brand-50)",
          100: "var(--color-brand-100)",
          500: "var(--color-brand-500)",
          600: "var(--color-brand-600)",
          700: "var(--color-brand-700)",
        },
        surface: {
          page: "var(--color-surface-page)",
          card: "var(--color-surface-card)",
          subtle: "var(--color-surface-subtle)",
          hover: "var(--color-surface-hover)",
        },
        border: {
          subtle: "var(--color-border-subtle)",
          default: "var(--color-border-default)",
          strong: "var(--color-border-strong)",
        },
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          muted: "var(--color-text-muted)",
          inverse: "var(--color-text-inverse)",
        },
        status: {
          "completed-bg": "var(--color-status-completed-bg)",
          "completed-text": "var(--color-status-completed-text)",
          "incomplete-bg": "var(--color-status-incomplete-bg)",
          "incomplete-text": "var(--color-status-incomplete-text)",
          "missing-bg": "var(--color-status-missing-bg)",
          "missing-text": "var(--color-status-missing-text)",
        },
        accent: {
          orange: "var(--color-accent-orange)",
        },
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(15, 23, 42, 0.04), 0 1px 3px 0 rgba(15, 23, 42, 0.06)",
        popover:
          "0 4px 6px -2px rgba(15, 23, 42, 0.05), 0 10px 15px -3px rgba(15, 23, 42, 0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
