# TeXisStudio Plugins

Visual editor plugins for TeXisStudio — domain-specific tools (chemistry, circuits, math, biology, and more) that generate publication-quality LaTeX without writing a single line of code.

## What this is

Each plugin is a specialized visual editor that integrates into TeXisStudio and produces:

- **LaTeX native output** (TikZ, PGFPlots, CircuiTikZ, ChemFig, forest, pgfgantt…) when the LaTeX package ecosystem covers the domain well
- **PDF/SVG vector output** for diagrams that come from external tools (Draw.io, Ketcher, GeoGebra, LilyPond…)
- **Re-editable source** — every figure stores its source data so it can be opened and modified later

## What this is not

TeXisStudio Plugins does not aim to replace Illustrator, BioRender, AutoCAD, MATLAB, or any other professional specialized tool.  
The scope is: *academic figures that LaTeX can represent excellently*.

## Structure

```
visual-plugins/
  common/            shared contracts, manifest, validation, export, styles, security
  engines/           12 internal engines (math, tikz, pgfplots, circuits, chemistry…)
  catalog-core/      35 official-core plugins
  catalog-extended/  plugins 36–60 (official-extended)
  catalog-experimental/ plugins 61–80 (experimental)

docs/
  plugin-architecture.md
  plugin-quality-standard.md
  visual-plugin-sdk.md
  visual-plugin-catalog.md

tests/
  visual-plugins/
    fixtures/
    compile-tests/
    manifest-tests/
    export-tests/
```

## Engines

| Engine | Purpose |
|--------|---------|
| `math-engine` | Mathematical notation → LaTeX native |
| `tikz-shape-engine` | Geometric shapes and diagrams → TikZ |
| `pgfplots-engine` | Scientific and statistical plots → PGFPlots |
| `graph-node-engine` | Node-edge diagrams → TikZ / SVG |
| `circuitikz-engine` | Electrical circuits → CircuiTikZ |
| `chemistry-engine` | Chemical formulas and reactions → mhchem / ChemFig |
| `tree-forest-engine` | Hierarchical trees → forest / TikZ |
| `timeline-gantt-engine` | Timelines and Gantt charts → pgfgantt / TikZ |
| `external-vector-engine` | External tools (Draw.io, Ketcher…) → PDF / SVG |
| `table-data-engine` | Tabular data for plots and tables → LaTeX native |
| `notation-engine` | Algorithms, theorems, proofs, code → LaTeX native |
| `import-traceability-engine` | Import external figures with full tracking |

## Quality levels

| Level | Meaning |
|-------|---------|
| `official-core` | Reliable. Recommended for theses and journal articles. |
| `official-extended` | Acceptable with documented limits. |
| `experimental` | Exploratory. Clearly marked in the UI. |

## Contributing a plugin

See [docs/visual-plugin-sdk.md](docs/visual-plugin-sdk.md) for the plugin contract and SDK.  
See [docs/plugin-quality-standard.md](docs/plugin-quality-standard.md) for acceptance criteria.

## License

MIT
