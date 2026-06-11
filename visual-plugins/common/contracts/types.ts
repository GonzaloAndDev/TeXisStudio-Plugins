export type OutputFormat = "latex" | "pdf" | "svg" | "png";

export type QualityLevel = "official-core" | "official-extended" | "experimental";

/** User-facing difficulty label shown in the figure picker. */
export type UserLevel = "easy" | "intermediate" | "advanced";

/**
 * How much LaTeX knowledge the user needs to work with this plugin:
 * - fully-visual   → no LaTeX at all; GUI controls everything
 * - visual-assisted → forms/tables; some optional technical fields
 * - advanced        → requires understanding of LaTeX syntax
 * - external-bridge → directs the user to external specialised software
 */
export type EditorType =
  | "fully-visual"
  | "visual-assisted"
  | "advanced"
  | "external-bridge";

/** Engine IDs that have a registered visual editor in the app. */
export type VisualEditorEngineId =
  | "graph-node-engine"
  | "pgfplots-engine"
  | "math-engine"
  | "timeline-gantt-engine"
  | "table-data-engine"
  | "tree-forest-engine"
  | "circuitikz-engine";

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
