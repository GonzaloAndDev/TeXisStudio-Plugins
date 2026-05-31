import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync, existsSync, rmSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

export interface CompileOptions {
  /** Packages to load in the preamble, e.g. ["tikz", "pgfplots"]. */
  packages?: string[];
  /** Raw preamble lines appended after the package list (e.g. \pgfplotsset). */
  preamble?: string[];
  /** Compiler binary. Defaults to latexmk, falls back to pdflatex. */
  engine?: "latexmk" | "pdflatex";
  /** Timeout in ms. */
  timeoutMs?: number;
}

export interface CompileResult {
  ok: boolean;
  /** True when no LaTeX toolchain is installed (test should skip, not fail). */
  toolchainAvailable: boolean;
  pdfBytes?: number;
  log: string;
  errors: string[];
}

const PACKAGE_OPTIONS: Record<string, string> = {
  mhchem: "version=4",
};

let _cachedToolchain: "latexmk" | "pdflatex" | null | undefined;

export function detectToolchain(): "latexmk" | "pdflatex" | null {
  if (_cachedToolchain !== undefined) return _cachedToolchain;
  for (const bin of ["latexmk", "pdflatex"] as const) {
    const probe = spawnSync(bin, ["--version"], { encoding: "utf8", shell: process.platform === "win32" });
    if (probe.status === 0) {
      _cachedToolchain = bin;
      return bin;
    }
  }
  _cachedToolchain = null;
  return null;
}

/**
 * Detect whether the body is a TikZ/pgfplots/circuitikz picture — those
 * work best in standalone class (which crops to the picture bbox).
 * Math environments (equation, align, gather, …) work better in article
 * with \pagestyle{empty} — standalone can struggle with float-based envs.
 */
function isTikzLike(body: string): boolean {
  return (
    /\\begin\{tikzpicture\}/.test(body) ||
    /\\begin\{circuitikz\}/.test(body) ||
    /\\begin\{forest\}/.test(body) ||
    /\\begin\{ganttchart\}/.test(body)
  );
}

function buildStandaloneDocument(body: string, opts: CompileOptions): string {
  const packages = opts.packages ?? [];
  const usepackages = packages.map(p => {
    const o = PACKAGE_OPTIONS[p];
    return o ? `\\usepackage[${o}]{${p}}` : `\\usepackage{${p}}`;
  });
  const extra: string[] = [...(opts.preamble ?? [])];
  if (packages.includes("pgfplots") && !extra.some(l => l.includes("pgfplotsset"))) {
    extra.push("\\pgfplotsset{compat=1.18}");
  }

  const docclass = isTikzLike(body)
    ? "\\documentclass[border=5pt]{standalone}"
    : "\\documentclass{article}\n\\pagestyle{empty}";

  return [
    docclass,
    ...usepackages,
    ...extra,
    "\\begin{document}",
    body,
    "\\end{document}",
    "",
  ].join("\n");
}

function extractErrors(log: string): string[] {
  return log
    .split(/\r?\n/)
    .filter(line => line.startsWith("!") || /^l\.\d+/.test(line) || /Undefined control sequence/.test(line))
    .slice(0, 20);
}

/**
 * Compiles a LaTeX fragment in an isolated temp dir using a standalone
 * document. Returns ok=false with the relevant log lines on failure.
 * When no TeX toolchain is present, returns toolchainAvailable=false so
 * callers (tests) can skip rather than fail.
 */
export function compileLatexFragment(body: string, opts: CompileOptions = {}): CompileResult {
  const engine = opts.engine ?? detectToolchain();
  if (!engine) {
    return { ok: false, toolchainAvailable: false, log: "", errors: ["No LaTeX toolchain (latexmk/pdflatex) found on PATH."] };
  }

  const dir = mkdtempSync(join(tmpdir(), "texisstudio-compile-"));
  const texPath = join(dir, "figure.tex");
  const pdfPath = join(dir, "figure.pdf");
  const logPath = join(dir, "figure.log");

  try {
    writeFileSync(texPath, buildStandaloneDocument(body, opts), "utf8");

    const args = engine === "latexmk"
      ? ["-pdf", "-interaction=nonstopmode", "-halt-on-error", "-output-directory=" + dir, texPath]
      : ["-interaction=nonstopmode", "-halt-on-error", "-output-directory=" + dir, texPath];

    const run = spawnSync(engine, args, {
      cwd: dir,
      encoding: "utf8",
      timeout: opts.timeoutMs ?? 60_000,
      shell: process.platform === "win32",
    });

    const log = existsSync(logPath) ? readFileSync(logPath, "utf8") : (run.stdout ?? "") + (run.stderr ?? "");
    const producedPdf = existsSync(pdfPath);
    const pdfBytes = producedPdf ? readFileSync(pdfPath).length : 0;

    if (producedPdf && pdfBytes > 0) {
      return { ok: true, toolchainAvailable: true, pdfBytes, log, errors: [] };
    }
    return { ok: false, toolchainAvailable: true, log, errors: extractErrors(log) };
  } finally {
    try { rmSync(dir, { recursive: true, force: true }); } catch { /* best effort */ }
  }
}
