import { BasePlugin } from "../../common/plugin-base/base-plugin.js";
import type { FigureStore } from "../../common/persistence/figure-store.js";
import { ChemistryEngine } from "../../engines/chemistry-engine/engine.js";
import type { ChemEngineDocument } from "../../engines/chemistry-engine/types.js";
import { pluginText } from "../../i18n/index.js";

const engine = new ChemistryEngine();

export class ChemicalFormulasPlugin extends BasePlugin<ChemEngineDocument> {
  constructor(store?: FigureStore) {
    super(engine, {
      pluginId: "chemical-formulas",
      displayName: pluginText("chemical-formulas", "displayName", "Chemical Formulas"),
      description: pluginText("chemical-formulas", "description", "Write chemical formulas with charges, states, and subscripts. Uses mhchem — LaTeX native."),
      category: "chemistry",
      engineId: "chemistry-engine",
      qualityLevel: "official-core",
      requiredPackages: ["mhchem"],
      blockKind: "raw",
      defaultCaption: pluginText("chemical-formulas", "defaultCaption", "Selected inorganic formulas with oxidation states and phases."),
      defaultLabel: "eq:formula",
    }, store);
  }

  protected buildDefaultDocument(): ChemEngineDocument {
    // Multiple formulas showing different features: ionic charges, states, complex ions
    return {
      engineId: "chemistry-engine", version: "1.0.0",
      elements: [
        { type: "formula", text: "H2SO4",   state: "aq"  },
        { type: "formula", text: "CaCO3",   state: "s"   },
        { type: "formula", text: "Cu^{2+}", state: "aq"  },
        { type: "formula", text: "OH",      charge: "-", state: "aq" },
        { type: "formula", text: "NH4",     charge: "+", state: "aq" },
      ],
      preferredOutput: "mhchem",
    };
  }
}

export class ChemicalReactionsPlugin extends BasePlugin<ChemEngineDocument> {
  constructor(store?: FigureStore) {
    super(engine, {
      pluginId: "chemical-reactions",
      displayName: pluginText("chemical-reactions", "displayName", "Chemical Reactions"),
      description: pluginText("chemical-reactions", "description", "Build chemical reaction equations with arrows, conditions, and catalysts. Uses mhchem."),
      category: "chemistry",
      engineId: "chemistry-engine",
      qualityLevel: "official-core",
      requiredPackages: ["mhchem"],
      blockKind: "raw",
      defaultCaption: pluginText("chemical-reactions", "defaultCaption", "Acid--base neutralisation and combustion reactions."),
      defaultLabel: "eq:reaction",
    }, store);
  }

  protected buildDefaultDocument(): ChemEngineDocument {
    return {
      engineId: "chemistry-engine", version: "1.0.0",
      elements: [
        // Acid-base neutralisation
        {
          type: "reaction",
          reactants: [
            { type: "formula", text: "HCl", state: "aq" },
            { type: "formula", text: "NaOH", state: "aq" },
          ],
          products: [
            { type: "formula", text: "NaCl", state: "aq" },
            { type: "formula", text: "H2O", state: "l" },
          ],
          arrow: "->",
        },
        // Methane combustion
        {
          type: "reaction",
          reactants: [
            { type: "formula", text: "CH4", state: "g" },
            { type: "formula", text: "2O2", state: "g" },
          ],
          products: [
            { type: "formula", text: "CO2", state: "g" },
            { type: "formula", text: "2H2O", state: "g" },
          ],
          arrow: "->",
          conditionsAbove: "\\Delta",
        },
      ],
      preferredOutput: "mhchem",
    };
  }
}

export class ReactionEquilibriaPlugin extends BasePlugin<ChemEngineDocument> {
  constructor(store?: FigureStore) {
    super(engine, {
      pluginId: "reaction-equilibria",
      displayName: pluginText("reaction-equilibria", "displayName", "Reaction Equilibria & Conditions"),
      description: pluginText("reaction-equilibria", "description", "Chemical equilibrium reactions with conditions above/below the arrow. Uses mhchem."),
      category: "chemistry",
      engineId: "chemistry-engine",
      qualityLevel: "official-core",
      requiredPackages: ["mhchem"],
      blockKind: "raw",
      defaultCaption: pluginText("reaction-equilibria", "defaultCaption", "Haber process and esterification equilibria."),
      defaultLabel: "eq:equilibrium",
    }, store);
  }

  protected buildDefaultDocument(): ChemEngineDocument {
    return {
      engineId: "chemistry-engine", version: "1.0.0",
      elements: [
        // Haber process (with catalyst and conditions)
        {
          type: "reaction",
          reactants: [{ type: "formula", text: "N2", state: "g" }, { type: "formula", text: "3H2", state: "g" }],
          products:  [{ type: "formula", text: "2NH3", state: "g" }],
          arrow: "<=>",
          conditionsAbove: "Fe cat., 400\\,\\textdegree C",
          conditionsBelow: "200\\,atm",
        },
        // Esterification
        {
          type: "reaction",
          reactants: [{ type: "formula", text: "CH3COOH" }, { type: "formula", text: "C2H5OH" }],
          products:  [{ type: "formula", text: "CH3COOC2H5" }, { type: "formula", text: "H2O" }],
          arrow: "<=>",
          conditionsAbove: "H2SO4 (cat.)",
        },
      ],
      preferredOutput: "mhchem",
    };
  }
}

export class ChemicalStructuresPlugin extends BasePlugin<ChemEngineDocument> {
  constructor(store?: FigureStore) {
    super(engine, {
      pluginId: "chemical-structures",
      displayName: pluginText("chemical-structures", "displayName", "Chemical Structures"),
      description: pluginText("chemical-structures", "description", "Simple organic structures and ring systems using ChemFig. Benzene, functional groups, ring compounds."),
      category: "chemistry",
      engineId: "chemistry-engine",
      qualityLevel: "official-core",
      requiredPackages: ["chemfig", "mhchem"],
      scopeWarning: pluginText("chemical-structures", "scopeWarning", "Suitable for simple organic structures in theses. Complex multi-ring systems may need manual ChemFig adjustment. For full structural chemistry, use ChemDraw and import as PDF/SVG."),
      blockKind: "raw",
      defaultCaption: pluginText("chemical-structures", "defaultCaption", "Aspirin (acetylsalicylic acid) structural formula."),
      defaultLabel: "fig:structure",
    }, store);
  }

  protected buildDefaultDocument(): ChemEngineDocument {
    // Aspirin — a recognizable, non-trivial molecule present in many organic chemistry theses.
    // Benzene ring + carboxylic acid + ester group.
    return {
      engineId: "chemistry-engine", version: "1.0.0",
      elements: [{
        type: "structure",
        chemfigSource: [
          "\\chemfig{",
          "  *6(-=-(-C(=[1]O)-OH)=-(-O-C(=[1]O)-CH_3)=)",
          "}",
        ].join(""),
        description: "Aspirin (acetylsalicylic acid)",
      }],
      preferredOutput: "chemfig",
    };
  }
}
