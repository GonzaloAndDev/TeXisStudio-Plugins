export type ExternalTool = "drawio" | "plantuml" | "graphviz" | "mermaid" | "ketcher" | "lilypond" | "geogebra" | "generic";

export type ExternalOutputFormat = "pdf" | "svg";

export interface ExternalVectorDocument {
  engineId: "external-vector-engine";
  version: string;
  tool: ExternalTool;
  sourceFile: string;
  outputFormat: ExternalOutputFormat;
  exportedFile: string;
  toolVersion?: string;
  editCommand?: string;
}
