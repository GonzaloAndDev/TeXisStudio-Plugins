import type { VisualEngine, EngineDocument, EngineInput, ValidationResult, PreviewResult, ExportResult, EditableSource } from "../../common/contracts/index.js";
import type { CircuiTikZDocument } from "./types.js";
import { serializeCircuit } from "./serializer.js";
import { CIRCUITIKZ_ENGINE_META } from "./index.js";

export class CircuiTikZEngine implements VisualEngine {
  readonly engineId = CIRCUITIKZ_ENGINE_META.engineId;
  readonly displayName = CIRCUITIKZ_ENGINE_META.displayName;
  readonly supportedOutputs = CIRCUITIKZ_ENGINE_META.supportedOutputs;
  readonly requiredPackages = CIRCUITIKZ_ENGINE_META.requiredPackages;

  async createDocument(input?: EngineInput): Promise<EngineDocument> {
    if (input?.source?.data) return input.source.data as CircuiTikZDocument;
    const doc: CircuiTikZDocument = {
      engineId: "circuitikz-engine", version: "1.0.0",
      nodes: [], components: [], connections: [], americanStyle: true,
    };
    return doc;
  }

  async validate(document: EngineDocument): Promise<ValidationResult> {
    const doc = document as CircuiTikZDocument;
    const issues = [];
    if (doc.engineId !== "circuitikz-engine") {
      issues.push({ code: "WRONG_ENGINE", message: "Document was not created by circuitikz-engine", severity: "error" as const });
    }
    const nodeIds = new Set(doc.nodes.map(n => n.id));
    for (const comp of doc.components) {
      if (!nodeIds.has(comp.from)) {
        issues.push({ code: "DANGLING_COMPONENT", message: `Component "${comp.id}" references unknown node "${comp.from}"`, severity: "error" as const });
      }
      if (!nodeIds.has(comp.to)) {
        issues.push({ code: "DANGLING_COMPONENT", message: `Component "${comp.id}" references unknown node "${comp.to}"`, severity: "error" as const });
      }
    }
    return { valid: issues.filter(i => i.severity === "error").length === 0, issues };
  }

  async renderPreview(document: EngineDocument): Promise<PreviewResult> {
    return { format: "svg", data: serializeCircuit(document as CircuiTikZDocument) };
  }

  async export(document: EngineDocument, _target: "latex" | "pdf" | "svg" | "png"): Promise<ExportResult> {
    return {
      format: "latex",
      content: serializeCircuit(document as CircuiTikZDocument),
      requiredPackages: ["circuitikz"],
      warnings: [],
    };
  }

  async getEditableSource(document: EngineDocument): Promise<EditableSource> {
    return { pluginId: "circuitikz-engine", engineId: "circuitikz-engine", version: "1.0.0", data: document };
  }
}
