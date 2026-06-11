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
      label: "TikZ libraries",
      description: "Comma-separated list of extra TikZ libraries to load (e.g. calc, shapes.geometric)",
      type: "string",
    },
  ],
  defaultDoc: () => DEFAULT_DOC,
  description: "Directed and undirected graphs: nodes, edges, shapes, and arc styles",
});
