import type { GraphNodeDocument, GraphNode, GraphEdge } from "./types.js";

function nodeStyle(node: GraphNode): string {
  const parts: string[] = [node.shape === "none" ? "coordinate" : node.shape];
  if (node.style) parts.push(node.style);
  return parts.join(", ");
}

function edgeStyle(edge: GraphEdge): string {
  const parts: string[] = [];
  switch (edge.type) {
    case "directed":   parts.push("-stealth"); break;
    case "bidirected": parts.push("stealth-stealth"); break;
    case "dashed":     parts.push("-stealth", "dashed"); break;
    case "dotted":     parts.push("-stealth", "dotted"); break;
    default: break;
  }
  if (edge.style) parts.push(edge.style);
  return parts.length > 0 ? `[${parts.join(", ")}]` : "";
}

function serializeNode(node: GraphNode): string {
  const pos = node.position
    ? ` at (${node.position.x}cm, ${node.position.y}cm)`
    : "";
  const style = nodeStyle(node);
  const label = node.shape === "none" ? "" : `{$${node.label}$}`;
  return `  \\node[${style}] (${node.id})${pos} ${label};`;
}

function serializeEdge(edge: GraphEdge): string {
  const style = edgeStyle(edge);
  const label = edge.label ? ` node[midway, above, sloped] {${edge.label}}` : "";
  return `  \\draw${style} (${edge.from}) -- (${edge.to})${label};`;
}

export function serializeGraphNode(doc: GraphNodeDocument): string {
  const nodeLines = doc.nodes.map(serializeNode);
  const edgeLines = doc.edges.map(serializeEdge);
  const libs = ["arrows.meta", "positioning", ...doc.tikzLibraries];
  const libStr = `\\usetikzlibrary{${[...new Set(libs)].join(",")}}`;
  return [
    libStr,
    `\\begin{tikzpicture}[node distance=2cm]`,
    ...nodeLines,
    ...edgeLines,
    `\\end{tikzpicture}`,
  ].join("\n");
}
