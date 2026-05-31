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

async function treeR(id: string, pid: string, doc: TreeForestDocument, caption: string, label: string): Promise<VisualFigureResult> {
  const exp = await treeEngine.export(doc, "latex");
  const tex = `texisstudio-assets/figures/${id}/output.tex`;
  return { figureId: id, pluginId: pid, engineId: "tree-forest-engine", latexBlock: buildLatexInputBlock({ figureId: id, inputPath: tex, caption, label }), requiredPackages: exp.requiredPackages, sourcePath: `texisstudio-assets/figures/${id}/source.json`, outputPaths: { tex }, warnings: [] };
}

async function graphR(id: string, pid: string, doc: GraphNodeDocument, caption: string, label: string): Promise<VisualFigureResult> {
  const exp = await graphEngine.export(doc, "latex");
  const tex = `texisstudio-assets/figures/${id}/output.tex`;
  return { figureId: id, pluginId: pid, engineId: "graph-node-engine", latexBlock: buildLatexInputBlock({ figureId: id, inputPath: tex, caption, label }), requiredPackages: exp.requiredPackages, sourcePath: `texisstudio-assets/figures/${id}/source.json`, outputPaths: { tex }, warnings: [] };
}

async function tikzR(id: string, pid: string, doc: TikzShapeDocument, caption: string, label: string): Promise<VisualFigureResult> {
  const exp = await tikzEngine.export(doc, "latex");
  const tex = `texisstudio-assets/figures/${id}/output.tex`;
  return { figureId: id, pluginId: pid, engineId: "tikz-shape-engine", latexBlock: buildLatexInputBlock({ figureId: id, inputPath: tex, caption, label }), requiredPackages: exp.requiredPackages, sourcePath: `texisstudio-assets/figures/${id}/source.json`, outputPaths: { tex }, warnings: [] };
}

// Plugin 12 — Probability trees
export class ProbabilityTreesPlugin implements VisualDiagramPlugin {
  readonly pluginId = "probability-trees";
  readonly displayName = "Probability Trees";
  readonly description = "Visual probability trees with branch probabilities and outcomes. forest native.";
  readonly category = "mathematics" as const;
  readonly engineId = "tree-forest-engine";
  readonly qualityLevel = "official-core" as const;
  readonly requiredPackages = ["forest"] as const;

  async create(): Promise<VisualFigureResult> {
    const id = fid();
    const doc: TreeForestDocument = {
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
    return treeR(id, this.pluginId, doc, "Probability tree — two coin flips.", "fig:prob-tree");
  }

  async edit(_p: string): Promise<VisualFigureResult> { return this.create(); }
  async validate(_r: VisualFigureResult): Promise<ValidationResult> { return { valid: true, issues: [] }; }
  exportLatexBlock(r: VisualFigureResult): string { return r.latexBlock; }
}

// Plugin 27 — Simple lab setups
export class LabSetupPlugin implements VisualDiagramPlugin {
  readonly pluginId = "lab-setups";
  readonly displayName = "Simple Lab Setups";
  readonly description = "Basic laboratory apparatus diagrams: flasks, beakers, burettes, tube assemblies.";
  readonly category = "chemistry" as const;
  readonly engineId = "tikz-shape-engine";
  readonly qualityLevel = "official-core" as const;
  readonly requiredPackages = ["tikz"] as const;
  readonly scopeWarning = "Covers standard lab apparatus. For specialized equipment diagrams, use dedicated illustration tools and import as PDF.";

  async create(): Promise<VisualFigureResult> {
    const id = fid();
    const doc: TikzShapeDocument = {
      engineId: "tikz-shape-engine", version: "1.0.0",
      shapes: [
        // flask body
        { id: "flask-neck",  type: "rectangle", coords: [{ x: 0.8, y: 2 }, { x: 1.2, y: 3 }] },
        { id: "flask-body",  type: "ellipse",   coords: [{ x: 1, y: 1.2 }, { x: 1, y: 1 }] },
        { id: "flask-label", type: "label",     coords: [{ x: 1, y: 1.2 }], label: "Flask" },
        // stand
        { id: "stand-rod",   type: "line", coords: [{ x: 2.5, y: 0 }, { x: 2.5, y: 3.5 }], lineWidth: "2pt" },
        { id: "stand-base",  type: "line", coords: [{ x: 2, y: 0 }, { x: 3, y: 0 }],       lineWidth: "2pt" },
        { id: "stand-clamp", type: "rectangle", coords: [{ x: 2.2, y: 2.8 }, { x: 2.5, y: 3.0 }] },
      ],
      viewBox: { width: 5, height: 4, unit: "cm" },
      tikzLibraries: [],
    };
    return tikzR(id, this.pluginId, doc, "Simple laboratory setup.", "fig:lab-setup");
  }

  async edit(_p: string): Promise<VisualFigureResult> { return this.create(); }
  async validate(_r: VisualFigureResult): Promise<ValidationResult> { return { valid: true, issues: [] }; }
  exportLatexBlock(r: VisualFigureResult): string { return r.latexBlock; }
}

// Plugin 34 — Syntax / linguistic trees
export class SyntaxTreesPlugin implements VisualDiagramPlugin {
  readonly pluginId = "syntax-trees";
  readonly displayName = "Syntax / Linguistic Trees";
  readonly description = "Phrase-structure and dependency trees for linguistics. forest native.";
  readonly category = "humanities-social" as const;
  readonly engineId = "tree-forest-engine";
  readonly qualityLevel = "official-core" as const;
  readonly requiredPackages = ["forest"] as const;

  async create(): Promise<VisualFigureResult> {
    const id = fid();
    const doc: TreeForestDocument = {
      engineId: "tree-forest-engine", version: "1.0.0",
      style: "syntax", growth: "south",
      root: {
        id: "S", label: "S", children: [
          { id: "NP", label: "NP", children: [
            { id: "det", label: "Det", children: [{ id: "the", label: "the", children: [] }] },
            { id: "n",   label: "N",   children: [{ id: "cat", label: "cat", children: [] }] },
          ]},
          { id: "VP", label: "VP", children: [
            { id: "v",   label: "V",   children: [{ id: "sat", label: "sat", children: [] }] },
            { id: "PP",  label: "PP",  children: [
              { id: "p",   label: "P",   children: [{ id: "on",  label: "on",  children: [] }] },
              { id: "np2", label: "NP",  children: [{ id: "mat", label: "the mat", children: [] }] },
            ]},
          ]},
        ],
      },
    };
    return treeR(id, this.pluginId, doc, "Phrase-structure tree.", "fig:syntax-tree");
  }

  async edit(_p: string): Promise<VisualFigureResult> { return this.create(); }
  async validate(_r: VisualFigureResult): Promise<ValidationResult> { return { valid: true, issues: [] }; }
  exportLatexBlock(r: VisualFigureResult): string { return r.latexBlock; }
}

// Plugin 35 — Concept maps
export class ConceptMapsPlugin implements VisualDiagramPlugin {
  readonly pluginId = "concept-maps";
  readonly displayName = "Concept Maps & Argument Diagrams";
  readonly description = "Concept maps, mind maps, and argumentative structure diagrams.";
  readonly category = "humanities-social" as const;
  readonly engineId = "graph-node-engine";
  readonly qualityLevel = "official-core" as const;
  readonly requiredPackages = ["tikz"] as const;

  async create(): Promise<VisualFigureResult> {
    const id = fid();
    const doc: GraphNodeDocument = {
      engineId: "graph-node-engine", version: "1.0.0",
      nodes: [
        { id: "central", label: "Central concept",    shape: "ellipse",    position: { x: 0, y: 0 } },
        { id: "a",       label: "Related idea A",      shape: "rectangle",  position: { x: -3, y: 1.5 } },
        { id: "b",       label: "Related idea B",      shape: "rectangle",  position: { x: 3, y: 1.5 } },
        { id: "c",       label: "Sub-concept",         shape: "rectangle",  position: { x: 0, y: -2 } },
        { id: "d",       label: "Example",             shape: "rectangle",  position: { x: -3, y: -1.5 } },
      ],
      edges: [
        { id: "e1", from: "central", to: "a", type: "directed", label: "includes" },
        { id: "e2", from: "central", to: "b", type: "directed", label: "leads to" },
        { id: "e3", from: "central", to: "c", type: "directed", label: "requires" },
        { id: "e4", from: "c",       to: "d", type: "directed", label: "e.g." },
      ],
      layout: "manual", tikzLibraries: ["arrows.meta"], directed: true,
    };
    return graphR(id, this.pluginId, doc, "Concept map.", "fig:concept-map");
  }

  async edit(_p: string): Promise<VisualFigureResult> { return this.create(); }
  async validate(_r: VisualFigureResult): Promise<ValidationResult> { return { valid: true, issues: [] }; }
  exportLatexBlock(r: VisualFigureResult): string { return r.latexBlock; }
}
