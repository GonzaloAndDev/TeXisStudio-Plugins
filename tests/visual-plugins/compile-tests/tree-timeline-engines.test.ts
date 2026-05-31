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
