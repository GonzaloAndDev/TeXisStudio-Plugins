import type { TableDataDocument, DataColumn } from "./types.js";

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

/** ¿Esta columna se alinea por decimal (columna `S` de siunitx)? */
function isDecimal(col: DataColumn): boolean {
  return col.align === "decimal";
}

/** Especificación de columna en el preámbulo de tabla. */
function colSpecFor(col: DataColumn): string {
  switch (col.align) {
    case "decimal": return "S";          // siunitx: alineación por punto decimal
    case "center":  return "c";
    case "left":    return "l";
    case "right":   return "r";
    default:        return col.type === "number" ? "r" : "l";
  }
}

function cellValue(value: string | number | undefined, col: DataColumn): string {
  // En columnas `S`, siunitx parsea el contenido como número: las celdas
  // vacías o no numéricas DEBEN ir entre llaves para no romper el parser.
  if (isDecimal(col)) {
    if (value === undefined || value === null || value === "") return "{}";
    const str = String(value).trim();
    return /^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(str) ? str : `{${escapeLatex(str)}}`;
  }
  if (value === undefined || value === null || value === "") return "";
  const str = String(value);
  if (col.type === "number") return str;
  return escapeLatex(str);
}

function headerCell(col: DataColumn): string {
  // En columnas `S` el encabezado va entre llaves para que siunitx lo trate
  // como texto y no intente parsearlo como número.
  const wrap = (s: string) => (isDecimal(col) ? `{${s}}` : s);
  if (col.latexHeader) return wrap(col.latexHeader);
  const base = escapeLatex(col.header);
  return wrap(col.unit ? `${base} (${escapeLatex(col.unit)})` : base);
}

export function serializeTableData(doc: TableDataDocument): string {
  const { columns, rows, exportTarget, booktabsStyle, title } = doc;
  if (columns.length === 0) return "% TableData: no columns defined\n";

  const colSpec = columns.map(colSpecFor).join("");
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
