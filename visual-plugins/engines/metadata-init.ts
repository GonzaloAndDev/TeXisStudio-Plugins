/**
 * Imports all engine metadata files as side effects.
 * Each metadata.ts file calls registerEditorMetadata() on import.
 *
 * Import this once at app startup (e.g. in VisualEditorRouter) to ensure
 * getEditorMetadata(engineId) returns metadata for all visual editors.
 */
import "./pgfplots-engine/metadata.js";
import "./graph-node-engine/metadata.js";
import "./timeline-gantt-engine/metadata.js";
import "./table-data-engine/metadata.js";
import "./tree-forest-engine/metadata.js";
