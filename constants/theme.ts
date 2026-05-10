import { Platform } from "react-native";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#ffffff",
    tint: "#0058be",
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: "#0058be",
    primary: "#0058be",
    success: "#10b981",
    error: "#ba1a1a",
    warning: "#924700",
    surfaceContainer: "#f1f5f9",
    surfaceContainerHigh: "#e2e8f0",
    surfaceCard: "#f8fafc",
  },
  dark: {
    text: "#ECEDEE",
    background: "#0f1115",
    tint: "#0058be",
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: "#0058be",
    primary: "#0058be",
    success: "#10b981",
    error: "#ba1a1a",
    warning: "#924700",
    surfaceContainer: "#334155",
    surfaceContainerHigh: "#475569",
    surfaceCard: "#111317",
    insights: {
      pageBg: "#0F1623",
      cardBg: "#161E2E",
      signalCardBg: "#1A2236",
      accentBlue: "#3B82F6",
      accentBlueHover: "#60A5FA",
      accentAmber: "#F59E0B",
      ctaBlue: "#2563EB",
      ctaBlueHover: "#3B82F6",
      mutedGray: "#9CA3AF",
      textMuted: "#6B7280",
      gaugeStroke: "#3B82F6",
      gaugeTrack: "#1E3A5F",
    },
    budgets: {
      cardBg: "#161E2E",
      cardBgAlt: "#1A2236",
      accentBlue: "#3B82F6",
      accentBlueHover: "#60A5FA",
      accentAmber: "#F59E0B",
      ctaBlue: "#2563EB",
      ctaBlueHover: "#3B82F6",
      textMuted: "#6B7280",
      barTrack: "#2A2D2D",
      barBlue: "#3B82F6",
      barGreen: "#10B981",
      barAmber: "#F59E0B",
      barRed: "#EF4444",
      alertRed: "#EF4444",
      alertAmber: "#F59E0B",
      alertGrey: "#6B7280",
    },
  },
};

export const Typography = {
  displayMD: {
    fontSize: 44,
    lineHeight: 44,
    fontWeight: "700" as const,
  },
  headlineSM: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "600" as const,
  },
  titleMD: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "600" as const,
  },
  bodyMD: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400" as const,
  },
  labelSM: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "500" as const,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});