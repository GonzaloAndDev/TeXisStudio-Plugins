export type ColumnType = "number" | "text" | "label" | "category";

export type TableExportTarget = "pgfplots" | "booktabs" | "longtable";

/** Alineación de columna. "decimal" usa una columna `S` de siunitx, que alinea
 *  los números por el punto decimal (estándar de oro en tablas científicas).
 *  Si se omite, se infiere del tipo: number → derecha, resto → izquierda. */
export type ColumnAlign = "left" | "center" | "right" | "decimal";

export interface DataColumn {
  id: string;
  header: string;
  type: ColumnType;
  unit?: string;
  latexHeader?: string;
  align?: ColumnAlign;
}

export interface DataRow {
  [columnId: string]: string | number;
}

export interface TableDataDocument {
  engineId: "table-data-engine";
  version: string;
  columns: DataColumn[];
  rows: DataRow[];
  title?: string;
  exportTarget: TableExportTarget;
  booktabsStyle: boolean;
}
