import type { TimelineGanttDocument, TimelineTask, TimelineGroup, TimelineMode } from "./types.js";

function ganttBar(task: TimelineTask): string {
  if (task.milestone) {
    return `  \\ganttmilestone{${task.label}}{${task.start}}`;
  }
  return `  \\ganttbar{${task.label}}{${task.start}}{${task.end}}`;
}

function ganttGroup(group: TimelineGroup, tasks: TimelineTask[]): string {
  const groupTasks = tasks.filter(t => t.group === group.id);
  if (groupTasks.length === 0) return "";
  const first = groupTasks[0]!;
  const last  = groupTasks[groupTasks.length - 1]!;
  const lines = [
    `  \\ganttgroup{${group.label}}{${first.start}}{${last.end}}`,
    ...groupTasks.map(ganttBar),
  ];
  return lines.join(" \\\\\n");
}

export function serializeGantt(doc: TimelineGanttDocument): string {
  const allTasks = doc.tasks;
  const ungrouped = allTasks.filter(t => !t.group);

  const totalStart = allTasks[0]?.start ?? "1";
  const totalEnd   = allTasks[allTasks.length - 1]?.end ?? "10";
  const unit = doc.unit === "week" ? "week" : doc.unit === "month" ? "month" : "day";

  const header = [
    `\\begin{ganttchart}[`,
    `  hgrid, vgrid,`,
    `  x unit=0.7cm, y unit chart=0.6cm,`,
    `  title label font=\\small,`,
    `  bar label font=\\small`,
    `]{${totalStart}}{${totalEnd}}`,
    `  \\gantttitlelist{${totalStart},...,${totalEnd}}{1} \\\\`,
  ];

  const body: string[] = [];
  for (const group of doc.groups) {
    const section = ganttGroup(group, allTasks);
    if (section) body.push(section + " \\\\");
  }
  for (const task of ungrouped) {
    body.push(ganttBar(task) + " \\\\");
  }

  // dependencies
  const deps: string[] = [];
  for (const task of allTasks) {
    for (const dep of task.dependsOn ?? []) {
      deps.push(`  \\ganttlink{${dep}}{${task.id}}`);
    }
  }

  return [...header, ...body, ...deps, `\\end{ganttchart}`].join("\n");
}

export function serializeTimeline(doc: TimelineGanttDocument): string {
  const events = doc.tasks;
  const lines = [
    `\\begin{tikzpicture}`,
    `  \\draw[-stealth] (0,0) -- (${events.length + 1}cm, 0);`,
  ];
  events.forEach((ev, i) => {
    const x = i + 1;
    lines.push(`  \\draw (${x}cm, 3pt) -- (${x}cm, -3pt);`);
    lines.push(`  \\node[above, font=\\tiny, align=center] at (${x}cm, 6pt) {${ev.start}};`);
    lines.push(`  \\node[below, font=\\small, align=center, text width=1.5cm] at (${x}cm, -10pt) {${ev.label}};`);
  });
  lines.push(`\\end{tikzpicture}`);
  return lines.join("\n");
}

export function serialize(doc: TimelineGanttDocument): string {
  return doc.mode === "timeline" ? serializeTimeline(doc) : serializeGantt(doc);
}
