import type { VisualDiagramPlugin, VisualFigureResult, ValidationResult } from "../../common/contracts/index.js";
import { buildLatexInputBlock } from "../../common/export/latex-block.js";
import { TreeForestEngine } from "../../engines/tree-forest-engine/engine.js";
import { GraphNodeEngine } from "../../engines/graph-node-engine/engine.js";
import { TikzShapeEngine } from "../../engines/tikz-shape-engine/engine.js";
import type { TreeForestDocument } from "../../engines/tree-forest-engine/types.js";
import type { GraphNodeDocument } from "../../engines/graph-node-engine/types.js";
import type { TikzShapeDocument } from "../../engines/tikz-shape-engine/types.js";

const treeEngine  = new TreeForestEngine();
const graphEngine = new GraphNodeEngine();
const tikzEngine  = new TikzShapeEngine();

function fid(): string { return `fig_${Math.floor(Math.random() * 9000) + 1000}`; }

async function treeResult(id: string, pluginId: string, doc: TreeForestDocument, caption: string, label: string): Promise<VisualFigureResult> {
  const exp = await treeEngine.export(doc, "latex");
  const texPath = `texisstudio-assets/figures/${id}/output.tex`;
  return { figureId: id, pluginId, engineId: "tree-forest-engine", latexBlock: buildLatexInputBlock({ figureId: id, inputPath: texPath, caption, label }), requiredPackages: exp.requiredPackages, sourcePath: `texisstudio-assets/figures/${id}/source.json`, outputPaths: { tex: texPath }, warnings: [] };
}

async function graphResult(id: string, pluginId: string, doc: GraphNodeDocument, caption: string, label: string): Promise<VisualFigureResult> {
  const exp = await graphEngine.export(doc, "latex");
  const texPath = `texisstudio-assets/figures/${id}/output.tex`;
  return { figureId: id, pluginId, engineId: "graph-node-engine", latexBlock: buildLatexInputBlock({ figureId: id, inputPath: texPath, caption, label }), requiredPackages: exp.requiredPackages, sourcePath: `texisstudio-assets/figures/${id}/source.json`, outputPaths: { tex: texPath }, warnings: [] };
}

async function tikzResult(id: string, pluginId: string, doc: TikzShapeDocument, caption: string, label: string): Promise<VisualFigureResult> {
  const exp = await tikzEngine.export(doc, "latex");
  const texPath = `texisstudio-assets/figures/${id}/output.tex`;
  return { figureId: id, pluginId, engineId: "tikz-shape-engine", latexBlock: buildLatexInputBlock({ figureId: id, inputPath: texPath, caption, label }), requiredPackages: exp.requiredPackages, sourcePath: `texisstudio-assets/figures/${id}/source.json`, outputPaths: { tex: texPath }, warnings: [] };
}

// Plugin 28 — Phylogenetic trees
export class PhylogeneticTreesPlugin implements VisualDiagramPlugin {
  readonly pluginId = "phylogenetic-trees";
  readonly displayName = "Simple Phylogenetic Trees";
  readonly description = "Build phylogenetic and taxonomic trees with labeled nodes and branch lengths.";
  readonly category = "biology-medicine" as const;
  readonly engineId = "tree-forest-engine";
  readonly qualityLevel = "official-core" as const;
  readonly requiredPackages = ["forest"] as const;
  readonly scopeWarning = "Suitable for simplified phylogenies in theses. For complex phylogenetics with statistical support, use FigTree/iTOL and import as PDF.";

  async create(): Promise<VisualFigureResult> {
    const id = fid();
    const doc: TreeForestDocument = {
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
    return treeResult(id, this.pluginId, doc, "Simplified phylogenetic tree.", "fig:phylogeny");
  }

  async edit(_p: string): Promise<VisualFigureResult> { return this.create(); }
  async validate(_r: VisualFigureResult): Promise<ValidationResult> { return { valid: true, issues: [] }; }
  exportLatexBlock(r: VisualFigureResult): string { return r.latexBlock; }
}

// Plugin 29 — DNA/RNA sequences
export class SequencesPlugin implements VisualDiagramPlugin {
  readonly pluginId = "dna-rna-sequences";
  readonly displayName = "DNA / RNA / Protein Sequences";
  readonly description = "Display biological sequences with annotations, highlights, and alignment marks.";
  readonly category = "biology-medicine" as const;
  readonly engineId = "tikz-shape-engine";
  readonly qualityLevel = "official-core" as const;
  readonly requiredPackages = ["tikz"] as const;

  async create(): Promise<VisualFigureResult> {
    const id = fid();
    const seq = "ATGCGATCGATCG";
    const doc: TikzShapeDocument = {
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
    return tikzResult(id, this.pluginId, doc, "DNA sequence.", "fig:dna-sequence");
  }

  async edit(_p: string): Promise<VisualFigureResult> { return this.create(); }
  async validate(_r: VisualFigureResult): Promise<ValidationResult> { return { valid: true, issues: [] }; }
  exportLatexBlock(r: VisualFigureResult): string { return r.latexBlock; }
}

// Plugin 30 — Biomedical flow diagrams
export class BiomedicalFlowPlugin implements VisualDiagramPlugin {
  readonly pluginId = "biomedical-flow";
  readonly displayName = "Biomedical Flow Diagrams";
  readonly description = "Biological and clinical process flows — signaling pathways, metabolic steps, treatment algorithms.";
  readonly category = "biology-medicine" as const;
  readonly engineId = "graph-node-engine";
  readonly qualityLevel = "official-core" as const;
  readonly requiredPackages = ["tikz"] as const;

  async create(): Promise<VisualFigureResult> {
    const id = fid();
    const doc: GraphNodeDocument = {
      engineId: "graph-node-engine", version: "1.0.0",
      nodes: [
        { id: "signal",   label: "Signal",         shape: "ellipse",    position: { x: 0, y: 4 } },
        { id: "receptor", label: "Receptor",        shape: "rectangle",  position: { x: 0, y: 2.5 } },
        { id: "cascade",  label: "Kinase cascade",  shape: "rectangle",  position: { x: 0, y: 1 } },
        { id: "response", label: "Gene expression", shape: "rectangle",  position: { x: 0, y: -0.5 } },
      ],
      edges: [
        { id: "e1", from: "signal",   to: "receptor", type: "directed" },
        { id: "e2", from: "receptor", to: "cascade",  type: "directed" },
        { id: "e3", from: "cascade",  to: "response", type: "directed" },
      ],
      layout: "manual", tikzLibraries: ["arrows.meta"], directed: true,
    };
    return graphResult(id, this.pluginId, doc, "Cell signaling pathway.", "fig:signaling");
  }

  async edit(_p: string): Promise<VisualFigureResult> { return this.create(); }
  async validate(_r: VisualFigureResult): Promise<ValidationResult> { return { valid: true, issues: [] }; }
  exportLatexBlock(r: VisualFigureResult): string { return r.latexBlock; }
}

// Plugin 31 — CONSORT flow
export class CONSORTFlowPlugin implements VisualDiagramPlugin {
  readonly pluginId = "consort-flow";
  readonly displayName = "CONSORT / Clinical Trial Flow";
  readonly description = "CONSORT-style flow diagrams for randomized clinical trials — enrollment, allocation, follow-up, analysis.";
  readonly category = "biology-medicine" as const;
  readonly engineId = "graph-node-engine";
  readonly qualityLevel = "official-core" as const;
  readonly requiredPackages = ["tikz"] as const;

  async create(): Promise<VisualFigureResult> {
    const id = fid();
    const doc: GraphNodeDocument = {
      engineId: "graph-node-engine", version: "1.0.0",
      nodes: [
        { id: "enroll",  label: "Enrollment\\\\n=200",       shape: "rectangle", position: { x: 0, y: 6 } },
        { id: "excl",    label: "Excluded\\\\n=50",          shape: "rectangle", position: { x: 3, y: 5 } },
        { id: "rand",    label: "Randomized\\\\n=150",       shape: "rectangle", position: { x: 0, y: 4 } },
        { id: "groupA",  label: "Group A\\\\n=75",           shape: "rectangle", position: { x: -2, y: 2.5 } },
        { id: "groupB",  label: "Group B\\\\n=75",           shape: "rectangle", position: { x: 2, y: 2.5 } },
        { id: "analysisA", label: "Analysed\\\\n=72",        shape: "rectangle", position: { x: -2, y: 0.5 } },
        { id: "analysisB", label: "Analysed\\\\n=70",        shape: "rectangle", position: { x: 2, y: 0.5 } },
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
    return graphResult(id, this.pluginId, doc, "CONSORT flow diagram.", "fig:consort");
  }

  async edit(_p: string): Promise<VisualFigureResult> { return this.create(); }
  async validate(_r: VisualFigureResult): Promise<ValidationResult> { return { valid: true, issues: [] }; }
  exportLatexBlock(r: VisualFigureResult): string { return r.latexBlock; }
}

// Plugin 32 — Schematic biological pathways
export class BiologicalPathwaysPlugin implements VisualDiagramPlugin {
  readonly pluginId = "biological-pathways";
  readonly displayName = "Schematic Biological Pathways";
  readonly description = "Simplified metabolic and signaling pathway schemes for thesis figures.";
  readonly category = "biology-medicine" as const;
  readonly engineId = "graph-node-engine";
  readonly qualityLevel = "official-core" as const;
  readonly requiredPackages = ["tikz"] as const;
  readonly scopeWarning = "Suitable for simplified pathway diagrams in theses and reports. Not a substitute for KEGG, Reactome, or professional pathway visualization tools.";

  async create(): Promise<VisualFigureResult> {
    const id = fid();
    const doc: GraphNodeDocument = {
      engineId: "graph-node-engine", version: "1.0.0",
      nodes: [
        { id: "glucose",   label: "Glucose",        shape: "rectangle", position: { x: 0, y: 4 } },
        { id: "g6p",       label: "G6P",            shape: "rectangle", position: { x: 0, y: 2.5 } },
        { id: "pyruvate",  label: "Pyruvate",       shape: "rectangle", position: { x: 0, y: 1 } },
        { id: "acetylcoa", label: "Acetyl-CoA",     shape: "rectangle", position: { x: 0, y: -0.5 } },
      ],
      edges: [
        { id: "e1", from: "glucose",   to: "g6p",       type: "directed", label: "Hexokinase" },
        { id: "e2", from: "g6p",       to: "pyruvate",  type: "directed", label: "Glycolysis" },
        { id: "e3", from: "pyruvate",  to: "acetylcoa", type: "directed", label: "PDH" },
      ],
      layout: "manual", tikzLibraries: ["arrows.meta"], directed: true,
    };
    return graphResult(id, this.pluginId, doc, "Simplified glycolysis pathway.", "fig:glycolysis");
  }

  async edit(_p: string): Promise<VisualFigureResult> { return this.create(); }
  async validate(_r: VisualFigureResult): Promise<ValidationResult> { return { valid: true, issues: [] }; }
  exportLatexBlock(r: VisualFigureResult): string { return r.latexBlock; }
}
