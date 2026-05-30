# Visual Plugin Catalog

## Catalog Core (35 plugins — `official-core`)

| # | Plugin | Engine | Output | Difficulty |
|--:|--------|--------|--------|------------|
| 1 | Visual equations | math-engine | LaTeX native | Medium |
| 2 | Matrices and determinants | math-engine | LaTeX native | Low–medium |
| 3 | Systems of equations | math-engine | LaTeX native | Low–medium |
| 4 | Piecewise functions | math-engine | LaTeX native | Low–medium |
| 5 | Venn / set diagrams | tikz-shape-engine | TikZ / PDF | Medium |
| 6 | Plane geometry | tikz-shape-engine | TikZ / PDF | Medium–high |
| 7 | Analytic geometry | tikz-shape + pgfplots | TikZ / PGFPlots | Medium |
| 8 | 2D function plots | pgfplots-engine | PGFPlots / PDF | Medium |
| 9 | Parametric and polar plots | pgfplots-engine | PGFPlots / PDF | Medium |
| 10 | Basic statistics | pgfplots + table-data | PGFPlots / PDF | Medium |
| 11 | Statistical distributions | pgfplots-engine | PGFPlots / PDF | Medium |
| 12 | Probability trees | tree-forest-engine | forest / TikZ | Medium |
| 13 | Vectors and simple fields | tikz-shape-engine | TikZ / PDF | Medium |
| 14 | Free body diagrams | tikz-shape-engine | TikZ / PDF | Medium–high |
| 15 | Inclined planes, pulleys, springs | tikz-shape-engine | TikZ / PDF | High |
| 16 | Waves and oscillations | pgfplots + tikz | PGFPlots / TikZ | Medium |
| 17 | Geometric optics | tikz-shape-engine | TikZ / PDF | High |
| 18 | Basic electrical circuits | circuitikz-engine | CircuiTikZ | High |
| 19 | Block diagrams / control systems | graph-node-engine | TikZ / PDF | Medium |
| 20 | Gantt charts | timeline-gantt-engine | pgfgantt | Medium |
| 21 | Flowcharts | graph-node-engine | TikZ / PDF | Medium |
| 22 | Software / system architecture | external-vector + graph | PDF / SVG | Medium–high |
| 23 | Chemical formulas | chemistry-engine | mhchem | Medium |
| 24 | Chemical reactions | chemistry-engine | mhchem | Medium |
| 25 | Reaction equilibria and conditions | chemistry-engine | mhchem | Medium |
| 26 | Simple chemical structures | chemistry-engine | ChemFig / PDF | High |
| 27 | Simple lab setups | tikz + external | TikZ / PDF | High |
| 28 | Simple phylogenetic trees | tree-forest-engine | forest / TikZ | Medium–high |
| 29 | DNA / RNA / protein sequences | table-data + tikz | LaTeX / TikZ | Medium |
| 30 | Biomedical flow diagrams | graph-node-engine | TikZ / PDF | Medium |
| 31 | CONSORT / clinical trial flow | graph-node-engine | TikZ / PDF | Medium |
| 32 | Schematic biological pathways | graph-node + tikz | TikZ / PDF | High |
| 33 | Timelines | timeline-gantt-engine | TikZ / PDF | Medium |
| 34 | Syntax / linguistic trees | tree-forest-engine | forest / TikZ | Medium |
| 35 | Concept maps / argument diagrams | graph-node-engine | TikZ / PDF | Medium |

## Catalog Extended (plugins 36–60 — `official-extended`)

| # | Plugin | Engine | Output | Risk |
|--:|--------|--------|--------|------|
| 36 | 3D scientific plots | pgfplots-engine | PGFPlots / PDF | Medium |
| 37 | Surfaces and meshes | pgfplots-engine | PGFPlots / PDF | Medium–high |
| 38 | Phase diagrams | pgfplots + tikz | PGFPlots / PDF | Medium |
| 39 | 2D vector fields | pgfplots + tikz | PGFPlots / PDF | Medium |
| 40 | Simple heat maps | pgfplots + table | PDF | Medium |
| 41 | Simple Sankey | graph-node | TikZ / PDF | Medium–high |
| 42 | Complex networks / graphs | graph-node | TikZ / PDF / SVG | High |
| 43 | Network topologies | graph-node | PDF / SVG / TikZ | Medium |
| 44 | ER diagrams | graph-node | TikZ / PDF | Medium |
| 45 | UML class diagrams | external-vector + graph | PDF / SVG | Medium |
| 46 | Simple UML sequence | external-vector + graph | PDF / SVG | Medium–high |
| 47 | State machines | graph-node | TikZ / PDF | Medium |
| 48 | Finite automata | graph-node + tikz | TikZ / PDF | Medium |
| 49 | Markov chains | graph-node + tikz | TikZ / PDF | Medium |
| 50 | Extended electronic circuits | circuitikz-engine | CircuiTikZ | High |
| 51 | Digital logic diagrams | circuitikz + tikz | TikZ / PDF | Medium–high |
| 52 | Quantum circuits | tikz + external | LaTeX / PDF | High |
| 53 | Basic Feynman diagrams | tikz-feynman + external | LaTeX / PDF | High |
| 54 | Energy levels | tikz + pgfplots | TikZ / PDF | Medium |
| 55 | Bode / Nyquist diagrams | pgfplots-engine | PGFPlots / PDF | Medium |
| 56 | Extended organic chemistry | chemistry-engine | ChemFig / PDF / SVG | High |
| 57 | Basic reaction mechanisms | chemistry-engine | ChemFig / PDF / SVG | High |
| 58 | Simple spectra | pgfplots + chemistry | PGFPlots / PDF | Medium |
| 59 | Simple biological alignments | table-data | LaTeX / PDF | Medium |
| 60 | Schematic metabolic networks | graph-node | PDF / SVG / TikZ | High |

## Catalog Experimental (plugins 61–80 — `experimental`)

| # | Plugin | Approach | Risk |
|--:|--------|----------|------|
| 61 | Simple anatomical diagrams | SVG/PDF templates, limited | High |
| 62 | Basic biomedical illustration | Simple schemas only | High |
| 63 | Thematic cell diagrams | Templates, not full illustration | High |
| 64 | Schematic neuroanatomy | Conceptual scheme, not atlas | High |
| 65 | Simple geographic maps | Import/style vector, not GIS | High |
| 66 | QGIS import | PDF/SVG integration + traceability | Medium–high |
| 67 | LilyPond scores | Integration, not full music editor | High |
| 68 | Simple tablature | Limited templates | Medium–high |
| 69 | Scene / dance diagrams | Schematic, not professional notation | High |
| 70 | Color diagrams | Palettes, basic color theory, schemes | Medium |
| 71 | Visual / artistic composition | Simple templates | High |
| 72 | Academic storyboards | Simple panels, not illustration | High |
| 73 | Narrative / literary trees | Graph / tree | Medium |
| 74 | Complex historical genealogies | Tree / graph with limits | High |
| 75 | Legal / procedural diagrams | Flow / graph | Medium |
| 76 | Economic causal diagrams | Graph / node | Medium |
| 77 | Econometric models (visual) | Graph / PGFPlots | Medium–high |
| 78 | Bayesian networks | Graph / node | Medium–high |
| 79 | SEM / path diagrams | Graph / node | Medium–high |
| 80 | Exportable pedagogical diagrams | Graph / TikZ / SVG | High |
