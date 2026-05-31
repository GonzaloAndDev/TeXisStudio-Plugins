import type { VisualEngine, EngineDocument, EngineInput, ValidationResult, PreviewResult, ExportResult, EditableSource } from "../../common/contracts/index.js";
import type { ImportTraceabilityDocument, ImportWarning } from "./types.js";
import { IMPORT_TRACEABILITY_ENGINE_META } from "./index.js";
import { buildLatexGraphicsBlock } from "../../common/export/latex-block.js";

const RASTER_TYPES = ["png", "jpg"] as const;
const LOW_DPI_THRESHOLD = 150;

export class ImportTraceabilityEngine implements VisualEngine {
  readonly engineId = IMPORT_TRACEABILITY_ENGINE_META.engineId;
  readonly displayName = IMPORT_TRACEABILITY_ENGINE_META.displayName;
  readonly supportedOutputs = IMPORT_TRACEABILITY_ENGINE_META.supportedOutputs;
  readonly requiredPackages = IMPORT_TRACEABILITY_ENGINE_META.requiredPackages;

  async createDocument(input?: EngineInput): Promise<EngineDocument> {
    if (input?.source?.data) return input.source.data as ImportTraceabilityDocument;
    return {
      engineId: "import-traceability-engine", version: "1.0.0",
      originalPath: "", projectRelativePath: "",
      fileType: "pdf", isVector: true, warnings: [],
    } as ImportTraceabilityDocument;
  }

  async validate(document: EngineDocument): Promise<ValidationResult> {
    const doc = document as ImportTraceabilityDocument;
    const issues = [];

    if (doc.engineId !== "import-traceability-engine") {
      issues.push({ code: "WRONG_ENGINE", message: "Document was not created by import-traceability-engine", severity: "error" as const });
    }
    if (!doc.projectRelativePath) {
      issues.push({ code: "MISSING_PATH", message: "Project-relative path is required", severity: "error" as const });
    }
    if (doc.projectRelativePath?.startsWith("/") || /^[A-Z]:/.test(doc.projectRelativePath ?? "")) {
      issues.push({ code: "ABSOLUTE_PATH", message: "Path must be relative, not absolute", severity: "error" as const });
    }
    for (const w of doc.warnings) {
      if (w.code === "NOT_VECTOR") {
        issues.push({ code: "NOT_VECTOR", message: w.message, severity: "warning" as const });
      }
    }
    return { valid: issues.filter(i => i.severity === "error").length === 0, issues };
  }

  async renderPreview(document: EngineDocument): Promise<PreviewResult> {
    const doc = document as ImportTraceabilityDocument;
    return { format: "png", data: doc.projectRelativePath };
  }

  async export(document: EngineDocument, _target: "latex" | "pdf" | "svg" | "png"): Promise<ExportResult> {
    const doc = document as ImportTraceabilityDocument;
    const warnings = doc.warnings.map(w => w.message);

    const block = buildLatexGraphicsBlock({
      figureId: "imported",
      graphicsPath: doc.projectRelativePath,
      caption: "Imported figure.",
      label: "fig:imported",
    });

    return { format: "latex", content: block, requiredPackages: ["graphicx"], warnings };
  }

  async getEditableSource(document: EngineDocument): Promise<EditableSource> {
    return { pluginId: "import-traceability-engine", engineId: "import-traceability-engine", version: "1.0.0", data: document };
  }

  analyzeFile(filePath: string, opts?: { widthPx?: number; heightPx?: number; dpi?: number; isVector?: boolean }): ImportTraceabilityDocument {
    const ext = filePath.split(".").pop()?.toLowerCase() ?? "";
    const fileType = (["pdf","svg","png","jpg","eps"].includes(ext) ? ext : "pdf") as ImportTraceabilityDocument["fileType"];
    const isVector = opts?.isVector ?? ["pdf","svg","eps"].includes(ext);
    const warnings: ImportWarning[] = [];

    if (RASTER_TYPES.includes(fileType as never)) {
      warnings.push({ code: "IS_RASTER", message: `File is a raster image (${ext}). Vector format (PDF/SVG) is preferred for LaTeX.` });
    }
    if (!isVector) {
      warnings.push({ code: "NOT_VECTOR", message: "File does not appear to be vectorial. Quality may degrade when scaled." });
    }
    if (opts?.dpi !== undefined && opts.dpi < LOW_DPI_THRESHOLD) {
      warnings.push({ code: "LOW_RESOLUTION", message: `Resolution is ${opts.dpi} dpi. 300+ dpi recommended for print quality.` });
    }
    if (filePath.startsWith("/") || /^[A-Z]:/.test(filePath)) {
      warnings.push({ code: "ABSOLUTE_PATH", message: "Path is absolute. Use a relative path to ensure portability." });
    }

    return {
      engineId: "import-traceability-engine", version: "1.0.0",
      originalPath: filePath, projectRelativePath: "",
      fileType, isVector,
      widthPx: opts?.widthPx, heightPx: opts?.heightPx, dpi: opts?.dpi,
      warnings,
    };
  }
}
