export type { NodeShape, EdgeType, LayoutAlgorithm, GraphNode, GraphEdge, GraphNodeDocument } from "./types.js";
export { GraphNodeEngine } from "./engine.js";
export { serializeGraphNode } from "./serializer.js";

export const GRAPH_NODE_ENGINE_ID = "graph-node-engine" as const;

export const GRAPH_NODE_ENGINE_META = {
  engineId: GRAPH_NODE_ENGINE_ID,
  displayName: "Graph / Node Engine",
  supportedOutputs: ["latex", "pdf", "svg"] as const,
  requiredPackages: ["tikz"] as const,
} as const;
