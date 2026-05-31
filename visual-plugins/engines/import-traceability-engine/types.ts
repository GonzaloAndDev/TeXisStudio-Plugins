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
  widthPx?: number | undefined;
  heightPx?: number | undefined;
  dpi?: number | undefined;
  origin?: string | undefined;
  license?: LicenseType | undefined;
  licenseNote?: string | undefined;
  warnings: ImportWarning[];
}
