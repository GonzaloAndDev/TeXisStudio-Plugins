export type { ImportedFileType, LicenseType, ImportWarning, ImportTraceabilityDocument } from "./types.js";
export { ImportTraceabilityEngine } from "./engine.js";

export const IMPORT_TRACEABILITY_ENGINE_ID = "import-traceability-engine" as const;

export const IMPORT_TRACEABILITY_ENGINE_META = {
  engineId: IMPORT_TRACEABILITY_ENGINE_ID,
  displayName: "Import / Traceability Engine",
  supportedOutputs: ["pdf", "svg", "png"] as const,
  requiredPackages: ["graphicx"] as const,
} as const;
