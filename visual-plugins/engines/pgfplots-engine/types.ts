export type PlotType = "function2d" | "parametric" | "polar" | "scatter" | "histogram" | "bar" | "boxplot" | "errorbar" | "surface" | "contour";

export type AxisScale = "linear" | "log" | "semilogx" | "semilogy";

export interface DataSeries {
  id: string;
  label: string;
  plotType: PlotType;
  data?: Array<{ x: number; y: number; error?: number }>;
  expression?: string;
  domain?: [number, number];
  color?: string;
  mark?: string;
}

export interface PGFPlotsDocument {
  engineId: "pgfplots-engine";
  version: string;
  series: DataSeries[];
  xLabel: string;
  yLabel: string;
  xScale: AxisScale;
  yScale: AxisScale;
  showLegend: boolean;
  grid: boolean | "major" | "minor" | "both";
  pgfplotsOptions?: string;
}
