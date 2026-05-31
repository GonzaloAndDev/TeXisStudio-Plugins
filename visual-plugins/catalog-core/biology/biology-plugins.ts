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

// ── Plugin 28 — Phylogenetic Trees ────────────────────────────────

export class PhylogeneticTreesPlugin extends BasePlugin<TreeForestDocument> {
  constructor() {
    super(treeEngine, {
      pluginId:        "phylogenetic-trees",
      displayName:     "Simple Phylogenetic Trees",
      description:     "Build phylogenetic and taxonomic trees with labeled nodes and branch lengths.",
      category:        "biology-medicine",
      engineId:        "tree-forest-engine",
      qualityLevel:    "official-core",
      requiredPackages: ["forest"],
      scopeWarning:    "Suitable for simplified phylogenies in theses. For complex phylogenetics with statistical support, use FigTree/iTOL and import as PDF.",
      blockKind:       "input",
      defaultCaption:  "Simplified phylogenetic tree.",
      defaultLabel:    "fig:phylogeny",
    });
  }

  protected buildDefaultDocument(): TreeForestDocument {
    return {
      engineId: "tree-forest-engine", version: "1.0.0",
      style: "phylogenetic", growth: "south",
      root: {
        id: "root", label: "LUCA", children: [
          { id: "bact", label: "Bacteria", children: [
            { id: "ec", label: "\\textit{E. coli}", children: [] },
            { id: "bs", label: "\\textit{B. subtilis}", children: [] },
          ]},
          { id: "euk", label: "Eukaryota", children: [
            { id: "hs", label: "\\textit{H. sapiens}", children: [] },
            { id: "sc", label: "\\textit{S. cerevisiae}", children: [] },
          ]},
        ],
      },
    };
  }
}

// ── Plugin 29 — DNA / RNA / Protein Sequences ─────────────────────

export class SequencesPlugin extends BasePlugin<TikzShapeDocument> {
  constructor() {
    super(tikzEngine, {
      pluginId:        "dna-rna-sequences",
      displayName:     "DNA / RNA / Protein Sequences",
      description:     "Display biological sequences with annotations, highlights, and alignment marks.",
      category:        "biology-medicine",
      engineId:        "tikz-shape-engine",
      qualityLevel:    "official-core",
      requiredPackages: ["tikz"],
      blockKind:       "input",
      defaultCaption:  "DNA sequence.",
      defaultLabel:    "fig:dna-sequence",
    });
  }

  protected buildDefaultDocument(): TikzShapeDocument {
    const seq = "ATGCGATCGATCG";
    return {
      engineId: "tikz-shape-engine", version: "1.0.0",
      shapes: seq.split("").map((base, i) => ({
        id: `b${i}`, type: "label" as const,
        coords: [{ x: i * 0.4, y: 0 }],
        label: `\\texttt{${base}}`,
        options: "center",
      })),
      viewBox: { width: seq.length * 0.45, height: 1, unit: "cm" },
      tikzLibraries: [],
    };
  }
}

// ── Plugin 30 — Biomedical Flow Diagrams ──────────────────────────

export class BiomedicalFlowPlugin extends BasePlugin<GraphNodeDocument> {
  constructor() {
    super(graphEngine, {
      pluginId:        "biomedical-flow",
      displayName:     "Biomedical Flow Diagrams",
      description:     "Biological and clinical process flows — signaling pathways, metabolic steps, treatment algorithms.",
      category:        "biology-medicine",
      engineId:        "graph-node-engine",
      qualityLevel:    "official-core",
      requiredPackages: ["tikz"],
      blockKind:       "input",
      defaultCaption:  "Cell signaling pathway.",
      defaultLabel:    "fig:signaling",
    });
  }

  protected buildDefaultDocument(): GraphNodeDocument {
    return {
      engineId: "graph-node-engine", version: "1.0.0",
      nodes: [
        { id: "signal",   label: "Signal",         shape: "ellipse",   position: { x: 0, y: 4 } },
        { id: "receptor", label: "Receptor",        shape: "rectangle", position: { x: 0, y: 2.5 } },
        { id: "cascade",  label: "Kinase cascade",  shape: "rectangle", position: { x: 0, y: 1 } },
        { id: "response", label: "Gene expression", shape: "rectangle", position: { x: 0, y: -0.5 } },
      ],
      edges: [
        { id: "e1", from: "signal",   to: "receptor", type: "directed" },
        { id: "e2", from: "receptor", to: "cascade",  type: "directed" },
        { id: "e3", from: "cascade",  to: "response", type: "directed" },
      ],
      layout: "manual", tikzLibraries: ["arrows.meta"], directed: true,
    };
  }
}

// ── Plugin 31 — CONSORT / Clinical Trial Flow ─────────────────────

export class CONSORTFlowPlugin extends BasePlugin<GraphNodeDocument> {
  constructor() {
    super(graphEngine, {
      pluginId:        "consort-flow",
      displayName:     "CONSORT / Clinical Trial Flow",
      description:     "CONSORT-style flow diagrams for randomized clinical trials — enrollment, allocation, follow-up, analysis.",
      category:        "biology-medicine",
      engineId:        "graph-node-engine",
      qualityLevel:    "official-core",
      requiredPackages: ["tikz"],
      blockKind:       "input",
      defaultCaption:  "CONSORT flow diagram.",
      defaultLabel:    "fig:consort",
    });
  }

  protected buildDefaultDocument(): GraphNodeDocument {
    return {
      engineId: "graph-node-engine", version: "1.0.0",
      nodes: [
        { id: "enroll",    label: "Enrollment\\n=200",  shape: "rectangle", position: { x: 0,  y: 6 } },
        { id: "excl",      label: "Excluded\\n=50",     shape: "rectangle", position: { x: 3,  y: 5 } },
        { id: "rand",      label: "Randomized\\n=150",  shape: "rectangle", position: { x: 0,  y: 4 } },
        { id: "groupA",    label: "Group A\\n=75",      shape: "rectangle", position: { x: -2, y: 2.5 } },
        { id: "groupB",    label: "Group B\\n=75",      shape: "rectangle", position: { x: 2,  y: 2.5 } },
        { id: "analysisA", label: "Analysed\\n=72",     shape: "rectangle", position: { x: -2, y: 0.5 } },
        { id: "analysisB", label: "Analysed\\n=70",     shape: "rectangle", position: { x: 2,  y: 0.5 } },
      ],
      edges: [
        { id: "e1", from: "enroll", to: "excl",      type: "directed" },
        { id: "e2", from: "enroll", to: "rand",      type: "directed" },
        { id: "e3", from: "rand",   to: "groupA",    type: "directed" },
        { id: "e4", from: "rand",   to: "groupB",    type: "directed" },
        { id: "e5", from: "groupA", to: "analysisA", type: "directed" },
        { id: "e6", from: "groupB", to: "analysisB", type: "directed" },
      ],
      layout: "manual", tikzLibraries: ["arrows.meta"], directed: true,
    };
  }
}

// ── Plugin 32 — Schematic Biological Pathways ─────────────────────

export class BiologicalPathwaysPlugin extends BasePlugin<GraphNodeDocument> {
  constructor() {
    super(graphEngine, {
      pluginId:        "biological-pathways",
      displayName:     "Schematic Biological Pathways",
      description:     "Simplified metabolic and signaling pathway schemes for thesis figures.",
      category:        "biology-medicine",
      engineId:        "graph-node-engine",
      qualityLevel:    "official-core",
      requiredPackages: ["tikz"],
      scopeWarning:    "Suitable for simplified pathway diagrams in theses and reports. Not a substitute for KEGG, Reactome, or professional pathway visualization tools.",
      blockKind:       "input",
      defaultCaption:  "Simplified glycolysis pathway.",
      defaultLabel:    "fig:glycolysis",
    });
  }

  protected buildDefaultDocument(): GraphNodeDocument {
    // Simplified central carbon metabolism — glycolysis + TCA entry
    return {
      engineId: "graph-node-engine", version: "1.0.0",
      nodes: [
        { id: "glc",   label: "Glucose",        shape: "rectangle", position: { x: 0,  y: 6 } },
        { id: "g6p",   label: "G-6-P",          shape: "rectangle", position: { x: 0,  y: 4.5 } },
        { id: "f16bp", label: "F-1,6-BP",       shape: "rectangle", position: { x: 0,  y: 3 } },
        { id: "g3p",   label: "G-3-P (×2)",     shape: "rectangle", position: { x: 0,  y: 1.5 } },
        { id: "pyr",   label: "Pyruvate (×2)",  shape: "rectangle", position: { x: 0,  y: 0 } },
        { id: "aca",   label: "Acetyl-CoA (×2)",shape: "rectangle", position: { x: 0,  y: -1.5 } },
        // Side products
        { id: "atp1",  label: "2 ATP",          shape: "ellipse",   position: { x: 2.5, y: 3 } },
        { id: "nadh",  label: "2 NADH",         shape: "ellipse",   position: { x: 2.5, y: 0 } },
        { id: "co2",   label: "2 CO$_2$",               shape: "ellipse", position: { x: 2.5, y: -1.5 } },
      ],
      edges: [
        { id: "e1", from: "glc",   to: "g6p",   type: "directed", label: "Hexokinase" },
        { id: "e2", from: "g6p",   to: "f16bp", type: "directed", label: "PFK-1" },
        { id: "e3", from: "f16bp", to: "g3p",   type: "directed", label: "Aldolase" },
        { id: "e4", from: "g3p",   to: "pyr",   type: "directed", label: "Glycolysis" },
        { id: "e5", from: "pyr",   to: "aca",   type: "directed", label: "PDH complex" },
        { id: "e6", from: "f16bp", to: "atp1",  type: "directed" },
        { id: "e7", from: "g3p",   to: "nadh",  type: "directed" },
        { id: "e8", from: "pyr",   to: "co2",   type: "directed" },
      ],
      layout: "manual", tikzLibraries: ["arrows.meta"], directed: true,
    };
  }
}
