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

export interface ChemStructure {
  type: "structure";
  smiles?: string;
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
