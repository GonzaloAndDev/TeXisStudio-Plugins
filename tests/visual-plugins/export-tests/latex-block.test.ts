import { describe, it, expect } from "vitest";
import {
  buildLatexInputBlock,
  buildLatexGraphicsBlock,
  buildInlineEquationBlock,
} from "../../../visual-plugins/common/export/latex-block.js";

describe("buildLatexInputBlock", () => {
  it("produces a valid LaTeX figure block", () => {
    const result = buildLatexInputBlock({
      figureId: "fig_0001",
      inputPath: "texisstudio-assets/figures/fig_0001/output.tex",
      caption: "Circuito equivalente.",
      label: "fig:circuito-equivalente",
    });
    expect(result).toContain("% texisstudio-figure-id: fig_0001");
    expect(result).toContain("% /texisstudio-figure-id");
    expect(result).toContain("\\begin{figure}[htbp]");
    expect(result).toContain("\\input{texisstudio-assets/figures/fig_0001/output.tex}");
    expect(result).toContain("\\caption{Circuito equivalente.}");
    expect(result).toContain("\\label{fig:circuito-equivalente}");
  });

  it("uses custom placement when provided", () => {
    const result = buildLatexInputBlock({
      figureId: "fig_0002",
      inputPath: "path/to/file.tex",
      caption: "Test.",
      label: "fig:test",
      placement: "p",
    });
    expect(result).toContain("\\begin{figure}[p]");
  });
});

describe("buildLatexGraphicsBlock", () => {
  it("produces a valid includegraphics block", () => {
    const result = buildLatexGraphicsBlock({
      figureId: "fig_0002",
      graphicsPath: "texisstudio-assets/figures/fig_0002/output.pdf",
      caption: "Arquitectura del sistema.",
      label: "fig:arquitectura",
    });
    expect(result).toContain("\\includegraphics[width=0.85\\textwidth]");
    expect(result).toContain("fig_0002");
  });
});

describe("buildInlineEquationBlock", () => {
  it("wraps equation in equation environment", () => {
    const result = buildInlineEquationBlock("fig_0003", "E = mc^2");
    expect(result).toContain("\\begin{equation}");
    expect(result).toContain("E = mc^2");
    expect(result).toContain("% texisstudio-figure-id: fig_0003");
  });
});
