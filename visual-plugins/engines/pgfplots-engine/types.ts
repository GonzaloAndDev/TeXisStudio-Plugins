export type PlotType =
  | "function2d" | "parametric" | "polar"
  | "scatter" | "histogram" | "bar" | "boxplot" | "errorbar"
  | "surface" | "contour"
  | "heatmap";   // matrix plot — for correlation matrices and discrete heat maps

export type AxisScale = "linear" | "log" | "semilogx" | "semilogy";

export interface DataSeries {
  id: string;
  label: string;
  plotType: PlotType;
  data?: DataPoint[];
  expression?: string;
  domain?: [number, number];
  color?: string;
  mark?: string;
}

/** Un punto de datos. Para boxplot, el resumen de cinco números
 *  (q1/q3/whiskers) es opcional: si se da, se usa tal cual; si no, se deriva
 *  de `y` (mediana) ± `error` para mantener compatibilidad hacia atrás. */
export interface DataPoint {
  x: number;
  y: number;
  error?: number;
  meta?: number;
  q1?: number;
  q3?: number;
  whiskerMin?: number;
  whiskerMax?: number;
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
