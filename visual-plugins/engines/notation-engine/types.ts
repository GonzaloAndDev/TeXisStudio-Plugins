export type NotationType = "algorithm" | "pseudocode" | "code" | "proof" | "theorem" | "definition" | "lemma" | "corollary" | "remark" | "glossary" | "nomenclature";

export interface NotationDocument {
  engineId: "notation-engine";
  version: string;
  type: NotationType;
  title?: string;
  label?: string;
  content: string;
  language?: string;
  numbered: boolean;
}
