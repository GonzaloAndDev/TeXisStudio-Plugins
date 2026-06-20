import type { GraphNodeDocument, GraphNode, GraphEdge, NodeShape } from "./types.js";

// Shapes that require \usetikzlibrary{shapes.geometric}
const GEOMETRIC_SHAPES: NodeShape[] = ["ellipse", "diamond"];

// Map from logical shape names to TikZ style strings
const SHAPE_STYLE: Partial<Record<NodeShape, string>> = {
  "none":             "coordinate",
  "rectangle":        "rectangle",
  "circle":           "circle",
  "ellipse":          "ellipse",
  "diamond":          "aspect=2, diamond",
  "rounded-rectangle":"rectangle, rounded corners=4pt",
};

function nodeStyle(node: GraphNode): string {
  const base = SHAPE_STYLE[node.shape] ?? node.shape;
  const parts = [base, "draw", "inner sep=4pt"];
  if (node.style) parts.push(node.style);
  if (node.shape === "none") return "coordinate";
  return parts.join(", ");
}

function escapeLatexText(text: string): string {
  return text
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/&/g, "\\&")
    .replace(/%/g, "\\%")
    .replace(/#/g, "\\#")
    .replace(/_/g, "\\_");
}

function escapeLatexOutsideMath(label: string): string {
  return label
    .split(/(\$[^$]*\$)/g)
    .map(part => part.startsWith("$") && part.endsWith("$") ? part : escapeLatexText(part))
    .join("");
}

// Sanitize a label for LaTeX: strip literal \n, normalise whitespace, and escape
// text-mode specials while preserving simple inline math fragments.
function sanitizeLabel(label: string): string {
  const normalized = label.replace(/\\n/g, " ").replace(/\n/g, " ").replace(/\s{2,}/g, " ").trim();
  return escapeLatexOutsideMath(normalized);
}

/**
 * Compute the best label position for an edge given the positions of
 * its source and target nodes.  The label gets a white fill so it reads
 * clearly over crossings.
 *
 *  - vertical edges   →  right of the midpoint
 *  - horizontal edges →  above the midpoint
 *  - diagonals        →  above, sloped
 */
function edgeLabelPos(from?: { x: number; y: number }, to?: { x: number; y: number }): string {
  if (!from || !to) return "midway, fill=white, font=\\scriptsize, inner sep=1pt";
  const dx = Math.abs((to.x ?? 0) - (from.x ?? 0));
  const dy = Math.abs((to.y ?? 0) - (from.y ?? 0));

  if (dy > dx * 1.8) return "midway, right, fill=white, font=\\scriptsize, inner sep=1pt";
  if (dx > dy * 1.8) return "midway, above, fill=white, font=\\scriptsize, inner sep=1pt";
  return "midway, fill=white, font=\\scriptsize, inner sep=1pt, sloped, above";
}

function serializeNode(node: GraphNode): string {
  const pos = node.position
    ? ` at (${node.position.x}cm, ${node.position.y}cm)`
    : "";
  const style = nodeStyle(node);
  if (node.shape === "none") {
    // Coordinate node — needs empty label {}
    return `  \\node[${style}] (${node.id})${pos} {};`;
  }
  // Regular node — label in text mode (not math) with proper font size
  const label = `{\\small ${sanitizeLabel(node.label)}}`;
  return `  \\node[${style}] (${node.id})${pos} ${label};`;
}

function edgeStyle(edge: GraphEdge): string {
  const parts: string[] = [];
  // Arrow tips
  if (edge.type === "directed")   parts.push("-{Stealth[scale=0.9]}");
  else if (edge.type === "bidirected") parts.push("{Stealth[scale=0.9]}-{Stealth[scale=0.9]}");
  else if (edge.type === "dashed") parts.push("-{Stealth[scale=0.9]}", "dashed");
  else if (edge.type === "dotted") parts.push("-{Stealth[scale=0.9]}", "dotted");
  // Thickness
  parts.push("semithick");
  if (edge.style) parts.push(edge.style);
  return `[${parts.join(", ")}]`;
}

function serializeEdge(edge: GraphEdge, nodePositions: Map<string, { x: number; y: number }>): string {
  const style = edgeStyle(edge);
  if (edge.from === edge.to) {
    const labelStr = edge.label
      ? ` node[above, fill=white, font=\\scriptsize, inner sep=1pt] {${sanitizeLabel(edge.label)}}`
      : "";
    return `  \\draw${style} (${edge.from}) edge[loop above]${labelStr} (${edge.to});`;
  }
  const fromPos = nodePositions.get(edge.from);
  const toPos   = nodePositions.get(edge.to);
  const labelPos = edgeLabelPos(fromPos, toPos);
  const labelStr = edge.label
    ? ` node[${labelPos}] {${sanitizeLabel(edge.label)}}`
    : "";
  return `  \\draw${style} (${edge.from}) -- (${edge.to})${labelStr};`;
}

export function serializeGraphNode(doc: GraphNodeDocument): string {
  // Build position map for smart label placement
  const posMap = new Map<string, { x: number; y: number }>();
  for (const n of doc.nodes) {
    if (n.position) posMap.set(n.id, n.position);
  }

  const nodeLines = doc.nodes.map(serializeNode);
  const edgeLines = doc.edges.map(e => serializeEdge(e, posMap));

  // Auto-include shapes.geometric when any geometric shape is used
  const usesGeometric = doc.nodes.some(n => GEOMETRIC_SHAPES.includes(n.shape));
  const autoLibs: string[] = ["arrows.meta", "positioning"];
  if (usesGeometric) autoLibs.push("shapes.geometric");
  // `tikzLibraries` es opcional en el doc: defensivo ante docs migrados o
  // editados a mano que no lo traigan (sin esto, el spread lanzaba TypeError).
  const libs = [...new Set([...autoLibs, ...(doc.tikzLibraries ?? [])])];
  const libStr = `\\usetikzlibrary{${libs.join(",")}}`;

  return [
    libStr,
    `\\begin{tikzpicture}[node distance=1.8cm, font=\\small]`,
    ...nodeLines,
    ...edgeLines,
    `\\end{tikzpicture}`,
  ].join("\n");
}
