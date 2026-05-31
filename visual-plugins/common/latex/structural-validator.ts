import type { ValidationResult, ValidationIssue } from "../contracts/types.js";

/**
 * Fast, dependency-free structural validation of generated LaTeX.
 * Catches the classes of bug that would otherwise only surface at
 * compile time: unbalanced braces, unbalanced environments, stray
 * literal newlines emitted as text, and unescaped specials.
 *
 * This runs in every test and before every insert — it is the first
 * line of defense for the plan's quality criterion #2 (compile stability)
 * without paying the cost of a full TeX run.
 */

// A literal "\n" (backslash + n) followed by a non-letter is almost always
// a JS template-string mistake: the author meant a newline or "\\" line break
// but wrote "\\n" which LaTeX renders as the command \n (undefined) or, when
// followed by a digit, as garbage text. Real LaTeX line breaks are "\\".
const LITERAL_BACKSLASH_N = /\\n(?![a-zA-Z])/;

function countUnescaped(source: string, char: string): number {
  let count = 0;
  for (let i = 0; i < source.length; i++) {
    if (source[i] === char && source[i - 1] !== "\\") count++;
  }
  return count;
}

function checkBraceBalance(source: string): ValidationIssue | null {
  let depth = 0;
  for (let i = 0; i < source.length; i++) {
    if (source[i] === "{" && source[i - 1] !== "\\") depth++;
    else if (source[i] === "}" && source[i - 1] !== "\\") depth--;
    if (depth < 0) {
      return { code: "BRACE_UNDERFLOW", message: "Unbalanced braces: a closing '}' has no matching '{'.", severity: "error" };
    }
  }
  if (depth > 0) {
    return { code: "BRACE_OVERFLOW", message: `Unbalanced braces: ${depth} '{' left unclosed.`, severity: "error" };
  }
  return null;
}

function checkEnvironmentBalance(source: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const beginRe = /\\begin\{([^}]+)\}/g;
  const endRe = /\\end\{([^}]+)\}/g;
  const stack: string[] = [];

  // Walk tokens in document order so we detect mismatched nesting, not just counts.
  const tokens: Array<{ kind: "begin" | "end"; name: string; index: number }> = [];
  let m: RegExpExecArray | null;
  while ((m = beginRe.exec(source))) tokens.push({ kind: "begin", name: m[1]!, index: m.index });
  while ((m = endRe.exec(source))) tokens.push({ kind: "end", name: m[1]!, index: m.index });
  tokens.sort((a, b) => a.index - b.index);

  for (const t of tokens) {
    if (t.kind === "begin") {
      stack.push(t.name);
    } else {
      const top = stack.pop();
      if (top === undefined) {
        issues.push({ code: "ENV_UNDERFLOW", message: `\\end{${t.name}} has no matching \\begin.`, severity: "error" });
      } else if (top !== t.name) {
        issues.push({ code: "ENV_MISMATCH", message: `Environment nesting mismatch: \\begin{${top}} closed by \\end{${t.name}}.`, severity: "error" });
      }
    }
  }
  for (const unclosed of stack) {
    issues.push({ code: "ENV_UNCLOSED", message: `Environment \\begin{${unclosed}} is never closed.`, severity: "error" });
  }
  return issues;
}

export function validateLatexStructure(source: string): ValidationResult {
  const issues: ValidationIssue[] = [];

  if (!source || source.trim().length === 0) {
    return { valid: false, issues: [{ code: "EMPTY_OUTPUT", message: "Generated LaTeX is empty.", severity: "error" }] };
  }

  if (LITERAL_BACKSLASH_N.test(source)) {
    issues.push({
      code: "LITERAL_NEWLINE",
      message: 'Found literal "\\n" in output. For a LaTeX line break use "\\\\"; for a real newline use an actual line break in the template.',
      severity: "error",
    });
  }

  const brace = checkBraceBalance(source);
  if (brace) issues.push(brace);

  issues.push(...checkEnvironmentBalance(source));

  const dollars = countUnescaped(source, "$");
  if (dollars % 2 !== 0) {
    issues.push({ code: "UNBALANCED_MATH", message: "Odd number of '$' delimiters — inline math is not balanced.", severity: "error" });
  }

  return { valid: issues.filter(i => i.severity === "error").length === 0, issues };
}
