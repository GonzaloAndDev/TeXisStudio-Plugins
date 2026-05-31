import { BasePlugin } from "../../common/plugin-base/index.js";
import { TreeForestEngine } from "../../engines/tree-forest-engine/engine.js";
import { GraphNodeEngine } from "../../engines/graph-node-engine/engine.js";
import { TikzShapeEngine } from "../../engines/tikz-shape-engine/engine.js";
import type { TreeForestDocument } from "../../engines/tree-forest-engine/types.js";
import type { GraphNodeDocument } from "../../engines/graph-node-engine/types.js";
import type { TikzShapeDocument } from "../../engines/tikz-shape-engine/types.js";

// ── Shared engine instances ────────────────────────────────────────
const treeEngine  = new TreeForestEngine();
const graphEngine = new GraphNodeEngine();
const tikzEngine  = new TikzShapeEngine();

// ── Plugin 12 — Probability Trees ─────────────────────────────────

export class ProbabilityTreesPlugin extends BasePlugin<TreeForestDocument> {
  constructor() {
    super(treeEngine, {
      pluginId:        "probability-trees",
      displayName:     "Probability Trees",
      description:     "Visual probability trees with branch probabilities and outcomes. forest native.",
      category:        "mathematics",
      engineId:        "tree-forest-engine",
      qualityLevel:    "official-core",
      requiredPackages: ["forest"],
      blockKind:       "input",
      defaultCaption:  "Probability tree — two coin flips.",
      defaultLabel:    "fig:prob-tree",
    });
  }

  protected buildDefaultDocument(): TreeForestDocument {
    return {
      engineId: "tree-forest-engine", version: "1.0.0",
      style: "probability", growth: "east",
      root: {
        id: "root", label: "", children: [
          { id: "H", label: "H", edgeLabel: "0.5", probability: 0.5, children: [
            { id: "HH", label: "HH", edgeLabel: "0.5", probability: 0.5, children: [] },
            { id: "HT", label: "HT", edgeLabel: "0.5", probability: 0.5, children: [] },
          ]},
          { id: "T", label: "T", edgeLabel: "0.5", probability: 0.5, children: [
            { id: "TH", label: "TH", edgeLabel: "0.5", probability: 0.5, children: [] },
            { id: "TT", label: "TT", edgeLabel: "0.5", probability: 0.5, children: [] },
          ]},
        ],
      },
    };
  }
}

// ── Plugin 27 — Simple Lab Setups ─────────────────────────────────

export class LabSetupPlugin extends BasePlugin<TikzShapeDocument> {
  constructor() {
    super(tikzEngine, {
      pluginId:        "lab-setups",
      displayName:     "Simple Lab Setups",
      description:     "Basic laboratory apparatus diagrams: flasks, beakers, burettes, tube assemblies.",
      category:        "chemistry",
      engineId:        "tikz-shape-engine",
      qualityLevel:    "official-core",
      requiredPackages: ["tikz"],
      scopeWarning:    "Covers standard lab apparatus. For specialized equipment diagrams, use dedicated illustration tools and import as PDF.",
      blockKind:       "input",
      defaultCaption:  "Simple laboratory setup.",
      defaultLabel:    "fig:lab-setup",
    });
  }

  protected buildDefaultDocument(): TikzShapeDocument {
    return {
      engineId: "tikz-shape-engine", version: "1.0.0",
      shapes: [
        { id: "flask-neck",  type: "rectangle", coords: [{ x: 0.8, y: 2 }, { x: 1.2, y: 3 }] },
        { id: "flask-body",  type: "ellipse",   coords: [{ x: 1, y: 1.2 }, { x: 1, y: 1 }] },
        { id: "flask-label", type: "label",     coords: [{ x: 1, y: 1.2 }], label: "Flask" },
        { id: "stand-rod",   type: "line",      coords: [{ x: 2.5, y: 0 }, { x: 2.5, y: 3.5 }], lineWidth: "2pt" },
        { id: "stand-base",  type: "line",      coords: [{ x: 2, y: 0 }, { x: 3, y: 0 }],       lineWidth: "2pt" },
        { id: "stand-clamp", type: "rectangle", coords: [{ x: 2.2, y: 2.8 }, { x: 2.5, y: 3.0 }] },
      ],
      viewBox: { width: 5, height: 4, unit: "cm" },
      tikzLibraries: [],
    };
  }
}

// ── Plugin 34 — Syntax / Linguistic Trees ─────────────────────────

export class SyntaxTreesPlugin extends BasePlugin<TreeForestDocument> {
  constructor() {
    super(treeEngine, {
      pluginId:        "syntax-trees",
      displayName:     "Syntax / Linguistic Trees",
      description:     "Phrase-structure and dependency trees for linguistics. forest native.",
      category:        "humanities-social",
      engineId:        "tree-forest-engine",
      qualityLevel:    "official-core",
      requiredPackages: ["forest"],
      blockKind:       "input",
      defaultCaption:  "Phrase-structure tree.",
      defaultLabel:    "fig:syntax-tree",
    });
  }

  protected buildDefaultDocument(): TreeForestDocument {
    return {
      engineId: "tree-forest-engine", version: "1.0.0",
      style: "syntax", growth: "south",
      root: {
        id: "S", label: "S", children: [
          { id: "NP", label: "NP", children: [
            { id: "det", label: "Det", children: [{ id: "the", label: "the", children: [] }] },
            { id: "n",   label: "N",   children: [{ id: "cat", label: "cat", children: [] }] },
          ]},
          { id: "VP", label: "VP", children: [
            { id: "v",  label: "V",  children: [{ id: "sat", label: "sat", children: [] }] },
            { id: "PP", label: "PP", children: [
              { id: "p",   label: "P",  children: [{ id: "on",  label: "on",      children: [] }] },
              { id: "np2", label: "NP", children: [{ id: "mat", label: "the mat", children: [] }] },
            ]},
          ]},
        ],
      },
    };
  }
}

// ── Plugin 35 — Concept Maps & Argument Diagrams ──────────────────

export class ConceptMapsPlugin extends BasePlugin<GraphNodeDocument> {
  constructor() {
    super(graphEngine, {
      pluginId:        "concept-maps",
      displayName:     "Concept Maps & Argument Diagrams",
      description:     "Concept maps, mind maps, and argumentative structure diagrams.",
      category:        "humanities-social",
      engineId:        "graph-node-engine",
      qualityLevel:    "official-core",
      requiredPackages: ["tikz"],
      blockKind:       "input",
      defaultCaption:  "Concept map.",
      defaultLabel:    "fig:concept-map",
    });
  }

  protected buildDefaultDocument(): GraphNodeDocument {
    return {
      engineId: "graph-node-engine", version: "1.0.0",
      nodes: [
        { id: "central", label: "Central concept", shape: "ellipse",   position: { x: 0,  y: 0 } },
        { id: "a",       label: "Related idea A",  shape: "rectangle", position: { x: -3, y: 1.5 } },
        { id: "b",       label: "Related idea B",  shape: "rectangle", position: { x: 3,  y: 1.5 } },
        { id: "c",       label: "Sub-concept",     shape: "rectangle", position: { x: 0,  y: -2 } },
        { id: "d",       label: "Example",         shape: "rectangle", position: { x: -3, y: -1.5 } },
      ],
      edges: [
        { id: "e1", from: "central", to: "a", type: "directed", label: "includes" },
        { id: "e2", from: "central", to: "b", type: "directed", label: "leads to" },
        { id: "e3", from: "central", to: "c", type: "directed", label: "requires" },
        { id: "e4", from: "c",       to: "d", type: "directed", label: "e.g." },
      ],
      layout: "manual", tikzLibraries: ["arrows.meta"], directed: true,
    };
  }
}
