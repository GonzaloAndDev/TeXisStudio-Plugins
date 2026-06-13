import { registerEditorMetadata } from "../../common/contracts/types.js";
import type { TableDataDocument } from "./types.js";

const DEFAULT_DOC: TableDataDocument = {
  engineId: "table-data-engine",
  version: "1.0.0",
  columns: [
    { id: "c1", header: "Group", type: "category" },
    { id: "c2", header: "Value", type: "number", unit: "" },
  ],
  rows: [
    { c1: "A", c2: 10 },
    { c1: "B", c2: 25 },
    { c1: "C", c2: 17 },
  ],
  exportTarget: "booktabs",
  booktabsStyle: true,
};

registerEditorMetadata({
  engineId: "table-data-engine",
  helpTopic: "figures",
  capabilities: {
    historySupported: true,
    restoreSupported: true,
    advancedCodeSupported: false,
    previewSupported: false,
  },
  technicalFields: [],
  defaultDoc: () => DEFAULT_DOC,
  descriptionKey: "visual_editor.engines.table_data.description",
});
