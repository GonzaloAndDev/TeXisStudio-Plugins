export type TimelineMode = "gantt" | "timeline" | "milestone";

export type TimeUnit = "day" | "week" | "month" | "year" | "custom";

export interface TimelineTask {
  id: string;
  label: string;
  start: string;
  end: string;
  group?: string;
  dependsOn?: string[];
  milestone?: boolean;
  progress?: number;
}

export interface TimelineGroup {
  id: string;
  label: string;
  color?: string;
}

export interface TimelineGanttDocument {
  engineId: "timeline-gantt-engine";
  version: string;
  mode: TimelineMode;
  unit: TimeUnit;
  tasks: TimelineTask[];
  groups: TimelineGroup[];
  title?: string;
  dateFormat?: string;
}
