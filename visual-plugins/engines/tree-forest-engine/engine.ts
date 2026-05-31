import type { VisualEngine, EngineDocument, EngineInput, ValidationResult, PreviewResult, ExportResult, EditableSource } from "../../common/contracts/index.js";
import type { TreeForestDocument } from "./types.js";
import { serializeForest } from "./serializer.js";
import { TREE_FOREST_ENGINE_META } from "./index.js";

export class TreeForestEngine implements VisualEngine {
  readonly engineId = TREE_FOREST_ENGINE_META.engineId;
  readonly displayName = TREE_FOREST_ENGINE_META.displayName;
  readonly supportedOutputs = TREE_FOREST_ENGINE_META.supportedOutputs;
  readonly requiredPackages = TREE_FOREST_ENGINE_META.requiredPackages;

  async createDocument(input?: EngineInput): Promise<EngineDocument> {
    if (input?.source?.data) return input.source.data as TreeForestDocument;
    const doc: TreeForestDocument = {
      engineId: "tree-forest-engine", version: "1.0.0",
      root: { id: "root", label: "Root", children: [] },
      style: "decision", growth: "south",
    };
    return doc;
  }

  async validate(document: EngineDocument): Promise<ValidationResult> {
    const doc = document as TreeForestDocument;
    const issues = [];
    if (doc.engineId !== "tree-forest-engine") {
      issues.push({ code: "WRONG_ENGINE", message: "Document was not created by tree-forest-engine", severity: "error" as const });
    }
    if (!doc.root) {
      issues.push({ code: "MISSING_ROOT", message: "Tree must have a root node", severity: "error" as const });
    }
    return { valid: issues.filter(i => i.severity === "error").length === 0, issues };
  }

  async renderPreview(document: EngineDocument): Promise<PreviewResult> {
    return { format: "svg", data: serializeForest(document as TreeForestDocument) };
  }

  async export(document: EngineDocument, _target: "latex" | "pdf" | "svg" | "png"): Promise<ExportResult> {
    return {
      format: "latex",
      content: serializeForest(document as TreeForestDocument),
      requiredPackages: ["forest"],
      warnings: [],
    };
  }

  async getEditableSource(document: EngineDocument): Promise<EditableSource> {
    return { pluginId: "tree-forest-engine", engineId: "tree-forest-engine", version: "1.0.0", data: document };
  }
}
