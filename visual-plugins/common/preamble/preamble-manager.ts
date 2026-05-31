/**
 * Preamble package management (plan §5.7).
 *
 * Detects which required LaTeX packages are already present in a document
 * preamble and computes the minimal set of \usepackage lines to add —
 * never duplicating an existing package, and honoring the option strings
 * that specific packages require (e.g. mhchem version=4).
 */

const PACKAGE_OPTIONS: Record<string, string> = {
  mhchem: "version=4",
};

const PACKAGE_EXTRA_SETUP: Record<string, string[]> = {
  pgfplots: ["\\pgfplotsset{compat=1.18}"],
};

const USEPACKAGE_RE = /\\usepackage(?:\[[^\]]*\])?\{([^}]*)\}/g;

/** Returns the set of package names already declared in a preamble/document. */
export function detectPackages(documentSource: string): Set<string> {
  const found = new Set<string>();
  let m: RegExpExecArray | null;
  USEPACKAGE_RE.lastIndex = 0;
  while ((m = USEPACKAGE_RE.exec(documentSource))) {
    for (const name of m[1]!.split(",")) {
      const trimmed = name.trim();
      if (trimmed) found.add(trimmed);
    }
  }
  return found;
}

export interface PreambleAddition {
  /** Packages that were missing and should be added. */
  missing: string[];
  /** Ready-to-insert \usepackage lines (with options) plus required setup. */
  lines: string[];
  /** Human-readable, jargon-free message for the user (plan §5.11). */
  userMessage: string | null;
}

/**
 * Given the packages a figure needs and the current document, returns the
 * lines to insert. Idempotent: packages already present are skipped.
 */
export function computePreambleAdditions(required: readonly string[], documentSource: string): PreambleAddition {
  const present = detectPackages(documentSource);
  const missing = [...new Set(required)].filter(pkg => !present.has(pkg));

  const lines: string[] = [];
  for (const pkg of missing) {
    const opt = PACKAGE_OPTIONS[pkg];
    lines.push(opt ? `\\usepackage[${opt}]{${pkg}}` : `\\usepackage{${pkg}}`);
    for (const setup of PACKAGE_EXTRA_SETUP[pkg] ?? []) {
      if (!documentSource.includes(setup)) lines.push(setup);
    }
  }

  let userMessage: string | null = null;
  if (missing.length === 1) {
    userMessage = `Esta figura necesita el paquete LaTeX "${missing[0]}". ¿Deseas agregarlo al preámbulo del documento?`;
  } else if (missing.length > 1) {
    userMessage = `Esta figura necesita los paquetes LaTeX ${missing.map(p => `"${p}"`).join(", ")}. ¿Deseas agregarlos al preámbulo del documento?`;
  }

  return { missing, lines, userMessage };
}

/**
 * Inserts the missing package lines just before \begin{document}.
 * Returns the document unchanged if nothing is missing.
 */
export function applyPreambleAdditions(documentSource: string, required: readonly string[]): string {
  const { lines } = computePreambleAdditions(required, documentSource);
  if (lines.length === 0) return documentSource;

  const marker = "\\begin{document}";
  const idx = documentSource.indexOf(marker);
  if (idx === -1) {
    // No document body marker; prepend to be safe.
    return lines.join("\n") + "\n" + documentSource;
  }
  return documentSource.slice(0, idx) + lines.join("\n") + "\n" + documentSource.slice(idx);
}
