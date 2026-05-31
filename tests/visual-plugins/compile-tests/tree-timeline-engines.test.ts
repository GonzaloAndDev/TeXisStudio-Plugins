import { describe, it, expect } from "vitest";
import { TreeForestEngine } from "../../../visual-plugins/engines/tree-forest-engine/engine.js";
import { TimelineGanttEngine } from "../../../visual-plugins/engines/timeline-gantt-engine/engine.js";
import type { TreeForestDocument } from "../../../visual-plugins/engines/tree-forest-engine/types.js";
import type { TimelineGanttDocument } from "../../../visual-plugins/engines/timeline-gantt-engine/types.js";

const treeEng = new TreeForestEngine();
const ganttEng = new TimelineGanttEngine();

describe("TreeForestEngine", () => {
  it("generates forest environment", async () => {
    const doc: TreeForestDocument = {
      engineId: "tree-forest-engine", version: "1.0.0",
      style: "decision", growth: "south",
      root: { id: "root", label: "A", children: [
        { id: "b", label: "B", children: [] },
        { id: "c", label: "C", children: [] },
      ]},
    };
    const result = await treeEng.export(doc, "latex");
    expect(result.content).toContain("\\begin{forest}");
    expect(result.content).toContain("\\end{forest}");
    expect(result.requiredPackages).toContain("forest");
  });

  it("validates root presence", async () => {
    const doc = { engineId: "tree-forest-engine", version: "1.0.0", style: "syntax", growth: "south", root: null };
    const result = await treeEng.validate(doc as unknown as TreeForestDocument);
    expect(result.valid).toBe(false);
  });

  it("validates correct document", async () => {
    const doc: TreeForestDocument = {
      engineId: "tree-forest-engine", version: "1.0.0",
      style: "syntax", growth: "south",
      root: { id: "r", label: "S", children: [] },
    };
    const result = await treeEng.validate(doc);
    expect(result.valid).toBe(true);
  });
});

describe("TimelineGanttEngine", () => {
  it("generates ganttchart environment", async () => {
    const doc: TimelineGanttDocument = {
      engineId: "timeline-gantt-engine", version: "1.0.0",
      mode: "gantt", unit: "week",
      groups: [],
      tasks: [
        { id: "t1", label: "Task 1", start: "1", end: "3" },
        { id: "t2", label: "Task 2", start: "3", end: "5" },
      ],
    };
    const result = await ganttEng.export(doc, "latex");
    expect(result.content).toContain("\\begin{ganttchart}");
    expect(result.content).toContain("Task 1");
    expect(result.requiredPackages).toContain("pgfgantt");
  });

  it("names Gantt tasks so dependencies can link reliably", async () => {
    const doc: TimelineGanttDocument = {
      engineId: "timeline-gantt-engine", version: "1.0.0",
      mode: "gantt", unit: "week",
      groups: [{ id: "g1", label: "Phase 1 & setup" }],
      tasks: [
        { id: "task.1", label: "Literature & scope", start: "1", end: "3", group: "g1" },
        { id: "task.2", label: "Draft #1", start: "4", end: "5", group: "g1", dependsOn: ["task.1"] },
      ],
    };
    const result = await ganttEng.export(doc, "latex");
    expect(result.content).toContain("\\ganttgroup{Phase 1 \\& setup}");
    expect(result.content).toContain("\\ganttbar[name=task_1]{Literature \\& scope}");
    expect(result.content).toContain("\\ganttbar[name=task_2]{Draft \\#1}");
    expect(result.content).toContain("\\ganttlink{task_1}{task_2}");
  });

  it("generates tikzpicture for timeline mode", async () => {
    const doc: TimelineGanttDocument = {
      engineId: "timeline-gantt-engine", version: "1.0.0",
      mode: "timeline", unit: "year",
      groups: [],
      tasks: [
        { id: "e1", label: "Event A", start: "1900", end: "1900" },
        { id: "e2", label: "Event B", start: "1950", end: "1950" },
      ],
    };
    const result = await ganttEng.export(doc, "latex");
    expect(result.content).toContain("\\begin{tikzpicture}");
    expect(result.content).toContain("Event A");
    expect(result.requiredPackages).toContain("tikz");
    expect(result.requiredPackages).not.toContain("pgfgantt");
  });
});
