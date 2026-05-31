import type { VisualEngine, EngineDocument, EngineInput, ValidationResult, PreviewResult, ExportResult, EditableSource } from "../../common/contracts/index.js";
import type { GraphNodeDocument } from "./types.js";
import { serializeGraphNode } from "./serializer.js";
import { GRAPH_NODE_ENGINE_META } from "./index.js";

export class GraphNodeEngine implements VisualEngine {
  readonly engineId = GRAPH_NODE_ENGINE_META.engineId;
  readonly displayName = GRAPH_NODE_ENGINE_META.displayName;
  readonly supportedOutputs = GRAPH_NODE_ENGINE_META.supportedOutputs;
  readonly requiredPackages = GRAPH_NODE_ENGINE_META.requiredPackages;

  async createDocument(input?: EngineInput): Promise<EngineDocument> {
    if (input?.source?.data) return input.source.data as GraphNodeDocument;
    const doc: GraphNodeDocument = {
      engineId: "graph-node-engine", version: "1.0.0",
      nodes: [], edges: [], layout: "manual",
      tikzLibraries: [], directed: true,
    };
    return doc;
  }

  async validate(document: EngineDocument): Promise<ValidationResult> {
    const doc = document as GraphNodeDocument;
    const issues = [];
    if (doc.engineId !== "graph-node-engine") {
      issues.push({ code: "WRONG_ENGINE", message: "Document was not created by graph-node-engine", severity: "error" as const });
    }
    const nodeIds = new Set(doc.nodes.map(n => n.id));
    for (const edge of doc.edges) {
      if (!nodeIds.has(edge.from)) {
        issues.push({ code: "DANGLING_EDGE", message: `Edge "${edge.id}" references unknown node "${edge.from}"`, severity: "error" as const });
      }
      if (!nodeIds.has(edge.to)) {
        issues.push({ code: "DANGLING_EDGE", message: `Edge "${edge.id}" references unknown node "${edge.to}"`, severity: "error" as const });
      }
    }
    return { valid: issues.filter(i => i.severity === "error").length === 0, issues };
  }

  async renderPreview(document: EngineDocument): Promise<PreviewResult> {
    return { format: "svg", data: serializeGraphNode(document as GraphNodeDocument) };
  }

  async export(document: EngineDocument, _target: "latex" | "pdf" | "svg" | "png"): Promise<ExportResult> {
    return {
      format: "latex",
      content: serializeGraphNode(document as GraphNodeDocument),
      requiredPackages: ["tikz"],
      warnings: [],
    };
  }

  async getEditableSource(document: EngineDocument): Promise<EditableSource> {
    return { pluginId: "graph-node-engine", engineId: "graph-node-engine", version: "1.0.0", data: document };
  }
}
