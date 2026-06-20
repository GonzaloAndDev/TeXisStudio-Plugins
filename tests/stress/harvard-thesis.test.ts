/**
 * STRESS TEST — Tesis PhD Harvard "kitchen-sink".
 *
 *  1. Genera LaTeX de los 70 plugins del registry (create()) y valida que
 *     NINGUNO lance ni produzca estructura inválida.
 *  2. Ensambla una tesis completa (portada, misión/visión, abstract, TOC,
 *     marco teórico, metodología, resultados, conclusiones, bibliografía,
 *     anexos) con un muestreo amplio de plugins + todas las formas
 *     matemáticas, y la compila con xelatex+biber (perfil Harvard).
 *
 * Compila solo si hay toolchain LaTeX; si no, hace skip. No corre en el CI
 * normal salvo invocación explícita.
 */
import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync, existsSync, statSync, readFileSync } from "node:fs";
import { deflateSync } from "node:zlib";
import { tmpdir } from "node:os";
import { join } from "node:path";

/** Genera un PNG RGB válido (CRC correctos) sin depender de archivos externos. */
function makePng(w: number, h: number, rgb: [number, number, number]): Buffer {
  const table = Array.from({ length: 256 }, (_, n) => {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    return c >>> 0;
  });
  const crc32 = (buf: Buffer) => {
    let c = 0xffffffff;
    for (const b of buf) c = table[(c ^ b) & 0xff]! ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  };
  const chunk = (type: string, data: Buffer) => {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type, "ascii"), data]);
    const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
    return Buffer.concat([len, td, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 2; // 8-bit, RGB
  const raw = Buffer.alloc(h * (1 + w * 3));
  for (let y = 0; y < h; y++) {
    const off = y * (1 + w * 3);
    raw[off] = 0; // filtro none
    for (let x = 0; x < w; x++) { const p = off + 1 + x * 3; raw[p] = rgb[0]; raw[p + 1] = rgb[1]; raw[p + 2] = rgb[2]; }
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr), chunk("IDAT", deflateSync(raw)), chunk("IEND", Buffer.alloc(0)),
  ]);
}
import { PLUGIN_REGISTRY } from "../../visual-plugins/plugin-registry.js";
import { MathEngine } from "../../visual-plugins/engines/math-engine/engine.js";
import { validateLatexStructure } from "../../visual-plugins/common/latex/structural-validator.js";

interface CreatablePlugin {
  displayName: string;
  create(): Promise<{ texContent?: string; latexBlock: string; requiredPackages: readonly string[] }>;
}
const instantiate = (entry: (typeof PLUGIN_REGISTRY)[number]): CreatablePlugin =>
  new (entry.plugin as unknown as new () => CreatablePlugin)();

const xelatexOk = spawnSync("xelatex", ["--version"], { encoding: "utf8" }).status === 0;
const latexmkOk = spawnSync("latexmk", ["--version"], { encoding: "utf8" }).status === 0;

describe("STRESS — Harvard PhD thesis kitchen-sink", () => {
  // ── 1. Los 70 plugins generan LaTeX válido sin lanzar ───────────────────────
  it("los 70 plugins generan LaTeX válido (create() no lanza)", async () => {
    const failures: string[] = [];
    for (const entry of PLUGIN_REGISTRY) {
      const name = (entry.plugin as { name: string }).name;
      try {
        const res = await instantiate(entry).create();
        const body = res.texContent ?? res.latexBlock;
        if (!body || !body.trim()) { failures.push(`EMPTY ${name}`); continue; }
        const v = validateLatexStructure(body);
        if (!v.valid) failures.push(`INVALID_STRUCTURE ${name}: ${v.issues?.map((i) => i.message).join("; ")}`);
      } catch (e) {
        failures.push(`THREW ${name}: ${(e as Error).message}`);
      }
    }
    // eslint-disable-next-line no-console
    console.log(`[stress] plugins probados=${PLUGIN_REGISTRY.length} fallos=${failures.length}`);
    failures.forEach((f) => console.log("  ⚠", f));
    expect(failures, failures.join("\n")).toEqual([]);
  });

  // ── 2. La tesis kitchen-sink compila ────────────────────────────────────────
  // Pesada (compila ~35 págs con todo el toolchain). Opt-in con TEXIS_STRESS=1
  // para no penalizar `npm test`; siempre disponible para el ejercicio.
  it.skipIf(!process.env.TEXIS_STRESS)("ensambla y compila la tesis Harvard con todos los elementos", async () => {
    const math = new MathEngine();

    // Muestreo amplio: hasta 4 dificultades/variantes por categoría.
    const byCat: Record<string, (typeof PLUGIN_REGISTRY)[number][]> = {};
    for (const e of PLUGIN_REGISTRY) (byCat[e.category] ??= []).push(e);
    const picks: (typeof PLUGIN_REGISTRY)[number][] = [];
    for (const entries of Object.values(byCat)) {
      const seen = new Set<string>();
      for (const e of entries) {
        const k = e.userLevel + ":" + ((e.plugin as { name: string }).name.slice(0, 4));
        if (seen.has(k)) continue;
        seen.add(k); picks.push(e);
        if (seen.size >= 4) break;
      }
    }

    const figures: { caption: string; label: string; tex: string }[] = [];
    const pkgs = new Set<string>();
    for (const entry of picks) {
      const inst = instantiate(entry);
      const res = await inst.create();
      res.requiredPackages.forEach((p) => pkgs.add(p));
      figures.push({
        caption: `${inst.displayName} (${entry.category}/${entry.userLevel})`,
        label: `fig:${(entry.plugin as { name: string }).name}`,
        tex: res.texContent ?? res.latexBlock,
      });
    }
    // eslint-disable-next-line no-console
    console.log(`[stress] figuras embebidas=${figures.length} paquetes=${[...pkgs].sort().join(", ")}`);

    const mEq = math.generateLatex({ engineId: "math-engine", version: "1.0.0", mode: "equation", numbered: true, label: "eq:quad", tree: [{ type: "symbol", content: "x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}" }] });
    const mAlign = math.generateLatex({ engineId: "math-engine", version: "1.0.0", mode: "align", numbered: true, tree: [{ type: "symbol", content: "\\nabla \\cdot \\mathbf{E} &= \\frac{\\rho}{\\varepsilon_0}" }, { type: "symbol", content: "\\nabla \\times \\mathbf{B} &= \\mu_0\\mathbf{J} + \\mu_0\\varepsilon_0 \\frac{\\partial \\mathbf{E}}{\\partial t}" }] });
    const mSys = math.generateLatex({ engineId: "math-engine", version: "1.0.0", mode: "system", numbered: true, tree: [], equations: ["2x_1+3x_2-x_3 &= 4", "x_1-x_2+2x_3 &= 1"], variables: ["x_1", "x_2", "x_3"] } as never);

    const dir = mkdtempSync(join(tmpdir(), "texis-stress-"));
    writeFileSync(join(dir, "plot.png"), makePng(96, 64, [40, 90, 160]));

    const figBlock = (f: { caption: string; label: string; tex: string }) =>
      `\\begin{figure}[htbp]\\centering\n${f.tex}\n\\caption{${f.caption}}\\label{${f.label}}\n\\end{figure}\n`;
    const P = "This dissertation examines the structural mechanisms underlying the observed phenomena, drawing on empirical evidence \\parencite{goodfellow2016} and established theory \\textcite{lecun2015}. The analysis triangulates quantitative and qualitative findings, situating each result within the broader scholarly conversation \\parencite{vaswani2017,he2016}, and articulates the methodological commitments that follow from this synthesis.";
    const lorem = (n: number) => Array.from({ length: n }, () => P).join(" ");
    const chunk = <T,>(a: T[], n: number) => { const r: T[][] = []; for (let i = 0; i < a.length; i += n) r.push(a.slice(i, i + n)); return r; };
    const fc = chunk(figures, Math.max(1, Math.ceil(figures.length / 4)));
    const figsFor = (i: number) => (fc[i] ?? []).map(figBlock).join("\n");

    const KNOWN = new Set(["amsmath","amssymb","mathtools","graphicx","booktabs","longtable","array","siunitx","xcolor","tikz","pgfplots","circuitikz","mhchem","chemfig","forest","pgfgantt","algorithm","algpseudocode","listings","fontspec","geometry","setspace","csquotes","biblatex","hyperref","babel","cancel","physics","xfrac"]);
    const extra = [...pkgs].filter((p) => !KNOWN.has(p));
    if (extra.length) console.log("[stress] ⚠ paquetes extra fuera del preámbulo base:", extra.join(", "));

    const tex = `\\documentclass[12pt,letterpaper,oneside]{book}
\\usepackage{fontspec}
\\usepackage[american]{babel}
\\usepackage{geometry}\\geometry{top=25.4mm,bottom=25.4mm,left=38.1mm,right=25.4mm}
\\usepackage{setspace}
\\usepackage{amsmath,amssymb,mathtools}
\\usepackage{graphicx}
\\usepackage{booktabs,longtable,array}
\\usepackage{siunitx}
\\usepackage{xcolor}
\\usepackage{cancel}\\usepackage{xfrac}
\\usepackage{tikz}
\\usetikzlibrary{arrows.meta,positioning,shapes.geometric,shapes.misc,calc,patterns,decorations.pathmorphing,fit,backgrounds,matrix,chains,angles,quotes}
\\usepackage{pgfplots}\\pgfplotsset{compat=1.18}\\usepgfplotslibrary{statistics,colormaps,fillbetween,polar}
\\usepackage{circuitikz}
\\usepackage[version=4]{mhchem}
\\usepackage{chemfig}
\\usepackage{forest}
\\usepackage{pgfgantt}
\\usepackage{algorithm}\\usepackage{algpseudocode}
\\usepackage{listings}\\lstset{basicstyle=\\ttfamily\\footnotesize,frame=single,breaklines=true}
${extra.map((p) => `\\usepackage{${p}}`).join("\n")}
\\usepackage{csquotes}
\\usepackage[backend=biber,style=apa]{biblatex}\\addbibresource{refs.bib}
\\usepackage{hyperref}
\\begin{document}\\doublespacing
\\frontmatter
\\begin{titlepage}\\centering\\vspace*{2cm}{\\large Harvard University\\par}\\vspace{0.3cm}{\\normalsize Graduate School of Arts and Sciences\\par}
\\vspace{3cm}{\\huge\\bfseries Mechanisms of Structural Adaptation\\par}\\vspace{0.5cm}{\\large A Computational Study\\par}
\\vspace{3cm}{\\large A dissertation presented by\\par}\\vspace{0.3cm}{\\large\\bfseries Jane Q. Scholar\\par}
\\vfill{\\normalsize Cambridge, Massachusetts \\quad 2026\\par}\\end{titlepage}
\\chapter*{Mission and Vision}\\addcontentsline{toc}{chapter}{Mission and Vision}
\\textbf{Mission.} ${lorem(2)}\\par\\medskip\\textbf{Vision.} ${lorem(2)}
\\chapter*{Abstract}\\addcontentsline{toc}{chapter}{Abstract}
${lorem(3)}
\\tableofcontents\\listoffigures\\listoftables
\\mainmatter
\\chapter{Introduction}
${lorem(5)} Inline math is ubiquitous: $e^{i\\pi}+1=0$, $\\lim_{x\\to\\infty}\\tfrac{1}{x}=0$, $\\{x\\in\\mathbb{R}:x>0\\}$. ${lorem(4)}
${mEq}
${lorem(4)}
${figsFor(0)}
${lorem(3)}
\\chapter{Theoretical Framework}
${lorem(5)}
${mAlign}
${lorem(4)}
${figsFor(1)}
${lorem(3)}
\\chapter{Methodology}
${lorem(4)}
${mSys}
${lorem(5)}
${figsFor(2)}
${lorem(3)}
\\chapter{Results and Discussion}
${lorem(4)}
\\begin{figure}[htbp]\\centering\\includegraphics[width=3cm]{plot.png}\\caption{Apparatus bitmap}\\label{fig:bmp}\\end{figure}
${figsFor(3)}
${lorem(5)}
\\chapter{Conclusions}
${lorem(5)}
\\printbibliography[heading=bibintoc,title={References}]
\\appendix
\\chapter{Supplementary Derivations}
${lorem(4)} ${mEq}
\\chapter{Additional Data}
${lorem(3)}
\\end{document}
`;
    writeFileSync(join(dir, "thesis.tex"), tex);
    writeFileSync(join(dir, "refs.bib"), `@book{goodfellow2016, title={Deep Learning}, author={Goodfellow, Ian and Bengio, Yoshua}, year={2016}, publisher={MIT Press}}
@article{lecun2015, title={Deep learning}, author={LeCun, Yann and Bengio, Yoshua}, journal={Nature}, year={2015}}
@inproceedings{vaswani2017, title={Attention is all you need}, author={Vaswani, Ashish}, booktitle={NeurIPS}, year={2017}}
@inproceedings{he2016, title={Deep residual learning}, author={He, Kaiming}, booktitle={CVPR}, year={2016}}
`);

    if (!xelatexOk || !latexmkOk) { console.warn("[stress] SKIP compile: falta xelatex/latexmk"); return; }

    const run = spawnSync("latexmk", ["-xelatex", "-interaction=nonstopmode", "thesis.tex"], { cwd: dir, encoding: "utf8", timeout: 300_000 });
    const log = existsSync(join(dir, "thesis.log")) ? readFileSync(join(dir, "thesis.log"), "utf8") : (run.stdout ?? "");
    const pdf = join(dir, "thesis.pdf");
    const ok = existsSync(pdf) && statSync(pdf).size > 0;
    const m = log.match(/Output written on thesis\.(?:pdf|xdv) \((\d+) pages?/);
    const pages = m ? Number(m[1]) : 0;
    const errs = log.split("\n").filter((l) => /^! /.test(l)).slice(0, 20);
    // eslint-disable-next-line no-console
    console.log(`[stress] compile ok=${ok} pages=${pages} pdfBytes=${ok ? statSync(pdf).size : 0} dir=${dir}`);
    errs.forEach((l) => console.log("   !", l));

    expect(ok, `No se generó PDF.\n${errs.join("\n")}`).toBe(true);
    expect(pages, "tesis demasiado corta").toBeGreaterThanOrEqual(20);
  }, 360_000);
});
