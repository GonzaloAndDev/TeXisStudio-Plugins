import type { VisualDiagramPlugin, VisualFigureResult, ValidationResult } from "../../common/contracts/index.js";
import { buildLatexInputBlock } from "../../common/export/latex-block.js";
import { CircuiTikZEngine } from "../../engines/circuitikz-engine/engine.js";
import { GraphNodeEngine } from "../../engines/graph-node-engine/engine.js";
import type { CircuiTikZDocument } from "../../engines/circuitikz-engine/types.js";
import type { GraphNodeDocument } from "../../engines/graph-node-engine/types.js";

const circEngine = new CircuiTikZEngine();
const graphEngine = new GraphNodeEngine();

function fid(): string { return `fig_${Math.floor(Math.random() * 9000) + 1000}`; }
function fidFromPath(p: string): string { return p.match(/fig_\d+/)?.[0] ?? fid(); }

async function circResult(figureId: string, pluginId: string, doc: CircuiTikZDocument, caption: string, label: string): Promise<VisualFigureResult> {
  const exp = await circEngine.export(doc, "latex");
  const texPath = `texisstudio-assets/figures/${figureId}/output.tex`;
  return {
    figureId, pluginId, engineId: "circuitikz-engine",
    latexBlock: buildLatexInputBlock({ figureId, inputPath: texPath, caption, label }),
    requiredPackages: exp.requiredPackages,
    sourcePath: `texisstudio-assets/figures/${figureId}/source.json`,
    outputPaths: { tex: texPath }, warnings: [],
  };
}

async function graphResult(figureId: string, pluginId: string, doc: GraphNodeDocument, caption: string, label: string): Promise<VisualFigureResult> {
  const exp = await graphEngine.export(doc, "latex");
  const texPath = `texisstudio-assets/figures/${figureId}/output.tex`;
  return {
    figureId, pluginId, engineId: "graph-node-engine",
    latexBlock: buildLatexInputBlock({ figureId, inputPath: texPath, caption, label }),
    requiredPackages: exp.requiredPackages,
    sourcePath: `texisstudio-assets/figures/${figureId}/source.json`,
    outputPaths: { tex: texPath }, warnings: [],
  };
}

export class BasicCircuitsPlugin implements VisualDiagramPlugin {
  readonly pluginId = "basic-electrical-circuits";
  readonly displayName = "Basic Electrical Circuits";
  readonly description = "Visual circuit builder: resistors, capacitors, inductors, sources, switches, diodes. CircuiTikZ native.";
  readonly category = "engineering-cs" as const;
  readonly engineId = "circuitikz-engine";
  readonly qualityLevel = "official-core" as const;
  readonly requiredPackages = ["circuitikz"] as const;

  async create(): Promise<VisualFigureResult> {
    const id = fid();
    const doc: CircuiTikZDocument = {
      engineId: "circuitikz-engine", version: "1.0.0",
      nodes: [
        { id: "A", x: 0, y: 2 }, { id: "B", x: 3, y: 2 },
        { id: "C", x: 3, y: 0 }, { id: "D", x: 0, y: 0 },
      ],
      components: [
        { id: "R1", type: "resistor",       from: "A", to: "B", direction: "right", label: "$R_1$", value: "10\\,\\Omega" },
        { id: "V1", type: "voltage-source", from: "D", to: "A", direction: "up",    label: "$V_s$", value: "12\\,V" },
        { id: "W1", type: "ground",         from: "D", to: "D", direction: "down" },
      ],
      connections: [{ from: "B", to: "C" }, { from: "C", to: "D" }],
      americanStyle: true,
    };
    return circResult(id, this.pluginId, doc, "Basic resistive circuit.", "fig:circuit-basic");
  }

  async edit(p: string): Promise<VisualFigureResult> { return this.create().then(r => ({ ...r, figureId: fidFromPath(p) })); }
  async validate(_r: VisualFigureResult): Promise<ValidationResult> { return { valid: true, issues: [] }; }
  exportLatexBlock(r: VisualFigureResult): string { return r.latexBlock; }
}

export class BlockDiagramPlugin implements VisualDiagramPlugin {
  readonly pluginId = "block-diagrams-control";
  readonly displayName = "Block Diagrams / Control Systems";
  readonly description = "Control system block diagrams with transfer functions, summing junctions, and feedback loops.";
  readonly category = "engineering-cs" as const;
  readonly engineId = "graph-node-engine";
  readonly qualityLevel = "official-core" as const;
  readonly requiredPackages = ["tikz"] as const;

  async create(): Promise<VisualFigureResult> {
    const id = fid();
    const doc: GraphNodeDocument = {
      engineId: "graph-node-engine", version: "1.0.0",
      nodes: [
        { id: "R",   label: "$R(s)$",     shape: "none",             position: { x: 0, y: 0 } },
        { id: "sum", label: "$\\Sigma$",   shape: "circle",           position: { x: 2, y: 0 } },
        { id: "G",   label: "$G(s)$",      shape: "rectangle",        position: { x: 4, y: 0 } },
        { id: "Y",   label: "$Y(s)$",      shape: "none",             position: { x: 6, y: 0 } },
        { id: "H",   label: "$H(s)$",      shape: "rectangle",        position: { x: 4, y: -1.5 } },
      ],
      edges: [
        { id: "e1", from: "R",   to: "sum", type: "directed" },
        { id: "e2", from: "sum", to: "G",   type: "directed" },
        { id: "e3", from: "G",   to: "Y",   type: "directed" },
        { id: "e4", from: "Y",   to: "H",   type: "directed" },
        { id: "e5", from: "H",   to: "sum", type: "directed" },
      ],
      layout: "manual", tikzLibraries: ["arrows.meta"], directed: true,
    };
    return graphResult(id, this.pluginId, doc, "Closed-loop control system.", "fig:block-control");
  }

  async edit(p: string): Promise<VisualFigureResult> { return this.create().then(r => ({ ...r, figureId: fidFromPath(p) })); }
  async validate(_r: VisualFigureResult): Promise<ValidationResult> { return { valid: true, issues: [] }; }
  exportLatexBlock(r: VisualFigureResult): string { return r.latexBlock; }
}

export class FlowchartPlugin implements VisualDiagramPlugin {
  readonly pluginId = "flowcharts";
  readonly displayName = "Flowcharts";
  readonly description = "Academic and process flowcharts with decision diamonds, process boxes, and connector arrows.";
  readonly category = "engineering-cs" as const;
  readonly engineId = "graph-node-engine";
  readonly qualityLevel = "official-core" as const;
  readonly requiredPackages = ["tikz"] as const;

  async create(): Promise<VisualFigureResult> {
    const id = fid();
    const doc: GraphNodeDocument = {
      engineId: "graph-node-engine", version: "1.0.0",
      nodes: [
        { id: "start", label: "Start",          shape: "rounded-rectangle", position: { x: 0, y: 4 } },
        { id: "proc1", label: "Process 1",       shape: "rectangle",         position: { x: 0, y: 2.5 } },
        { id: "dec1",  label: "Condition?",       shape: "diamond",           position: { x: 0, y: 1 } },
        { id: "proc2", label: "Process 2",       shape: "rectangle",         position: { x: 2, y: 1 } },
        { id: "end",   label: "End",             shape: "rounded-rectangle", position: { x: 0, y: -0.5 } },
      ],
      edges: [
        { id: "e1", from: "start", to: "proc1", type: "directed" },
        { id: "e2", from: "proc1", to: "dec1",  type: "directed" },
        { id: "e3", from: "dec1",  to: "proc2", type: "directed", label: "Yes" },
        { id: "e4", from: "dec1",  to: "end",   type: "directed", label: "No" },
        { id: "e5", from: "proc2", to: "end",   type: "directed" },
      ],
      layout: "manual", tikzLibraries: ["arrows.meta", "shapes.geometric"], directed: true,
    };
    return graphResult(id, this.pluginId, doc, "Process flowchart.", "fig:flowchart");
  }

  async edit(p: string): Promise<VisualFigureResult> { return this.create().then(r => ({ ...r, figureId: fidFromPath(p) })); }
  async validate(_r: VisualFigureResult): Promise<ValidationResult> { return { valid: true, issues: [] }; }
  exportLatexBlock(r: VisualFigureResult): string { return r.latexBlock; }
}

export class SoftwareArchitecturePlugin implements VisualDiagramPlugin {
  readonly pluginId = "software-architecture";
  readonly displayName = "Software / System Architecture";
  readonly description = "Component, layer, and system architecture diagrams.";
  readonly category = "engineering-cs" as const;
  readonly engineId = "graph-node-engine";
  readonly qualityLevel = "official-core" as const;
  readonly requiredPackages = ["tikz"] as const;
  readonly scopeWarning = "Suitable for standard architecture overviews. For complex UML or deployment diagrams, use Draw.io and import as PDF.";

  async create(): Promise<VisualFigureResult> {
    const id = fid();
    const doc: GraphNodeDocument = {
      engineId: "graph-node-engine", version: "1.0.0",
      nodes: [
        { id: "ui",  label: "UI Layer",      shape: "rectangle", position: { x: 0, y: 3 } },
        { id: "api", label: "API Layer",      shape: "rectangle", position: { x: 0, y: 1.5 } },
        { id: "db",  label: "Database",       shape: "rectangle", position: { x: 0, y: 0 } },
      ],
      edges: [
        { id: "e1", from: "ui",  to: "api", type: "directed" },
        { id: "e2", from: "api", to: "db",  type: "directed" },
      ],
      layout: "manual", tikzLibraries: [], directed: true,
    };
    return graphResult(id, this.pluginId, doc, "System architecture.", "fig:architecture");
  }

  async edit(p: string): Promise<VisualFigureResult> { return this.create().then(r => ({ ...r, figureId: fidFromPath(p) })); }
  async validate(_r: VisualFigureResult): Promise<ValidationResult> { return { valid: true, issues: [] }; }
  exportLatexBlock(r: VisualFigureResult): string { return r.latexBlock; }
}
