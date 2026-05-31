# TeXisStudio Plugins

> 69 plugins de figuras académicas — LaTeX de publicación sin escribir una línea de código.

Parte del ecosistema **[TeXisStudio](../TeXisStudio/README.md)**.

---

## ¿Qué es esto?

Catálogo de plugins especializados que se integran con TeXisStudio para generar figuras académicas directamente desde los engines LaTeX nativos. El usuario describe *qué quiere*; el plugin produce código LaTeX perfecto.

**Ejemplo:**
```
El usuario selecciona "ROC Curves" → indica 3 modelos y sus valores AUC
        ↓
El plugin llama al PGFPlotsEngine
        ↓
Se genera \addplot[...] con los 3 clasificadores, la línea base y la leyenda
        ↓
El PDF contiene una figura vectorial idéntica a las de artículos publicados
```

## ¿Qué no es?

No reemplaza BioRender, ChemDraw, QGIS ni otras herramientas especializadas.  
El alcance es: **figuras que LaTeX puede representar excelentemente**.  
Para lo demás existen los plugins de tipo *import-bridge* que guían al usuario a la herramienta correcta y le dan el entorno `\begin{figure}` compilable.

---

## Catálogo de plugins (69 total)

### Official-Core — 35 plugins
Defaults probados con `latexmk`, resultados de calidad publicación.

| Categoría | Plugins |
|---|---|
| **Matemáticas** (12) | Ecuaciones (quadratic formula, align), Matrices (rotación 3D), Sistemas, Funciones por partes, Diagramas de Venn, Geometría plana (Pitágoras+altitud), Geometría analítica (parábola+tangente), Plots 2D (sin/cos), Paramétrico/polar (Lissajous), Estadística básica (barras comparativas), Distribuciones (normal+CI sombreado), Árboles de probabilidad (test diagnóstico Bayes) |
| **Física** (5) | Vectores (ley del paralelogramo), Diagramas de cuerpo libre (fuerza en ángulo), Plano inclinado (W+N+f+componentes), Ondas/oscilaciones (Gaussiana amortiguada), Óptica geométrica (3 rayos principales) |
| **Ingeniería/CS** (5) | Circuitos eléctricos (filtro RC), Diagramas de bloque (PID), Flujogramas (metodología de investigación), Arquitectura de software (3-tier), Gantt (cronograma doctoral 27 meses) |
| **Química** (5) | Fórmulas (H₂SO₄, iones, estados), Reacciones (neutralización + combustión), Equilibrios (Haber + esterificación), Estructuras (aspirina ChemFig), Montajes de laboratorio (titulación ácido-base) |
| **Biología/Medicina** (5) | Árboles filogenéticos (vertebrados), Secuencias ADN/ARN (codones coloreados), Flujos biomédicos (MAPK/ERK + feedback), CONSORT 2010 (ensayo clínico), Vías biológicas (glucólisis → TCA) |
| **Humanidades** (3) | Líneas de tiempo (hitos biología molecular 1944–2003), Árboles sintácticos (cláusula relativa compleja), Mapas conceptuales (cambio climático) |

### Official-Extended — 25 plugins
Casos de uso más especializados, todos con `scopeWarning` documentado.

| Categoría | Plugins |
|---|---|
| **Matemáticas** (13) | Plots 3D (Gaussiana bivariada), Phase portraits (Lotka-Volterra), Heatmaps (matriz de correlación 4×4), Barras agrupadas, Box plots (3 grupos), Scatter+regresión (BMI vs SBP + banda CI), Árboles de decisión (CART), ROC curves (3 clasificadores), Error bars (3 dosis × 5 time points), Series temporales (CO₂ Mauna Loa), Coordenadas paralelas, Pirámide poblacional (México 2020), Cadenas de Markov (modelo clima) |
| **Ingeniería/CS** (5) | ER Diagrams (sistema universitario 4 entidades), FSMs (semáforo timer-driven), Bode/Nyquist (2do orden G(s)), UML Class (Repository+Observer pattern), Redes (co-autoría ML vs Stats) |
| **Ciencias Sociales** (4) | Supply & Demand (equilibrio + excedentes + shift), DAG causal (Education→Health con mediadores), Genealogía (Habsburgo 4 generaciones), Pirámide poblacional |
| **Química** (2) | Química orgánica extendida (cafeína ChemFig), Mecanismos de reacción (condensación aldólica 3 pasos) |
| **Biología/Física** (2) | Kaplan-Meier (2 brazos RCT con log-rank), Diagramas de bandas energéticas (unión p-n con band bending) |

### Experimental — 10 plugins
5 con implementación real (BasePlugin) · 5 import-bridges (placeholder compilable).

| Plugin | Tipo | Descripción |
|---|---|---|
| Bayesian Networks | Real | DAG COVID-19: síntomas observados + causas latentes con probabilidades |
| SEM / Path Diagrams | Real | Technology Acceptance Model (TAM) — 3 constructos + 8 indicadores |
| Economic Causal | Real | Espiral salarios-precios con bucles R y B anotados |
| Legal / Procedural | Real | Proceso penal completo (queja → juicio → apelación) |
| Pedagogical | Real | Taxonomía de Bloom revisada (Anderson & Krathwohl 2001) |
| Anatomical Diagrams | Bridge | → BioRender / Servier Medical Art |
| Biomedical Illustration | Bridge | → BioRender |
| Cell Diagrams | Bridge | → BioRender |
| Geographic Maps | Bridge | → QGIS / R sf+tmap |
| LilyPond Scores | Bridge | → LilyPond (notación musical) |

---

## Arquitectura

```
visual-plugins/
  common/
    contracts/          Interfaces: VisualDiagramPlugin, VisualEngine, VisualFigureResult
    plugin-base/        BasePlugin<TDoc> — create/edit/editWithSource/validate reutilizables
    persistence/        FigureStore (Node.js) + patrón browser-safe
    export/             buildLatexInputBlock, buildDisplayMathBlock…
    latex/              structural-validator, compiler (latexmk wrapper)
    manifest/           FigureManifest schema + validator
    preamble/           PreambleManager
    security/           Plugin permission checks

  engines/              12 motores de renderizado
    math-engine/        Ecuaciones, matrices, sistemas, funciones por partes
    tikz-shape-engine/  Formas TikZ (polígonos, vectores, ángulos, óptica…)
    pgfplots-engine/    Plots 2D/3D, histogramas, box plots, heatmaps, series temporales
    graph-node-engine/  Grafos dirigidos/no dirigidos (DAGs, FSMs, redes, SEM…)
    circuitikz-engine/  Circuitos eléctricos (CircuiTikZ)
    chemistry-engine/   Fórmulas mhchem + estructuras ChemFig
    tree-forest-engine/ Árboles (forest package): sintácticos, filogenéticos, taxonomías
    timeline-gantt-engine/ Gantt (pgfgantt) + timelines TikZ
    math-engine/        (+ 4 engines adicionales)

  catalog-core/         35 plugins (math, geometry, statistics, physics, chemistry…)
  catalog-extended/     25 plugins (análisis avanzado, ingeniería, ciencias sociales…)
  catalog-experimental/ 10 plugins (5 reales + 5 bridges)

  plugin-registry.ts    Registro central: 69 entradas con pluginId, category, qualityLevel
  index.ts              Punto de entrada público
```

### Contrato del plugin

Todo plugin implementa `VisualDiagramPlugin`:
```typescript
interface VisualDiagramPlugin {
  readonly pluginId: string;
  readonly displayName: string;
  readonly category: PluginCategory;
  readonly qualityLevel: "official-core" | "official-extended" | "experimental";
  readonly requiredPackages: readonly string[];
  readonly scopeWarning?: string;

  create(): Promise<VisualFigureResult>;
  edit(existingFigurePath: string): Promise<VisualFigureResult>;
  editWithSource?(figureId: string, sourceJson: string, caption?, label?): Promise<VisualFigureResult>;
  validate(result: VisualFigureResult): Promise<ValidationResult>;
  exportLatexBlock(result: VisualFigureResult): string;
}
```

`BasePlugin<TDoc>` implementa todo excepto `buildDefaultDocument()`.  
Los plugins concretos solo definen su documento por defecto.

### Resultado de la creación

```typescript
interface VisualFigureResult {
  figureId: string;         // fig_XXXX
  pluginId: string;
  engineId: string;
  latexBlock: string;       // LaTeX completo listo para insertar
  requiredPackages: string[]; // se inyectan en el preámbulo automáticamente
  sourcePath: string;       // path relativo para persistencia
  sourceJson?: string;      // JSON del documento del engine — para re-edición
  warnings: string[];
}
```

---

## Motores disponibles

| Engine | LaTeX packages | Usos típicos |
|---|---|---|
| `math-engine` | amsmath, amssymb | Ecuaciones, matrices, sistemas, funciones por partes |
| `tikz-shape-engine` | tikz | Formas geométricas, vectores, diagramas de cuerpo libre |
| `pgfplots-engine` | pgfplots, tikz | Plots 2D/3D, estadística, series temporales, heatmaps |
| `graph-node-engine` | tikz | DAGs, redes, FSMs, UML, SEM, causal loops |
| `circuitikz-engine` | circuitikz | Circuitos eléctricos RC/RLC/op-amp |
| `chemistry-engine` | chemfig, mhchem | Estructuras orgánicas, reacciones, mecanismos |
| `tree-forest-engine` | forest | Árboles sintácticos, filogenéticos, Bloom |
| `timeline-gantt-engine` | pgfgantt, tikz | Gantt de investigación, líneas de tiempo históricas |
| `notation-engine` | amsthm, algorithm2e | Teoremas, pseudocódigo, glosarios |
| `table-data-engine` | booktabs | Tablas con formato académico |
| `external-vector-engine` | graphicx | Import-bridges para herramientas externas |

---

## Tests

```bash
# Suite completa (103 tests unitarios + 3 stress tests de compilación)
npm test

# Solo tests base (sin compilación real)
npx vitest run --exclude "tests/visual-plugins/compile-tests/*stress*"

# Stress test core: 35 plugins × create+validate + latexmk
npx vitest run tests/visual-plugins/compile-tests/core-plugins-stress.test.ts

# Stress test extended math: 12 plugins × compilación
npx vitest run tests/visual-plugins/compile-tests/extended-math-stress.test.ts

# Stress test extended non-math: 13 plugins × compilación
npx vitest run tests/visual-plugins/compile-tests/extended-other-stress.test.ts

# Stress test experimental: 10 plugins × compilación
npx vitest run tests/visual-plugins/compile-tests/experimental-stress.test.ts
```

**Resultados:** 173/173 tests pasan · 70/70 compilaciones con latexmk reales.

---

## Catálogos PDF

Los catálogos completos (generados con `npx tsx scripts/generate-*-catalog.ts`) están en:

```
../catalogo-core-plugins/catalogo.pdf          (356 KB — 35 figuras)
../catalogo-extended-plugins/catalogo.pdf      (313 KB — 25 figuras)
../catalogo-experimental-plugins/catalogo.pdf  (267 KB — 10 figuras)
```

---

## Integración con TeXisStudio

El catálogo se importa como módulo TypeScript en el frontend de la app:

```typescript
import { PLUGIN_REGISTRY, buildLatexInputBlock } from "@texisstudio/plugins";
```

El alias `@texisstudio/plugins` apunta al source TypeScript directamente  
(sin pre-compilación) vía `vite.config.ts`. Vite + esbuild transpilan  
los archivos `.ts` del catálogo al vuelo.

Los módulos Node.js incompatibles con browser (`FigureStore` usa `node:fs`)  
son stubeados por Vite:
```typescript
// vite.config.ts
alias: {
  "node:fs":   "src/lib/node-stubs.ts",
  "node:path": "src/lib/node-stubs.ts",
}
```

---

## Agregar un plugin

```typescript
// catalog-core/mi-disciplina/mi-plugin.ts
export class MiPlugin extends BasePlugin<PGFPlotsDocument> {
  constructor() {
    super(pgfEngine, {
      pluginId:        "mi-plugin",
      displayName:     "Mi figura",
      description:     "Descripción del tipo de figura.",
      category:        "mathematics",
      engineId:        "pgfplots-engine",
      qualityLevel:    "official-core",
      requiredPackages: ["pgfplots", "tikz"],
      blockKind:       "input",
      defaultCaption:  "Figura de ejemplo.",
      defaultLabel:    "fig:ejemplo",
    });
  }

  protected buildDefaultDocument(): PGFPlotsDocument {
    return { /* documento por defecto */ };
  }
}
```

Luego registrar en `plugin-registry.ts` y exportar desde el `index.ts` del catálogo.

---

## Desarrollo

```bash
npm install
npm run build       # TypeScript check
npm test            # Suite completa (requiere latexmk para stress tests)
npm run typecheck   # Solo verificación de tipos
```
