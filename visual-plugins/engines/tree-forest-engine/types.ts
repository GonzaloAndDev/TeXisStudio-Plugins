export type TreeStyle = "syntax" | "taxonomic" | "phylogenetic" | "genealogy" | "decision" | "probability";

export type TreeGrowth = "south" | "north" | "east" | "west";

export interface TreeNode {
  id: string;
  label: string;
  labelLatex?: string;
  children: TreeNode[];
  edgeLabel?: string;
  probability?: number;
  style?: string;
}

export interface TreeForestDocument {
  engineId: "tree-forest-engine";
  version: string;
  root: TreeNode;
  style: TreeStyle;
  growth: TreeGrowth;
  forestOptions?: string;
}
