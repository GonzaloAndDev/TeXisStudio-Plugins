import { BasePlugin } from "../../common/plugin-base/index.js";
import { TimelineGanttEngine } from "../../engines/timeline-gantt-engine/engine.js";
import type { TimelineGanttDocument } from "../../engines/timeline-gantt-engine/types.js";

// Shared engine instance
const engine = new TimelineGanttEngine();

// ── Plugin 20 — Gantt Charts ──────────────────────────────────────

export class GanttPlugin extends BasePlugin<TimelineGanttDocument> {
  constructor() {
    super(engine, {
      pluginId:        "gantt-charts",
      displayName:     "Gantt Charts",
      description:     "Research and project Gantt charts with tasks, groups, milestones, and dependencies. pgfgantt native.",
      category:        "engineering-cs",
      engineId:        "timeline-gantt-engine",
      qualityLevel:    "official-core",
      requiredPackages: ["pgfgantt", "tikz"],
      blockKind:       "input",
      defaultCaption:  "Research schedule.",
      defaultLabel:    "fig:gantt",
    });
  }

  protected buildDefaultDocument(): TimelineGanttDocument {
    return {
      engineId: "timeline-gantt-engine", version: "1.0.0",
      mode: "gantt", unit: "week",
      groups: [
        { id: "phase1", label: "Phase 1: Design" },
        { id: "phase2", label: "Phase 2: Implementation" },
      ],
      tasks: [
        { id: "t1", label: "Literature review",  start: "1",  end: "3",  group: "phase1" },
        { id: "t2", label: "Methodology design", start: "3",  end: "5",  group: "phase1" },
        { id: "t3", label: "Data collection",    start: "5",  end: "9",  group: "phase2" },
        { id: "t4", label: "Analysis",           start: "9",  end: "12", group: "phase2" },
        { id: "m1", label: "Submission",         start: "12", end: "12", milestone: true },
      ],
    };
  }
}

// ── Plugin 33 — Timelines ─────────────────────────────────────────

export class TimelinePlugin extends BasePlugin<TimelineGanttDocument> {
  constructor() {
    super(engine, {
      pluginId:        "timelines",
      displayName:     "Timelines",
      description:     "Historical, research, and narrative timelines with labeled events.",
      category:        "humanities-social",
      engineId:        "timeline-gantt-engine",
      qualityLevel:    "official-core",
      requiredPackages: ["tikz"],
      blockKind:       "input",
      defaultCaption:  "Historical timeline.",
      defaultLabel:    "fig:timeline",
    });
  }

  protected buildDefaultDocument(): TimelineGanttDocument {
    return {
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
  }
}
