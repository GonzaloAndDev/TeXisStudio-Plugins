import type {
  PluginCategory,
  QualityLevel,
  ValidationResult,
} from "./types.js";

export interface VisualFigureResult {
  figureId: string;
  pluginId: string;
  engineId: string;
  latexBlock: string;
  requiredPackages: readonly string[];
  sourcePath: string;
  outputPaths: {
    tex?: string;
    pdf?: string;
    svg?: string;
    preview?: string;
  };
  warnings: string[];
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
  validate(result: VisualFigureResult): Promise<ValidationResult>;
  exportLatexBlock(result: VisualFigureResult): string;
}
