import { BasePlugin } from "../../common/plugin-base/index.js";
import { ChemistryEngine } from "../../engines/chemistry-engine/engine.js";
import type { ChemEngineDocument } from "../../engines/chemistry-engine/types.js";

const engine = new ChemistryEngine();

// ── Plugin 56 — Extended Organic Chemistry ────────────────────────

export class OrganicChemistryPlugin extends BasePlugin<ChemEngineDocument> {
  constructor() {
    super(engine, {
      pluginId:        "organic-chemistry-extended",
      displayName:     "Extended Organic Chemistry",
      description:     "Organic structures: chains, rings, functional groups, stereo marks. ChemFig native.",
      category:        "chemistry",
      engineId:        "chemistry-engine",
      qualityLevel:    "official-extended",
      requiredPackages: ["chemfig", "mhchem"],
      scopeWarning:    "Complex multi-ring or stereo structures may need manual ChemFig adjustment. For publication-quality structures, use ChemDraw and import as PDF.",
      blockKind:       "input",
      defaultCaption:  "Phenol structure.",
      defaultLabel:    "fig:phenol",
    });
  }

  protected buildDefaultDocument(): ChemEngineDocument {
    return {
      engineId: "chemistry-engine", version: "1.0.0",
      elements: [{
        type: "structure",
        chemfigSource: "\\chemfig{*6(-(-OH)=-=--)}",
        description: "Phenol",
      }],
      preferredOutput: "chemfig",
    };
  }
}

// ── Plugin 57 — Basic Reaction Mechanisms ─────────────────────────

export class ReactionMechanismsPlugin extends BasePlugin<ChemEngineDocument> {
  constructor() {
    super(engine, {
      pluginId:        "reaction-mechanisms",
      displayName:     "Basic Reaction Mechanisms",
      description:     "Curved arrow mechanisms for organic reactions. ChemFig with electron flow arrows.",
      category:        "chemistry",
      engineId:        "chemistry-engine",
      qualityLevel:    "official-extended",
      requiredPackages: ["chemfig", "mhchem"],
      scopeWarning:    "Suitable for standard SN2/SN1/E2 mechanisms. Complex multi-step mechanisms may need manual ChemFig adjustment.",
      blockKind:       "input",
      defaultCaption:  "S\\textsubscript{N}2 reaction.",
      defaultLabel:    "fig:sn2",
    });
  }

  protected buildDefaultDocument(): ChemEngineDocument {
    return {
      engineId: "chemistry-engine", version: "1.0.0",
      elements: [{
        type: "reaction",
        reactants: [{ type: "formula", text: "CH3Br" }, { type: "formula", text: "OH", charge: "-" }],
        products:  [{ type: "formula", text: "CH3OH" }, { type: "formula", text: "Br", charge: "-" }],
        arrow: "->",
        conditionsAbove: "S_N2",
      }],
      preferredOutput: "mhchem",
    };
  }
}
