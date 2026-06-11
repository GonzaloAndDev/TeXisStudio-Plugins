import { registerEditorMetadata } from "../../common/contracts/types.js";
import type { TreeForestDocument } from "./types.js";

const DEFAULT_DOC: TreeForestDocument = {
  engineId: "tree-forest-engine",
  version: "1.0.0",
  root: {
    id: "root",
    label: "Root",
    children: [
      { id: "c1", label: "Child A", children: [] },
      { id: "c2", label: "Child B", children: [
        { id: "c21", label: "Leaf", children: [] },
      ]},
    ],
  },
  style: "syntax",
  growth: "south",
};

registerEditorMetadata({
  engineId: "tree-forest-engine",
  helpTopic: "figures",
  capabilities: {
    historySupported: true,
    restoreSupported: true,
    advancedCodeSupported: false,
    previewSupported: false,
  },
  technicalFields: [
    {
      key: "forestOptions",
      label: "Forest options",
      description: "Extra options passed to the forest environment (e.g. forked edges, edge label style)",
      type: "textarea",
    },
  ],
  defaultDoc: () => DEFAULT_DOC,
  description: "Hierarchical trees: syntax, taxonomic, phylogenetic, decision, and probability trees",
});
