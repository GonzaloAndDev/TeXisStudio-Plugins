import { BasePlugin } from "../../common/plugin-base/index.js";
import { TimelineGanttEngine } from "../../engines/timeline-gantt-engine/engine.js";
import type { TimelineGanttDocument } from "../../engines/timeline-gantt-engine/types.js";

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
      defaultCaption:  "Doctoral research schedule by semester.",
      defaultLabel:    "fig:gantt",
    });
  }

  protected buildDefaultDocument(): TimelineGanttDocument {
    // 3-phase doctoral timeline — the most common Gantt in a thesis
    return {
      engineId: "timeline-gantt-engine", version: "1.0.0",
      mode: "gantt", unit: "month",
      groups: [
        { id: "phase1", label: "Phase 1 — Foundations" },
        { id: "phase2", label: "Phase 2 — Fieldwork" },
        { id: "phase3", label: "Phase 3 — Writing" },
      ],
      tasks: [
        { id: "t1",  label: "Literature review",          start: "1",  end: "4",  group: "phase1" },
        { id: "t2",  label: "Theoretical framework",      start: "3",  end: "6",  group: "phase1" },
        { id: "t3",  label: "Research design and ethics",  start: "5",  end: "7",  group: "phase1" },
        { id: "m1",  label: "Proposal defence",           start: "7",  end: "7",  milestone: true },
        { id: "t4",  label: "Instrument development",     start: "7",  end: "9",  group: "phase2" },
        { id: "t5",  label: "Data collection",            start: "9",  end: "15", group: "phase2" },
        { id: "t6",  label: "Data analysis",              start: "14", end: "19", group: "phase2" },
        { id: "m2",  label: "Progress report",            start: "18", end: "18", milestone: true },
        { id: "t7",  label: "Results chapter",            start: "19", end: "22", group: "phase3" },
        { id: "t8",  label: "Discussion and conclusions",  start: "22", end: "25", group: "phase3" },
        { id: "t9",  label: "Revision & editing",         start: "24", end: "27", group: "phase3" },
        { id: "m3",  label: "Thesis submission",          start: "27", end: "27", milestone: true },
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
      defaultCaption:  "Key milestones in molecular biology (1944--2003).",
      defaultLabel:    "fig:timeline",
    });
  }

  protected buildDefaultDocument(): TimelineGanttDocument {
    // Molecular biology milestones — universally recognized in life sciences theses
    return {
      engineId: "timeline-gantt-engine", version: "1.0.0",
      mode: "timeline", unit: "year",
      groups: [],
      tasks: [
        { id: "e1", label: "Avery: DNA is genetic material",         start: "1944", end: "1944" },
        { id: "e2", label: "Watson \\& Crick: DNA double helix",     start: "1953", end: "1953" },
        { id: "e3", label: "Nirenberg: genetic code cracked",        start: "1961", end: "1961" },
        { id: "e4", label: "Sanger: DNA sequencing method",          start: "1977", end: "1977" },
        { id: "e5", label: "PCR invented (Mullis)",                  start: "1983", end: "1983" },
        { id: "e6", label: "Human Genome Project completed",         start: "2003", end: "2003" },
      ],
    };
  }
}
