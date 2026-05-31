import type {
  OutputFormat,
  EngineInput,
  ValidationResult,
  PreviewResult,
  ExportResult,
  EditableSource,
} from "./types.js";

/**
 * Base shape every engine document shares. Concrete engine documents
 * (MathEngineDocument, CircuiTikZDocument, ...) extend this with their
 * own fields. The editable, serializable payload lives in the document
 * itself; `EditableSource.data` wraps the whole document for persistence.
 */
export interface EngineDocument {
  readonly engineId: string;
  readonly version: string;
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
