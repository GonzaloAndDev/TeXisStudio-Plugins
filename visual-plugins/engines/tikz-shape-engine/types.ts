export type ShapeType = "point" | "line" | "arrow" | "rectangle" | "circle" | "ellipse" | "polygon" | "arc" | "bezier" | "label" | "axis" | "vector" | "angle";

export type LineStyle = "solid" | "dashed" | "dotted" | "densely-dashed";

export interface Coordinate {
  x: number;
  y: number;
  unit?: "cm" | "pt" | "mm";
}

export interface TikzShape {
  id: string;
  type: ShapeType;
  coords: Coordinate[];
  label?: string;
  lineStyle?: LineStyle;
  lineWidth?: string;
  color?: string;
  fill?: string;
  arrowTip?: string;
  options?: string;
}

export interface TikzShapeDocument {
  engineId: "tikz-shape-engine";
  version: string;
  shapes: TikzShape[];
  viewBox: { width: number; height: number; unit: string };
  tikzLibraries: string[];
}
