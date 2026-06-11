import { registerEditorMetadata } from "../../common/contracts/types.js";
import type { TimelineGanttDocument } from "./types.js";

const DEFAULT_DOC: TimelineGanttDocument = {
  engineId: "timeline-gantt-engine",
  version: "1.0.0",
  mode: "gantt",
  unit: "month",
  title: "Project Plan",
  groups: [{ id: "g1", label: "Phase 1" }],
  tasks: [
    { id: "t1", label: "Task A", start: "1", end: "3", group: "g1", dependsOn: [] },
    { id: "t2", label: "Task B", start: "2", end: "5", group: "g1", dependsOn: ["t1"] },
  ],
};

registerEditorMetadata({
  engineId: "timeline-gantt-engine",
  helpTopic: "figures",
  capabilities: {
    historySupported: true,
    restoreSupported: true,
    advancedCodeSupported: false,
    previewSupported: false,
  },
  technicalFields: [],
  defaultDoc: () => DEFAULT_DOC,
  description: "Gantt charts and timelines with groups, tasks, and dependencies",
});
