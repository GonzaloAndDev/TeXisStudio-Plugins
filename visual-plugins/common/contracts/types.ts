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
  | "circuitikz-engine"
  | "chemistry-engine";

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

// ── Visual editor public contract ────────────────────────────────────────────

/**
 * Capabilities that a visual editor implementation can declare.
 * Used by VisualEditorShell and VisualEditorRouter to enable/disable
 * toolbar affordances without hard-coding per-engine conditionals.
 */
export interface EditorCapabilities {
  /** Editor supports undo/redo via useDocumentHistory. Always true for editors wrapped in VisualEditorShell. */
  historySupported: boolean;
  /** Editor can restore a built-in minimal working example. */
  restoreSupported: boolean;
  /** Editor exposes a "Switch to LaTeX source" mode for power users. */
  advancedCodeSupported: boolean;
  /** Editor shows a real-time preview of the generated figure. */
  previewSupported: boolean;
}

/**
 * A named field that advanced users can inspect or override directly
 * (e.g. pgfplotsOptions, tikzOptions). Shown in an "Advanced" collapsible.
 */
export interface TechnicalField {
  key: string;
  labelKey: string;
  descriptionKey?: string;
  type: "string" | "number" | "boolean" | "textarea";
}

/**
 * Public metadata that each visual editor declares.
 * Consumed by VisualEditorRouter to configure the surrounding shell,
 * by FigureEditModal to decide which tabs to show, and by the help system
 * to route the user to the right documentation section.
 *
 * Register metadata via registerEditorMetadata() in each engine's index.ts.
 */
export interface PluginEditingMetadata {
  /** The engine ID this metadata applies to. Must match VisualEditorEngineId. */
  engineId: string;

  /** Which help center section to open when the user clicks "?" in this editor. */
  helpTopic: "start" | "figures" | "latex" | "errors" | "faq";

  /** Capabilities declared by this editor. */
  capabilities: EditorCapabilities;

  /**
   * Technical fields shown in an "Advanced" collapsible in the editor shell.
   * Empty array means no advanced panel is shown.
   */
  technicalFields: TechnicalField[];

  /**
   * Returns a minimal working example document for the "restore example" action.
   * Must return a plain object compatible with the engine's document schema.
   */
  defaultDoc: () => unknown;

  /**
   * Optional human-readable description of what the editor covers.
   * Shown as a subtitle in the visual editor tab.
   */
  descriptionKey?: string;
}

/** Registry for editor metadata, keyed by engineId. */
const _editorMetadataRegistry: Map<string, PluginEditingMetadata> = new Map();

/** Register metadata for a visual editor engine. Call this from each engine's index.ts. */
export function registerEditorMetadata(meta: PluginEditingMetadata): void {
  _editorMetadataRegistry.set(meta.engineId, meta);
}

/** Look up metadata for a given engineId. Returns undefined if not registered. */
export function getEditorMetadata(engineId: string): PluginEditingMetadata | undefined {
  return _editorMetadataRegistry.get(engineId);
}

/** All registered editor metadata entries. */
export function getAllEditorMetadata(): PluginEditingMetadata[] {
  return Array.from(_editorMetadataRegistry.values());
}
