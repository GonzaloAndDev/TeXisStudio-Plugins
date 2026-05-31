/**
 * Real LaTeX compilation tests — criteria 8 and 9 from the plan (§2.5).
 *
 * Each test:
 *  1. Generates LaTeX output from a real engine/plugin.
 *  2. First validates structure (fast, no TeX required).
 *  3. Then compiles with latexmk/pdflatex in a standalone document.
 *  4. Asserts a non-empty PDF was produced.
 *
 * If the TeX toolchain is not installed, tests are skipped — not failed.
 * This keeps CI green on machines without MiKTeX/TeX Live.
 */
import { describe, it, expect } from "vitest";
import { compileLatexFragment, detectToolchain } from "../../../visual-plugins/common/latex/compiler.js";
import { validateLatexStructure } from "../../../visual-plugins/common/latex/structural-validator.js";
import { MathEngine } from "../../../visual-plugins/engines/math-engine/engine.js";
import { TikzShapeEngine } from "../../../visual-plugins/engines/tikz-shape-engine/engine.js";
import { PGFPlotsEngine } from "../../../visual-plugins/engines/pgfplots-engine/engine.js";
import { GraphNodeEngine } from "../../../visual-plugins/engines/graph-node-engine/engine.js";
import { CircuiTikZEngine } from "../../../visual-plugins/engines/circuitikz-engine/engine.js";
import { ChemistryEngine } from "../../../visual-plugins/engines/chemistry-engine/engine.js";
import { TreeForestEngine } from "../../../visual-plugins/engines/tree-forest-engine/engine.js";
import { TimelineGanttEngine } from "../../../visual-plugins/engines/timeline-gantt-engine/engine.js";
import type { MathEngineDocument } from "../../../visual-plugins/engines/math-engine/types.js";
import type { TikzShapeDocument } from "../../../visual-plugins/engines/tikz-shape-engine/types.js";
import type { PGFPlotsDocument } from "../../../visual-plugins/engines/pgfplots-engine/types.js";
import type { GraphNodeDocument } from "../../../visual-plugins/engines/graph-node-engine/types.js";
import type { CircuiTikZDocument } from "../../../visual-plugins/engines/circuitikz-engine/types.js";
import type { ChemEngineDocument } from "../../../visual-plugins/engines/chemistry-engine/types.js";
import type { TreeForestDocument } from "../../../visual-plugins/engines/tree-forest-engine/types.js";
import type { TimelineGanttDocument } from "../../../visual-plugins/engines/timeline-gantt-engine/types.js";

const toolchain = detectToolchain();

function skip(result: ReturnType<typeof compileLatexFragment>, label: string) {
  if (!result.toolchainAvailable) {
    console.warn(`  ⚠ SKIP ${label}: no LaTeX toolchain on PATH`);
    return true;
  }
  return false;
}

// ── Math Engine ─────────────────────────────────────────────────────────────

describe("LaTeX compile — MathEngine", () => {
  const eng = new MathEngine();

  it("compiles a numbered equation", async () => {
    const doc: MathEngineDocument = {
      engineId: "math-engine", version: "1.0.0", mode: "equation", numbered: true,
      label: "eq:test", tree: [{ type: "symbol", content: "E = mc^2" }],
    };
    const { content } = await eng.export(doc, "latex");
    const latex = content as string;

    const structural = validateLatexStructure(latex);
    expect(structural.valid, structural.issues.map(i => i.message).join("; ")).toBe(true);

    const result = compileLatexFragment(latex, { packages: ["amsmath", "amssymb"] });
    if (skip(result, "MathEngine equation")) return;
    expect(result.ok, `LaTeX errors:\n${result.errors.join("\n")}`).toBe(true);
    expect(result.pdfBytes).toBeGreaterThan(0);
  });

  it("compiles a 2×2 pmatrix", async () => {
    const doc = { engineId: "math-engine", version: "1.0.0", mode: "matrix" as const, numbered: false, tree: [],
      rows: 2, cols: 2, delimiter: "paren" as const, cells: [["a_{11}", "a_{12}"], ["a_{21}", "a_{22}"]] };
    const { content } = await eng.export(doc, "latex");
    const structural = validateLatexStructure(content as string);
    expect(structural.valid).toBe(true);
    const result = compileLatexFragment(content as string, { packages: ["amsmath"] });
    if (skip(result, "MathEngine pmatrix")) return;
    expect(result.ok, result.errors.join("\n")).toBe(true);
  });

  it("compiles a system of equations", async () => {
    const doc = { engineId: "math-engine", version: "1.0.0", mode: "system" as const, numbered: false, tree: [],
      equations: ["2x + 3y &= 7", "x - y &= 1"], variables: ["x", "y"] };
    const { content } = await eng.export(doc, "latex");
    const structural = validateLatexStructure(content as string);
    expect(structural.valid).toBe(true);
    const result = compileLatexFragment(content as string, { packages: ["amsmath"] });
    if (skip(result, "MathEngine system")) return;
    expect(result.ok, result.errors.join("\n")).toBe(true);
  });

  it("compiles sum/integral/limit", async () => {
    const doc: MathEngineDocument = {
      engineId: "math-engine", version: "1.0.0", mode: "equation", numbered: false,
      tree: [{ type: "sum", content: "", options: { lower: "i=0", upper: "n" }, children: [{ type: "symbol", content: "x_i" }] }],
    };
    const { content } = await eng.export(doc, "latex");
    const structural = validateLatexStructure(content as string);
    expect(structural.valid).toBe(true);
    const result = compileLatexFragment(content as string, { packages: ["amsmath", "amssymb"] });
    if (skip(result, "MathEngine sum")) return;
    expect(result.ok, result.errors.join("\n")).toBe(true);
  });
});

// ── TikZ Shape Engine ────────────────────────────────────────────────────────

describe("LaTeX compile — TikzShapeEngine", () => {
  const eng = new TikzShapeEngine();

  it("compiles a free-body diagram", async () => {
    const doc: TikzShapeDocument = {
      engineId: "tikz-shape-engine", version: "1.0.0",
      shapes: [
        { id: "block", type: "rectangle", coords: [{ x: -0.5, y: -0.5 }, { x: 0.5, y: 0.5 }], fill: "gray!30" },
        { id: "W",     type: "vector",    coords: [{ x: 0, y: -0.5 }, { x: 0, y: -2 }], label: "W" },
        { id: "N",     type: "vector",    coords: [{ x: 0, y: 0.5 },  { x: 0, y: 2 }],  label: "N" },
      ],
      viewBox: { width: 6, height: 6, unit: "cm" }, tikzLibraries: [],
    };
    const { content } = await eng.export(doc, "latex");
    const structural = validateLatexStructure(content as string);
    expect(structural.valid).toBe(true);
    const result = compileLatexFragment(content as string, { packages: ["tikz"] });
    if (skip(result, "TikZ FBD")) return;
    expect(result.ok, result.errors.join("\n")).toBe(true);
  });

  it("compiles a Venn diagram", async () => {
    const doc: TikzShapeDocument = {
      engineId: "tikz-shape-engine", version: "1.0.0",
      shapes: [
        { id: "a", type: "circle", coords: [{ x: -0.8, y: 0 }, { x: 1, y: 0 }], fill: "blue!20" },
        { id: "b", type: "circle", coords: [{ x: 0.8,  y: 0 }, { x: 1, y: 0 }], fill: "red!20" },
      ],
      viewBox: { width: 6, height: 4, unit: "cm" }, tikzLibraries: [],
    };
    const { content } = await eng.export(doc, "latex");
    const structural = validateLatexStructure(content as string);
    expect(structural.valid).toBe(true);
    const result = compileLatexFragment(content as string, { packages: ["tikz"] });
    if (skip(result, "TikZ Venn")) return;
    expect(result.ok, result.errors.join("\n")).toBe(true);
  });
});

// ── PGFPlots Engine ──────────────────────────────────────────────────────────

describe("LaTeX compile — PGFPlotsEngine", () => {
  const eng = new PGFPlotsEngine();

  it("compiles a 2D function plot", async () => {
    const doc: PGFPlotsDocument = {
      engineId: "pgfplots-engine", version: "1.0.0",
      series: [{ id: "s1", label: "$x^2$", plotType: "function2d", expression: "x^2", domain: [-2, 2] }],
      xLabel: "$x$", yLabel: "$y$", xScale: "linear", yScale: "linear",
      showLegend: false, grid: "major",
    };
    const { content } = await eng.export(doc, "latex");
    const structural = validateLatexStructure(content as string);
    expect(structural.valid).toBe(true);
    const result = compileLatexFragment(content as string, { packages: ["pgfplots", "tikz"] });
    if (skip(result, "PGFPlots function2d")) return;
    expect(result.ok, result.errors.join("\n")).toBe(true);
  });

  it("compiles a normal distribution", async () => {
    const doc: PGFPlotsDocument = {
      engineId: "pgfplots-engine", version: "1.0.0",
      series: [{ id: "norm", label: "$\\mathcal{N}(0,1)$", plotType: "function2d",
        expression: "exp(-x^2/2)/sqrt(2*pi)", domain: [-4, 4], color: "blue" }],
      xLabel: "$z$", yLabel: "$f(z)$", xScale: "linear", yScale: "linear",
      showLegend: true, grid: "major",
    };
    const { content } = await eng.export(doc, "latex");
    const structural = validateLatexStructure(content as string);
    expect(structural.valid).toBe(true);
    const result = compileLatexFragment(content as string, { packages: ["pgfplots", "tikz"] });
    if (skip(result, "PGFPlots normal dist")) return;
    expect(result.ok, result.errors.join("\n")).toBe(true);
  });
});

// ── Graph-Node Engine ────────────────────────────────────────────────────────

describe("LaTeX compile — GraphNodeEngine", () => {
  const eng = new GraphNodeEngine();

  it("compiles a flowchart", async () => {
    const doc: GraphNodeDocument = {
      engineId: "graph-node-engine", version: "1.0.0",
      nodes: [
        { id: "start", label: "Start",   shape: "circle",    position: { x: 0, y: 3 } },
        { id: "proc",  label: "Process", shape: "rectangle", position: { x: 0, y: 1.5 } },
        { id: "end",   label: "End",     shape: "circle",    position: { x: 0, y: 0 } },
      ],
      edges: [
        { id: "e1", from: "start", to: "proc", type: "directed" },
        { id: "e2", from: "proc",  to: "end",  type: "directed" },
      ],
      layout: "manual", tikzLibraries: ["arrows.meta"], directed: true,
    };
    const { content } = await eng.export(doc, "latex");
    const structural = validateLatexStructure(content as string);
    expect(structural.valid).toBe(true);
    const result = compileLatexFragment(content as string, { packages: ["tikz"] });
    if (skip(result, "GraphNode flowchart")) return;
    expect(result.ok, result.errors.join("\n")).toBe(true);
  });
});

// ── CircuiTikZ Engine ────────────────────────────────────────────────────────

describe("LaTeX compile — CircuiTikZEngine", () => {
  const eng = new CircuiTikZEngine();

  it("compiles a basic RC circuit", async () => {
    const doc: CircuiTikZDocument = {
      engineId: "circuitikz-engine", version: "1.0.0",
      nodes: [
        { id: "A", x: 0, y: 2 }, { id: "B", x: 3, y: 2 },
        { id: "C", x: 3, y: 0 }, { id: "D", x: 0, y: 0 },
      ],
      components: [
        { id: "R1", type: "resistor", from: "A", to: "B", direction: "right", label: "$R$", value: "1k\\Omega" },
        { id: "V1", type: "voltage-source", from: "D", to: "A", direction: "up", label: "$V_s$" },
      ],
      connections: [{ from: "B", to: "C" }, { from: "C", to: "D" }],
      americanStyle: true,
    };
    const { content } = await eng.export(doc, "latex");
    const structural = validateLatexStructure(content as string);
    expect(structural.valid).toBe(true);
    const result = compileLatexFragment(content as string, { packages: ["circuitikz"] });
    if (skip(result, "CircuiTikZ RC circuit")) return;
    expect(result.ok, result.errors.join("\n")).toBe(true);
  });
});

// ── Chemistry Engine ─────────────────────────────────────────────────────────

describe("LaTeX compile — ChemistryEngine", () => {
  const eng = new ChemistryEngine();

  it("compiles a mhchem reaction", async () => {
    const doc: ChemEngineDocument = {
      engineId: "chemistry-engine", version: "1.0.0",
      elements: [{
        type: "reaction",
        reactants: [{ type: "formula", text: "2H2", state: "g" }, { type: "formula", text: "O2", state: "g" }],
        products: [{ type: "formula", text: "2H2O", state: "l" }],
        arrow: "->",
      }],
      preferredOutput: "mhchem",
    };
    const { content } = await eng.export(doc, "latex");
    const structural = validateLatexStructure(content as string);
    expect(structural.valid).toBe(true);
    const result = compileLatexFragment(content as string, { packages: ["mhchem"] });
    if (skip(result, "Chemistry mhchem reaction")) return;
    expect(result.ok, result.errors.join("\n")).toBe(true);
  });

  it("compiles equilibrium with conditions", async () => {
    const doc: ChemEngineDocument = {
      engineId: "chemistry-engine", version: "1.0.0",
      elements: [{
        type: "reaction",
        reactants: [{ type: "formula", text: "N2" }, { type: "formula", text: "3H2" }],
        products: [{ type: "formula", text: "2NH3" }],
        arrow: "<=>",
        conditionsAbove: "Fe",
        conditionsBelow: "high P",
      }],
      preferredOutput: "mhchem",
    };
    const { content } = await eng.export(doc, "latex");
    const structural = validateLatexStructure(content as string);
    expect(structural.valid).toBe(true);
    const result = compileLatexFragment(content as string, { packages: ["mhchem"] });
    if (skip(result, "Chemistry equilibrium")) return;
    expect(result.ok, result.errors.join("\n")).toBe(true);
  });
});

// ── Tree/Forest Engine ───────────────────────────────────────────────────────

describe("LaTeX compile — TreeForestEngine", () => {
  const eng = new TreeForestEngine();

  it("compiles a probability tree", async () => {
    const doc: TreeForestDocument = {
      engineId: "tree-forest-engine", version: "1.0.0", style: "probability", growth: "east",
      root: {
        id: "root", label: "", children: [
          { id: "H", label: "H", edgeLabel: "0.5", children: [
            { id: "HH", label: "HH", children: [] },
            { id: "HT", label: "HT", children: [] },
          ]},
          { id: "T", label: "T", edgeLabel: "0.5", children: [
            { id: "TH", label: "TH", children: [] },
            { id: "TT", label: "TT", children: [] },
          ]},
        ],
      },
    };
    const { content } = await eng.export(doc, "latex");
    const structural = validateLatexStructure(content as string);
    expect(structural.valid).toBe(true);
    const result = compileLatexFragment(content as string, { packages: ["forest"] });
    if (skip(result, "Forest probability tree")) return;
    expect(result.ok, result.errors.join("\n")).toBe(true);
  });
});

// ── Timeline/Gantt Engine ────────────────────────────────────────────────────

describe("LaTeX compile — TimelineGanttEngine", () => {
  const eng = new TimelineGanttEngine();

  it("compiles a Gantt chart", async () => {
    const doc: TimelineGanttDocument = {
      engineId: "timeline-gantt-engine", version: "1.0.0",
      mode: "gantt", unit: "week", groups: [],
      tasks: [
        { id: "t1", label: "Task 1", start: "1", end: "4" },
        { id: "t2", label: "Task 2", start: "3", end: "7" },
      ],
    };
    const { content } = await eng.export(doc, "latex");
    const structural = validateLatexStructure(content as string);
    expect(structural.valid).toBe(true);
    const result = compileLatexFragment(content as string, { packages: ["pgfgantt"] });
    if (skip(result, "Timeline Gantt")) return;
    expect(result.ok, result.errors.join("\n")).toBe(true);
  });

  it("compiles a TikZ timeline", async () => {
    const doc: TimelineGanttDocument = {
      engineId: "timeline-gantt-engine", version: "1.0.0",
      mode: "timeline", unit: "year", groups: [],
      tasks: [
        { id: "e1", label: "Event A", start: "1900", end: "1900" },
        { id: "e2", label: "Event B", start: "1950", end: "1950" },
      ],
    };
    const { content } = await eng.export(doc, "latex");
    const structural = validateLatexStructure(content as string);
    expect(structural.valid).toBe(true);
    const result = compileLatexFragment(content as string, { packages: ["tikz"] });
    if (skip(result, "Timeline TikZ")) return;
    expect(result.ok, result.errors.join("\n")).toBe(true);
  });
});
