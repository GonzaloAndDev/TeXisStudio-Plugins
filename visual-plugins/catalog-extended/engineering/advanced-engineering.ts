import type { VisualDiagramPlugin, VisualFigureResult, ValidationResult } from "../../common/contracts/index.js";
import { buildLatexInputBlock } from "../../common/export/latex-block.js";
import { GraphNodeEngine } from "../../engines/graph-node-engine/engine.js";
import { CircuiTikZEngine } from "../../engines/circuitikz-engine/engine.js";
import { PGFPlotsEngine } from "../../engines/pgfplots-engine/engine.js";
import type { GraphNodeDocument } from "../../engines/graph-node-engine/types.js";
import type { CircuiTikZDocument } from "../../engines/circuitikz-engine/types.js";
import type { PGFPlotsDocument } from "../../engines/pgfplots-engine/types.js";

const graphEng = new GraphNodeEngine();
const circEng  = new CircuiTikZEngine();
const pgfEng   = new PGFPlotsEngine();

function fid(): string { return `fig_${Math.floor(Math.random() * 9000) + 1000}`; }

async function gR(id: string, pid: string, doc: GraphNodeDocument, caption: string, label: string): Promise<VisualFigureResult> {
  const exp = await graphEng.export(doc, "latex");
  const tex = `texisstudio-assets/figures/${id}/output.tex`;
  return { figureId: id, pluginId: pid, engineId: "graph-node-engine", latexBlock: buildLatexInputBlock({ figureId: id, inputPath: tex, caption, label }), requiredPackages: exp.requiredPackages, sourcePath: `texisstudio-assets/figures/${id}/source.json`, outputPaths: { tex }, warnings: [] };
}

async function pgfR(id: string, pid: string, doc: PGFPlotsDocument, caption: string, label: string): Promise<VisualFigureResult> {
  const exp = await pgfEng.export(doc, "latex");
  const tex = `texisstudio-assets/figures/${id}/output.tex`;
  return { figureId: id, pluginId: pid, engineId: "pgfplots-engine", latexBlock: buildLatexInputBlock({ figureId: id, inputPath: tex, caption, label }), requiredPackages: exp.requiredPackages, sourcePath: `texisstudio-assets/figures/${id}/source.json`, outputPaths: { tex }, warnings: [] };
}

// Plugin 44 — ER diagrams
export class ERDiagramPlugin implements VisualDiagramPlugin {
  readonly pluginId = "er-diagrams";
  readonly displayName = "ER Diagrams";
  readonly description = "Entity-relationship diagrams for database design. TikZ native.";
  readonly category = "engineering-cs" as const;
  readonly engineId = "graph-node-engine";
  readonly qualityLevel = "official-extended" as const;
  readonly requiredPackages = ["tikz"] as const;

  async create(): Promise<VisualFigureResult> {
    const id = fid();
    const doc: GraphNodeDocument = {
      engineId: "graph-node-engine", version: "1.0.0",
      nodes: [
        { id: "student",  label: "Student",   shape: "rectangle", position: { x: 0, y: 0 } },
        { id: "course",   label: "Course",    shape: "rectangle", position: { x: 4, y: 0 } },
        { id: "enroll",   label: "Enrolls",   shape: "diamond",   position: { x: 2, y: 0 } },
        { id: "sid",      label: "StudentID", shape: "ellipse",   position: { x: -1, y: -1.5 } },
        { id: "cid",      label: "CourseID",  shape: "ellipse",   position: { x: 5, y: -1.5 } },
      ],
      edges: [
        { id: "e1", from: "student", to: "enroll",  type: "undirected" },
        { id: "e2", from: "enroll",  to: "course",  type: "undirected" },
        { id: "e3", from: "student", to: "sid",     type: "undirected" },
        { id: "e4", from: "course",  to: "cid",     type: "undirected" },
      ],
      layout: "manual", tikzLibraries: ["shapes.geometric"], directed: false,
    };
    return gR(id, this.pluginId, doc, "Entity-relationship diagram.", "fig:er-diagram");
  }

  async edit(_p: string): Promise<VisualFigureResult> { return this.create(); }
  async validate(_r: VisualFigureResult): Promise<ValidationResult> { return { valid: true, issues: [] }; }
  exportLatexBlock(r: VisualFigureResult): string { return r.latexBlock; }
}

// Plugin 47 — State machines
export class StateMachinePlugin implements VisualDiagramPlugin {
  readonly pluginId = "state-machines";
  readonly displayName = "State Machines";
  readonly description = "Finite state machines and automata with states, transitions, and labels.";
  readonly category = "engineering-cs" as const;
  readonly engineId = "graph-node-engine";
  readonly qualityLevel = "official-extended" as const;
  readonly requiredPackages = ["tikz"] as const;

  async create(): Promise<VisualFigureResult> {
    const id = fid();
    const doc: GraphNodeDocument = {
      engineId: "graph-node-engine", version: "1.0.0",
      nodes: [
        { id: "q0", label: "$q_0$", shape: "circle", position: { x: 0, y: 0 }, style: "initial" },
        { id: "q1", label: "$q_1$", shape: "circle", position: { x: 3, y: 0 } },
        { id: "q2", label: "$q_2$", shape: "circle", position: { x: 6, y: 0 }, style: "double" },
      ],
      edges: [
        { id: "e1", from: "q0", to: "q1", type: "directed", label: "a" },
        { id: "e2", from: "q1", to: "q2", type: "directed", label: "b" },
        { id: "e3", from: "q1", to: "q0", type: "directed", label: "a" },
        { id: "e4", from: "q2", to: "q0", type: "directed", label: "b" },
      ],
      layout: "manual", tikzLibraries: ["automata", "arrows.meta"], directed: true,
    };
    return gR(id, this.pluginId, doc, "Finite state machine.", "fig:fsm");
  }

  async edit(_p: string): Promise<VisualFigureResult> { return this.create(); }
  async validate(_r: VisualFigureResult): Promise<ValidationResult> { return { valid: true, issues: [] }; }
  exportLatexBlock(r: VisualFigureResult): string { return r.latexBlock; }
}

// Plugin 49 — Markov chains
export class MarkovChainsPlugin implements VisualDiagramPlugin {
  readonly pluginId = "markov-chains";
  readonly displayName = "Markov Chains";
  readonly description = "Markov chain diagrams with states and transition probabilities.";
  readonly category = "mathematics" as const;
  readonly engineId = "graph-node-engine";
  readonly qualityLevel = "official-extended" as const;
  readonly requiredPackages = ["tikz"] as const;

  async create(): Promise<VisualFigureResult> {
    const id = fid();
    const doc: GraphNodeDocument = {
      engineId: "graph-node-engine", version: "1.0.0",
      nodes: [
        { id: "s1", label: "$S_1$", shape: "circle", position: { x: 0, y: 0 } },
        { id: "s2", label: "$S_2$", shape: "circle", position: { x: 3, y: 0 } },
        { id: "s3", label: "$S_3$", shape: "circle", position: { x: 1.5, y: -2 } },
      ],
      edges: [
        { id: "e1", from: "s1", to: "s2", type: "directed", label: "0.6" },
        { id: "e2", from: "s2", to: "s3", type: "directed", label: "0.4" },
        { id: "e3", from: "s3", to: "s1", type: "directed", label: "0.7" },
        { id: "e4", from: "s1", to: "s1", type: "directed", label: "0.4" },
        { id: "e5", from: "s2", to: "s2", type: "directed", label: "0.6" },
      ],
      layout: "manual", tikzLibraries: ["arrows.meta"], directed: true,
    };
    return gR(id, this.pluginId, doc, "Markov chain.", "fig:markov");
  }

  async edit(_p: string): Promise<VisualFigureResult> { return this.create(); }
  async validate(_r: VisualFigureResult): Promise<ValidationResult> { return { valid: true, issues: [] }; }
  exportLatexBlock(r: VisualFigureResult): string { return r.latexBlock; }
}

// Plugin 55 — Bode/Nyquist
export class BodeNyquistPlugin implements VisualDiagramPlugin {
  readonly pluginId = "bode-nyquist";
  readonly displayName = "Bode / Nyquist Diagrams";
  readonly description = "Frequency response diagrams: Bode magnitude/phase and Nyquist plots.";
  readonly category = "engineering-cs" as const;
  readonly engineId = "pgfplots-engine";
  readonly qualityLevel = "official-extended" as const;
  readonly requiredPackages = ["pgfplots", "tikz"] as const;

  async create(): Promise<VisualFigureResult> {
    const id = fid();
    const doc: PGFPlotsDocument = {
      engineId: "pgfplots-engine", version: "1.0.0",
      series: [{ id: "mag", label: "Magnitude (dB)", plotType: "function2d", expression: "-20*log10(sqrt(1+x^2))", domain: [0.01, 100], color: "blue" }],
      xLabel: "$\\omega$ (rad/s)", yLabel: "Magnitude (dB)",
      xScale: "log", yScale: "linear",
      showLegend: true, grid: "both",
    };
    return pgfR(id, this.pluginId, doc, "Bode magnitude plot.", "fig:bode");
  }

  async edit(_p: string): Promise<VisualFigureResult> { return this.create(); }
  async validate(_r: VisualFigureResult): Promise<ValidationResult> { return { valid: true, issues: [] }; }
  exportLatexBlock(r: VisualFigureResult): string { return r.latexBlock; }
}

export { };
