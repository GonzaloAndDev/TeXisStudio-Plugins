# Plugin Architecture

## Core principle

Many user-facing plugins share a small number of well-designed internal engines.
A plugin is a specialization of an engine, not an independent system.

```
Plugin (user-facing, domain-specific)
  └── Engine (shared, output-focused)
        └── Output (LaTeX native / PDF / SVG)
```

## Engine list

| Engine ID                    | Purpose                                 | Primary output    |
|------------------------------|-----------------------------------------|-------------------|
| `math-engine`                | Mathematical notation                   | LaTeX native      |
| `tikz-shape-engine`          | Geometric and diagrammatic shapes       | TikZ / PDF        |
| `pgfplots-engine`            | Scientific and statistical plots        | PGFPlots / PDF    |
| `graph-node-engine`          | Node-edge diagrams and graphs           | TikZ / PDF / SVG  |
| `circuitikz-engine`          | Electrical and electronic circuits      | CircuiTikZ        |
| `chemistry-engine`           | Chemical formulas and reactions         | mhchem / ChemFig  |
| `tree-forest-engine`         | Hierarchical trees                      | forest / TikZ     |
| `timeline-gantt-engine`      | Timelines and Gantt charts              | pgfgantt / TikZ   |
| `external-vector-engine`     | Integration of external vector tools    | PDF / SVG         |
| `table-data-engine`          | Tabular data for plots and tables       | LaTeX native      |
| `notation-engine`            | Algorithms, theorems, proofs, code      | LaTeX native      |
| `import-traceability-engine` | Import of external figures with tracking| PDF / SVG / PNG   |

## Figure asset structure

Every visual figure lives in `texisstudio-assets/figures/<figureId>/`:

```
fig_0001/
  manifest.json      required — describes the figure and its outputs
  source.json        required — editable source data for the originating plugin
  output.tex         preferred for LaTeX-native engines
  output.pdf         preferred for external vector outputs
  output.svg         optional secondary format
  preview.png        for display in the editor only
```

## LaTeX block format

All inserted blocks are wrapped in ID comments so the editor can find and re-open them:

```latex
% texisstudio-figure-id: fig_0001
\begin{figure}[htbp]
    \centering
    \input{texisstudio-assets/figures/fig_0001/output.tex}
    \caption{Caption text.}
    \label{fig:label}
\end{figure}
% /texisstudio-figure-id
```

## Output priority

```
1. LaTeX native (TikZ, PGFPlots, ChemFig, CircuiTikZ, forest, pgfgantt…)
2. PDF vectorial
3. SVG vectorial
4. PNG — only for editor preview, never as final output
```

## Engine contract

```typescript
interface VisualEngine {
  readonly engineId: string
  readonly displayName: string
  readonly supportedOutputs: readonly OutputFormat[]
  readonly requiredPackages: readonly string[]

  createDocument(input?: EngineInput): Promise<EngineDocument>
  validate(document: EngineDocument): Promise<ValidationResult>
  renderPreview(document: EngineDocument): Promise<PreviewResult>
  export(document: EngineDocument, target: OutputFormat): Promise<ExportResult>
  getEditableSource(document: EngineDocument): Promise<EditableSource>
}
```

## Plugin contract

```typescript
interface VisualDiagramPlugin {
  readonly pluginId: string
  readonly displayName: string
  readonly description: string
  readonly category: PluginCategory
  readonly engineId: string
  readonly qualityLevel: QualityLevel
  readonly requiredPackages: readonly string[]
  readonly scopeWarning?: string

  create(): Promise<VisualFigureResult>
  edit(existingFigurePath: string): Promise<VisualFigureResult>
  validate(result: VisualFigureResult): Promise<ValidationResult>
  exportLatexBlock(result: VisualFigureResult): string
}
```
