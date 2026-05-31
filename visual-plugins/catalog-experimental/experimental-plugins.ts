import type { VisualDiagramPlugin, VisualFigureResult, ValidationResult } from "../common/contracts/index.js";

/**
 * Base class for experimental plugins — provides shared stub implementation.
 * Each concrete plugin declares its identity and scope warning.
 * Implementation is deferred to specialized contributors.
 */
abstract class ExperimentalPluginBase implements VisualDiagramPlugin {
  abstract readonly pluginId: string;
  abstract readonly displayName: string;
  abstract readonly description: string;
  abstract readonly scopeWarning: string;
  readonly category = "biology-medicine" as const;
  readonly engineId = "external-vector-engine";
  readonly qualityLevel = "experimental" as const;
  readonly requiredPackages: readonly string[] = ["graphicx"];

  async create(): Promise<VisualFigureResult> {
    return this._stub();
  }

  async edit(_p: string): Promise<VisualFigureResult> {
    return this._stub();
  }

  async validate(_r: VisualFigureResult): Promise<ValidationResult> {
    return { valid: true, issues: [{ code: "EXPERIMENTAL", message: `Plugin "${this.pluginId}" is experimental. Output may need manual review.`, severity: "warning" }] };
  }

  exportLatexBlock(r: VisualFigureResult): string { return r.latexBlock; }

  private _stub(): VisualFigureResult {
    const id = `fig_${Math.floor(Math.random() * 9000) + 1000}`;
    return {
      figureId: id, pluginId: this.pluginId, engineId: this.engineId,
      latexBlock: `% texisstudio-figure-id: ${id}\n% Experimental plugin — insert figure manually\n% /texisstudio-figure-id`,
      requiredPackages: this.requiredPackages,
      sourcePath: `texisstudio-assets/figures/${id}/source.json`,
      outputPaths: {}, warnings: [this.scopeWarning],
    };
  }
}

// Plugins 61–80

export class AnatomicalDiagramsPlugin extends ExperimentalPluginBase {
  readonly pluginId = "anatomical-diagrams";
  readonly displayName = "Simple Anatomical Diagrams";
  readonly description = "Schematic anatomical diagrams from SVG templates.";
  readonly category = "biology-medicine" as const;
  readonly scopeWarning = "Covers standard schematic anatomy only. Not a substitute for BioRender, Servier, or medical illustration tools. Import professional figures as PDF/SVG.";
}

export class BiomedicalIllustrationPlugin extends ExperimentalPluginBase {
  readonly pluginId = "biomedical-illustration";
  readonly displayName = "Basic Biomedical Illustration";
  readonly description = "Simple biomedical schemas: cell organelles, tissue cross-sections.";
  readonly category = "biology-medicine" as const;
  readonly scopeWarning = "Schematic diagrams only. Not a substitute for BioRender or professional medical illustration.";
}

export class CellDiagramsPlugin extends ExperimentalPluginBase {
  readonly pluginId = "cell-diagrams";
  readonly displayName = "Thematic Cell Diagrams";
  readonly description = "Cell organelle diagrams from templates. Eukaryotic and prokaryotic.";
  readonly category = "biology-medicine" as const;
  readonly scopeWarning = "Template-based only. For publication-quality cell diagrams, use BioRender and import as PDF.";
}

export class GeographicMapsPlugin extends ExperimentalPluginBase {
  readonly pluginId = "geographic-maps";
  readonly displayName = "Simple Geographic Maps";
  readonly description = "Import and style vector maps for academic context. Not a GIS system.";
  readonly category = "humanities-social" as const;
  readonly scopeWarning = "Suitable for schematic maps in humanities/social science theses. Not a substitute for QGIS, ArcGIS, or R sf/tmap.";
}

export class LilyPondScoresPlugin extends ExperimentalPluginBase {
  readonly pluginId = "lilypond-scores";
  readonly displayName = "LilyPond Music Scores";
  readonly description = "Integrate LilyPond music notation. Requires LilyPond installed.";
  readonly category = "arts-visual" as const;
  readonly scopeWarning = "Integration bridge only. LilyPond must be installed separately. Not a visual music editor — requires LilyPond notation knowledge.";
}

export class LegalProceduralPlugin extends ExperimentalPluginBase {
  readonly pluginId = "legal-procedural";
  readonly displayName = "Legal / Procedural Diagrams";
  readonly description = "Flowcharts for legal processes, judicial procedures, and regulatory flows.";
  readonly category = "humanities-social" as const;
  readonly scopeWarning = "Suitable for standard legal process flows in theses. Complex multi-jurisdiction diagrams may need manual adjustment.";
}

export class EconomicCausalPlugin extends ExperimentalPluginBase {
  readonly pluginId = "economic-causal";
  readonly displayName = "Economic Causal Diagrams";
  readonly description = "Causal loop diagrams and economic causality graphs.";
  readonly category = "humanities-social" as const;
  readonly scopeWarning = "Suitable for simple causal models. For complex system dynamics, use Vensim/Stella and import as PDF.";
}

export class SEMPathPlugin extends ExperimentalPluginBase {
  readonly pluginId = "sem-path-diagrams";
  readonly displayName = "SEM / Path Diagrams";
  readonly description = "Structural equation model and path analysis diagrams.";
  readonly category = "humanities-social" as const;
  readonly scopeWarning = "Suitable for thesis-level SEM diagrams. For full SEM with fit statistics, use lavaan/R or AMOS and export figures.";
}

export class BayesianNetworksPlugin extends ExperimentalPluginBase {
  readonly pluginId = "bayesian-networks";
  readonly displayName = "Bayesian Networks";
  readonly description = "Directed acyclic graphs for Bayesian network visualization.";
  readonly category = "mathematics" as const;
  readonly scopeWarning = "Suitable for illustrative Bayesian networks. For inference or learning, use dedicated tools (pgmpy, BayesFusion) and import.";
}

export class PedagogicalDiagramsPlugin extends ExperimentalPluginBase {
  readonly pluginId = "pedagogical-diagrams";
  readonly displayName = "Pedagogical Diagrams";
  readonly description = "Educational diagrams: learning taxonomies, curriculum maps, instructional designs.";
  readonly category = "humanities-social" as const;
  readonly scopeWarning = "Experimental — covers common pedagogical diagram patterns but complex frameworks may need manual adjustment.";
}
