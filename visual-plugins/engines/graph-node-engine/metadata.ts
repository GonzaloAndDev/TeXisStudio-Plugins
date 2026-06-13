import { registerEditorMetadata } from "../../common/contracts/types.js";
import type { GraphNodeDocument } from "./types.js";

const DEFAULT_DOC: GraphNodeDocument = {
  engineId: "graph-node-engine",
  version: "1.0.0",
  nodes: [
    { id: "A", label: "A", shape: "circle" },
    { id: "B", label: "B", shape: "circle" },
    { id: "C", label: "C", shape: "circle" },
  ],
  edges: [
    { id: "e1", from: "A", to: "B", type: "directed" },
    { id: "e2", from: "B", to: "C", type: "directed" },
  ],
  layout: "manual",
  tikzLibraries: ["arrows.meta", "positioning"],
  directed: true,
};

registerEditorMetadata({
  engineId: "graph-node-engine",
  helpTopic: "figures",
  capabilities: {
    historySupported: true,
    restoreSupported: true,
    advancedCodeSupported: false,
    previewSupported: false,
  },
  technicalFields: [
    {
      key: "tikzLibraries",
      labelKey: "visual_editor.fields.tikz_libraries.label",
      descriptionKey: "visual_editor.fields.tikz_libraries.description",
      type: "string",
    },
  ],
  defaultDoc: () => DEFAULT_DOC,
  descriptionKey: "visual_editor.engines.graph_node.description",
});
