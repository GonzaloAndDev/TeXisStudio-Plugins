/**
 * Genera un documento LaTeX completo con los 35 plugins official-core.
 * Salida: TeXisStudioS/catalogo-core-plugins/catalogo.tex + catalogo.pdf
 *
 * Ejecutar con:
 *   npx tsx scripts/generate-core-catalog.ts
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PLUGIN_REGISTRY } from "../visual-plugins/plugin-registry.js";
import {
  MathEngine, TikzShapeEngine, PGFPlotsEngine, GraphNodeEngine,
  CircuiTikZEngine, ChemistryEngine, TreeForestEngine, TimelineGanttEngine,
} from "../visual-plugins/engines/index.js";
import type { VisualEngine, EngineDocument, EditableSource } from "../visual-plugins/common/contracts/index.js";
import { compileLatexFragment, detectToolchain } from "../visual-plugins/common/latex/compiler.js";
import { spawnSync } from "node:child_process";

// ── Engine factory ─────────────────────────────────────────────────

const ENGINES: Record<string, VisualEngine> = {
  "math-engine":          new MathEngine(),
  "tikz-shape-engine":    new TikzShapeEngine(),
  "pgfplots-engine":      new PGFPlotsEngine(),
  "graph-node-engine":    new GraphNodeEngine(),
  "circuitikz-engine":    new CircuiTikZEngine(),
  "chemistry-engine":     new ChemistryEngine(),
  "tree-forest-engine":   new TreeForestEngine(),
  "timeline-gantt-engine":new TimelineGanttEngine(),
};

async function getEngineBody(sourceJson: string, engineId: string): Promise<{ body: string; packages: string[] }> {
  const source = JSON.parse(sourceJson) as EditableSource;
  const doc = (source.data ?? source) as EngineDocument;
  const engine = ENGINES[engineId];
  if (!engine) return { body: `% No engine for ${engineId}`, packages: [] };
  const exported = await engine.export(doc, "latex");
  const body = typeof exported.content === "string" ? exported.content : new TextDecoder().decode(exported.content);
  return { body, packages: exported.requiredPackages };
}

// ── Category metadata ──────────────────────────────────────────────

const CATEGORY_ES: Record<string, string> = {
  "mathematics":       "Matemáticas",
  "physics":           "Física",
  "chemistry":         "Química",
  "biology-medicine":  "Biología y Medicina",
  "engineering-cs":    "Ingeniería y Computación",
  "humanities-social": "Humanidades y Ciencias Sociales",
};

const CATEGORY_ORDER = ["mathematics", "physics", "chemistry", "biology-medicine", "engineering-cs", "humanities-social"];

// ── Main ───────────────────────────────────────────────────────────

const __dir    = fileURLToPath(new URL(".", import.meta.url));
// scripts/ → TeXisStudio-Plugins/ → TeXisStudioS/  (solo 2 niveles arriba)
const texisStudioS = resolve(__dir, "../..");
const outDir       = resolve(texisStudioS, "catalogo-core-plugins");

mkdirSync(outDir, { recursive: true });

console.log("📦 TeXisStudio — Generando catálogo de 35 plugins core");
console.log(`   Salida: ${outDir}\n`);

const coreEntries = PLUGIN_REGISTRY.filter(e => e.qualityLevel === "official-core");
console.log(`   Plugins encontrados: ${coreEntries.length}\n`);

// Collect all packages needed
const allPackages = new Set<string>(["pgfplotsset{compat=1.18}"]);

// Figure sections grouped by category
type FigureEntry = {
  displayName: string;
  pluginId: string;
  body: string;
  packages: string[];
  warnings: string[];
};

const byCategory: Record<string, FigureEntry[]> = {};

let ok = 0, fail = 0;

for (const entry of coreEntries) {
  const plugin = new entry.plugin();
  process.stdout.write(`  [${plugin.category}] ${plugin.displayName} ... `);

  try {
    const result = await plugin.create();
    const { body, packages: engPkgs } = await getEngineBody(result.sourceJson!, result.engineId);

    const pkgs = [...new Set([...result.requiredPackages, ...engPkgs])];
    pkgs.forEach(p => allPackages.add(p));

    const cat = plugin.category;
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push({
      displayName: plugin.displayName,
      pluginId: plugin.pluginId,
      body,
      packages: pkgs,
      warnings: result.warnings,
    });

    console.log("✓");
    ok++;
  } catch (e) {
    console.log(`✗ ${e}`);
    fail++;
  }
}

console.log(`\n  ✓ ${ok} figuras generadas, ✗ ${fail} errores\n`);

// ── Build LaTeX document ───────────────────────────────────────────

const pkgLines = [...allPackages]
  .filter(p => !p.startsWith("pgfplotsset"))
  .map(p => `\\usepackage{${p}}`)
  .join("\n");

const sectionBlocks: string[] = [];
let figNum = 0;

for (const cat of CATEGORY_ORDER) {
  const figs = byCategory[cat];
  if (!figs || figs.length === 0) continue;
  const catName = CATEGORY_ES[cat] ?? cat;
  sectionBlocks.push(`\n\\section{${catName}}\n`);

  for (const fig of figs) {
    figNum++;
    const safeId = fig.pluginId.replace(/[^a-zA-Z0-9]/g, "-");
    const caption = fig.displayName;

    // Wrap engine body in figure environment
    const figBlock = [
      `\\subsection*{${figNum}. ${caption.replace(/#/g, "\\#").replace(/&/g, "\\&")}}`,
      `\\begin{figure}[H]`,
      `  \\centering`,
      fig.body.split("\n").map(l => "  " + l).join("\n"),
      `  \\caption{${caption.replace(/#/g, "\\#").replace(/&/g, "\\&")}}`,
      `  \\label{fig:${safeId}}`,
      `\\end{figure}`,
      fig.warnings.length > 0
        ? `\\begin{tcolorbox}[colback=yellow!10,colframe=orange!60,title=Nota de alcance,fonttitle=\\small]\\small ${fig.warnings[0]}\\end{tcolorbox}\n`
        : "",
    ].join("\n");
    sectionBlocks.push(figBlock);
  }
}

const latex = `% TeXisStudio — Catálogo de Plugins Core (35 plugins)
% Generado automáticamente — ${new Date().toLocaleDateString("es-MX", { year:"numeric",month:"long",day:"numeric" })}
\\documentclass[11pt, a4paper]{article}

% ── Paquetes ──────────────────────────────────────────────────────
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage[spanish]{babel}
\\usepackage{lmodern}
\\usepackage{geometry}
\\geometry{margin=2.5cm}
\\usepackage{hyperref}
\\hypersetup{colorlinks=true, linkcolor=blue!70!black, urlcolor=blue}
\\usepackage{float}
\\usepackage{caption}
\\usepackage{tcolorbox}
\\usepackage{booktabs}
\\usepackage{fancyhdr}
${pkgLines}
\\pgfplotsset{compat=1.18}
\\usetikzlibrary{shapes.geometric,arrows.meta,positioning,calc}

% ── Estilo ────────────────────────────────────────────────────────
\\pagestyle{fancy}
\\fancyhf{}
\\rhead{\\small TeXisStudio — Catálogo Core}
\\lhead{\\small \\leftmark}
\\cfoot{\\thepage}
\\captionsetup{font=small, labelfont=bf}

\\title{%
  {\\Large \\textbf{TeXisStudio}}\\\\[0.4em]
  {\\large Catálogo de Plugins Core}\\\\[0.2em]
  {\\normalsize ${figNum} figuras académicas sin código LaTeX}
}
\\author{Generado con TeXisStudio-Plugins v0.1.0}
\\date{${new Date().toLocaleDateString("es-MX", { year:"numeric",month:"long",day:"numeric" })}}

\\begin{document}
\\maketitle
\\tableofcontents
\\newpage

${sectionBlocks.join("\n\n")}

\\end{document}
`;

const texPath = join(outDir, "catalogo.tex");
writeFileSync(texPath, latex, "utf8");
console.log(`✅  catalogo.tex escrito en:\n   ${texPath}\n`);

// ── Compile ────────────────────────────────────────────────────────

const toolchain = detectToolchain();
if (!toolchain) {
  console.log("⚠  latexmk no encontrado — solo se generó el .tex");
  process.exit(0);
}

console.log(`🔨  Compilando con ${toolchain} (puede tardar 1–3 min en primer run)...`);

// Run latexmk twice for TOC — use relative filename to avoid spaces-in-path issue
for (let pass = 1; pass <= 2; pass++) {
  const args = toolchain === "latexmk"
    ? ["-pdf", "-interaction=nonstopmode", "-halt-on-error", "catalogo.tex"]
    : ["-interaction=nonstopmode", "-halt-on-error", "catalogo.tex"];

  const run = spawnSync(toolchain, args, {
    cwd: outDir,       // cd to output dir, then use relative filename
    encoding: "utf8",
    timeout: 300_000,
    shell: process.platform === "win32",
  });

  if (run.status !== 0 && pass === 1) {
    const logPath = join(outDir, "catalogo.log");
    const { existsSync, readFileSync } = await import("node:fs");
    if (existsSync(logPath)) {
      const log = readFileSync(logPath, "utf8");
      const errors = log.split("\n").filter(l => l.startsWith("!") || l.startsWith("l.")).slice(0, 15);
      console.error("\n❌  Error de compilación:\n" + errors.join("\n"));
    } else {
      console.error("\n❌  Error de compilación:", run.stderr?.slice(0, 400));
    }
    process.exit(1);
  }
  console.log(`   Pasada ${pass}/2 completada`);
}

const pdfPath = join(outDir, "catalogo.pdf");
const { statSync, existsSync } = await import("node:fs");
if (existsSync(pdfPath)) {
  const size = statSync(pdfPath).size;
  console.log(`\n✅  PDF generado exitosamente:`);
  console.log(`   ${pdfPath}`);
  console.log(`   Tamaño: ${(size / 1024).toFixed(0)} KB\n`);
} else {
  console.error("\n❌  No se encontró el PDF generado");
  process.exit(1);
}
