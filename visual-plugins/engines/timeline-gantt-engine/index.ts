export type { TimelineMode, TimeUnit, TimelineTask, TimelineGroup, TimelineGanttDocument } from "./types.js";
export { TimelineGanttEngine } from "./engine.js";
export { serialize, serializeGantt, serializeTimeline } from "./serializer.js";

export const TIMELINE_GANTT_ENGINE_ID = "timeline-gantt-engine" as const;

export const TIMELINE_GANTT_ENGINE_META = {
  engineId: TIMELINE_GANTT_ENGINE_ID,
  displayName: "Timeline / Gantt Engine",
  supportedOutputs: ["latex", "pdf"] as const,
  requiredPackages: ["pgfgantt", "tikz"] as const,
} as const;
