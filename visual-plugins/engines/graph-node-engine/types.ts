export type NodeShape = "circle" | "rectangle" | "diamond" | "ellipse" | "rounded-rectangle" | "none";
export type EdgeType = "directed" | "undirected" | "bidirected" | "dashed" | "dotted";
export type LayoutAlgorithm = "manual" | "tree" | "layered" | "circular" | "force";

export interface GraphNode {
  id: string;
  label: string;
  shape: NodeShape;
  position?: { x: number; y: number };
  style?: string;
  group?: string;
}

export interface GraphEdge {
  id: string;
  from: string;
  to: string;
  type: EdgeType;
  label?: string;
  weight?: number;
  style?: string;
}

export interface GraphNodeDocument {
  engineId: "graph-node-engine";
  version: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  layout: LayoutAlgorithm;
  tikzLibraries: string[];
  directed: boolean;
}
