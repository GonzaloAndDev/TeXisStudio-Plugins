import { describe, it, expect } from "vitest";
import { TikzShapeEngine } from "../../../visual-plugins/engines/tikz-shape-engine/engine.js";
import { serializeShape } from "../../../visual-plugins/engines/tikz-shape-engine/serializer.js";
import type { TikzShapeDocument, TikzShape } from "../../../visual-plugins/engines/tikz-shape-engine/types.js";

const engine = new TikzShapeEngine();

describe("serializeShape", () => {
  it("serializes line", () => {
    const shape: TikzShape = { id: "l", type: "line", coords: [{ x: 0, y: 0 }, { x: 1, y: 1 }] };
    expect(serializeShape(shape)).toBe("\\draw (0cm, 0cm) -- (1cm, 1cm);");
  });

  it("serializes circle", () => {
    const shape: TikzShape = { id: "c", type: "circle", coords: [{ x: 0, y: 0 }, { x: 1.5, y: 0 }] };
    expect(serializeShape(shape)).toContain("\\draw");
    expect(serializeShape(shape)).toContain("circle (1.5cm)");
  });

  it("serializes rectangle", () => {
    const shape: TikzShape = { id: "r", type: "rectangle", coords: [{ x: 0, y: 0 }, { x: 2, y: 1 }] };
    expect(serializeShape(shape)).toContain("rectangle");
  });

  it("serializes vector with label", () => {
    const shape: TikzShape = { id: "v", type: "vector", coords: [{ x: 0, y: 0 }, { x: 1, y: 2 }], label: "\\vec{F}" };
    const s = serializeShape(shape);
    expect(s).toContain("-stealth");
    expect(s).toContain("\\vec{F}");
  });

  it("serializes axis", () => {
    const shape: TikzShape = { id: "ax", type: "axis", coords: [{ x: 0, y: 0 }, { x: 4, y: 3 }] };
    const s = serializeShape(shape);
    expect(s).toContain("$x$");
    expect(s).toContain("$y$");
  });

  it("serializes label", () => {
    const shape: TikzShape = { id: "lb", type: "label", coords: [{ x: 1, y: 2 }], label: "$A$" };
    expect(serializeShape(shape)).toContain("\\node");
    expect(serializeShape(shape)).toContain("$A$");
  });

  it("escapes text labels while preserving math and LaTeX commands", () => {
    const plain: TikzShape = { id: "lb", type: "label", coords: [{ x: 1, y: 2 }], label: "A_1 & 95% $p_0$" };
    const latex: TikzShape = { id: "raw", type: "label", coords: [{ x: 1, y: 2 }], label: "\\small Model_1" };
    expect(serializeShape(plain)).toContain("A\\_1 \\& 95\\% $p_0$");
    expect(serializeShape(latex)).toContain("\\small Model\\_1");
  });

  it("applies dashed style", () => {
    const shape: TikzShape = { id: "d", type: "line", coords: [{ x: 0, y: 0 }, { x: 1, y: 0 }], lineStyle: "dashed" };
    expect(serializeShape(shape)).toContain("[dashed]");
  });
});

describe("TikzShapeEngine export", () => {
  it("wraps shapes in tikzpicture", async () => {
    const doc: TikzShapeDocument = {
      engineId: "tikz-shape-engine", version: "1.0.0",
      shapes: [{ id: "l", type: "line", coords: [{ x: 0, y: 0 }, { x: 1, y: 0 }] }],
      viewBox: { width: 4, height: 3, unit: "cm" },
      tikzLibraries: [],
    };
    const result = await engine.export(doc, "latex");
    expect(result.content).toContain("\\begin{tikzpicture}");
    expect(result.content).toContain("\\end{tikzpicture}");
    expect(result.requiredPackages).toContain("tikz");
  });

  it("includes tikzlibraries when present", async () => {
    const doc: TikzShapeDocument = {
      engineId: "tikz-shape-engine", version: "1.0.0",
      shapes: [],
      viewBox: { width: 4, height: 3, unit: "cm" },
      tikzLibraries: ["arrows.meta", "calc"],
    };
    const result = await engine.export(doc, "latex");
    expect(result.content).toContain("\\usetikzlibrary{arrows.meta,calc}");
  });
});
