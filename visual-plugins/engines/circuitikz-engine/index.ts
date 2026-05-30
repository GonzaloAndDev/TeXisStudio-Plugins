export type { ComponentType, Direction, CircuitNode, CircuitComponent, CircuitConnection, CircuiTikZDocument } from "./types.js";

export const CIRCUITIKZ_ENGINE_ID = "circuitikz-engine" as const;

export const CIRCUITIKZ_ENGINE_META = {
  engineId: CIRCUITIKZ_ENGINE_ID,
  displayName: "CircuiTikZ Engine",
  supportedOutputs: ["latex", "pdf"] as const,
  requiredPackages: ["circuitikz"] as const,
} as const;
