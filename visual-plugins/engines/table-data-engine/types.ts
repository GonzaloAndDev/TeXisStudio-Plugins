export type ColumnType = "number" | "text" | "label" | "category";

export type TableExportTarget = "pgfplots" | "booktabs" | "longtable";

export interface DataColumn {
  id: string;
  header: string;
  type: ColumnType;
  unit?: string;
  latexHeader?: string;
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
