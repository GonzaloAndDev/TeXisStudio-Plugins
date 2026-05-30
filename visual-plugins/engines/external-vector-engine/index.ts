export type { ExternalTool, ExternalOutputFormat, ExternalVectorDocument } from "./types.js";

export const EXTERNAL_VECTOR_ENGINE_ID = "external-vector-engine" as const;

export const EXTERNAL_VECTOR_ENGINE_META = {
  engineId: EXTERNAL_VECTOR_ENGINE_ID,
  displayName: "External Vector Engine",
  supportedOutputs: ["pdf", "svg"] as const,
  requiredPackages: [] as const,
} as const;
