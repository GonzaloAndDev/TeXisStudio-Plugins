import { BasePlugin } from "../../common/plugin-base/index.js";
import { TreeForestEngine } from "../../engines/tree-forest-engine/engine.js";
import { GraphNodeEngine } from "../../engines/graph-node-engine/engine.js";
import { TikzShapeEngine } from "../../engines/tikz-shape-engine/engine.js";
import type { TreeForestDocument } from "../../engines/tree-forest-engine/types.js";
import type { GraphNodeDocument } from "../../engines/graph-node-engine/types.js";
import type { TikzShapeDocument } from "../../engines/tikz-shape-engine/types.js";
import { pluginText } from "../../i18n/index.js";

const treeEngine  = new TreeForestEngine();
const graphEngine = new GraphNodeEngine();
const tikzEngine  = new TikzShapeEngine();

// ── Plugin 28 — Phylogenetic Trees ────────────────────────────────

export class PhylogeneticTreesPlugin extends BasePlugin<TreeForestDocument> {
  constructor() {
    super(treeEngine, {
      pluginId:        "phylogenetic-trees",
      displayName:     pluginText("phylogenetic-trees", "displayName", "Simple Phylogenetic Trees"),
      description:     pluginText("phylogenetic-trees", "description", "Build phylogenetic and taxonomic trees with labeled nodes and branch lengths."),
      category:        "biology-medicine",
      engineId:        "tree-forest-engine",
      qualityLevel:    "official-core",
      requiredPackages: ["forest"],
      scopeWarning:    pluginText("phylogenetic-trees", "scopeWarning", "Suitable for simplified phylogenies in theses. For complex phylogenetics with statistical support, use FigTree/iTOL and import as PDF."),
      blockKind:       "input",
      defaultCaption:  pluginText("phylogenetic-trees", "defaultCaption", "Simplified phylogeny of selected vertebrate classes."),
      defaultLabel:    "fig:phylogeny",
    });
  }

  protected buildDefaultDocument(): TreeForestDocument {
    // Vertebrate phylogeny — recognizable in biology, medicine, and ecology theses
    return {
      engineId: "tree-forest-engine", version: "1.0.0",
      style: "phylogenetic", growth: "south",
      root: {
        id: "vert", label: "Vertebrata", children: [
          { id: "fish",  label: "Actinopterygii", children: [
            { id: "zebrafish",  label: "\\textit{Danio rerio}", children: [] },
            { id: "medaka",     label: "\\textit{Oryzias latipes}", children: [] },
          ]},
          { id: "tetra", label: "Tetrapoda", children: [
            { id: "amph", label: "Amphibia", children: [
              { id: "xenopus", label: "\\textit{X. laevis}", children: [] },
            ]},
            { id: "amni", label: "Amniota", children: [
              { id: "mus",   label: "\\textit{Mus musculus}", children: [] },
              { id: "rat",   label: "\\textit{Rattus norvegicus}", children: [] },
              { id: "human", label: "\\textit{H. sapiens}", children: [] },
            ]},
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
      displayName:     pluginText("dna-rna-sequences", "displayName", "DNA / RNA / Protein Sequences"),
      description:     pluginText("dna-rna-sequences", "description", "Display biological sequences with color-coded bases, codon highlighting, and alignment marks."),
      category:        "biology-medicine",
      engineId:        "tikz-shape-engine",
      qualityLevel:    "official-core",
      requiredPackages: ["tikz"],
      blockKind:       "input",
      defaultCaption:  pluginText("dna-rna-sequences", "defaultCaption", "Start codon and reading frame of a short mRNA sequence."),
      defaultLabel:    "fig:dna-sequence",
    });
  }

  protected buildDefaultDocument(): TikzShapeDocument {
    // mRNA sequence with color-coded nucleotides: AUG start codon + 2 codons + stop
    // Color convention: A=blue, U=red, G=green, C=orange
    const seq = ["A","U","G","C","A","G","U","U","A","U","G","A","A"];
    const colors: Record<string, string> = { A: "blue!70", U: "red!70", G: "green!60!black", C: "orange!80!black" };
    const shapes: TikzShapeDocument["shapes"] = [];

    // Codon background rectangles (every 3 bases, alternating shading)
    for (let c = 0; c < Math.floor(seq.length / 3); c++) {
      if (c % 2 === 0) {
        shapes.push({ id: `codon${c}`, type: "rectangle",
          coords: [{ x: c * 1.2 - 0.15, y: -0.25 }, { x: c * 1.2 + 1.25, y: 0.45 }],
          fill: "gray!15", options: "fill, draw=none" });
      }
    }
    // Base labels with colors
    seq.forEach((base, i) => {
      shapes.push({ id: `b${i}`, type: "label",
        coords: [{ x: i * 0.4, y: 0 }],
        label: `{\\color{${colors[base] ?? "black"}}\\textbf{\\texttt{${base}}}}`,
        options: "center" });
    });
    // Position numbers
    shapes.push({ id: "p1",  type: "label", coords: [{ x: 0,   y: -0.5 }], label: "\\tiny 1" });
    shapes.push({ id: "p4",  type: "label", coords: [{ x: 1.2, y: -0.5 }], label: "\\tiny 4" });
    shapes.push({ id: "p7",  type: "label", coords: [{ x: 2.4, y: -0.5 }], label: "\\tiny 7" });
    shapes.push({ id: "p10", type: "label", coords: [{ x: 3.6, y: -0.5 }], label: "\\tiny 10" });
    // Annotation
    shapes.push({ id: "ann_start", type: "label", coords: [{ x: 0.4, y: 0.7 }], label: "\\tiny Start codon" });
    shapes.push({ id: "arr_start", type: "arrow",  coords: [{ x: 0.4, y: 0.6 }, { x: 0.4, y: 0.2 }] });
    shapes.push({ id: "ann_stop",  type: "label", coords: [{ x: 4.4, y: 0.7 }], label: "\\tiny Stop-related" });

    return {
      engineId: "tikz-shape-engine", version: "1.0.0",
      shapes,
      viewBox: { width: 6.5, height: 1.8, unit: "cm" },
      tikzLibraries: [],
    };
  }
}

// ── Plugin 30 — Biomedical Flow Diagrams ──────────────────────────

export class BiomedicalFlowPlugin extends BasePlugin<GraphNodeDocument> {
  constructor() {
    super(graphEngine, {
      pluginId:        "biomedical-flow",
      displayName:     pluginText("biomedical-flow", "displayName", "Biomedical Flow Diagrams"),
      description:     pluginText("biomedical-flow", "description", "Biological and clinical process flows — signaling pathways, metabolic steps, treatment algorithms."),
      category:        "biology-medicine",
      engineId:        "graph-node-engine",
      qualityLevel:    "official-core",
      requiredPackages: ["tikz"],
      blockKind:       "input",
      defaultCaption:  pluginText("biomedical-flow", "defaultCaption", "MAPK/ERK signalling cascade with feedback inhibition."),
      defaultLabel:    "fig:mapk",
    });
  }

  protected buildDefaultDocument(): GraphNodeDocument {
    // MAPK/ERK pathway — canonical example in cancer biology, pharmacology theses
    return {
      engineId: "graph-node-engine", version: "1.0.0",
      nodes: [
        { id: "ligand",  label: "Growth factor",     shape: "ellipse",   position: { x: 0, y: 6 } },
        { id: "rtk",     label: "RTK (EGFR)",        shape: "rectangle", position: { x: 0, y: 4.5 } },
        { id: "ras",     label: "RAS",               shape: "ellipse",   position: { x: 0, y: 3 } },
        { id: "raf",     label: "RAF",               shape: "rectangle", position: { x: 0, y: 1.8 } },
        { id: "mek",     label: "MEK",               shape: "rectangle", position: { x: 0, y: 0.6 } },
        { id: "erk",     label: "ERK",               shape: "rectangle", position: { x: 0, y: -0.6 } },
        { id: "nucleus", label: "Nucleus\\n(gene expression)", shape: "ellipse", position: { x: 0, y: -2 } },
        // Negative feedback loop
        { id: "mkp",     label: "MKP-1\\n(phosphatase)", shape: "rectangle", position: { x: 3, y: -0.6 } },
      ],
      edges: [
        { id: "e1", from: "ligand",  to: "rtk",     type: "directed", label: "binds" },
        { id: "e2", from: "rtk",     to: "ras",     type: "directed", label: "activates" },
        { id: "e3", from: "ras",     to: "raf",     type: "directed", label: "phosphorylates" },
        { id: "e4", from: "raf",     to: "mek",     type: "directed", label: "p" },
        { id: "e5", from: "mek",     to: "erk",     type: "directed", label: "p" },
        { id: "e6", from: "erk",     to: "nucleus", type: "directed" },
        // Negative feedback
        { id: "e7", from: "erk",     to: "mkp",     type: "directed", label: "induces" },
        { id: "e8", from: "mkp",     to: "erk",     type: "dashed",   label: "inhibits" },
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
      displayName:     pluginText("consort-flow", "displayName", "CONSORT / Clinical Trial Flow"),
      description:     pluginText("consort-flow", "description", "CONSORT-style flow diagrams for randomized clinical trials — enrollment, allocation, follow-up, analysis."),
      category:        "biology-medicine",
      engineId:        "graph-node-engine",
      qualityLevel:    "official-core",
      requiredPackages: ["tikz"],
      blockKind:       "input",
      defaultCaption:  pluginText("consort-flow", "defaultCaption", "CONSORT 2010 flow diagram."),
      defaultLabel:    "fig:consort",
    });
  }

  protected buildDefaultDocument(): GraphNodeDocument {
    // CONSORT 2010 standard: enrollment → allocation → follow-up → analysis
    return {
      engineId: "graph-node-engine", version: "1.0.0",
      nodes: [
        { id: "assess",  label: "Assessed for eligibility (n=280)",  shape: "rectangle", position: { x: 0,   y: 7 } },
        { id: "excl",    label: "Excluded (n=80): not meeting criteria", shape: "rectangle", position: { x: 4, y: 6 } },
        { id: "rand",    label: "Randomised (n=200)",                 shape: "rectangle", position: { x: 0,   y: 5 } },
        { id: "intA",    label: "Intervention A (n=100)",             shape: "rectangle", position: { x: -2.5,y: 3.5 } },
        { id: "intB",    label: "Intervention B (n=100)",             shape: "rectangle", position: { x: 2.5, y: 3.5 } },
        { id: "fuA",     label: "Follow-up (n=97, lost=3)",           shape: "rectangle", position: { x: -2.5,y: 1.8 } },
        { id: "fuB",     label: "Follow-up (n=95, lost=5)",           shape: "rectangle", position: { x: 2.5, y: 1.8 } },
        { id: "anaA",    label: "Analysed (n=97)",                    shape: "rectangle", position: { x: -2.5,y: 0.2 } },
        { id: "anaB",    label: "Analysed (n=95)",                    shape: "rectangle", position: { x: 2.5, y: 0.2 } },
      ],
      edges: [
        { id: "e1", from: "assess", to: "excl",  type: "directed" },
        { id: "e2", from: "assess", to: "rand",  type: "directed" },
        { id: "e3", from: "rand",   to: "intA",  type: "directed", label: "Allocated" },
        { id: "e4", from: "rand",   to: "intB",  type: "directed", label: "Allocated" },
        { id: "e5", from: "intA",   to: "fuA",   type: "directed" },
        { id: "e6", from: "intB",   to: "fuB",   type: "directed" },
        { id: "e7", from: "fuA",    to: "anaA",  type: "directed" },
        { id: "e8", from: "fuB",    to: "anaB",  type: "directed" },
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
      displayName:     pluginText("biological-pathways", "displayName", "Schematic Biological Pathways"),
      description:     pluginText("biological-pathways", "description", "Simplified metabolic and signaling pathway schemes for thesis figures."),
      category:        "biology-medicine",
      engineId:        "graph-node-engine",
      qualityLevel:    "official-core",
      requiredPackages: ["tikz"],
      scopeWarning:    pluginText("biological-pathways", "scopeWarning", "Suitable for simplified pathway diagrams in theses and reports. Not a substitute for KEGG, Reactome, or professional pathway visualization tools."),
      blockKind:       "input",
      defaultCaption:  pluginText("biological-pathways", "defaultCaption", "Central carbon metabolism: glycolysis and TCA cycle entry."),
      defaultLabel:    "fig:glycolysis",
    });
  }

  protected buildDefaultDocument(): GraphNodeDocument {
    return {
      engineId: "graph-node-engine", version: "1.0.0",
      nodes: [
        { id: "glc",   label: "Glucose",         shape: "rectangle", position: { x: 0,   y: 6 } },
        { id: "g6p",   label: "G-6-P",           shape: "rectangle", position: { x: 0,   y: 4.5 } },
        { id: "f16bp", label: "F-1,6-BP",        shape: "rectangle", position: { x: 0,   y: 3 } },
        { id: "g3p",   label: "G-3-P (x2)",      shape: "rectangle", position: { x: 0,   y: 1.5 } },
        { id: "pyr",   label: "Pyruvate (x2)",   shape: "rectangle", position: { x: 0,   y: 0 } },
        { id: "aca",   label: "Acetyl-CoA (x2)", shape: "rectangle", position: { x: 0,   y: -1.5 } },
        // Side products
        { id: "atp1",  label: "2 ATP",           shape: "ellipse",   position: { x: 2.8, y: 3 } },
        { id: "nadh",  label: "2 NADH",          shape: "ellipse",   position: { x: 2.8, y: 0 } },
        { id: "co2",   label: "2 CO$_2$",        shape: "ellipse",   position: { x: 2.8, y: -1.5 } },
      ],
      edges: [
        { id: "e1", from: "glc",   to: "g6p",   type: "directed", label: "Hexokinase" },
        { id: "e2", from: "g6p",   to: "f16bp", type: "directed", label: "PFK-1" },
        { id: "e3", from: "f16bp", to: "g3p",   type: "directed", label: "Aldolase" },
        { id: "e4", from: "g3p",   to: "pyr",   type: "directed", label: "Glycolysis (x6)" },
        { id: "e5", from: "pyr",   to: "aca",   type: "directed", label: "PDH complex" },
        { id: "e6", from: "f16bp", to: "atp1",  type: "directed" },
        { id: "e7", from: "g3p",   to: "nadh",  type: "directed" },
        { id: "e8", from: "pyr",   to: "co2",   type: "directed" },
      ],
      layout: "manual", tikzLibraries: ["arrows.meta"], directed: true,
    };
  }
}
