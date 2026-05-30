export type { TreeStyle, TreeGrowth, TreeNode, TreeForestDocument } from "./types.js";

export const TREE_FOREST_ENGINE_ID = "tree-forest-engine" as const;

export const TREE_FOREST_ENGINE_META = {
  engineId: TREE_FOREST_ENGINE_ID,
  displayName: "Tree / Forest Engine",
  supportedOutputs: ["latex", "pdf"] as const,
  requiredPackages: ["forest"] as const,
} as const;
