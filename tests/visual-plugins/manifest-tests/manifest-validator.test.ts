import { describe, it, expect } from "vitest";
import { validateManifest } from "../../../visual-plugins/common/manifest/validator.js";
import type { FigureManifest } from "../../../visual-plugins/common/manifest/schema.js";

const validManifest: FigureManifest = {
  id: "fig_0001",
  pluginId: "circuit-basic",
  pluginVersion: "1.0.0",
  engineId: "circuitikz-engine",
  title: "Circuito equivalente",
  preferredOutput: "latex",
  sourceFile: "source.json",
  latexFile: "output.tex",
  pdfFile: "output.pdf",
  svgFile: null,
  previewFile: "preview.png",
  requiredPackages: ["circuitikz"],
  createdAt: "2026-05-30T00:00:00Z",
  updatedAt: "2026-05-30T00:00:00Z",
  qualityLevel: "official-core",
  editable: true,
  warnings: [],
};

describe("validateManifest", () => {
  it("accepts a valid manifest", () => {
    const result = validateManifest(validManifest);
    expect(result.valid).toBe(true);
    expect(result.issues).toHaveLength(0);
  });

  it("rejects null input", () => {
    const result = validateManifest(null);
    expect(result.valid).toBe(false);
  });

  it("rejects missing required fields", () => {
    const { id: _id, ...incomplete } = validManifest;
    const result = validateManifest(incomplete);
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.field === "id")).toBe(true);
  });

  it("rejects invalid figure ID format", () => {
    const result = validateManifest({ ...validManifest, id: "figure1" });
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.code === "INVALID_ID")).toBe(true);
  });

  it("rejects invalid quality level", () => {
    const result = validateManifest({ ...validManifest, qualityLevel: "top-secret" });
    expect(result.valid).toBe(false);
  });

  it("rejects manifest with no vector output", () => {
    const result = validateManifest({ ...validManifest, latexFile: null, pdfFile: null, svgFile: null });
    expect(result.valid).toBe(false);
    expect(result.issues.some(i => i.code === "NO_VECTOR_OUTPUT")).toBe(true);
  });

  it("warns when editable is false", () => {
    const result = validateManifest({ ...validManifest, editable: false });
    expect(result.issues.some(i => i.code === "NOT_EDITABLE" && i.severity === "warning")).toBe(true);
  });
});
