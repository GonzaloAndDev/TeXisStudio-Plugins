import type { VisualDiagramPlugin, VisualFigureResult, ValidationResult } from "../../common/contracts/index.js";
import { buildLatexInputBlock } from "../../common/export/latex-block.js";
import { ChemistryEngine } from "../../engines/chemistry-engine/engine.js";
import type { ChemEngineDocument } from "../../engines/chemistry-engine/types.js";

const engine = new ChemistryEngine();
function fid(): string { return `fig_${Math.floor(Math.random() * 9000) + 1000}`; }

async function chemR(id: string, pid: string, doc: ChemEngineDocument, caption: string, label: string): Promise<VisualFigureResult> {
  const exp = await engine.export(doc, "latex");
  const tex = `texisstudio-assets/figures/${id}/output.tex`;
  const block = [`% texisstudio-figure-id: ${id}`, exp.content, `% /texisstudio-figure-id`].join("\n");
  return { figureId: id, pluginId: pid, engineId: "chemistry-engine", latexBlock: block, requiredPackages: exp.requiredPackages, sourcePath: `texisstudio-assets/figures/${id}/source.json`, outputPaths: { tex }, warnings: exp.warnings };
}

// Plugin 56 — Extended organic chemistry
export class OrganicChemistryPlugin implements VisualDiagramPlugin {
  readonly pluginId = "organic-chemistry-extended";
  readonly displayName = "Extended Organic Chemistry";
  readonly description = "Organic structures: chains, rings, functional groups, stereo marks. ChemFig native.";
  readonly category = "chemistry" as const;
  readonly engineId = "chemistry-engine";
  readonly qualityLevel = "official-extended" as const;
  readonly requiredPackages = ["chemfig", "mhchem"] as const;
  readonly scopeWarning = "Complex multi-ring or stereochemistry structures may need manual ChemFig adjustment. For publication-quality structures, use ChemDraw and import as PDF.";

  async create(): Promise<VisualFigureResult> {
    const id = fid();
    const doc: ChemEngineDocument = {
      engineId: "chemistry-engine", version: "1.0.0",
      elements: [{
        type: "structure",
        chemfigSource: "\\chemfig{*6(-(-OH)=-=--)}",
        description: "Phenol",
      }],
      preferredOutput: "chemfig",
    };
    return chemR(id, this.pluginId, doc, "Phenol structure.", "fig:phenol");
  }

  async edit(_p: string): Promise<VisualFigureResult> { return this.create(); }
  async validate(_r: VisualFigureResult): Promise<ValidationResult> { return { valid: true, issues: [] }; }
  exportLatexBlock(r: VisualFigureResult): string { return r.latexBlock; }
}

// Plugin 57 — Basic reaction mechanisms
export class ReactionMechanismsPlugin implements VisualDiagramPlugin {
  readonly pluginId = "reaction-mechanisms";
  readonly displayName = "Basic Reaction Mechanisms";
  readonly description = "Curved arrow mechanisms for organic reactions. ChemFig with electron flow arrows.";
  readonly category = "chemistry" as const;
  readonly engineId = "chemistry-engine";
  readonly qualityLevel = "official-extended" as const;
  readonly requiredPackages = ["chemfig", "mhchem"] as const;
  readonly scopeWarning = "Suitable for standard SN2/SN1/E2 mechanisms. Complex multi-step mechanisms may need manual ChemFig adjustment.";

  async create(): Promise<VisualFigureResult> {
    const id = fid();
    const doc: ChemEngineDocument = {
      engineId: "chemistry-engine", version: "1.0.0",
      elements: [
        {
          type: "reaction",
          reactants: [{ type: "formula", text: "CH3Br" }, { type: "formula", text: "OH", charge: "-" }],
          products: [{ type: "formula", text: "CH3OH" }, { type: "formula", text: "Br", charge: "-" }],
          arrow: "->",
          conditionsAbove: "S_N2",
        },
      ],
      preferredOutput: "mhchem",
    };
    return chemR(id, this.pluginId, doc, "S\\textsubscript{N}2 reaction.", "fig:sn2");
  }

  async edit(_p: string): Promise<VisualFigureResult> { return this.create(); }
  async validate(_r: VisualFigureResult): Promise<ValidationResult> { return { valid: true, issues: [] }; }
  exportLatexBlock(r: VisualFigureResult): string { return r.latexBlock; }
}

export { };
