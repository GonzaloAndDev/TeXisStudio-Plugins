import { MATH_ENGINE_META } from "./math-engine/index.js";
import { TIKZ_SHAPE_ENGINE_META } from "./tikz-shape-engine/index.js";
import { PGFPLOTS_ENGINE_META } from "./pgfplots-engine/index.js";
import { GRAPH_NODE_ENGINE_META } from "./graph-node-engine/index.js";
import { CIRCUITIKZ_ENGINE_META } from "./circuitikz-engine/index.js";
import { CHEMISTRY_ENGINE_META } from "./chemistry-engine/index.js";
import { TREE_FOREST_ENGINE_META } from "./tree-forest-engine/index.js";
import { TIMELINE_GANTT_ENGINE_META } from "./timeline-gantt-engine/index.js";
import { EXTERNAL_VECTOR_ENGINE_META } from "./external-vector-engine/index.js";
import { TABLE_DATA_ENGINE_META } from "./table-data-engine/index.js";
import { NOTATION_ENGINE_META } from "./notation-engine/index.js";
import { IMPORT_TRACEABILITY_ENGINE_META } from "./import-traceability-engine/index.js";

export const ENGINE_REGISTRY = [
  MATH_ENGINE_META,
  TIKZ_SHAPE_ENGINE_META,
  PGFPLOTS_ENGINE_META,
  GRAPH_NODE_ENGINE_META,
  CIRCUITIKZ_ENGINE_META,
  CHEMISTRY_ENGINE_META,
  TREE_FOREST_ENGINE_META,
  TIMELINE_GANTT_ENGINE_META,
  EXTERNAL_VECTOR_ENGINE_META,
  TABLE_DATA_ENGINE_META,
  NOTATION_ENGINE_META,
  IMPORT_TRACEABILITY_ENGINE_META,
] as const;

export type EngineId = typeof ENGINE_REGISTRY[number]["engineId"];

export function getEngineMeta(engineId: string) {
  return ENGINE_REGISTRY.find(e => e.engineId === engineId) ?? null;
}

export function getRequiredPackages(engineIds: string[]): string[] {
  const pkgs = new Set<string>();
  for (const id of engineIds) {
    const meta = getEngineMeta(id);
    if (meta) meta.requiredPackages.forEach(p => pkgs.add(p));
  }
  return [...pkgs];
}
