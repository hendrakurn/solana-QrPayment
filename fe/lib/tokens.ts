/**
 * Read-only mirror of the design tokens declared in `app/globals.css`.
 * These are useful when a component needs the actual hex (e.g., chart strokes,
 * inline SVG fills, motion values). For all CSS use, prefer Tailwind utility
 * classes that resolve to the matching CSS variables.
 *
 * Source of truth: `/imported/design-system/v2-tokens.yaml` + Stitch design system.
 */
export const tokens = {
  color: {
    background: "#000915",
    surfaceLow: "#0a0e15",
    surface: "#1c1c1d",
    surface1: "#181c23",
    surface2: "#1c2027",
    surface3: "#262a32",
    surface4: "#31353d",
    surfaceBright: "#353941",

    foreground: "#f6f6f6",
    foregroundMuted: "#c0c6d6",
    foregroundSubtle: "#8a919f",

    primary: "#0088ff",
    primarySoft: "#1d6dff",
    primaryDeep: "#0050b8",
    primaryContainer: "#3491ff",
    onPrimaryContainer: "#002955",

    accentYellow: "#ee9f0a",
    accentPurple: "#5220d8",
    accentPurpleSoft: "#cdbcff",
    secondaryContainer: "#4c13d2",
    tertiary: "#ffb953",

    coinUsdc: "#2775ca",
    coinUsdcTint: "#5ba6ff",
    coinUsdt: "#26a17b",
    coinUsdtTint: "#34c397",
    coinPyusd: "#0070ba",
    coinPyusdTint: "#5fb1ff",

    success: "#1fd286",
    successSoft: "#103d2c",
    danger: "#ffb4ab",
    dangerDeep: "#93000a",
    warning: "#f5b021",

    border: "#2a3142",
    borderStrong: "#404754",
  },
  radius: {
    xs: 6,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    "2xl": 28,
    pill: 9999,
  },
  spacing: {
    edge: 20,
    touch: 44,
    tap: 56,
  },
  motion: {
    micro: 120,
    fast: 200,
    normal: 280,
    slow: 420,
    easeOutSoft: "cubic-bezier(0.22, 1, 0.36, 1)",
    easeInOutSoft: "cubic-bezier(0.65, 0, 0.35, 1)",
    /** Premium blur-slide-up entrance per Stitch motion brief */
    easeBlurEntrance: [0.25, 0.46, 0.45, 0.94] as const,
    /** Image/media spring overshoot */
    easeImageSpring: [0.34, 1.56, 0.64, 1] as const,
    /** Line/divider reveal */
    easeLineReveal: [0.76, 0, 0.24, 1] as const,
  },
  touch: {
    minimum: 44,
    primary: 56,
  },
} as const;

export type ColorToken = keyof typeof tokens.color;
