export type { ShapeType, LineStyle, Coordinate, TikzShape, TikzShapeDocument } from "./types.js";
export { TikzShapeEngine } from "./engine.js";
export { serializeShape, wrapInTikzPicture } from "./serializer.js";

export const TIKZ_SHAPE_ENGINE_ID = "tikz-shape-engine" as const;

export const TIKZ_SHAPE_ENGINE_META = {
  engineId: TIKZ_SHAPE_ENGINE_ID,
  displayName: "TikZ Shape Engine",
  supportedOutputs: ["latex", "pdf"] as const,
  requiredPackages: ["tikz"] as const,
} as const;
