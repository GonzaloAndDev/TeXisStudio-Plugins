export type { MathMode, MatrixDelimiter, MathNode, MathEngineDocument, MatrixDocument, SystemDocument } from "./types.js";
export { MathEngine } from "./engine.js";
export { serializeNode, wrapInEnvironment } from "./serializer.js";

export const MATH_ENGINE_ID = "math-engine" as const;

export const MATH_ENGINE_META = {
  engineId: MATH_ENGINE_ID,
  displayName: "Math Engine",
  supportedOutputs: ["latex"] as const,
  requiredPackages: ["amsmath", "amssymb"] as const,
} as const;
