export type MathMode = "inline" | "display" | "equation" | "align" | "gather" | "cases" | "matrix" | "system";

export type MatrixDelimiter = "paren" | "bracket" | "brace" | "vert" | "none";

export interface MathNode {
  type: "symbol" | "operator" | "fraction" | "sqrt" | "sum" | "integral" | "limit" | "matrix" | "cases" | "text" | "group";
  content: string;
  children?: MathNode[];
  options?: Record<string, unknown>;
}

export interface MathEngineDocument {
  engineId: "math-engine";
  version: string;
  mode: MathMode;
  numbered: boolean;
  label?: string;
  tree: MathNode[];
}

export interface MatrixDocument extends MathEngineDocument {
  mode: "matrix";
  rows: number;
  cols: number;
  delimiter: MatrixDelimiter;
  cells: string[][];
}

export interface SystemDocument extends MathEngineDocument {
  mode: "system";
  equations: string[];
  variables: string[];
}
