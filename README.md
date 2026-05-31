# TeXisStudio Plugins

> **ES** — 69 plugins de figuras académicas. LaTeX de publicación sin escribir código.  
> **EN** — 69 academic figure plugins. Publication-quality LaTeX without writing code.

Part of / Parte del ecosistema **[TeXisStudio](../TeXisStudio/README.md)**.  
Also see / También: [TeXisStudio-Languages](../TeXisStudio-Languages/README.md) · [TeXisStudio-Profiles](../TeXisStudio-Profiles/README.md)

---

## ES — ¿Qué es?

Catálogo de plugins especializados que genera figuras académicas directamente desde los engines LaTeX nativos. El usuario describe *qué quiere*; el plugin produce código LaTeX perfecto.

```
Usuario selecciona "ROC Curves" → indica 3 modelos con valores AUC
        ↓
El plugin llama al PGFPlotsEngine
        ↓
Se genera \addplot[...] con clasificadores, línea base y leyenda
        ↓
PDF con figura vectorial idéntica a la de artículos publicados
```

## EN — What is it?

A catalog of specialised plugins that generates academic figures directly from native LaTeX engines. The user describes *what they want*; the plugin produces perfect LaTeX.

```
User selects "ROC Curves" → enters 3 models with AUC values
        ↓
Plugin calls PGFPlotsEngine
        ↓
Generates \addplot[...] with classifiers, baseline and legend
        ↓
PDF with a vector figure identical to published papers
```

## ES — ¿Qué no es? / EN — What it is not

No reemplaza BioRender, ChemDraw, QGIS ni herramientas especializadas.  
Not a replacement for BioRender, ChemDraw, QGIS or other specialised tools.

El alcance es: **figuras que LaTeX puede representar excelentemente**.  
The scope is: **figures that LaTeX can represent excellently**.

---

## Plugin catalog / Catálogo de plugins (69 total)

### Official-Core — 35 plugins
Defaults tested with `latexmk`. Publication-quality results guaranteed.  
Defaults probados con `latexmk`. Resultados de calidad publicación.

| Category / Categoría | Plugins |
|---|---|
| **Mathematics / Matemáticas** (12) | Visual Equations (quadratic formula + align), Matrices (3D rotation), Systems of Equations, Piecewise Functions (ReLU), Venn Diagrams (3-set), Plane Geometry (Pythagorean theorem with altitude), Analytic Geometry (parabola + tangent), 2D Plots (sin/cos with π ticks), Parametric/Polar (Lissajous), Basic Statistics (grouped bar chart), Statistical Distributions (normal + 95% CI shaded), Probability Trees (medical diagnostic test via Bayes) |
| **Physics / Física** (5) | Vectors (parallelogram law A+B=R), Free Body Diagrams (force at angle α with components), Inclined Planes (W+N+f+Wx+Wy), Wave & Oscillations (damped Gaussian), Geometric Optics (3-ray lens construction) |
| **Engineering-CS / Ingeniería** (5) | Electrical Circuits (RC low-pass filter), Block Diagrams (PID controller), Flowcharts (research methodology), Software Architecture (3-tier + services), Gantt Charts (doctoral schedule 27 months) |
| **Chemistry / Química** (5) | Chemical Formulas (H₂SO₄, ions, phases), Reactions (neutralisation + combustion), Equilibria (Haber process + esterification), Structures (aspirin ChemFig), Lab Setups (acid-base titration) |
| **Biology-Medicine / Biología** (5) | Phylogenetic Trees (vertebrate phylogeny), Sequences (colour-coded DNA codons), Biomedical Flows (MAPK/ERK + negative feedback), CONSORT 2010 (clinical trial), Biological Pathways (glycolysis → TCA) |
| **Humanities / Humanidades** (3) | Timelines (molecular biology milestones 1944–2003), Syntax Trees (relative clause), Concept Maps (climate change) |

### Official-Extended — 25 plugins
More specialised use cases, all with documented `scopeWarning`.  
Casos más especializados, todos con `scopeWarning` documentado.

| Category / Categoría | Plugins |
|---|---|
| **Mathematics** (13) | 3D Plots (bivariate Gaussian), Phase Portraits (Lotka-Volterra), Heatmaps (4×4 correlation matrix), Grouped Bar Charts (3 doses × 4 time points), Box Plots (3 pedagogical conditions), Scatter + Regression (BMI vs SBP + CI band), Decision Trees (CART), ROC Curves (3 classifiers), Error Bars (3 doses × 5 time points), Time Series (CO₂ Mauna Loa), Parallel Coordinates (5 alternatives × 4 criteria), Population Pyramid (Mexico 2020), Markov Chains (weather model) |
| **Engineering-CS** (5) | ER Diagrams (university schema 4 entities), FSMs (traffic light timer-driven), Bode/Nyquist (2nd-order G(s)), UML Class (Repository + Observer pattern), Network Graphs (co-authorship: ML vs Statistics clusters) |
| **Humanities-Social** (4) | Supply & Demand (equilibrium + surplus areas + demand shift), Causal DAG (Education→Health mediation), Genealogy (Habsburg dynasty 4 generations), Population Pyramid |
| **Chemistry** (2) | Extended Organic Chemistry (caffeine ChemFig), Reaction Mechanisms (aldol condensation 3 steps) |
| **Biology-Physics** (2) | Kaplan-Meier (2-arm RCT with log-rank), Energy Band Diagrams (p-n junction with band bending) |

### Experimental — 10 plugins
5 with full BasePlugin implementation · 5 import-bridges (compilable placeholders).  
5 con implementación real BasePlugin · 5 import-bridges (placeholder compilable).

| Plugin | Type / Tipo | Description / Descripción |
|---|---|---|
| Bayesian Networks | Real | COVID-19 diagnosis DAG with conditional probabilities |
| SEM / Path Diagrams | Real | Technology Acceptance Model (TAM) |
| Economic Causal | Real | Wage-price spiral with R and B feedback loops |
| Legal / Procedural | Real | Criminal procedure flowchart (complaint → appeal) |
| Pedagogical Diagrams | Real | Revised Bloom's Taxonomy (Anderson & Krathwohl 2001) |
| Anatomical Diagrams | Bridge | → BioRender / Servier Medical Art |
| Biomedical Illustration | Bridge | → BioRender |
| Cell Diagrams | Bridge | → BioRender |
| Geographic Maps | Bridge | → QGIS / R sf+tmap |
| LilyPond Scores | Bridge | → LilyPond (music notation) |

---

## Architecture / Arquitectura

```
visual-plugins/
  common/
    contracts/          VisualDiagramPlugin, VisualEngine, VisualFigureResult interfaces
    plugin-base/        BasePlugin<TDoc> — reusable create/edit/editWithSource/validate
    persistence/        FigureStore (Node.js) + browser-safe pattern
    export/             buildLatexInputBlock, buildDisplayMathBlock…
    latex/              structural-validator, compiler (latexmk wrapper)
    manifest/           FigureManifest schema + validator

  engines/              12 rendering engines / 12 motores de renderizado
    math-engine/        Equations, matrices, systems, piecewise functions
    tikz-shape-engine/  TikZ shapes (polygons, vectors, angles, optics…)
    pgfplots-engine/    2D/3D plots, bar/box charts, heatmaps, time series
    graph-node-engine/  Directed/undirected graphs (DAGs, FSMs, networks, SEM…)
    circuitikz-engine/  Electrical circuits
    chemistry-engine/   mhchem formulas + ChemFig structures
    tree-forest-engine/ Forest trees (syntactic, phylogenetic, Bloom…)
    timeline-gantt-engine/ Gantt (pgfgantt) + TikZ timelines
    (+ 4 more)

  catalog-core/         35 plugins
  catalog-extended/     25 plugins
  catalog-experimental/ 10 plugins (5 real + 5 bridges)

  plugin-registry.ts    Central registry: 69 entries
  index.ts              Public entry point
```

### Plugin contract / Contrato del plugin

```typescript
interface VisualDiagramPlugin {
  readonly pluginId: string;
  readonly displayName: string;
  readonly category: PluginCategory;
  readonly qualityLevel: "official-core" | "official-extended" | "experimental";
  readonly requiredPackages: readonly string[];
  readonly scopeWarning?: string;          // mandatory for non-core plugins

  create(): Promise<VisualFigureResult>;
  edit(existingFigurePath: string): Promise<VisualFigureResult>;
  editWithSource?(figureId, sourceJson, caption?, label?): Promise<VisualFigureResult>;
  validate(result: VisualFigureResult): Promise<ValidationResult>;
  exportLatexBlock(result: VisualFigureResult): string;
}
```

`BasePlugin<TDoc>` implements everything except `buildDefaultDocument()`.  
`BasePlugin<TDoc>` implementa todo excepto `buildDefaultDocument()`.

### Create result / Resultado de la creación

```typescript
interface VisualFigureResult {
  figureId: string;           // fig_XXXX
  pluginId: string;
  engineId: string;
  latexBlock: string;         // complete LaTeX ready to insert / LaTeX completo
  requiredPackages: string[]; // auto-injected into preamble / auto-inyectados
  sourcePath: string;
  sourceJson?: string;        // engine document JSON for re-editing / para re-edición
  warnings: string[];
}
```

---

## Rendering engines / Motores de renderizado

| Engine | Packages / Paquetes | Typical use / Usos típicos |
|---|---|---|
| `math-engine` | amsmath, amssymb | Equations, matrices, systems / Ecuaciones, matrices |
| `tikz-shape-engine` | tikz | Shapes, vectors, optics / Formas, vectores, óptica |
| `pgfplots-engine` | pgfplots, tikz | 2D/3D plots, statistics / Gráficas, estadística |
| `graph-node-engine` | tikz | DAGs, networks, FSMs, UML / Grafos, redes, autómatas |
| `circuitikz-engine` | circuitikz | Electrical circuits / Circuitos eléctricos |
| `chemistry-engine` | chemfig, mhchem | Organic structures, reactions / Estructuras, reacciones |
| `tree-forest-engine` | forest | Syntactic, phylogenetic trees / Árboles sintácticos |
| `timeline-gantt-engine` | pgfgantt, tikz | Gantt charts, timelines / Gantt, líneas de tiempo |

---

## Tests

```bash
# Full suite — 173 tests (103 unit + 70 compile with real latexmk)
# Suite completa — 173 tests (103 unitarios + 70 compilación real)
npm test

# Core: 35 plugins × create+validate + latexmk compilation
npx vitest run tests/visual-plugins/compile-tests/core-plugins-stress.test.ts

# Extended math: 12 plugins × compilation
npx vitest run tests/visual-plugins/compile-tests/extended-math-stress.test.ts

# Extended non-math: 13 plugins × compilation
npx vitest run tests/visual-plugins/compile-tests/extended-other-stress.test.ts

# Experimental: 10 plugins × compilation
npx vitest run tests/visual-plugins/compile-tests/experimental-stress.test.ts
```

**Results / Resultados:** 173/173 tests pass · 70/70 real latexmk compilations.

---

## PDF catalogs / Catálogos PDF

Generated with / Generados con `npx tsx scripts/generate-*-catalog.ts`:

```
../catalogo-core-plugins/catalogo.pdf         (356 KB — 35 figures / figuras)
../catalogo-extended-plugins/catalogo.pdf     (313 KB — 25 figures / figuras)
../catalogo-experimental-plugins/catalogo.pdf (267 KB — 10 figures / figuras)
```

---

## Integration with TeXisStudio / Integración

```typescript
// Imported via Vite alias — no pre-build needed
// Importado via alias Vite — sin necesidad de compilar
import { PLUGIN_REGISTRY, buildLatexInputBlock } from "@texisstudio/plugins";
```

Node.js-only modules (`FigureStore` uses `node:fs`) are stubbed by Vite:  
Los módulos Node.js incompatibles con browser son stubeados:
```typescript
// vite.config.ts
alias: {
  "node:fs":   "src/lib/node-stubs.ts",
  "node:path": "src/lib/node-stubs.ts",
}
```

---

## Adding a plugin / Agregar un plugin

```typescript
export class MyPlugin extends BasePlugin<PGFPlotsDocument> {
  constructor() {
    super(pgfEngine, {
      pluginId:         "my-plugin",
      displayName:      "My Figure / Mi Figura",
      category:         "mathematics",
      engineId:         "pgfplots-engine",
      qualityLevel:     "official-core",
      requiredPackages: ["pgfplots", "tikz"],
      scopeWarning:     "Required for official-extended/experimental.",
      blockKind:        "input",
      defaultCaption:   "Example figure.",
      defaultLabel:     "fig:example",
    });
  }

  protected buildDefaultDocument(): PGFPlotsDocument {
    return { /* realistic default that compiles on first use */ };
  }
}
```

Register in / Registrar en `plugin-registry.ts` and export from the catalog `index.ts`.

---

## Development / Desarrollo

```bash
npm install
npm run build       # TypeScript check / verificación de tipos
npm test            # Full suite (requires latexmk for stress tests)
npm run typecheck   # Type check only / solo tipos
```
