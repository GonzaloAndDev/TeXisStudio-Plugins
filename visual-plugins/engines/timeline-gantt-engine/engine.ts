import type { VisualEngine, EngineDocument, EngineInput, ValidationResult, PreviewResult, ExportResult, EditableSource } from "../../common/contracts/index.js";
import type { TimelineGanttDocument } from "./types.js";
import { serialize } from "./serializer.js";
import { TIMELINE_GANTT_ENGINE_META } from "./index.js";

export class TimelineGanttEngine implements VisualEngine {
  readonly engineId = TIMELINE_GANTT_ENGINE_META.engineId;
  readonly displayName = TIMELINE_GANTT_ENGINE_META.displayName;
  readonly supportedOutputs = TIMELINE_GANTT_ENGINE_META.supportedOutputs;
  readonly requiredPackages = TIMELINE_GANTT_ENGINE_META.requiredPackages;

  async createDocument(input?: EngineInput): Promise<EngineDocument> {
    if (input?.source?.data) return input.source.data as TimelineGanttDocument;
    const doc: TimelineGanttDocument = {
      engineId: "timeline-gantt-engine", version: "1.0.0",
      mode: "gantt", unit: "week",
      tasks: [], groups: [],
    };
    return doc;
  }

  async validate(document: EngineDocument): Promise<ValidationResult> {
    const doc = document as TimelineGanttDocument;
    const issues = [];
    if (doc.engineId !== "timeline-gantt-engine") {
      issues.push({ code: "WRONG_ENGINE", message: "Document was not created by timeline-gantt-engine", severity: "error" as const });
    }
    if (!Array.isArray(doc.tasks)) {
      issues.push({ code: "MISSING_TASKS", message: "Tasks array is required", severity: "error" as const });
    }
    return { valid: issues.filter(i => i.severity === "error").length === 0, issues };
  }

  async renderPreview(document: EngineDocument): Promise<PreviewResult> {
    return { format: "svg", data: serialize(document as TimelineGanttDocument) };
  }

  async export(document: EngineDocument, _target: "latex" | "pdf" | "svg" | "png"): Promise<ExportResult> {
    const doc = document as TimelineGanttDocument;
    const packages = doc.mode === "gantt" ? ["pgfgantt", "tikz"] : ["tikz"];
    return {
      format: "latex",
      content: serialize(doc),
      requiredPackages: packages,
      warnings: [],
    };
  }

  async getEditableSource(document: EngineDocument): Promise<EditableSource> {
    return { pluginId: "timeline-gantt-engine", engineId: "timeline-gantt-engine", version: "1.0.0", data: document };
  }
}
