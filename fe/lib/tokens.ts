/**
 * Read-only mirror of the design tokens declared in `app/globals.css`.
 * These are useful when a component needs the actual hex (e.g., chart strokes,
 * inline SVG fills). For everything else, prefer Tailwind utility classes that
 * resolve to these CSS variables.
 */
export const tokens = {
  color: {
    background: "#000915",
    surface: "#0a1322",
    surface2: "#111c2f",
    surface3: "#1a2640",
    grey: "#1c1c1d",
    foreground: "#f6f6f6",
    foregroundMuted: "#a4adc1",
    foregroundSubtle: "#6c7691",
    primary: "#0088ff",
    primarySoft: "#1d6dff",
    primaryDeep: "#0050b8",
    accentYellow: "#ee9f0a",
    accentPurple: "#5220d8",
    success: "#1fd286",
    danger: "#ff5470",
    warning: "#f5b021",
    border: "#1d293f",
    borderStrong: "#2a3a58",
  },
  radius: {
    xs: 6,
    sm: 10,
    md: 14,
    lg: 20,
    xl: 28,
    "2xl": 36,
    pill: 999,
  },
  motion: {
    micro: 120,
    fast: 200,
    normal: 280,
    slow: 420,
    easeOutSoft: "cubic-bezier(0.22, 1, 0.36, 1)",
    easeInOutSoft: "cubic-bezier(0.65, 0, 0.35, 1)",
  },
  touch: {
    minimum: 44,
    primary: 56,
  },
} as const;

export type ColorToken = keyof typeof tokens.color;
