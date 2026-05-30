export type ImportedFileType = "pdf" | "svg" | "png" | "jpg" | "eps";

export type LicenseType = "own" | "cc-by" | "cc-by-sa" | "cc-by-nc" | "public-domain" | "permission-granted" | "unknown";

export interface ImportWarning {
  code: "IS_RASTER" | "LOW_RESOLUTION" | "HAS_TRANSPARENCY" | "FONTS_NOT_EMBEDDED" | "SVG_NEEDS_CONVERSION" | "NOT_VECTOR" | "ABSOLUTE_PATH" | "MISSING_ORIGIN";
  message: string;
}

export interface ImportTraceabilityDocument {
  engineId: "import-traceability-engine";
  version: string;
  originalPath: string;
  projectRelativePath: string;
  fileType: ImportedFileType;
  isVector: boolean;
  widthPx?: number;
  heightPx?: number;
  dpi?: number;
  origin?: string;
  license?: LicenseType;
  licenseNote?: string;
  warnings: ImportWarning[];
}
