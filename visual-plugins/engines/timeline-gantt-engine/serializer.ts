import type { TimelineGanttDocument, TimelineTask, TimelineGroup } from "./types.js";

/** Escape LaTeX special characters in timeline/Gantt labels. */
function sanitizeLabel(label: string): string {
  return label
    .replace(/&/g, "\\&")
    .replace(/%/g, "\\%")
    .replace(/#/g, "\\#");
}

function sanitizeId(id: string): string {
  return id.replace(/[^A-Za-z0-9_-]/g, "_");
}

function ganttBar(task: TimelineTask): string {
  const label = sanitizeLabel(task.label);
  const name = sanitizeId(task.id);
  if (task.milestone) {
    return `  \\ganttmilestone[name=${name}]{${label}}{${task.start}}`;
  }
  return `  \\ganttbar[name=${name}]{${label}}{${task.start}}{${task.end}}`;
}

function ganttGroup(group: TimelineGroup, tasks: TimelineTask[]): string {
  const groupTasks = tasks.filter(t => t.group === group.id);
  if (groupTasks.length === 0) return "";
  const first = groupTasks[0]!;
  const last  = groupTasks[groupTasks.length - 1]!;
  const lines = [
    `  \\ganttgroup{${sanitizeLabel(group.label)}}{${first.start}}{${last.end}}`,
    ...groupTasks.map(ganttBar),
  ];
  return lines.join(" \\\\\n");
}

export function serializeGantt(doc: TimelineGanttDocument): string {
  const allTasks = doc.tasks;
  const ungrouped = allTasks.filter(t => !t.group);

  const totalStart = allTasks[0]?.start ?? "1";
  const totalEnd   = allTasks[allTasks.length - 1]?.end ?? "10";
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
      deps.push(`  \\ganttlink{${sanitizeId(dep)}}{${sanitizeId(task.id)}}`);
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
    lines.push(`  \\node[above, font=\\tiny, align=center] at (${x}cm, 6pt) {${sanitizeLabel(ev.start)}};`);
    lines.push(`  \\node[below, font=\\small, align=center, text width=1.5cm] at (${x}cm, -10pt) {${sanitizeLabel(ev.label)}};`);
  });
  lines.push(`\\end{tikzpicture}`);
  return lines.join("\n");
}

export function serialize(doc: TimelineGanttDocument): string {
  return doc.mode === "timeline" ? serializeTimeline(doc) : serializeGantt(doc);
}
