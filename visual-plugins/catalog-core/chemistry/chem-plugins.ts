import { BasePlugin } from "../../common/plugin-base/base-plugin.js";
import type { FigureStore } from "../../common/persistence/figure-store.js";
import { ChemistryEngine } from "../../engines/chemistry-engine/engine.js";
import type { ChemEngineDocument } from "../../engines/chemistry-engine/types.js";

const engine = new ChemistryEngine();

export class ChemicalFormulasPlugin extends BasePlugin<ChemEngineDocument> {
  constructor(store?: FigureStore) {
    super(engine, {
      pluginId: "chemical-formulas",
      displayName: "Chemical Formulas",
      description: "Write chemical formulas with charges, states, and subscripts. Uses mhchem — LaTeX native.",
      category: "chemistry",
      engineId: "chemistry-engine",
      qualityLevel: "official-core",
      requiredPackages: ["mhchem"],
      blockKind: "raw",
      defaultCaption: "Chemical formula.",
      defaultLabel: "eq:formula",
    }, store);
  }

  protected buildDefaultDocument(): ChemEngineDocument {
    return {
      engineId: "chemistry-engine", version: "1.0.0",
      elements: [{ type: "formula", text: "H2O", state: "l" }],
      preferredOutput: "mhchem",
    };
  }
}

export class ChemicalReactionsPlugin extends BasePlugin<ChemEngineDocument> {
  constructor(store?: FigureStore) {
    super(engine, {
      pluginId: "chemical-reactions",
      displayName: "Chemical Reactions",
      description: "Build chemical reaction equations with arrows, conditions, and catalysts. Uses mhchem.",
      category: "chemistry",
      engineId: "chemistry-engine",
      qualityLevel: "official-core",
      requiredPackages: ["mhchem"],
      blockKind: "raw",
      defaultCaption: "Chemical reaction.",
      defaultLabel: "eq:reaction",
    }, store);
  }

  protected buildDefaultDocument(): ChemEngineDocument {
    return {
      engineId: "chemistry-engine", version: "1.0.0",
      elements: [{
        type: "reaction",
        reactants: [{ type: "formula", text: "2H2", state: "g" }, { type: "formula", text: "O2", state: "g" }],
        products: [{ type: "formula", text: "2H2O", state: "l" }],
        arrow: "->",
      }],
      preferredOutput: "mhchem",
    };
  }
}

export class ReactionEquilibriaPlugin extends BasePlugin<ChemEngineDocument> {
  constructor(store?: FigureStore) {
    super(engine, {
      pluginId: "reaction-equilibria",
      displayName: "Reaction Equilibria & Conditions",
      description: "Chemical equilibrium reactions with conditions above/below the arrow. Uses mhchem.",
      category: "chemistry",
      engineId: "chemistry-engine",
      qualityLevel: "official-core",
      requiredPackages: ["mhchem"],
      blockKind: "raw",
      defaultCaption: "Equilibrium reaction.",
      defaultLabel: "eq:equilibrium",
    }, store);
  }

  protected buildDefaultDocument(): ChemEngineDocument {
    return {
      engineId: "chemistry-engine", version: "1.0.0",
      elements: [{
        type: "reaction",
        reactants: [{ type: "formula", text: "N2" }, { type: "formula", text: "3H2" }],
        products: [{ type: "formula", text: "2NH3" }],
        arrow: "<=>",
        conditionsAbove: "Fe",
        conditionsBelow: "high P",
      }],
      preferredOutput: "mhchem",
    };
  }
}

export class ChemicalStructuresPlugin extends BasePlugin<ChemEngineDocument> {
  constructor(store?: FigureStore) {
    super(engine, {
      pluginId: "chemical-structures",
      displayName: "Chemical Structures",
      description: "Simple organic structures and ring systems using ChemFig. Complex structures require manual review.",
      category: "chemistry",
      engineId: "chemistry-engine",
      qualityLevel: "official-core",
      requiredPackages: ["chemfig", "mhchem"],
      scopeWarning: "Suitable for simple organic structures in theses. Complex multi-ring systems may need manual ChemFig adjustment. For full structural chemistry, use ChemDraw and import as PDF/SVG.",
      blockKind: "raw",
      defaultCaption: "Chemical structure.",
      defaultLabel: "fig:structure",
    }, store);
  }

  protected buildDefaultDocument(): ChemEngineDocument {
    return {
      engineId: "chemistry-engine", version: "1.0.0",
      elements: [{ type: "structure", chemfigSource: "\\chemfig{H-C(-[2]H)(-[6]H)-H}", description: "Methane" }],
      preferredOutput: "chemfig",
    };
  }
}
