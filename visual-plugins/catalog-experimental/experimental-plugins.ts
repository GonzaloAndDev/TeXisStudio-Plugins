import type { VisualDiagramPlugin, VisualFigureResult, ValidationResult } from "../common/contracts/index.js";

/**
 * Base class for "import-bridge" plugins that cannot generate LaTeX autonomously —
 * they require external tools (BioRender, QGIS, LilyPond, GIS data) and
 * act as an insertion point for the user to paste externally-generated content.
 *
 * The stub generates a compilable \begin{figure} environment with a placeholder
 * \fbox and instructions, so the user at least gets a labeled, numbered figure
 * they can fill in later via the raw LaTeX override.
 */
abstract class ImportBridgePlugin implements VisualDiagramPlugin {
  abstract readonly pluginId: string;
  abstract readonly displayName: string;
  abstract readonly description: string;
  abstract readonly scopeWarning: string;
  abstract readonly category: import("../common/contracts/types.js").PluginCategory;
  abstract readonly requiredPackages: readonly string[];

  readonly engineId = "external-vector-engine";
  readonly qualityLevel = "experimental" as const;

  /** Human-readable hint shown inside the placeholder box. */
  protected abstract get placeholderHint(): string;
  protected abstract get defaultCaption(): string;
  protected abstract get defaultLabel(): string;

  async create(): Promise<VisualFigureResult> {
    return this._placeholder();
  }

  async edit(_p: string): Promise<VisualFigureResult> {
    return this._placeholder();
  }

  async validate(_r: VisualFigureResult): Promise<ValidationResult> {
    return {
      valid: true,
      issues: [{
        code:     "IMPORT_BRIDGE",
        message:  `Plugin "${this.pluginId}" is an import bridge. Replace the placeholder with your externally-generated figure.`,
        severity: "warning",
      }],
    };
  }

  exportLatexBlock(r: VisualFigureResult): string { return r.latexBlock; }

  private _placeholder(): VisualFigureResult {
    const id = `fig_${Math.floor(Math.random() * 9000) + 1000}`;
    const hint    = this.placeholderHint;
    const caption = this.defaultCaption;
    const label   = this.defaultLabel;

    // Generates a compilable figure block with a gray fbox placeholder.
    // The user should use the "raw LaTeX override" to replace the fbox
    // with \includegraphics{} or the actual figure content.
    const latexBlock = [
      `% texisstudio-figure-id: ${id}`,
      `\\begin{figure}[htbp]`,
      `    \\centering`,
      `    \\fbox{\\begin{minipage}{0.75\\textwidth}\\centering\\vspace{1.5cm}`,
      `        \\textit{${hint}}\\\\[0.8em]`,
      `        \\scriptsize{Replace this placeholder using the figure editor.}`,
      `    \\vspace{1.5cm}\\end{minipage}}`,
      `    \\caption{${caption}}`,
      `    \\label{${label}}`,
      `\\end{figure}`,
      `% /texisstudio-figure-id`,
    ].join("\n");

    return {
      figureId: id, pluginId: this.pluginId, engineId: this.engineId,
      latexBlock,
      requiredPackages: this.requiredPackages,
      sourcePath: `texisstudio-assets/figures/${id}/source.json`,
      outputPaths: {},
      warnings: [this.scopeWarning],
    };
  }
}

// ── Import-bridge plugins (require external tools) ─────────────────

export class AnatomicalDiagramsPlugin extends ImportBridgePlugin {
  readonly pluginId        = "anatomical-diagrams";
  readonly displayName     = "Simple Anatomical Diagrams";
  readonly description     = "Placeholder for anatomical diagrams. Generate your figure in BioRender, Servier Medical Art, or similar, then insert it here.";
  readonly category        = "biology-medicine" as const;
  readonly requiredPackages = ["graphicx"] as const;
  readonly scopeWarning    = "Requires external medical illustration tool (BioRender, Servier). Insert the exported PDF/PNG via \\includegraphics{}.";
  protected get placeholderHint()    { return "Anatomical diagram — generate in BioRender or Servier Medical Art"; }
  protected get defaultCaption()     { return "Anatomical diagram."; }
  protected get defaultLabel()       { return "fig:anatomy"; }
}

export class BiomedicalIllustrationPlugin extends ImportBridgePlugin {
  readonly pluginId        = "biomedical-illustration";
  readonly displayName     = "Basic Biomedical Illustration";
  readonly description     = "Placeholder for biomedical schemas (cell organelles, tissue cross-sections). Generate in BioRender or draw manually.";
  readonly category        = "biology-medicine" as const;
  readonly requiredPackages = ["graphicx"] as const;
  readonly scopeWarning    = "Schematic diagrams only. Not a substitute for BioRender or professional medical illustration. Import as PDF.";
  protected get placeholderHint()    { return "Biomedical illustration — generate in BioRender or similar"; }
  protected get defaultCaption()     { return "Biomedical illustration."; }
  protected get defaultLabel()       { return "fig:biomedical"; }
}

export class CellDiagramsPlugin extends ImportBridgePlugin {
  readonly pluginId        = "cell-diagrams";
  readonly displayName     = "Thematic Cell Diagrams";
  readonly description     = "Placeholder for eukaryotic/prokaryotic cell diagrams. Generate in BioRender, then insert as PDF.";
  readonly category        = "biology-medicine" as const;
  readonly requiredPackages = ["graphicx"] as const;
  readonly scopeWarning    = "Template-based only. For publication-quality cell diagrams, use BioRender and import as PDF.";
  protected get placeholderHint()    { return "Cell diagram — generate in BioRender (free for academic use)"; }
  protected get defaultCaption()     { return "Cell diagram."; }
  protected get defaultLabel()       { return "fig:cell"; }
}

export class GeographicMapsPlugin extends ImportBridgePlugin {
  readonly pluginId        = "geographic-maps";
  readonly displayName     = "Simple Geographic Maps";
  readonly description     = "Placeholder for geographic maps. Generate in QGIS, R sf/tmap, or Python folium, export as PDF, then insert.";
  readonly category        = "humanities-social" as const;
  readonly requiredPackages = ["graphicx"] as const;
  readonly scopeWarning    = "Suitable for schematic maps in theses. Not a substitute for QGIS, ArcGIS, or R sf/tmap for real geographic data.";
  protected get placeholderHint()    { return "Geographic map — generate in QGIS or R (sf + tmap) and export as PDF"; }
  protected get defaultCaption()     { return "Geographic map."; }
  protected get defaultLabel()       { return "fig:map"; }
}

export class LilyPondScoresPlugin extends ImportBridgePlugin {
  readonly pluginId        = "lilypond-scores";
  readonly displayName     = "LilyPond Music Scores";
  readonly description     = "Placeholder for music scores. Write LilyPond notation separately, compile with lilypond, then insert the resulting PDF.";
  readonly category        = "arts-visual" as const;
  readonly requiredPackages = ["graphicx"] as const;
  readonly scopeWarning    = "LilyPond must be installed separately. Write your .ly file, run lilypond to get PDF/PNG, then insert via \\includegraphics{}.";
  protected get placeholderHint()    { return "Music score — compile with LilyPond and insert PDF here"; }
  protected get defaultCaption()     { return "Musical excerpt."; }
  protected get defaultLabel()       { return "fig:score"; }
}
