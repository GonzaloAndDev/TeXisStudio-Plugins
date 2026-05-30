export type { PlotType, AxisScale, DataSeries, PGFPlotsDocument } from "./types.js";

export const PGFPLOTS_ENGINE_ID = "pgfplots-engine" as const;

export const PGFPLOTS_ENGINE_META = {
  engineId: PGFPLOTS_ENGINE_ID,
  displayName: "PGFPlots Engine",
  supportedOutputs: ["latex", "pdf"] as const,
  requiredPackages: ["pgfplots", "pgfplotsthemebase"] as const,
} as const;
