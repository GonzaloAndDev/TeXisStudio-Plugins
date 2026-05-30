import { describe, it, expect } from "vitest";
import { ChemistryEngine } from "../../../visual-plugins/engines/chemistry-engine/engine.js";
import { serializeFormula, serializeReaction } from "../../../visual-plugins/engines/chemistry-engine/serializer.js";
import type { ChemEngineDocument } from "../../../visual-plugins/engines/chemistry-engine/types.js";

const engine = new ChemistryEngine();

describe("serializeFormula", () => {
  it("serializes simple formula", () => {
    expect(serializeFormula({ type: "formula", text: "H2O" })).toBe("H2O");
  });

  it("serializes formula with state", () => {
    expect(serializeFormula({ type: "formula", text: "H2O", state: "l" })).toBe("H2O_{(l)}");
  });

  it("serializes formula with charge", () => {
    expect(serializeFormula({ type: "formula", text: "SO4", charge: "2-" })).toBe("SO4^{2-}");
  });
});

describe("serializeReaction", () => {
  it("serializes simple reaction with ->", () => {
    const result = serializeReaction({
      type: "reaction",
      reactants: [{ type: "formula", text: "H2" }, { type: "formula", text: "O2" }],
      products: [{ type: "formula", text: "H2O" }],
      arrow: "->",
    });
    expect(result).toContain("\\ce{");
    expect(result).toContain("H2 + O2");
    expect(result).toContain("H2O");
  });

  it("serializes equilibrium reaction", () => {
    const result = serializeReaction({
      type: "reaction",
      reactants: [{ type: "formula", text: "N2" }, { type: "formula", text: "3H2" }],
      products: [{ type: "formula", text: "2NH3" }],
      arrow: "<=>",
      conditionsAbove: "450 °C",
    });
    expect(result).toContain("->[450 °C]");
  });
});

describe("ChemistryEngine export", () => {
  it("exports formula with mhchem package", async () => {
    const doc: ChemEngineDocument = {
      engineId: "chemistry-engine", version: "1.0.0",
      elements: [{ type: "formula", text: "H2SO4", state: "aq" }],
      preferredOutput: "mhchem",
    };
    const result = await engine.export(doc, "latex");
    expect(result.requiredPackages).toContain("mhchem");
    expect(result.content).toContain("\\ce{H2SO4");
  });

  it("adds chemfig package for structures", async () => {
    const doc: ChemEngineDocument = {
      engineId: "chemistry-engine", version: "1.0.0",
      elements: [{ type: "structure", chemfigSource: "\\chemfig{C-H}", description: "test" }],
      preferredOutput: "chemfig",
    };
    const result = await engine.export(doc, "latex");
    expect(result.requiredPackages).toContain("chemfig");
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it("validates correctly", async () => {
    const doc: ChemEngineDocument = {
      engineId: "chemistry-engine", version: "1.0.0",
      elements: [], preferredOutput: "mhchem",
    };
    const result = await engine.validate(doc);
    expect(result.valid).toBe(true);
  });
});
