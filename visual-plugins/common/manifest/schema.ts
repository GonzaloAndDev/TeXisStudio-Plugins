import type { OutputFormat, QualityLevel } from "../contracts/types.js";

export interface FigureManifest {
  id: string;
  pluginId: string;
  pluginVersion: string;
  engineId: string;
  title: string;
  preferredOutput: OutputFormat;
  sourceFile: string;
  latexFile: string | null;
  pdfFile: string | null;
  svgFile: string | null;
  previewFile: string | null;
  requiredPackages: string[];
  createdAt: string;
  updatedAt: string;
  qualityLevel: QualityLevel;
  editable: boolean;
  warnings: string[];
}

export const MANIFEST_FILENAME = "manifest.json" as const;
export const ASSETS_DIR = "texisstudio-assets" as const;
export const FIGURES_DIR = "figures" as const;

export function figurePath(figureId: string): string {
  return `${ASSETS_DIR}/${FIGURES_DIR}/${figureId}`;
}
