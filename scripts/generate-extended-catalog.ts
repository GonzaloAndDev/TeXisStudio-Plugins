/**
 * Genera catalogo-extended-plugins/catalogo.tex + catalogo.pdf
 * con los 25 plugins official-extended.
 *
 *   npx tsx scripts/generate-extended-catalog.ts
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { PLUGIN_REGISTRY } from "../visual-plugins/plugin-registry.js";
import {
  MathEngine, TikzShapeEngine, PGFPlotsEngine, GraphNodeEngine,
  CircuiTikZEngine, ChemistryEngine, TreeForestEngine, TimelineGanttEngine,
} from "../visual-plugins/engines/index.js";
import type { VisualEngine, EngineDocument, EditableSource } from "../visual-plugins/common/contracts/index.js";
import { detectToolchain } from "../visual-plugins/common/latex/compiler.js";

const ENGINES: Record<string, VisualEngine> = {
  "math-engine": new MathEngine(), "tikz-shape-engine": new TikzShapeEngine(),
  "pgfplots-engine": new PGFPlotsEngine(), "graph-node-engine": new GraphNodeEngine(),
  "circuitikz-engine": new CircuiTikZEngine(), "chemistry-engine": new ChemistryEngine(),
  "tree-forest-engine": new TreeForestEngine(), "timeline-gantt-engine": new TimelineGanttEngine(),
};

async function body(sourceJson: string, engineId: string): Promise<{ b: string; pkgs: string[] }> {
  const src = JSON.parse(sourceJson) as EditableSource;
  const doc = (src.data ?? src) as EngineDocument;
  const eng = ENGINES[engineId];
  if (!eng) return { b: `% no engine: ${engineId}`, pkgs: [] };
  const ex = await eng.export(doc, "latex");
  const b = typeof ex.content === "string" ? ex.content : new TextDecoder().decode(ex.content);
  return { b, pkgs: ex.requiredPackages };
}

const CATEGORY_ES: Record<string, string> = {
  "mathematics": "Matemáticas", "physics": "Física", "chemistry": "Química",
  "biology-medicine": "Biología y Medicina", "engineering-cs": "Ingeniería y Computación",
  "humanities-social": "Humanidades y Ciencias Sociales",
};
const CAT_ORDER = ["mathematics","physics","chemistry","biology-medicine","engineering-cs","humanities-social"];

const __dir = fileURLToPath(new URL(".", import.meta.url));
const outDir = resolve(__dir, "../../catalogo-extended-plugins");
mkdirSync(outDir, { recursive: true });

console.log("📦 TeXisStudio — Catálogo Extended (25 plugins)");
console.log(`   Salida: ${outDir}\n`);

const entries = PLUGIN_REGISTRY.filter(e => e.qualityLevel === "official-extended");
console.log(`   Plugins: ${entries.length}\n`);

const allPkgs = new Set<string>();
const byCategory: Record<string, Array<{ displayName: string; body: string; warnings: string[] }>> = {};
let ok = 0, fail = 0;

for (const entry of entries) {
  const plugin = new entry.plugin();
  process.stdout.write(`  [${plugin.category}] ${plugin.displayName} ... `);
  try {
    const r = await plugin.create();
    const { b, pkgs } = await body(r.sourceJson!, r.engineId);
    [...r.requiredPackages, ...pkgs].forEach(p => allPkgs.add(p));
    const cat = plugin.category;
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push({ displayName: plugin.displayName, body: b, warnings: r.warnings });
    console.log("✓"); ok++;
  } catch (e) { console.log(`✗ ${e}`); fail++; }
}

console.log(`\n  ✓ ${ok} OK, ✗ ${fail} errores\n`);

const pkgLines = [...allPkgs]
  .filter(p => !p.startsWith("pgfplotsset"))
  .map(p => `\\usepackage{${p}}`).join("\n");

/** Replace Unicode math/punctuation with ASCII/LaTeX equivalents for pdfLaTeX. */
function sanitizeTex(s: string): string {
  return s
    .replace(/%/g, "\\%")           // must come first — % starts LaTeX comment
    .replace(/≤/g, "$\\leq$").replace(/≥/g, "$\\geq$")
    .replace(/×/g, "$\\times$").replace(/→/g, "$\\to$")
    .replace(/←/g, "$\\leftarrow$").replace(/↑/g, "$\\uparrow$")
    .replace(/↓/g, "$\\downarrow$").replace(/∞/g, "$\\infty$")
    .replace(/α/g, "$\\alpha$").replace(/β/g, "$\\beta$")
    .replace(/γ/g, "$\\gamma$").replace(/δ/g, "$\\delta$")
    .replace(/°/g, "\\textdegree{}").replace(/–/g, "--").replace(/—/g, "---")
    .replace(/"/g, "``").replace(/"/g, "''")
    .replace(/'/g, "`").replace(/'/g, "'")
    .replace(/[&#]/g, "\\$&");
}

const sections: string[] = [];
let n = 0;
for (const cat of CAT_ORDER) {
  const figs = byCategory[cat];
  if (!figs?.length) continue;
  sections.push(`\n\\section{${CATEGORY_ES[cat] ?? cat}}\n`);
  for (const f of figs) {
    n++;
    const cap = sanitizeTex(f.displayName);
    sections.push([
      `\\subsection*{${n}. ${cap}}`,
      `\\begin{figure}[H]`,
      `  \\centering`,
      f.body.split("\n").map(l => "  " + l).join("\n"),
      `  \\caption{${cap}}`,
      `  \\label{fig:ext-${n}}`,
      `\\end{figure}`,
      f.warnings.length
        ? `\\begin{tcolorbox}[colback=yellow!8,colframe=orange!60,title=Nota,fonttitle=\\small]\\small ${sanitizeTex(f.warnings[0])}\\end{tcolorbox}\n`
        : "",
    ].join("\n"));
  }
}

const latex = `% TeXisStudio — Catálogo Extended (${n} plugins)
\\documentclass[11pt, a4paper]{article}
\\usepackage[utf8]{inputenc}\\usepackage[T1]{fontenc}\\usepackage[spanish]{babel}
\\usepackage{lmodern}\\usepackage{geometry}\\geometry{margin=2.5cm}
\\usepackage{hyperref}\\hypersetup{colorlinks=true,linkcolor=blue!70!black}
\\usepackage{float}\\usepackage{caption}\\usepackage{tcolorbox}\\usepackage{fancyhdr}
${pkgLines}
\\pgfplotsset{compat=1.18}
\\usetikzlibrary{shapes.geometric,arrows.meta,positioning,calc}
\\pagestyle{fancy}\\fancyhf{}
\\rhead{\\small TeXisStudio — Extended}\\lhead{\\small \\leftmark}\\cfoot{\\thepage}
\\captionsetup{font=small,labelfont=bf}
\\title{{\\Large\\textbf{TeXisStudio}}\\\\[0.4em]{\\large Catálogo Extended}\\\\[0.2em]{\\normalsize ${n} plugins de nivel oficial-extendido}}
\\author{TeXisStudio-Plugins v0.1.0}\\date{${new Date().toLocaleDateString("es-MX",{year:"numeric",month:"long",day:"numeric"})}}
\\begin{document}\\maketitle\\tableofcontents\\newpage
${sections.join("\n\n")}
\\end{document}
`;

const texPath = join(outDir, "catalogo.tex");
writeFileSync(texPath, latex, "utf8");
console.log(`✅  catalogo.tex → ${texPath}\n`);

const tc = detectToolchain();
if (!tc) { console.log("⚠  No latexmk — solo .tex"); process.exit(0); }
console.log(`🔨  Compilando (2 pasadas)...`);
for (let p = 1; p <= 2; p++) {
  const r = spawnSync(tc, ["-pdf","-interaction=nonstopmode","-halt-on-error","catalogo.tex"],
    { cwd: outDir, encoding: "utf8", timeout: 300_000, shell: process.platform === "win32" });
  if (r.status !== 0 && p === 1) {
    const { existsSync, readFileSync } = await import("node:fs");
    const log = existsSync(join(outDir,"catalogo.log")) ? readFileSync(join(outDir,"catalogo.log"),"utf8") : r.stdout;
    console.error("❌  Error:\n" + log.split("\n").filter(l => l.startsWith("!")).slice(0,8).join("\n"));
    process.exit(1);
  }
  console.log(`   Pasada ${p}/2 OK`);
}
const { statSync, existsSync } = await import("node:fs");
const pdfPath = join(outDir, "catalogo.pdf");
if (existsSync(pdfPath)) {
  console.log(`\n✅  PDF: ${pdfPath}`);
  console.log(`   Tamaño: ${(statSync(pdfPath).size/1024).toFixed(0)} KB\n`);
}
