import { describe, expect, it } from "vitest";
import {
  DOCUMENT_CONTRIBUTION_VERSION,
  validateDocumentContribution,
  type DocumentContribution,
} from "../../../visual-plugins/common/contracts/contribution.js";

function contribution(
  overrides: Partial<DocumentContribution> = {},
): DocumentContribution {
  return {
    contractVersion: DOCUMENT_CONTRIBUTION_VERSION,
    contributionId: "fig_0001",
    pluginId: "professional-chart",
    engineId: "pgfplots-engine",
    trust: "official",
    artifactLatex:
      "\\begin{figure}\\input{texisstudio-assets/figures/fig_0001/output.tex}\\end{figure}",
    requiredPackages: ["pgfplots"],
    editableSource: "{}",
    assets: [
      {
        role: "latex",
        path: "texisstudio-assets/figures/fig_0001/output.tex",
      },
    ],
    warnings: [],
    ...overrides,
  };
}

describe("DocumentContribution 2.0", () => {
  it("accepts a traced, project-owned artifact", () => {
    expect(validateDocumentContribution(contribution())).toEqual({
      valid: true,
      issues: [],
    });
  });

  it("rejects preamble mutation and path traversal", () => {
    const result = validateDocumentContribution(
      contribution({
        artifactLatex: "\\usepackage{shellesc}\\input{../secret.tex}",
      }),
    );

    expect(result.valid).toBe(false);
    expect(result.issues.map((issue) => issue.code)).toContain("PREAMBLE_MUTATION");
    expect(result.issues.map((issue) => issue.code)).toContain("UNSAFE_LATEX_PATH");
  });

  it("rejects undeclared assets and missing editable source", () => {
    const result = validateDocumentContribution(
      contribution({
        artifactLatex: "\\input{texisstudio-assets/figures/fig_0002/output.tex}",
        editableSource: "",
      }),
    );

    expect(result.valid).toBe(false);
    expect(result.issues.map((issue) => issue.code)).toContain("UNDECLARED_ASSET");
    expect(result.issues.map((issue) => issue.code)).toContain(
      "EDITABLE_SOURCE_REQUIRED",
    );
  });
});
