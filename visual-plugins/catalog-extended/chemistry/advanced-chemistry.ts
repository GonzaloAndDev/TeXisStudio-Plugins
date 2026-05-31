import { BasePlugin } from "../../common/plugin-base/index.js";
import { ChemistryEngine } from "../../engines/chemistry-engine/engine.js";
import type { ChemEngineDocument } from "../../engines/chemistry-engine/types.js";

const engine = new ChemistryEngine();

// ── Plugin 56 — Extended Organic Chemistry ───────────────────────────────────
// Caffeine — immediately recognizable, shows aromatic + heterocyclic rings,
// N-methyl groups. Present in pharmacology, food science, and biochemistry theses.

export class OrganicChemistryPlugin extends BasePlugin<ChemEngineDocument> {
  constructor() {
    super(engine, {
      pluginId:        "organic-chemistry-extended",
      displayName:     "Extended Organic Chemistry",
      description:     "Organic structures with rings, functional groups, and stereocentres. ChemFig native.",
      category:        "chemistry",
      engineId:        "chemistry-engine",
      qualityLevel:    "official-extended",
      requiredPackages: ["chemfig", "mhchem"],
      scopeWarning:    "Complex multi-ring or stereo structures may need manual ChemFig adjustment. For publication-quality structures, use ChemDraw and import as PDF.",
      blockKind:       "input",
      defaultCaption:  "Caffeine (1,3,7-trimethylxanthine) structural formula.",
      defaultLabel:    "fig:caffeine",
    });
  }

  protected buildDefaultDocument(): ChemEngineDocument {
    // Caffeine: xanthine core (purine base) with three N-methyl groups.
    // ChemFig notation for the bicyclic purine system.
    return {
      engineId: "chemistry-engine", version: "1.0.0",
      elements: [{
        type: "structure",
        chemfigSource:
          "\\chemfig{" +
          "*5(N(-CH_3)-C(=O)-N(-CH_3)-C(=N-)(-[:90]*5(=N-C(=O)-N(-CH_3)-))" +
          "-C(=O)-)}" ,
        description: "Caffeine (1,3,7-trimethylxanthine)",
      }],
      preferredOutput: "chemfig",
    };
  }
}

// ── Plugin 57 — Basic Reaction Mechanisms ─────────────────────────────────────
// Aldol condensation — fundamental C–C bond forming reaction in organic synthesis.
// More pedagogically rich than SN2 and appears broadly across organic chemistry theses.

export class ReactionMechanismsPlugin extends BasePlugin<ChemEngineDocument> {
  constructor() {
    super(engine, {
      pluginId:        "reaction-mechanisms",
      displayName:     "Basic Reaction Mechanisms",
      description:     "Reaction mechanisms including C-C bond forming reactions, substitutions, and eliminations.",
      category:        "chemistry",
      engineId:        "chemistry-engine",
      qualityLevel:    "official-extended",
      requiredPackages: ["chemfig", "mhchem"],
      scopeWarning:    "Suitable for standard mechanisms in theses. Complex multi-step mechanisms with curved arrows require manual ChemFig adjustment.",
      blockKind:       "input",
      defaultCaption:  "Aldol condensation: base-catalysed formation of a $\\beta$-hydroxy carbonyl compound.",
      defaultLabel:    "fig:aldol",
    });
  }

  protected buildDefaultDocument(): ChemEngineDocument {
    return {
      engineId: "chemistry-engine", version: "1.0.0",
      elements: [
        // Step 1: enolate formation
        {
          type: "reaction",
          reactants: [
            { type: "formula", text: "CH3CHO" },
            { type: "formula", text: "OH", charge: "-" },
          ],
          products: [
            { type: "formula", text: "CH2CHO", charge: "-" },
            { type: "formula", text: "H2O" },
          ],
          arrow: "<=>",
          conditionsAbove: "fast",
        },
        // Step 2: aldol addition
        {
          type: "reaction",
          reactants: [
            { type: "formula", text: "CH2CHO", charge: "-" },
            { type: "formula", text: "CH3CHO" },
          ],
          products: [
            { type: "formula", text: "CH3CH(OH)CH2CHO" },
          ],
          arrow: "->",
          conditionsAbove: "Aldol addition",
        },
        // Step 3: dehydration (elimination) to enal
        {
          type: "reaction",
          reactants: [
            { type: "formula", text: "CH3CH(OH)CH2CHO" },
          ],
          products: [
            { type: "formula", text: "CH3CH=CHCHO" },
            { type: "formula", text: "H2O" },
          ],
          arrow: "->",
          conditionsAbove: "heat",
          conditionsBelow: "-H2O",
        },
      ],
      preferredOutput: "mhchem",
    };
  }
}
