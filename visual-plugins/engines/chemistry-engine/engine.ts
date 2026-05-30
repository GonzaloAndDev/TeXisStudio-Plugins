import type { VisualEngine, EngineDocument, EngineInput, ValidationResult, PreviewResult, ExportResult, EditableSource } from "../../common/contracts/index.js";
import type { ChemEngineDocument } from "./types.js";
import { serializeElements } from "./serializer.js";
import { CHEMISTRY_ENGINE_META } from "./index.js";

export class ChemistryEngine implements VisualEngine {
  readonly engineId = CHEMISTRY_ENGINE_META.engineId;
  readonly displayName = CHEMISTRY_ENGINE_META.displayName;
  readonly supportedOutputs = CHEMISTRY_ENGINE_META.supportedOutputs;
  readonly requiredPackages = CHEMISTRY_ENGINE_META.requiredPackages;

  async createDocument(input?: EngineInput): Promise<EngineDocument> {
    if (input?.source?.data) return input.source.data as ChemEngineDocument;
    const doc: ChemEngineDocument = {
      engineId: "chemistry-engine",
      version: "1.0.0",
      elements: [],
      preferredOutput: "mhchem",
    };
    return doc;
  }

  async validate(document: EngineDocument): Promise<ValidationResult> {
    const doc = document as ChemEngineDocument;
    const issues = [];
    if (doc.engineId !== "chemistry-engine") {
      issues.push({ code: "WRONG_ENGINE", message: "Document was not created by chemistry-engine", severity: "error" as const });
    }
    if (!Array.isArray(doc.elements)) {
      issues.push({ code: "MISSING_ELEMENTS", message: "Elements array is required", severity: "error" as const });
    }
    return { valid: issues.filter(i => i.severity === "error").length === 0, issues };
  }

  async renderPreview(document: EngineDocument): Promise<PreviewResult> {
    const lines = serializeElements((document as ChemEngineDocument).elements);
    return { format: "svg", data: lines.join("\n") };
  }

  async export(document: EngineDocument, _target: "latex" | "pdf" | "svg" | "png"): Promise<ExportResult> {
    const doc = document as ChemEngineDocument;
    const lines = serializeElements(doc.elements);
    const hasStructures = doc.elements.some(e => e.type === "structure");

    const packages = ["mhchem"];
    if (hasStructures) packages.push("chemfig");

    return {
      format: "latex",
      content: lines.join("\n"),
      requiredPackages: packages,
      warnings: hasStructures ? ["Complex organic structures may require manual ChemFig adjustments."] : [],
    };
  }

  async getEditableSource(document: EngineDocument): Promise<EditableSource> {
    return {
      pluginId: "chemistry-engine",
      engineId: "chemistry-engine",
      version: "1.0.0",
      data: document,
    };
  }
}
