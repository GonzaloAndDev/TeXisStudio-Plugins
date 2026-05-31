import type { VisualEngine, EngineDocument, EngineInput, ValidationResult, PreviewResult, ExportResult, EditableSource } from "../../common/contracts/index.js";
import type { PGFPlotsDocument } from "./types.js";
import { serializePGFPlots } from "./serializer.js";
import { PGFPLOTS_ENGINE_META } from "./index.js";

export class PGFPlotsEngine implements VisualEngine {
  readonly engineId = PGFPLOTS_ENGINE_META.engineId;
  readonly displayName = PGFPLOTS_ENGINE_META.displayName;
  readonly supportedOutputs = PGFPLOTS_ENGINE_META.supportedOutputs;
  readonly requiredPackages = PGFPLOTS_ENGINE_META.requiredPackages;

  async createDocument(input?: EngineInput): Promise<EngineDocument> {
    if (input?.source?.data) return input.source.data as PGFPlotsDocument;
    const doc: PGFPlotsDocument = {
      engineId: "pgfplots-engine", version: "1.0.0",
      series: [], xLabel: "$x$", yLabel: "$y$",
      xScale: "linear", yScale: "linear",
      showLegend: false, grid: "major",
    };
    return doc;
  }

  async validate(document: EngineDocument): Promise<ValidationResult> {
    const doc = document as PGFPlotsDocument;
    const issues = [];
    if (doc.engineId !== "pgfplots-engine") {
      issues.push({ code: "WRONG_ENGINE", message: "Document was not created by pgfplots-engine", severity: "error" as const });
    }
    if (!Array.isArray(doc.series)) {
      issues.push({ code: "MISSING_SERIES", message: "Series array is required", severity: "error" as const });
    }
    if (doc.series.length === 0) {
      issues.push({ code: "EMPTY_SERIES", message: "At least one data series is recommended", severity: "warning" as const });
    }
    return { valid: issues.filter(i => i.severity === "error").length === 0, issues };
  }

  async renderPreview(document: EngineDocument): Promise<PreviewResult> {
    return { format: "svg", data: serializePGFPlots(document as PGFPlotsDocument) };
  }

  async export(document: EngineDocument, _target: "latex" | "pdf" | "svg" | "png"): Promise<ExportResult> {
    const doc = document as PGFPlotsDocument;
    return {
      format: "latex",
      content: serializePGFPlots(doc),
      requiredPackages: ["pgfplots", "tikz"],
      warnings: [],
    };
  }

  async getEditableSource(document: EngineDocument): Promise<EditableSource> {
    return { pluginId: "pgfplots-engine", engineId: "pgfplots-engine", version: "1.0.0", data: document };
  }
}
