export type { NotationType, NotationDocument } from "./types.js";

export const NOTATION_ENGINE_ID = "notation-engine" as const;

export const NOTATION_ENGINE_META = {
  engineId: NOTATION_ENGINE_ID,
  displayName: "Notation / Textual Academic Engine",
  supportedOutputs: ["latex"] as const,
  requiredPackages: ["algorithm2e", "listings", "amsthm"] as const,
} as const;
