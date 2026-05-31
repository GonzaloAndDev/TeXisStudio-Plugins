import { describe, it, expect } from "vitest";
import { ImportTraceabilityEngine } from "../../../visual-plugins/engines/import-traceability-engine/engine.js";

const eng = new ImportTraceabilityEngine();

describe("ImportTraceabilityEngine.analyzeFile", () => {
  it("detects raster file", () => {
    const doc = eng.analyzeFile("figure.png");
    expect(doc.fileType).toBe("png");
    expect(doc.isVector).toBe(false);
    expect(doc.warnings.some(w => w.code === "IS_RASTER")).toBe(true);
  });

  it("accepts PDF as vector", () => {
    const doc = eng.analyzeFile("figure.pdf", { isVector: true });
    expect(doc.isVector).toBe(true);
    expect(doc.warnings.some(w => w.code === "IS_RASTER")).toBe(false);
  });

  it("warns on low resolution", () => {
    const doc = eng.analyzeFile("scan.png", { dpi: 72 });
    expect(doc.warnings.some(w => w.code === "LOW_RESOLUTION")).toBe(true);
  });

  it("warns on absolute path", () => {
    const doc = eng.analyzeFile("/home/user/figure.pdf");
    expect(doc.warnings.some(w => w.code === "ABSOLUTE_PATH")).toBe(true);
  });

  it("does not warn for relative vector path", () => {
    const doc = eng.analyzeFile("figures/diagram.pdf", { isVector: true });
    expect(doc.warnings.filter(w => w.code === "ABSOLUTE_PATH")).toHaveLength(0);
    expect(doc.warnings.filter(w => w.code === "IS_RASTER")).toHaveLength(0);
  });
});

describe("ImportTraceabilityEngine validate", () => {
  it("rejects absolute project paths", async () => {
    const doc = await eng.createDocument();
    (doc as { projectRelativePath: string }).projectRelativePath = "/absolute/path.pdf";
    const result = await eng.validate(doc);
    expect(result.valid).toBe(false);
  });
});
