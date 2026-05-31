import type { TreeForestDocument, TreeNode, TreeStyle } from "./types.js";

function stylePreset(style: TreeStyle): string {
  switch (style) {
    case "syntax":
      return "for tree={font=\\small, grow'=0, l sep=2em, s sep=1em}";
    case "taxonomic":
    case "phylogenetic":
      // edge path uses {{}..{}} — exactly two closing braces: one for edge path, one for for tree
      return "for tree={font=\\small, grow=south, l sep=1.5em, s sep=1em, edge path={\\noexpand\\path[\\forestoption{edge}] (!u.south) -- (.north)\\forestoption{edge label};}}";
    case "genealogy":
      return "for tree={font=\\small, grow=south, l sep=2em, s sep=2em}";
    case "decision":
      return "for tree={font=\\small, grow=south, l sep=2em, s sep=2em, draw, rounded corners}";
    case "probability":
      return "for tree={font=\\small, grow=east, l sep=3em, s sep=1.5em, edge label/.style={midway,sloped}}";
    default:
      return "for tree={font=\\small, grow=south}";
  }
}

function serializeNode(node: TreeNode, isProbability: boolean): string {
  const label = node.labelLatex ?? node.label;
  const edgeLabel = node.edgeLabel
    ? (isProbability && node.probability !== undefined
        ? ` edge label={node[midway,sloped,above]{$${node.probability}$}}`
        : ` edge label={node[midway,sloped,above]{${node.edgeLabel}}}`)
    : "";

  if (node.children.length === 0) {
    return `[${label}${edgeLabel}]`;
  }

  const children = node.children.map(c => serializeNode(c, isProbability)).join("\n    ");
  return `[${label}${edgeLabel}\n    ${children}\n  ]`;
}

export function serializeForest(doc: TreeForestDocument): string {
  const preset = stylePreset(doc.style);
  const isProbability = doc.style === "probability";
  const tree = serializeNode(doc.root, isProbability);

  // forest preamble: options appear BEFORE the tree, NOT wrapped in [].
  // [for tree={...}] would create a literal node; bare "for tree={...}" sets global style.
  const preamble = `${preset}${doc.forestOptions ? `, ${doc.forestOptions}` : ""}`;

  return [
    `\\begin{forest}`,
    `  ${preamble}`,
    `  ${tree}`,
    `\\end{forest}`,
  ].join("\n");
}
