import type { TableDataDocument, DataColumn, DataRow } from "./types.js";

function escapeLatex(str: string): string {
  return str
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
    .replace(/&/g, "\\&")
    .replace(/#/g, "\\#")
    .replace(/_/g, "\\_")
    .replace(/\^/g, "\\^{}")
    .replace(/\{/g, "\\{")
    .replace(/\}/g, "\\}")
    .replace(/~/g, "\\textasciitilde{}");
}

function cellValue(value: string | number | undefined, col: DataColumn): string {
  if (value === undefined || value === null || value === "") return "";
  const str = String(value);
  if (col.type === "number") return str;
  return escapeLatex(str);
}

function headerCell(col: DataColumn): string {
  if (col.latexHeader) return col.latexHeader;
  const base = escapeLatex(col.header);
  return col.unit ? `${base} (${escapeLatex(col.unit)})` : base;
}

export function serializeTableData(doc: TableDataDocument): string {
  const { columns, rows, exportTarget, booktabsStyle, title } = doc;
  if (columns.length === 0) return "% TableData: no columns defined\n";

  const colSpec = columns.map((c) => (c.type === "number" ? "r" : "l")).join("");
  const lines: string[] = [];

  if (exportTarget === "longtable") {
    lines.push(`\\begin{longtable}{${colSpec}}`);
    if (booktabsStyle) lines.push("\\toprule");
    else lines.push("\\hline");
    lines.push(columns.map(headerCell).join(" & ") + " \\\\");
    if (booktabsStyle) {
      lines.push("\\midrule");
      lines.push("\\endfirsthead");
      lines.push(columns.map(headerCell).join(" & ") + " \\\\");
      lines.push("\\midrule");
      lines.push("\\endhead");
    } else {
      lines.push("\\hline");
      lines.push("\\endhead");
    }
    for (const row of rows) {
      lines.push(columns.map((c) => cellValue(row[c.id], c)).join(" & ") + " \\\\");
    }
    if (booktabsStyle) lines.push("\\bottomrule");
    else lines.push("\\hline");
    lines.push("\\end{longtable}");
  } else if (exportTarget === "pgfplots") {
    lines.push("\\pgfplotstableread[col sep=comma]{");
    lines.push(columns.map((c) => c.header).join(","));
    for (const row of rows) {
      lines.push(columns.map((c) => String(row[c.id] ?? "")).join(","));
    }
    lines.push(`}\\${(title ?? "data").replace(/\W+/g, "")}table`);
  } else {
    // booktabs (default)
    lines.push(`\\begin{tabular}{${colSpec}}`);
    if (booktabsStyle) lines.push("\\toprule");
    else lines.push("\\hline");
    lines.push(columns.map(headerCell).join(" & ") + " \\\\");
    if (booktabsStyle) lines.push("\\midrule");
    else lines.push("\\hline");
    for (const row of rows) {
      lines.push(columns.map((c) => cellValue(row[c.id], c)).join(" & ") + " \\\\");
    }
    if (booktabsStyle) lines.push("\\bottomrule");
    else lines.push("\\hline");
    lines.push("\\end{tabular}");
  }

  return lines.join("\n");
}
