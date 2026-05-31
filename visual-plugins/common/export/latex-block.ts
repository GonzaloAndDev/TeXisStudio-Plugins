export interface LatexBlockOptions {
  figureId: string;
  inputPath?: string;
  graphicsPath?: string;
  caption: string;
  label: string;
  placement?: string;
  width?: string;
}

export function buildLatexInputBlock(opts: LatexBlockOptions): string {
  const placement = opts.placement ?? "htbp";
  return [
    `% texisstudio-figure-id: ${opts.figureId}`,
    `\\begin{figure}[${placement}]`,
    `    \\centering`,
    `    \\input{${opts.inputPath}}`,
    `    \\caption{${opts.caption}}`,
    `    \\label{${opts.label}}`,
    `\\end{figure}`,
    `% /texisstudio-figure-id`,
  ].join("\n");
}

export function buildLatexGraphicsBlock(opts: LatexBlockOptions): string {
  const placement = opts.placement ?? "htbp";
  const width = opts.width ?? "0.85\\textwidth";
  return [
    `% texisstudio-figure-id: ${opts.figureId}`,
    `\\begin{figure}[${placement}]`,
    `    \\centering`,
    `    \\includegraphics[width=${width}]{${opts.graphicsPath}}`,
    `    \\caption{${opts.caption}}`,
    `    \\label{${opts.label}}`,
    `\\end{figure}`,
    `% /texisstudio-figure-id`,
  ].join("\n");
}

export function buildInlineEquationBlock(figureId: string, latex: string): string {
  return [
    `% texisstudio-figure-id: ${figureId}`,
    `\\begin{equation}`,
    `    ${latex}`,
    `\\end{equation}`,
    `% /texisstudio-figure-id`,
  ].join("\n");
}

export function buildDisplayMathBlock(figureId: string, latex: string): string {
  return [
    `% texisstudio-figure-id: ${figureId}`,
    `\\[`,
    `    ${latex}`,
    `\\]`,
    `% /texisstudio-figure-id`,
  ].join("\n");
}

/**
 * Wraps already-complete LaTeX (e.g. an mhchem line or a full environment)
 * in ID markers without adding any surrounding environment.
 */
export function buildRawBlock(figureId: string, latex: string): string {
  return [
    `% texisstudio-figure-id: ${figureId}`,
    latex,
    `% /texisstudio-figure-id`,
  ].join("\n");
}
