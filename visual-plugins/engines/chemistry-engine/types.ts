export type ChemOutputMode = "mhchem" | "chemfig" | "pdf" | "svg";

export type ReactionArrow = "->" | "<->" | "<=>" | "->[above][below]";

export interface ChemFormula {
  type: "formula";
  text: string;
  charge?: string;
  state?: "s" | "l" | "g" | "aq";
}

export interface ChemReaction {
  type: "reaction";
  reactants: ChemFormula[];
  products: ChemFormula[];
  arrow: ReactionArrow;
  conditionsAbove?: string;
  conditionsBelow?: string;
  catalyst?: string;
}

/** Plantillas de estructura con chemfig verificado (todas compiladas en test).
 *  Cubren anillos, aromáticos sustituidos y moléculas comunes de tesis. */
export type ChemStructureTemplate =
  | "benzene" | "cyclohexane" | "cyclopentane" | "naphthalene"
  | "phenol" | "toluene" | "aniline" | "benzoic-acid"
  | "methane" | "ethanol" | "acetic-acid" | "glucose-chain";

export interface ChemStructure {
  type: "structure";
  /** Plantilla chemfig integrada. Si se da (y no hay chemfigSource), el motor
   *  emite el chemfig verificado correspondiente. */
  template?: ChemStructureTemplate;
  smiles?: string;
  /** chemfig crudo. Escape hatch para usuarios avanzados; tiene prioridad. */
  chemfigSource?: string;
  description?: string;
}

export type ChemElement = ChemFormula | ChemReaction | ChemStructure;

export interface ChemEngineDocument {
  engineId: "chemistry-engine";
  version: string;
  elements: ChemElement[];
  preferredOutput: ChemOutputMode;
}
