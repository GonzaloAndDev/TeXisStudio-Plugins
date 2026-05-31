/**
 * Genera catalogo-experimental-plugins/catalogo.tex + .pdf
 * con los 10 plugins experimentales.
 *
 *   npx tsx scripts/generate-experimental-catalog.ts
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { PLUGIN_REGISTRY } from "../visual-plugins/plugin-registry.js";
import {
  GraphNodeEngine, TreeForestEngine, PGFPlotsEngine,
} from "../visual-plugins/engines/index.js";
import type { VisualEngine, EngineDocument, EditableSource } from "../visual-plugins/common/contracts/index.js";
import { detectToolchain } from "../visual-plugins/common/latex/compiler.js";

const ENGINES: Record<string, VisualEngine> = {
  "graph-node-engine":  new GraphNodeEngine(),
  "tree-forest-engine": new TreeForestEngine(),
  "pgfplots-engine":    new PGFPlotsEngine(),
};

async function body(sj: string, eid: string): Promise<{ b: string; pkgs: string[] }> {
  const src = JSON.parse(sj) as EditableSource;
  const doc = (src.data ?? src) as EngineDocument;
  const eng = ENGINES[eid];
  if (!eng) return { b: "", pkgs: [] };
  const ex = await eng.export(doc, "latex");
  const b = typeof ex.content === "string" ? ex.content : new TextDecoder().decode(ex.content);
  return { b, pkgs: ex.requiredPackages };
}

function sanitizeTex(s: string): string {
  return s
    .replace(/%/g, "\\%")
    // Escape LaTeX commands in plain text (backslash → \textbackslash{})
    .replace(/\\([a-zA-Z]+)\{[^}]*\}/g, (m) =>
      "\\texttt{" + m.replace(/\\/g, "\\textbackslash{}").replace(/\{/g, "\\{").replace(/\}/g, "\\}") + "}"
    )
    .replace(/≤/g, "$\\leq$").replace(/≥/g, "$\\geq$")
    .replace(/×/g, "$\\times$").replace(/→/g, "$\\to$").replace(/−/g, "$-$")
    .replace(/°/g, "\\textdegree{}").replace(/–/g, "--").replace(/[&#]/g, "\\$&");
}

const CATEGORY_ES: Record<string, string> = {
  "mathematics": "Matemáticas", "physics": "Física",
  "humanities-social": "Humanidades y Ciencias Sociales",
  "biology-medicine": "Biología y Medicina",
};
const CAT_ORDER = ["mathematics", "humanities-social", "biology-medicine", "physics"];

const __dir = fileURLToPath(new URL(".", import.meta.url));
const outDir = resolve(__dir, "../../catalogo-experimental-plugins");
mkdirSync(outDir, { recursive: true });

console.log("📦 TeXisStudio — Catálogo Experimental (10 plugins)");
console.log(`   Salida: ${outDir}\n`);

const entries = PLUGIN_REGISTRY.filter(e => e.qualityLevel === "experimental");
const allPkgs = new Set<string>();
const byCategory: Record<string, Array<{
  displayName: string; body: string; warnings: string[]; isImportBridge: boolean;
}>> = {};
let ok = 0, fail = 0;

for (const entry of entries) {
  const plugin = new entry.plugin();
  process.stdout.write(`  [${plugin.category}] ${plugin.displayName} ... `);
  try {
    const r = await plugin.create();
    [...r.requiredPackages].forEach(p => allPkgs.add(p));
    // Import bridges have no engine content — use latexBlock directly
    const isImportBridge = !ENGINES[r.engineId] || r.sourceJson === undefined;
    let figBody: string;
    if (!isImportBridge) {
      const ex = await body(r.sourceJson!, r.engineId);
      figBody = ex.b;
      ex.pkgs.forEach(p => allPkgs.add(p));
    } else {
      // For import bridges: extract what's between \begin{figure} and \caption
      const match = r.latexBlock.match(/\\begin\{figure\}[\s\S]*?\\centering\s*([\s\S]*?)\\caption/);
      figBody = match ? match[1].trim() : "% placeholder";
    }
    const cat = plugin.category;
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push({ displayName: plugin.displayName, body: figBody, warnings: r.warnings, isImportBridge });
    console.log(`✓${isImportBridge ? " [bridge]" : ""}`); ok++;
  } catch (e) { console.log(`✗ ${e}`); fail++; }
}
console.log(`\n  ✓ ${ok} OK, ✗ ${fail} errores\n`);

const pkgLines = [...allPkgs].filter(p => !p.startsWith("pgfplotsset")).map(p => `\\usepackage{${p}}`).join("\n");

const sections: string[] = [];
let n = 0;
for (const cat of [...CAT_ORDER, ...Object.keys(byCategory).filter(c => !CAT_ORDER.includes(c))]) {
  const figs = byCategory[cat];
  if (!figs?.length) continue;
  sections.push(`\n\\section{${CATEGORY_ES[cat] ?? cat}}\n`);
  for (const f of figs) {
    n++;
    const cap = sanitizeTex(f.displayName);
    sections.push([
      `\\subsection*{${n}. ${cap}${f.isImportBridge ? " --- \\textit{(Import bridge)}" : ""}}`,
      `\\begin{figure}[H]`,
      `  \\centering`,
      f.body.split("\n").map(l => "  " + l).join("\n"),
      `  \\caption{${cap}}`,
      `  \\label{fig:exp-${n}}`,
      `\\end{figure}`,
      f.warnings.length
        ? `\\begin{tcolorbox}[colback=red!5,colframe=red!40,title=Alcance experimental,fonttitle=\\small\\bfseries]\\small ${sanitizeTex(f.warnings[0])}\\end{tcolorbox}\n`
        : "",
    ].join("\n"));
  }
}

const latex = `% TeXisStudio — Catálogo Experimental (${n} plugins)
\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}\\usepackage[T1]{fontenc}\\usepackage[spanish]{babel}
\\usepackage{lmodern}\\usepackage{geometry}\\geometry{margin=2.5cm}
\\usepackage{hyperref}\\hypersetup{colorlinks=true,linkcolor=blue!70!black}
\\usepackage{float}\\usepackage{caption}\\usepackage{tcolorbox}\\usepackage{fancyhdr}
${pkgLines}
${allPkgs.has("pgfplots") ? "\\\\pgfplotsset{compat=1.18}" : ""}
\\usetikzlibrary{shapes.geometric,arrows.meta,positioning,calc}
\\pagestyle{fancy}\\fancyhf{}
\\rhead{\\small TeXisStudio — Experimental}\\lhead{\\small \\leftmark}\\cfoot{\\thepage}
\\captionsetup{font=small,labelfont=bf}
\\title{{\\Large\\textbf{TeXisStudio}}\\\\[0.4em]
  {\\large Catálogo Experimental}\\\\[0.2em]
  {\\normalsize ${n} plugins en fase experimental}\\\\[0.5em]
  {\\small\\color{red!70!black}$\\star$ Los plugins con \\textit{(Import bridge)} generan un marcador de posición\\\\ y guían al usuario a la herramienta externa adecuada.}}
\\author{TeXisStudio-Plugins v0.1.0}
\\date{${new Date().toLocaleDateString("es-MX",{year:"numeric",month:"long",day:"numeric"})}}
\\begin{document}\\maketitle\\tableofcontents\\newpage
${sections.join("\n\n")}
\\end{document}
`;

const texPath = join(outDir, "catalogo.tex");
writeFileSync(texPath, latex, "utf8");
console.log(`✅  catalogo.tex → ${texPath}\n`);

const tc = detectToolchain();
if (!tc) { console.log("⚠  No latexmk"); process.exit(0); }
console.log(`🔨  Compilando...`);
for (let p = 1; p <= 2; p++) {
  const r = spawnSync(tc, ["-pdf","-interaction=nonstopmode","-halt-on-error","catalogo.tex"],
    { cwd: outDir, encoding: "utf8", timeout: 300_000, shell: process.platform === "win32" });
  if (r.status !== 0 && p === 1) {
    const { existsSync, readFileSync } = await import("node:fs");
    const log = existsSync(join(outDir,"catalogo.log")) ? readFileSync(join(outDir,"catalogo.log"),"utf8") : r.stdout;
    console.error("❌ Error:\n" + log.split("\n").filter(l => l.startsWith("!")).slice(0,8).join("\n"));
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
