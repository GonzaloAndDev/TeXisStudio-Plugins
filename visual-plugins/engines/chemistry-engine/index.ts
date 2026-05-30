export type { ChemOutputMode, ReactionArrow, ChemFormula, ChemReaction, ChemStructure, ChemElement, ChemEngineDocument } from "./types.js";

export const CHEMISTRY_ENGINE_ID = "chemistry-engine" as const;

export const CHEMISTRY_ENGINE_META = {
  engineId: CHEMISTRY_ENGINE_ID,
  displayName: "Chemistry Engine",
  supportedOutputs: ["latex", "pdf", "svg"] as const,
  requiredPackages: ["chemformula", "mhchem", "chemfig"] as const,
} as const;
