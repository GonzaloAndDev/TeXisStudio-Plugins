import type {
  VisualDiagramPlugin,
  VisualFigureResult,
  ValidationResult,
  ValidationIssue,
  PluginCategory,
  QualityLevel,
  VisualEngine,
  EngineDocument,
  OutputFormat,
} from "../contracts/index.js";
import {
  toDocumentContribution,
  validateDocumentContribution,
} from "../contracts/contribution.js";
import type { FigureManifest } from "../manifest/schema.js";
import { figurePath } from "../manifest/schema.js";
import { buildLatexInputBlock, buildInlineEquationBlock, buildDisplayMathBlock, buildRawBlock } from "../export/latex-block.js";
import { validateLatexStructure } from "../latex/structural-validator.js";
import type { FigureStore } from "../persistence/figure-store.js";

export type BlockKind = "input" | "inline-equation" | "display-math" | "raw";

export interface BasePluginConfig {
  pluginId: string;
  pluginVersion?: string;
  displayName: string;
  description: string;
  category: PluginCategory;
  engineId: string;
  qualityLevel: QualityLevel;
  requiredPackages: readonly string[];
  scopeWarning?: string;
  /** How the engine output is wrapped into an insertable LaTeX block. */
  blockKind: BlockKind;
  /** Default caption shown in the figure environment. */
  defaultCaption: string;
  /** Default \label (without the "fig:"/"eq:" prefix already included). */
  defaultLabel: string;
}

let _idCounter = 0;

/**
 * Shared, fully-functional implementation of the VisualDiagramPlugin
 * contract. Concrete plugins only supply identity config and a
 * `buildDefaultDocument()` — create/edit/validate/export are real here:
 *
 *  - create(): builds the default document, exports via the engine,
 *    runs structural validation, assembles a manifest + editable source,
 *    and (if a FigureStore is set) persists the full asset folder.
 *  - edit(): loads source.json from disk, reconstructs the document,
 *    re-exports, and preserves caption/label.
 *  - validate(): structural LaTeX validation of the produced block.
 *
 * This removes the per-plugin copy-paste stubs and guarantees every
 * plugin meets acceptance criteria 1–7 (plan §2.5) uniformly.
 */
export abstract class BasePlugin<TDoc extends EngineDocument> implements VisualDiagramPlugin {
  readonly pluginId: string;
  readonly pluginVersion: string;
  readonly displayName: string;
  readonly description: string;
  readonly category: PluginCategory;
  readonly engineId: string;
  readonly qualityLevel: QualityLevel;
  readonly requiredPackages: readonly string[];
  readonly scopeWarning?: string;

  protected readonly engine: VisualEngine;
  protected readonly config: BasePluginConfig;
  protected readonly store: FigureStore | undefined;

  constructor(engine: VisualEngine, config: BasePluginConfig, store?: FigureStore) {
    this.engine = engine;
    this.config = config;
    this.store = store;
    this.pluginId = config.pluginId;
    this.pluginVersion = config.pluginVersion ?? "1.0.0";
    this.displayName = config.displayName;
    this.description = config.description;
    this.category = config.category;
    this.engineId = config.engineId;
    this.qualityLevel = config.qualityLevel;
    this.requiredPackages = config.requiredPackages;
    if (config.scopeWarning !== undefined) this.scopeWarning = config.scopeWarning;
  }

  /** Concrete plugins return the starting document for a new figure. */
  protected abstract buildDefaultDocument(): TDoc;

  async create(): Promise<VisualFigureResult> {
    const figureId = this.nextFigureId();
    const doc = this.buildDefaultDocument();
    return this.materialize(figureId, doc, this.config.defaultCaption, this.qualifiedLabel());
  }

  async edit(existingFigurePath: string): Promise<VisualFigureResult> {
    const figureId = this.figureIdFromPath(existingFigurePath);

    if (this.store) {
      const loaded = this.store.load(figureId);
      if (loaded) {
        const doc = loaded.source.data as TDoc;
        const caption = loaded.manifest.title || this.config.defaultCaption;
        const label = this.extractLabel(loaded.tex) ?? this.qualifiedLabel();
        return this.materialize(figureId, doc, caption, label);
      }
    }
    return this.materialize(figureId, this.buildDefaultDocument(), this.config.defaultCaption, this.qualifiedLabel());
  }

  /** Browser-safe edit path: accepts previously-persisted sourceJson instead of
   *  reading from disk. Used by the Tauri frontend integration. */
  async editWithSource(figureId: string, sourceJson: string, caption?: string, label?: string): Promise<VisualFigureResult> {
    try {
      const parsed = JSON.parse(sourceJson) as { data?: TDoc };
      const doc: TDoc = (parsed.data ?? parsed) as TDoc;
      return this.materialize(
        figureId,
        doc,
        caption ?? this.config.defaultCaption,
        label ?? this.qualifiedLabel(),
      );
    } catch {
      return this.materialize(figureId, this.buildDefaultDocument(), caption ?? this.config.defaultCaption, label ?? this.qualifiedLabel());
    }
  }

  async validate(result: VisualFigureResult): Promise<ValidationResult> {
    const issues: ValidationIssue[] = [];

    const structural = validateLatexStructure(result.latexBlock);
    issues.push(...structural.issues);
    const contribution = toDocumentContribution(
      result,
      this.qualityLevel === "experimental" ? "experimental" : "official",
    );
    issues.push(...validateDocumentContribution(contribution).issues);

    if (result.requiredPackages.length === 0) {
      issues.push({ code: "NO_PACKAGES", message: "Plugin declares no required LaTeX packages.", severity: "warning" });
    }
    if (!result.outputPaths.tex && !result.outputPaths.pdf && !result.outputPaths.svg) {
      issues.push({ code: "NO_VECTOR_OUTPUT", message: "Result declares no vector output path.", severity: "error" });
    }

    return { valid: issues.filter(i => i.severity === "error").length === 0, issues };
  }

  exportLatexBlock(result: VisualFigureResult): string {
    return result.latexBlock;
  }

  // ── internal ──────────────────────────────────────────────────

  protected async materialize(figureId: string, doc: TDoc, caption: string, label: string): Promise<VisualFigureResult> {
    const exported = await this.engine.export(doc, "latex" as OutputFormat);
    const texContent = typeof exported.content === "string" ? exported.content : new TextDecoder().decode(exported.content);

    const texPath = `${figurePath(figureId)}/output.tex`;
    const latexBlock = this.wrapBlock(figureId, texContent, texPath, caption, label);

    const source = await this.engine.getEditableSource(doc);
    const requiredPackages = exported.requiredPackages.length > 0 ? exported.requiredPackages : [...this.requiredPackages];

    const result: VisualFigureResult = {
      figureId,
      pluginId: this.pluginId,
      engineId: this.engineId,
      latexBlock,
      texContent,
      requiredPackages,
      sourcePath: `${figurePath(figureId)}/source.json`,
      outputPaths: { tex: texPath },
      warnings: [...exported.warnings, ...(this.scopeWarning ? [this.scopeWarning] : [])],
      sourceJson: JSON.stringify(source),
    };

    if (this.store) {
      const manifest: FigureManifest = {
        id: figureId,
        pluginId: this.pluginId,
        pluginVersion: this.pluginVersion,
        engineId: this.engineId,
        title: caption.replace(/\.$/, ""),
        preferredOutput: "latex",
        sourceFile: "source.json",
        latexFile: "output.tex",
        pdfFile: null,
        svgFile: null,
        previewFile: null,
        requiredPackages: [...requiredPackages],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        qualityLevel: this.qualityLevel,
        editable: true,
        warnings: result.warnings,
      };
      this.store.write({ manifest, source, tex: texContent });
    }

    return result;
  }

  protected wrapBlock(figureId: string, texContent: string, texPath: string, caption: string, label: string): string {
    switch (this.config.blockKind) {
      case "input":
        return buildLatexInputBlock({ figureId, inputPath: texPath, caption, label });
      case "inline-equation":
        return buildInlineEquationBlock(figureId, texContent);
      case "display-math":
        return buildDisplayMathBlock(figureId, texContent);
      case "raw":
        return buildRawBlock(figureId, texContent);
    }
  }

  protected qualifiedLabel(): string {
    return this.config.defaultLabel.includes(":") ? this.config.defaultLabel : `fig:${this.config.defaultLabel}`;
  }

  protected extractLabel(tex: string | null): string | null {
    if (!tex) return null;
    return tex.match(/\\label\{([^}]+)\}/)?.[1] ?? null;
  }

  protected nextFigureId(): string {
    if (this.store) {
      // Find the first free fig_NNNN under the store.
      for (let n = 1; n < 100000; n++) {
        const id = `fig_${String(n).padStart(4, "0")}`;
        if (!this.store.exists(id)) return id;
      }
    }
    _idCounter += 1;
    return `fig_${String(_idCounter).padStart(4, "0")}`;
  }

  protected figureIdFromPath(path: string): string {
    return path.match(/fig_\d+/)?.[0] ?? this.nextFigureId();
  }
}
