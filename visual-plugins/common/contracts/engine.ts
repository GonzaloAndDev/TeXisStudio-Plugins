import type {
  OutputFormat,
  EngineInput,
  ValidationResult,
  PreviewResult,
  ExportResult,
  EditableSource,
} from "./types.js";

export interface EngineDocument {
  readonly engineId: string;
  readonly version: string;
  readonly data: unknown;
}

export interface VisualEngine {
  readonly engineId: string;
  readonly displayName: string;
  readonly supportedOutputs: readonly OutputFormat[];
  readonly requiredPackages: readonly string[];

  createDocument(input?: EngineInput): Promise<EngineDocument>;
  validate(document: EngineDocument): Promise<ValidationResult>;
  renderPreview(document: EngineDocument): Promise<PreviewResult>;
  export(document: EngineDocument, target: OutputFormat): Promise<ExportResult>;
  getEditableSource(document: EngineDocument): Promise<EditableSource>;
}
