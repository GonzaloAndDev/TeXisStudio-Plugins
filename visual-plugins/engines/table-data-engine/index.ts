export type { ColumnType, TableExportTarget, DataColumn, DataRow, TableDataDocument } from "./types.js";

export const TABLE_DATA_ENGINE_ID = "table-data-engine" as const;

export const TABLE_DATA_ENGINE_META = {
  engineId: TABLE_DATA_ENGINE_ID,
  displayName: "Table / Data Engine",
  supportedOutputs: ["latex"] as const,
  requiredPackages: ["booktabs", "longtable"] as const,
} as const;
