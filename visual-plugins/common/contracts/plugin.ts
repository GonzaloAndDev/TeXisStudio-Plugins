import type {
  PluginCategory,
  QualityLevel,
  ValidationResult,
} from "./types.js";

export interface VisualFigureResult {
  figureId: string;
  pluginId: string;
  engineId: string;
  /** The full LaTeX block (figure float) to insert into the document.
   *  For engine-based figures this is a wrapper that `\input`s output.tex. */
  latexBlock: string;
  /** The bare figure body (e.g. the `tikzpicture`/`axis` content) that must
   *  be written to output.tex. This is what `latexBlock` references via
   *  `\input`, and what the standalone snippet preview compiles. */
  texContent: string;
  requiredPackages: readonly string[];
  sourcePath: string;
  outputPaths: {
    tex?: string;
    pdf?: string;
    svg?: string;
    preview?: string;
  };
  warnings: string[];
  /** Serialized JSON of the engine document — always populated by BasePlugin.
   *  Persist this alongside the figure so the user can re-open and edit later. */
  sourceJson?: string;
}

export interface VisualDiagramPlugin {
  readonly pluginId: string;
  readonly displayName: string;
  readonly description: string;
  readonly category: PluginCategory;
  readonly engineId: string;
  readonly qualityLevel: QualityLevel;
  readonly requiredPackages: readonly string[];
  readonly scopeWarning?: string;

  create(): Promise<VisualFigureResult>;
  edit(existingFigurePath: string): Promise<VisualFigureResult>;
  /** Re-edit a figure using previously-persisted source data (browser-safe path). */
  editWithSource?(figureId: string, sourceJson: string, caption?: string, label?: string): Promise<VisualFigureResult>;
  validate(result: VisualFigureResult): Promise<ValidationResult>;
  exportLatexBlock(result: VisualFigureResult): string;
}
