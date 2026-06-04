import { BasePlugin } from "../../common/plugin-base/index.js";
import { TreeForestEngine } from "../../engines/tree-forest-engine/engine.js";
import { GraphNodeEngine } from "../../engines/graph-node-engine/engine.js";
import { TikzShapeEngine } from "../../engines/tikz-shape-engine/engine.js";
import type { TreeForestDocument } from "../../engines/tree-forest-engine/types.js";
import type { GraphNodeDocument } from "../../engines/graph-node-engine/types.js";
import type { TikzShapeDocument } from "../../engines/tikz-shape-engine/types.js";
import { pluginText } from "../../i18n/index.js";

// ── Shared engine instances ────────────────────────────────────────
const treeEngine  = new TreeForestEngine();
const graphEngine = new GraphNodeEngine();
const tikzEngine  = new TikzShapeEngine();

// ── Plugin 12 — Probability Trees ─────────────────────────────────

export class ProbabilityTreesPlugin extends BasePlugin<TreeForestDocument> {
  constructor() {
    super(treeEngine, {
      pluginId:        "probability-trees",
      displayName:     pluginText("probability-trees", "displayName", "Probability Trees"),
      description:     pluginText("probability-trees", "description", "Visual probability trees with branch probabilities and outcomes. forest native."),
      category:        "mathematics",
      engineId:        "tree-forest-engine",
      qualityLevel:    "official-core",
      requiredPackages: ["forest"],
      blockKind:       "input",
      defaultCaption:  pluginText("probability-trees", "defaultCaption", "Probability tree — two coin flips."),
      defaultLabel:    "fig:prob-tree",
    });
  }

  protected buildDefaultDocument(): TreeForestDocument {
    // Medical screening test — Bayes theorem in action: P(disease)=0.01, sensitivity=0.99, specificity=0.95
    // This is the canonical probability tree in statistics and medical research theses
    return {
      engineId: "tree-forest-engine", version: "1.0.0",
      style: "probability", growth: "east",
      root: {
        id: "root", label: "", children: [
          { id: "D",  label: "Disease ($P{=}0.01$)",  edgeLabel: "0.01",  probability: 0.01,  children: [
            { id: "D_pos", label: "Test $+$ ($P{=}0.99$)", edgeLabel: "0.99", probability: 0.99, children: [] },
            { id: "D_neg", label: "Test $-$ ($P{=}0.01$)", edgeLabel: "0.01", probability: 0.01, children: [] },
          ]},
          { id: "H",  label: "Healthy ($P{=}0.99$)",  edgeLabel: "0.99",  probability: 0.99,  children: [
            { id: "H_pos", label: "Test $+$ ($P{=}0.05$)", edgeLabel: "0.05", probability: 0.05, children: [] },
            { id: "H_neg", label: "Test $-$ ($P{=}0.95$)", edgeLabel: "0.95", probability: 0.95, children: [] },
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
      displayName:     pluginText("lab-setups", "displayName", "Simple Lab Setups"),
      description:     pluginText("lab-setups", "description", "Basic laboratory apparatus diagrams: flasks, beakers, burettes, tube assemblies."),
      category:        "chemistry",
      engineId:        "tikz-shape-engine",
      qualityLevel:    "official-core",
      requiredPackages: ["tikz"],
      scopeWarning:    pluginText("lab-setups", "scopeWarning", "Covers standard lab apparatus. For specialized equipment diagrams, use dedicated illustration tools and import as PDF."),
      blockKind:       "input",
      defaultCaption:  pluginText("lab-setups", "defaultCaption", "Simple laboratory setup."),
      defaultLabel:    "fig:lab-setup",
    });
  }

  protected buildDefaultDocument(): TikzShapeDocument {
    // Acid-base titration setup: burette over Erlenmeyer flask on stand
    return {
      engineId: "tikz-shape-engine", version: "1.0.0",
      shapes: [
        // Stand base and rod
        { id: "base",    type: "rectangle", coords: [{ x: 0, y: 0 }, { x: 2.5, y: 0.2 }], fill: "gray!50" },
        { id: "rod",     type: "line",      coords: [{ x: 2, y: 0.2 }, { x: 2, y: 6 }], lineWidth: "3pt", color: "gray" },
        // Clamp ring
        { id: "clamp",   type: "rectangle", coords: [{ x: 1.5, y: 4.5 }, { x: 2.5, y: 4.8 }], fill: "gray!40" },
        // Burette (long tube)
        { id: "bur_body",type: "rectangle", coords: [{ x: 0.8, y: 2.5 }, { x: 1.2, y: 4.5 }], fill: "white" },
        { id: "bur_tip", type: "polygon",   coords: [{ x: 0.8, y: 2.5 }, { x: 1.2, y: 2.5 }, { x: 1.0, y: 2.0 }] },
        // Liquid in burette
        { id: "bur_liq", type: "rectangle", coords: [{ x: 0.81, y: 3 }, { x: 1.19, y: 4.49 }], fill: "blue!25" },
        // Burette label
        { id: "lb_bur",  type: "label",     coords: [{ x: 1.7, y: 3.5 }], label: "Burette (NaOH)" },
        // Drop falling from tip
        { id: "drop",    type: "ellipse",   coords: [{ x: 1.0, y: 1.85 }, { x: 0.06, y: 0.1 }], fill: "blue!40" },
        // Erlenmeyer flask body
        { id: "fl_body", type: "polygon",   coords: [{ x: 0.2, y: 0.2 }, { x: 1.8, y: 0.2 }, { x: 2.1, y: 1.5 }, { x: -0.1, y: 1.5 }], fill: "pink!30" },
        { id: "fl_neck", type: "rectangle", coords: [{ x: 0.75, y: 1.5 }, { x: 1.25, y: 2.0 }], fill: "pink!30" },
        // Flask label
        { id: "lb_fl",   type: "label",     coords: [{ x: -0.7, y: 1.0 }], label: "Erlenmeyer (HCl)" },
        // Stir bar (magnetic)
        { id: "stir",    type: "rectangle", coords: [{ x: 0.7, y: 0.22 }, { x: 1.3, y: 0.35 }], fill: "gray!60" },
        // Indicator color label
        { id: "ind_lbl", type: "label",     coords: [{ x: 1.0, y: 0.85 }], label: "\\tiny phenolphthalein" },
      ],
      viewBox: { width: 4.5, height: 6.5, unit: "cm" },
      tikzLibraries: [],
    };
  }
}

// ── Plugin 34 — Syntax / Linguistic Trees ─────────────────────────

export class SyntaxTreesPlugin extends BasePlugin<TreeForestDocument> {
  constructor() {
    super(treeEngine, {
      pluginId:        "syntax-trees",
      displayName:     pluginText("syntax-trees", "displayName", "Syntax / Linguistic Trees"),
      description:     pluginText("syntax-trees", "description", "Phrase-structure and dependency trees for linguistics. forest native."),
      category:        "humanities-social",
      engineId:        "tree-forest-engine",
      qualityLevel:    "official-core",
      requiredPackages: ["forest"],
      blockKind:       "input",
      defaultCaption:  pluginText("syntax-trees", "defaultCaption", "Phrase-structure tree."),
      defaultLabel:    "fig:syntax-tree",
    });
  }

  protected buildDefaultDocument(): TreeForestDocument {
    // More complex sentence with quantifier and relative clause fragment
    // "Every student who passed the exam celebrated"
    return {
      engineId: "tree-forest-engine", version: "1.0.0",
      style: "syntax", growth: "south",
      root: {
        id: "S", label: "S", children: [
          { id: "NP_s", label: "NP", children: [
            { id: "qp",   label: "QP",  children: [{ id: "every", label: "every", children: [] }] },
            { id: "n_bar",label: "N$'$",children: [
              { id: "n_head", label: "N",   children: [{ id: "student", label: "student", children: [] }] },
              { id: "relcp", label: "RelCP", children: [
                { id: "relc", label: "RelC", children: [
                  { id: "cp_who", label: "who",  children: [] },
                  { id: "vp_rel", label: "VP",   children: [
                    { id: "v_rel",  label: "V",  children: [{ id: "passed", label: "passed", children: [] }] },
                    { id: "np_obj", label: "NP", children: [{ id: "exam", label: "the exam", children: [] }] },
                  ]},
                ]},
              ]},
            ]},
          ]},
          { id: "VP_m", label: "VP", children: [
            { id: "v_main", label: "V", children: [{ id: "cel", label: "celebrated", children: [] }] },
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
      displayName:     pluginText("concept-maps", "displayName", "Concept Maps & Argument Diagrams"),
      description:     pluginText("concept-maps", "description", "Concept maps, mind maps, and argumentative structure diagrams."),
      category:        "humanities-social",
      engineId:        "graph-node-engine",
      qualityLevel:    "official-core",
      requiredPackages: ["tikz"],
      blockKind:       "input",
      defaultCaption:  pluginText("concept-maps", "defaultCaption", "Concept map."),
      defaultLabel:    "fig:concept-map",
    });
  }

  protected buildDefaultDocument(): GraphNodeDocument {
    // Academic concept map: Climate Change as central concept — relevant across disciplines
    return {
      engineId: "graph-node-engine", version: "1.0.0",
      nodes: [
        { id: "cc",     label: "Climate Change",          shape: "ellipse",   position: { x: 0,   y: 0 } },
        { id: "ghg",    label: "Greenhouse Gases",        shape: "rectangle", position: { x: -3.5,y: 1.5 } },
        { id: "temp",   label: "Rising Temperature",      shape: "rectangle", position: { x: 0,   y: 2.5 } },
        { id: "sea",    label: "Sea-level Rise",          shape: "rectangle", position: { x: 3.5, y: 1.5 } },
        { id: "fossil", label: "Fossil Fuels",            shape: "ellipse",   position: { x: -3.5,y: -1.5 } },
        { id: "defor",  label: "Deforestation",           shape: "ellipse",   position: { x: 0,   y: -2.5 } },
        { id: "policy", label: "Climate Policy",          shape: "rectangle", position: { x: 3.5, y: -1.5 } },
      ],
      edges: [
        { id: "e1", from: "ghg",    to: "cc",     type: "directed", label: "amplifies" },
        { id: "e2", from: "cc",     to: "temp",   type: "directed", label: "causes" },
        { id: "e3", from: "cc",     to: "sea",    type: "directed", label: "causes" },
        { id: "e4", from: "fossil", to: "ghg",    type: "directed", label: "emits" },
        { id: "e5", from: "defor",  to: "ghg",    type: "directed", label: "reduces sink" },
        { id: "e6", from: "policy", to: "cc",     type: "directed", label: "mitigates" },
        { id: "e7", from: "temp",   to: "sea",    type: "directed", label: "contributes" },
      ],
      layout: "manual", tikzLibraries: ["arrows.meta"], directed: true,
    };
  }
}
