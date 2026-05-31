import type { GraphNodeDocument, GraphNode, GraphEdge, NodeShape } from "./types.js";

// Shapes that require \usetikzlibrary{shapes.geometric}
const GEOMETRIC_SHAPES: NodeShape[] = ["ellipse", "diamond"];

// Map from logical shape names to TikZ style strings
const SHAPE_STYLE: Partial<Record<NodeShape, string>> = {
  "none":             "coordinate",
  "rectangle":        "rectangle",
  "circle":           "circle",
  "ellipse":          "ellipse",
  "diamond":          "diamond",
  "rounded-rectangle":"rectangle, rounded corners=4pt",
};

function nodeStyle(node: GraphNode): string {
  const base = SHAPE_STYLE[node.shape] ?? node.shape;
  const parts = [base];
  if (node.style) parts.push(node.style);
  return parts.join(", ");
}

// Sanitize a label: strip literal \n and collapse whitespace for LaTeX
function sanitizeLabel(label: string): string {
  return label.replace(/\\n/g, " ").replace(/\n/g, " ").replace(/\s{2,}/g, " ").trim();
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
  // TikZ \node always needs a label token even if empty ({}). Coordinate nodes get {}.
  const label = node.shape === "none" ? "{}" : `{${sanitizeLabel(node.label)}}`;
  return `  \\node[${style}] (${node.id})${pos} ${label};`;
}

function serializeEdge(edge: GraphEdge): string {
  const style = edgeStyle(edge);
  const label = edge.label
    ? ` node[midway, above, sloped, font=\\small] {${sanitizeLabel(edge.label)}}`
    : "";
  return `  \\draw${style} (${edge.from}) -- (${edge.to})${label};`;
}

export function serializeGraphNode(doc: GraphNodeDocument): string {
  const nodeLines = doc.nodes.map(serializeNode);
  const edgeLines = doc.edges.map(serializeEdge);

  // Auto-include shapes.geometric when any geometric shape is used
  const usesGeometric = doc.nodes.some(n => GEOMETRIC_SHAPES.includes(n.shape));
  const autoLibs = usesGeometric ? ["shapes.geometric"] : [];
  const libs = ["arrows.meta", "positioning", ...autoLibs, ...doc.tikzLibraries];
  const libStr = `\\usetikzlibrary{${[...new Set(libs)].join(",")}}`;

  return [
    libStr,
    `\\begin{tikzpicture}[node distance=2cm]`,
    ...nodeLines,
    ...edgeLines,
    `\\end{tikzpicture}`,
  ].join("\n");
}
