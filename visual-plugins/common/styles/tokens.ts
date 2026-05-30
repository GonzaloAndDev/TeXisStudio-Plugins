/**
 * Design tokens shared across all plugin UIs.
 * Ensures visual consistency between the plugin palette,
 * canvas, and the rendered LaTeX output.
 */
export const STYLE_TOKENS = {
  lineWidth: {
    thin: "0.4pt",
    normal: "0.8pt",
    thick: "1.2pt",
    extraThick: "2pt",
  },
  color: {
    black: "black",
    darkGray: "black!70",
    midGray: "black!40",
    lightGray: "black!15",
    white: "white",
    accent: "black!85",
  },
  font: {
    labelSize: "\\small",
    captionSize: "\\footnotesize",
    bodySize: "\\normalsize",
  },
  arrow: {
    default: "->",
    thick: "-stealth",
    double: "<->",
    none: "-",
  },
  spacing: {
    nodeDistance: "2cm",
    levelDistance: "1.5cm",
    siblingDistance: "2.5cm",
  },
} as const;

export type StyleTokens = typeof STYLE_TOKENS;
