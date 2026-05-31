import { describe, it, expect } from "vitest";
import { validateLatexStructure } from "../../../visual-plugins/common/latex/structural-validator.js";

describe("validateLatexStructure", () => {
  it("accepts correct equation environment", () => {
    const r = validateLatexStructure("\\begin{equation}\n  E = mc^2\n\\end{equation}");
    expect(r.valid).toBe(true);
  });

  it("detects literal \\n bug", () => {
    // This is the class of bug found in biology-plugins.ts (\\\\n=200 style)
    const r = validateLatexStructure("Enrollment\\n=200");
    expect(r.valid).toBe(false);
    expect(r.issues.some(i => i.code === "LITERAL_NEWLINE")).toBe(true);
  });

  it("detects unclosed brace", () => {
    const r = validateLatexStructure("\\frac{1}{2");
    expect(r.valid).toBe(false);
    expect(r.issues.some(i => i.code === "BRACE_OVERFLOW")).toBe(true);
  });

  it("detects unmatched closing brace", () => {
    const r = validateLatexStructure("\\frac{1}}");
    expect(r.valid).toBe(false);
    expect(r.issues.some(i => i.code === "BRACE_UNDERFLOW")).toBe(true);
  });

  it("detects unclosed environment", () => {
    const r = validateLatexStructure("\\begin{tikzpicture}  \\draw (0,0) -- (1,1);");
    expect(r.valid).toBe(false);
    expect(r.issues.some(i => i.code === "ENV_UNCLOSED")).toBe(true);
  });

  it("detects environment nesting mismatch", () => {
    const r = validateLatexStructure("\\begin{align}\n  x &= 1\n\\end{equation}");
    expect(r.valid).toBe(false);
    expect(r.issues.some(i => i.code === "ENV_MISMATCH")).toBe(true);
  });

  it("detects unbalanced inline math", () => {
    const r = validateLatexStructure("The value is $x = 1 and $y = 2$ fine.");
    // 3 dollars = odd = unbalanced
    expect(r.issues.some(i => i.code === "UNBALANCED_MATH")).toBe(true);
  });

  it("rejects empty output", () => {
    const r = validateLatexStructure("   ");
    expect(r.valid).toBe(false);
    expect(r.issues.some(i => i.code === "EMPTY_OUTPUT")).toBe(true);
  });

  it("accepts nested environments", () => {
    const tex = [
      "\\begin{figure}[htbp]",
      "  \\begin{tikzpicture}",
      "    \\draw (0,0) -- (1,1);",
      "  \\end{tikzpicture}",
      "\\end{figure}",
    ].join("\n");
    const r = validateLatexStructure(tex);
    expect(r.valid).toBe(true);
  });
});
