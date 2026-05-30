import type { VisualEngine, EngineDocument, EngineInput, ValidationResult, PreviewResult, ExportResult, EditableSource } from "../../common/contracts/index.js";
import type { TikzShapeDocument } from "./types.js";
import { serializeShape, wrapInTikzPicture } from "./serializer.js";
import { TIKZ_SHAPE_ENGINE_META } from "./index.js";

export class TikzShapeEngine implements VisualEngine {
  readonly engineId = TIKZ_SHAPE_ENGINE_META.engineId;
  readonly displayName = TIKZ_SHAPE_ENGINE_META.displayName;
  readonly supportedOutputs = TIKZ_SHAPE_ENGINE_META.supportedOutputs;
  readonly requiredPackages = TIKZ_SHAPE_ENGINE_META.requiredPackages;

  async createDocument(input?: EngineInput): Promise<EngineDocument> {
    if (input?.source?.data) return input.source.data as TikzShapeDocument;
    const doc: TikzShapeDocument = {
      engineId: "tikz-shape-engine",
      version: "1.0.0",
      shapes: [],
      viewBox: { width: 8, height: 6, unit: "cm" },
      tikzLibraries: [],
    };
    return doc;
  }

  async validate(document: EngineDocument): Promise<ValidationResult> {
    const doc = document as TikzShapeDocument;
    const issues = [];
    if (doc.engineId !== "tikz-shape-engine") {
      issues.push({ code: "WRONG_ENGINE", message: "Document was not created by tikz-shape-engine", severity: "error" as const });
    }
    if (!Array.isArray(doc.shapes)) {
      issues.push({ code: "MISSING_SHAPES", message: "Shapes array is required", severity: "error" as const });
    }
    return { valid: issues.filter(i => i.severity === "error").length === 0, issues };
  }

  async renderPreview(document: EngineDocument): Promise<PreviewResult> {
    const latex = this.generateLatex(document as TikzShapeDocument);
    return { format: "svg", data: latex };
  }

  async export(document: EngineDocument, _target: "latex" | "pdf" | "svg" | "png"): Promise<ExportResult> {
    const doc = document as TikzShapeDocument;
    const content = this.generateLatex(doc);
    const packages = ["tikz"];
    return { format: "latex", content, requiredPackages: packages, warnings: [] };
  }

  async getEditableSource(document: EngineDocument): Promise<EditableSource> {
    return { pluginId: "tikz-shape-engine", engineId: "tikz-shape-engine", version: "1.0.0", data: document };
  }

  generateLatex(doc: TikzShapeDocument): string {
    const lines = doc.shapes.map(s => serializeShape(s));
    return wrapInTikzPicture(lines, doc.tikzLibraries);
  }
}
