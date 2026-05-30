import type { VisualDiagramPlugin, VisualFigureResult, ValidationResult } from "../../common/contracts/index.js";
import { buildLatexInputBlock } from "../../common/export/latex-block.js";
import { ChemistryEngine } from "../../engines/chemistry-engine/engine.js";
import type { ChemEngineDocument } from "../../engines/chemistry-engine/types.js";

const engine = new ChemistryEngine();

function generateFigureId(): string {
  const n = Math.floor(Math.random() * 9000) + 1000;
  return `fig_${n}`;
}

function figureIdFromPath(path: string): string {
  const match = path.match(/fig_\d+/);
  return match ? match[0] : generateFigureId();
}

async function buildChemResult(
  figureId: string,
  pluginId: string,
  doc: ChemEngineDocument,
): Promise<VisualFigureResult> {
  const exported = await engine.export(doc, "latex");
  const texPath = `texisstudio-assets/figures/${figureId}/output.tex`;
  const latexBlock = [
    `% texisstudio-figure-id: ${figureId}`,
    exported.content,
    `% /texisstudio-figure-id`,
  ].join("\n");

  return {
    figureId,
    pluginId,
    engineId: "chemistry-engine",
    latexBlock,
    requiredPackages: exported.requiredPackages,
    sourcePath: `texisstudio-assets/figures/${figureId}/source.json`,
    outputPaths: { tex: texPath },
    warnings: exported.warnings,
  };
}

export class ChemicalFormulasPlugin implements VisualDiagramPlugin {
  readonly pluginId = "chemical-formulas";
  readonly displayName = "Chemical Formulas";
  readonly description = "Write chemical formulas with charges, states, and subscripts. Uses mhchem — LaTeX native.";
  readonly category = "chemistry" as const;
  readonly engineId = "chemistry-engine";
  readonly qualityLevel = "official-core" as const;
  readonly requiredPackages = ["mhchem"] as const;

  async create(): Promise<VisualFigureResult> {
    const figureId = generateFigureId();
    const doc: ChemEngineDocument = {
      engineId: "chemistry-engine", version: "1.0.0",
      elements: [{ type: "formula", text: "H2O", state: "l" }],
      preferredOutput: "mhchem",
    };
    return buildChemResult(figureId, this.pluginId, doc);
  }

  async edit(existingFigurePath: string): Promise<VisualFigureResult> {
    const figureId = figureIdFromPath(existingFigurePath);
    const doc: ChemEngineDocument = {
      engineId: "chemistry-engine", version: "1.0.0",
      elements: [], preferredOutput: "mhchem",
    };
    return buildChemResult(figureId, this.pluginId, doc);
  }

  async validate(_result: VisualFigureResult): Promise<ValidationResult> {
    return { valid: true, issues: [] };
  }

  exportLatexBlock(result: VisualFigureResult): string { return result.latexBlock; }
}

export class ChemicalReactionsPlugin implements VisualDiagramPlugin {
  readonly pluginId = "chemical-reactions";
  readonly displayName = "Chemical Reactions";
  readonly description = "Build chemical reaction equations with arrows, conditions, and catalysts. Uses mhchem.";
  readonly category = "chemistry" as const;
  readonly engineId = "chemistry-engine";
  readonly qualityLevel = "official-core" as const;
  readonly requiredPackages = ["mhchem"] as const;

  async create(): Promise<VisualFigureResult> {
    const figureId = generateFigureId();
    const doc: ChemEngineDocument = {
      engineId: "chemistry-engine", version: "1.0.0",
      elements: [{
        type: "reaction",
        reactants: [{ type: "formula", text: "H2", state: "g" }, { type: "formula", text: "O2", state: "g" }],
        products: [{ type: "formula", text: "H2O", state: "l" }],
        arrow: "->",
      }],
      preferredOutput: "mhchem",
    };
    return buildChemResult(figureId, this.pluginId, doc);
  }

  async edit(existingFigurePath: string): Promise<VisualFigureResult> {
    const figureId = figureIdFromPath(existingFigurePath);
    const doc: ChemEngineDocument = {
      engineId: "chemistry-engine", version: "1.0.0",
      elements: [], preferredOutput: "mhchem",
    };
    return buildChemResult(figureId, this.pluginId, doc);
  }

  async validate(_result: VisualFigureResult): Promise<ValidationResult> {
    return { valid: true, issues: [] };
  }

  exportLatexBlock(result: VisualFigureResult): string { return result.latexBlock; }
}

export class ReactionEquilibriaPlugin implements VisualDiagramPlugin {
  readonly pluginId = "reaction-equilibria";
  readonly displayName = "Reaction Equilibria & Conditions";
  readonly description = "Chemical equilibrium reactions with conditions above/below the arrow. Uses mhchem.";
  readonly category = "chemistry" as const;
  readonly engineId = "chemistry-engine";
  readonly qualityLevel = "official-core" as const;
  readonly requiredPackages = ["mhchem"] as const;

  async create(): Promise<VisualFigureResult> {
    const figureId = generateFigureId();
    const doc: ChemEngineDocument = {
      engineId: "chemistry-engine", version: "1.0.0",
      elements: [{
        type: "reaction",
        reactants: [{ type: "formula", text: "N2" }, { type: "formula", text: "3H2" }],
        products: [{ type: "formula", text: "2NH3" }],
        arrow: "<=>",
        conditionsAbove: "450 \\,°C, Fe",
        conditionsBelow: "200 \\,atm",
      }],
      preferredOutput: "mhchem",
    };
    return buildChemResult(figureId, this.pluginId, doc);
  }

  async edit(existingFigurePath: string): Promise<VisualFigureResult> {
    const figureId = figureIdFromPath(existingFigurePath);
    const doc: ChemEngineDocument = {
      engineId: "chemistry-engine", version: "1.0.0",
      elements: [], preferredOutput: "mhchem",
    };
    return buildChemResult(figureId, this.pluginId, doc);
  }

  async validate(_result: VisualFigureResult): Promise<ValidationResult> {
    return { valid: true, issues: [] };
  }

  exportLatexBlock(result: VisualFigureResult): string { return result.latexBlock; }
}

export class ChemicalStructuresPlugin implements VisualDiagramPlugin {
  readonly pluginId = "chemical-structures";
  readonly displayName = "Chemical Structures";
  readonly description = "Simple organic structures and ring systems using ChemFig. Complex structures require manual review.";
  readonly category = "chemistry" as const;
  readonly engineId = "chemistry-engine";
  readonly qualityLevel = "official-core" as const;
  readonly requiredPackages = ["chemfig", "mhchem"] as const;
  readonly scopeWarning = "Suitable for simple organic structures in theses. Complex multi-ring systems may need manual ChemFig adjustment. For full structural chemistry, use ChemDraw and import as PDF/SVG.";

  async create(): Promise<VisualFigureResult> {
    const figureId = generateFigureId();
    const doc: ChemEngineDocument = {
      engineId: "chemistry-engine", version: "1.0.0",
      elements: [{
        type: "structure",
        chemfigSource: "\\chemfig{H-C(-[2]H)(-[6]H)-H}",
        description: "Methane",
      }],
      preferredOutput: "chemfig",
    };
    return buildChemResult(figureId, this.pluginId, doc);
  }

  async edit(existingFigurePath: string): Promise<VisualFigureResult> {
    const figureId = figureIdFromPath(existingFigurePath);
    const doc: ChemEngineDocument = {
      engineId: "chemistry-engine", version: "1.0.0",
      elements: [], preferredOutput: "chemfig",
    };
    return buildChemResult(figureId, this.pluginId, doc);
  }

  async validate(_result: VisualFigureResult): Promise<ValidationResult> {
    return { valid: true, issues: [] };
  }

  exportLatexBlock(result: VisualFigureResult): string { return result.latexBlock; }
}
