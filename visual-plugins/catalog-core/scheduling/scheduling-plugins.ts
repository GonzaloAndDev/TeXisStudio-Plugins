import type { VisualDiagramPlugin, VisualFigureResult, ValidationResult } from "../../common/contracts/index.js";
import { buildLatexInputBlock } from "../../common/export/latex-block.js";
import { TimelineGanttEngine } from "../../engines/timeline-gantt-engine/engine.js";
import type { TimelineGanttDocument } from "../../engines/timeline-gantt-engine/types.js";

const engine = new TimelineGanttEngine();

function fid(): string { return `fig_${Math.floor(Math.random() * 9000) + 1000}`; }

async function buildResult(id: string, pluginId: string, doc: TimelineGanttDocument, caption: string, label: string): Promise<VisualFigureResult> {
  const exp = await engine.export(doc, "latex");
  const texPath = `texisstudio-assets/figures/${id}/output.tex`;
  return {
    figureId: id, pluginId, engineId: "timeline-gantt-engine",
    latexBlock: buildLatexInputBlock({ figureId: id, inputPath: texPath, caption, label }),
    requiredPackages: exp.requiredPackages,
    sourcePath: `texisstudio-assets/figures/${id}/source.json`,
    outputPaths: { tex: texPath }, warnings: [],
  };
}

// Plugin 20 — Gantt charts
export class GanttPlugin implements VisualDiagramPlugin {
  readonly pluginId = "gantt-charts";
  readonly displayName = "Gantt Charts";
  readonly description = "Research and project Gantt charts with tasks, groups, milestones, and dependencies. pgfgantt native.";
  readonly category = "engineering-cs" as const;
  readonly engineId = "timeline-gantt-engine";
  readonly qualityLevel = "official-core" as const;
  readonly requiredPackages = ["pgfgantt", "tikz"] as const;

  async create(): Promise<VisualFigureResult> {
    const id = fid();
    const doc: TimelineGanttDocument = {
      engineId: "timeline-gantt-engine", version: "1.0.0",
      mode: "gantt", unit: "week",
      groups: [{ id: "phase1", label: "Phase 1: Design" }, { id: "phase2", label: "Phase 2: Implementation" }],
      tasks: [
        { id: "t1", label: "Literature review",   start: "1",  end: "3",  group: "phase1" },
        { id: "t2", label: "Methodology design",  start: "3",  end: "5",  group: "phase1" },
        { id: "t3", label: "Data collection",     start: "5",  end: "9",  group: "phase2" },
        { id: "t4", label: "Analysis",            start: "9",  end: "12", group: "phase2" },
        { id: "m1", label: "Submission",          start: "12", end: "12", milestone: true },
      ],
    };
    return buildResult(id, this.pluginId, doc, "Research schedule.", "fig:gantt");
  }

  async edit(_p: string): Promise<VisualFigureResult> { return this.create(); }
  async validate(_r: VisualFigureResult): Promise<ValidationResult> { return { valid: true, issues: [] }; }
  exportLatexBlock(r: VisualFigureResult): string { return r.latexBlock; }
}

// Plugin 33 — Timelines
export class TimelinePlugin implements VisualDiagramPlugin {
  readonly pluginId = "timelines";
  readonly displayName = "Timelines";
  readonly description = "Historical, research, and narrative timelines with labeled events.";
  readonly category = "humanities-social" as const;
  readonly engineId = "timeline-gantt-engine";
  readonly qualityLevel = "official-core" as const;
  readonly requiredPackages = ["tikz"] as const;

  async create(): Promise<VisualFigureResult> {
    const id = fid();
    const doc: TimelineGanttDocument = {
      engineId: "timeline-gantt-engine", version: "1.0.0",
      mode: "timeline", unit: "year",
      groups: [],
      tasks: [
        { id: "e1", label: "Event A", start: "1900", end: "1900" },
        { id: "e2", label: "Event B", start: "1920", end: "1920" },
        { id: "e3", label: "Event C", start: "1945", end: "1945" },
        { id: "e4", label: "Event D", start: "1968", end: "1968" },
      ],
    };
    return buildResult(id, this.pluginId, doc, "Historical timeline.", "fig:timeline");
  }

  async edit(_p: string): Promise<VisualFigureResult> { return this.create(); }
  async validate(_r: VisualFigureResult): Promise<ValidationResult> { return { valid: true, issues: [] }; }
  exportLatexBlock(r: VisualFigureResult): string { return r.latexBlock; }
}
