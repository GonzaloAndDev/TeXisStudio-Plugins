export type OutputFormat = "latex" | "pdf" | "svg" | "png";

export type QualityLevel = "official-core" | "official-extended" | "experimental";

export type PluginCategory =
  | "mathematics"
  | "physics"
  | "chemistry"
  | "biology-medicine"
  | "engineering-cs"
  | "humanities-social"
  | "arts-visual"
  | "import-external";

export interface ValidationIssue {
  code: string;
  message: string;
  severity: "error" | "warning" | "info";
  field?: string;
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
}

export interface PreviewResult {
  format: "png" | "svg" | "pdf";
  data: Uint8Array | string;
  width?: number;
  height?: number;
}

export interface ExportResult {
  format: OutputFormat;
  content: string | Uint8Array;
  requiredPackages: string[];
  warnings: string[];
}

export interface EditableSource {
  pluginId: string;
  engineId: string;
  version: string;
  data: unknown;
}

export interface EngineInput {
  source?: EditableSource;
  options?: Record<string, unknown>;
}
