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
import { NotationEngine } from "../../../visual-plugins/engines/notation-engine/engine.js";
import { serializeTableData } from "../../../visual-plugins/engines/table-data-engine/serializer.js";
import { CHEMFIG_TEMPLATES, serializeStructure } from "../../../visual-plugins/engines/chemistry-engine/serializer.js";
import type { ChemStructureTemplate } from "../../../visual-plugins/engines/chemistry-engine/types.js";
import type { TableDataDocument } from "../../../visual-plugins/engines/table-data-engine/types.js";
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

  it("serializes 3D surface options without empty PGFPlots options", async () => {
    const doc: PGFPlotsDocument = {
      engineId: "pgfplots-engine", version: "1.0.0",
      series: [{ id: "surf", label: "", plotType: "surface",
        expression: "{exp(-0.5*(x^2+y^2))/(2*pi)}", domain: [-3, 3] }],
      xLabel: "$x$", yLabel: "$y$", xScale: "linear", yScale: "linear",
      showLegend: false, grid: "major",
      pgfplotsOptions: "view={45}{35}",
    };
    const { content } = await eng.export(doc, "latex");
    expect(content).toContain("\\addplot3[surf, samples=20, domain=-3:3, domain y=-3:3]");
    expect(content).not.toContain(", ,");
  });

  it("compiles a correlation heatmap as a real matrix plot", async () => {
    // Grilla 3×3 (matriz de correlación). meta ∈ [-1,1].
    const data = [];
    for (let y = 0; y < 3; y++) for (let x = 0; x < 3; x++) {
      data.push({ x, y, meta: x === y ? 1 : (x + y) % 2 === 0 ? 0.5 : -0.4 });
    }
    const doc: PGFPlotsDocument = {
      engineId: "pgfplots-engine", version: "1.0.0",
      series: [{ id: "corr", label: "", plotType: "heatmap", data }],
      xLabel: "", yLabel: "", xScale: "linear", yScale: "linear",
      showLegend: false, grid: false,
    };
    const { content } = await eng.export(doc, "latex");
    expect(content).toContain("matrix plot*");
    expect(content).toContain("mesh/cols=3");
    expect(content).not.toContain("mark size=20pt"); // ya no usa marcadores fijos
    const structural = validateLatexStructure(content as string);
    expect(structural.valid).toBe(true);
    const result = compileLatexFragment(content as string, { packages: ["pgfplots", "tikz"] });
    if (skip(result, "PGFPlots heatmap matrix")) return;
    expect(result.ok, result.errors.join("\n")).toBe(true);
  });

  it("heatmap falls back to markers (compiles) when the grid is incomplete", async () => {
    // 3×3 menos una celda → grilla incompleta: matrix plot rompería, debe caer
    // a marcadores y seguir compilando.
    const data = [];
    for (let y = 0; y < 3; y++) for (let x = 0; x < 3; x++) {
      if (x === 2 && y === 2) continue; // hueco
      data.push({ x, y, meta: 0.3 });
    }
    const doc: PGFPlotsDocument = {
      engineId: "pgfplots-engine", version: "1.0.0",
      series: [{ id: "corr", label: "", plotType: "heatmap", data }],
      xLabel: "", yLabel: "", xScale: "linear", yScale: "linear",
      showLegend: false, grid: false,
    };
    const { content } = await eng.export(doc, "latex");
    expect(content).not.toContain("matrix plot*"); // grilla incompleta → no matrix plot
    expect(content).toContain("mark=square*");
    const result = compileLatexFragment(content as string, { packages: ["pgfplots", "tikz"] });
    if (skip(result, "PGFPlots heatmap fallback")) return;
    expect(result.ok, result.errors.join("\n")).toBe(true);
  });

  it("compiles a boxplot from an explicit five-number summary", async () => {
    const doc: PGFPlotsDocument = {
      engineId: "pgfplots-engine", version: "1.0.0",
      series: [{ id: "bx", label: "Grupo A", plotType: "boxplot", color: "blue",
        data: [{ x: 1, y: 50, q1: 40, q3: 65, whiskerMin: 20, whiskerMax: 90 }] }],
      xLabel: "", yLabel: "valor", xScale: "linear", yScale: "linear",
      showLegend: false, grid: "major",
    };
    const { content } = await eng.export(doc, "latex");
    // Debe usar los cuartiles EXPLÍCITOS, no derivarlos de y±error.
    expect(content).toContain("lower quartile=40.00");
    expect(content).toContain("upper quartile=65.00");
    expect(content).toContain("lower whisker=20.00");
    expect(content).toContain("upper whisker=90.00");
    const structural = validateLatexStructure(content as string);
    expect(structural.valid).toBe(true);
    const result = compileLatexFragment(content as string, { packages: ["pgfplots", "tikz"] });
    if (skip(result, "PGFPlots boxplot explicit")) return;
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

  it("escapes text labels while preserving inline math", async () => {
    const doc: GraphNodeDocument = {
      engineId: "graph-node-engine", version: "1.0.0",
      nodes: [
        { id: "a", label: "Data_1 & model $G(s)$", shape: "rectangle", position: { x: 0, y: 0 } },
        { id: "b", label: "Output #1", shape: "rectangle", position: { x: 3, y: 0 } },
      ],
      edges: [{ id: "e1", from: "a", to: "b", type: "directed", label: "95% CI & $p<.05$" }],
      layout: "manual", tikzLibraries: [], directed: true,
    };
    const { content } = await eng.export(doc, "latex");
    expect(content).toContain("Data\\_1 \\& model $G(s)$");
    expect(content).toContain("Output \\#1");
    expect(content).toContain("95\\% CI \\& $p<.05$");
  });

  it("serializes self-loops as TikZ loop edges", async () => {
    const doc: GraphNodeDocument = {
      engineId: "graph-node-engine", version: "1.0.0",
      nodes: [{ id: "S", label: "State", shape: "circle", position: { x: 0, y: 0 } }],
      edges: [{ id: "stay", from: "S", to: "S", type: "directed", label: "0.8" }],
      layout: "manual", tikzLibraries: [], directed: true,
    };
    const { content } = await eng.export(doc, "latex");
    expect(content).toContain("(S) edge[loop above]");
    expect(content).not.toContain("(S) -- (S)");
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
    // Las conexiones (cables) deben aparecer en la salida — antes se ignoraban.
    expect(content as string).toContain("(B) to[short] (C)");
    expect(content as string).toContain("(C) to[short] (D)");
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

  // Cada plantilla chemfig integrada DEBE compilar — si una falla, no debe
  // shippear. Esto garantiza que el catálogo de estructuras es estable.
  const templates = Object.keys(CHEMFIG_TEMPLATES) as ChemStructureTemplate[];
  it.each(templates)("compiles chemfig template: %s", (tpl) => {
    const out = serializeStructure({ type: "structure", template: tpl });
    expect(out.startsWith("\\chemfig{")).toBe(true);
    const structural = validateLatexStructure(out);
    expect(structural.valid).toBe(true);
    const result = compileLatexFragment(out, { packages: ["chemfig"] });
    if (skip(result, `chemfig ${tpl}`)) return;
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

// ── Table/Data Engine ────────────────────────────────────────────────────────

describe("LaTeX compile — TableDataEngine", () => {
  it("compiles a booktabs table with a siunitx S (decimal) column", () => {
    const doc: TableDataDocument = {
      engineId: "table-data-engine", version: "1.0.0",
      exportTarget: "booktabs", booktabsStyle: true,
      columns: [
        { id: "name", header: "Muestra", type: "label" },
        { id: "mass", header: "Masa", unit: "g", type: "number", align: "decimal" },
        { id: "err",  header: "Error", type: "number", align: "right" },
      ],
      rows: [
        { name: "A", mass: 1.5, err: 0.02 },
        { name: "B", mass: 12.25, err: 0.1 },
        { name: "C", mass: 100, err: "" }, // celda vacía en columna S → {}
      ],
    };
    const content = serializeTableData(doc);
    expect(content).toContain("\\begin{tabular}{lSr}"); // S = columna decimal
    expect(content).toContain("{Masa (g)}"); // encabezado S entre llaves
    const structural = validateLatexStructure(content);
    expect(structural.valid).toBe(true);
    const result = compileLatexFragment(content, { packages: ["booktabs", "siunitx"] });
    if (skip(result, "TableData siunitx")) return;
    expect(result.ok, result.errors.join("\n")).toBe(true);
  });
});

// ── Notation Engine ──────────────────────────────────────────────────────────

describe("LaTeX compile — NotationEngine", () => {
  const eng = new NotationEngine();

  it("compiles an algorithm (algorithm + algpseudocode)", async () => {
    const doc = {
      engineId: "notation-engine", version: "1.0.0",
      type: "algorithm", title: "Búsqueda binaria", label: "alg:bsearch",
      numbered: true,
      content: [
        "\\State $lo \\gets 0$",
        "\\State $hi \\gets n - 1$",
        "\\While{$lo \\leq hi$}",
        "  \\State $mid \\gets \\lfloor (lo+hi)/2 \\rfloor$",
        "\\EndWhile",
        "\\State \\Return $-1$",
      ].join("\n"),
    } as const;
    const { content, requiredPackages } = await eng.export(doc as never, "latex");
    // El paquete declarado debe casar con la sintaxis del cuerpo (algorithmic),
    // no con algorithm2e (que no define `algorithmic`).
    expect(requiredPackages).toContain("algpseudocode");
    expect(requiredPackages).not.toContain("algorithm2e");
    expect(content as string).not.toContain("\\begin{algorithm}*");
    const structural = validateLatexStructure(content as string);
    expect(structural.valid).toBe(true);
    const result = compileLatexFragment(content as string, { packages: requiredPackages });
    if (skip(result, "Notation algorithm")) return;
    expect(result.ok, result.errors.join("\n")).toBe(true);
  });
});
