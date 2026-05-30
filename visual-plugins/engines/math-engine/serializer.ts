import type { MathNode, MathMode, MatrixDelimiter } from "./types.js";

const MATRIX_DELIMITERS: Record<MatrixDelimiter, [string, string]> = {
  paren:   ["\\begin{pmatrix}", "\\end{pmatrix}"],
  bracket: ["\\begin{bmatrix}", "\\end{bmatrix}"],
  brace:   ["\\begin{Bmatrix}", "\\end{Bmatrix}"],
  vert:    ["\\begin{vmatrix}", "\\end{vmatrix}"],
  none:    ["\\begin{matrix}",  "\\end{matrix}"],
};

export function serializeNode(node: MathNode): string {
  switch (node.type) {
    case "symbol":
    case "operator":
      return node.content;

    case "text":
      return `\\text{${node.content}}`;

    case "group": {
      const inner = (node.children ?? []).map(serializeNode).join(" ");
      return `{${inner}}`;
    }

    case "fraction": {
      const [num, den] = node.children ?? [];
      return `\\frac{${num ? serializeNode(num) : ""}}{${den ? serializeNode(den) : ""}}`;
    }

    case "sqrt": {
      const radicand = node.children?.[0];
      const index = node.options?.["index"] as string | undefined;
      if (index) return `\\sqrt[${index}]{${radicand ? serializeNode(radicand) : ""}}`;
      return `\\sqrt{${radicand ? serializeNode(radicand) : ""}}`;
    }

    case "sum": {
      const lower = node.options?.["lower"] as string ?? "";
      const upper = node.options?.["upper"] as string ?? "";
      const body = node.children?.[0];
      return `\\sum_{${lower}}^{${upper}} ${body ? serializeNode(body) : ""}`;
    }

    case "integral": {
      const lower = node.options?.["lower"] as string ?? "";
      const upper = node.options?.["upper"] as string ?? "";
      const body = node.children?.[0];
      const diff = node.options?.["diff"] as string ?? "";
      return `\\int_{${lower}}^{${upper}} ${body ? serializeNode(body) : ""} \\, ${diff}`;
    }

    case "limit": {
      const variable = node.options?.["variable"] as string ?? "x";
      const to = node.options?.["to"] as string ?? "\\infty";
      const body = node.children?.[0];
      return `\\lim_{${variable} \\to ${to}} ${body ? serializeNode(body) : ""}`;
    }

    case "matrix": {
      const delimiter = (node.options?.["delimiter"] as MatrixDelimiter) ?? "paren";
      const rows = node.options?.["rows"] as number ?? 2;
      const cols = node.options?.["cols"] as number ?? 2;
      const cells = node.options?.["cells"] as string[][] ?? Array.from({ length: rows }, () => Array(cols).fill("0"));
      const [open, close] = MATRIX_DELIMITERS[delimiter];
      const body = cells.map(row => row.join(" & ")).join(" \\\\\n    ");
      return `${open}\n    ${body}\n${close}`;
    }

    case "cases": {
      const cases = node.options?.["cases"] as Array<{ expr: string; cond: string }> ?? [];
      const body = cases.map(c => `${c.expr} & ${c.cond}`).join(" \\\\\n    ");
      return `\\begin{cases}\n    ${body}\n\\end{cases}`;
    }

    default:
      return node.content;
  }
}

export function wrapInEnvironment(body: string, mode: MathMode, numbered: boolean, label?: string): string {
  const labelStr = label ? `\\label{${label}}\n` : "";

  switch (mode) {
    case "inline":
      return `$${body}$`;

    case "display":
      return `\\[\n  ${body}\n\\]`;

    case "equation":
      return numbered
        ? `\\begin{equation}\n${labelStr}  ${body}\n\\end{equation}`
        : `\\begin{equation*}\n  ${body}\n\\end{equation*}`;

    case "align":
      return numbered
        ? `\\begin{align}\n${labelStr}  ${body}\n\\end{align}`
        : `\\begin{align*}\n  ${body}\n\\end{align*}`;

    case "gather":
      return numbered
        ? `\\begin{gather}\n${labelStr}  ${body}\n\\end{gather}`
        : `\\begin{gather*}\n  ${body}\n\\end{gather*}`;

    case "cases":
    case "matrix":
      return `\\[\n  ${body}\n\\]`;

    case "system":
      return numbered
        ? `\\begin{align}\n${labelStr}  ${body}\n\\end{align}`
        : `\\begin{align*}\n  ${body}\n\\end{align*}`;

    default:
      return body;
  }
}
