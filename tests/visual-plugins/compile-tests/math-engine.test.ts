import { describe, it, expect } from "vitest";
import { MathEngine } from "../../../visual-plugins/engines/math-engine/engine.js";
import type { MathEngineDocument, MatrixDocument, SystemDocument } from "../../../visual-plugins/engines/math-engine/types.js";

const engine = new MathEngine();

describe("MathEngine — equation mode", () => {
  it("generates numbered equation", async () => {
    const doc: MathEngineDocument = {
      engineId: "math-engine", version: "1.0.0",
      mode: "equation", numbered: true, label: "eq:energy",
      tree: [{ type: "symbol", content: "E = mc^2" }],
    };
    const result = await engine.export(doc, "latex");
    expect(result.content).toContain("\\begin{equation}");
    expect(result.content).toContain("\\label{eq:energy}");
    expect(result.content).toContain("E = mc^2");
    expect(result.content).toContain("\\end{equation}");
  });

  it("generates unnumbered equation", async () => {
    const doc: MathEngineDocument = {
      engineId: "math-engine", version: "1.0.0",
      mode: "equation", numbered: false,
      tree: [{ type: "symbol", content: "a^2 + b^2 = c^2" }],
    };
    const result = await engine.export(doc, "latex");
    expect(result.content).toContain("\\begin{equation*}");
    expect(result.content).toContain("a^2 + b^2 = c^2");
  });

  it("generates inline math", async () => {
    const doc: MathEngineDocument = {
      engineId: "math-engine", version: "1.0.0",
      mode: "inline", numbered: false,
      tree: [{ type: "symbol", content: "x^2" }],
    };
    const result = await engine.export(doc, "latex");
    expect(result.content).toBe("$x^2$");
  });

  it("generates fraction", async () => {
    const doc: MathEngineDocument = {
      engineId: "math-engine", version: "1.0.0",
      mode: "display", numbered: false,
      tree: [{
        type: "fraction", content: "",
        children: [
          { type: "symbol", content: "1" },
          { type: "symbol", content: "2" },
        ],
      }],
    };
    const result = await engine.export(doc, "latex");
    expect(result.content).toContain("\\frac{1}{2}");
  });

  it("generates sqrt", async () => {
    const doc: MathEngineDocument = {
      engineId: "math-engine", version: "1.0.0",
      mode: "display", numbered: false,
      tree: [{
        type: "sqrt", content: "",
        children: [{ type: "symbol", content: "x^2 + y^2" }],
      }],
    };
    const result = await engine.export(doc, "latex");
    expect(result.content).toContain("\\sqrt{x^2 + y^2}");
  });

  it("generates sum", async () => {
    const doc: MathEngineDocument = {
      engineId: "math-engine", version: "1.0.0",
      mode: "equation", numbered: false,
      tree: [{
        type: "sum", content: "",
        options: { lower: "i=1", upper: "n" },
        children: [{ type: "symbol", content: "x_i" }],
      }],
    };
    const result = await engine.export(doc, "latex");
    expect(result.content).toContain("\\sum_{i=1}^{n} x_i");
  });

  it("generates integral", async () => {
    const doc: MathEngineDocument = {
      engineId: "math-engine", version: "1.0.0",
      mode: "equation", numbered: false,
      tree: [{
        type: "integral", content: "",
        options: { lower: "0", upper: "\\infty", diff: "dx" },
        children: [{ type: "symbol", content: "f(x)" }],
      }],
    };
    const result = await engine.export(doc, "latex");
    expect(result.content).toContain("\\int_{0}^{\\infty} f(x) \\, dx");
  });

  it("generates limit", async () => {
    const doc: MathEngineDocument = {
      engineId: "math-engine", version: "1.0.0",
      mode: "equation", numbered: false,
      tree: [{
        type: "limit", content: "",
        options: { variable: "x", to: "\\infty" },
        children: [{ type: "fraction", content: "", children: [{ type: "symbol", content: "1" }, { type: "symbol", content: "x" }] }],
      }],
    };
    const result = await engine.export(doc, "latex");
    expect(result.content).toContain("\\lim_{x \\to \\infty}");
    expect(result.content).toContain("\\frac{1}{x}");
  });
});

describe("MathEngine — matrix mode", () => {
  it("generates pmatrix", async () => {
    const doc: MatrixDocument = {
      engineId: "math-engine", version: "1.0.0",
      mode: "matrix", numbered: false,
      tree: [],
      rows: 2, cols: 2, delimiter: "paren",
      cells: [["a", "b"], ["c", "d"]],
    };
    const result = await engine.export(doc, "latex");
    expect(result.content).toContain("\\begin{pmatrix}");
    expect(result.content).toContain("a & b");
    expect(result.content).toContain("c & d");
    expect(result.content).toContain("\\end{pmatrix}");
  });

  it("generates vmatrix (determinant)", async () => {
    const doc: MatrixDocument = {
      engineId: "math-engine", version: "1.0.0",
      mode: "matrix", numbered: false,
      tree: [],
      rows: 2, cols: 2, delimiter: "vert",
      cells: [["1", "2"], ["3", "4"]],
    };
    const result = await engine.export(doc, "latex");
    expect(result.content).toContain("\\begin{vmatrix}");
  });
});

describe("MathEngine — system of equations", () => {
  it("generates align* for system", async () => {
    const doc: SystemDocument = {
      engineId: "math-engine", version: "1.0.0",
      mode: "system", numbered: false,
      tree: [],
      equations: ["2x + 3y &= 7", "x - y &= 1"],
      variables: ["x", "y"],
    };
    const result = await engine.export(doc, "latex");
    expect(result.content).toContain("\\begin{align*}");
    expect(result.content).toContain("2x + 3y &= 7");
    expect(result.content).toContain("x - y &= 1");
  });
});

describe("MathEngine — cases", () => {
  it("generates cases environment", async () => {
    const doc: MathEngineDocument = {
      engineId: "math-engine", version: "1.0.0",
      mode: "equation", numbered: false,
      tree: [{
        type: "cases", content: "",
        options: {
          cases: [
            { expr: "x", cond: "\\text{if } x \\geq 0" },
            { expr: "-x", cond: "\\text{if } x < 0" },
          ],
        },
      }],
    };
    const result = await engine.export(doc, "latex");
    expect(result.content).toContain("\\begin{cases}");
    expect(result.content).toContain("\\text{if } x \\geq 0");
  });
});

describe("MathEngine — validation", () => {
  it("validates correct document", async () => {
    const doc: MathEngineDocument = {
      engineId: "math-engine", version: "1.0.0",
      mode: "equation", numbered: false,
      tree: [{ type: "symbol", content: "x" }],
    };
    const result = await engine.validate(doc);
    expect(result.valid).toBe(true);
  });

  it("rejects wrong engine", async () => {
    const doc = { engineId: "other-engine", version: "1.0.0", mode: "equation", numbered: false, tree: [] };
    const result = await engine.validate(doc as MathEngineDocument);
    expect(result.valid).toBe(false);
  });
});
